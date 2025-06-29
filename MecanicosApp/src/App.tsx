import '../gesture-handler.native';
import React, {use, useEffect, useState} from 'react';
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
import NewCase from './screens/NewCase';
import FinishedCaseDetail from './screens/FinishedCasesDetails';
import Register from './screens/Register';
import {LoginService} from './services/login/LoginService';
import {tokenService} from './services/token/tokenService';
import Menu from './screens/Menu';
import {AuthProvider, useAuth} from './context/authContext';
import CrearVehiculos from './screens/CrearVehiculos';

const Drawer = createDrawerNavigator();

function App(): React.JSX.Element {
  const screensNoRegistrado = [
    {name: 'Login', component: Login},
    {name: 'Register', component: Register},
  ];
  const screensMecanico = [
    {name: 'Ver Stock', component: StockTable},
    {name: 'Crear Stock', component: CrearStock},
    {name: 'Buscar Stock', component: StockSearch},
    {name: 'Casos Terminados', component: FinishedCases},
    {name: 'Casos Asignados', component: AssignedCases},
    {name: 'Crear Vehiculos', component: CrearVehiculos},
    {name: 'Menu', component: Menu},
  ];
  const screensJefe = [
    {name: 'Ver Stock', component: StockTable},
    {name: 'Crear Stock', component: CrearStock},
    {name: 'Buscar Stock', component: StockSearch},
    {name: 'Crear Vehiculos', component: CrearVehiculos},
    {name: 'Casos Terminados', component: FinishedCases},
    {name: 'Menu', component: Menu},
  ];
  const hiddenScreens = [
    {name: 'Formulario de reparación', component: CaseFinalForm},
    {name: 'Informe Completo', component: FinishedCaseDetail},
  ];
  const [screens, setScreens] = useState(screensNoRegistrado);
  const {rol} = useAuth();
  useEffect(() => {
    if (rol == 2) {
      setScreens(screensMecanico);
    } else if (rol == 1) {
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
