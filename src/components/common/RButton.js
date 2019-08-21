import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';

const RButton = ({ onPress, children }) => {
    return (
        <View style={styles.viewStyle}>
          <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
              <Text style={styles.buttonText}>
                  {children}
              </Text>
          </TouchableOpacity>
        </View>
    );
};

const styles = {
    buttonContainer: {
       backgroundColor: '#29457a',
       borderRadius: 5,
       shadowColor: '#000',
       shadowOffset: { width: 0, height: 3 },
       shadowOpacity: 0.3,
       shadowRadius: 2,
       height: 48,
       justifyContent: 'center',
    },
    buttonText: {
        textAlign: 'center',
        color: '#ffffff',
        fontSize: 10,
        // fontFamily: 'circular-std-bold',
        height: 11
    },
    viewStyle: {
        paddingHorizontal: 20,
        paddingBottom: 25,
        paddingTop: 5,
      }
  };

export default RButton;
