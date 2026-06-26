import FooterBrand from './FooterBrand'
import FooterNav from './FooterNav'
import FooterStats from './FooterStats'

const LEGAL_LINKS = ['Términos', 'Privacidad', 'Contacto']

export default function Footer() {
    return (
        <footer className="relative overflow-hidden bg-[#1e2535] text-white montserrat-alternates">
        {/* Gradientes decorativos */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(180,130,50,0.08)_0%,transparent_60%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(180,130,50,0.05)_0%,transparent_60%)] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-14">
                <div className="grid md:grid-cols-3 gap-12">
                    <FooterBrand />
                    <FooterNav />
                    <FooterStats />
                </div>

                <div className="h-px bg-white/10 my-10" />

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
                    <p className="text-white/40">
                        © {new Date().getFullYear()} TuTurnoYa. Todos los derechos reservados.
                    </p>
                    <div className="flex items-center gap-6">
                        {LEGAL_LINKS.map((label) => (
                            <a key={label} href="#" className="text-white/40 hover:text-white/80 transition-colors font-medium" >
                                {label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}