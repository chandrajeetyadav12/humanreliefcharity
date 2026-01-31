"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthContext } from "@/context/AuthContext";

export default function FounderLayout({ children }) {
  const { user, isAuthenticated, loading, logout } =
    useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.replace("/login");
      }

      if (isAuthenticated && user?.role !== "founder") {
        router.replace("/");
      }
    }
  }, [isAuthenticated, user, loading, router]);

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  if (loading) return <p>Loading...</p>;
  if (!isAuthenticated || user?.role !== "founder") return null;

  return (
    <div className="d-block d-lg-flex flex-grow-1 min-vh-100 founder-main">
      {/* SIDEBAR */}
      <aside className="p-3 border-end bg-light userLayoutAside">
        <h5 className="mb-3">Founder Panel</h5>

        <ul className="list-unstyled userAsideUL">
          <li>
            <Link href="/dashboard/founder">Dashboard</Link>
          </li>
          <li>
            <Link href="/dashboard/founder/profile">My Profile</Link>
          </li>
          <li>
            <Link href="/dashboard/founder/pending-avedan">
              Pending Avedan
            </Link>
          </li>
          <li>
            <Link href="/dashboard/founder/admins">Admins</Link>
          </li>
          <li>
            <Link href="/dashboard/founder/users">Users</Link>
          </li>
          <li>
            <Link href="/dashboard/founder/settings">
              System Settings
            </Link>
          </li>
        </ul>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="btn btn-outline-danger w-100 mt-3"
        >
          Logout
        </button>
      </aside>

      {/* CONTENT */}
      <main className="flex-grow-1 p-4">{children}</main>
    </div>
  );
}

// export default function FounderLayout({ children }) {
//   return (
//     <div className="d-block d-lg-flex flex-grow-1 min-vh-100 founder-main">
//       {/* SIDEBAR */}
//       <aside className="p-3 border-end bg-light userLayoutAside">
//         <h5 className="mb-3">Founder Panel</h5>

//         <ul className="list-unstyled userAsideUL">
//           <li>
//             <a href="/dashboard/founder">Dashboard</a>
//           </li>

//           <li>
//             <a href="/dashboard/founder/profile">My Profile</a>
//           </li>
//             <li>
//             <a href="/dashboard/founder/pending-avedan">Pendin Avedan</a>
//           </li>

//           <li>
//             <a href="/dashboard/founder/admins">Admins</a>
//           </li>

//           <li>
//             <a href="/dashboard/founder/users">Users</a>
//           </li>

//           <li>
//             <a href="/dashboard/founder/settings">System Settings</a>
//           </li>
//         </ul>
//       </aside>

//       {/* CONTENT */}
//       <main className="flex-grow-1 p-4">
//         {children}
//       </main>
//     </div>
//   );
// }
