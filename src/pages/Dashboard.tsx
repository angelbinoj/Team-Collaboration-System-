import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import avatar from "@/assets/avatar.jpg";
import { FiFilter } from "react-icons/fi";
import { Handshake } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>({});
  const [team, setTeam] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");

  const [assignedTaskCount, setAssignedTaskCount] = useState(0);
  const [projectCount, setProjectCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setUser(userData || {});


      const { data: users } = await supabase
        .from("profiles")
        .select("*");

      setTeam(users || []);

      const { data: taskData } = await supabase
        .from("tasks")
        .select("*")
        .or(`assigned_to.eq.${user.id},created_by.eq.${user.id}`)
        .order("created_at", { ascending: false });

      setTasks(taskData || []);


      const assigned = taskData?.filter(
        (t) => t.assigned_to === user.id
      );
      setAssignedTaskCount(assigned?.length || 0);


      const { count } = await supabase
        .from("projects")
        .select("*", { count: "exact" });

      setProjectCount(count || 0);
    };

    fetchData();
  }, []);


  const filteredTasks = tasks.filter((t) => {
    if (filter === "assigned") return t.assigned_to === user?.id;
    if (filter === "created") return t.created_by === user?.id;
    return true;
  });

  return (
    <div className="space-y-6">


      <Card className="bg-[#E6F2F1] border shadow-sm">
        <CardContent className="p-6">
          <h1 className="text-2xl font-semibold flex gap-2 text-[#1e4945]">
            <span>Welcome, {user?.name}</span>
            <Handshake />
          </h1>
          <p className="text-base text-[#6B7280] mt-1">
            Here's what's happening with your team today
          </p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">

        <Card
          onClick={() => navigate("/projects")}
          className="cursor-pointer bg-white hover:bg-[#F0FAF9] border shadow-sm"
        >
          <CardContent className="p-6">
            <p className="text-base text-gray-500">Projects</p>
            <h2 className="text-3xl font-bold text-[#1e4945] mt-1">
              {projectCount}
            </h2>
          </CardContent>
        </Card>

        <Card
          onClick={() => navigate("/tasks")}
          className="cursor-pointer bg-white hover:bg-[#F0FAF9] border shadow-sm"
        >
          <CardContent className="p-6">
            <p className="text-base text-gray-500">Assigned Tasks</p>
            <h2 className="text-3xl font-bold text-[#1e4945] mt-1">
              {assignedTaskCount}
            </h2>
          </CardContent>
        </Card>

      </div>

      <Card className="bg-[#E6F2F1] shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-[#1e4945] mb-4">
            Team Members
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {team.map((member) => (
              <div
                key={member.id}
                className="flex items-center bg-white gap-3 p-3 border rounded-md shadow-sm"
              >
                <img
                  src={member.avatar_url || avatar}
                  className="w-11 h-11 rounded-full"
                />
                <div>
                  <p className="text-base font-medium text-[#1e4945]">
                    {member.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {member.employee_id || "No ID"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>


      <Card className="shadow-sm">
        <CardContent className="p-6 space-y-4">

          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-[#1e4945]">
              Tasks
            </h2>

            <div className="flex items-center gap-2 text-sm">
              <FiFilter className="text-[#6FA8A3]" />

              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1 rounded ${filter === "all"
                    ? "bg-[#6FA8A3] text-white"
                    : "bg-gray-100 text-gray-600"
                  }`}
              >
                All
              </button>

              <button
                onClick={() => setFilter("assigned")}
                className={`px-3 py-1 rounded ${filter === "assigned"
                    ? "bg-[#6FA8A3] text-white"
                    : "bg-gray-100 text-gray-600"
                  }`}
              >
                Assigned to me
              </button>

              <button
                onClick={() => setFilter("created")}
                className={`px-3 py-1 rounded ${filter === "created"
                    ? "bg-[#6FA8A3] text-white"
                    : "bg-gray-100 text-gray-600"
                  }`}
              >
                Created by me
              </button>
            </div>
          </div>


          <div className="space-y-3">

            {filteredTasks.length === 0 ? (
              <p className="text-base text-gray-400">
                No tasks found
              </p>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 border rounded-md bg-white shadow-sm space-y-2"
                >
                  <div>
                    <p className="text-xs text-gray-400">Title</p>
                    <p className="text-base font-semibold text-[#1e4945]">
                      {task.title}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Description</p>
                    <p className="text-sm text-gray-600">
                      {task.description || "No description"}
                    </p>
                  </div>


                  <div className="flex justify-between text-sm text-gray-600">

                    <div>
                      <p className="text-xs text-gray-400">Task Code</p>
                      <p className="font-medium">{task.task_code}</p>
                    </div>

                    <div className="flex flex-col justify-end">
                      <p className="text-xs text-end text-gray-400">Status</p>
                      <p className="font-semibold text-[#1e4945]">
                        {task.status}
                      </p>
                    </div>

                  </div>

                </div>
              ))
            )}

          </div>

        </CardContent>
      </Card>

    </div>
  );
}