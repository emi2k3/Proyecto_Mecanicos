import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView 
} from 'react-native';

const  StockSearch =  () => {
  const [searchText, setSearchText] = useState('');
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState('0');

  const onSearch = () => {
    // GET de repuesto
    setProduct({ name: 'Producto Ejemplo', current: 42 });
    setQty('0');
  };

  const changeQty = (delta = 0) => {
    const n = parseInt(qty) || 0;
    const total = n + delta;
    setQty(String(total < 0 ? 0 : total));
  };

  const onConfirm = () => {
    // PUT de repuestos
    console.log('Confirmar ajuste:', qty);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Buscar y Ajustar Stock</Text>

      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar producto"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.searchButton} onPress={onSearch}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {product && (
        <View style={styles.card}>
          <Text style={styles.label}>
            <Text style={styles.labelBold}>Producto:</Text> {product.name}
          </Text>
          <Text style={styles.label}>
            <Text style={styles.labelBold}>Stock actual:</Text> {product.current}
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
            />

            <TouchableOpacity 
              style={[styles.qtyButton, styles.plusButton]} 
              onPress={() => changeQty(+1)}
            >
              <Text style={styles.qtyButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
            <Text style={styles.confirmButtonText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      )}
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
  searchRow: {
    flexDirection: 'row',
    marginBottom: 20,
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