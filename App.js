import React from 'react';
import firebase from 'firebase';
import { YellowBox } from 'react-native';
import _ from 'lodash';
import { createAppContainer, createBottomTabNavigator, createStackNavigator, createSwitchNavigator, SafeAreaView } from 'react-navigation';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { Icon } from 'react-native-elements';
import LoginScreen from './src/screens/LoginScreen';
import RegistrationScreen from './src/screens/RegistrationScreen';
import HomeScreen from './src/screens/HomeScreen';
import MilesScreen from './src/screens/MilesScreen';
import Classroom from './src/screens/Classroom';
import SettingsScreen from './src/screens/SettingsScreen';

export default class App extends React.Component {
  componentWillMount() {
    YellowBox.ignoreWarnings(['Setting a timer']);
    const _console = _.clone(console);
    console.warn = message => {
      if (message.indexOf('Setting a timer') <= -1) {
        _console.warn(message);
      }
    };
    firebase.initializeApp({
      apiKey: "AIzaSyCaK8JIurUT8bFCSTLOUlrUmspABLdtchU",
      authDomain: "idlegame-1f133.firebaseapp.com",
      databaseURL: "https://idlegame-1f133.firebaseio.com",
      projectId: "idlegame-1f133",
      storageBucket: "idlegame-1f133.appspot.com",
      messagingSenderId: "799768587608"
    });
    global.apiKey = 'AIzaSyCaK8JIurUT8bFCSTLOUlrUmspABLdtchU';

  }

  render() {

    const Tabs = createBottomTabNavigator(
      {
        HomeStack: {
          screen: HomeScreen,
          path: '/',
            navigationOptions: {
              tabBarIcon: ({ focused, tintColor }) => {
                  const iconName = `ios-home${focused ? '' : '-outline'}`;
                  return <Icon name="home" size={30} color={tintColor}/>;
              },
              tabBarLabel: false
          },       
        },

        ClassroomStack: {
          screen: Classroom,
          path: '/',
            navigationOptions: {
              tabBarIcon: ({ focused, tintColor }) => {
                  const iconName = `assignment${focused ? '' : '-outline'}`;
                  return <Icon name="assignment" size={30} color={tintColor}/>;
              },
              tabBarLabel: false
          },
        },

          SettingsStack: {
          screen: SettingsScreen,
          path: '/',
            navigationOptions: {
              tabBarIcon: ({ focused, tintColor }) => {
                  const iconName = `ios-settings${focused ? '' : '-outline'}`;
                  return <Icon name="settings" size={30} color={tintColor}/>;
              },
              tabBarLabel: false
          },
        },
      },
      {
        tabBarOptions: {
          showLabel: false,
          activeTintColor: "#29457a",
          inactiveTintColor: "#B8BEC1"
        }
      },
      {
        headerMode: 'screen'
      },
    );

    const AuthStack = createStackNavigator(
      {
        Login: LoginScreen,
        Registration: RegistrationScreen
      },
      {
        headerMode: 'screen'
      }
    );
    const AppContainer = createAppContainer(createSwitchNavigator(
      {
        Home: Tabs,
        Auth: AuthStack,
      },
      {
        initialRouteName: 'Auth',
      }
    ));


    return (
      <Provider store={store}>
        <AppContainer/>
      </Provider>
    );
  }
}