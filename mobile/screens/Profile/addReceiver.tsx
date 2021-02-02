import React, { useState } from 'react';
import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  Image,
  TouchableOpacity, Modal,
} from 'react-native';
import { Left, Right, Title, Subtitle, Container, Header, Content, Label, Button, Card, CardItem, Body, Item, Input, Icon, List, ListItem } from 'native-base';
import { Entypo, FontAwesome, AntDesign } from '@expo/vector-icons';
let deviceWidth = Dimensions.get('window').width
let deviceHeight = Dimensions.get('window').height

const AddReceiver = () => {
  const [receiv, setReceiver] = useState('false');
  const ReceModal = () => {
    return (
      <View style={{ top: 20 }}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={receiv}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <Content>
            <Card style={{ top: 35, paddingTop: 20, paddingBottom: 20, width: deviceWidth / 1.1, marginLeft: 20, borderRadius: 10 }} >
              <View style={styles.creditcard}>
                <Item floatingLabel >
                  <Label style={{  fontSize: 15,  }}>First Name</Label>
                  <Input />
                </Item>
              </View>
              <View style={styles.creditcard}>
                <Item floatingLabel >
                  <Label style={{ fontSize: 15,  }}>Last Name</Label>
                  <Input />
                </Item>
              </View>
              <View style={styles.creditcard}>
                <Item floatingLabel >
                  <Label style={{fontSize: 15, }}>Bank Account</Label>
                  <Input />
                </Item>
              </View>
              <View style={styles.creditcard}>
                <Item floatingLabel>
                  <Label style={{ fontSize: 15, }}>Swfit</Label>
                  <Input />
                </Item>
              </View>
              <View style={{ flexDirection: 'row', marginLeft: 45, paddingTop: 20 }}>
                <Button onPress={() => {
                  setReceiver(!receiv);
                }} style={{ width: deviceWidth / 3, }} rounded>
                  <Text style={{ paddingLeft: 35 }}>Cancel</Text>
                </Button>
                <Button style={{ width: deviceWidth / 3, marginLeft: 20 }} rounded>
                  <Text style={{ paddingLeft: 50 }}>Done</Text>
                </Button>
              </View>
            </Card>
          </Content>
        </Modal>
      </View>
    )
  }
  return (
    <Container>
      <ReceModal />
      <Content>
        <Card>
          <CardItem>
            <Body>
              <Title >To</Title>
              <Subtitle style={{ fontSize: 19, paddingTop: 10 }} >Select contact</Subtitle>
            </Body>
          </CardItem>
        </Card>
        <Item style={{ padding: 10 }}>
          <Icon name="ios-search" />
          <Input placeholder="Search contanct" />
          <Icon name="ios-people" />
        </Item>
        <Button onPress={() => {
          setReceiver(true);
        }} style={{ padding: 20 }} iconLeft light>
          <FontAwesome name="plus-circle" size={30} color="black" >
          </FontAwesome>
          <Left style={{ marginLeft: 10, }}>
            <Text style={{ fontSize: 20 }}>Add Receiver</Text>
          </Left>
        </Button>
        <Card>
          <List>
            <ListItem selected>
              <Left>
                <Text>Simon Mignolet</Text>
              </Left>
              <Right>
                <Entypo name="circle" size={20} color="black" />
              </Right>
            </ListItem>
          </List>
          <List>
            <ListItem selected>
              <Left>
                <Text>Simon Mignolet</Text>
              </Left>
              <Right>
                <Entypo name="circle" size={20} color="black" />
              </Right>
            </ListItem>
          </List>
        </Card>
      </Content>
    </Container>
  )
}

export function Receiver() {
  return (<AddReceiver />)
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 27,
    width: '100%',
    marginLeft: 1

  },
  creditcard: {
    width: deviceWidth / 1.4,
    paddingBottom: 20,
    marginLeft: "11%"
  },
  sectionFooter: {
    top: '26%',
    height: 180,
    backgroundColor: "rgb(118,178,176)",
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
  listDescription: {
    fontWeight: "500",
    fontSize: 12,
    color: '#808080'
  },
  paymentText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 22
  },
  listTitle: {
    fontWeight: "600",
    fontSize: 20,
    marginTop: 2,
    marginBottom: 6,
    color: 'white'
  },
})

export default Receiver

