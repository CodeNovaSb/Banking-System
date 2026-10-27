import { useState } from "react";
import Navbar from "../components/Navbar";
import { getTransactionsByAccount, createTransaction } from "../api/transactionApi";
// import { getAccountsByCustomer } from "../api/accountApi";
import axiosInstance from "../api/axiosInstance";

export default function ProcessTransaction() {
  const [accountId, setAccountId]       = useState("");
  const [accountInfo, setAccountInfo]   = useState(null);
  const [accountError, setAccountError] = useState("");

  const [txnType, setTxnType]   = useState("Credit");
  const [amount, setAmount]     = useState("");
  const [txnError, setTxnError] = useState("");
  const [txnSuccess, setTxnSuccess] = useState("");
  const [loading, setLoading]   = useState(false);

  const [transactions, setTransactions] = useState([]);

  // ── Search Account ─────────────────────────────────────
  const handleSearchAccount = async (e) => {
    e.preventDefault();
    setAccountError("");
    setAccountInfo(null);
    setTransactions([]);
    setTxnError("");
    setTxnSuccess("");

    try {
      const response = await axiosInstance.get(`/accounts/${accountId}`);
      setAccountInfo(response.data);
      const txns = await getTransactionsByAccount(accountId);
      setTransactions(txns);
    } catch {
      setAccountError("Account not found. Please check the Account ID.");
    }
  };

  // ── Submit Transaction ─────────────────────────────────
  const handleTransaction = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
    setTxnError("");
    setTxnSuccess("");

    const parsedAmount = parseFloat(amount);

    if (parsedAmount <= 0) {
      setTxnError("Amount must be greater than 0.");
      return;
    }

    if (txnType === "Debit" && parsedAmount > accountInfo.balance) {
      setTxnError("Insufficient balance for this withdrawal.");
      return;
    }

    setLoading(true);
    try {
      await createTransaction({
        account: { accountId: parseInt(accountId) },
        transactionType: txnType,
        amount: parsedAmount,
        transactionDate: new Date().toISOString(),
      });

      // Refresh account info and transactions
      const response = await axiosInstance.get(`/accounts/${accountId}`);
      setAccountInfo(response.data);
      const txns = await getTransactionsByAccount(accountId);
      setTransactions(txns);

      setTxnSuccess(`${txnType === "Credit" ? "Credit" : "Withdrawal"} of ₹${parsedAmount.toLocaleString()} successful!`);
      setAmount("");
    } catch {
      setTxnError("Transaction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────
  return (
    <div className="app-page">
      <Navbar />
      <div className="app-content container py-4">

        <div className="role-banner role-banner-employee">
          <h4 className="role-banner-title">Teller Transaction Desk</h4>
          <p className="role-banner-subtitle">
            Verify accounts quickly and process deposits or withdrawals with confidence.
          </p>
        </div>

        <h4 className="fw-bold mb-4">💸 Process Transaction</h4>

        {/* Search Account */}
        <div className="card shadow-sm mb-4">
          <div className="card-header fw-semibold">Step 1 — Find Account</div>
          <div className="card-body">
            <form onSubmit={handleSearchAccount} className="d-flex gap-2">
              <input
                type="number"
                className="form-control"
                placeholder="Enter Account ID"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary px-4">
                Search
              </button>
            </form>
            {accountError && (
              <div className="alert alert-danger mt-3 mb-0 py-2">{accountError}</div>
            )}
          </div>
        </div>

        {/* Account Info */}
        {accountInfo && (
          <>
            <div className="card shadow-sm mb-4 border-success">
              <div className="card-header fw-semibold bg-success text-white">
                ✅ Account Found
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-6 col-md-3">
                    <div className="text-muted small">Account ID</div>
                    <div className="fw-bold">{accountInfo.accountId}</div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="text-muted small">Account Type</div>
                    <div className="fw-bold">{accountInfo.accountType}</div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="text-muted small">Branch</div>
                    <div className="fw-bold">{accountInfo.branch?.branchName}</div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="text-muted small">Current Balance</div>
                    <div className="fw-bold text-success fs-5">
                      ₹{accountInfo.balance?.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Form */}
            <div className="card shadow-sm mb-4">
              <div className="card-header fw-semibold">Step 2 — Process Transaction</div>
              <div className="card-body">
                {txnError   && <div className="alert alert-danger  py-2">{txnError}</div>}
                {txnSuccess && <div className="alert alert-success py-2">{txnSuccess}</div>}
                <form onSubmit={handleTransaction}>
                  <div className="row g-3 align-items-end">
                    <div className="col-12 col-md-4">
                      <label className="form-label fw-semibold">Transaction Type</label>
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className={`btn flex-fill ${txnType === "Credit" ? "btn-success" : "btn-outline-success"}`}
                          onClick={() => setTxnType("Credit")}
                        >
                          ⬆️ Credit
                        </button>
                        <button
                          type="button"
                          className={`btn flex-fill ${txnType === "Debit" ? "btn-danger" : "btn-outline-danger"}`}
                          onClick={() => setTxnType("Debit")}
                        >
                          ⬇️ Debit
                        </button>
                      </div>
                    </div>
                    <div className="col-12 col-md-5">
                      <label className="form-label fw-semibold">Amount (₹)</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        min="1"
                        required
                      />
                    </div>
                    <div className="col-12 col-md-3">
                      <button
                        type="submit"
                        className={`btn w-100 ${txnType === "Credit" ? "btn-success" : "btn-danger"}`}
                        disabled={loading}
                      >
                        {loading ? (
                          <><span className="spinner-border spinner-border-sm me-2" />Processing...</>
                        ) : (
                          `Confirm ${txnType === "Credit" ? "Credit" : "Debit"}`
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="card shadow-sm">
              <div className="card-header fw-semibold">
                🕓 Recent Transactions for Account #{accountId}
              </div>
              <div className="card-body p-0">
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
                          No transactions yet
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
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}