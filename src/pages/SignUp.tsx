// import { Button } from "@/components/ui/button"
// import {
//   Card,
//   CardAction,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { supabase } from "@/lib/supabase"
// import { useState } from "react"
// import { useNavigate } from "react-router-dom"
// import { toast } from "sonner"

// export default function SignUp() {

//   const [email, setEmail] = useState<string>("");
//   const [name, setName] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
//   const navigate = useNavigate()

//   const handleSignUp = async () => {

//   if (!email || !password || !name) {
//     toast.error("All fields are required");
//     return;
//   }

//   if (password.length < 6) {
//     toast.error("Password must be at least 6 characters");
//     return;
//   }

//   const { data, error } = await supabase.auth.signUp({
//     email,
//     password
//   });

//   if (error) {
//     toast.error(error.message);
//     return;
//   }

//   const id = data.user?.id;

//   if (!id) {
//     toast.error("User ID not found");
//     return;
//   }


//   const { error: insertError } = await supabase
//     .from('profiles')
//     .insert([{ id, name, email }]);

//   if (insertError) {
//     toast.error("Error saving user");
//     return;
//   }

//   toast.success("Signed Up successfully");
//   navigate('/signIn');
// };


//   return (
//     <div className="bg-blue-400 h-screen flex justify-center items-center">
//       <Card className="w-full max-w-md">
//         <CardHeader>
//           <CardTitle className="text-blue-500">Create an account</CardTitle>
//         </CardHeader>
//         <CardContent>
//             <div className="flex flex-col gap-6">
//               <div className="grid gap-2">
//                 <Label htmlFor="email" className="text-blue-500">Name</Label>
//                 <Input
//                   id="name"
//                   type="text"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   placeholder="m@example.com"
//                   required
//                 />
//               </div>
//               <div className="grid gap-2">
//                 <Label htmlFor="email" className="text-blue-500">Email</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="m@example.com"
//                   required
//                 />
//               </div>
//               <div className="grid gap-2">
//                 <div className="flex items-center">
//                   <Label htmlFor="password" className="text-blue-500">Password</Label>
//                   <a
//                     href="#"
//                     className="ml-auto inline-block text-blue-500 text-sm underline-offset-4 hover:underline"
//                   >
//                     Forgot your password?
//                   </a>
//                 </div>
//                 <Input id="password" type="password" value={password}
//                   onChange={(e) => setPassword(e.target.value)} required />
//               </div>
//             </div>
//         </CardContent>
//         <CardFooter className="flex-col gap-2">
//           <Button onClick={()=>handleSignUp()} type="submit" className="w-full bg-blue-500 hover:bg-blue-400">
//             SignUp
//           </Button>
//           <CardAction className="flex justify-center items-center w-full">
//             <CardDescription>
//               Already a User?
//             </CardDescription>
//             <Button onClick={() => navigate('/signIn')} className="text-blue-500" variant="link">Sign In</Button>
//           </CardAction>
//         </CardFooter>
//       </Card>
//     </div>
//   )
// }

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function SignUp() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    if (!name || !email || !password || !employeeId) {
      toast.error("All required fields must be filled");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    const id = data.user?.id;
    const { error: insertError } = await supabase
      .from('profiles')
      .insert([{ id, name, email, employee_id: employeeId}]);

    if (insertError) {
      toast.error("Error saving user");
      return;
    }

    toast.success("Account created!");
    navigate("/signin");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-1/3 shadow-lg">
        <CardHeader>
          <CardTitle className="font-bold text-2xl text-center my-3">Create Account</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label>Name</Label>
            <Input value={name} placeholder="Enter your name" onChange={(e) => setName(e.target.value)} />
          </div>
            <div className="flex flex-col gap-2">
              <Label>Employee ID</Label>
              <Input value={employeeId} placeholder="Enter your ID" onChange={(e) => setEmployeeId(e.target.value)} />
            </div>

          <div className="flex flex-col gap-2">
            <Label>Email</Label>
            <Input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Password</Label>
            <Input type="password" placeholder="Enter a strong password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <Button className="w-full hover:bg-gray-700" onClick={handleSignUp}>
            Sign Up
          </Button>

          <p
            className="text-sm text-center text-gray-500 cursor-pointer"
            onClick={() => navigate("/signin")}
          >
            Already have an account? <span className="text-slate-800 hover:text-black hover:font-semibold ms-1">Sign In</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}