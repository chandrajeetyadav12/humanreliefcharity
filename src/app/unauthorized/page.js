"use client";

import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="container text-center mt-5">
      <h2 className="text-danger">403 – Unauthorized</h2>
      <p>You do not have permission to access this page.</p>

      <button
        className="btn btn-primary mt-3"
        onClick={() => router.push("/login")}
      >
        Go to Login
      </button>
    </div>
  );
}
