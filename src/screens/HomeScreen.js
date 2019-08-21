import React, { Component } from 'react';
import { View, Image, Text, TextInput, StyleSheet, TouchableWithoutFeedback, AsyncStorage, Keyboard, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import firebase from 'firebase';
import * as actions from '../redux/actions';
import Spinner from "../components/common/Spinner";
import DynamicInput from "../components/common/DynamicInput";
import { SafeAreaView } from 'react-navigation';
import RButton from '../components/common/RButton';
import { NavigationEvents } from "react-navigation";



class HomeScreen extends Component {
    static navigationOptions = {
        header: 'IOT',
    };

    state = {number: 0, message: "green", greenbool: true};


    _forceRefresh = async () =>{
        user = await firebase.auth().currentUser.uid;


        // UPDATING NUMBER FROM DB
        dataArray = [];
        dataArray.push(this.state.number);
        try {
            number = 0;
           await firebase.database().ref('users/'+user).child('number').once('value', function (snapshot) {             
                console.log(snapshot.val());
                data = snapshot.val();
                dataArray.pop();
                dataArray.push(data);
            });
        } catch(err){
            console.log(err);
        }
        await this.setState({number: dataArray[0]});   


        // UPDATING MESSAGE FROM DB
        messageArray = [];
        try {
            message = "";
           await firebase.database().ref('users/'+user).child('message').once('value', function (snapshot) {             
                console.log(snapshot.val());
                data = snapshot.val();
                messageArray.push(data);
            });
        } catch(err){
            console.log(err);
        }
        await this.setState({message: messageArray[0]});   


        // Setting greenbool.
        if (this.state.message == "green"){
            this.setState({greenbool: true});
        }
        else {
            this.setState ({greenbool: false});
        }

    }



    componentWillMount = async () => {
        user = await firebase.auth().currentUser.uid;

        dataArray = [];
        dataArray.push(this.state.number);
        try {
            number = 0;
           await firebase.database().ref('users/'+user).child('number').once('value', function (snapshot) {             
                console.log(snapshot.val());
                data = snapshot.val();
                dataArray.pop();
                dataArray.push(data);
            });
        } catch(err){
            console.log(err);
        }
        await this.setState({number: dataArray[0]});   


        // UPDATING MESSAGE FROM DB
        messageArray = [];
        try {
            message = "";
           await firebase.database().ref('users/'+user).child('message').once('value', function (snapshot) {             
                console.log(snapshot.val());
                data = snapshot.val();
                messageArray.push(data);
            });
        } catch(err){
            console.log(err);
        }
        await this.setState({message: messageArray[0]});   


        // Setting greenbool.
        if (this.state.message == "green"){
            this.setState({greenbool: true});
        }
        else {
            this.setState ({greenbool: false});
        }


        // LISTENING FOR CHANGES
        await firebase.database().ref('users/'+user)
        .on('child_changed', ()=>{
            console.log('INSIDE LISTENER');
            this.setState(this.state);
            this._forceRefresh();
            })



        // await firebase.database().ref("/messages")
        // .on('child_added', ()=>{
        //     console.log('INSIDE LISTENER');
        //     this.setState(this.state);
        //     this._forceRefresh();
        //     })


        // try {
        //     const value = await AsyncStorage.getItem('usernumber');
        //     if(value !== null) {
        //       this.setState({number: value});
        //       console.log('thingy'+value);
        //     }
        //     else{
        //         console.log('NULL');
        //         await AsynchStorage.setItem('number', 0);
        //     }
        //   } catch(e) {
        //     console.log(e);
        //   }


    }


    fetchNumber = async () => {
        console.log('fetching number');
        newNumber = await AsyncStorage.getItem('usernumber');
        this.setState({number: newNumber});

    }

    buttonPressed = async () =>{

        await this.setState({number: this.state.number+1});
        try{newActivityId = await firebase.database().ref('users/'+user).update({
            number: this.state.number
          }).getKey()}
          catch{(error) => {
            console.log(error);
            this.onCreateFail.bind(this);
        }}

        // number = this.state.number;
        // try {
        //     await AsyncStorage.setItem('usernumber', number);
        //   } catch (e) {
        //     console.log(e);
        //   }
    }

    render() {
        return (
           <SafeAreaView style={styles.toplevel}>
            <NavigationEvents
                        onDidFocus={payload => {
                            this.fetchNumber.bind(this);
                        }}
                        />

                <Text style={styles.bigtext}></Text>
                <Text style={styles.smalltext}>{this.state.number}</Text>
                <View style={[styles.colorbox, this.state.greenbool ? {borderColor:'#38c45e'} : {borderColor: '#e23737' }]}></View>
                <RButton flex={1} onPress={this.buttonPressed.bind(this)}>
                    NUMBER GO UP
                </RButton>
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
        fontSize: 40,
        fontWeight: 'bold',
    },
    colorbox: {
        borderWidth: 10
    },
    smalltext: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
    },
    toplevel: {
        flex: 1,
        justifyContent: 'space-between'
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

export default connect(mapStateToProps, actions)(HomeScreen);