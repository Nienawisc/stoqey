import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon, List, Text, Separator, Accordion, ListItem } from 'native-base';
import { Colors } from '../enums';
import { ICoin, IStatInfo } from '../store/interfaces';
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';

export default function MarketStats({ coin }: { coin: ICoin }): React.ReactElement<any> {
  // dummy rendering and calls. all the logic is in the component under screens folder (screens/)

  // we have a fixed array of 3 items that represent Market Cap, Volume, and total supply. However, the stat for each item is dynamic and received from the main component.
  // we use array to so we cam esily pass it Accordion component from native-base component
  const dataArray: IStatInfo[] = [
    {
      icon: 'barschart',
      iconType: 'AntDesign',
      title: 'Market Cap',
      stat: coin.mktCap,
      content:
        'The measure of the total market value of a traded asset, calculated by multiplying the outstanding nimber of assets in circulation by current asset price.',
    },
    {
      icon: 'sound-mix',
      iconType: 'Entypo',
      title: 'Volume (24H)',
      stat: coin.totalVol,
      content: 'The total value of the global trades of this asset in the past 24 hours.',
    },
    {
      icon: 'chart-bubble',
      iconType: 'MaterialCommunityIcons',
      title: 'Circulating Supply',
      stat: coin.supply,
      content:
        'The approximate total number of coins that are currently in circulation and the in the possession of the general public.',
    },
  ];
  const _renderHeader = (item: any, expanded: boolean): React.ReactElement<any> => {
    return (
      <View
        style={{
          flexDirection: 'row',
          padding: moderateScale(10),
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Icon style={{ fontSize: scale(20), color: Colors.black + '70' }} name={item.icon} type={item.iconType} />
          <Text style={{ fontSize: scale(13) }}> {item.title}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}>
          <Text style={{ paddingRight: 10, fontSize: scale(12), color: Colors.black + '75' }}>{item.stat}</Text>
          {expanded ? (
            <Icon style={{ fontSize: scale(18), color: Colors.black + '75' }} name="ios-arrow-forward" />
          ) : (
            <Icon style={{ fontSize: scale(18), color: Colors.black + '75' }} name="ios-arrow-down" />
          )}
        </View>
      </View>
    );
  };
  const _renderContent = (item: any): React.ReactElement<any> => {
    return (
      <Text
        style={{
          padding: moderateScale(10),
          fontSize: scale(13),
          lineHeight: 17,
        }}>
        {item.content}
      </Text>
    );
  };
  return (
    <View style={{ marginTop: verticalScale(10) }}>
      <List>
        <ListItem itemDivider>
          <Text>Market Stats</Text>
        </ListItem>
        {dataArray.map((stat: IStatInfo, index: number) => (
          <ListItem key={index}>
            <Icon name={stat.icon} type={stat.iconType} style={styles.icon} />
            <Text style={styles.title}>{stat.title}</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.value}>{stat.stat}</Text>
            </View>
          </ListItem>
        ))}
        <ListItem itemDivider>
          <Text>About</Text>
        </ListItem>
        <ListItem>
          <Text style={styles.title}>
            {coin.name} ({coin.symbol}) is a consensus network that enables a new payment system and a completely
            digital currency. Powered by its users, it is a peer to peer payment network that requires no central
            authority to operate.
          </Text>
        </ListItem>
      </List>
    </View>
  );
}

const styles = StyleSheet.create({
  valueContainer: { justifyContent: 'flex-end', alignItems: 'flex-end' },
  value: { textAlign: 'right', fontSize: scale(11) },
  title: { flex: 1, paddingHorizontal: scale(5), fontSize: scale(12) },
  icon: { fontSize: scale(16) },
});
