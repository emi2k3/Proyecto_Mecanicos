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
import {clientesService} from '../services/clientes/clientesService';
import {formatDocumento, validateDocumento} from '../services/Validations';

const RegisterCliente = ({navigation}) => {
  const [documento, setDocumento] = useState('');
  const [nombre_completo, setNombreCompleto] = useState('');
  const [telefono, setTelefono] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Validar documento
    if (!documento) {
      newErrors.documento = 'El documento es requerido';
    } else if (!validateDocumento(documento)) {
      newErrors.documento = 'CI o RUT inválido';
    }

    // Validar nombre completo
    if (!nombre_completo.trim()) {
      newErrors.nombre_completo = 'El nombre completo es requerido';
    } else if (nombre_completo.trim().length < 2) {
      newErrors.nombre_completo = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validar teléfono
    if (!telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    } else if (telefono.replace(/[^0-9]/g, '').length < 8) {
      newErrors.telefono = 'El teléfono debe tener al menos 8 dígitos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegisterCliente = async () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Por favor, corrija los errores en el formulario.');
      return;
    }

    try {
      const clienteService = new clientesService();
      const result = await clienteService.createCliente({
        documento: documento,
        nombre_completo: nombre_completo.trim(),
        telefono: telefono,
      });

      if (result && result.message) {
        Alert.alert('Éxito', 'Cliente registrado correctamente', [
          {
            text: 'OK',
            onPress: () => {
              // Limpiar formulario
              setDocumento('');
              setNombreCompleto('');
              setTelefono('');
              setErrors({});
              // Opcional: navegar a otra pantalla
              // navigation.goBack();
            },
            buttonText: {
              color: '#fff',
              fontSize: 16,
              fontWeight: 'bold',
            },
          },
        ]);
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'No se pudo registrar el cliente. Verifique que el documento no esté registrado o que la información sea válida.',
      );
    }
  };

  const nombre_completoCheck = input => {
    const textOnly = input.replace(/[0-9]/g, '');
    setNombreCompleto(textOnly);
    // Limpiar error cuando el usuario empiece a escribir
    if (errors.nombre_completo) {
      setErrors(prev => ({...prev, nombre_completo: null}));
    }
  };

  const documentoCheck = input => {
    const formatted = formatDocumento(input);
    setDocumento(formatted);
    // Limpiar error cuando el usuario empiece a escribir
    if (errors.documento) {
      setErrors(prev => ({...prev, documento: null}));
    }
  };

  const telefonoCheck = input => {
    let cleaned = input.replace(/[^+0-9]/g, '');

    if (cleaned.includes('+')) {
      const parts = cleaned.split('+');
      cleaned = '+' + parts.join('').replace(/\+/g, '');
    }

    setTelefono(cleaned);
    // Limpiar error cuando el usuario empiece a escribir
    if (errors.telefono) {
      setErrors(prev => ({...prev, telefono: null}));
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.title}>Registrar Cliente</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Documento (CI o RUT)</Text>
            <TextInput
              style={[styles.input, errors.documento && styles.inputError]}
              placeholder="12345678 o 123456789012"
              value={documento}
              maxLength={12}
              keyboardType="numeric"
              onChangeText={documentoCheck}
              placeholderTextColor="#999"
            />
            {errors.documento && (
              <Text style={styles.errorText}>{errors.documento}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre Completo</Text>
            <TextInput
              style={[
                styles.input,
                errors.nombre_completo && styles.inputError,
              ]}
              placeholder="Nombre completo del cliente"
              value={nombre_completo}
              maxLength={36}
              onChangeText={nombre_completoCheck}
              placeholderTextColor="#999"
            />
            {errors.nombre_completo && (
              <Text style={styles.errorText}>{errors.nombre_completo}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Teléfono</Text>
            <TextInput
              style={[styles.input, errors.telefono && styles.inputError]}
              placeholder="+59812345678"
              value={telefono}
              maxLength={36}
              keyboardType="phone-pad"
              onChangeText={telefonoCheck}
              placeholderTextColor="#999"
            />
            {errors.telefono && (
              <Text style={styles.errorText}>{errors.telefono}</Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.createButton}
            onPress={handleRegisterCliente}
            activeOpacity={0.8}>
            <Text style={styles.buttonText}>Registrar Cliente</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
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
  inputError: {
    borderColor: '#ff6b6b',
    borderWidth: 2,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RegisterCliente;
