import React, {useEffect, useState } from 'react';
import { StyleSheet, ScrollView,TouchableOpacity } from 'react-native';
import { ListItem } from '@rneui/themed';
import { reparacionService } from '../services/reparacion/reparacionService';
import { Icon, Text } from '@rneui/themed';
const FinishedCases = ({navigation}) => {
  const [finishedCases, setFinishedCases] = useState([]);
  useEffect(()=>{
    const fetchData = async () =>{
        const service = new reparacionService();
        const reparaciones = await service.getAllReparaciones();
        setFinishedCases( reparaciones.filter((reparacion)=>{
            return reparacion.estado === true;
        })); 
        
    }
    fetchData();
  },[]);
   
    return (
        <ScrollView>
          {finishedCases.map((item, index) => {
            const isPar = index % 2 === 0;
            return (
              <ListItem 
                key={index}
                containerStyle={[
                  styles.listItem,
                  isPar ? styles.evenRow : styles.oddRow
                ]}
              >
                <ListItem.Content>
                  <TouchableOpacity>
                    <Icon name="info" type="feather" size={22} />
                  </TouchableOpacity>
                  <Text>{item.tipo}</Text>
                  <Text>{item.matricula}</Text>
                  <Text>{item.tiempo}</Text>
                </ListItem.Content>
              </ListItem>
            );
          })}
        </ScrollView>
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