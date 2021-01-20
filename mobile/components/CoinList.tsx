import React from 'react';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { StyleSheet, Text, StyleProp, ViewStyle, Platform } from 'react-native';
import { List, CardItem, Icon, Right, Body, Card, ListItem } from 'native-base';
import { scale, moderateScale } from 'react-native-size-matters';
//local imports
import CoinListItem from './CoinListItem';
import { ICoin } from '../store/interfaces';
import { Colors } from '../enums';

interface IProps {
  items: ICoin[];
  onPress: (...args: any) => any;
  navigateTo: (...args: any) => any;
  itemStyle: StyleProp<ViewStyle>;
}
export default function CoinList({ items, onPress, navigateTo, itemStyle }): React.ReactElement<IProps> {
  // handle onPress for item
  const _navigateToDetails = (): void => navigateTo('Assets');
  // render View All item content
  const renderViewAll = (): React.ReactElement<any> => (
    <ListItem onPress={_navigateToDetails}>
      <Body>
        <Text style={styles.text}>View all assets</Text>
      </Body>
      <Right>
        <Icon name="arrow-forward" active />
      </Right>
    </ListItem>
  );
  // dummy rendering and calls. all the logic is in the component under screens folder (screens/)
  return (
    <Card style={{ borderColor: Colors.transparent, marginVertical: 10 }}>
      <CardItem header style={styles.header}>
        <Text style={styles.title}>Following</Text>
        <Icon name="linechart" type="AntDesign" style={{ fontSize: scale(18), color: Colors.grayish }} />
      </CardItem>
      <List>
        {items.length ? (
          items.map(
            (coin: ICoin): React.ReactElement<any> => {
              coin.onPress = (): void => onPress(coin);
              return (
                <CoinListItem
                  key={coin.symbol}
                  coin={coin}
                  style={[
                    {
                      backgroundColor: Colors.transparent,
                    },
                    itemStyle,
                  ]}
                />
              );
            },
          )
        ) : (
          <Text style={styles.nodata}>
            You are not following any asset. Start following our top 50 assets and make your first investment today!
          </Text>
        )}
        {Platform.OS === 'android' ? (
          <TouchableWithoutFeedback onPress={_navigateToDetails}>{renderViewAll()}</TouchableWithoutFeedback>
        ) : (
          renderViewAll()
        )}
      </List>
    </Card>
  );
}
CoinList.defaultProps = {
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
