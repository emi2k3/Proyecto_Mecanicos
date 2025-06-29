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
}
