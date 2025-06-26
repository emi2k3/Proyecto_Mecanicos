import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { Header, Icon, Text } from '@rneui/themed';

const CrearStock = () => {
  const [descripcion, setDescripcion] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [tipo, setTipo] = useState('');

  const handleCrear = () => {
   
    if (!descripcion || !cantidad || !tipo) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    
    console.log('Crear Stock:', {
      descripcion,
      cantidad,
      tipo,
    });
    
    //Dialogo de que se creo correctamente 
    
    // Limpiar formulario después de crear
    setDescripcion('');
    setCantidad('');
    setTipo('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
    >
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
            onPress={handleCrear}
            activeOpacity={0.8}
          >
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
    marginTop: 75
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