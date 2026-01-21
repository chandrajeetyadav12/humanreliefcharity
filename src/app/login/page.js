"use client";

import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";

const schema = yup.object({
  identifier: yup
    .string()
    .required("Email or Aadhaar is required")
    .test(
      "email-or-aadhaar",
      "Enter valid Email or 12-digit Aadhaar",
      (value) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
        /^\d{12}$/.test(value)
    ),
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
      await login({
        identifier: data.identifier,
        password: data.password,
      });

      toast.success("Login successful");
      router.push("/");
    } catch (err) {
      toast.error("Invalid credentials");
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
              placeholder="Email or Aadhaar"
              {...register("identifier")}
            />
            <p className="text-danger">{errors.identifier?.message}</p>

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
