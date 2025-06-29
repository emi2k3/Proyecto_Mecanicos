/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import {AuthProvider} from './src/context/authContext';

AppRegistry.registerComponent(appName, () => () => (
  <AuthProvider>
    <App></App>
  </AuthProvider>
));
