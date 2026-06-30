import { BASE } from "./api";

// Obtenemos las sucursales guardadas
export const getSucursales = async () => {
    try {
        const response = await fetch(`${BASE}/sucursales`);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error fetching sucursales:', error);
        return null;
    }
};

export const createSucursal = async (data, token) => {
    const response = await fetch(`${BASE}/sucursales`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    })

    return response.json()
}

export const updateSucursal = async (id, data, token) => {
    const response = await fetch(`${BASE}/sucursales/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    })

    return response.json()
}

export const deleteSucursal = async (id, token) => {
    const response = await fetch(`${BASE}/sucursales/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    return response.json()
}
