import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

interface Props {
    style?: any;
    textStyle?: any;
    buttomText?: string;
    onClick: () => void;
};

export default function PatButton(props: Props) {
    const { style = {}, textStyle={}, buttomText = '', onClick } = props;
    return (
        <View style={styles.signUpButton}>
            <TouchableOpacity onPress={() => onClick()} style={[styles.signUpContainer, style]}>
                <Text style={[styles.testStyle, textStyle]}>{buttomText}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    signUpButton: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    signUpContainer: {
        backgroundColor: 'black',
        borderRadius: 50,
        height: windowHeight / 15,
        width: windowWidth / 1.2,
        justifyContent: 'center',
        alignItems: 'center', 
        borderColor: 'red'
    },
    testStyle: {
        fontSize: 16, 
        color: '#fff',
        fontWeight: 'bold'
    }
});