import * as WebBrowser from 'expo-web-browser';
import React, { useState, useRef } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Content, Body, Text, ListItem, List, Right, View, Thumbnail, Icon, Button, Switch, Form, Item, Input, Left, Header, Picker } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import ModalSelector from 'react-native-modal-selector'
import CountryPicker from 'react-native-country-picker-modal'
import Test from '../../assets/icon.png';
// import { withDrawer } from 'screens';

//Dropdown options selector for Delivey, Recepitant, 
const Options = () => {
  const [select, setSeleted] = React.useState('key1')
  return (
    <Form style={{ paddingTop: 10 }}>
      <Text style={{ marginLeft: 16 }} >Cash out</Text>
      <Picker
        mode="dropdown"
        iosHeader="Select your SIM"
        iosIcon={<Icon name="arrow-dropdown-circle" style={{ color: "#007aff", fontSize: 25 }} />}
        style={{ width: undefined }}
        selectedValue={select}
        onValueChange={(itemValue) => setSeleted(itemValue)}
      >
        <Picker.Item label="Wallet" value="key0" />
        <Picker.Item label="ATM Card" value="key1" />
      
      </Picker>
      <View style={{ borderColor: 'grey', borderWidth: 0.5 }} />
    </Form>
  )
}

const Recevers = () => {
  const navigation = useNavigation();
    return (
      <TouchableOpacity onPress={() => navigation.navigate('receivers')}>
        <Form style={{ paddingTop: 10 }}>
          <Text style={{ marginLeft: 16 }} >Cash out</Text>
          <Picker
            mode="dropdown"
            iosHeader="Select your SIM"
            iosIcon={<Icon name="arrow-dropdown-circle" style={{ color: "#007aff", fontSize: 25 }} />}
            style={{ width: undefined }}
            placeholder="Select Receiver">
          </Picker>
          <View style={{ borderColor: 'grey', borderWidth: 0.5 }} />
        </Form>
      </TouchableOpacity>
    )
  
  }


  function LinksScreen() {
    const [countryCode, setCountryCode] = useState('FR')
    const [country, setCountry] = useState(null)
    const [withCountryNameButton, setWithCountryNameButton] = useState(
      false,
    )
    const [withFlag, setWithFlag] = useState(true)
    const [withEmoji, setWithEmoji] = useState(true)
    const [withFilter, setWithFilter] = useState(true)
    const [withAlphaFilter, setWithAlphaFilter] = useState(true)
    const [withCallingCode, setWithCallingCode] = useState(false)
    const [countryModal, setCountryModal] = useState(false)
    const [cashModal, setCashModal] = useState(false);
    
    const onSelect = (country) => {
      setCountryCode(country)
      setCountry(country)
      setCountryModal(false)
    }
    const onClose = () => {
      setCountryModal(false)
    }
    const renderFlagButton = () => null
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <OptionButton
          icon="location-on"
          label="Select a country"
          onPress={() => setCountryModal(true)}
        />
        <CountryPicker
          {...{
            countryCode,
            withFilter,
            withFlag,
            withCountryNameButton,
            withAlphaFilter,
            withCallingCode,
            withEmoji,
            onSelect,
            onClose,
            renderFlagButton,
          }}
          visible={countryModal}
        />
      </ScrollView>
    );
  }

export function WithDrawer() {
  // const [selectedValue, setSelectedValue] = React.useState('15%');
  const navigation = useNavigation();
  let index = 0;
  const data = [
    { key: index++, label: 'Red Apples' },
    { key: index++, label: 'Cherries' },
    { key: index++, label: 'Cranberries', accessibilityLabel: 'Tap here for cranberries' },
    // etc...
    // Can also add additional custom keys which are passed to the onChange callback
    { key: index++, label: 'Vegetable', customKey: 'Not a fruit' }
  ];
  return ( 
    <View style={styles.container}>
      <Content contentContainerStyle={{ padding: 5 }}>
        <View style={styles.card}>
          <Form >
            <Text style={{ marginLeft: 16 }} >Cash out</Text>
            <Item>
              <Input style={{ width: 200, fontSize: 20 }} placeholder="You send" />
              <Right style={{ flexDirection: 'row', marginLeft: "50%" }}>
                <Text style={[styles.description, { marginBottom: 10, color: 'red' }]} note>CAN</Text>
                <Thumbnail small source={Test} style={{ marginLeft: 10 }} />
              </Right>
            </Item>
            <Text style={{ marginLeft: 16, paddingTop: 15 }} >You get</Text>
            <Item last>
              <Left>
                <Input style={{ width: 200, fontSize: 20 }} placeholder="" />
              </Left>
              <Right style={{ flexDirection: 'row', marginLeft: "50%" }}>
                <Text style={[styles.description, { marginBottom: 10, color: 'red' }]} note>CAN</Text>
                <Thumbnail small source={Test} style={{ marginLeft: 10 }} />
              </Right>
            </Item>
          </Form>
        </View>

        <List>
          <Options />
          <Options />
          <Recevers />
        </List>
      </Content>
      <View style={styles.sectionFooter}>
        <View style={{ width: '100%' }}>
          <ListItem>
            <Body>
              <Text style={styles.listDescription} note>Total to pay</Text>
              <Text style={styles.listTitle}>14.38 CAN</Text>
            </Body>
            <Right>
              <TouchableOpacity>
                <Text style={styles.listDescription}>See details</Text>
              </TouchableOpacity>
            </Right>
          </ListItem>
        </View>
        <Button onPress={() => navigation.navigate('add_receivers')} block style={{ height: 60, backgroundColor: '#808080' }}>
          <Text style={styles.paymentText}>Continue to payment</Text>
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  description: {
    fontSize: 14,
    fontWeight: '400'
  },
  cardValue: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 8
  },
  listBody: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 8,
    color: 'grey'
  },
  card: {
    backgroundColor: "rgb(118, 178, 176)",
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
    borderRadius: 10,
    marginBottom: 20
  },
  sectionFooter: {
    height: 150,
    backgroundColor: "#FFF",
    padding: 5,
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 10
  },
  listTitle: {
    fontWeight: "600",
    fontSize: 20,
    marginTop: 2,
    marginBottom: 6,
    color: '#808080'
  },
  listDescription: {
    fontWeight: "500",
    fontSize: 12,
    color: '#808080'
  },
  paymentText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 22
  }
});
export default WithDrawer;