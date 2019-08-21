import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

export default class LoginForm extends Component {
    render() {
        return (
            <View style={styles.formStyle}>
                <TouchableOpacity >
                    <Text style={styles.redirect} onPress={() => this.props.navigation.navigate('Registration')}>
                        Create Account
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    formStyle: {
       padding: 35,
       flex: 1,
       flexDirection: 'row',
       alignSelf: 'center'
    },
    text: {
        height: 50,
        marginBottom: 25,
        borderRadius: 15,
        color: '#b8bec1',
        paddingHorizontal: 10,
    },
    redirect: {
        height: 50,
        marginBottom: 25,
        borderRadius: 15,
        color: '#468ece',
        paddingHorizontal: 10,
    }
});