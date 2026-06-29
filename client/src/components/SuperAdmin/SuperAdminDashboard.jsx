import { useEffect, useState } from "react";
import { getBarberos, createBarbero, updateBarbero, deleteBarbero, getSucursales, createSucursal, updateSucursal, deleteSucursal } from "../../api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SuperAdminDashboard() {
    const { token, usuario, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("sucursales"); // "sucursales" o "barberos"
    const [sucursales, setSucursales] = useState([]);
    const [barberos, setBarberos] = useState([]);
    const [loading, setLoading] = useState(true);

    const [modalAbierto, setModalAbierto] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [entidadActual, setEntidadActual] = useState(null);
    const [formError, setFormError] = useState("");

    // Estado del Formulario
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (token && usuario?.rol === "SUPER_ADMIN") {
            cargarDatos();
        }
    }, [token, usuario]);

    const cargarDatos = async () => {
        setLoading(true);
        try {
            const [sucData, barbData] = await Promise.all([
                getSucursales(),
                getBarberos()
            ]);
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

    const abrirModalEdicion = (entidad) => {
        setModoEdicion(true);
        setEntidadActual(entidad);
        setFormError("");
        if (activeTab === "sucursales") {
            setFormData({ ...entidad });
        } else {
            setFormData({ ...entidad, password: "" }); // Password no se edita directamente o es opcional
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
                    if (!dataAEnviar.password) delete dataAEnviar.password; // Si no puso password nueva
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
        } catch (error) {
            alert("No se pudo eliminar. Verificá que no tenga dependencias.");
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-[#111827] text-white flex items-center justify-center">Cargando panel de administración...</div>;
    }

    return (
        <div className="min-h-screen bg-[#111827] text-gray-200 montserrat-alternates p-5 md:p-10">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
                    <div>
                        <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-400 text-xs font-black tracking-widest uppercase rounded-full mb-2">
                            Admin Central
                        </span>
                        <h1 className="text-3xl font-black text-white">
                            Panel de Control
                        </h1>
                        <p className="text-sm text-gray-400 mt-1">
                            Hola, {usuario.nombre} · {usuario.email}
                        </p>
                    </div>
                    <button
                        onClick={cerrarSesion}
                        className="text-xs font-semibold text-gray-400 border border-gray-700 hover:border-gray-500 hover:text-white px-5 py-2.5 rounded-xl transition-all"
                    >
                        Salir
                    </button>
                </div>

                <div className="flex gap-4 border-b border-gray-800 mb-8">
                    <button
                        className={`pb-4 px-2 text-sm font-bold transition-colors border-b-2 ${activeTab === 'sucursales' ? 'border-amber-400 text-amber-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                        onClick={() => setActiveTab("sucursales")}
                    >
                        Sucursales
                    </button>
                    <button
                        className={`pb-4 px-2 text-sm font-bold transition-colors border-b-2 ${activeTab === 'barberos' ? 'border-amber-400 text-amber-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                        onClick={() => setActiveTab("barberos")}
                    >
                        Barberos
                    </button>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-black text-white">
                        {activeTab === "sucursales" ? "Gestión de Sucursales" : "Gestión de Barberos"}
                    </h2>
                    <button
                        onClick={abrirModalNuevo}
                        className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold text-xs px-5 py-2.5 rounded-xl transition-colors shadow-lg shadow-amber-500/20"
                    >
                        + Agregar {activeTab === "sucursales" ? "Sucursal" : "Barbero"}
                    </button>
                </div>

                <div className="bg-[#1f2937] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
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
                                                <button onClick={() => abrirModalEdicion(suc)} className="text-blue-400 hover:text-blue-300 font-semibold text-xs">Editar</button>
                                                <button onClick={() => handleEliminar(suc.id)} className="text-red-400 hover:text-red-300 font-semibold text-xs">Eliminar</button>
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
                                                <button onClick={() => abrirModalEdicion(barb)} className="text-blue-400 hover:text-blue-300 font-semibold text-xs">Editar</button>
                                                <button onClick={() => handleEliminar(barb.id)} className="text-red-400 hover:text-red-300 font-semibold text-xs">Eliminar</button>
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
                </div>
            </div>

            {/* Modal */}
            {modalAbierto && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-[#1f2937] border border-gray-800 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl">
                        <h3 className="text-xl font-black text-white mb-6">
                            {modoEdicion ? "Editar" : "Nuevo"} {activeTab === "sucursales" ? "Sucursal" : "Barbero"}
                        </h3>
                        {formError && <p className="text-red-400 text-xs bg-red-900/30 p-3 rounded-xl border border-red-900/50 mb-4">{formError}</p>}
                        
                        <form onSubmit={handleGuardar} className="space-y-4">
                            {activeTab === "sucursales" ? (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nombre</label>
                                        <input type="text" name="nombre" required value={formData.nombre || ''} onChange={handleChangeForm} className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Dirección</label>
                                        <input type="text" name="direccion" required value={formData.direccion || ''} onChange={handleChangeForm} className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Teléfono</label>
                                        <input type="text" name="telefono" required value={formData.telefono || ''} onChange={handleChangeForm} className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500" />
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-1/2">
                                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Apertura</label>
                                            <input type="time" name="horarioApertura" required value={formData.horarioApertura || ''} onChange={handleChangeForm} className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500" />
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Cierre</label>
                                            <input type="time" name="horarioCierre" required value={formData.horarioCierre || ''} onChange={handleChangeForm} className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500" />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex gap-4">
                                        <div className="w-1/2">
                                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nombre</label>
                                            <input type="text" name="nombre" required value={formData.nombre || ''} onChange={handleChangeForm} className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500" />
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Apellido</label>
                                            <input type="text" name="apellido" required value={formData.apellido || ''} onChange={handleChangeForm} className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Email</label>
                                        <input type="email" name="email" required value={formData.email || ''} onChange={handleChangeForm} className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 disabled:opacity-50" disabled={modoEdicion} />
                                    </div>
                                    {!modoEdicion && (
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Contraseña</label>
                                            <input type="password" name="password" required={!modoEdicion} value={formData.password || ''} onChange={handleChangeForm} className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500" />
                                        </div>
                                    )}
                                    <div className="flex gap-4">
                                        <div className="w-1/2">
                                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Teléfono</label>
                                            <input type="text" name="telefono" required value={formData.telefono || ''} onChange={handleChangeForm} className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500" />
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Sucursal</label>
                                            <select name="sucursalId" required value={formData.sucursalId || ''} onChange={handleChangeForm} className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500">
                                                <option value="">Seleccionar...</option>
                                                {sucursales.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-1/2">
                                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Hora Entrada</label>
                                            <input type="time" name="horarioEntrada" required value={formData.horarioEntrada || ''} onChange={handleChangeForm} className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500" />
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Hora Salida</label>
                                            <input type="time" name="horarioSalida" required value={formData.horarioSalida || ''} onChange={handleChangeForm} className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500" />
                                        </div>
                                    </div>
                                </>
                            )}
                            <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-gray-800">
                                <button type="button" onClick={() => setModalAbierto(false)} className="px-5 py-2.5 text-sm font-semibold text-gray-400 hover:text-white transition-colors">Cancelar</button>
                                <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold text-sm px-6 py-2.5 rounded-xl transition-colors shadow-lg shadow-amber-500/20">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
