import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getAccountsByCustomer } from "../api/accountApi";
import { createTransaction, getTransactionsByAccount } from "../api/transactionApi";
import axiosInstance from "../api/axiosInstance";

export default function CustomerPortal() {
  const customerId = sessionStorage.getItem("referenceId");
  const name       = sessionStorage.getItem("name");

  const [accounts, setAccounts]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState("");

  // Transfer
  const [fromAccountId, setFromAccountId] = useState("");
  const [toAccountId, setToAccountId]     = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferError, setTransferError] = useState("");
  const [transferSuccess, setTransferSuccess] = useState("");
  const [transferLoading, setTransferLoading] = useState(false);

  // Transactions
  const [transactions, setTransactions]   = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [txnLoading, setTxnLoading]       = useState(false);

  const [activeTab, setActiveTab]         = useState("accounts");

  // ── Load accounts ──────────────────────────────────────
  useEffect(() => {
    const loadAccounts = async () => {
      setLoading(true);
      try {
        const data = await getAccountsByCustomer(customerId);
        setAccounts(data);
      } catch {
        setError("Failed to load your accounts.");
      } finally {
        setLoading(false);
      }
    };
    loadAccounts();
  }, [customerId]);

  const refreshAccounts = async () => {
    try {
      const data = await getAccountsByCustomer(customerId);
      setAccounts(data);
    } catch {
      console.error("Failed to refresh accounts");
    }
  };

  // ── View transactions for an account ──────────────────
  const handleViewTransactions = async (accountId) => {
    setSelectedAccountId(accountId);
    setTxnLoading(true);
    setActiveTab("transactions");
    try {
      const data = await getTransactionsByAccount(accountId);
      setTransactions(data);
    } catch {
      setTransactions([]);
    } finally {
      setTxnLoading(false);
    }
  };

  // ── Transfer money ─────────────────────────────────────
  const handleTransfer = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (transferLoading) return;
    setTransferError("");
    setTransferSuccess("");

    const amount = parseFloat(transferAmount);

    if (!fromAccountId) {
      setTransferError("Please select your account to transfer from.");
      return;
    }

    if (fromAccountId === toAccountId) {
      setTransferError("From and To accounts cannot be the same.");
      return;
    }

    if (amount <= 0) {
      setTransferError("Amount must be greater than 0.");
      return;
    }

    // Check balance
    const fromAccount = accounts.find(
      (a) => a.accountId === parseInt(fromAccountId)
    );
    if (fromAccount && amount > fromAccount.balance) {
      setTransferError("Insufficient balance.");
      return;
    }

    setTransferLoading(true);
    try {
      // Check if target account exists
      await axiosInstance.get(`/accounts/${toAccountId}`);

      // Debit from sender
      await createTransaction({
        account: { accountId: parseInt(fromAccountId) },
        transactionType: "Debit",
        amount: amount,
        transactionDate: new Date().toISOString(),
      });

      // Credit to receiver
      await createTransaction({
        account: { accountId: parseInt(toAccountId) },
        transactionType: "Credit",
        amount: amount,
        transactionDate: new Date().toISOString(),
      });

      setTransferSuccess(
        `✅ ₹${amount.toLocaleString()} transferred successfully to Account #${toAccountId}!`
      );
      setTransferAmount("");
      setToAccountId("");
      setFromAccountId("");
      refreshAccounts();
    } catch {
      setTransferError("Transfer failed. Check the target Account ID and try again.");
    } finally {
      setTransferLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="app-page">
        <Navbar />
        <div className="app-content d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
          <div className="spinner-border text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="app-page">
      <Navbar />
      <div className="app-content container py-4">

        <div className="role-banner role-banner-customer">
          <h4 className="role-banner-title">Personal Banking Hub</h4>
          <p className="role-banner-subtitle">
            Track your balances, transfer funds, and review account activity in real time.
          </p>
        </div>

        {/* Welcome */}
        <div className="alert alert-primary d-flex align-items-center mb-4">
          <span className="fs-4 me-3">👋</span>
          <div>
            <div className="fw-bold fs-5">Welcome, {name}!</div>
            <div className="small">Here are your accounts and banking options.</div>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {/* Tabs */}
        <ul className="nav nav-tabs mb-3">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "accounts" ? "active" : ""}`}
              onClick={() => setActiveTab("accounts")}
            >🏦 My Accounts</button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "transfer" ? "active" : ""}`}
              onClick={() => setActiveTab("transfer")}
            >💸 Transfer Money</button>
          </li>
          {selectedAccountId && (
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "transactions" ? "active" : ""}`}
                onClick={() => setActiveTab("transactions")}
              >🕓 Transactions #{selectedAccountId}</button>
            </li>
          )}
        </ul>

        {/* ── MY ACCOUNTS TAB ── */}
        {activeTab === "accounts" && (
          <div className="row g-3">
            {accounts.length === 0 ? (
              <div className="col-12">
                <div className="alert alert-warning">
                  You have no accounts yet. Please contact your branch.
                </div>
              </div>
            ) : (
              accounts.map((acc) => (
                <div className="col-12 col-md-6 col-lg-4" key={acc.accountId}>
                  <div className="card shadow-sm h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <span className="badge bg-primary">{acc.accountType}</span>
                        <span className="text-muted small">ID: #{acc.accountId}</span>
                      </div>
                      <div className="fs-4 fw-bold text-success mb-1">
                        ₹{acc.balance?.toLocaleString()}
                      </div>
                      <div className="text-muted small mb-3">
                        🌿 {acc.branch?.branchName} — {acc.branch?.city}
                      </div>
                      <div className="text-muted small mb-3">
                        📅 Opened: {acc.createdDate}
                      </div>
                      <button
                        className="btn btn-outline-primary btn-sm w-100"
                        onClick={() => handleViewTransactions(acc.accountId)}
                      >
                        View Transactions
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── TRANSFER TAB ── */}
        {activeTab === "transfer" && (
          <div className="row justify-content-center">
            <div className="col-12 col-md-6">
              <div className="card shadow-sm">
                <div className="card-header fw-semibold">💸 Transfer Money</div>
                <div className="card-body">
                  {transferError   && <div className="alert alert-danger  py-2">{transferError}</div>}
                  {transferSuccess && <div className="alert alert-success py-2">{transferSuccess}</div>}
                  <form onSubmit={handleTransfer}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">From Account</label>
                      <select
                        className="form-select"
                        value={fromAccountId}
                        onChange={(e) => setFromAccountId(e.target.value)}
                        required
                      >
                        <option value="">Select your account</option>
                        {accounts.map((acc) => (
                          <option key={acc.accountId} value={acc.accountId}>
                            #{acc.accountId} — {acc.accountType} — ₹{acc.balance?.toLocaleString()}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">To Account ID</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Enter target account ID"
                        value={toAccountId}
                        onChange={(e) => setToAccountId(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="form-label fw-semibold">Amount (₹)</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Enter amount"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                        min="1"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary w-100"
                      disabled={transferLoading}
                    >
                      {transferLoading ? (
                        <><span className="spinner-border spinner-border-sm me-2" />Processing...</>
                      ) : "Transfer Money"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TRANSACTIONS TAB ── */}
        {activeTab === "transactions" && (
          <div className="card shadow-sm">
            <div className="card-header fw-semibold">
              🕓 Transactions for Account #{selectedAccountId}
            </div>
            <div className="card-body p-0">
              {txnLoading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" />
                </div>
              ) : (
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center text-muted py-3">
                          No transactions found
                        </td>
                      </tr>
                    ) : (
                      transactions.map((t) => (
                        <tr key={t.transactionId}>
                          <td>{t.transactionId}</td>
                          <td>
                            <span className={`badge ${t.transactionType === "Credit" ? "bg-success" : "bg-danger"}`}>
                              {t.transactionType}
                            </span>
                          </td>
                          <td>₹{t.amount?.toLocaleString()}</td>
                          <td>{new Date(t.transactionDate).toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}