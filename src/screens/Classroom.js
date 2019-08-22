import React, { Component } from 'react';
import { View, Image, Text, TextInput, StyleSheet, TouchableWithoutFeedback, AsyncStorage, Keyboard, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import firebase from 'firebase';
import * as actions from '../redux/actions';
import { SafeAreaView } from 'react-navigation';
import { NavigationEvents } from "react-navigation";
import rgbHex from 'rgb-hex';

class Classroom extends Component {
    static navigationOptions = {
        header: 'Classroom',
    };

    // Array of json objects
    //[{"id":16,"value":45,"color":""},{"id":17,"value":76,"color":""},{"id":18,"value":35,"color":""},{"id":19,"value":97,"color":""},{"id":20,"value":50,"color":""}]


    // Hardcoded student values for testing
    students = [
        // {
        //     id: 16,
        //     value: 45,
        //     color: '' 
        // },
        // {
        //     id: 17,
        //     value: 76,
        //     color: '' 
        // },
        // {
        //     id: 18,
        //     value: 35,
        //     color: '' 
        // },
        // {
        //     id: 19,
        //     value: 97,
        //     color: '' 
        // },
        // {
        //     id: 20,
        //     value: 50,
        //     color: '' 
        // },
        // {
        //     id: 21,
        //     value: 57,
        //     color: '' 
        // },
        // {
        //     id: 22,
        //     value: 100,
        //     color: '' 
        // },
    ];

    // REVISIT
    // genRandomColor = () => {
    //     var RandomNumber = Math.floor(Math.random() * 100) + 1;
    //     this.setState({value: RandomNumber});
    // }

    // App state (other than students)

    state = {value: 0, bgcolor: '', students: [], fakeNumber: 0};

    // LOAD STUDENT DATA FROM DATABASE
    loadStudents = async () => {
        console.log("INSIDE: LOADSTUDENTS");

        students = [];
        
        var keyArray = [];
        var dataArray = [];
        try {

            // Create Query
            var studentsQuery = await firebase.database().ref('students').orderByKey();

            // Call query and loop through all fetched values
            await studentsQuery.once("value").then(function(snapshot){
                snapshot.forEach(function(childSnapshot){
                    var key = childSnapshot.key;
                    var childData = childSnapshot.val();
                    keyArray.push(key);
                    dataArray.push(childData);
                });
        });
        } catch(err){
            console.log(err);
        }

        //clear STATE students array on re-render 
        this.setState({students: students});

        for (j=0; j<dataArray.length; j++){
            let tempObject = {"key" : keyArray[j], "value": dataArray[j], "color":"placeholder"};
            this.state.students.push(tempObject);
        }

        console.log(this.state.students);
    }


    // Calculates average of colors
    AverageColor = async () => {
        console.log("INSIDE: AVERAGECOLOR");
        tot = 0;
        p = 2;
        for (i=0; i < this.state.students.length; i++){
            tot=tot + Math.pow(this.state.students[i].value,p);
        }
        bgVal = Math.pow(tot/this.state.students.length, 1/p);

        if (bgVal < 50){
            R = 255 * (bgVal) / 50;
            G = 255;
            B = 0;
            hex = "#" + rgbHex(R,G,B);
            this.setState({bgcolor: hex});
        }
        else {
            R = 255;
            G = 255 * (100 - bgVal) / 50;
            B = 0;
            hex = "#" + rgbHex(R,G,B);
            this.setState({bgcolor: hex});
        }

        console.log(this.state.students);
    }
    

    // Calculates colors based on individual student values (loops through whole student array)
    CalculateColors = () => {
        console.log("INSIDE: CALCULATECOLORS");

        for (i = 0; i < this.state.students.length; i++){
            value = this.state.students[i].value;
            if (value < 50){
                R = 255 * (value) / 50;
                G = 255;
                B = 0;
                this.state.students[i].color = "#" + rgbHex(R,G,B);
            }
            else {
                R = 255;
                G = 255 * (100 - value) / 50;
                B = 0;
                this.state.students[i].color = "#" + rgbHex(R,G,B);
            }
        }
        console.log(this.state.students);
    }

    // This function runs before render || PREDEFINED
    componentWillMount = async () => {
        // LOADS DATA ONCE, THEN LISTENS FOR CHANGES
        await firebase.database().ref('students')
        .on('value', async()=>{
            console.log('DATA CHANGED');
            await this.loadStudents();
            this.CalculateColors();
            this.AverageColor();
        });

        // SUPPRESS WARNINGS
        console.disableYellowBox = true;
}

    componentDidMount = async () => {
        console.log("INSIDE: COMPONENT DID MOUNT");

    }

    // Iterates through array of student objects
    studentsListArr = () => {
        return(this.state.students.map(studentInfo => (
        <View style={[styles.studentbox, {backgroundColor: studentInfo.color}]}>
            <Text style={[styles.studentReadout]} key={studentInfo.key}>{studentInfo.value}</Text>
        </View>
    )));
    }

    // PREDEFINED
    render() {
        return (
           <SafeAreaView style={[styles.mainContainer, {backgroundColor: this.state.bgcolor}]}>
               <Text style={styles.bigtext}>CLASSROOM</Text>
                <View style={styles.toplevel}>
                    {this.studentsListArr()}
                </View>
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
    studentReadout:{
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20
    },
    bigtext: {
        textAlign: 'center',
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 15
    },
    smalltext: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
    },
    toplevel: {
        flexWrap: 'wrap',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    secondarylevel: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    studentbox: {
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
        alignContent: 'center',
        justifyContent: 'center',
        height: 100,
        width: 100,
        margin: 10,
    },
    mainContainer: {
        backgroundColor: 'purple',
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

export default connect(mapStateToProps, actions)(Classroom);