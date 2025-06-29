import {FetchService} from '../FetchServcice';

export class mecanicosService {
  constructor() {
    this.Servicio = new FetchService();
  }

  async getAllMecanicos() {
    try {
      const response = await this.Servicio.get('mecanicos');
      return response.message;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async putMecanico(id, body) {
    try {
      await this.Servicio.put('mecanicos', body, id);
    } catch (error) {
      console.error(error);
    }
  }

  async createNewMecanico(body) {
    try {
      const response = await this.Servicio.post('mecanicos', body);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
