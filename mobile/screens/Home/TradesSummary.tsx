import React from 'react';
import { StyleSheet, Text, StyleProp, ViewStyle, Platform, View } from 'react-native';
import { List, CardItem, Icon, Right, Body, Card, ListItem } from 'native-base';
import { Colors } from '../../enums';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { scale, moderateScale } from 'react-native-size-matters';
import TradesScreen from '../Trades/Trades';
import { useNavigation } from '@react-navigation/native';

export default function TradesSummary(props: {
  items: any;
  onPress: (...args: any) => any;
  navigateTo: (...args: any) => any;
  itemStyle: StyleProp<ViewStyle>;
  isLoading: boolean;
}): React.ReactElement<any> {
  const navigation = useNavigation();
  // handle onPress for item
  const _navigateToDetails = (): void => navigation.navigate('Trades');
  // render View All item content
  const renderViewAll = (): React.ReactElement<any> => (
    <ListItem onPress={_navigateToDetails}>
      <Body>
        <Text style={styles.text}>View all trades</Text>
      </Body>
      <Right>
        <Icon name="arrow-forward" active />
      </Right>
    </ListItem>
  );
  // dummy rendering and calls. all the logic is in the component under screens folder (screens/)
  return (
    <Card style={{ borderColor: Colors.transparent }}>
      <CardItem header style={styles.header}>
        <Text style={styles.title}>Latest Trades</Text>
        <Icon name="linechart" type="AntDesign" style={{ fontSize: scale(18), color: Colors.grayish }} />
      </CardItem>
      <List>
        <View style={{ height: 500 }}>
          <TradesScreen paginate={false} />
        </View>

        {Platform.OS === 'android' ? (
          <TouchableWithoutFeedback onPress={_navigateToDetails}>{renderViewAll()}</TouchableWithoutFeedback>
        ) : (
            renderViewAll()
          )}
      </List>
    </Card>
  );
}

TradesSummary.defaultProps = {
  itemStyle: StyleSheet.create({}),
};
const styles = StyleSheet.create({
  title: {
    color: Colors.black,
    fontSize: scale(18),
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontSize: scale(14),
    fontWeight: '600',
    color: Colors.grayish,
  },
  nodata: {
    alignSelf: 'center',
    color: Colors.gray,
    paddingHorizontal: moderateScale(10),
  },
});
