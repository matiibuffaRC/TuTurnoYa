import { BASE } from "./api";


export const getBarberos = async (sucursalId) => {
    try {
        const response = await fetch(`${BASE}/barberos?sucursalId=${sucursalId}`);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error fetching barberos:', error);
        return null;
    }
};

export const toggleAgenda = async (barberoId, token) => {
    try {
        const response = await fetch(`${BASE}/barberos/${barberoId}/agenda`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error toggling agenda:', error);
        return null;
    }
};

export const getServiciosBarbero = async (barberoId) => {
    try {
        const response = await fetch(`${BASE}/barberos/${barberoId}/servicios`);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching servicios del barbero:', error);
        return [];
    }
};

export const setServiciosBarbero = async (barberoId, servicioIds, token) => {
    try {
        const response = await fetch(`${BASE}/barberos/${barberoId}/servicios`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ servicioIds }),
        });
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error actualizando servicios del barbero:', error);
        return null;
    }
};

export const updateHorarios = async (barberoId, horarios, token) => {
    try {
        const response = await fetch(`${BASE}/barberos/${barberoId}/horarios`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ horarios })
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error actualizando horarios:', error);
        return null;
    }
};