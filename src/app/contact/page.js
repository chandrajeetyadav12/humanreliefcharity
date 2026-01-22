"use client";

import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";

/* ------------------ Validation Schema ------------------ */
const schema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: yup
    .string()
    .matches(/^\d{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  subject: yup.string().required("Subject is required"),
  message: yup.string().required("Message is required"),
});

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  /* ------------------ Submit Handler ------------------ */
  const onSubmit = async (data) => {
    try {
      const res = await axios.post("/api/contact", data);
      toast.success(res.data.message || "Message sent successfully");
      reset();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <div className="container my-5">
      <h3 className="text-center mb-4">Contact Us</h3>

      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Name */}
            <input
              className="form-control mb-2"
              placeholder="Your Name"
              {...register("name")}
            />
            <small className="text-danger">{errors.name?.message}</small>

            {/* Email */}
            <input
              className="form-control mb-2 mt-2"
              placeholder="Email Address"
              {...register("email")}
            />
            <small className="text-danger">{errors.email?.message}</small>

            {/* Phone */}
            <input
              className="form-control mb-2 mt-2"
              placeholder="Phone Number"
              {...register("phone")}
            />
            <small className="text-danger">{errors.phone?.message}</small>

            {/* Subject */}
            <input
              className="form-control mb-2 mt-2"
              placeholder="Subject"
              {...register("subject")}
            />
            <small className="text-danger">{errors.subject?.message}</small>

            {/* Message */}
            <textarea
              className="form-control mb-2 mt-2"
              rows="4"
              placeholder="Your Message"
              {...register("message")}
            />
            <small className="text-danger">{errors.message?.message}</small>

            <button
              type="submit"
              className="globalBtnColor w-100 mt-3"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
