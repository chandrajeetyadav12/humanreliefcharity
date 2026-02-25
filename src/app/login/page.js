"use client";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

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
  const { login, user, loading, isAuthenticated } = useContext(AuthContext);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  // Redirect if already logged in
  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      router.replace(`/dashboard/${user.role}`);
    }
  }, [loading, isAuthenticated, user, router]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      setButtonLoading(true)
      const user = await login({
        identifier: data?.identifier,
        password: data?.password,
      });
      //  console.log(user)
      toast.success("Login successful");
      if (user?.role === "admin") {
        console.log("admin", user?.role)
        router.push("/dashboard/admin");
      }
      else if (user?.role === "founder") {
        console.log("founder", user?.role)

        router.push("/dashboard/founder");
      }
      else {
        console.log("user", user?.role)

        router.push("/dashboard/user");
      }
    } catch (error) {
      const msg =
        error.response?.data?.message || "Login failed";
      toast.error(msg);
      toast.error("Invalid credentials");
    }
    finally {
      setButtonLoading(false); // stop button loading
    }

  };
  if (loading || isAuthenticated) return null;
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
            <div className="position-relative">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control mb-2"
              placeholder="Password"
              {...register("password")}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                top: "50%",
                right: "15px",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#6c757d",
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            </div>
            <p className="text-danger">{errors.password?.message}</p>

            <button className="globalBtnColor">{buttonLoading ? "Logging in..." : "Login"}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
