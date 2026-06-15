import React, { useState } from 'react';
import { InputField } from '../components/AdminsPanel/InputField';

const AdminsPanel = () => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({
            ...credentials,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            setTimeout(() => {
                console.log('Datos enviados:', credentials);
                setIsLoading(false);
                alert('¡Simulación de Login exitosa! Conectando agenda...');
            }, 2000);
        } catch (err) {
            setError(err.message || 'Ocurrió un error inesperado');
            setIsLoading(false);
        }
    };

    return (
        // Contenedor principal adaptable: pantalla dividida en desktop
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-slate-50 p-4 md:p-10 montserrat-alternates">
            
            <div className="max-w-5xl w-full bg-white rounded-4xl shadow-[0_20px_70px_-15px_rgba(38,46,65,0.12)] border border-slate-100 overflow-hidden grid md:grid-cols-12 min-h-150">
                
                {/* SECCIÓN IZQUIERDA: Lo "interesante" (Solo visible en Desktop) */}
                <div className="hidden md:flex md:col-span-6 bg-[#262E41] p-12 flex-col justify-between relative overflow-hidden text-white">
                    {/* Efecto de luz de fondo */}
                    <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

                    {/* Badge superior */}
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider text-amber-300 uppercase">
                            <span>✂</span> Workspace Premium
                        </div>
                    </div>

                    {/* Elemento Interesante: Tarjetas de estadísticas vivas de la peluquería */}
                    <div className="my-auto relative z-10 space-y-6">
                        <h3 className="text-3xl font-black leading-tight tracking-tight">
                            Tu salón, tus reglas. <br />
                            <span className="text-amber-400">Controlá tu tiempo.</span>
                        </h3>
                        <p className="text-slate-300 text-sm max-w-sm">
                            Iniciá sesión para gestionar tus turnos de hoy, ver ingresos estimados y administrar tu cartera de clientes.
                        </p>

                        {/* Mini Dashboard de juguete interactivo */}
                        <div className="pt-4 space-y-3">
                            <div className="bg-white/4 border border-white/10 p-4 rounded-2xl flex items-center justify-between transform hover:translate-x-2 transition-transform duration-300">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-amber-400/20 flex items-center justify-center text-amber-400 font-bold">✓</div>
                                    <div>
                                        <p className="text-xs text-slate-400">Clientes satisfechos</p>
                                        <p className="text-sm font-bold">14 barberos con nuestro servicio</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/4 border border-white/10 p-4 rounded-2xl flex items-center justify-between transform hover:translate-x-2 transition-transform duration-300 delay-75">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-400/20 flex items-center justify-center text-blue-400 text-lg">🕒</div>
                                    <div>
                                        <p className="text-xs text-slate-400">La seguridad de tu gestión</p>
                                        <p className="text-sm font-bold">Más de 3 años acompañanadote</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer del lado izquierdo */}
                    <p className="text-xs text-slate-400 relative z-10">
                        © {new Date().getFullYear()} TuTurnoYa.
                    </p>
                </div>


                {/* SECCIÓN DERECHA: El Formulario (Tirado al costado) */}
                <div className="col-span-12 md:col-span-6 p-8 sm:p-12 md:p-16 flex flex-col justify-center bg-white">
                    
                    {/* Header exclusivo para móvil (oculto en desktop) */}
                    <div className="block md:hidden text-center mb-8">
                        <h2 className="text-5xl font-black text-slate-900 tracking-tight pb-1">
                            TuTurnoYa
                        </h2>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                            Portal Peluqueros
                        </h2>
                    </div>

                    {/* Título de bienvenida en Desktop */}
                    <div className="hidden md:block mb-8">
                        <h2 className="text-5xl font-black text-slate-900 tracking-tight pb-2">
                            TuTurnoYa
                        </h2>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                            ¡Hola de nuevo!
                        </h2>
                        <p className="text-sm text-slate-400 mt-1">
                            Por favor, introduce tus datos para acceder a la agenda.
                        </p>
                    </div>

                    {/* Alerta de Error */}
                    {error && (
                        <div className="mb-6 p-3.5 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center gap-2 font-medium animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                            {error}
                        </div>
                    )}

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-4">
                            <InputField 
                                label="Correo Electrónico" 
                                type="email" 
                                name="email" 
                                value={credentials.email} 
                                onChange={handleChange} 
                                placeholder="juan@peluqueria.com" 
                            />
                            <InputField 
                                label="Contraseña" 
                                type="password" 
                                name="password" 
                                value={credentials.password} 
                                onChange={handleChange} 
                                placeholder="••••••••" 
                            />
                        </div>

                        {/* Botón interactivo con el azul de tu header */}
                        <button 
                            type="submit" 
                            disabled={isLoading} 
                            className="relative overflow-hidden cursor-pointer w-full mt-6 bg-[#262E41] hover:bg-[#323d57] text-white font-semibold tracking-wider text-xs uppercase py-3.5 px-4 rounded-xl shadow-lg shadow-slate-900/10 transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#262E41] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Abriendo Agenda...</span>
                                </div>
                            ) : (
                                <span className="flex items-center justify-center gap-1 group-hover/btn:translate-x-1 transition-transform">
                                    Ingresar al panel de turnos →
                                </span>
                            )}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default AdminsPanel;