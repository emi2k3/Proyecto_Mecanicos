import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import {Text} from '@rneui/themed';
import {LoginService} from '../services/login/LoginService';
import {useAuth} from '../context/authContext';
import {tokenService} from '../services/token/tokenService';

const Login = ({navigation}) => {
  const [cedula, setCedula] = useState('');
  const [contraseña, setContraseña] = useState('');
  const {setRol} = useAuth();

  const handleLogin = async () => {
    const logger = new LoginService();
    const decoder = new tokenService();

    if (!cedula || !contraseña) {
      Alert.alert('Error', 'Por favor, complete todos los campos.');
      return;
    }

    try {
      const token = await logger.login(cedula, contraseña);

      if (token) {
        const rol = await decoder.extractTokenData(token);

        setRol(rol);
      } else {
        Alert.alert('Error', 'La cédula o contraseña ingresada es incorrecta.');
      }
    } catch (error) {
      console.error('Error en login:', error);
      Alert.alert('Error', 'La cédula o contraseña ingresada es incorrecta.');
    }

    setCedula('');
    setContraseña('');
  };

  const cedulaCheck = input => {
    const numbersOnly = input.replace(/[^0-9]/g, '');
    setCedula(numbersOnly);
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Cédula</Text>
            <TextInput
              style={styles.input}
              placeholder="1.234.567-8"
              value={cedula}
              onChangeText={cedulaCheck}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese su contraseña"
              value={contraseña}
              onChangeText={setContraseña}
              secureTextEntry={true}
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity
            style={styles.createButton}
            onPress={handleLogin}
            activeOpacity={0.8}>
            <Text style={styles.buttonText}>Iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 75,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
    color: '#333',
  },
  createButton: {
    backgroundColor: '#4ecdc4',
    borderRadius: 8,
    paddingVertical: 15,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#4ecdc4',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Login;
