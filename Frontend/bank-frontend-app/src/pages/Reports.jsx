import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getSummary, getBranchSummary, getRecentTransactions } from "../api/reportApi";
import { getAllLoans } from "../api/loanApi";

export default function Reports() {
  const role = sessionStorage.getItem("role");
  const [summary, setSummary]               = useState(null);
  const [branchSummary, setBranchSummary]   = useState([]);
  const [recentTxns, setRecentTxns]         = useState([]);
  const [loans, setLoans]                   = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState("");

  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      try {
        const [summaryData, branchData, txnData, loanData] = await Promise.all([
          getSummary(),
          getBranchSummary(),
          getRecentTransactions(),
          getAllLoans(),
        ]);
        setSummary(summaryData);
        setBranchSummary(branchData);
        setRecentTxns(txnData);
        setLoans(loanData);
      } catch {
        setError("Failed to load report data. Make sure backend is running.");
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  // ── Loan calculations ──────────────────────────────────
  const totalLoanAmount = loans.reduce((sum, l) => sum + (l.amount || 0), 0);
  const loanTypes = loans.reduce((acc, l) => {
    acc[l.loanType] = (acc[l.loanType] || 0) + 1;
    return acc;
  }, {});

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
      <div className="app-content container-fluid py-4 px-4">

        <div className={`role-banner ${role === "ADMIN" ? "role-banner-admin" : "role-banner-employee"}`}>
          <h4 className="role-banner-title">
            {role === "ADMIN" ? "Executive Insights Board" : "Operational Insights Board"}
          </h4>
          <p className="role-banner-subtitle">
            Review branch performance, transactions, and loan trends with live figures.
          </p>
        </div>

        <h4 className="fw-bold mb-4">📊 Reports</h4>

        {error && <div className="alert alert-danger">{error}</div>}

        {/* Summary Cards */}
        {summary && (
          <div className="row g-3 mb-4">
            {[
              { label: "Total Customers", value: summary.totalCustomers, color: "primary",  icon: "👤" },
              { label: "Total Accounts",  value: summary.totalAccounts,  color: "success",  icon: "🏦" },
              { label: "Total Branches",  value: summary.totalBranches,  color: "warning",  icon: "🌿" },
              { label: "Total Employees", value: summary.totalEmployees, color: "info",     icon: "👷" },
              { label: "Total Loans",     value: loans.length,           color: "danger",   icon: "💰" },
              { label: "Loan Amount",     value: `₹${totalLoanAmount.toLocaleString()}`, color: "secondary", icon: "📋" },
            ].map((card) => (
              <div className="col-6 col-md-4 col-lg-2" key={card.label}>
                <div className={`card text-white bg-${card.color} h-100`}>
                  <div className="card-body py-3">
                    <div className="fs-3">{card.icon}</div>
                    <div className="fs-5 fw-bold">{card.value}</div>
                    <div className="small">{card.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <ul className="nav nav-tabs mb-3">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >🌿 Branch Summary</button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "transactions" ? "active" : ""}`}
              onClick={() => setActiveTab("transactions")}
            >💸 Recent Transactions</button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "loans" ? "active" : ""}`}
              onClick={() => setActiveTab("loans")}
            >💰 Loans</button>
          </li>
        </ul>

        {/* ── BRANCH SUMMARY TAB ── */}
        {activeTab === "overview" && (
          <div className="card shadow-sm">
            <div className="card-header fw-semibold">Branch-wise Summary</div>
            <div className="card-body p-0">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Branch</th>
                    <th>City</th>
                    <th>Total Accounts</th>
                    <th>Total Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {branchSummary.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-3">
                        No branch data available
                      </td>
                    </tr>
                  ) : (
                    branchSummary.map((b, index) => (
                      <tr key={index}>
                        <td className="fw-semibold">{b.branchName}</td>
                        <td>{b.city}</td>
                        <td>
                          <span className="badge bg-primary">{b.totalAccounts}</span>
                        </td>
                        <td className="text-success fw-semibold">
                          ₹{b.totalBalance?.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── RECENT TRANSACTIONS TAB ── */}
        {activeTab === "transactions" && (
          <div className="card shadow-sm">
            <div className="card-header fw-semibold">
              Last 10 Transactions — System Wide
            </div>
            <div className="card-body p-0">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Account ID</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTxns.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center text-muted py-3">
                        No transactions found
                      </td>
                    </tr>
                  ) : (
                    recentTxns.map((t) => (
                      <tr key={t.transactionId}>
                        <td>{t.transactionId}</td>
                        <td>{t.account?.accountId}</td>
                        <td>
                          <span className={`badge ${t.transactionType === "DEPOSIT" ? "bg-success" : "bg-danger"}`}>
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
        )}

        {/* ── LOANS TAB ── */}
        {activeTab === "loans" && (
          <div className="row g-4">

            {/* Loan type breakdown */}
            <div className="col-12 col-md-4">
              <div className="card shadow-sm h-100">
                <div className="card-header fw-semibold">Loan Type Breakdown</div>
                <div className="card-body">
                  {Object.keys(loanTypes).length === 0 ? (
                    <p className="text-muted">No loans found</p>
                  ) : (
                    Object.entries(loanTypes).map(([type, count]) => (
                      <div key={type} className="d-flex justify-content-between align-items-center mb-2">
                        <span>{type}</span>
                        <span className="badge bg-danger">{count} loan{count > 1 ? "s" : ""}</span>
                      </div>
                    ))
                  )}
                  <hr />
                  <div className="d-flex justify-content-between fw-bold">
                    <span>Total Amount</span>
                    <span className="text-danger">₹{totalLoanAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* All Loans Table */}
            <div className="col-12 col-md-8">
              <div className="card shadow-sm">
                <div className="card-header fw-semibold">All Loans</div>
                <div className="card-body p-0">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Customer ID</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Interest %</th>
                        <th>Start Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loans.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center text-muted py-3">
                            No loans found
                          </td>
                        </tr>
                      ) : (
                        loans.map((l) => (
                          <tr key={l.loanId}>
                            <td>{l.loanId}</td>
                            <td>{l.customer?.customerId}</td>
                            <td>{l.loanType}</td>
                            <td>₹{l.amount?.toLocaleString()}</td>
                            <td>{l.interestRate}%</td>
                            <td>{l.startDate}</td>
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