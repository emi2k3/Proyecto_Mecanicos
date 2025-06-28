import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ListItem } from '@rneui/themed';
import { repuestoService } from '../services/repuesto/repuestoService';
import { Text } from '@rneui/themed';


const StockTable = ({navigation}) => {
  const [stockData, setStockData] = useState([]);


  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const service = new repuestoService();
        const repuestos = await service.getAllRepuestos();
        setStockData(repuestos);
      };
      fetchData();
    }, [])
  );

 

  return (
   
    <ScrollView style={styles.container}>
      <View style={styles.tableHeader}>
        <Text style={[styles.headerText, styles.nombreColumn]}>Nombre</Text>
        <Text style={[styles.headerText, styles.tipoColumn]}>Tipo</Text>
        <Text style={[styles.headerText, styles.cantidadColumn]}>Cantidad</Text>
      </View>

      {stockData.map((item, index) => {
      const isOdd = index % 2 !== 0; 
  return (
    <ListItem 
      key={index} 
      bottomDivider 
      containerStyle={{
        borderBottomWidth: 1.5,
        borderColor: '#ccc',
        backgroundColor: isOdd ? '#E2E2E2' : '#ffffff' 
      }}
    >
      <ListItem.Content style={styles.row}>
        <Text style={[styles.cellText, styles.nombreColumn]}>{item.descripcion}</Text>
        <Text style={[styles.cellText, styles.tipoColumn]}>{item.tipo}</Text>
        <Text style={[styles.cellText, styles.cantidadColumn]}>{item.cantidad}</Text>
      </ListItem.Content>
    </ListItem>
  );
})}
    
    </ScrollView>
  
  );
};

const styles = StyleSheet.create({
  drawercontainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  navigationContainer: {
    backgroundColor: '#ecf0f1',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  cantidadColumn: { flex: 1, textAlign: 'center' },
  navBotton: {
    backgroundColor: '#3273dc',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20
  },
  navBottonText: {
    color: '#fff',
    fontWeight: '600',
  }
  });

export default StockTable;