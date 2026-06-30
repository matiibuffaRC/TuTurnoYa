import { BASE } from "./api";


// Peticiones de lectura (Petición tipo GET)
export const getDisponibles = async (barberoId, fecha, servicioId) => {
    try {
        const response = await fetch(`${BASE}/turnos/disponibles?barberoId=${barberoId}&fecha=${fecha}&servicioId=${servicioId}`)
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching disponibles:', error)
    }
}

export const getTurnosPorEmail = async (email) => {
    try {
        const response = await fetch(`${BASE}/turnos?email=${encodeURIComponent(email)}`)
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching turnos:', error)
    }
}

// --- CRUD ---

export const crearTurno = async (data) => {
    try {
        const response = await fetch(`${BASE}/turnos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        const result = await response.json()
        return result
    } catch (error) {
        console.error('Error creando turno:', error)
    }
}

export const cancelarTurno = async (id) => {
    try {
        // El id que tenemos que enviar es el del turno
        const response = await fetch(`${BASE}/turnos/${id}`,
            { 
                method: 'DELETE' 
            }
        )
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error cancelando turno:', error)
    }
}