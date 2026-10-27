import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(username, password);

      sessionStorage.setItem("role", data.role);
      sessionStorage.setItem("name", data.username);
      sessionStorage.setItem("referenceId", data.referenceId);

      if (data.role === "ADMIN") navigate("/admin/dashboard");
      else if (data.role === "EMPLOYEE") navigate("/employee/transactions");
      else if (data.role === "CUSTOMER") navigate("/customer/portal");
      else setError("Unknown role. Contact administrator.");

    } catch (err) {
      setError(err.response?.data?.message || "Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-page d-flex justify-content-center align-items-center px-3">
      <div className="card shadow app-content" style={{ width: "100%", maxWidth: "420px" }}>
        <div className="card-body p-4">

          <div className="text-center mb-4">
            <h2 className="fw-bold text-primary">🏦 BankSystem</h2>
            <p className="text-muted mb-0">Sign in to your account</p>
          </div>

          {error && (
            <div className="alert alert-danger py-2">{error}</div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Username</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Signing in...
                </>
              ) : "Sign In"}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}