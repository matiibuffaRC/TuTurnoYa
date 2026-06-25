const BASE = 'http://localhost:3001'

// Obtenemos las sucursales guardadas
export const getSucursales = async () => {
    try {
        const response = await fetch(`${BASE}/sucursales`);
        // Pasamos la información en tipo JSON para trabajar en el front
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching sucursales:', error);
    }
}

export const getBarberos = async (sucursalId) => {
    try {
        const response = await fetch(`${BASE}/barberos?sucursalId=${sucursalId}`)
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching barberos:', error)
    }
}

export const getServicios = async () => {
    try {
        const response = await fetch(`${BASE}/servicios`)
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching servicios:', error)
    }
}

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

export const toggleAgenda = async (barberoId, token) => {
    try {
        const response = await fetch(`${BASE}/barberos/${barberoId}/agenda`, 
            {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` }
            }
        )
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error toggling agenda:', error)
    }
}

export const updateHorarios = async (barberoId, horarios, token) => {
    try {
        const response = await fetch(`${BASE}/barberos/${barberoId}/horarios`, 
            {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ horarios })
            }
        )
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error actualizando horarios:', error)
    }
}