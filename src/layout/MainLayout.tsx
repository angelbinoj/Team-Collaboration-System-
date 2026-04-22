import { Outlet } from "react-router-dom";
import avatar from "@/assets/avatar.jpg";

export default function MainLayout() {
  return (
    <div className="flex h-screen overflow-hidden">

      <div className="w-60 bg-white border-r fixed h-full hidden md:flex flex-col p-4">
        <h1 className="text-xl font-bold mb-6">TaskApp</h1>

        <nav className="flex flex-col gap-3">
          <a href="/dashboard">Dashboard</a>
          <a href="/projects">Projects</a>
          <a href="/chat">Chat</a>
        </nav>
      </div>


      <div className="flex-1 flex flex-col md:ml-60">

        <div className="h-16 bg-white border-b fixed top-0 left-0 md:left-60 right-0 flex items-center justify-between px-4 z-10">
          <span className="font-semibold">Dashboard</span>

          <div className="flex items-center gap-2">
            <img
              src={avatar}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm">User</span>
          </div>
        </div>

        <main className="mt-16 p-4 bg-gray-100 h-[calc(100vh-56px)] overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
}