import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toggleAgenda, updateHorarios } from "../../api";
import PanelServicios from "./PanelServicios";
import { IconCalendar, IconLock, IconUnlock } from "./icons";

const hoy = new Date().toISOString().split("T")[0];

export default function BarberoDashboard() {
    const navigate = useNavigate();
    const { barbero, token, actualizarBarbero, logout } = useAuth();

    const [turnos, setTurnos] = useState([]);
    const [fecha, setFecha] = useState(hoy);
    const [loading, setLoading] = useState(false);
    const [toggling, setToggling] = useState(false);

    const [horarioEntrada, setHorarioEntrada] = useState("09:00");
    const [horarioSalida, setHorarioSalida] = useState("20:00");
    const [savingHorarios, setSavingHorarios] = useState(false);

    useEffect(() => {
        if (!token || !barbero) {
            navigate("/admins-panel");
            return;
        }
        setHorarioEntrada(barbero.horarioEntrada || "09:00");
        setHorarioSalida(barbero.horarioSalida || "20:00");
        fetchTurnos(barbero.id, hoy, token);
    }, [navigate, token, barbero]);

    const fetchTurnos = async (barberoId, f, tok) => {
        setLoading(true);
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL || "http://localhost:3001"}/turnos/barbero/${barberoId}?fecha=${f}`,
                { headers: { Authorization: `Bearer ${tok}` } }
            );
            const data = await res.json();
            setTurnos(Array.isArray(data) ? data : []);
        } catch {
            setTurnos([]);
        }
        setLoading(false);
    };

    const handleFecha = (f) => {
        setFecha(f);
        if (barbero && token) fetchTurnos(barbero.id, f, token);
    };

    const handleToggleAgenda = async () => {
        setToggling(true);
        try {
            const updated = await toggleAgenda(barbero.id, token);
            if (!updated.error) {
                actualizarBarbero({ ...barbero, agendaAbierta: updated.agendaAbierta });
            }
        } catch (error) {
            console.error("Error toggling agenda", error);
        }
        setToggling(false);
    };

    const handleUpdateHorarios = async () => {
        if (horarioEntrada >= horarioSalida) {
            alert("La hora de entrada debe ser anterior a la hora de salida");
            return;
        }
        setSavingHorarios(true);
        try {
            const updated = await updateHorarios(barbero.id, { horarioEntrada, horarioSalida }, token);
            if (!updated.error) {
                actualizarBarbero({
                    ...barbero,
                    horarioEntrada: updated.horarioEntrada,
                    horarioSalida: updated.horarioSalida,
                });
                alert("Horarios guardados correctamente");
            } else {
                alert("Error al actualizar horarios: " + (updated.error || ""));
            }
        } catch (error) {
            console.error("Error updating horarios", error);
            alert("Error al actualizar horarios");
        }
        setSavingHorarios(false);
    };

    const cerrarSesion = () => {
        logout();
        navigate("/admins-panel");
    };

    if (!barbero) return null;

    const turnosActivos = turnos.filter((t) => t.estado === "activo");
    const agendaAbierta = barbero.agendaAbierta !== false;

    return (
        <div className="min-h-[calc(100vh-80px)] bg-[#f7f4ef] montserrat-alternates p-4 sm:p-6 md:p-10">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="flex items-start justify-between mb-6 sm:mb-8 gap-3">
                    <div className="min-w-0">
                        <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-700 mb-1">
                            Panel del barbero
                        </p>
                        <h1 className="text-xl sm:text-2xl font-black text-[#1e2535] truncate">
                            Hola, {barbero.nombre}
                        </h1>
                        <p className="text-xs sm:text-sm text-[#8a8070] mt-0.5 truncate">
                            {barbero.sucursal?.nombre} · {barbero.email}
                        </p>
                    </div>
                    <button onClick={cerrarSesion} className="shrink-0 text-xs font-semibold text-[#8a8070] border border-[#e8e2d8] hover:border-[#c8c0b0] hover:text-[#1e2535] px-3 sm:px-4 py-2 rounded-xl transition-colors cursor-pointer" >
                        Salir
                    </button>
                </div>

                {/* Datas sucursal */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                    {[
                        { label: "Sucursal", value: barbero.sucursal?.nombre || "—" },
                        { label: "Dirección", value: barbero.sucursal?.direccion || "—" },
                        {
                            label: "Horario",
                            value:
                                barbero.sucursal?.horarioApertura && barbero.sucursal?.horarioCierre
                                    ? `${barbero.sucursal.horarioApertura} – ${barbero.sucursal.horarioCierre}`
                                    : "—",
                        },
                    ].map((item) => (
                        <div key={item.label} className="bg-white rounded-xl border border-[#e8e2d8] px-4 sm:px-5 py-4">
                            <p className="text-xs font-bold tracking-widest uppercase text-[#8a8070] mb-1">{item.label}</p>
                            <p className="text-sm font-bold text-[#1e2535]">{item.value}</p>
                        </div>
                    ))}
                </div>

                {/* Agenda abierta */}
                <div className={`mb-5 rounded-xl border px-4 sm:px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${ agendaAbierta ? "bg-white border-[#e8e2d8]" : "bg-[#1e2535] border-[#1e2535]"}`}>
                    <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${agendaAbierta ? "bg-green-50 text-green-700" : "bg-white/10 text-amber-400"}`}>
                            {agendaAbierta ? <IconUnlock /> : <IconLock />}
                        </div>
                        <div>
                            <p className={`text-sm font-bold ${agendaAbierta ? "text-[#1e2535]" : "text-white"}`}>
                                {agendaAbierta ? "Agenda abierta" : "Agenda cerrada"}
                            </p>
                            <p className={`text-xs mt-0.5 ${agendaAbierta ? "text-[#8a8070]" : "text-white/60"}`}>
                                {agendaAbierta ? "Los clientes pueden reservar turnos contigo." : "No se aceptan nuevas reservas."}
                            </p>
                        </div>
                    </div>
                    <button onClick={handleToggleAgenda} disabled={toggling} className={`w-full sm:w-auto text-xs font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50 ${ agendaAbierta ? "bg-[#1e2535] text-white hover:bg-[#2d3748]" : "bg-white text-[#1e2535] hover:bg-[#f7f4ef]" }`} >
                        {toggling ? "..." : agendaAbierta ? "Cerrar agenda" : "Abrir agenda"}
                    </button>
                </div>

                {/* Horarios — inputs full width en mobile */}
                <div className="bg-white rounded-xl border border-[#e8e2d8] px-4 sm:px-5 py-4 mb-5">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div className="grid grid-cols-2 gap-3 flex-1">
                            <div>
                                <label className="block text-xs font-bold text-[#8a8070] uppercase mb-1 tracking-widest">
                                    Hora Entrada
                                </label>
                                <input type="time" value={horarioEntrada} onChange={(e) => setHorarioEntrada(e.target.value)} className="w-full border border-[#e8e2d8] bg-[#faf8f5] rounded-xl px-3 py-2 text-sm font-semibold text-[#1e2535] focus:outline-none focus:border-[#1e2535]" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[#8a8070] uppercase mb-1 tracking-widest">
                                    Hora Salida
                                </label>
                                <input type="time" value={horarioSalida} onChange={(e) => setHorarioSalida(e.target.value)} className="w-full border border-[#e8e2d8] bg-[#faf8f5] rounded-xl px-3 py-2 text-sm font-semibold text-[#1e2535] focus:outline-none focus:border-[#1e2535]" />
                            </div>
                        </div>
                        <button onClick={handleUpdateHorarios} disabled={savingHorarios} className="w-full sm:w-auto bg-[#1e2535] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#2d3748] transition-colors disabled:opacity-50 cursor-pointer" >
                            {savingHorarios ? "Guardando..." : "Guardar Horarios"}
                        </button>
                    </div>
                </div>
                {/* Agenda / Turnos */}
                <div className="bg-white rounded-2xl border border-[#e8e2d8] mb-5">
                    <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-[#f0ece4] gap-3">
                        <h2 className="text-sm font-black text-[#1e2535] uppercase tracking-wider">Agenda</h2>
                        {/* Input de selección de fecha */}
                        <input type="date" value={fecha} onChange={(e) => handleFecha(e.target.value)} className="border border-[#e8e2d8] bg-[#faf8f5] rounded-xl px-3 py-2 text-xs font-semibold text-[#1e2535] focus:outline-none focus:border-[#1e2535] transition-all cursor-pointer" />
                    </div>

                    {loading && (
                        <div className="py-16 text-center text-sm text-[#8a8070]">Cargando turnos...</div>
                    )}

                    {!loading && turnosActivos.length === 0 && (
                        <div className="py-16 text-center">
                            <div className="w-12 h-12 rounded-full bg-[#f0ece4] flex items-center justify-center mx-auto mb-4 text-[#a09880]">
                                <IconCalendar />
                            </div>
                            <p className="text-sm font-semibold text-[#1e2535]">Sin turnos para este día</p>
                            <p className="text-xs text-[#8a8070] mt-1">Seleccioná otra fecha para ver tu agenda.</p>
                        </div>
                    )}

                    {!loading && turnosActivos.length > 0 && (
                        <div className="divide-y divide-[#f0ece4]">
                            {turnosActivos
                                .sort((a, b) => a.hora.localeCompare(b.hora))
                                .map((t) => (
                                    <div key={t.id} className="px-4 sm:px-6 py-4 hover:bg-[#faf8f5] transition-colors">
                                        {/* Mobile: apilado. Desktop: fila */}
                                        <div className="flex items-start sm:items-center gap-3 sm:gap-5">
                                            {/* Hora */}
                                            <div className="w-12 sm:w-14 shrink-0">
                                                <p className="text-base font-black text-[#1e2535]">{t.hora}</p>
                                            </div>

                                            <div className="hidden sm:block w-px h-10 bg-[#e8e2d8] shrink-0" />

                                            {/* Cliente + servicio */}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm text-[#1e2535] truncate">
                                                    {t.cliente?.nombre} {t.cliente?.apellido}
                                                </p>
                                                <p className="text-xs text-[#8a8070] mt-0.5">
                                                    {t.servicio?.tipo} · {t.servicio?.duracion} min
                                                </p>
                                            </div>

                                            {/* Precio + estado */}
                                            <div className="text-right shrink-0">
                                                <p className="font-black text-sm text-[#1e2535]">
                                                    ${t.servicio?.precio?.toLocaleString("es-AR")}
                                                </p>
                                                <span className="text-xs text-green-700 font-semibold bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
                                                    Confirmado
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
                {/* Servicios */}
                <PanelServicios barbero={barbero} />
            </div>
        </div>
    );
}