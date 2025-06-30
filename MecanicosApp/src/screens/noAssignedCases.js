import React, {useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {ScrollView, View} from 'react-native';
import {Card, Icon, Button, Text} from '@rneui/themed';
import {ActivityIndicator} from 'react-native';
import {reparacionService} from '../services/reparacion/reparacionService';

const NoAssignedCases = ({navigation}) => {
  const [reparaciones, setReparaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const service = new reparacionService();

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const reparacionesData = await service.getAllUnAssignedReparaciones();

          const reparacionesConVehiculo = await Promise.all(
            reparacionesData.map(async rep => {
              const vehiculo = await service.getVehiculoReparado(
                rep.id_vehiculo,
              );
              return {
                ...rep,
                vehiculo,
              };
            }),
          );

          setReparaciones(reparacionesConVehiculo);
        } catch (error) {
          console.error('Error al obtener las reparaciones:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, []),
  );

  const handleAsignar = reparacion => {
    navigation.navigate('Asignar Casos', {
      reparacion: reparacion,
    });
  };

  return (
    <ScrollView style={{backgroundColor: '#f2f3f5', flex: 1}}>
      <View style={{marginTop: 20}}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#5BC0BE"
            style={{marginTop: 40}}
          />
        ) : (
          reparaciones.map((item, index) => (
            <Card
              key={index}
              containerStyle={{
                borderRadius: 10,
                backgroundColor: '#fff',
                marginVertical: 10,
              }}>
              {/* Encabezado de la tarjeta */}
              <Card.Title style={{alignSelf: 'flex-start'}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon
                    name="info"
                    type="feather"
                    color="#1E1E1E"
                    size={22}
                    containerStyle={{marginRight: 10}}
                  />
                  <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                    {item.vehiculo
                      ? `${item.vehiculo.tipo} - ${item.vehiculo.matricula}`
                      : 'Vehículo no encontrado'}
                  </Text>
                </View>
              </Card.Title>

              {/* Descripción */}
              <Text style={{fontSize: 14, color: '#333', marginVertical: 10}}>
                {item.descripcion}
              </Text>

              {/* Botón */}
              <Button
                title="Asignar"
                buttonStyle={{
                  backgroundColor: '#5BC0BE',
                  borderRadius: 6,
                  paddingVertical: 6,
                  paddingHorizontal: 12,
                }}
                titleStyle={{color: '#fff', fontWeight: 'bold', fontSize: 14}}
                containerStyle={{alignSelf: 'flex-start'}}
                onPress={() => handleAsignar(item)}
              />
            </Card>
          ))
        )}
      </View>
    </ScrollView>
  );
};

export default NoAssignedCases;
