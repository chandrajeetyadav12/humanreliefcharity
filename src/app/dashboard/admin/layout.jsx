
export default function AdminLayout({ children }) {
  return (
    <div className="d-block d-lg-flex flex-grow-1 min-vh-100 admin-main">
      <aside className="p-3 border-end bg-light userLayoutAside">
        <h5>Admin Panel</h5>
        <ul className="list-unstyled userAsideUL">
          <li><a href="/dashboard/admin/users">Users</a></li>
          <li><a href="/dashboard/admin/profile">Profile</a></li>
          <li><a href="/dashboard/admin/pending-avedan">pending-avedan</a></li>


        </ul>
      </aside>

      <main className="flex-grow-1 p-4">{children}</main>
    </div>
  );
}
