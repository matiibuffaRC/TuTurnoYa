import { BASE } from "./api";

export const getServicios = async () => {
    try {
        const response = await fetch(`${BASE}/servicios`)
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching servicios:', error)
    }
}
