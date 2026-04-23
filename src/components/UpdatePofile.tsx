import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import avatar from "@/assets/avatar.jpg";


export function UpdateProfile() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [user, setUser] = useState<any>(null);
    const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

                const { data ,error} = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", user?.id)
                    .single()

                setUser(data || "");
                
                setPhone(data?.phone_no || "");
      setLocation(data?.location || "");
      setAvatarUrl(data?.avatar_url || "");
    };
    fetchUser();  
  },[]);

  const handleUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const filePath = `avatar-${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file);

    if (error) {
      toast.error(error.message);
      setUploading(false);
      return;
    }

    const { data: publicUrl } = supabase.storage
      .from("avatars")
      .getPublicUrl(data.path);

    setAvatarUrl(publicUrl.publicUrl);
    setUploading(false);
  };

  const handleSave = async () => {
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        phone_no: phone,
        location,
        avatar_url: avatarUrl,
      })
      .eq("id", user.id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Profile updated successfully");
    navigate("/");
  };

  return (
  <div className="h-screen flex items-center justify-center bg-[#F7F9FA]">
    <Card className="w-1/3 bg-white border border-[#E5E7EB] shadow-md">
      
      <CardHeader>
        <CardTitle className="font-bold text-2xl my-3 text-[#1e4945]">
          Complete Your Profile
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">

        <div className="flex justify-center items-center">
          <div className="relative w-24 h-24">

            <img
              src={avatarUrl || avatar}
              className="w-24 h-24 rounded-full border-2 border-[#6FA8A3] object-cover"
            />

            <input
              type="file"
              ref={fileRef}
              onChange={handleUpload}
              className="hidden"
              accept="image/*"
            />

            <Button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-0 right-0 bg-[#6FA8A3] hover:bg-[#5b9b96] text-white w-7 h-7 rounded-full flex items-center justify-center text-lg"
            >
              +
            </Button>

          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">

          <div className="flex items-center gap-2">
            <Label className="text-[#245a54]">Name :</Label>
            <p className="text-gray-600">{user?.name}</p>
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-[#245a54]">Email :</Label>
            <p className="text-gray-600">{user?.email}</p>
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-[#245a54]">Employee ID :</Label>
            <p className="text-gray-600">
              {user?.employee_id}
            </p>
          </div>

        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-[#245a54]">Phone Number</Label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border-[#E5E7EB] focus:border-[#6FA8A3] focus:ring-[#6FA8A3]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-[#245a54]">Location</Label>
          <Textarea
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border-[#E5E7EB] focus:border-[#6FA8A3] focus:ring-[#6FA8A3]"
          />
        </div>

        <Button
          className="w-full bg-[#1e4945] hover:bg-[#2c6c66] text-white"
          onClick={handleSave}
        >
          Update Profile
        </Button>

      </CardContent>
    </Card>
  </div>
);
}
