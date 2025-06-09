import { FetchService } from "../FetchServcice";

export class reparacionService{
    constructor()
    {
        this.Servicio = new FetchService();
    }

    async getAllReparaciones()
    {
        try {
            const response = await this.Servicio.get('reparaciones');
            return response.message;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async getVehiculoReparado(id) {
    try {
        const response = await this.Servicio.get(`reparaciones/vehiculo/${id}`);
        return response.message || null;
    } catch (error) {
        console.error('Error al obtener vehículo:', error);
        return null;
    }
    }

    async putReparacion(id, body)
    {
        try {
            await this.Servicio.put('reparaciones', body, id);
        } catch (error) {
            console.error(error);
        }
    }
}