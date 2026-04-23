import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ChatPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;

      setCurrentUser(user);

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", user?.id);

      setUsers(data || []);
    };

    loadUser();
  }, []);

  useEffect(() => {
    if (!selectedUser || !currentUser) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${currentUser.id},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${currentUser.id})`
        )
        .order("created_at", { ascending: true });

      if (!error) setMessages(data || []);
      console.log(messages);
      
    };

    fetchMessages();
  }, [currentUser,selectedUser]);

 
  const sendMessage = async () => {
    const { data: { session } } = await supabase.auth.getSession();

console.log(session);

    if (!message || !selectedUser || !currentUser) return;

    console.log(currentUser.id,
        selectedUser.id,
        message,);
    
      //   const { data,error } = await supabase
      // .from('messages')
      // .insert([{ sender_id: currentUser.id,
      //   receiver_id: selectedUser.id,
      //   message: message,}]);

    const { data, error } = await supabase.functions.invoke("send-message", {
      body: {
        sender_id: currentUser.id,
        receiver_id: selectedUser.id,
        message: message,
      },
    });
    

 console.log(data);
  
  if (error) {
    console.error("Error sending message:", error);
    return;
  }
  console.log("Message sent:", data);
  setMessage(" ");

  };

  useEffect(() => {
    if (!currentUser || !selectedUser) return;

    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const newMsg = payload.new;

          if (
            (newMsg.sender_id === currentUser.id && newMsg.receiver_id === selectedUser.id) ||
            (newMsg.sender_id === selectedUser.id && newMsg.receiver_id === currentUser.id)
          ) {
            setMessages((prev) => [...prev, newMsg]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser, selectedUser]);


  return (
    <div className="flex h-screen">

      {/* LEFT: USERS */}
      <div className="w-1/3 border-r p-4 overflow-y-auto">
        <h2 className="font-bold mb-4">Users</h2>

        {users.map((user) => (
          <Card
            key={user.id}
            onClick={() => setSelectedUser(user)}
            className={`p-3 mb-2 cursor-pointer ${
              selectedUser?.id === user.id ? "bg-gray-200" : ""
            }`}
          >
            {user.name}
          </Card>
        ))}
      </div>

      <div className="flex-1 flex flex-col p-4">

        {!selectedUser ? (
          <p className="text-gray-500">
            Select a user to start chatting
          </p>
        ) : (
          <>
            <h2 className="font-bold mb-2">
              Chat with {selectedUser.name}
            </h2>

            <div className="flex-1 overflow-y-auto space-y-2 border p-3 rounded">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-2 rounded w-fit max-w-xs ${
                    msg.sender_id === currentUser.id
                      ? "ml-auto bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {msg.message}
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-3">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type message..."
              />
              <Button onClick={sendMessage}>Send</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}