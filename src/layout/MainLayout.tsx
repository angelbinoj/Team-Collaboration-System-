import { Outlet, useNavigate } from "react-router-dom";
import avatar from "@/assets/avatar.jpg";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { BsChat } from "react-icons/bs";


export default function MainLayout() {
  const navigate=useNavigate();

   const logout = async () => {
    try {

      let { error } = await supabase.auth.signOut()
      console.log(error);
      toast.success("Logout successfully",{
    className: "text-green-600",
  });
      navigate('/signIn')

    } catch (error) {
      console.log("Error logout", error);
    }
  }
  return (
    <div className="flex h-screen overflow-hidden">

      <div className="w-60 bg-white border-r fixed h-full hidden md:flex flex-col p-4">
        <h1 className="text-xl font-bold mb-6">TaskApp</h1>

        <nav className="flex flex-col gap-3">
          <a href="/">Dashboard</a>
          <a href="/projects">Projects</a>
          <a href="/tasks">My Tasks</a>
        </nav>
      </div>


      <div className="flex-1 flex flex-col md:ml-60">

        <div className="h-16 bg-white border-b fixed top-0 left-0 md:left-60 right-0 flex items-center justify-between px-4 z-10">
          <span className="font-semibold">Dashboard</span>

          <div className="flex items-center gap-2">
            <BsChat className="w-8 h-8 text-black hover:text-slate-600" onClick={()=>navigate('/chat')}/>
            <img
              src={avatar}
              className="w-8 h-8 rounded-full"
            />
            <span onClick={()=>navigate('/update-profile')} className="text-sm">User</span>
<Button onClick={()=>logout()} className="bg-red-400 hover:bg-red-500">Logout</Button>
          </div>
        </div>

        <main className="mt-16 p-4 bg-gray-100 h-[calc(100vh-56px)] overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
}