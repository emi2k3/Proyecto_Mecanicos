import React, {use, useState} from 'react';
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
import RNPickerSelect from 'react-native-picker-select';
import {registerService} from '../services/register/RegisterService';

const Register = ({navigation}) => {
  const [cedula, setCedula] = useState('');
  const [nombre_completo, setNombreCompleto] = useState('');
  const [telefono, setTelefono] = useState('');
  const [especializacion, setEspecializacion] = useState('');
  const [turno, setTurno] = useState(0);
  const [contraseña, setContraseña] = useState('');

  const handleRegister = async () => {
    if (
      !cedula ||
      !contraseña ||
      !nombre_completo ||
      !especializacion ||
      !turno
    ) {
      Alert.alert('Error', 'Por favor, complete todos los campos.');
    } else {
      const register = new registerService();
      const result = await register.postMecanico({
        documento: cedula,
        nombre_completo: nombre_completo,
        especializacion: especializacion,
        id_turno: turno,
        telefono: telefono,
        Contrasena: contraseña,
      });
      if (result != null) {
        navigation.navigate('Login');
      } else {
        Alert.alert(
          'Error',
          'Por favor, verifique que no este registrado, o que haya ingresado información válida.',
        );
      }
    }
  };

  const nombre_completoCheck = input => {
    const textOnly = input.replace(/[0-9]/g, '');
    setNombreCompleto(textOnly);
  };
  const cedulaCheck = input => {
    const numbersOnly = input.replace(/[^0-9]/g, '');
    setCedula(numbersOnly);
  };

  const telefonoCheck = input => {
    let cleaned = input.replace(/[^+0-9]/g, '');

    if (cleaned.includes('+')) {
      const parts = cleaned.split('+');
      cleaned = '+' + parts.join('').replace(/\+/g, '');
    }

    setTelefono(cleaned);
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Cédula</Text>
            <TextInput
              style={styles.input}
              placeholder="12345678"
              value={cedula}
              maxLength={9}
              keyboardType="numeric"
              onChangeText={cedulaCheck}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre Completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre completo"
              value={nombre_completo}
              maxLength={36}
              onChangeText={nombre_completoCheck}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Teléfono</Text>
            <TextInput
              style={styles.input}
              placeholder="+1234567890"
              value={telefono}
              maxLength={36}
              keyboardType="phone-pad"
              onChangeText={telefonoCheck}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Especializacion</Text>
            <TextInput
              style={styles.input}
              placeholder="¿En qué se especializa?"
              value={especializacion}
              maxLength={64}
              onChangeText={setEspecializacion}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Turno</Text>
            <RNPickerSelect
              onValueChange={value => setTurno(value)}
              placeholder={{label: 'Turno', value: null}}
              items={[
                {label: 'Mañana', value: 1},
                {label: 'Tarde', value: 2},
                {label: 'Noche', value: 3},
              ]}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese su contraseña"
              value={contraseña}
              onChangeText={setContraseña}
              maxLength={36}
              secureTextEntry={true}
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity
            style={styles.createButton}
            onPress={handleRegister}
            activeOpacity={0.8}>
            <Text style={styles.buttonText}>Registrarse</Text>
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
    marginTop: 5,
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

export default Register;
