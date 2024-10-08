import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../redux/actions';
import firebase from 'firebase';
import {View, StyleSheet, AsyncStorage, Text, TouchableOpacity, Image} from 'react-native';
import Setting from '../../src/components/SettingsComponents/Setting';
import Modal from "react-native-modal";
import DynamicInput from '../components/common/DynamicInput';
import { SafeAreaView } from 'react-navigation';

class SettingsScreen extends Component {

    user = firebase.auth().currentUser;
    state ={
        fullNameInitial: '',
        fullNameConfirm: '',
        fullName: this.props.user.fullName,
        email: firebase.auth().currentUser.email,
        emailNew: '',
        emailConfirm: '',
        visibleNameChangeModal: false,
        visibleEmailChangeModal: false,
        visibleAboutUsModal: false,
        visibleHelpModal: false,
        visiblePasswordModal: false,
        error: '',
        passwordInitial: '',
        passwordConfirm: '',
        password: ''
    }


    toggleEmailChangeModal = () => this.setState({ visibleEmailChangeModal: !this.state.visibleEmailChangeModal });
    toggleAboutUsModal = () => this.setState({ visibleAboutUsModal: !this.state.visibleAboutUsModal });
    toggleHelpModal = () => this.setState({ visibleHelpModal: !this.state.visibleHelpModal });
    togglePasswordModal = () => this.setState({ visiblePasswordModal: !this.state.visiblePasswordModal });

    onLogOutPress = async () => {
        this.props.logOut();
        await AsyncStorage.setItem('logged', 'false');
        this.props.navigation.navigate('Login');
    }

    static navigationOptions = ({navigation}) => ({
        headerTitle: 'SETTINGS',
        headerTitleStyle: {
            color: '#2661B2',
            fontSize: 14,
        },
    });

    handlePasswordChange=(typedText)=>{
        this.setState({passwordInitial: typedText});
    }
    handlePasswordConfirmChange=(typedText)=>{
        this.setState({passwordConfirm: typedText});
    }

    handleEmailChange = (typedText) =>{
        this.setState({emailNew: typedText});
    }

    handleEmailChangeConfirm = (typedText) =>{
        this.setState({emailConfirm: typedText});
    }


    handleNewPasswordUpdate = async () =>{
        let user = await firebase.auth().currentUser;
        // Comment
        if (this.state.passwordInitial == this.state.passwordConfirm){
            if (this.state.passwordConfirm.length > 5){
                this.setState({password: this.state.passwordConfirm});
                this.togglePasswordModal();
                this.setState({error: ''});
                try{
                    user.updatePassword(this.state.password);
                    console.log(this.state.password);
                }catch{(error)=>{
                    console.log(error);
                }}
            }else{
                this.setState({error: "Password must be at least 6 characters."})
            }
        } else{
            this.setState({error: "Fields must match."});
        }
    }

    handleNewEmailConfirm = async () =>{
        let user = await firebase.auth().currentUser;
        if (this.state.emailNew.includes('@') && this.state.emailNew.includes('.')) {
            if(this.state.emailNew == this.state.emailConfirm){
                this.setState({email: this.state.emailConfirm});
                try{
                    user.updateEmail(this.state.email)
                    .then(() =>{
                    console.log(this.state.email);
                    this.toggleEmailChangeModal();
                    this.setState({error: ''}); 
                    })
                    .catch(() => {
                        this.setState({error: "This email is already in use."});
                    });
                } catch{(err)=>{
                    console.log(err);
                }}
            }
            else{
                this.setState({error: "Fields must match."});
            }
        } else{
            this.setState({error: "Incorrect email format."});
            }
     }


    render() {
        return (
            <SafeAreaView style={styles.mainContainer}> 
        
                <View style={styles.settingsHolder}>
                <Setting settingName='Email' currentSetting={this.state.email} iconName='person'
                    onPress={this.toggleEmailChangeModal.bind(this)}/>
                <Setting settingName='Password' iconName='lock'
                    onPress={this.togglePasswordModal.bind(this)}/>
                <Setting settingName='About Us' iconName='book' currentSetting=':-)'
                    onPress={this.toggleAboutUsModal.bind(this)}/>
                <Setting settingName='Log Out' onPress={this.onLogOutPress.bind(this)} iconName='not-interested'/>
                </View>

                            {/* EMAIL CHANGE MODAL */}
            <Modal isVisible={this.state.visibleEmailChangeModal}>
              <View style={styles.modalContainer}>
                    <Text style={styles.headerTextStyle}>Change Email</Text>
                    <View style={styles.formStyle}>
                        <DynamicInput placeholderList={[
                            {placeholder: 'New Email',
                              autoCorrect: false,
                              inputContainerStyle: "loginInput",
                              inputStyle: "loginText",
                              autoCapitalize: "none",
                              spellCheck: false,
                              stateLabel: "emailNew",
                              onChange: this.handleEmailChange},
                            {placeholder: 'Confirm New Email',
                              autoCorrect: false,
                              inputContainerStyle: "loginInput",
                              inputStyle: "loginText",
                              returnKeyType: "done",
                              autoCapitalize: "none",
                              spellCheck: false,
                              stateLabel: "emailConfirm",
                              onChange: this.handleEmailChangeConfirm},
                            ]}
                        />
                        
                    </View>
                    <Text style={styles.error}>{this.state.error}</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button}
                            onPress = {this.handleNewEmailConfirm.bind(this)} >
                            <Text style={styles.buttonText}>SAVE</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress = {this.toggleEmailChangeModal.bind(this)}
                            style={styles.button}>
                            <Text style={styles.buttonText}>CANCEL</Text>
                         </TouchableOpacity>
                    </View>
                    
                    
              </View>
            </Modal>
                
                         {/* Password CHANGE MODAL */}
            <Modal isVisible={this.state.visiblePasswordModal}>
              <View style={styles.modalContainer}>
                    <Text style={styles.headerTextStyle}>Change Password</Text>
                    <View style={styles.formStyle}>
                        <DynamicInput placeholderList={[
                            {
                              secureTextEntry: true,
                              placeholder: 'New Password',
                              autoCorrect: false,
                              inputContainerStyle: "loginInput",
                              inputStyle: "loginText",
                              autoCapitalize: "none",
                              spellCheck: false,
                              stateLabel: "emailNew",
                              onChange: this.handlePasswordChange},
                            { 
                              secureTextEntry: true,
                              placeholder: 'Confirm New Password',
                              autoCorrect: false,
                              inputContainerStyle: "loginInput",
                              inputStyle: "loginText",
                              returnKeyType: "done",
                              autoCapitalize: "none",
                              spellCheck: false,
                              stateLabel: "emailConfirm",
                              onChange: this.handlePasswordConfirmChange},
                            ]}
                        />
                        
                    </View>
                    <Text style={styles.error}>{this.state.error}</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button}
                            onPress = {this.handleNewPasswordUpdate.bind(this)} >
                            <Text style={styles.buttonText}>SAVE</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress = {this.togglePasswordModal.bind(this)}
                            style={styles.button}>
                            <Text style={styles.buttonText}>CANCEL</Text>
                         </TouchableOpacity>
                    </View>
                    
                    
              </View>
            </Modal>
                
