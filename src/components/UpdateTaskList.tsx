import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { FiFileText } from "react-icons/fi";

type Props = {
  task: any;
  users: any
  refresh: () => void;
};

export default function UpdateTaskList({ task, users, refresh }: Props) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState(task.status);
  const [assignedTo, setAssignedTo] = useState(task.assigned_to);
  const [files, setFiles] = useState<FileList | null>(null);

  const validateFile = (file: File) => {
    const allowed = ["image/png", "image/jpeg", "application/pdf"];

    if (!allowed.includes(file.type)) {
      toast.error("Only PNG, JPEG, PDF allowed");
      return false;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File must be < 2MB");
      return false;
    }

    return true;
  };

  const handleUpdate = async () => {
    try {
      if (!title) {
        toast.error("Title required");
        return;
      }
      console.log(assignedTo);

      const { data, error } = await supabase.rpc("update_tasks", {
        tid: task.id,
        t: title,
        d: description,
        s: status,
        a: assignedTo
      });

      if (error) {
        toast.error(error.message);
        return;
      }
      console.log(data);


      if (files) {
        for (let file of Array.from(files)) {
          if (!validateFile(file)) continue;

          const path = `tasks/${task.id}/${crypto.randomUUID()}`;

          const { data: uploaded, error: uploadError } = await supabase.storage
            .from("task-files")
            .upload(path, file);

          if (uploadError) {
            console.log(uploadError);
            continue;
          }
          console.log(uploaded);


          const { data } = supabase.storage
            .from("task-files")
            .getPublicUrl(path);

          await supabase.from("task_files").insert({
            task_id: task.id,
            file_url: data.publicUrl,
            file_name: file.name,
          });
        }
      }

      toast.success("Task updated");
      refresh();
    } catch (error) {
      console.log(error);

    }

  };

  return (
    <Dialog >
      <DialogTrigger asChild>
        <Button className="flex bg-orange-400 text-white hover:bg-orange-300">
          Update
        </Button>
      </DialogTrigger>

      <DialogContent className="">
        <DialogHeader>
          <DialogTitle className="text-[#1e4945]">Update Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">

          <Input
            value={title}
            className="bg-[#EEF3F3] "
            onChange={(e) => setTitle(e.target.value)}
          />

          <Textarea
            value={description}
            className="bg-[#EEF3F3] "
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex gap-1 items-center">
            <h1 className="w-32 text-[#1e4945">Status</h1>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border p-2 rounded w-full bg-[#EEF3F3] "
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="flex gap-1 items-center">
            <h1 className="w-32 text-[#1e4945">Assigned To</h1>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="border p-2 rounded w-full bg-[#EEF3F3] "
            >
              {users.map((u: any) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="text-sm text-[#1e4945] mb-1">Attachments</p>

            {task.task_files && task.task_files.length > 0 ? (
              <div className="flex flex-col gap-2">
                {task.task_files.map((file: any) => (
                  <a
                    key={file.id}
                    href={file.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-xs underline flex items-center"
                  >
                    <FiFileText /><span>{file.file_name}</span>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400">No attachments</p>
            )}
          </div>

          <Input
            type="file"
            multiple
            className="bg-[#EEF3F3] "
            onChange={(e) => setFiles(e.target.files)}
          />

          <div className="flex gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="flex-1 bg-[#6a6969] hover:bg-slate-500 hover:text-white text-white">
                Cancel
              </Button>
            </DialogClose>

            <DialogClose asChild>
              <Button onClick={handleUpdate} className="flex-1 bg-[#518585] hover:bg-[#5fa2a2] ">
                Save
              </Button>
            </DialogClose>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}