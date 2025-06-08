import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ListItem } from '@rneui/themed';
import { repuestoService } from '../services/repuesto/repuestoService';
import { Repuesto } from '../interfaces/repuesto';

const StockTable = () => {
  const [stockData, setStockData] = useState([]);
  useEffect(()=>{
    const fetchData = async () =>{
        const service = new repuestoService();
        const repuestos = await service.getAllRepuestos();
        setStockData(repuestos); 
        
    }
    fetchData();
  },[]);
  return (
    
    <ScrollView style={styles.container}>
     <View style={styles.header}>
        <Text style={styles.headerTitle}>Stock</Text>
      </View>
      
    
      <View style={styles.tableHeader}>
        <Text style={[styles.headerText, styles.nombreColumn]}>Nombre</Text>
        <Text style={[styles.headerText, styles.tipoColumn]}>Tipo</Text>
        <Text style={[styles.headerText, styles.cantidadColumn]}>Cantidad</Text>
      </View>

      {stockData.map((item, index) => (
        
        <ListItem key={index} bottomDivider containerStyle={{  borderBottomWidth: 1.5,
          borderColor: '#ccc'}} >
          <ListItem.Content style={styles.row}>
            <Text style={[styles.cellText, styles.nombreColumn]}>{item.descripcion}</Text>
            <Text style={[styles.cellText, styles.tipoColumn]}>{item.tipo}</Text>
            <Text style={[styles.cellText, styles.cantidadColumn]}>{item.cantidad}</Text>
          </ListItem.Content>
        </ListItem>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4a4a4a',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e8e8e8',
    marginTop:75,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomWidth: 1,
    borderColor: '#ccc'
  },
  headerText: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18
  },
  row: {
    flexDirection: 'row',
    width: '100%',
  },
  cellText: {
    fontSize: 16,
    
  },
  nombreColumn: { flex: 1.5 , textAlign: 'center' },
  tipoColumn: { flex: 1.5, textAlign: 'center' },
  cantidadColumn: { flex: 1, textAlign: 'center' }
  });

export default StockTable;