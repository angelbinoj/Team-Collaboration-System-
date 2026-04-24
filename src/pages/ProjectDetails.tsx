import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { IoIosArrowRoundForward } from "react-icons/io";
import TaskSection from "@/components/TaskSection";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");


  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.log(error);
      return;
    }

    setProject(data);
    setName(data?.name || "");
    setDesc(data?.description || "");

    } catch (error) {
      console.log(error);    
    }
    
  };


  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
      .from("tasks")
      .select(`
        *,
        task_files (*)
      `)
      .eq("project_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
      return;
    }

    setTasks(data || []);

    } catch (error) {
      console.log(error);
      
    }
    
  };


  const fetchUsers = async () => {
    try {
       const { data, error } = await supabase
      .from("profiles")
      .select("id, name");

    if (error) {
      console.log(error);
      return;
    }
    setUsers(data || []);

    } catch (error) {
      console.log(error);    
    }
  };

  useEffect(() => {
    if (!id) return;

    fetchProject();
    fetchTasks();
    fetchUsers();
  }, [id]);


  const handleUpdate = async () => {
    try {
      const { error } = await supabase
      .from("projects")
      .update({ name, description: desc })
      .eq("id", id);

    if (error) {
      console.log(error);
      return;
    }

    } catch (error) {
      console.log(error);    
    }
    
    fetchProject();
  };

 
  const handleDelete = async () => {
    const confirmDelete = confirm(
      "Are you sure? All tasks will also be deleted."
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id);

    if (error) {
      console.log(error);
      return;
    }

    navigate("/projects");
  };

  if (!project) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#F7F9FA] p-6 space-y-6">

      <Card className="bg-white border border-[#E5E7EB]">
        <CardContent className="p-5 space-y-3">
    
          <p className="text-sm text-[#6FA8A3] font-medium">
            {project.project_code}
          </p>

          <h2 className="text-2xl font-semibold text-[#2c6c66]">
            {project.name}
          </h2>

          <p className="text-[#6B7280]">
            {project.description || "No description"}
          </p>

          <div className="flex items-center gap-2 text-sm text-[#7f9bac]">
            <span>{project.start_date}</span>
            <IoIosArrowRoundForward className="text-2xl" />
            <span>{project.end_date}</span>
          </div>

          <div className="flex gap-3 pt-2">

            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-[#66a19c] hover:bg-[#6FA8A3] text-white">
                  Update
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-[#1e4945]">
                    Update Project
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-3">
                  <Input
                    value={name}
                    className="bg-[#EEF3F3]"
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Project name"
                  />

                  <Textarea
                    value={desc}
                    className="bg-[#EEF3F3]"
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Description"
                  />

                  <div className="flex gap-2">
                    <DialogClose asChild>
                      <Button variant="outline" className="flex-1 bg-slate-700 text-white hover:bg-slate-600 hover:text-white">
                        Cancel
                      </Button>
                    </DialogClose>

                    <DialogClose asChild>
                      <Button
                        onClick={handleUpdate}
                        className="flex-1 bg-[#4a837f] hover:bg-[#5d9d97] text-white"
                      >
                        Save
                      </Button>
                    </DialogClose>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-400 text-white"
            >
              Delete
            </Button>

          </div>
        </CardContent>
      </Card>

      <TaskSection
        projectId={id as string}
        tasks={tasks}
        users={users}
        refresh={fetchTasks}
      />

    </div>
  );
}