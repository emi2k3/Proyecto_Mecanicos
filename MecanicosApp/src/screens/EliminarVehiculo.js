import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {Dialog} from '@rneui/themed';
import {vehiculosService} from '../services/vehiculos/vehiculosService';
import {Text} from '@rneui/themed';
import {clientesService} from '../services/clientes/clientesService';

const EliminarVehiculo = () => {
  const [searchText, setSearchText] = useState('');
  const [vehiculo, setVehiculo] = useState(null);
  const [nombreDueño, setNombreDueño] = useState('');
  const [listaVehiculos, setListaVehiculos] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [confirmarVisibile, setconfirmarVisibile] = useState(false);
  const [vehiculosFiltrados, setVehiculosFiltrados] = useState([]);
  const getDueñoData = new clientesService();
  const service = new vehiculosService();
  useEffect(() => {
    const fetchData = async () => {
      const vehiculos = await service.getAllVehiculos();
      setListaVehiculos(vehiculos);
    };
    fetchData();
  }, []);

  const searchVehiculo = texto => {
    setSearchText(texto);

    if (texto.length > 0) {
      const filtrados = listaVehiculos.filter(vehiculo =>
        vehiculo.matricula.toLowerCase().includes(texto.toLowerCase()),
      );
      setVehiculosFiltrados(filtrados.slice(0, 8));
      setShowDropdown(filtrados.length > 0);
    } else {
      setShowDropdown(false);
      setVehiculosFiltrados([]);
    }
  };
  const selectVehiculo = async vehiculo => {
    setSearchText(vehiculo.matricula);
    setVehiculo(vehiculo);
    let Dueño = await getDueñoData.getClienteByID(vehiculo.id_cliente);
    if (Dueño != null) {
      setNombreDueño(Dueño.nombre_completo);
    } else {
      setNombreDueño('No se pudo encontrar el nombre.');
      setVehiculosFiltrados([]);
    }
    setShowDropdown(false);
  };

  const dialog = () => {
    setconfirmarVisibile(!confirmarVisibile);
  };

  const eliminarVehiculo = async vehiculo => {
    let estado = await service.eliminarVehiculo(vehiculo.id_vehiculo);
    if (estado != true) {
      Alert.alert('Error', 'Hubo un error al eliminar el vehiculo.');
    } else {
      setVehiculo(null);
    }
    dialog();
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar matrícula"
            value={searchText}
            onChangeText={searchVehiculo}
            onFocus={() => searchText.length > 0 && setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          />
        </View>

        {showDropdown && (
          <View style={styles.dropdown}>
            {vehiculosFiltrados.map((vehiculo, index) => (
              <TouchableOpacity
                key={vehiculo.id_vehiculo || index}
                style={styles.dropdownItem}
                onPress={() => selectVehiculo(vehiculo)}>
                <Text style={styles.dropdownText}>{vehiculo.matricula}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {vehiculo && (
        <View style={styles.card}>
          <Text style={styles.label}>
            <Text style={styles.labelBold}>Matricula:</Text>{' '}
            {vehiculo.matricula}
          </Text>
          <Text style={styles.label}>
            <Text style={styles.labelBold}>Marca:</Text> {vehiculo.marca}
          </Text>
          <Text style={styles.label}>
            <Text style={styles.labelBold}>Modelo:</Text> {vehiculo.modelo}
          </Text>
          <Text style={styles.label}>
            <Text style={styles.labelBold}>Dueño:</Text> {nombreDueño}
          </Text>

          <TouchableOpacity style={styles.confirmButton} onPress={dialog}>
            <Text style={styles.confirmButtonText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      )}

      <Dialog isVisible={confirmarVisibile} onBackdropPress={dialog}>
        <Dialog.Title title="¿Quiere eliminar el vehículo?" />
        <Dialog.Actions>
          <Dialog.Button title="Cancelar" onPress={dialog} />
          <Dialog.Button
            title="Aceptar"
            onPress={() => eliminarVehiculo(vehiculo)}
          />
        </Dialog.Actions>
      </Dialog>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f2f3f5',
    flexGrow: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 40,
    marginBottom: 20,
    textAlign: 'center',
  },
  searchContainer: {
    position: 'relative',
    zIndex: 1000,
    marginBottom: 20,
    marginTop: 20,
  },
  searchRow: {
    flexDirection: 'row',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#e8e8e8',
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 44,
  },
  searchButton: {
    marginLeft: 12,
    backgroundColor: '#3273dc',
    borderRadius: 6,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  dropdown: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 70,
    backgroundColor: '#fff',
    borderRadius: 6,
    maxHeight: 200,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f3f5',
  },
  dropdownText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  dropdownStock: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  labelBold: {
    fontWeight: '600',
  },
  adjustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  plusButton: {
    backgroundColor: '#27ae60',
  },
  confirmButton: {
    backgroundColor: '#ED2939',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default EliminarVehiculo;
