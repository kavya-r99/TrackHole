import { useEffect } from "react";
import { Navigate } from "react-router-dom";

export default function Logout({ onLogout }) {
  useEffect(() => {
    onLogout(); // Clear role
  }, [onLogout]);

  return <Navigate to="/" replace />;
}
