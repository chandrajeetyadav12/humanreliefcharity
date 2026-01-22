export default function UserLayout({ children }) {
  return (
    <div className="d-flex min-vh-100">
      <aside className="p-3 border-end bg-light" style={{ width: 250 }}>
        <h5 className="mb-3">Member Panel</h5>

        <ul className="list-unstyled">
          <li className="mb-2">
            <a href="/dashboard/user">Dashboard</a>
          </li>

          <li className="mb-2">
            <a href="/dashboard/user/profile">Profile</a>
          </li>

          <li className="mb-2">
            <a href="/dashboard/user/status">Application Status</a>
          </li>
        </ul>
      </aside>

      <main className="flex-grow-1 p-4">
        {children}
      </main>
    </div>
  );
}
