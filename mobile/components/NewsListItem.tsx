import moment from 'moment';
import React from 'react';
import { Colors } from '../enums';
import { INewsListItem } from '../store/interfaces';
import { StyleSheet, Image, Platform } from 'react-native';
import { ListItem, Body, Right, Text } from 'native-base';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { scale, verticalScale } from 'react-native-size-matters';
const NewsListItem = ({ item, style, onPress }: INewsListItem): React.ReactElement<any> => {
  // handle onPress for item
  const _onPress = (): void => onPress(item);
  // render the item content
  const renderItem = (): React.ReactElement<any> => (
    <ListItem icon style={[styles.container, style]} noIndent onPress={_onPress}>
      <Body style={style}>
        <Text numberOfLines={2} style={styles.title}>
          {item.title}
        </Text>
        <Text numberOfLines={1} style={styles.subTitle}>{`${item.source_info.name} • ${moment
          .unix(item.published_on)
          .calendar()}`}</Text>
      </Body>
      <Right style={[style, { alignSelf: 'center' }]}>
        <Image style={styles.image} source={{ uri: item.imageurl }} />
      </Right>
    </ListItem>
  );
  // dummy rendering and calls. all the logic is in the component under screens folder (screens/)
  return Platform.OS === 'android' ? (
    <TouchableWithoutFeedback onPress={_onPress}>{renderItem()}</TouchableWithoutFeedback>
  ) : (
    renderItem()
  );
};
NewsListItem.defaultProps = {
  props: {
    style: {},
    noBorder: true,
  },
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    height: 80,
  },
  title: {
    color: Colors.black,
    fontWeight: '600',
    fontSize: scale(14),
    paddingBottom: verticalScale(7.5),
  },
  subTitle: {
    color: Colors.grayish,
    fontSize: scale(12),
  },
  image: { height: 60, width: 60, borderRadius: 5, backgroundColor: Colors.gray + '40' },
});

export default NewsListItem;
