import { StyleSheet, Dimensions } from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: 'rgb(255,255,255)',
    },
    background: {
        flex: 1,
    },
    rect: {
        flex: 1,
        flexDirection: 'column',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 50,
    },
    logoColumn: {
        marginLeft: '9%',
        width: windowWidth / 1.2,
    },
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
        alignItems: 'center'
    },

    letsGetStarted: {
        fontSize: 50, fontWeight: 'bold', color: 'black',
    },
    started: {
        fontSize: 50, fontWeight: 'bold', color: 'black', paddingBottom: 20
    },
    moto: {
        fontSize: 16, paddingBottom: 50, color: 'grey'
    },
    logoIn: {
        fontSize: 16, color: 'grey', fontWeight: 'bold'
    },
    loginContainer: {
        flex: 1,
        alignItems: 'flex-end',
        marginRight: 30,
        top: '8%'
    }

});

export default styles;
