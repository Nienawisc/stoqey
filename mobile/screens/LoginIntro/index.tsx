import React, { useEffect } from 'react';
import { View, StatusBar, ImageBackground, Text, TextInput, TouchableOpacity, } from 'react-native';
import styles from './styles';

interface PwUn {
    email: string;
    password: string;
}

const LoginIntro: React.FC<any> = props => {
    return (
        <View style={styles.root}>
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
                            <Text style={{ fontSize: 16, color: '#fff', }}>SING UP</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default LoginIntro;
