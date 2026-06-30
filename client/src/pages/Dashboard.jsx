import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SuperAdminDashboard from "../components/Dashboard/SuperAdminDashboard";
import BarberoDashboard from "../components/Dashboard/BarberoDashboard";

export default function Dashboard() {
    const navigate = useNavigate();
    const { barbero, usuario, token } = useAuth();
    
    useEffect(() => {
        if (!token) {
            navigate("/admins-panel");
        }
    }, [token, navigate]);
    if (!token) return null;

    if (usuario?.rol === "SUPER_ADMIN") {
        return <SuperAdminDashboard />;
    }

    if (barbero) {
        return <BarberoDashboard />;
    }
    // Token presente pero ni superAdmin ni barbero reconocido → redirigir
    navigate("/admins-panel");
    return null;
}