import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './src/routes/StackNavigator';
import Navbar from './src/components/shared/Navbar';
import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';

export const App = () => {
  // Solicitar permiso para recibir notificaciones
  const requestPermission = async () => {
    const authorizationStatus = await messaging().requestPermission();
    if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      console.log('Permiso concedido para recibir notificaciones');
    } else {
      console.log('Permiso denegado para recibir notificaciones');
    }
  };

  // Suscribir al tema 'players'
  const subscribeToTopic = async () => {
    await messaging().subscribeToTopic('players');
    console.log('Dispositivo suscrito al tema "players"');
  };

  // Manejar las notificaciones cuando la app está en primer plano
  const handleForegroundNotifications = () => {
    messaging().onMessage(async remoteMessage => {
      // Verifica si hay una notificación antes de acceder a su contenido
      if (remoteMessage.notification) {
        // Muestra una alerta cuando llega una notificación
        Alert.alert('Notificación', remoteMessage.notification.body);
      } else {
        console.log('Notificación sin cuerpo:', remoteMessage);
      }
    });
  };
  

  const handleBackgroundNotifications = () => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      // Verifica si hay una notificación antes de acceder a su contenido
      if (remoteMessage.notification) {
        console.log('Notificación en segundo plano:', remoteMessage.notification.body);
        // Aquí puedes mostrar una notificación local si lo deseas
      } else {
        console.log('Notificación sin cuerpo en segundo plano:', remoteMessage);
      }
    });
  };
  

  useEffect(() => {
    // Solicitar permisos, suscribirse al tema y manejar notificaciones
    requestPermission();
    subscribeToTopic();
    handleForegroundNotifications();
    handleBackgroundNotifications();
  }, []);

  return (
    <NavigationContainer>
      <Navbar />
      <StackNavigator />
    </NavigationContainer>
  );
};

export default App;
