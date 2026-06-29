export default function HamburgerButton({ abierto, onClick }) {
    return (
        // No tocar la animación que la dejamos ""linda""
        <button onClick={onClick} aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={abierto} className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg cursor-pointer transition-colors" >
            <span className={`block w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${ abierto ? 'translate-y-0.5 rotate-45' : '-translate-y-1' }`} />
            <span className={`block w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${ abierto ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100' }`} />
            <span className={`block w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${ abierto ? '-translate-y-0.5 -rotate-45' : 'translate-y-1' }`} />
        </button>
    )
}
