import React, { useState } from "react";

import LoginForm from "./components/LoginForm.js";
import RegisterForm from "./components/RegisterForm.js";

import { useRedirectWhenLoggedIn } from "@/lib/hooks.js";

const LoginPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);

  useRedirectWhenLoggedIn();

  return (
    <div className="flex min-h-[72vh] items-center justify-center">
      <div className="bg-slate-light w-full max-w-lg rounded-xl p-8">
        <h2 className="mb-5 text-center text-6xl font-bold">
          {isRegister ? "Create an account" : "Login"}
        </h2>
        {isRegister ? (
          <RegisterForm setIsRegister={setIsRegister} />
        ) : (
          <LoginForm setIsRegister={setIsRegister} />
        )}
      </div>
    </div>
  );
};
export default LoginPage;
