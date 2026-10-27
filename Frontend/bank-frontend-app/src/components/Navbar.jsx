import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const name = sessionStorage.getItem("name");
  const role = sessionStorage.getItem("role");

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const navLinks = [
    { path: "/admin/dashboard",       label: "Dashboard",    roles: ["ADMIN"] },
    { path: "/manage/customers",      label: "Customers",    roles: ["ADMIN", "EMPLOYEE"] },
    { path: "/employee/transactions", label: "Transactions", roles: ["EMPLOYEE"] },
    { path: "/reports",               label: "Reports",      roles: ["ADMIN", "EMPLOYEE"] },
    { path: "/customer/portal",       label: "My Portal",    roles: ["CUSTOMER"] },
  ];

  return (
    <nav className="navbar navbar-expand navbar-dark bg-primary px-4">
      <span className="navbar-brand fw-bold">🏦 BankSystem</span>

      {/* Nav Links */}
      <div className="navbar-nav me-auto">
        {navLinks
          .filter((link) => link.roles.includes(role))
          .map((link) => (
            <button
              key={link.path}
              className={`nav-link btn btn-link text-white text-decoration-none
                ${location.pathname === link.path ? "fw-bold text-decoration-underline" : ""}`}
              onClick={() => navigate(link.path)}
            >
              {link.label}
            </button>
          ))}
      </div>

      {/* Right side — name, role, logout */}
      <div className="d-flex align-items-center gap-3">
        <span className="text-white">
          {name} &nbsp;
          <span className="badge bg-light text-primary">{role}</span>
        </span>
        <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}