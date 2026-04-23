import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { User } from "@supabase/supabase-js";

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
 const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();
  
  const fetchProjects = async () => {    
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("created_by",user?.id)
      .order("created_at", { ascending: false });
      
      setUser(user);
    setProjects(data || []);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async () => {
    if (!name || !startDate || !endDate) {
      alert("Fill all required fields");
      return;
    }

    if (endDate < startDate) {
      alert("End date cannot be before start date");
      return;
    }


    const { error } = await supabase.rpc("create_project", {
      n: name,
      d: desc,
      sd: startDate,
      ed: endDate,
      c: user?.id,
    });

    if (error) {
      console.log(error);
      alert("Error creating project");
      return;
    }

    setName("");
    setDesc("");
    setStartDate("");
    setEndDate("");

    fetchProjects();
  };

  return (
    <div className="min-h-screen bg-[#F7F9FA] p-6 space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-[#1e4945]">
          Projects
        </h1>
      </div>

      {/* Create Project */}
      <Card className="bg-white border border-[#E5E7EB] shadow-sm">
        <CardContent className="p-4 space-y-4">
          <h2 className="text-lg font-medium text-[#1e4945]">
            Create New Project
          </h2>

          <div className="grid gap-3">

            <div className="flex flex-col gap-2">
              <Label className="text-[#1e4945]">Project Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter project name"
                className="border-[#E5E7EB] focus-visible:ring-[#a3d1ce]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-[#1e4945]">Description</Label>
              <Textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Enter description"
                className="border-[#E5E7EB] focus-visible:ring-[#a3d1ce]"
              />
            </div>

            <div className="flex gap-6">
              <div className="w-full flex flex-col gap-2">
                <Label className="text-[#1e4945]">Start Date</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border-[#E5E7EB] focus-visible:ring-[#a3d1ce]"
                />
              </div>

              <div className="w-full flex flex-col gap-2">
                <Label className="text-[#1e4945]">End Date</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border-[#E5E7EB] focus-visible:ring-[#a3d1ce]"
                />
              </div>
            </div>

            <Button
              onClick={handleCreate}
              className="w-fit bg-[#6FA8A3] hover:bg-[#5c918d] text-white"
            >
              Create Project +
            </Button>

          </div>
        </CardContent>
      </Card>

      {/* Project List */}
      {projects.length === 0 ? (
        <div className="text-center py-16 border border-[#E5E7EB] rounded-lg bg-[#EEF3F3]">
          <p className="text-[#6B7280] text-lg">No projects yet</p>
          <p className="text-[#9CA3AF] text-sm mt-1">
            Create your first project to get started
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <Card
              key={p.id}
              onClick={() => navigate(`/projects/${p.id}`)}
              className="cursor-pointer bg-white border border-[#E5E7EB] hover:shadow-md hover:border-[#6FA8A3] transition"
            >
              <CardContent className="p-4 space-y-2">

                {/* Project Code */}
                <p className="text-xs text-[#6FA8A3] font-medium">
                  {p.project_code}
                </p>

                {/* Name */}
                <h3 className="font-semibold text-lg text-[#1F2937]">
                  {p.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-[#6B7280] overflow-hidden text-ellipsis whitespace-nowrap">
                  {p.description || "No description"}
                </p>

                {/* Dates */}
                <div className="text-xs text-[#9CA3AF]">
                  {p.start_date} → {p.end_date}
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}