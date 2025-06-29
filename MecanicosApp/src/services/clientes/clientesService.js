import {FetchService} from '../FetchServcice';

export class clientesService {
  constructor() {
    this.Servicio = new FetchService();
  }

  async getAllClientes() {
    try {
      const response = await this.Servicio.get('clientes');
      return response.message;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  getClienteByDocumento(arrayClientes, documento) {
    return arrayClientes.filter(cliente => cliente.documento == documento);
  }
}
