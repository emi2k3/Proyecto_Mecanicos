import {jwtDecode} from 'jwt-decode';
import {Alert} from 'react-native';
import {LoginService} from '../login/LoginService';
import {combineTransition} from 'react-native-reanimated';
export class tokenService {
  log = new LoginService();
  async extractTokenData(token) {
    try {
      if (!token) {
        return null;
      }

      const decodedToken = jwtDecode(token);

      this.checkExpired(decodedToken);
      const rol = decodedToken.rol.toString();
      return rol || null;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }
  async extractID_Mecanico(token) {
    try {
      if (!token) {
        return null;
      }

      const decodedToken = jwtDecode(token);

      this.checkExpired(decodedToken);
      const id_mecanico = decodedToken.id.toString();
      return id_mecanico || null;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }
  async checkExpired(decodedToken) {
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp && decodedToken.exp < currentTime) {
      Alert.alert(
        'Su sesión ha expirado',
        'Su sesión expiró, vuelva a inciar sesión.',
      );
      this.log.logout();
    }
  }
}
