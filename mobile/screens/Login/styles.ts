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
    flexDirection: 'column'
  },
  dontHaveAccountButton: {
    borderWidth: 2,
    backgroundColor: 'transparent',
    borderColor: 'grey'
  },

  textStyle: {
    color: 'black'
  },

  rect_imageStyle: {},
  logo: {
    backgroundColor: 'red',
    alignSelf: 'center',
  },
  endWrapperFiller: {
    flex: 1,
    marginLeft: '10%',
    marginTop: '40%'
  },
  text3: {
    color: '#000',
    fontSize: 25,
    marginBottom: 30,
    fontWeight: 'bold',
    marginRight: '40%'
  },
  rect7: {
    height: 8,
    backgroundColor: '#25cdec',
    marginRight: 1,
  },
  text3Column: {
    marginBottom: 6,
    marginLeft: 2,
    marginRight: 2,
  },
  form: {
    height: 230,
    marginTop: 59,
  },
  username: {
    height: 59,
    backgroundColor: 'rgba(251,247,247,0.25)',
    borderRadius: 5,
    flexDirection: 'row',
  },
  icon22: {
    color: 'rgba(255,255,255,1)',
    fontSize: 30,
    marginLeft: 20,
    alignSelf: 'center',
  },
  usernameInput: {
    height: 30,
    color: 'rgba(255,255,255,1)',
    flex: 1,
    marginRight: 11,
    marginLeft: 11,
    marginTop: 14,
  },
  password: {
    height: 59,
    backgroundColor: 'rgba(253,251,251,0.25)',
    borderRadius: 5,
    flexDirection: 'row',
    marginTop: 27,
  },
  icon2: {
    color: 'rgba(255,255,255,1)',
    fontSize: 33,
    marginLeft: 20,
    alignSelf: 'center',
  },
  passwordInput: {
    height: 30,
    color: 'rgba(255,255,255,1)',
    flex: 1,
    marginRight: 17,
    marginLeft: 8,
    marginTop: 14,
  },
  usernameColumn: {},
  usernameColumnFiller: {
    flex: 1,
  },
  button: {
    height: 59,
    backgroundColor: 'rgba(31,178,204,1)',
    borderRadius: 5,
    justifyContent: 'center',
  },
  text2: {
    color: 'rgba(255,255,255,1)',
    alignSelf: 'center',
  },
  logoColumn: {
    marginLeft: '10%',
    marginRight: '10%',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: '40%',
  },
  logoColumnFiller: {
    flex: 1,
  },
  footerTexts: {
    flex: 1,
    top: '25%'
  },
  button2: {
    alignSelf: 'flex-end',
  },
  createAccountFiller: {
    flex: 1,
  },
  createAccount: {
    color: '#000',
  },
  button2Filler: {
    flex: 1,
    flexDirection: 'row',
  },
  needHelp: {
    color: '#000',
    alignSelf: 'flex-end',
    marginRight: -1,
  },
});

export default styles;
