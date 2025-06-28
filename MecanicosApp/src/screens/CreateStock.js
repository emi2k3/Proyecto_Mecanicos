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
import {Text, Dialog} from '@rneui/themed';
import {repuestoService} from '../services/repuesto/repuestoService';

const servicio = new repuestoService();

const CrearStock = () => {
  const [confirmarVisibile, setconfirmarVisibile] = useState(false);
  const [descripcion, setDescripcion] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [tipo, setTipo] = useState('');

  const dialog = () => {
    setconfirmarVisibile(!confirmarVisibile);
  };

  const handleCrear = async () => {
    if (!descripcion || !cantidad || !tipo) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    const nuevoRepuesto = {
      descripcion,
      cantidad: parseInt(cantidad),
      tipo,
    };

    try {
      await servicio.createNewRepuesto(nuevoRepuesto);
      Alert.alert('Éxito', 'Repuesto creado correctamente');

      console.log('Crear Stock:', {
        descripcion,
        cantidad,
        tipo,
      });

      dialog();

      // Limpiar formulario
      setDescripcion('');
      setCantidad('');
      setTipo('');
    } catch (error) {
      console.error('Error al crear el repuesto:', error);
      Alert.alert('Error', 'Hubo un problema al crear el repuesto');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Descripción/Nombre</Text>
            <TextInput
              style={styles.input}
              placeholder="Descripción/Nombre"
              value={descripcion}
              onChangeText={setDescripcion}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Cantidad</Text>
            <TextInput
              style={styles.input}
              placeholder="Cantidad"
              value={cantidad}
              onChangeText={setCantidad}
              keyboardType="numeric"
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

          <TouchableOpacity
            style={styles.createButton}
            onPress={dialog}
            activeOpacity={0.8}>
            <Text style={styles.buttonText}>Crear</Text>
          </TouchableOpacity>
        </View>

        <Dialog isVisible={confirmarVisibile} onBackdropPress={dialog}>
          <Dialog.Title title="¿Quiere confirmar el ingreso de un nuevo repuesto?" />
          <Dialog.Actions>
            <Dialog.Button title="Cancelar" onPress={dialog} />
            <Dialog.Button title="Aceptar" onPress={handleCrear} />
          </Dialog.Actions>
        </Dialog>
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

export default CrearStock;
