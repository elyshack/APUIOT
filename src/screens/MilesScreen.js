import React, { Component } from 'react';
import Storage from 'react-native-storage';
import init from 'react_native_mqtt';
import { View, Image, Text, TextInput, StyleSheet, TouchableWithoutFeedback, AsyncStorage, Keyboard, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import firebase from 'firebase';
import * as actions from '../redux/actions';
import Spinner from "../components/common/Spinner";
import DynamicInput from "../components/common/DynamicInput";
import { SafeAreaView } from 'react-navigation';
import RButton from '../components/common/RButton';
import { NavigationEvents } from "react-navigation";



class MilesScreen extends Component {
    static navigationOptions = ({navigation}) => ({
        title: 'SUMMER RESEARCH MQTT',
        headerTitleStyle: {
            color: '#2661B2',
            fontSize: 14,
            fontWeight: 'bold'
        },
    });


    state = {message: "hello" };

    
    onConnect() {
        console.log("******** onConnect");
      }
      
    onConnectionLost(responseObject) {
        if (responseObject.errorCode !== 0) {
          console.log("******** onConnectionLost:"+responseObject.errorMessage);
        }
      }
      
    onMessageArrived(message) {
        console.log("******** onMessageArrived: "+message.payloadString);
      }

    componentWillMount = async () => {
        console.log("*************INSIDE COMPONENT WILL MOUNT*************");

        const client = new Paho.MQTT.Client('broker.mqttdashboard.com', 8000, 'CLIENT');


        init({
            size: 10000,
            storageBackend: AsyncStorage,
            defaultExpires: 1000 * 3600 * 24,
            enableCache: true,
            reconnect: true,
            sync : {
            }
          });

          client.onConnectionLost = this.onConnectionLost;
          client.onMessageArrived = this.onMessageArrived;
          client.connect({ onSuccess:this.onConnect, useSSL: true });
    }


    render() {
        return (
           <SafeAreaView style={styles.toplevel}>
            <Text style={styles.bigtext}>  Summer Research MQTT</Text>
            <Text style={styles.smalltext}>Message: {this.state.message}</Text>
           </SafeAreaView>
        )
    }
}

const DismissKeyboard = ({children}) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>

);

const styles = StyleSheet.create({
    bigtext: {
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 'bold',
    },
    smalltext: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
    },
    toplevel: {
        flex: 1,
        justifyContent: 'space-around'
    },
    mainContainer: {
        flexGrow: 1,
        height: '100%',
        justifyContent: 'space-between',
        padding: 20 },
    logo: {
        width: null,
        resizeMode: 'contain',
        height: '33%',
        marginTop: '25%' },
    button: {
        alignSelf: 'flex-end' },
    redirect: {
        alignSelf:'flex-end' },
    testBorder: {
        borderColor: '#0ac45555',
        borderWidth: 2 },
    formStyle: {
        flex: 2,
        justifyContent: 'space-around', },
    input2: {
        height: 50,
        backgroundColor: '#ffffff',
        //marginBottom: 25,
        borderWidth: 2,
        borderColor: '#B8BeC1',
        borderRadius: 15,
        color: '#B8BeC1',
        paddingHorizontal: 10, },
    input1: {
        height: 50,
        backgroundColor: '#ffffff',
        marginBottom: 25,
        borderWidth: 2,
        borderColor: '#B8BeC1',
        borderRadius: 15,
        color: '#B8BeC1',
        paddingHorizontal: 10, },
    errorTextStyle: {
        fontSize: 12,
        alignSelf: 'center',
        color: '#E23737',
        marginTop: 10 }
});

const button = StyleSheet.create({
    buttonContainer: {
       backgroundColor: '#ED7248',
       paddingVertical: 20,
       paddingHorizontal: 20,
       borderRadius: 30,
       width: 330,
    },
    buttonText: {
        textAlign: 'center',
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    viewStyle: {
        alignItems: 'center',
        justifyContent: 'center',
    }
});

const mapStateToProps = state => {
    return { user: state.user, number: state.number };
}

export default connect(mapStateToProps, actions)(MilesScreen);