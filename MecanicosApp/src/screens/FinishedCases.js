import React, {useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {StyleSheet, ScrollView, TouchableOpacity, View} from 'react-native';
import {ListItem} from '@rneui/themed';
import {reparacionService} from '../services/reparacion/reparacionService';
import {Icon, Text} from '@rneui/themed';

const FinishedCases = ({navigation}) => {
  const [finishedCases, setFinishedCases] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const service = new reparacionService();
          const reparacionesData = await service.getAllReparaciones();
          const reparacionesFinalizadas = reparacionesData.filter(
            rep => rep.estado === true,
          );
          const reparacionesConVehiculo = await Promise.all(
            reparacionesFinalizadas.map(async rep => {
              const vehiculo = await service.getVehiculoReparado(
                rep.id_vehiculo,
              );
              return {
                ...rep,
                vehiculo,
              };
            }),
          );
          setFinishedCases(reparacionesConVehiculo);
        } catch (error) {
          console.error('Error al obtener las reparaciones:', error);
        }
      };

      fetchData();
      return () => {};
    }, []),
  );

  return (
    <ScrollView>
      {finishedCases.map((item, index) => {
        const isPar = index % 2 === 0;
        return (
          <ListItem
            key={index}
            containerStyle={[
              styles.listItem,
              isPar ? styles.evenRow : styles.oddRow,
            ]}>
            <ListItem.Content>
              <View style={styles.mainContainer}>
                <TouchableOpacity style={styles.iconContainer}>
                  <Icon name="clipboard" type="feather" size={50} />
                </TouchableOpacity>

                <View style={styles.textContainer}>
                  <Text style={styles.labelText}>Tipo Vehículo:</Text>
                  <Text style={styles.valueText}>{item.vehiculo.tipo}</Text>

                  <Text style={styles.labelText}>Matrícula:</Text>
                  <Text style={styles.valueText}>
                    {item.vehiculo.matricula}
                  </Text>

                  <Text style={styles.labelText}>Tiempo:</Text>
                  <Text style={styles.valueText}>{item.tiempo}h</Text>
                </View>
              </View>
            </ListItem.Content>
          </ListItem>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  listItem: {
    marginVertical: 2,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    marginTop: 50,
    marginLeft: 15,
    marginRight: 15,
    width: '90%',
    borderRadius: 25,
  },

  mainContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
  },

  iconContainer: {
    marginRight: 15,
    marginTop: 45,
  },

  textContainer: {
    flex: 1,
  },

  labelText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 2,
  },

  valueText: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 8,
  },

  evenRow: {
    backgroundColor: '#ffffff',
  },

  oddRow: {
    backgroundColor: '#f8f9fa',
  },
});

export default FinishedCases;
