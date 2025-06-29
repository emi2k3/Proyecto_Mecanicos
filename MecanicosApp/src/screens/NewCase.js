import React, {useState} from 'react';
import {View, StyleSheet, SafeAreaView, ScrollView, Alert} from 'react-native';
import {Input, Button} from '@rneui/themed';
import {
  validateMatricula,
  validateDocumento,
  formatMatricula,
  formatDocumento,
  validateNewCaseForm,
} from '../services/Validations';

const NewCase = ({navigation}) => {
  const [matricula, setMatricula] = useState('');
  const [documento, setDocumento] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [matriculaError, setMatriculaError] = useState('');
  const [documentoError, setDocumentoError] = useState('');

  const handleMatriculaChange = text => {
    const formatted = formatMatricula(text);
    setMatricula(formatted);

    // Validar solo si tiene la longitud completa
    if (formatted.length === 8) {
      if (!validateMatricula(formatted)) {
        setMatriculaError('Formato inválido. Use: ABC 1234');
      } else {
        setMatriculaError('');
      }
    } else if (formatted.length > 0 && formatted.length < 8) {
      setMatriculaError('');
    } else {
      setMatriculaError('');
    }
  };

  const handleDocumentoChange = text => {
    const formatted = formatDocumento(text);
    setDocumento(formatted);

    const cleaned = formatted.replace(/[^0-9]/g, '');

    // Validar cuando tenga longitud completa
    if (cleaned.length >= 6) {
      if (cleaned.length <= 8) {
        // Validar como CI
        if (cleaned.length === 7 || cleaned.length === 8) {
          if (!validateDocumento(formatted)) {
            setDocumentoError('CI inválida');
          } else {
            setDocumentoError('');
          }
        } else {
          setDocumentoError('');
        }
      } else if (cleaned.length === 12) {
        // Validar como RUT
        if (!validateDocumento(formatted)) {
          setDocumentoError('RUT inválido');
        } else {
          setDocumentoError('');
        }
      } else if (cleaned.length > 8 && cleaned.length < 12) {
        setDocumentoError('');
      }
    } else {
      setDocumentoError('');
    }
  };

  const handleRegistrar = () => {
    const formData = {
      matricula,
      documento,
      descripcion,
    };

    // Usar la función de validación centralizada
    const validation = validateNewCaseForm(formData);

    if (!validation.isValid) {
      // Mostrar el primer error encontrado
      const firstError = Object.values(validation.errors)[0];
      Alert.alert('Error', firstError);
      return;
    }

    // Aquí iría la lógica para enviar los datos
    console.log('Datos a enviar:', formData);

    Alert.alert('Éxito', 'Ingreso registrado correctamente', [
      {
        text: 'OK',
        onPress: () => {
          // Limpiar formulario
          setMatricula('');
          setDocumento('');
          setDescripcion('');
          setMatriculaError('');
          setDocumentoError('');
          // Opcional: navegar de vuelta
          // navigation.goBack();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {/* Matrícula Field */}
          <Input
            label="Matrícula"
            value={matricula}
            onChangeText={handleMatriculaChange}
            placeholder="ABC 1234"
            maxLength={8}
            autoCapitalize="characters"
            labelStyle={styles.label}
            inputContainerStyle={[
              styles.input,
              matriculaError ? styles.inputError : null,
            ]}
            inputStyle={{fontSize: 16, color: '#333'}}
            containerStyle={styles.inputContainer}
            errorMessage={matriculaError}
            errorStyle={styles.errorText}
          />

          {/* C.I./RUT Field */}
          <Input
            label="C.I./RUT"
            value={documento}
            onChangeText={handleDocumentoChange}
            placeholder="1.234.567-8 o 21.234.567-001-2"
            keyboardType="numeric"
            maxLength={17}
            labelStyle={styles.label}
            inputContainerStyle={[
              styles.input,
              documentoError ? styles.inputError : null,
            ]}
            inputStyle={{fontSize: 16, color: '#333'}}
            containerStyle={styles.inputContainer}
            errorMessage={documentoError}
            errorStyle={styles.errorText}
          />

          {/* Descripción Field */}
          <Input
            label="Descripción del problema"
            value={descripcion}
            onChangeText={setDescripcion}
            multiline
            numberOfLines={4}
            labelStyle={styles.label}
            inputContainerStyle={[styles.input, styles.textAreaContainer]}
            inputStyle={[{fontSize: 16, color: '#333'}, styles.textAreaStyle]}
            containerStyle={styles.inputContainer}
          />

          {/* Submit Button */}
          <Button
            title="Registrar"
            onPress={handleRegistrar}
            buttonStyle={styles.createButton}
            titleStyle={styles.buttonText}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
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
  textAreaContainer: {
    height: 100,
    alignItems: 'flex-start',
  },
  textAreaStyle: {
    textAlignVertical: 'top',
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
  inputError: {
    borderColor: '#e74c3c',
    borderWidth: 2,
  },
  errorText: {
    fontSize: 12,
    color: '#e74c3c',
    marginTop: 4,
  },
});

export default NewCase;
