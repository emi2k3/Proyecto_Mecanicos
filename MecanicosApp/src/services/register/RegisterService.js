import {FetchService} from '../FetchServcice';

export class registerService {
  constructor() {
    this.Servicio = new FetchService();
  }

  async postMecanico(body) {
    try {
      await this.Servicio.post('mecanicos', body);
      return true;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
