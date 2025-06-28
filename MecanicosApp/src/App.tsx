import '../gesture-handler.native';
import React from 'react';

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

const Drawer = createDrawerNavigator();
function App(): React.JSX.Element {
  const screens = [
    {name: 'Ver Stock', component: StockTable},
    {name: 'Crear Stock', component: CrearStock},
    {name: 'Buscar Stock', component: StockSearch},
    {name: 'Casos Asignados', component: AssignedCases},
    {name: 'Casos Terminados', component: FinishedCases},
    {name: 'Login', component: Login},
    {name: 'Informe Completo', component: CaseFinalForm},
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
        {screens.map(screen => (
          <Drawer.Screen
            key={screen.name}
            name={screen.name}
            component={screen.component}></Drawer.Screen>
        ))}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default App;
