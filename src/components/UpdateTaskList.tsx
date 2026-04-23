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

type Props = {
  task: any;
  refresh: () => void;
};

export default function UpdateTaskList({ task, refresh }: Props) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState(task.status);
  const [assignedTo, setAssignedTo] = useState(task.assigned_to);
  const [files, setFiles] = useState<FileList | null>(null);

  // ✅ File validation
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
    if (!title) {
      toast.error("Title required");
      return;
    }

    // ✅ Update task
    const { error } = await supabase.rpc("update_tasks", {
      tid: task.id,
      t: title,
      d: description,
      s: status,
      a:assignedTo
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    // ✅ Upload files
    if (files) {
      for (let file of Array.from(files)) {
        if (!validateFile(file)) continue;

        const path = `${task.id}/${Date.now()}-${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from("task-files")
          .upload(path, file);

        if (uploadError) {
          console.log(uploadError);
          continue;
        }

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
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex bg-orange-400 text-white hover:bg-orange-300">
          Update
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">

          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <Input
            type="file"
            multiple
            onChange={(e) => setFiles(e.target.files)}
          />

          <div className="flex gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="flex-1">
                Cancel
              </Button>
            </DialogClose>

            <DialogClose asChild>
              <Button onClick={handleUpdate} className="flex-1">
                Save
              </Button>
            </DialogClose>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}