import { Outlet, useNavigate } from "react-router-dom";
import avatar from "@/assets/avatar.jpg";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { BsChat } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoIosLogOut } from "react-icons/io";
import { useEffect, useState } from "react";
import { UserIcon, Menu, X } from "lucide-react";

export default function MainLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>({});
  const [open, setOpen] = useState(false);

  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: userData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    setUser(userData || {});
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    toast.success("Logout successfully");
    navigate("/signIn");
  };

  return (
    <div className="flex h-screen overflow-hidden">

      <div
        className={`fixed md:static z-20 h-screen w-60 bg-[#E6F2F1] m-0 md:m-4 shadow-sm p-4 flex flex-col transition-transform duration-300
 ${open ? "block" : "hidden md:flex"}`}
      >

        <div className="flex items-center justify-between md:hidden mb-4">
          <h1 className="text-lg font-semibold text-[#1e4945]">CollabDesk</h1>
          <button onClick={() => setOpen(false)} className="text-xl ">
            <X className="hover:text-slate-600" />
          </button>
        </div>

        <h1 className="hidden md:block text-xl text-center font-semibold text-[#1e4945] mb-6">
          CollabDesk
        </h1>

        <nav className="flex flex-col gap-2 text-sm mt-3">

          <a
            href="/"
            className="px-3 py-2 bg-[#6FA8A3] rounded-md text-white hover:bg-[#9bc7c3] hover:text-[#1e4945] transition"
          >
            Dashboard
          </a>

          <a
            href="/projects"
            className="px-3 py-2 bg-[#6FA8A3] rounded-md text-white hover:bg-[#9bc7c3]  hover:text-[#1e4945] transition"
          >
            Projects
          </a>

          <a
            href="/tasks"
            className="px-3 py-2 bg-[#6FA8A3] text-white rounded-md  hover:bg-[#9bc7c3]  hover:text-[#1e4945] transition"
          >
            My Tasks
          </a>

        </nav>
      </div>

      <div className="flex-1 flex flex-col">

        <div className="h-14 bg-[#6FA8A3] border-b flex items-center justify-between px-4">


          <div className="flex items-center gap-3">

            <Menu
              className="md:hidden cursor-pointer text-white"
              onClick={() => setOpen(true)}
            />

            <span className="md:hidden font-medium text-white">
              CollabDesk
            </span>

          </div>

          <div className="flex items-center gap-10">

            <BsChat
              className="w-6 h-6 text-white cursor-pointer hover:text-slate-200"
              onClick={() => navigate("/chat")}
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 flex items-center gap-2 text-white bg-[#5b9b96]">
                  <span className="text-sm">{user?.name}</span>
                  <img
                    src={user?.avatar_url || avatar}
                    className="w-9 h-9 rounded-full"
                  />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => navigate('/update-profile')}>
                    <UserIcon className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                variant="destructive"
                  className="flex justify-between"
                  onClick={logout}
                >
                  Logout <IoIosLogOut />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </div>

        <main className="p-4 border-l bg-[#F7F9FA] flex-1 overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
}