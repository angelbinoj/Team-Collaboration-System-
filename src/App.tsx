
import { Navigate, Route, Routes } from "react-router-dom"

// import AddTask from "./pages/AddTask"
// import ViewTask from "./pages/ViewTask"
import SignUp from "./pages/SignUp"
import SignIn from "./pages/SignIn"
import { supabase } from "./lib/supabase"
import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { Toaster } from "sonner"
import ViewTaskList from "./pages/ViewTaskList"
import { CompleteProfile } from "./components/CompleteProfile"
import { UpdateProfile } from "./components/UpdatePofile"
import MainLayout from "./layout/MainLayout"
// import ListCompletedTasks from "./pages/CompletedTask"
// import Messages from "./components/Messages"
// import UsersList from "./pages/UserList"
// import UpdateProfile from "./components/UpdateProfile"

function App() {

   const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };

    getUser();

    const { data } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

      return () => {
    data.subscription.unsubscribe(); 
  };
    
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Routes>
        <Route path='/' element={<MainLayout />} >
        <Route index element={user ? <ViewTaskList/> : <Navigate to="/signIn" />}/>
        {/* <Route path='/cmpltd' index element={user ? <ListCompletedTasks/> : <Navigate to="/signIn" />}/>
        <Route path='/users' index element={user ? <UsersList/> : <Navigate to="/signIn" />}/>
        <Route path='/update' index element={user ? <UpdateProfile/> : <Navigate to="/signIn" />}/>
        <Route path='message/:id' index element={user ? <Messages/> : <Navigate to="/signIn" />}/>
        <Route path='add' element={user ? <AddTask /> : <Navigate to="/signIn" />} />
        <Route path='view/:id' element={user ? <ViewTask /> : <Navigate to="/signIn" />} /> */}
        <Route path='update-profile' element={user ? <UpdateProfile/> : <Navigate to="/signIn" />}/>
        </Route>
        <Route path='/cmplte-profile' element={user ? <CompleteProfile/> : <Navigate to="/signIn" />}/>
        <Route path='/signUp' element={<SignUp />} />
        <Route path='/signIn' element={<SignIn/>} />
    </Routes>
    <Toaster/>
    </>
  )
}

export default App