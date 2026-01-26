export default function FounderLayout({ children }) {
  return (
    <div className="d-block d-lg-flex flex-grow-1 min-vh-100 founder-main">
      {/* SIDEBAR */}
      <aside className="p-3 border-end bg-light userLayoutAside">
        <h5 className="mb-3">Founder Panel</h5>

        <ul className="list-unstyled userAsideUL">
          <li>
            <a href="/dashboard/founder">Dashboard</a>
          </li>

          <li>
            <a href="/dashboard/founder/profiles">My Profile</a>
          </li>

          <li>
            <a href="/dashboard/founder/admins">Admins</a>
          </li>

          <li>
            <a href="/dashboard/founder/users">Users</a>
          </li>

          <li>
            <a href="/dashboard/founder/settings">System Settings</a>
          </li>
        </ul>
      </aside>

      {/* CONTENT */}
      <main className="flex-grow-1 p-4">
        {children}
      </main>
    </div>
  );
}
