import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/v1/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      console.log(data);
      if(res.ok){
        sessionStorage.setItem("username", data.loggedInUser.username);
        navigate("/rooms")
      }
      else{
        alert(data.message || "Login failed")
      }
    } 
    catch (err) {
      console.error(err);
    }
  };

  const handleSignup = () => {
    navigate("/signup")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Chat App
        </h2>

        {/* Username */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Username
          </label>
          <input
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Password
          </label>
          <input
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button 
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            onClick={handleLogin}
          >
            Login
          </button>
          
          <p className="text-center text-sm">
            or
          </p>

          <button 
            className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-700 transition hover:text-white"
            onClick={handleSignup}
          >
            Signup
          </button>
        </div>
      </div>
    </div>
  );
}
