import React, {useEffect, useState } from 'react';
import { StyleSheet, ScrollView,TouchableOpacity } from 'react-native';
import { ListItem } from '@rneui/themed';
import { reparacionService } from '../services/reparacion/reparacionService';
import { Icon, Text } from '@rneui/themed';
const FinishedCases = ({navigation}) => {
  const [finishedCase, setFinishedCase] = useState([]);
  useEffect(()=>{
    const fetchData = async () =>{
        const service = new reparacionService();
        const reparaciones = await service.getAllReparaciones();
        
        
    }
    fetchData();
  },[]);
   
    return (
        <Card>
            <Card.Title>Detalles</Card.Title>
                <Card.Divider/>
            <Text style={{fontWeight:'bold'}}>Matrícula:</Text>
            <Text>Matrícula</Text>
            <Text style={{fontWeight:'bold'}}>Repuestos Utilizados:</Text>
            <Text>Repuestos</Text>
            <Text style={{fontWeight:'bold'}}>Tiempo reparación:</Text>
            <Text>Tiempo</Text>
            <Text style={{fontWeight:'bold'}}>Mecánico/os:</Text>
            <Text>Nombre mecánico</Text>
            <Text style={{fontWeight:'bold'}}>Descripción:</Text>
           
        </Card>
      );
    };
    

    const styles = StyleSheet.create({
        
        listItem: {
          backgroundColor: '#ffffff',
          marginVertical: 2,
          borderRadius: 8,
          elevation: 1,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
        },
        
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 15,
          paddingHorizontal: 10,
        },
        
        cellText: {
          fontSize: 14,
          color: '#2c3e50',
          textAlign: 'center',
        },
        
        evenRow: {
          backgroundColor: '#ffffff',
        },
        
        oddRow: {
          backgroundColor: '#f8f9fa',
        },
        

      });

export default FinishedCases;