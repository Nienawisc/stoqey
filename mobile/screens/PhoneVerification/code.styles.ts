import { StyleSheet } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { Colors } from '../../enums';

export default StyleSheet.create({
  root: { padding: 10, minHeight: 300 },
  title: {
    color: Colors.black,
    fontSize: scale(18),
    paddingVertical: verticalScale(10),
    fontWeight: '600',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  codeFieldRoot: {
    marginTop: 20,
    width: 280,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  cellRoot: {
    width: 30,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  cellText: {
    color: '#000',
    fontSize: 36,
    textAlign: 'center',
  },
  focusCell: {
    borderBottomColor: '#007AFF',
    borderBottomWidth: 2,
  },
});
