import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import avatar from "@/assets/avatar.jpg";

export default function ChatPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const user = authData?.user;

        setCurrentUser(user);

        const { data } = await supabase
          .from("profiles")
          .select("*")
          .neq("id", user?.id);

        setUsers(data || []);
      } catch (error) {
        console.log(error);

      }

    };

    loadUser();
  }, []);

  useEffect(() => {
    if (!selectedUser || !currentUser) return;

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .or(
            `and(sender_id.eq.${currentUser.id},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${currentUser.id})`
          )
          .order("created_at", { ascending: true });

        if (!error) setMessages(data || []);
        console.log(messages);
      } catch (error) {
        console.log(error);

      }

    };

    fetchMessages();
  }, [currentUser, selectedUser]);


  const sendMessage = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      console.log(session);
      if (!message || !selectedUser || !currentUser) return;

      const { data, error } = await supabase.functions.invoke("send-message", {
        body: {
          sender_id: currentUser.id,
          receiver_id: selectedUser.id,
          message: message,
        },
      });

      if (error) {
        console.error("Error sending message:", error);
        return;
      }
      console.log("Message sent:", data);
      setMessage(" ");

    } catch (error) {
      console.log(error);
    }

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
    <div className="flex h-full">

      <div className="w-1/3 bg-white border-r flex flex-col">

        <div className="p-4 border-b">
          <h2 className="font-semibold text-[#1e4945]">Users</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`p-3 rounded-md cursor-pointer border-b text-sm flex items-center gap-2
              ${selectedUser?.id === user.id
                  ? "bg-[#E6F2F1] text-[#1e4945]"
                  : "hover:bg-[#F0F4F4] text-[#2c6c66]"
                }`}
            >
              <img
                src={user?.avatar_url || avatar}
                className="w-10 h-10 border-2 border-white rounded-full"
              />
              <span>{user.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-[#F7F9FA]">

        {!selectedUser ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a user to start chatting
          </div>
        ) : (
          <>

            <div className="p-4 border-b bg-white font-medium text-[#1e4945] flex gap-2 items-center">
              <img
                src={selectedUser?.avatar_url || avatar}
                className="w-10 h-10 border-2 rounded-full"
              />
              <span>

                {selectedUser.name}
              </span>
            </div>


            <div className="flex-1 overflow-y-auto p-4 space-y-2">

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`px-3 py-2 rounded-lg max-w-xs text-sm
                  ${msg.sender_id === currentUser.id
                      ? "ml-auto bg-[#6FA8A3] text-white"
                      : "bg-white border text-[#2c6c66]"
                    }`}
                >
                  {msg.message}
                  <div className="text-[10px] opacity-60 mt-1">
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              ))}

            </div>

            <div className="p-3 border-t bg-white flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type message..."
              />
              <Button
                onClick={sendMessage}
                className="bg-[#6FA8A3] text-white hover:bg-[#5b9b96]"
              >
                Send
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}