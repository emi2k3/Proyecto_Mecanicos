import '../gesture-handler.native';
import React, {Component} from 'react';

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

const Drawer = createDrawerNavigator();

function App(): React.JSX.Element {
  // Pantallas que APARECEN en el drawer (menú lateral)
  const drawerScreens = [
    {name: 'Login', component: Login},
    {name: 'Ver Stock', component: StockTable},
    {name: 'Crear Stock', component: CrearStock},
    {name: 'Buscar Stock', component: StockSearch},
    {name: 'Casos Asignados', component: AssignedCases},
    {name: 'Casos Terminados', component: FinishedCases},
    {name: 'Nuevo Ingreso', component: NewCase},
  ];

  // Pantallas que NO aparecen en el drawer (pantallas ocultas)
  const hiddenScreens = [
    {name: 'Formulario de reparación', component: CaseFinalForm},
    {name: 'Informe Completo', component: FinishedCaseDetail},
  ];

  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={props => <CustomDrawer {...props} />}
        screenOptions={{
          drawerActiveBackgroundColor: '#5BC0BE',
          drawerActiveTintColor: 'white',
          drawerLabelStyle: {},
        }}>
        {/* Pantallas que aparecen en el drawer */}
        {drawerScreens.map(screen => (
          <Drawer.Screen
            key={screen.name}
            name={screen.name}
            component={screen.component}
          />
        ))}

        {/* Pantallas ocultas del drawer */}
        {hiddenScreens.map(screen => (
          <Drawer.Screen
            key={screen.name}
            name={screen.name}
            component={screen.component}
            options={{
              drawerItemStyle: {display: 'none'}, // Oculta del drawer
            }}
          />
        ))}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default App;
