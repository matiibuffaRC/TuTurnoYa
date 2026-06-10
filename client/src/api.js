const BASE = 'http://localhost:3001'

export const getSucursales = () => fetch(`${BASE}/sucursales`).then(r => r.json())
export const getBarberos = (sucursalId) => fetch(`${BASE}/barberos?sucursalId=${sucursalId}`).then(r => r.json())
export const getServicios = () => fetch(`${BASE}/servicios`).then(r => r.json())
export const getDisponibles = (barberoId, fecha) =>
  fetch(`${BASE}/turnos/disponibles?barberoId=${barberoId}&fecha=${fecha}`).then(r => r.json())
export const getTurnosPorEmail = (email) =>
  fetch(`${BASE}/turnos?email=${encodeURIComponent(email)}`).then(r => r.json())
export const crearTurno = (data) =>
  fetch(`${BASE}/turnos`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json())
export const cancelarTurno = (id) =>
  fetch(`${BASE}/turnos/${id}`, { method: 'DELETE' }).then(r => r.json())
