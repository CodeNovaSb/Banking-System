import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getSummary } from "../api/reportApi";
import { getAllBranches, createBranch, updateBranch, deleteBranch } from "../api/branchApi";
import { getAllEmployees, createEmployee } from "../api/employeeApi";

export default function AdminDashboard() {
  // Summary
  const [summary, setSummary] = useState({
    totalCustomers: 0,
    totalAccounts: 0,
    totalBranches: 0,
    totalEmployees: 0,
  });

  // Branches
  const [branches, setBranches] = useState([]);
  const [branchForm, setBranchForm] = useState({ branchName: "", city: "" });
  const [editingBranch, setEditingBranch] = useState(null);
  const [branchError, setBranchError] = useState("");

  // Employees
  const [employees, setEmployees] = useState([]);
  const [empForm, setEmpForm] = useState({
    name: "", role: "", salary: "", branchId: ""
  });
  const [empError, setEmpError] = useState("");

  // Active tab
  const [activeTab, setActiveTab] = useState("branches");

  // ─── Load data on mount ───────────────────────────────


  const fetchSummary = async () => {
    try {
      const data = await getSummary();
      setSummary(data);
    } catch {
      console.error("Failed to load summary");
    }
  };

  const fetchBranches = async () => {
    try {
      const data = await getAllBranches();
      setBranches(data);
    } catch {
      console.error("Failed to load branches");
    }
  };

  const fetchEmployees = async () => {
    try {
      const data = await getAllEmployees();
      setEmployees(data);
    } catch {
      console.error("Failed to load employees");
    }
  };
    useEffect(() => {
    fetchSummary();
    fetchBranches();
    fetchEmployees();
  }, []);
  // ─── Branch Actions ───────────────────────────────────
  const handleBranchSubmit = async (e) => {
    e.preventDefault();
    setBranchError("");
    try {
      if (editingBranch) {
        await updateBranch(editingBranch.branchId, branchForm);
        setEditingBranch(null);
      } else {
        await createBranch(branchForm);
      }
      setBranchForm({ branchName: "", city: "" });
      fetchBranches();
      fetchSummary();
    } catch {
      setBranchError("Failed to save branch. Check your input.");
    }
  };

  const handleEditBranch = (branch) => {
    setEditingBranch(branch);
    setBranchForm({ branchName: branch.branchName, city: branch.city });
  };

  const handleDeleteBranch = async (id) => {
    if (!window.confirm("Delete this branch?")) return;
    try {
      await deleteBranch(id);
      fetchBranches();
      fetchSummary();
    } catch {
      alert("Failed to delete branch. It may have linked accounts or employees.");
    }
  };

  const cancelEditBranch = () => {
    setEditingBranch(null);
    setBranchForm({ branchName: "", city: "" });
    setBranchError("");
  };

  // ─── Employee Actions ─────────────────────────────────
  const handleEmpSubmit = async (e) => {
    e.preventDefault();
    setEmpError("");
    try {
      await createEmployee({
        name: empForm.name,
        role: empForm.role,
        salary: parseFloat(empForm.salary),
        branch: { branchId: parseInt(empForm.branchId) },
      });
      setEmpForm({ name: "", role: "", salary: "", branchId: "" });
      fetchEmployees();
      fetchSummary();
    } catch {
      setEmpError("Failed to create employee. Check all fields.");
    }
  };

  // ─── Render ───────────────────────────────────────────
  return (
    <div className="app-page">
      <Navbar />

      <div className="app-content container-fluid py-4 px-4">

        <div className="role-banner role-banner-admin">
          <h4 className="role-banner-title">Admin Command Center</h4>
          <p className="role-banner-subtitle">
            Monitor operations, manage branches, and onboard employees from one place.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="row g-3 mb-4">
          {[
            { label: "Total Customers", value: summary.totalCustomers, color: "primary", icon: "👤" },
            { label: "Total Accounts",  value: summary.totalAccounts,  color: "success", icon: "🏦" },
            { label: "Total Branches",  value: summary.totalBranches,  color: "warning", icon: "🌿" },
            { label: "Total Employees", value: summary.totalEmployees, color: "info",    icon: "👷" },
          ].map((card) => (
            <div className="col-12 col-sm-6 col-md-3" key={card.label}>
              <div className={`card text-white bg-${card.color} h-100`}>
                <div className="card-body">
                  <div className="fs-2">{card.icon}</div>
                  <div className="fs-4 fw-bold">{card.value}</div>
                  <div>{card.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <ul className="nav nav-tabs mb-3">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "branches" ? "active" : ""}`}
              onClick={() => setActiveTab("branches")}
            >
              🌿 Branches
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "employees" ? "active" : ""}`}
              onClick={() => setActiveTab("employees")}
            >
              👷 Employees
            </button>
          </li>
        </ul>

        {/* ── BRANCHES TAB ── */}
        {activeTab === "branches" && (
          <div className="row g-4">

            {/* Branch Form */}
            <div className="col-12 col-md-4">
              <div className="card shadow-sm">
                <div className="card-header fw-semibold">
                  {editingBranch ? "✏️ Edit Branch" : "➕ Add Branch"}
                </div>
                <div className="card-body">
                  {branchError && <div className="alert alert-danger py-2">{branchError}</div>}
                  <form onSubmit={handleBranchSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Branch Name</label>
                      <input
                        className="form-control"
                        placeholder="e.g. Main Branch"
                        value={branchForm.branchName}
                        onChange={(e) => setBranchForm({ ...branchForm, branchName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">City</label>
                      <input
                        className="form-control"
                        placeholder="e.g. Chennai"
                        value={branchForm.city}
                        onChange={(e) => setBranchForm({ ...branchForm, city: e.target.value })}
                        required
                      />
                    </div>
                    <div className="d-flex gap-2">
                      <button type="submit" className="btn btn-primary flex-fill">
                        {editingBranch ? "Update" : "Add Branch"}
                      </button>
                      {editingBranch && (
                        <button type="button" className="btn btn-secondary" onClick={cancelEditBranch}>
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Branch Table */}
            <div className="col-12 col-md-8">
              <div className="card shadow-sm">
                <div className="card-header fw-semibold">All Branches</div>
                <div className="card-body p-0">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Branch Name</th>
                        <th>City</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {branches.length === 0 ? (
                        <tr><td colSpan="4" className="text-center text-muted py-3">No branches found</td></tr>
                      ) : (
                        branches.map((b) => (
                          <tr key={b.branchId}>
                            <td>{b.branchId}</td>
                            <td>{b.branchName}</td>
                            <td>{b.city}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-outline-primary me-2"
                                onClick={() => handleEditBranch(b)}
                              >Edit</button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteBranch(b.branchId)}
                              >Delete</button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ── EMPLOYEES TAB ── */}
        {activeTab === "employees" && (
          <div className="row g-4">

            {/* Employee Form */}
            <div className="col-12 col-md-4">
              <div className="card shadow-sm">
                <div className="card-header fw-semibold">➕ Add Employee</div>
                <div className="card-body">
                  {empError && <div className="alert alert-danger py-2">{empError}</div>}
                  <form onSubmit={handleEmpSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input
                        className="form-control"
                        placeholder="Employee name"
                        value={empForm.name}
                        onChange={(e) => setEmpForm({ ...empForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Role</label>
                      <select
                        className="form-select"
                        value={empForm.role}
                        onChange={(e) => setEmpForm({ ...empForm, role: e.target.value })}
                        required
                      >
                        <option value="">Select role</option>
                        <option value="MANAGER">Manager</option>
                        <option value="TELLER">Teller</option>
                        <option value="LOAN_OFFICER">Loan Officer</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Salary</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="e.g. 50000"
                        value={empForm.salary}
                        onChange={(e) => setEmpForm({ ...empForm, salary: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Branch</label>
                      <select
                        className="form-select"
                        value={empForm.branchId}
                        onChange={(e) => setEmpForm({ ...empForm, branchId: e.target.value })}
                        required
                      >
                        <option value="">Select branch</option>
                        {branches.map((b) => (
                          <option key={b.branchId} value={b.branchId}>{b.branchName} — {b.city}</option>
                        ))}
                      </select>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                      Add Employee
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Employee Table */}
            <div className="col-12 col-md-8">
              <div className="card shadow-sm">
                <div className="card-header fw-semibold">All Employees</div>
                <div className="card-body p-0">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Salary</th>
                        <th>Branch</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.length === 0 ? (
                        <tr><td colSpan="5" className="text-center text-muted py-3">No employees found</td></tr>
                      ) : (
                        employees.map((emp) => (
                          <tr key={emp.employeeId}>
                            <td>{emp.employeeId}</td>
                            <td>{emp.name}</td>
                            <td>{emp.role}</td>
                            <td>₹{emp.salary.toLocaleString()}</td>
                            <td>{emp.branch?.branchName}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}