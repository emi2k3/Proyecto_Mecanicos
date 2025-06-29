import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {repuestoService} from '../services/repuesto/repuestoService';
import {mecanicosService} from '../services/mecanicos/mecanicosService';
import {reparacionService} from '../services/reparacion/reparacionService';

const CaseFinalForm = ({navigation, route}) => {
  // Datos de navegación
  const reparacionData = route?.params || {};
  const {reparacionId, vehiculo, reparacion} = reparacionData;

  // Estados del formulario
  const [formData, setFormData] = useState({
    selectedRepuesto: '',
    cantidad: '',
    tiempoReparacion: '',
    descripcion: reparacion?.descripcion || '',
  });

  const limpiarFormulario = () => {
    setFormData({
      selectedRepuesto: '',
      cantidad: '',
      tiempoReparacion: '',
      descripcion: '',
    });
  };

  const handleNavigate = () => {
    navigation.navigate('Casos Terminados');
  };

  // Estados de los items agregados
  const [repuestosAgregados, setRepuestosAgregados] = useState([]);
  const [selectedMecanicos, setSelectedMecanicos] = useState([]);

  // Estados de datos disponibles
  const [availableRepuestos, setAvailableRepuestos] = useState([]);
  const [availableMecanicos, setAvailableMecanicos] = useState([]);
  const [enviando, setEnviando] = useState(false);

  // Estados de UI
  const [uiState, setUiState] = useState({
    loadingRepuestos: true,
    loadingMecanicos: true,
    showRepuestoDropdown: false,
    showMecanicoDropdown: false,
  });

  // Estados de selección temporal
  const [selectedRepuestoObj, setSelectedRepuestoObj] = useState(null);

  // Servicios
  const repuestoServiceInstance = new repuestoService();
  const mecanicosServiceInstance = new mecanicosService();
  const reparacionServiceInstance = new reparacionService();

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    await Promise.all([loadRepuestos(), loadMecanicos()]);
  };

  const loadRepuestos = async () => {
    try {
      setUiState(prev => ({...prev, loadingRepuestos: true}));
      const repuestos = await repuestoServiceInstance.getAllRepuestos();
      setAvailableRepuestos(repuestos || []);
    } catch (error) {
      console.error('Error cargando repuestos:', error);
      setAvailableRepuestos([]);
    } finally {
      setUiState(prev => ({...prev, loadingRepuestos: false}));
    }
  };

  const loadMecanicos = async () => {
    try {
      setUiState(prev => ({...prev, loadingMecanicos: true}));
      const mecanicos = await mecanicosServiceInstance.getAllMecanicos();
      setAvailableMecanicos(mecanicos || []);
    } catch (error) {
      console.error('Error cargando mecánicos:', error);
      setAvailableMecanicos([]);
    } finally {
      setUiState(prev => ({...prev, loadingMecanicos: false}));
    }
  };

  // Handlers para form data
  const updateFormData = (field, value) => {
    setFormData(prev => ({...prev, [field]: value}));
  };

  const updateUiState = (field, value) => {
    setUiState(prev => ({...prev, [field]: value}));
  };

  // Handlers para repuestos
  const selectRepuesto = repuesto => {
    updateFormData('selectedRepuesto', repuesto.descripcion);
    setSelectedRepuestoObj(repuesto);
    updateUiState('showRepuestoDropdown', false);
  };

  const addRepuesto = () => {
    if (
      !selectedRepuestoObj ||
      !formData.cantidad ||
      parseInt(formData.cantidad) <= 0
    ) {
      return;
    }

    const nuevoRepuesto = {
      id_repuesto: selectedRepuestoObj.id_repuesto,
      nombre: selectedRepuestoObj.descripcion,
      cantidad: parseInt(formData.cantidad),
    };

    setRepuestosAgregados(prev => [...prev, nuevoRepuesto]);

    // Resetear campos
    updateFormData('selectedRepuesto', '');
    updateFormData('cantidad', '');
    setSelectedRepuestoObj(null);
    updateUiState('showRepuestoDropdown', false);
  };

  const removeRepuesto = indexToRemove => {
    setRepuestosAgregados(prev =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  };

  // Handlers para mecánicos
  const selectMecanico = mecanico => {
    const mecanicoExists = selectedMecanicos.some(
      m => m.id === mecanico.id_mecanico,
    );

    if (!mecanicoExists) {
      const nuevoMecanico = {
        id: mecanico.id_mecanico,
        nombre: mecanico.nombre_completo,
      };
      setSelectedMecanicos(prev => [...prev, nuevoMecanico]);
    }

    updateUiState('showMecanicoDropdown', false);
  };

  const removeMecanico = indexToRemove => {
    setSelectedMecanicos(prev =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  };

  // Handler para envío del formulario
  const handleSubmit = async () => {
    try {
      const submitData = {
        reparacionId,
        repuestos: repuestosAgregados,
        tiempoReparacion: formData.tiempoReparacion,
        mecanicos: selectedMecanicos.map(m =>
          typeof m === 'object' ? {id: m.id} : {id: m},
        ),
        descripcion: formData.descripcion,
        vehiculo,
      };

      console.log('Datos a enviar:', submitData);

      // Validar datos antes de enviar
      const validacion = reparacionServiceInstance.validarDatos(submitData);

      if (!validacion.esValido) {
        alert(`Errores de validación:\n${validacion.errores.join('\n')}`);
        return;
      }

      // Mostrar indicador de carga
      setEnviando(true);

      // Enviar datos
      const resultado = await reparacionServiceInstance.completarReparacion(
        submitData,
      );

      alert('¡Reparación completada exitosamente!');
      console.log('Resultado:', resultado);

      // Limpiar el formulario
      limpiarFormulario();
      handleNavigate();

      // Aquí puedes navegar a otra pantalla o limpiar el formulario
      // navigation.goBack(); // Si usas React Navigation
      // O limpiar el formulario:
      // limpiarFormulario();
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      alert(`Error al completar la reparación: ${error.message}`);
    } finally {
      setEnviando(false);
    }
  };

  // Validaciones
  const canAddRepuesto =
    selectedRepuestoObj && formData.cantidad && parseInt(formData.cantidad) > 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <FormTitle vehiculo={vehiculo} />

          <RepuestosSection
            formData={formData}
            updateFormData={updateFormData}
            uiState={uiState}
            updateUiState={updateUiState}
            availableRepuestos={availableRepuestos}
            selectRepuesto={selectRepuesto}
            addRepuesto={addRepuesto}
            canAddRepuesto={canAddRepuesto}
            repuestosAgregados={repuestosAgregados}
            removeRepuesto={removeRepuesto}
          />

          <TiempoReparacionSection
            value={formData.tiempoReparacion}
            onChange={value => updateFormData('tiempoReparacion', value)}
          />

          <MecanicosSection
            uiState={uiState}
            updateUiState={updateUiState}
            availableMecanicos={availableMecanicos}
            selectMecanico={selectMecanico}
            selectedMecanicos={selectedMecanicos}
            removeMecanico={removeMecanico}
          />

          <DescripcionSection
            value={formData.descripcion}
            onChange={value => updateFormData('descripcion', value)}
          />

          <TouchableOpacity
            style={[
              styles.submitButton,
              enviando && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={enviando}>
            <Text style={styles.submitButtonText}>
              {enviando ? 'Enviando...' : 'Completar informe'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Componentes auxiliares para mejorar la legibilidad
const FormTitle = ({vehiculo}) => (
  <Text style={styles.title}>
    {vehiculo
      ? `${vehiculo.tipo} - ${vehiculo.matricula}`
      : 'Tipo Vehículo - Matrícula'}
  </Text>
);

const RepuestosSection = ({
  formData,
  updateFormData,
  uiState,
  updateUiState,
  availableRepuestos,
  selectRepuesto,
  addRepuesto,
  canAddRepuesto,
  repuestosAgregados,
  removeRepuesto,
}) => (
  <>
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Repuestos utilizados</Text>
      <DropdownSelector
        value={formData.selectedRepuesto}
        placeholder={
          uiState.loadingRepuestos
            ? 'Cargando repuestos...'
            : 'Seleccionar repuesto'
        }
        isOpen={uiState.showRepuestoDropdown}
        onToggle={() =>
          updateUiState('showRepuestoDropdown', !uiState.showRepuestoDropdown)
        }
        items={availableRepuestos}
        onSelect={selectRepuesto}
        isLoading={uiState.loadingRepuestos}
        renderItem={item => item.descripcion}
        keyExtractor={item => item.id_repuesto}
      />
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Cantidad</Text>
      <View style={styles.cantidadContainer}>
        <TextInput
          style={[styles.input, styles.cantidadInput]}
          placeholder="Cantidad"
          value={formData.cantidad}
          onChangeText={value => updateFormData('cantidad', value)}
          keyboardType="numeric"
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          style={[
            styles.addButton,
            !canAddRepuesto && styles.addButtonDisabled,
          ]}
          onPress={addRepuesto}
          disabled={!canAddRepuesto}>
          <Text style={styles.addButtonText}>Agregar</Text>
        </TouchableOpacity>
      </View>
    </View>

    {repuestosAgregados.length > 0 && (
      <TagsContainer
        items={repuestosAgregados}
        onRemove={removeRepuesto}
        renderLabel={item => `${item.nombre} (${item.cantidad})`}
        keyExtractor={item => item.id_repuesto}
      />
    )}
  </>
);

const TiempoReparacionSection = ({value, onChange}) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>Tiempo de reparación</Text>
    <TextInput
      style={styles.input}
      placeholder="X Horas"
      value={value}
      onChangeText={onChange}
      placeholderTextColor="#999"
    />
  </View>
);

const MecanicosSection = ({
  uiState,
  updateUiState,
  availableMecanicos,
  selectMecanico,
  selectedMecanicos,
  removeMecanico,
}) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>Mecánicos</Text>
    <DropdownSelector
      placeholder={
        uiState.loadingMecanicos
          ? 'Cargando mecánicos...'
          : 'Seleccionar mecánico'
      }
      isOpen={uiState.showMecanicoDropdown}
      onToggle={() =>
        updateUiState('showMecanicoDropdown', !uiState.showMecanicoDropdown)
      }
      items={availableMecanicos}
      onSelect={selectMecanico}
      isLoading={uiState.loadingMecanicos}
      renderItem={item => item.nombre_completo}
      keyExtractor={item => item.id_mecanico}
    />

    <TagsContainer
      items={selectedMecanicos}
      onRemove={removeMecanico}
      renderLabel={item => (typeof item === 'object' ? item.nombre : item)}
      keyExtractor={(item, index) =>
        typeof item === 'object' ? `mecanico-${item.id}` : `mecanico-${index}`
      }
    />
  </View>
);

const DescripcionSection = ({value, onChange}) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>Descripción</Text>
    <TextInput
      style={[styles.input, styles.textArea]}
      placeholder="Descripción completa de la reparación..."
      value={value}
      onChangeText={onChange}
      multiline={true}
      numberOfLines={4}
      textAlignVertical="top"
      placeholderTextColor="#999"
    />
  </View>
);

const DropdownSelector = ({
  value,
  placeholder,
  isOpen,
  onToggle,
  items,
  onSelect,
  isLoading,
  renderItem,
  keyExtractor,
}) => (
  <>
    <TouchableOpacity style={styles.dropdown} onPress={onToggle}>
      <Text style={[styles.dropdownText, !value && styles.placeholder]}>
        {value || placeholder}
      </Text>
      <Text style={styles.dropdownArrow}>▼</Text>
    </TouchableOpacity>

    {isOpen && !isLoading && (
      <View style={styles.dropdownMenu}>
        {items.length > 0 ? (
          items.map((item, index) => (
            <TouchableOpacity
              key={keyExtractor ? keyExtractor(item) : index}
              style={styles.dropdownItem}
              onPress={() => onSelect(item)}>
              <Text style={styles.dropdownItemText}>{renderItem(item)}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.dropdownItem}>
            <Text style={[styles.dropdownItemText, styles.placeholder]}>
              No hay elementos disponibles
            </Text>
          </View>
        )}
      </View>
    )}
  </>
);

const TagsContainer = ({items, onRemove, renderLabel, keyExtractor}) => (
  <View style={styles.tagsContainer}>
    {items.map((item, index) => (
      <TagComponent
        key={keyExtractor ? keyExtractor(item, index) : index}
        label={renderLabel(item)}
        onRemove={() => onRemove(index)}
        color="#4ECDC4"
      />
    ))}
  </View>
);

const TagComponent = ({label, onRemove, color = '#4ECDC4'}) => (
  <View style={[styles.tag, {backgroundColor: color}]}>
    <Text style={styles.tagText}>{label}</Text>
    <TouchableOpacity onPress={onRemove} style={styles.tagRemove}>
      <Text style={styles.tagRemoveText}>×</Text>
    </TouchableOpacity>
  </View>
);

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 24,
    textAlign: 'left',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
    color: '#333',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  tagRemove: {
    marginLeft: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagRemoveText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fafafa',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#666',
  },
  dropdownMenu: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: 'white',
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#4ECDC4',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  placeholder: {
    color: '#999',
  },
  cantidadContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  cantidadInput: {
    flex: 1,
  },
  addButton: {
    backgroundColor: '#4ECDC4',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  addButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  submitButtonDisabled: {
    backgroundColor: '#cccccc',
    opacity: 0.6,
  },
});

export default CaseFinalForm;
