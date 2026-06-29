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