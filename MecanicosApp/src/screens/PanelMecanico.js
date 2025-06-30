import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';

const PanelMecanico = ({navigation}) => {
  const adminOptions = [
    {
      id: 1,
      title: 'Nuevo Caso',
      subtitle: 'Registrar una nueva reparación',
      icon: '🔧🔩',
      color: '#4ecdc4',
      route: 'Nuevo Caso',
    },
    {
      id: 2,
      title: 'Mis Casos Asignados',
      subtitle: 'Ver y gestionar la lista de casos que se me asignaron',
      icon: '📋',
      color: '#4ecdc4',
      route: 'Casos Asignados',
    },
    {
      id: 3,
      title: 'Registrar nuevo vehiculo',
      subtitle: 'Formulario para registrar un nuevo vehiculo',
      icon: '🚗+',
      color: '#4ecdc4',
      route: 'Crear Vehiculos',
    },
    {
      id: 4,
      title: 'Eliminar Vehiculo',
      subtitle: 'Buscador para eliminar un vehículo registrado',
      icon: '🚗-',
      color: '#4ecdc4',
      route: 'Eliminar Vehiculos',
    },
  ];

  const handleOptionPress = route => {
    if (navigation && route) {
      navigation.navigate(route);
    } else {
      // Fallback para testing - puedes remover esto
      console.log(`Navegando a: ${route}`);
    }
  };

  const renderAdminButton = option => (
    <TouchableOpacity
      key={option.id}
      style={[styles.adminButton, {borderLeftColor: option.color}]}
      onPress={() => handleOptionPress(option.route)}
      activeOpacity={0.8}>
      <View style={styles.buttonContent}>
        <View style={[styles.iconContainer, {backgroundColor: option.color}]}>
          <Text style={styles.icon}>{option.icon}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.buttonTitle}>{option.title}</Text>
          <Text style={styles.buttonSubtitle}>{option.subtitle}</Text>
        </View>
        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>›</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.buttonsContainer}>
          {adminOptions.map(option => renderAdminButton(option))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>MecánicosApp v1.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 25,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  buttonsContainer: {
    padding: 20,
  },
  adminButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  icon: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  buttonSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  arrowContainer: {
    paddingLeft: 10,
  },
  arrow: {
    fontSize: 24,
    color: '#bdc3c7',
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#95a5a6',
  },
});

export default PanelMecanico;
