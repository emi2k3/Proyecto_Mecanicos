import React, { useEffect, useState }  from 'react';
import { ScrollView, View } from 'react-native';
import { Header, Card, Icon, Button, Text } from '@rneui/themed';
import { reparacionService } from '../services/reparacion/reparacionService';
import { ActivityIndicator } from 'react-native';


const AssignedCases = () => {

  const [reparaciones, setReparaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const service = new reparacionService();
        const reparacionesData = await service.getAllReparaciones();

        const reparacionesConVehiculo = await Promise.all(
          reparacionesData.map(async (rep) => {
            const vehiculo = await service.getVehiculoReparado(rep.id_vehiculo);
            return {
              ...rep,
              vehiculo,
            };
          })
        );

        setReparaciones(reparacionesConVehiculo);
      } catch (error) {
        console.error('Error al obtener las reparaciones:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  return (
    <ScrollView style={{ backgroundColor: '#f2f3f5', flex: 1 }}>
      
    <Header
      backgroundColor="#2c3e50"
      containerStyle={{ height: 80 }}
      leftComponent={
        <View style={{ flexDirection: 'row', alignItems: 'center', width: 250, paddingTop: 20 }}>
          <Icon
            name="bars"
            type="font-awesome"
            color="#ffffff"
            size={20}
            containerStyle={{ marginRight: 10 }}
          />
          <Text
            numberOfLines={1}
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#fff',
              flexShrink: 1,
            }}
          >
            Trabajos Asignados
          </Text>
        </View>
      }
    />

    <View style={{ marginTop: 20 }}>
            {loading ? (
        <ActivityIndicator size="large" color="#5BC0BE" style={{ marginTop: 40 }} />
      ) : (
        reparaciones.map((item, index) => (
          <Card
            key={index}
            containerStyle={{
              borderRadius: 10,
              backgroundColor: '#fff',
              marginVertical: 10
            }}
          >
            {/* Encabezado de la tarjeta */}
            <Card.Title style={{ alignSelf: 'flex-start' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  name="info"
                  type="feather"
                  color="#1E1E1E"
                  size={22}
                  containerStyle={{ marginRight: 10 }}
                />
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                  {item.vehiculo
                  ? `${item.vehiculo.tipo} - ${item.vehiculo.matricula}`
                  : 'Vehículo no encontrado'}
                </Text>
              </View>
            </Card.Title>

            {/* Descripción */}
            <Text style={{ fontSize: 14, color: '#333', marginVertical: 10 }}>
              {item.descripcion}
            </Text>

            {/* Botón */}
            <Button
              title="Completar informe"
              buttonStyle={{
                backgroundColor: '#5BC0BE',
                borderRadius: 6,
                paddingVertical: 6,
                paddingHorizontal: 12,
              }}
              titleStyle={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}
              containerStyle={{ alignSelf: 'flex-start' }}
              onPress={() => {
                // Acción del botón
              }}
            />
          </Card>
        ))
      )}
    </View>
    </ScrollView>

    
  );
};

export default AssignedCases;
