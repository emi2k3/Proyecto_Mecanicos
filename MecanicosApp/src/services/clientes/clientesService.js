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
  async getClienteByID(id) {
    try {
      const response = await this.Servicio.getByID('clientes', id);
      return response.message;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async createCliente(clienteData) {
    try {
      const response = await this.Servicio.post('clientes', clienteData);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  getClienteByDocumento(arrayClientes, documento) {
    return arrayClientes.filter(cliente => cliente.documento == documento);
  }
}
