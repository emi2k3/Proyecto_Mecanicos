import {FetchService} from '../FetchServcice';

export class vehiculosService {
  constructor() {
    this.Servicio = new FetchService();
  }

  async postVehiculos(body) {
    try {
      await this.Servicio.post('vehiculos', body);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async getAllVehiculos() {
    try {
      const response = await this.Servicio.get('vehiculos');
      return response.message;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async eliminarVehiculo(id) {
    try {
      await this.Servicio.delete('vehiculos', id);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
