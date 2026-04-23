import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import UpdateTaskList from "./UpdateTaskList";

type Props = {
  projectId: string;
  tasks: any[];
  users: any[];
  refresh: () => void;
};

export default function TaskSection({
  projectId,
  tasks,
  users,
  refresh,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [status, setStatus] = useState("To Do");
  // ✅ Create task
  const handleCreate = async () => {
    if (!title) return alert("Title required");

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.rpc("create_task", {
      t: title,
      d: description,
      p: projectId,
      a: assignedTo || null,
      c: user?.id,
      s:status
    });

    if (error) {
      console.log(error);
      return;
    }

    // 🔥 Get latest task (simple approach)
    const { data: newTask } = await supabase
      .from("tasks")
      .select("id")
      .order("created_at", { ascending: false });

    setTitle("");
    setDescription("");
    setAssignedTo("");
    setStatus("To Do");

    refresh();
  };

useEffect(() => {
  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select(`
        *,
        task_files (*)
      `)
      .eq("project_id", projectId);

    if (error) {
      console.log(error);
      return;
    }
  };

  fetchTasks();
}, [projectId]);

  return (
    <div className="space-y-6">

      {/* 🔹 Create Task */}
      <Card className="bg-white border border-[#E5E7EB]">
        <CardContent className="p-4 space-y-4">

          <h2 className="text-lg font-medium text-[#1e4945]">
            Create Task
          </h2>

          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
          />

          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task description"
          />

          <div className="flex gap-4">

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border p-2 rounded w-full"
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="border p-2 rounded w-full"
            >
              <option value="">Assign user</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>

          </div>
          <Button
            onClick={handleCreate}
            className="bg-[#6FA8A3] text-white"
          >
            Create Task +
          </Button>

        </CardContent>
      </Card>

      {/* 🔹 Task List */}
      {tasks.length === 0 ? (
        <div className="text-center py-10 bg-[#EEF3F3] border rounded-lg">
          No tasks yet
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <Card key={task.id} className="bg-white border border-[#E5E7EB]">
              <CardContent className="p-4 space-y-2">

                <p className="text-xs text-[#6FA8A3]">
                  {task.task_code}
                </p>

                <h3 className="font-semibold">
                  {task.title}
                </h3>

                <p className="text-sm text-gray-500">
                  {task.description || "No description"}
                </p>

                <p className="text-xs text-gray-400">
                  {task.status}
                </p>

                <div className="mt-4 space-y-2">
            <h3 className="text-white font-semibold">Attachments</h3>

            {task.task_files?.length === 0 && (
              <p className="text-slate-200 italic text-sm">No attachments</p>
            )}
           {task.task_files?.map((file: any) => (
              <div key={file.id}>
                {file.file_name.endsWith(".pdf") ? (
                  <a
                    href={file.file_url}
                    target="_blank"
                    className="text-yellow-300 underline"
                  >
                    📄 {file.file_name}
                  </a>
                ) : (
                  <img
                    src={file.file_url}
                    alt="attachment"
                    className="w-32 rounded"
                  />
                )}
              </div>
            ))}
          </div>

                <div className="flex gap-2 pt-2">

                  <UpdateTaskList task={task}  refresh={refresh} />

                  <Button
                    onClick={async () => {
                      if (!confirm("Delete task?")) return;
                      await supabase
                        .from("tasks")
                        .delete()
                        .eq("id", task.id);
                      refresh();
                    }}
                    className="bg-red-500 text-white"
                  >
                    Delete
                  </Button>

                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      )}

    </div>
  );
}