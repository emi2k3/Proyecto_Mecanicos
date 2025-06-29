import * as Keychain from 'react-native-keychain';
import {FetchService} from '../FetchServcice.js';

export class LoginService {
  constructor() {
    this.token = null;
    this.Servicio = new FetchService();
  }

  async login(document, password) {
    try {
      const body = {
        document: document,
        password: password,
      };

      const response = await this.Servicio.post('auth/login', body);
      this.setToken(response.token);
      return response.token;
    } catch (error) {
      console.error('Error obteniendo el token', error);
      return null;
    }
  }

  async logout() {
    try {
      await Keychain.resetGenericPassword();
      this.token = null;
      console.log('Token eliminado correctamente (logout)');
    } catch (error) {
      console.error('Error eliminando el token', error);
    }
  }

  async setToken(token) {
    try {
      await Keychain.setGenericPassword('token', token);
      console.log('Token guardado correctamente');
    } catch (error) {
      console.error('Error guardando el token', error);
    }
  }

  async getToken() {
    if (this.token) {
      return this.token;
    }
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        this.token = credentials.password;
        console.log('Token obtenido correctamente:', this.token);
        return this.token;
      } else {
        console.log('No se encontró el token guardado');
        return null;
      }
    } catch (error) {
      console.error('Error obteniendo el token', error);
      return null;
    }
  }
}
