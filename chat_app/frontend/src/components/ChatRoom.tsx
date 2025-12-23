import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Message {
  type: string;
  roomID: string;
  username: string;
  text: string;
  time: string
}

export default function ChatRoom() {
  const { roomID } = useParams();
  const [ws, setSocket] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState<string>("");
  const [latestMessage, setLatestMessage] = useState<Message[]>([]);

  const username = sessionStorage.getItem("username");
  const navigate = useNavigate();

  useEffect(() => {
    if (!username || !roomID) {
      navigate("/");
      return;
    }


    // re-render chat on page reload
    const savedChat = sessionStorage.getItem(`chat-${roomID}`);
    if (savedChat) {
      setLatestMessage(JSON.parse(savedChat));
    }

    const ws = new WebSocket("ws://localhost:4000");

    ws.onopen = () => {
      setSocket(ws);

      ws.send(
        JSON.stringify({
          type: "connect",
          roomID: roomID,
          username: username,
        })
      );
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "notify") {
        setLatestMessage(prev => {
          return [...prev,
            {
              type: "system",
              roomID: data.roomID,
              username: "system",
              text: `${data.username} joined the room`,
              time: data.time
            }
          ]
        })
      }

      if (data.type === "broadcast") {
        setLatestMessage((prev) => [...prev, data]);
      }
    };

    return () => ws.close();
  }, []);

  useEffect(() => {
    const chat = document.getElementById("chat-area");
    chat?.scrollTo({
      top: chat.scrollHeight,
      behavior: "smooth",
    });

    // storing latest message to re-render on page reload
    if(latestMessage.length > 0){
      sessionStorage.setItem(`chat-${roomID}`, JSON.stringify(latestMessage));
    }

  }, [latestMessage]);

  const sendMessage = () => {
    if (!ws || !message.trim()) return;

    ws.send(
      JSON.stringify({
        type: "message",
        roomID: roomID,
        username: username,
        text: message,
        time: new Date(Date.now()).toLocaleString('en-US', {timeStyle: 'short' })
      })
    );

    setMessage("");
  };

  onkeydown = (e) => {
    if(e.key === "Enter"){
      sendMessage();
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold">Room ID: {roomID}</h1>
          <p className="text-sm opacity-90">Logged in as {username}</p>
        </div>

        <button
          onClick={() => navigate("/rooms")}
          className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-lg text-m font-bold transition"
        >
          Leave Room
        </button>
      </div>

      {/* Chat Messages Area */}
      <div id="chat-area" className="flex-1 overflow-y-auto p-6 space-y-4 pb-36">
        {latestMessage.map((msg, index) => (
          <div
            key={index}
            className={`${
              msg.type === "system"
                ? "text-center text-sm text-gray-500 italic"
                : msg.username === username
                ? "ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg max-w-xs"
                : "bg-gray-300 text-black px-4 py-2 rounded-lg max-w-xs"
            }`}
          >
            {/* Show username only for chat messages */}
            {msg.type !== "system" && (
              <p className="text-xs font-semibold mb-1">{msg.username}</p>
            )}
            <div>
              <p>{msg.text}</p>
              <p className="text-right text-xs">{msg.time}</p>
            </div>

          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="fixed bottom-0 right-0 left-0 bg-white px-6 py-4 flex gap-3 border-t">
        <input
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          inputMode="text"
          enterKeyHint="send"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
