import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView 
} from 'react-native';
import { Dialog } from '@rneui/themed';
import { repuestoService } from '../services/repuesto/repuestoService';


const StockSearch = () => {
  const [searchText, setSearchText] = useState(''); 
  const [repuesto, setRepuesto] = useState(null);
  const [qty, setQty] = useState('0');
  const [listaRepuestos, setListaRepuestos] = useState([]); 
  const [showDropdown, setShowDropdown] = useState(false); 
  const [confirmarVisibile, setconfirmarVisibile] = useState(false);
  const [repuestosFiltrados, setRepuestosFiltrados] = useState([]); 

  useEffect(() => {
    const fetchData = async () => {
      const service = new repuestoService();
      const repuestos = await service.getAllRepuestos();
      setListaRepuestos(repuestos); 
      
    }
    fetchData();
  }, []);

  const searchRepuesto = (texto) => {
    setSearchText(texto);
    
    if (texto.length > 0) {
      const filtrados = listaRepuestos.filter(repuesto =>
        repuesto.descripcion.toLowerCase().includes(texto.toLowerCase())
        
      );
      setRepuestosFiltrados(filtrados.slice(0, 8)); // Para que no haya muchas sug en la pantalla
      setShowDropdown(filtrados.length > 0);
    } else {
      setShowDropdown(false);
      setRepuestosFiltrados([]);
    }
  };
  const selectRepuesto = (repuesto) => {
    setSearchText(repuesto.descripcion);
    setRepuesto(repuesto);
    setShowDropdown(false);
    setQty(String(repuesto.cantidad));
  };

  const changeQty = (delta = 0) => {
    const n = parseInt(qty) || 0;
    const total = n + delta;
    setQty(String(total < 0 ? 0 : total));
  };

  const dialog = () => {
   setconfirmarVisibile(!confirmarVisibile);
  };

  const confirmarStock = (repuesto) =>
  {
    const servicePut = new repuestoService();
    repuesto.cantidad = parseInt(qty);
    servicePut.putRepuesto(repuesto.id_repuesto,repuesto);
    dialog();
  }

  const validarBlur = () => {
    const numero = parseInt(qty) || 0;
    const numeroValido = numero < 0 ? 0 : numero;
    setQty(String(numeroValido));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Buscar y Ajustar Stock</Text>

      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar producto"
            value={searchText}
            onChangeText={searchRepuesto} 
            onFocus={() => searchText.length > 0 && setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          />
        </View>

        {showDropdown && (
          <View style={styles.dropdown}>
            {repuestosFiltrados.map((repuesto, index) => (
              <TouchableOpacity
                key={repuesto.id_repuesto || index}
                style={styles.dropdownItem}
                onPress={() => selectRepuesto(repuesto)}
              >
                <Text style={styles.dropdownText}>{repuesto.descripcion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {repuesto && (
        <View style={styles.card}>
          <Text style={styles.label}>
            <Text style={styles.labelBold}>Producto:</Text> {repuesto.descripcion}
          </Text>
          <Text style={styles.label}>
            <Text style={styles.labelBold}>Stock actual:</Text> {repuesto.cantidad}
          </Text>

          <View style={styles.adjustRow}>
            <TouchableOpacity 
              style={styles.qtyButton} 
              onPress={() => changeQty(-1)}
            >
              <Text style={styles.qtyButtonText}>–</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.qtyInput}
              keyboardType="number-pad"
              value={qty}
              onChangeText={setQty}
              onBlur={validarBlur}
            />

            <TouchableOpacity 
              style={[styles.qtyButton, styles.plusButton]} 
              onPress={() => changeQty(+1)}
            >
              <Text style={styles.qtyButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.confirmButton} onPress={dialog}>
            <Text style={styles.confirmButtonText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      )}

    <Dialog
      isVisible={confirmarVisibile}
      onBackdropPress={dialog}
    >
      <Dialog.Title title="¿Quiere confirmar el cambio de stock?"/>
      <Dialog.Actions>
        <Dialog.Button title="Cancelar" onPress={dialog}/>
        <Dialog.Button title="Aceptar" onPress={()=>confirmarStock(repuesto)}/>
      </Dialog.Actions>
    </Dialog>
    </ScrollView>


  );
}

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
    shadowOffset: { width: 0, height: 2 },
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
  qtyButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  plusButton: {
    backgroundColor: '#27ae60',
  },
  qtyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  qtyInput: {
    flex: 1,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    textAlign: 'center',
    height: 40,
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: '#3273dc',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default StockSearch;