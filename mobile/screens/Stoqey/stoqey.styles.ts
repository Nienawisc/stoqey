import { StyleSheet } from 'react-native';
import { Colors } from '../../enums';
import { moderateScale } from 'react-native-size-matters';

const styles = StyleSheet.create({
  container: { backgroundColor: Colors.white, flex: 1 },
  contentContainer: {
    flex: 60,
  },
  list: {
    flexWrap: 'wrap', // allow multiple rows
    paddingHorizontal: moderateScale(10),
  },
});

export default styles;
