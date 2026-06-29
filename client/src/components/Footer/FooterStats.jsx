const STATS = [
    { value: '+14', label: 'Peluquerías activas' },
    { value: '+3', label: 'Años en el mercado' },
]

export default function FooterStats() {
    return (
        <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-500 mb-5">
                En números
            </p>
            <div className="space-y-3">
                {STATS.map(({ value, label }) => (
                    <div key={label} className="border border-white/10 rounded-xl px-4 py-3 hover:border-white/20 transition-colors" >
                        <p className="text-xl font-black text-white">
                            {value}
                        </p>
                        <p className="text-xs text-white/50 mt-0.5">
                            {label}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}