"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userNotFound, setUserNotFound] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    setUserNotFound(false);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        toast.success("Login successful! Redirecting to home...", { duration: 3000 });

        // Redirect after 3 seconds
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else if (data.error === "Invalid credentials") {
        setUserNotFound(true);
      } else {
        toast.error(data.error || "Login failed!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      {/* Toast container */}
      <Toaster position="top-right" reverseOrder={false} />

      <h2 className="text-2xl mb-4">Login</h2>

      <form onSubmit={handleLogin} className="flex flex-col w-80">
        <input
          className="border p-2 m-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="border p-2 m-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 m-2 rounded"
        >
          Login
        </button>
      </form>

      {userNotFound && (
        <div className="text-center mt-4 p-4 border border-red-400 rounded bg-red-50">
          <p className="text-red-600 mb-2">You are not registered!</p>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
            onClick={() => router.push("/register")}
          >
            Go to Register
          </button>
        </div>
      )}
    </div>
  );
}
