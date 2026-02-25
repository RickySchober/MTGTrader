import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { tryLogin } from "../api/Login.js";

import Button from "@/components/Button.js";
interface LoginFormProps {
  setIsRegister: (isRegister: boolean) => void;
}
const LoginForm: React.FC<LoginFormProps> = ({ setIsRegister }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();
    const success = await tryLogin(email, password);
    console.log(success);
    if (success) navigate("/profile");
  }
  return (
    <form onSubmit={submitForm} className="flex flex-col gap-3">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-slate-bright rounded-md p-3 text-base"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="bg-slate-bright rounded-md p-3 text-base"
      />
      <Button type="submit" className="bg-primary hover:bg-primary-hover mb-2 px-4 py-2 text-lg">
        Login
      </Button>
      <Button
        onClick={() => setIsRegister(true)}
        className="text-primary bg-transparent underline hover:bg-transparent"
      >
        Create an account
      </Button>
    </form>
  );
};
export default LoginForm;
