"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [message, setMessage] = useState("");
  const [adminMessage, setAdminMessage] = useState("");
  const [userType, setUserType] = useState(""); 
  const [greeting, setGreeting] = useState("");
  const [notLoggedIn, setNotLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setNotLoggedIn(true); 
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserType(payload.role || payload.userType || "User"); 
      setGreeting(`Welcome back, ${payload.name || "User"}! You are logged in as ${payload.role || "User"}.`);
    } catch (error) {
      console.error("Invalid token", error);
      localStorage.removeItem("token");
      setNotLoggedIn(true);
      return;
    }

    // Fetch user-protected message
    fetch("/api/protected", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setMessage(data.message || "You have access to user content."));

    // Fetch admin-protected message
    fetch("/api/protected/admin", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setAdminMessage(data.message || data.error || "Admin content not available."));
  }, [router]);

  if (notLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold text-red-600">You are not logged in!</h1>
        <p className="text-lg">Please login to access the dashboard content.</p>
        <button
          className="bg-blue-500 text-white px-4 py-2 mt-2 rounded cursor-pointer"
          onClick={() => router.push("/login")}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold">Home Page</h1>
      <p className="text-lg">{greeting}</p>

      {userType === "admin" && <p className="text-green-600 font-semibold">You have admin privileges!</p>}

      {userType && (
        <>
          <p>User Protected: {message}</p>
          {userType === "admin" && <p>Admin Protected: {adminMessage}</p>}
        </>
      )}
    </div>
  );
}
