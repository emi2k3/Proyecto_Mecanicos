import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {ScrollView, Text} from 'react-native-gesture-handler';
import {LoginService} from '../services/login/LoginService';
import {useAuth} from '../context/authContext';

const Menu = ({navigation}) => {
  const log = new LoginService();
  const {setRol} = useAuth();
  const logOut = () => {
    log.logout();
    setRol(0);
  };
  return (
    <ScrollView>
      <Text style={styles.menu}>Bienvenido a Mecanicos App</Text>
      <TouchableOpacity onPress={logOut}>
        <Text>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  menu: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
export default Menu;
