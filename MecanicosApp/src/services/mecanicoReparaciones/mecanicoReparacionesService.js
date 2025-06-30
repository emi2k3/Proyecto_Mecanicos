import {FetchService} from '../FetchServcice';

export class mecanicoReparacionesService {
  constructor() {
    this.Servicio = new FetchService();
  }

  async getAllMecanicoReparaciones(id) {
    try {
      const response = await this.Servicio.get(
        'mecanicos/' + id + '/reparaciones',
      );
      return response.message;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  async postMecanicoReparaciones(id, body) {
    try {
      const response = await this.Servicio.post(
        'mecanicos/' + id + '/asignar',
        body,
      );
      return response.message;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}
