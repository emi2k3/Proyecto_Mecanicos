import '../gesture-handler.native';
import React, {Component, useEffect, useState} from 'react';
import StockTable from './screens/StockTable';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CrearStock from './screens/CreateStock';
import StockSearch from './screens/StockSearch';
import AssignedCases from './screens/AssignedCases';
import CustomDrawer from './componentes/CustomDrawer';
import FinishedCases from './screens/FinishedCases';
import Login from './screens/Login';
import CaseFinalForm from './screens/CaseFinalForm';
import FinishedCaseDetail from './screens/FinishedCasesDetails';
import Register from './screens/Register';
import Menu from './screens/Menu';
import {useAuth} from './context/authContext';
import CrearVehiculos from './screens/CrearVehiculos';
import EliminarVehiculo from './screens/EliminarVehiculo';
import NoAssignedCases from './screens/noAssignedCases';
import AssignCase from './screens/AssignCase';
import RegisterCliente from './screens/RegisterCustomer';
import AdminPanel from './screens/AdminPanel';
import Inventario from './screens/Inventario';
import PanelMecanico from './screens/PanelMecanico';
import NewCase from './screens/NewCase';

const Drawer = createDrawerNavigator();

function App(): React.JSX.Element {
  const screensNoRegistrado = [
    {name: 'Login', component: Login},
    {name: 'Register', component: Register},
  ];
  const screensMecanico = [
    {name: 'Panel de Mecánico', component: PanelMecanico},
    {name: 'Inventario', component: Inventario},
    {name: 'Casos Terminados', component: FinishedCases},
    {name: 'Menu', component: Menu},
  ];
  const screensJefe = [
    {name: 'Panel de administración', component: AdminPanel},
    {name: 'Inventario', component: Inventario},
    {name: 'Casos Terminados', component: FinishedCases},
    {name: 'Menu', component: Menu},
    {name: 'Casos no Asignados', component: NoAssignedCases},
  ];
  const hiddenScreens = [
    {name: 'Formulario de reparación', component: CaseFinalForm},
    {name: 'Registro de Clientes', component: RegisterCliente},
    {name: 'Informe Completo', component: FinishedCaseDetail},
    {name: 'Asignar Casos', component: AssignCase},
    {name: 'Ver Stock', component: StockTable},
    {name: 'Crear Stock', component: CrearStock},
    {name: 'Buscar Stock', component: StockSearch},
    {name: 'Nuevo Caso', component: NewCase},
    {name: 'Casos Asignados', component: AssignedCases},
    {name: 'Crear Vehiculos', component: CrearVehiculos},
    {name: 'Eliminar Vehiculos', component: EliminarVehiculo},
  ];
  const [screens, setScreens] = useState(screensNoRegistrado);
  const {rol} = useAuth();
  useEffect(() => {
    if (rol == 2) {
      setScreens(screensMecanico);
    } else if (rol == 3) {
      setScreens(screensJefe);
    } else {
      setScreens(screensNoRegistrado);
    }
  }, [rol]);
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={props => <CustomDrawer {...props} />}
        screenOptions={{
          drawerActiveBackgroundColor: '#5BC0BE',
          drawerActiveTintColor: 'white',
          drawerLabelStyle: {},
        }}>
        {screens.map(screen => (
          <Drawer.Screen
            key={screen.name}
            name={screen.name}
            component={screen.component}></Drawer.Screen>
        ))}
        {hiddenScreens.map(screen => (
          <Drawer.Screen
            key={screen.name}
            name={screen.name}
            component={screen.component}
            options={{drawerItemStyle: {display: 'none'}}}></Drawer.Screen>
        ))}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default App;
