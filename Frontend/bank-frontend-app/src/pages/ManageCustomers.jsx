import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  getAllCustomers, createCustomer, updateCustomer, deleteCustomer
} from "../api/customerApi";
import {
  getAccountsByCustomer, createAccount, updateAccount, deleteAccount
} from "../api/accountApi";
import { getAllBranches } from "../api/branchApi";

const emptyCustomer = {
  name: "", dob: "", gender: "", phone: "", email: "", address: ""
};

const emptyAccount = {
  customerId: "", branchId: "", accountType: "", balance: ""
};

export default function ManageCustomers() {
  const role = sessionStorage.getItem("role");
  const [customers, setCustomers]       = useState([]);
  const [branches, setBranches]         = useState([]);
  const [customerForm, setCustomerForm] = useState(emptyCustomer);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [customerError, setCustomerError]     = useState("");

  const [activeTab, setActiveTab] = useState("customers");

  // Account section
  const [accountForm, setAccountForm]   = useState(emptyAccount);
  const [editingAccount, setEditingAccount] = useState(null);
  const [accountError, setAccountError]     = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [accounts, setAccounts]         = useState([]);
  const [showAccountModal, setShowAccountModal] = useState(false);

  // ── Load on mount ──────────────────────────────────────
  useEffect(() => {
    const loadAll = async () => {
      try {
        const [customerData, branchData] = await Promise.all([
          getAllCustomers(),
          getAllBranches(),
        ]);
        setCustomers(customerData);
        setBranches(branchData);
      } catch {
        console.error("Failed to load data");
      }
    };
    loadAll();
  }, []);

  const fetchCustomers = async () => {
    try { const data = await getAllCustomers(); setCustomers(data); }
    catch { console.error("Failed to load customers"); }
  };

  // ── Customer Actions ───────────────────────────────────
  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    setCustomerError("");
    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer.customerId, customerForm);
        setEditingCustomer(null);
      } else {
        await createCustomer(customerForm);
      }
      setCustomerForm(emptyCustomer);
      await fetchCustomers();
      setActiveTab("customers");
    } catch {
      setCustomerError("Failed to save customer. Check all fields.");
    }
  };

  const handleEditCustomer = (c) => {
    setEditingCustomer(c);
    setCustomerForm({
      name: c.name, dob: c.dob, gender: c.gender,
      phone: c.phone, email: c.email, address: c.address,
    });
    setActiveTab("customers");
    window.scrollTo(0, 0);
  };

  const handleDeleteCustomer = async (id) => {
    if (!window.confirm("Delete this customer? All their accounts will also be removed.")) return;
    try {
      await deleteCustomer(id);
      fetchCustomers();
    } catch {
      alert("Failed to delete customer.");
    }
  };

  const cancelEditCustomer = () => {
    setEditingCustomer(null);
    setCustomerForm(emptyCustomer);
    setCustomerError("");
  };

  // ── Account Modal ──────────────────────────────────────
  const openAccountModal = async (customer) => {
    setSelectedCustomer(customer);
    setAccountForm({ ...emptyAccount, customerId: customer.customerId });
    setEditingAccount(null);
    setAccountError("");
    try {
      const data = await getAccountsByCustomer(customer.customerId);
      setAccounts(data);
    } catch {
      setAccounts([]);
    }
    setShowAccountModal(true);
  };

  const closeAccountModal = () => {
    setShowAccountModal(false);
    setSelectedCustomer(null);
    setAccounts([]);
    setAccountForm(emptyAccount);
    setEditingAccount(null);
    setAccountError("");
  };

  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    setAccountError("");
    try {
      const payload = {
        customer: { customerId: parseInt(accountForm.customerId) },
        branch:   { branchId:  parseInt(accountForm.branchId) },
        accountType: accountForm.accountType,
        balance:     parseFloat(accountForm.balance),
        createdDate: new Date().toISOString().split("T")[0],
      };
      if (editingAccount) {
        await updateAccount(editingAccount.accountId, payload);
        setEditingAccount(null);
      } else {
        await createAccount(payload);
      }
      setAccountForm({ ...emptyAccount, customerId: selectedCustomer.customerId });
      const data = await getAccountsByCustomer(selectedCustomer.customerId);
      setAccounts(data);
    } catch {
      setAccountError("Failed to save account. Check all fields.");
    }
  };

  const handleEditAccount = (acc) => {
    setEditingAccount(acc);
    setAccountForm({
      customerId:  acc.customer?.customerId || selectedCustomer.customerId,
      branchId:    acc.branch?.branchId || "",
      accountType: acc.accountType,
      balance:     acc.balance,
    });
  };

  const handleDeleteAccount = async (id) => {
    if (!window.confirm("Delete this account?")) return;
    try {
      await deleteAccount(id);
      const data = await getAccountsByCustomer(selectedCustomer.customerId);
      setAccounts(data);
    } catch {
      alert("Failed to delete account.");
    }
  };

  // ── Render ─────────────────────────────────────────────
  return (
    <div className="app-page">
      <Navbar />
      <div className="app-content container-fluid py-4 px-4">

        <div className={`role-banner ${role === "ADMIN" ? "role-banner-admin" : "role-banner-employee"}`}>
          <h4 className="role-banner-title">
            {role === "ADMIN" ? "Customer Portfolio Control" : "Customer Service Workspace"}
          </h4>
          <p className="role-banner-subtitle">
            Create and maintain customer records, then manage linked accounts efficiently.
          </p>
        </div>

        {/* Tabs */}
        <ul className="nav nav-tabs mb-3">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "customers" ? "active" : ""}`}
              onClick={() => setActiveTab("customers")}
            >👤 Customers</button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "addCustomer" ? "active" : ""}`}
              onClick={() => { setActiveTab("addCustomer"); cancelEditCustomer(); }}
            >➕ {editingCustomer ? "Edit Customer" : "Add Customer"}</button>
          </li>
        </ul>

        {/* ── CUSTOMERS LIST TAB ── */}
        {activeTab === "customers" && (
          <div className="card shadow-sm">
            <div className="card-header fw-semibold">All Customers</div>
            <div className="card-body p-0">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Gender</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.length === 0 ? (
                    <tr><td colSpan="6" className="text-center text-muted py-3">No customers found</td></tr>
                  ) : (
                    customers.map((c) => (
                      <tr key={c.customerId}>
                        <td>{c.customerId}</td>
                        <td>{c.name}</td>
                        <td>{c.gender}</td>
                        <td>{c.phone}</td>
                        <td>{c.email}</td>
                        <td className="d-flex gap-1 flex-wrap">
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => openAccountModal(c)}
                          >🏦 Accounts</button>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => { handleEditCustomer(c); setActiveTab("addCustomer"); }}
                          >Edit</button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteCustomer(c.customerId)}
                          >Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── ADD / EDIT CUSTOMER TAB ── */}
        {activeTab === "addCustomer" && (
          <div className="row justify-content-center">
            <div className="col-12 col-md-6">
              <div className="card shadow-sm">
                <div className="card-header fw-semibold">
                  {editingCustomer ? "✏️ Edit Customer" : "➕ Add Customer"}
                </div>
                <div className="card-body">
                  {customerError && <div className="alert alert-danger py-2">{customerError}</div>}
                  <form onSubmit={handleCustomerSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Full Name</label>
                      <input className="form-control" placeholder="e.g. John Doe"
                        value={customerForm.name}
                        onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                        required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Date of Birth</label>
                      <input type="date" className="form-control"
                        value={customerForm.dob}
                        onChange={(e) => setCustomerForm({ ...customerForm, dob: e.target.value })}
                        required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Gender</label>
                      <select className="form-select"
                        value={customerForm.gender}
                        onChange={(e) => setCustomerForm({ ...customerForm, gender: e.target.value })}
                        required>
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Phone</label>
                      <input className="form-control" placeholder="e.g. 9999999999"
                        value={customerForm.phone}
                        onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                        required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input type="email" className="form-control" placeholder="e.g. john@email.com"
                        value={customerForm.email}
                        onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                        required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Address</label>
                      <textarea className="form-control" rows={2} placeholder="Full address"
                        value={customerForm.address}
                        onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
                      />
                    </div>
                    <div className="d-flex gap-2">
                      <button type="submit" className="btn btn-primary flex-fill">
                        {editingCustomer ? "Update Customer" : "Add Customer"}
                      </button>
                      {editingCustomer && (
                        <button type="button" className="btn btn-secondary" onClick={cancelEditCustomer}>
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── ACCOUNT MODAL ── */}
      {showAccountModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  🏦 Accounts — {selectedCustomer?.name}
                </h5>
                <button className="btn-close" onClick={closeAccountModal} />
              </div>
              <div className="modal-body">

                {/* Account Form */}
                <div className="card mb-3">
                  <div className="card-header fw-semibold">
                    {editingAccount ? "✏️ Edit Account" : "➕ Add Account"}
                  </div>
                  <div className="card-body">
                    {accountError && <div className="alert alert-danger py-2">{accountError}</div>}
                    <form onSubmit={handleAccountSubmit}>
                      <div className="row g-3">
                        <div className="col-md-4">
                          <label className="form-label">Account Type</label>
                          <select className="form-select"
                            value={accountForm.accountType}
                            onChange={(e) => setAccountForm({ ...accountForm, accountType: e.target.value })}
                            required>
                            <option value="">Select type</option>
                            <option value="SAVINGS">Savings</option>
                            <option value="CURRENT">Current</option>
                            <option value="FIXED">Fixed Deposit</option>
                          </select>
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Initial Balance (₹)</label>
                          <input type="number" className="form-control" placeholder="e.g. 5000"
                            value={accountForm.balance}
                            onChange={(e) => setAccountForm({ ...accountForm, balance: e.target.value })}
                            required />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Branch</label>
                          <select className="form-select"
                            value={accountForm.branchId}
                            onChange={(e) => setAccountForm({ ...accountForm, branchId: e.target.value })}
                            required>
                            <option value="">Select branch</option>
                            {branches.map((b) => (
                              <option key={b.branchId} value={b.branchId}>
                                {b.branchName} — {b.city}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="d-flex gap-2 mt-3">
                        <button type="submit" className="btn btn-primary">
                          {editingAccount ? "Update Account" : "Add Account"}
                        </button>
                        {editingAccount && (
                          <button type="button" className="btn btn-secondary"
                            onClick={() => { setEditingAccount(null); setAccountForm({ ...emptyAccount, customerId: selectedCustomer.customerId }); }}>
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>

                {/* Accounts Table */}
                <table className="table table-bordered mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Account ID</th>
                      <th>Type</th>
                      <th>Balance</th>
                      <th>Branch</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.length === 0 ? (
                      <tr><td colSpan="5" className="text-center text-muted py-3">No accounts yet</td></tr>
                    ) : (
                      accounts.map((acc) => (
                        <tr key={acc.accountId}>
                          <td>{acc.accountId}</td>
                          <td>{acc.accountType}</td>
                          <td>₹{acc.balance.toLocaleString()}</td>
                          <td>{acc.branch?.branchName}</td>
                          <td className="d-flex gap-1">
                            <button className="btn btn-sm btn-outline-primary"
                              onClick={() => handleEditAccount(acc)}>Edit</button>
                            <button className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteAccount(acc.accountId)}>Delete</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeAccountModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}