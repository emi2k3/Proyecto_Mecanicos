import '../gesture-handler.native';
import React from 'react';

import StockTable from './screens/StockTable';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CrearStock from './screens/CreateStock';
import StockSearch from './screens/StockSearch';
import AssignedCases from './screens/AssignedCases';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Drawer = createDrawerNavigator();
function App(): React.JSX.Element {
const screens = [ {name: "Ver Stock" , component: StockTable},{name: "Crear Stock" , component: CrearStock}, {name: "Buscar Stock" , component: StockSearch},
{name: "Asignar" , component: AssignedCases}]
  return (

      <NavigationContainer>
        <Drawer.Navigator >
        {screens.map((screen)=>(
          <Drawer.Screen key={screen.name} name={screen.name} component={screen.component}>
          </Drawer.Screen>
      ))
      }
        </Drawer.Navigator>
      </NavigationContainer>

    
  );
}

export default App;