                {/* ABOUT US MODAL */}
            <Modal isVisible={this.state.visibleAboutUsModal}>
                <View style={styles.modalContainer}>
                   <Text style={styles.mascotText1}>Project Director: Dr. James Yeh</Text>
                   <Text style={styles.mascotText1}>iOT & Hardware Systems: Levi Costello</Text>
                   <Text style={styles.mascotText1}>Tablet App: Elyse Shackleton</Text>
                   <Text style={styles.mascotText1}>Smart Watch App: Matthew Perera</Text>

                   <Image style={styles.mascotPic}
                    />

                <View style={styles.okayButton}>
                        <TouchableOpacity 
                            onPress = {this.toggleAboutUsModal.bind(this)}
                            style={styles.button}>
                            <Text style={styles.buttonText}>CLOSE</Text>
                         </TouchableOpacity>
                    </View>

                </View>
            </Modal>

            {/* HELP MODAL */}
            <Modal isVisible={this.state.visibleHelpModal}>
                <View style={styles.modalContainer}>
                   <Text style={styles.headerTextStyle}>NEED HELP?</Text>
                   <Text style={styles.helpText}>
                   Contact us:
                   help@fake_when_where_email.com</Text>
                <View style={styles.okayButton}>
                        <TouchableOpacity 
                            onPress = {this.toggleHelpModal.bind(this)}
                            style={styles.button}>
                            <Text style={styles.buttonText}>OKAY</Text>
                         </TouchableOpacity>
                    </View>

                </View>
            </Modal>
            </SafeAreaView>
        )
    }
}



const styles = StyleSheet.create({
    defaultInput: {
        height: 40,
        borderWidth: 1,
        borderColor: '#B8BeC1',
        borderRadius: 15,
        paddingLeft: 17,
        paddingBottom: 14,
      },
    modalFields:{
        flex: 2,
        justifyContent: 'space-around',
    },
    mainContainer: {
        flex: 1, 
    },
    settingsHolder: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    modalContainer: {
        height: "60%",
        backgroundColor: '#fff',
        borderRadius: 15,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    mascotText1: {
        marginTop: 10,
        marginBottom: 5,
        textAlign: 'center',
        color: '#2661B2',
        fontSize: 16,
        fontWeight: 'bold',
    },
    mascotText2: {
        marginBottom: 5,
        textAlign: 'center',
        color: '#B8BeC1',
        fontSize: 14,
        fontWeight: 'bold',
    },
    mascotText3: {
        marginBottom: 5,
        textAlign: 'center',
        color: '#B8BeC1',
        fontSize: 12,
        fontWeight: 'bold',
    },
    mascotText4: {
        marginBottom: 5,
        textAlign: 'center',
        color: '#B8BeC1',
        fontSize: 10,
        fontWeight: 'bold',
    },
    mascotPic: {
        resizeMode: 'contain',
        flex: 2
    },
    buttonContainer: {
        flex: .8,
        justifyContent: 'space-around',
        marginBottom: 20
    },
    okayButton: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 20
    },
    button: {
        backgroundColor: '#29457a',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        width: 270,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    helpText: {
        fontSize: 16,
        color: '#605985',
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 20
    },
    buttonText: {
        textAlign: 'center',
        color: '#ffffff',
        fontSize: 11,
        fontWeight: 'bold',
    },
    formStyle: {
        width: '90%',
        justifyContent: 'space-around'
    },
    error: {
        flex: .2,
        fontSize: 12,
        alignSelf: 'center',
        color: '#E23737',
        marginTop: 15
    },
    ////////////////////////Header////////////////////
    headerTextStyle: {
        fontSize: 30,
        color: '#605985',
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 20
    },
});

const mapStateToProps = state => {
    return { user: state.user, number: state.number };
}

export default connect(mapStateToProps, actions)(SettingsScreen);