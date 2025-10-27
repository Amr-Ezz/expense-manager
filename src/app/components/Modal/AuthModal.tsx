"use client";
import { useState } from "react";
import LoginForm from "@/app/components/Forms/LoginForm";
import RegisterForm from "@/app/components/Forms/RegisterForm";

interface AuthModalProps {
  onClose: () => void;
  mode: "login" | "register";
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, mode }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-[90%] max-w-md shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-600 dark:text-gray-300 text-xl"
        >
          ✕
        </button>
        <h2 className="text-2xl font-semibold text-center mb-4 text-primary">
          {mode === "login" ? "Login" : "Register"}
        </h2>
        {mode === "login" ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
};

export default AuthModal;
