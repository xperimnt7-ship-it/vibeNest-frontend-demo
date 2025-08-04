import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, logout } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit button clicked")

    try {
      const response = await fetch("http://localhost:3000/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          email: email,
          password: password,
        }),
        credentials: "include", // include cookies
      });

      const data = await response.json(); // parse response body

      if (!response.ok) {
        console.log("Login failed:", data.message);
        alert(data?.message || "Login failed");
        return; // stop here
      }

      console.log("User logged in successfully");
      dispatch(login());
      navigate("/");
    } catch (error) {
      console.error("Error during login:", error);
      alert("Something went wrong. Please try again.");
    }
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    console.log("password changed");
    setPassword(e.target.value);
  };

  return (
    <div className=" flex justify-center content-center h-full w-full bg-black">
      <div className="hidden md:flex h-full bg-black items-center justify-center">
        <img src="/cover_image.png" alt="" className=" h-[70vh]" />
      </div>

      <div className="bg-black h-full text-white flex flex-col justify-center p-6">
        <h3 className="text-2xl font-medium">Post Your Vibe.</h3>
        <h4 className="text-xs font-bold opacity-40">
          {" "}
          Login to connect, create
        </h4>
        <form
          className="bg-black text-white flex flex-col mt-5 p-2  md:border-none border-2 border-white"
          onSubmit={handleSubmit}
        >
          <label htmlFor="email" className="text-xs font-medium ">
            email <span className="text-red-600 text-sm">*</span>
          </label>
          <input
            type="text"
            name="name"
            id="email"
            placeholder="E-mail"
            value={email}
            onChange={handleEmailChange}
            required
            className=" border-gray-600 border overflow-auto your-container p-2 required"
          />
          <label htmlFor="password" className="text-xs font-medium mt-4">
            Password <span className="text-red-600 text-sm">*</span>
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter password"
            value={password}
            onChange={handlePasswordChange}
            required
            className=" border-gray-600 border overflow-auto your-container p-2 required"
          />

          <input
            type="submit"
            value="Login"
            className="p-2 border border-white rounded-full max-w-[100px] mt-4 hover:bg-white hover:text-black transition duration-300 ease-in-out"
          />
        </form>
        <button className="text-xs cursor-pointer text-blue-500 w-fit">
          New to VibeNest? <span className="text-red-400">Register</span>
        </button>

        <div className="mt-4">
          <h2 className="text-2xl font-medium">
            <span className="text-pink-100">V</span>
            <span className="text-pink-200">i</span>
            <span className="text-pink-300">b</span>
            <span className="text-pink-400">e</span>
            <span className="text-pink-500">N</span>
            <span className="text-pink-600">e</span>
            <span className="text-pink-700">s</span>
            <span className="text-pink-800">t</span>
          </h2>
          <p className="text-xs font-bold opacity-40">
            a cozy place htmlFor sharing vibes
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
