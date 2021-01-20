import React from 'react';
import { View, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { INews } from '../store/interfaces';
import { Card, CardItem, Text, Icon, List, ListItem, Body, Right } from 'native-base';
import { Colors } from '../enums';
import NewsListItem from './NewsListItem';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { scale, moderateScale } from 'react-native-size-matters';
export default function News({
  items,
  onPress,
  navigateTo,
}: {
  items: Array<INews>;
  onPress: (...args: any) => any;
  navigateTo: (...args: any) => any;
}): React.ReactElement {
  const sequeToAll = (): void => navigateTo('Stories');
  // render View All item content
  const renderViewAll = (): React.ReactElement<any> => (
    <ListItem onPress={sequeToAll}>
      <Body>
        <Text style={styles.text}>View more news</Text>
      </Body>
      <Right>
        <Icon name="arrow-forward" active />
      </Right>
    </ListItem>
  );
  // dummy rendering and calls. all the logic is in the component under screens folder (screens/)
  return (
    <Card>
      <CardItem header style={styles.header}>
        <Text style={styles.title}>Top Stories</Text>
        <Icon name="feed" type="SimpleLineIcons" style={{ fontSize: scale(18), color: Colors.grayish }} />
      </CardItem>
      <List>
        {items.length ? (
          items.map(
            (e: INews): React.ReactElement<any> => {
              return (
                <NewsListItem
                  onPress={onPress}
                  key={e.id}
                  item={e}
                  style={{
                    backgroundColor: Colors.transparent,
                    borderColor: Colors.transparent,
                  }}
                />
              );
            },
          )
        ) : (
          <View style={styles.nodata}>
            <ActivityIndicator />
          </View>
        )}
        {Platform.OS === 'android' ? (
          <TouchableWithoutFeedback onPress={sequeToAll}>{renderViewAll()}</TouchableWithoutFeedback>
        ) : (
          renderViewAll()
        )}
      </List>
    </Card>
  );
}

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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: moderateScale(10),
  },
});
