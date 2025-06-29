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
import {vehiculosService} from '../services/vehiculos/vehiculosService';

const CrearVehiculos = () => {
  const [matricula, setMatricula] = useState('');
  const [marca, setMarca] = useState('');
  const [tipo, setTipo] = useState('');
  const [modelo, setModelo] = useState('');
  const [ID_Cliente, setID_CLiente] = useState(0);
  const creador = new vehiculosService();
  const handleCrear = () => {
    if (!modelo || !marca || !tipo || !matricula || !ID_Cliente) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    } else {
      creador.postVehiculos({
        matricula: matricula,
        tipo: tipo,
        marca: marca,
        modelo: modelo,
        id_cliente: ID_Cliente,
      });
      Alert.alert('Exito', 'El vehiculo fue creado correctamente');
      // Falta manejar mejor los errores.
      setMarca('');
      setMatricula('');
      setModelo('');
      setTipo('');
      setID_CLiente(0);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Marca</Text>
            <TextInput
              style={styles.input}
              placeholder="Marca"
              value={marca}
              onChangeText={setMarca}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Modelo</Text>
            <TextInput
              style={styles.input}
              placeholder="Modelo"
              value={modelo}
              onChangeText={setModelo}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tipo</Text>
            <TextInput
              style={styles.input}
              placeholder="Tipo"
              value={tipo}
              onChangeText={setTipo}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Matrícula</Text>
            <TextInput
              style={styles.input}
              placeholder="Matrícula"
              value={matricula}
              onChangeText={setMatricula}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>ID_Cliente ESTO ES SOLO POR AHORA</Text>
            <TextInput
              style={styles.input}
              placeholder="1"
              value={ID_Cliente}
              onChangeText={setID_CLiente}
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCrear}
            activeOpacity={0.8}>
            <Text style={styles.buttonText}>Crear</Text>
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

export default CrearVehiculos;
