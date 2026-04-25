import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { FiFileText } from "react-icons/fi";

export default function AssignedTasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data, error } = await supabase
          .from("tasks")
          .select(`*,
        task_files (*)`)
          .eq("assigned_to", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.log(error);
          return;
        }

        setTasks(data || []);
        setLoading(false);
        console.log(data);
      } catch (error) {
        console.log(error);

      }
    };

    fetchTasks();
  }, []);

  const handleStatusChange = (taskId: string, value: string) => {
    setTasks(tasks.map(t =>
      t.id === taskId ? { ...t, status: value } : t
    ));
  };

  const updateStatus = async (taskId: string, status: string) => {
    try {
      const { error } = await supabase
      .from("tasks")
      .update({ status })
      .eq("id", taskId);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Status updated");

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status } : t
      )
    );
    } catch (error) {
      console.log(error);
      
    }
    
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center gap-1 min-h-screen">
        <p className="text-teal-500 font-semibold text-lg">Fetching tasks...</p>
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-[#F7F9FA]">
      <h1 className="text-2xl font-bold text-[#1e4945]">My Tasks</h1>

      {tasks.length === 0 ? (
        <div className="text-center py-16 border border-[#E5E7EB] rounded-lg bg-[#EEF3F3]">
          <p className="text-[#6B7280] text-lg">No Tasks!</p>
          <p className="text-[#9CA3AF] text-sm mt-1">
            No tasks assigned to you
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <Card key={task.id} className="shadow-sm border-[#E5E7EB]">
              <CardHeader>
                <CardTitle className="text-lg text-[#1e4945]">
                  {task.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                <p className="text-sm text-[#2c6c66]">
                  {task.description || "No description"}
                </p>

                <p className="text-xs text-[#408c84]">
                  Code: {task.task_code}
                </p>

                <div>
                  <p className="text-sm mb-1 text-[#1e4945]">Status</p>
                  <Select
                    value={task.status}
                    onValueChange={(value) => handleStatusChange(task.id, value)}
                  >

                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="text-[#2a655f]">
                      <SelectItem value="To Do">To Do</SelectItem>
                      <SelectItem value="In Progress">
                        In Progress
                      </SelectItem>
                      <SelectItem value="Completed">
                        Completed
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="text-xs text-[#408c84] space-y-1">
                  <p>Created: {new Date(task.created_at).toLocaleDateString([],)}</p>

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

                <Button
                  className="w-full mt-2 bg-[#42857f] hover:bg-[#5b9b96] text-white"
                  onClick={() =>
                    updateStatus(task.id, task.status)
                  }
                >
                  Update Status
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}