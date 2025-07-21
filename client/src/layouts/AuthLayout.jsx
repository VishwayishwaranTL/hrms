import React from "react";
import loginBackground from "../assets/login_background.jpg";

export default function AuthLayout({ children }) {
  return (
    <div className="h-screen md:grid grid-cols-2 bg-gray-100">
      
      <div className="hidden md:block h-screen">
        <img
          src={loginBackground}
          alt="Login Background"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 animate-slide-up">
          {children}
        </div>
      </div>
    </div>
  );
}
