"use client";

import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6).required("Password is required"),
});

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      await login(data);
      toast.success("Login successful");
      // router.push("/dashboard");
    } catch (err) {
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="container my-5">

      <div className="col-md-5 mx-auto my-4">
        <div className="border rounded shadow p-4 bg-white">
          <h3 className="mb-3">Login</h3>

          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              className="form-control mb-2"
              placeholder="Email"
              {...register("email")}
            />
            <p className="text-danger">{errors.email?.message}</p>

            <input
              type="password"
              className="form-control mb-2"
              placeholder="Password"
              {...register("password")}
            />
            <p className="text-danger">{errors.password?.message}</p>

            <button className="btn btn-success w-100">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}
