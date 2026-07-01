import { useState } from "react";
import { getTurnosPorEmail } from "../services/turno.service";
import { cancelarTurno } from "../services/turno.service";
import LupaIcon from "../data/icons/lupaIcon.svg";

function formatearFecha(iso) {
    const fecha = new Date(iso + "T00:00:00");
    return fecha.toLocaleDateString("es-AR", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function esTurnoPendiente(turno) {
    if (!turno?.fecha || !turno?.hora) return false;

    const fechaHoraTurno = new Date(`${turno.fecha}T${turno.hora}:00`);
    return fechaHoraTurno >= new Date();
}

const IconCalendar = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
    );

export default function MisTurnos() {
    const [email, setEmail] = useState("");
    const [turnos, setTurnos] = useState([]);
    const [buscado, setBuscado] = useState(false);
    const [loading, setLoading] = useState(false);

    const buscar = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = await getTurnosPorEmail(email);
        if (!data) {
            console.log("No se han podido obtener las sucursales!");
            setTurnos([]);
        } else {
            const turnosPendientes = Array.isArray(data)
                ? data.filter(
                    (turno) => turno.estado === "activo" && esTurnoPendiente(turno),
                )
                : [];
            setTurnos(turnosPendientes);
        }

        setBuscado(true);
        setLoading(false);
    };

    const cancelar = async (idTurno) => {
        if (!confirm("¿Desea cancelar este turno?")) return;
        // Llamamos la función desde "api.js"
        await cancelarTurno(idTurno);
        setTurnos((prev) => prev.filter((turno) => turno.id !== idTurno));
    };

    return (
        <div className="min-h-[calc(100dvh-80px)] bg-[#f7f4ef] montserrat-alternates">
            <div className="max-w-2xl mx-auto px-5 py-14">
                <div className="mb-5">
                    <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-700">
                        Gestión
                    </p>
                    <h1 className="text-3xl font-black text-[#1e2535] leading-tight">
                        Mis turnos
                    </h1>
                    <p className="text-[#8a8070] text-sm">
                        Ingresá tu email para ver y gestionar tus reservas.
                    </p>
                </div>

                <form onSubmit={buscar} className="bg-white rounded-full border border-[#e8e2d8] p-5 flex gap-3 mb-8" >
                    <input type="email" required placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 border border-[#e8e2d8] bg-[#faf8f5] rounded-full px-4 py-3 text-sm text-[#1e2535] font-medium placeholder:text-[#c0b8a8] focus:outline-none focus:border-[#1e2535] focus:bg-white transition-all" />
                    <button type="submit" className="cursor-pointer bg-[#1e2535] text-white px-3 py-2 rounded-full font-semibold text-sm hover:bg-[#2d3748] transition-colors whitespace-nowrap disabled:opacity-50" disabled={loading} >
                        {loading ? (
                            <img
                                src={LupaIcon}
                                alt="Buscar"
                                className="w-6 h-6 inline-block invert"
                            />
                            ) : (
                            <img
                                src={LupaIcon}
                                alt="Buscar"
                                className="w-6 h-6 inline-block invert"
                            />
                            )
                        }
                    </button>
                </form>

                {buscado && turnos.length === 0 && (
                    <div className="bg-white rounded-2xl border border-[#e8e2d8] py-16 text-center">
                        <div className="w-12 h-12 rounded-full bg-[#f0ece4] flex items-center justify-center mx-auto mb-4 text-[#a09880]">
                            <IconCalendar />
                        </div>
                        <p className="text-sm font-semibold text-[#1e2535]">
                            Sin turnos activos
                        </p>
                        <p className="text-xs text-[#8a8070] mt-1">
                            No encontramos reservas para este email.
                        </p>
                    </div>
                    )
                }

                <div className="space-y-3">
                    {turnos.map((turno) => (
                        <div key={turno.id} className="bg-white rounded-2xl border border-[#e8e2d8] px-6 py-5" >
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-2 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-base font-black text-[#1e2535]">
                                            {turno.hora}
                                        </span>
                                        <span className="text-[#c0b8a8]">·</span>
                                        <span className="text-sm text-[#8a8070] font-medium">
                                            {formatearFecha(turno.fecha)}
                                        </span>
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-sm text-[#1e2535]">
                                        <span className="font-semibold">
                                            {turno.barbero.nombre} {turno.barbero.apellido}
                                        </span>
                                        <span className="text-[#8a8070]">
                                            {" "}
                                            — {turno.barbero.sucursal.nombre}
                                        </span>
                                        </p>
                                        <p className="text-xs text-[#8a8070]">
                                            {turno.barbero.sucursal.direccion}
                                        </p>
                                        <p className="text-xs text-[#8a8070]">
                                            {turno.servicio.tipo} · {turno.servicio.duracion} min ·{" "}
                                        <span className="font-bold text-[#1e2535]">
                                            ${turno.servicio.precio.toLocaleString("es-AR")}
                                        </span>
                                        </p>
                                    </div>
                                </div>
                                <button onClick={() => cancelar(turno.id)} className="cursor-pointer text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap" >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}
