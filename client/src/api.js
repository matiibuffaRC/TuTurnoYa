const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// --- SUCURSALES ---
export const getSucursales = () => fetch(`${BASE}/sucursales`).then(r => r.json())
export const createSucursal = (data, token) => fetch(`${BASE}/sucursales`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
}).then(r => r.json())
export const updateSucursal = (id, data, token) => fetch(`${BASE}/sucursales/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
}).then(r => r.json())
export const deleteSucursal = (id, token) => fetch(`${BASE}/sucursales/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
}).then(r => r.json())

// --- BARBEROS ---
// getBarberos obtiene barberos filtrados o todos si no hay filtro
export const getBarberos = (sucursalId) => fetch(sucursalId ? `${BASE}/barberos?sucursalId=${sucursalId}` : `${BASE}/barberos`).then(r => r.json())
export const createBarbero = (data, token) => fetch(`${BASE}/barberos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
}).then(r => r.json())
export const updateBarbero = (barberoId, data, token) => fetch(`${BASE}/barberos/${barberoId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
}).then(r => r.json())
export const deleteBarbero = (barberoId, token) => fetch(`${BASE}/barberos/${barberoId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
}).then(r => r.json())
export const toggleAgenda = (barberoId, token) => fetch(`${BASE}/barberos/${barberoId}/agenda`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
}).then(r => r.json())
export const updateHorarios = (barberoId, data, token) => fetch(`${BASE}/barberos/${barberoId}/horarios`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
}).then(r => r.json())

// --- SERVICIOS & TURNOS ---
export const getServicios = () => fetch(`${BASE}/servicios`).then(r => r.json())
export const getDisponibles = (barberoId, fecha, servicioId) =>
  fetch(`${BASE}/turnos/disponibles?barberoId=${barberoId}&fecha=${fecha}&servicioId=${servicioId}`).then(r => r.json())
export const getTurnosPorEmail = (email) =>
  fetch(`${BASE}/turnos?email=${encodeURIComponent(email)}`).then(r => r.json())
export const crearTurno = (data) =>
  fetch(`${BASE}/turnos`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json())
export const cancelarTurno = (id) =>
  fetch(`${BASE}/turnos/${id}`, { method: 'DELETE' }).then(r => r.json())
