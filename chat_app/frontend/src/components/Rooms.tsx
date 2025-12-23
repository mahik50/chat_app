import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Rooms() {
  const [roomID, setRoomID] = useState<string>("");
  const username = sessionStorage.getItem("username");

  const navigate = useNavigate();


  const generateRoomID = async () => {
    try{
        const res = await fetch("http://localhost:4000/api/v1/createRoom",{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify( { username } )
        });

        const data = await res.json();
        if(res.ok){
            setRoomID(data.roomID);

        }
        else{
            alert("Error in generating room ID")
        }
    }
    catch(err){
        console.log(err);
    }
  }

  const joinRoom = async () => {
    try{
        const res = await fetch("http://localhost:4000/api/v1/joinRoom",{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify( { username, roomID})
        })

        const data = await res.json();

        if(!data.roomID){
            alert("Room ID required");
            return;
        }
        navigate(`/chat-room/${data.roomID}`);
    }
    catch(err){
        console.log(err);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Create or Join Room
        </h1>

        {/* Room ID Field */}
        <div className="mb-6 text-left">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Room ID
          </label>
          <input
            type="text"
            placeholder="Enter or generate room ID"
            value={roomID}
            onChange={(e) => setRoomID(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          <button
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            onClick={generateRoomID}
          >
            Create Room
          </button>

          <button 
                className="w-full border-2 border-blue-600 text-blue-600 py-3 rounded-lg font-medium hover:bg-blue-50 transition"
                onClick={joinRoom}
            >
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
}
