import React from 'react';
import { StyleSheet, Text, StyleProp, ViewStyle, Platform } from 'react-native';
import { List, CardItem, Icon, Right, Body, Card, ListItem } from 'native-base';
import TopListItem from './CoinListItem';
import { ICoin } from '../store/interfaces';
import { Colors } from '../enums';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { scale, moderateScale } from 'react-native-size-matters';
import LoadingSpinner from './Spinner';
export default function TopList({
  items,
  onPress,
  navigateTo,
  itemStyle,
  isLoading,
}: {
  items: any;
  onPress: (...args: any) => any;
  navigateTo: (...args: any) => any;
  itemStyle: StyleProp<ViewStyle>;
  isLoading: boolean;
}): React.ReactElement<any> {
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
    <Card style={{ borderColor: Colors.transparent }}>
      <CardItem header style={styles.header}>
        <Text style={styles.title}>Top Assets</Text>
        <Icon name="linechart" type="AntDesign" style={{ fontSize: scale(18), color: Colors.grayish }} />
      </CardItem>
      <List>
        {items.length ? (
          items.map(
            (coin: ICoin): React.ReactElement<any> => {
              coin.onPress = (): Promise<any> => onPress(coin);
              return (
                <TopListItem
                  key={coin.symbol + 'toplist'}
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
        ) : isLoading ? (
          <LoadingSpinner />
        ) : null}
        {Platform.OS === 'android' ? (
          <TouchableWithoutFeedback onPress={_navigateToDetails}>{renderViewAll()}</TouchableWithoutFeedback>
        ) : (
          renderViewAll()
        )}
      </List>
    </Card>
  );
}
TopList.defaultProps = {
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
