import { useEffect, useState } from "react";
import { getServicios } from "../services/servicio.service";

const IconClock = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export default function Servicios() {
  const [servicios, setServicios] = useState([]);

  useEffect(() => {
    getServicios().then(setServicios);
  }, []);

  return (
    <div className="min-h-[calc(100dvh-80px)] bg-[#f7f4ef] montserrat-alternates">
      <div className="max-w-2xl mx-auto px-5 py-14">
        <div className="mb-10">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-700 mb-2">
            Tarifario
          </p>
          <h1 className="text-3xl font-black text-[#1e2535] leading-tight">
            Nuestros servicios
          </h1>
          <p className="text-[#8a8070] mt-1.5 text-sm">
            Todos los precios incluyen el trabajo del barbero.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#e8e2d8] overflow-hidden">
          {servicios.map((s, i) => (
            <div
              key={s.id}
              className={`flex items-center justify-between px-6 py-5 transition-colors hover:bg-[#faf8f5] ${i < servicios.length - 1 ? "border-b border-[#f0ece4]" : ""}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-[#f0ece4] flex items-center justify-center shrink-0">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#8a7a60"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="6" cy="6" r="3" />
                    <circle cx="6" cy="18" r="3" />
                    <line x1="20" y1="4" x2="8.12" y2="15.88" />
                    <line x1="14.47" y1="14.48" x2="20" y2="20" />
                    <line x1="8.12" y1="8.12" x2="12" y2="12" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-[#1e2535] text-sm">
                    {s.tipo}
                  </p>
                  <p className="text-xs text-[#8a8070] flex items-center gap-1 mt-0.5">
                    <IconClock /> {s.duracion} min
                  </p>
                </div>
              </div>
              <span className="text-lg font-black text-[#1e2535]">
                ${s.precio.toLocaleString("es-AR")}
              </span>
            </div>
          ))}

          {servicios.length === 0 && (
            <div className="py-16 text-center text-[#8a8070]">
              <p className="text-sm font-medium">Cargando servicios...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
