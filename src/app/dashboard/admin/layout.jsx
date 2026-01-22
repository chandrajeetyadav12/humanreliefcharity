export default function AdminLayout({ children }) {
  return (
    <div className="d-flex">
      <aside className="p-3 border-end" style={{ width: 250 }}>
        <h5>Admin Panel</h5>
        <ul className="list-unstyled">
          <li><a href="/dashboard/admin/users">Users</a></li>
        </ul>
      </aside>

      <main className="flex-grow-1 p-4">{children}</main>
    </div>
  );
}
