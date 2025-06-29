import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import {ListItem, Card, Text, Chip} from '@rneui/themed';
import {reparacionService} from '../services/reparacion/reparacionService';
import {Icon} from '@rneui/themed';

const FinishedCaseDetail = ({navigation, route}) => {
  const [reparacion, setReparacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener el ID de la reparación desde los parámetros de navegación
  const reparacionId = route?.params?.id;

  useEffect(() => {
    const fetchData = async () => {
      console.log('Fetching data for reparacionId:', reparacionId);
      if (!reparacionId) {
        setError('No se proporcionó ID de reparación');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const service = new reparacionService();
        const reparacionData = await service.getCompletedReparacionById(
          reparacionId,
        );

        if (reparacionData) {
          setReparacion(reparacionData);
          setError(null);
        } else {
          setError('No se pudo cargar la reparación');
        }
      } catch (err) {
        setError('Error al cargar los datos');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [reparacionId]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={{marginTop: 10}}>Cargando detalles...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Icon name="error-outline" size={50} color="#e74c3c" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setError(null);
            setLoading(true);
            // Reintentar la carga
          }}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!reparacion) {
    return (
      <View style={styles.centerContainer}>
        <Text>No se encontró la reparación</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card containerStyle={styles.card}>
        <Card.Title>Detalles de la Reparación</Card.Title>
        <Card.Divider />

        <View style={styles.detailRow}>
          <Text style={styles.labelText}>Matrícula:</Text>
          <Text style={styles.valueText}>{reparacion.matricula || 'N/A'}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.labelText}>Estado:</Text>
          <Chip
            title={reparacion.estado ? 'Completada' : 'En Proceso'}
            color={reparacion.estado ? '#27ae60' : '#f39c12'}
            titleStyle={{color: 'white', fontSize: 12}}
            size="sm"
          />
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.labelText}>Descripción:</Text>
          <Text style={styles.descriptionText}>
            {reparacion.descripcion || 'Sin descripción'}
          </Text>
        </View>

        {reparacion.tiempo && (
          <View style={styles.detailRow}>
            <Text style={styles.labelText}>Tiempo de reparación:</Text>
            <Text style={styles.valueText}>{reparacion.tiempo} horas</Text>
          </View>
        )}

        <View style={styles.detailSection}>
          <Text style={styles.labelText}>Repuestos Utilizados:</Text>
          {reparacion.repuestos && reparacion.repuestos.length > 0 ? (
            reparacion.repuestos.map((repuesto, index) => (
              <View key={index} style={styles.repuestoItem}>
                <Text style={styles.repuestoText}>
                  • {repuesto.nombre} (Cantidad: {repuesto.cantidad_usada})
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>No se utilizaron repuestos</Text>
          )}
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.labelText}>Mecánico(s):</Text>
          {reparacion.mecanicos && reparacion.mecanicos.length > 0 ? (
            reparacion.mecanicos.map((mecanico, index) => (
              <View key={index} style={styles.mecanicoItem}>
                <Icon name="person" size={16} color="#34495e" />
                <Text style={styles.mecanicoText}>
                  {mecanico.nombre_completo}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>No hay mecánicos asignados</Text>
          )}
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  card: {
    margin: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },

  detailSection: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },

  labelText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 5,
  },

  valueText: {
    fontSize: 16,
    color: '#34495e',
    flex: 1,
    textAlign: 'right',
  },

  descriptionText: {
    fontSize: 15,
    color: '#34495e',
    lineHeight: 22,
    marginTop: 5,
  },

  repuestoItem: {
    paddingVertical: 4,
    paddingLeft: 10,
  },

  repuestoText: {
    fontSize: 14,
    color: '#34495e',
  },

  mecanicoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingLeft: 10,
  },

  mecanicoText: {
    fontSize: 14,
    color: '#34495e',
    marginLeft: 8,
  },

  noDataText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontStyle: 'italic',
    marginTop: 5,
    marginLeft: 10,
  },

  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginTop: 10,
  },

  retryButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 15,
  },

  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FinishedCaseDetail;
