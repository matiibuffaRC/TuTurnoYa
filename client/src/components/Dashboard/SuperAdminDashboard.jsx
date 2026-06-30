import { useEffect, useState } from "react";
import { getBarberos, createBarbero, updateBarbero, deleteBarbero, getSucursales, createSucursal, updateSucursal, deleteSucursal } from "../../api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SuperAdminDashboard() {
    const { token, usuario, logout } = useAuth();
    const navigate = useNavigate();
    
    const [activeTab, setActiveTab] = useState("sucursales");
    const [sucursales, setSucursales] = useState([]);
    const [barberos, setBarberos] = useState([]);
    const [loading, setLoading] = useState(true);

    const [modalAbierto, setModalAbierto] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [entidadActual, setEntidadActual] = useState(null);
    const [formError, setFormError] = useState("");
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (token && usuario?.rol === "SUPER_ADMIN") {
            cargarDatos();
        }
    }, [token, usuario]);

    const cargarDatos = async () => {
        setLoading(true);
        try {
            const [sucData, barbData] = await Promise.all([getSucursales(), getBarberos()]);
            setSucursales(sucData);
            setBarberos(barbData);
        } catch (error) {
            console.error("Error cargando datos", error);
        }
        setLoading(false);
    };

    const cerrarSesion = () => {
        logout();
        navigate("/admins-panel");
    };

    // Abrimos el menú para la carga de una sucursal o un barbero
    const abrirModalNuevo = () => {
        setModoEdicion(false);
        setEntidadActual(null);
        setFormError("");
        if (activeTab === "sucursales") {
            setFormData({ nombre: "", direccion: "", telefono: "", horarioApertura: "09:00", horarioCierre: "20:00" });
        } else {
            setFormData({ nombre: "", apellido: "", email: "", telefono: "", password: "", sucursalId: "", horarioEntrada: "09:00", horarioSalida: "20:00" });
        }
        setModalAbierto(true);
    };

    // Abrimos el menú para la edición de una sucursal o un barbero
    const abrirModalEdicion = (entidad) => {
        setModoEdicion(true);
        setEntidadActual(entidad);
        setFormError("");
        if (activeTab === "sucursales") {
            setFormData({ ...entidad });
        } else {
            setFormData({ ...entidad, password: "" });
        }
        setModalAbierto(true);
    };

    const handleChangeForm = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    };

    const handleGuardar = async (e) => {
        e.preventDefault();
        setFormError("");
        try {
            if (activeTab === "sucursales") {
                if (modoEdicion) {
                    await updateSucursal(entidadActual.id, formData, token);
                } else {
                    await createSucursal(formData, token);
                }
            } else {
                const dataAEnviar = { ...formData, sucursalId: Number(formData.sucursalId) };
                if (modoEdicion) {
                    if (!dataAEnviar.password) delete dataAEnviar.password;
                    await updateBarbero(entidadActual.id, dataAEnviar, token);
                } else {
                    await createBarbero(dataAEnviar, token);
                }
            }
            setModalAbierto(false);
            cargarDatos();
        } catch (error) {
            setFormError("Ocurrió un error al guardar. Verificá los datos.");
            console.error(error);
        }
    };

    const handleEliminar = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar este registro?")) return;
        try {
            if (activeTab === "sucursales") {
                await deleteSucursal(id, token);
            } else {
                await deleteBarbero(id, token);
            }
            cargarDatos();
        } catch {
            alert("No se pudo eliminar. Verificá que no tenga dependencias.");
        }
    };

    const inputCls = "w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500";

    if (loading) {
        return (
            <div className="min-h-screen bg-[#111827] text-white flex items-center justify-center">
                Cargando panel de administración...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#111827] text-gray-200 montserrat-alternates p-4 sm:p-6 md:p-10">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-10 gap-4">
                    <div className="min-w-0 mt-5">
                        <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-400 text-xs font-black tracking-widest uppercase rounded-full mb-2">
                            Admin Central
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-black text-white">Panel de Control</h1>
                        <p className="text-sm text-gray-400 mt-1 truncate">
                            Hola, {usuario.nombre} · {usuario.email}
                        </p>
                    </div>
                    <button onClick={cerrarSesion} className="shrink-0 text-xs font-semibold text-gray-400 border border-gray-700 hover:border-gray-500 hover:text-white px-5 py-2.5 rounded-xl transition-all" >
                        Salir
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 border-b border-gray-800 mb-6 sm:mb-8">
                    {["sucursales", "barberos"].map((tab) => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`cursor-pointer pb-4 px-2 text-sm font-bold transition-colors border-b-2 ${ activeTab === tab ? "border-amber-400 text-amber-400" : "border-transparent text-gray-500 hover:text-gray-300" }`} >
                            {tab === "sucursales" ? "Sucursales" : "Barberos"}
                        </button>
                    ))}
                </div>

                {/* Subheader + CTA */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                    <h2 className="text-lg sm:text-xl font-black text-white">
                        {activeTab === "sucursales" ? "Gestión de Sucursales" : "Gestión de Barberos"}
                    </h2>
                    <button onClick={abrirModalNuevo} className="cursor-pointer w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold text-xs px-5 py-2.5 rounded-xl transition-colors shadow-lg shadow-amber-500/20" >
                        + Agregar {activeTab === "sucursales" ? "Sucursal" : "Barbero"}
                    </button>
                </div>

                {/* Contenedor tabla/cards */}
                <div className="bg-[#1f2937] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">

                    {/* Tabla — solo desktop (sm+) */}
                    <div className="hidden sm:block overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="bg-[#111827] text-gray-300 text-xs uppercase font-black tracking-wider">
                                <tr>
                                    {activeTab === "sucursales" ? (
                                        <>
                                            <th className="px-6 py-4">ID</th>
                                            <th className="px-6 py-4">Nombre</th>
                                            <th className="px-6 py-4">Dirección</th>
                                            <th className="px-6 py-4">Horarios</th>
                                            <th className="px-6 py-4 text-right">Acciones</th>
                                        </>
                                    ) : (
                                        <>
                                            <th className="px-6 py-4">Nombre</th>
                                            <th className="px-6 py-4">Email</th>
                                            <th className="px-6 py-4">Sucursal</th>
                                            <th className="px-6 py-4">Horarios</th>
                                            <th className="px-6 py-4 text-right">Acciones</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {activeTab === "sucursales" ? (
                                    sucursales.map((suc) => (
                                        <tr key={suc.id} className="hover:bg-gray-800/50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-gray-500">#{suc.id}</td>
                                            <td className="px-6 py-4 font-semibold text-white">{suc.nombre}</td>
                                            <td className="px-6 py-4">{suc.direccion}</td>
                                            <td className="px-6 py-4 text-amber-400/80">{suc.horarioApertura} - {suc.horarioCierre}</td>
                                            <td className="px-6 py-4 text-right space-x-3">
                                                <button onClick={() => abrirModalEdicion(suc)} className="cursor-pointer text-blue-400 hover:text-blue-300 font-semibold text-xs">Editar</button>
                                                <button onClick={() => handleEliminar(suc.id)} className="cursor-pointer text-red-400 hover:text-red-300 font-semibold text-xs">Eliminar</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    barberos.map((barb) => (
                                        <tr key={barb.id} className="hover:bg-gray-800/50 transition-colors">
                                            <td className="px-6 py-4 font-semibold text-white">{barb.nombre} {barb.apellido}</td>
                                            <td className="px-6 py-4">{barb.email}</td>
                                            <td className="px-6 py-4">
                                                <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded-md text-xs">{barb.sucursal?.nombre || `ID: ${barb.sucursalId}`}</span>
                                            </td>
                                            <td className="px-6 py-4 text-amber-400/80">{barb.horarioEntrada} - {barb.horarioSalida}</td>
                                            <td className="px-6 py-4 text-right space-x-3">
                                                <button onClick={() => abrirModalEdicion(barb)} className="hover:cursor-pointer text-blue-400 hover:text-blue-300 font-semibold text-xs">Editar</button>
                                                <button onClick={() => handleEliminar(barb.id)} className="hover:cursor-pointer text-red-400 hover:text-red-300 font-semibold text-xs">Eliminar</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                                {((activeTab === "sucursales" && sucursales.length === 0) || (activeTab === "barberos" && barberos.length === 0)) && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                            No se encontraron registros.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile */}
                    <div className="sm:hidden divide-y divide-gray-800 ">
                        {activeTab === "sucursales" ? (
                            sucursales.length === 0 ? (
                                <p className="px-5 py-12 text-center text-gray-500 text-sm">No se encontraron registros.</p>
                            ) : (
                                sucursales.map((suc) => (
                                    <div key={suc.id} className="px-5 py-4 space-y-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                                <p className="font-semibold text-white text-sm truncate">{suc.nombre}</p>
                                                <p className="text-xs text-gray-400 mt-0.5">{suc.direccion}</p>
                                            </div>
                                            <span className="shrink-0 text-xs text-gray-600 font-bold">#{suc.id}</span>
                                        </div>
                                        <p className="text-xs text-amber-400/80">{suc.horarioApertura} - {suc.horarioCierre}</p>
                                        <div className="flex gap-4 pt-1">
                                            <button onClick={() => abrirModalEdicion(suc)} className="hover:cursor-pointer text-blue-400 hover:text-blue-300 font-semibold text-xs">Editar</button>
                                            <button onClick={() => handleEliminar(suc.id)} className="hover:cursor-pointer text-red-400 hover:text-red-300 font-semibold text-xs">Eliminar</button>
                                        </div>
                                    </div>
                                ))
                            )
                        ) : (
                            barberos.length === 0 ? (
                                <p className="px-5 py-12 text-center text-gray-500 text-sm">No se encontraron registros.</p>
                            ) : (
                                barberos.map((barb) => (
                                    <div key={barb.id} className="px-5 py-4 space-y-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                                <p className="font-semibold text-white text-sm truncate">{barb.nombre} {barb.apellido}</p>
                                                <p className="text-xs text-gray-400 mt-0.5 truncate">{barb.email}</p>
                                            </div>
                                            <span className="shrink-0 bg-gray-800 text-gray-300 px-2 py-1 rounded-md text-xs whitespace-nowrap">
                                                {barb.sucursal?.nombre || `ID: ${barb.sucursalId}`}
                                            </span>
                                        </div>
                                        <p className="text-xs text-amber-400/80">{barb.horarioEntrada} - {barb.horarioSalida}</p>
                                        <div className="flex gap-4 pt-1">
                                            <button onClick={() => abrirModalEdicion(barb)} className="hover:cursor-pointer text-blue-400 hover:text-blue-300 font-semibold text-xs">Editar</button>
                                            <button onClick={() => handleEliminar(barb.id)} className="hover:cursor-pointer text-red-400 hover:text-red-300 font-semibold text-xs">Eliminar</button>
                                        </div>
                                    </div>
                                ))
                            )
                        )}
                    </div>
                </div>
            </div>

            {/* Modal — sheet desde abajo en mobile, centrado en desktop */}
            {modalAbierto && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
                    <div className="bg-[#1f2937] border border-gray-800 rounded-t-3xl sm:rounded-3xl p-5 sm:p-8 w-full sm:max-w-lg max-h-[90dvh] overflow-y-auto shadow-2xl">

                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg sm:text-xl font-black text-white">
                                {modoEdicion ? "Editar" : "Nuevo"} {activeTab === "sucursales" ? "Sucursal" : "Barbero"}
                            </h3>
                            <button onClick={() => setModalAbierto(false)} className="text-gray-500 hover:text-white text-xl leading-none" aria-label="Cerrar" >
                                ✕
                            </button>
                        </div>

                        {formError && (
                            <p className="text-red-400 text-xs bg-red-900/30 p-3 rounded-xl border border-red-900/50 mb-4">
                                {formError}
                            </p>
                        )}

                        <form onSubmit={handleGuardar} className="space-y-4">
                            {activeTab === "sucursales" ? (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nombre</label>
                                        <input type="text" name="nombre" required value={formData.nombre || ""} onChange={handleChangeForm} className={inputCls} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Dirección</label>
                                        <input type="text" name="direccion" required value={formData.direccion || ""} onChange={handleChangeForm} className={inputCls} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Teléfono</label>
                                        <input type="text" name="telefono" required value={formData.telefono || ""} onChange={handleChangeForm} className={inputCls} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Apertura</label>
                                            <input type="time" name="horarioApertura" required value={formData.horarioApertura || ""} onChange={handleChangeForm} className={inputCls} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Cierre</label>
                                            <input type="time" name="horarioCierre" required value={formData.horarioCierre || ""} onChange={handleChangeForm} className={inputCls} />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nombre</label>
                                            <input type="text" name="nombre" required value={formData.nombre || ""} onChange={handleChangeForm} className={inputCls} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Apellido</label>
                                            <input type="text" name="apellido" required value={formData.apellido || ""} onChange={handleChangeForm} className={inputCls} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Email</label>
                                        <input type="email" name="email" required value={formData.email || ""} onChange={handleChangeForm} className={`${inputCls} disabled:opacity-50`} disabled={modoEdicion} />
                                    </div>
                                    {!modoEdicion && (
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Contraseña</label>
                                            <input type="password" name="password" required value={formData.password || ""} onChange={handleChangeForm} className={inputCls} />
                                        </div>
                                    )}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Teléfono</label>
                                            <input type="text" name="telefono" required value={formData.telefono || ""} onChange={handleChangeForm} className={inputCls} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Sucursal</label>
                                            <select name="sucursalId" required value={formData.sucursalId || ""} onChange={handleChangeForm} className={inputCls}>
                                                <option value="">Seleccionar...</option>
                                                {sucursales.map((s) => (
                                                    <option key={s.id} value={s.id}>{s.nombre}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Hora Entrada</label>
                                            <input type="time" name="horarioEntrada" required value={formData.horarioEntrada || ""} onChange={handleChangeForm} className={inputCls} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Hora Salida</label>
                                            <input type="time" name="horarioSalida" required value={formData.horarioSalida || ""} onChange={handleChangeForm} className={inputCls} />
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 mt-2 border-t border-gray-800">
                                <button type="button" onClick={() => setModalAbierto(false)} className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-gray-400 hover:text-white transition-colors text-center" >
                                    Cancelar
                                </button>
                                <button type="submit" className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold text-sm px-6 py-2.5 rounded-xl transition-colors shadow-lg shadow-amber-500/20" >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}