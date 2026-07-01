import { BASE } from "./api";

// Peticiones de lectura (Petición tipo GET)

export const getBarberos = async (sucursalId) => {
    const url = sucursalId
        ? `${BASE}/barberos?sucursalId=${sucursalId}`
        : `${BASE}/barberos`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
    }

    return await response.json();
};

export const getServiciosBarbero = async (barberoId) => {
    try {
        const response = await fetch(`${BASE}/barberos/${barberoId}/servicios`);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching servicios del barbero:", error);
        return [];
    }
};

// --- CRUD ---

export const createBarbero = async (data, token) => {
    const response = await fetch(`${BASE}/barberos`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    return response.json();
};

export const updateBarbero = async (barberoId, data, token) => {
    const response = await fetch(`${BASE}/barberos/${barberoId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    return response.json();
};

export const deleteBarbero = async (barberoId, token) => {
    const response = await fetch(`${BASE}/barberos/${barberoId}`, {
        method: "DELETE",
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });

    return response.json();
};

// Con esta función un barbero puede abrir o cerrar su agenda
export const toggleAgenda = async (barberoId, token) => {
    try {
        const response = await fetch(`${BASE}/barberos/${barberoId}/agenda`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            }
        );

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error toggling agenda:", error);
        return null;
    }
};

// Seleccion de los serivicios que ofrece
export const setServiciosBarbero = async (barberoId, servicioIds, token) => {
    try {
        const response = await fetch(`${BASE}/barberos/${barberoId}/servicios`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ servicioIds }),
            }
        );
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error actualizando servicios del barbero:", error);
        return null;
    }
};

// Elección de los horarios de trabajo
export const updateHorarios = async (barberoId, horarios, token) => {
    try {
        const payload = {
            horarioEntrada: horarios?.horarioEntrada,
            horarioSalida: horarios?.horarioSalida,
        };

        const response = await fetch(`${BASE}/barberos/${barberoId}/horarios`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
        throw new Error(data.error || `Error HTTP: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error("Error actualizando horarios:", error);
        throw error;
    }
};
