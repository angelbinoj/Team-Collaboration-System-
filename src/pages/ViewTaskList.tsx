// import { Button } from "@/components/ui/button";
// import { supabase } from "@/lib/supabase";
// import { BsChat } from "react-icons/bs";
// import type { Task } from "@/types/Task";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import avatar from "@/assets/avatar.jpg";
// import type { User } from "@supabase/supabase-js";
// import { toast } from "sonner";




function ViewTaskList() {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [loading, setLoading] = useState(true);
//   // const [user, setUser] = useState<User | null>(null);
//   const [user, setUser] = useState<any>({});
//   const navigate=useNavigate();



//    const logout = async () => {
//     try {

//       let { error } = await supabase.auth.signOut()
//       console.log(error);
//       toast.success("Logout successfully",{
//     className: "text-green-600",
//   });
//       navigate('/signIn')
//     } catch (error) {
//       console.log("error fetching tasks", error);
//     }
//   }

// useEffect(() => {
//   const loadData = async () => {
//     try {
//       setLoading(true);

//       const { data: { user } } = await supabase.auth.getUser();

//                 const { data:userData } = await supabase
//                     .from("users")
//                     .select("*")
//                     .eq("id", user?.id)
//                     .single()

//                 setUser(userData || "");

//       if (!user) {
//         setLoading(false);
//         return;
//       }
      
//         const { data, error } = await supabase.rpc('get_user_tasks', {
// uid: user.id
// });

//       if (error){
//         toast.error(error.message || "Something went wrong");
//       }

//       setTasks(data || []);

//     } catch (error) {
//       console.log("error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };


//   loadData();
// }, []);


//   const handleClick = (id: number | string) => {
//     navigate(`/view/${id}`);
//   }

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center gap-1 min-h-screen">
//         <p className="text-blue-600 font-semibold text-lg">Fetching tasks...</p>
//         <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     );
//   }

  return (
    <div className="w-full h-screen bg-gray-100 items-center text-amber-800">
      <h1>gjjjjjjjjjjjjjjjjjj</h1>

      {/* <div className="bg-blue-600 h-20 mb-16 flex justify-around items-center">
        <h1 className="text-3xl  w-full font-bold text-center text-white ">
          ToDoList
        </h1>
        <div className="flex justify-end items-center w-full gap-16 pr-10">
          <div onClick={()=>navigate('/update')} className="flex gap-2 justify-center items-center hover:bg-blue-500 rounded-xl p-1">
            <h5 className="text-white font-sm">{user?.email}</h5>
            <img src={user?.image_url ? user.image_url : avatar} className="w-9 h-9 rounded-full" />
          </div>
          <BsChat className="w-8 h-8 text-white hover:text-slate-300" onClick={()=>navigate('/users')}/>
          <Button onClick={()=>logout()} className="bg-red-400 hover:bg-red-500">Logout</Button>
        </div>
      </div>

      {/* Table Container */}
      {/* <div className="max-w-3xl mx-auto bg-blue-600 rounded-xl shadow-md p-4">
        <div className="flex justify-between items-center">
        <Button className="text-blue-600" variant="outline" onClick={() => navigate('/add')}>
          Add Task <span className=" text-2xl">+</span>
        </Button>
        <Button className="text-blue-600" variant="outline" onClick={() => navigate('/cmpltd')}>
          View Completed Tasks 
        </Button>
        </div>
        <table className="w-full text-white">

          {/* Table Head */}
          {/* <thead>
            <tr className="text-left border-b border-blue-400">
              <th className="py-2">SI.No</th>
              <th className="py-2">Title</th>
              <th className="py-2">Action</th>
            </tr>
          </thead> */}

          {/* Table Body */}
          {/* <tbody>
            {tasks.map((task, index) => (
              <tr key={task.id} className="border-b border-blue-500">

                <td className="py-2">{index + 1}</td>

                <td className="py-2">{task.title}</td>

                <td className="py-2">
                  <Button onClick={() => handleClick(task.id)} size="sm" variant="secondary">
                    View
                  </Button>
                </td>

              </tr>
            ))}
          </tbody>

        </table> */}

      {/* </div> */} 
    </div>
  );
}

export default ViewTaskList;