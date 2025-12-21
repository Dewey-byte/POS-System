import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import POS from "./pages/POS";
import Products from "./pages/Products";
import SalesHistory from "./pages/SalesHistory";
import Users from "./pages/Users";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/pos" element={<POS />} />
      <Route path="/products" element={<Products />} />
      <Route path="/sales" element={<SalesHistory />} />
      <Route path="/users" element={<Users />} />
    </Routes>
  );
}
