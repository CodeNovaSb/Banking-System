// // import { useState } from 'react'
// //import './App.css'
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import AdminDashboard from "./pages/AdminDashboard";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Login from "./pages/Login";

// export default function App() {
//   // const [count, setCount] = useState(0)

//   return (
//    <BrowserRouter>
//    <Routes>
//       <Route path="/" element={<Navigate to="/login" />} />
//         <Route path="/login" element={<Login />} />
//    </Routes>
//    <Route path="/admin/dashboard" element={
//   <ProtectedRoute allowed={["ADMIN"]}>
//     <AdminDashboard />
//   </ProtectedRoute>
// } />
//    </BrowserRouter>
//   );
// }
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Hero from "./pages/Hero";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ManageCustomers from "./pages/ManageCustomers";
import ProcessTransaction from "./pages/ProcessTransaction";
import ProtectedRoute from "./components/ProtectedRoute";
import Reports from "./pages/Reports";
import CustomerPortal from "./pages/CustomerPortal";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/login" element={<Login />} />

        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowed={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="/manage/customers" element={
          <ProtectedRoute allowed={["ADMIN", "EMPLOYEE"]}>
            <ManageCustomers />
          </ProtectedRoute>
        } />

        <Route path="/employee/transactions" element={
          <ProtectedRoute allowed={["EMPLOYEE"]}>
            <ProcessTransaction />
          </ProtectedRoute>
        } />

        {/* Uncomment as we build: */}
       <Route path="/reports" element={
        <ProtectedRoute allowed={["ADMIN","EMPLOYEE"]}>
          <Reports />
          </ProtectedRoute>} />
        <Route path="/customer/portal" element={
          <ProtectedRoute allowed={["CUSTOMER"]}>
            <CustomerPortal />
            </ProtectedRoute>} />

      </Routes>
    </BrowserRouter>
  );
}