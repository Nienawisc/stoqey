import React, { useEffect } from 'react';
import { View, StatusBar, ImageBackground, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import styles from './styles';
// import pic from '../hhh.png';

interface PwUn {
    email: string;
    password: string;
}

const LoginIntro: React.FC<any> = props => {
    const image = require('../../assets/letsGetStarted.png');
    return (
        <View style={styles.root}>
            <ImageBackground source={image} style={{width: '100%', height: '100%'}}>
            <View style={styles.background}>
                <View style={styles.loginContainer}>
                    <TouchableOpacity
                        onPress={() => props.navigation.navigate('Login')}>
                        <Text style={styles.logoIn}>LOGIN</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.rect}>
                    <View style={styles.logoColumn}>
                        <Text style={styles.letsGetStarted}>Let's Get</Text>
                        <Text style={styles.started}>Started</Text>
                        <Text style={styles.moto}>Every thing works better together</Text>
                    </View>
                    <View style={styles.signUpButton}>
                        <TouchableOpacity style={styles.signUpContainer}
                            onPress={() => props.navigation.navigate('SignUp')}>
                            <Text style={{ fontSize: 16, color: '#fff', fontWeight: 'bold' }}>SIGN UP</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            </ImageBackground>
           
           
        </View>
    );
};

export default LoginIntro;
