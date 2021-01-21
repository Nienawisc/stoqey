import React, { useEffect } from 'react';
import numeral from 'numeral';
import { View, Text, Image, Alert, StyleSheet, Platform } from 'react-native';
import {
  Header,
  Content,
  Form,
  Item,
  Picker,
  Icon,
  Left,
  Body,
  Title,
  Right,
  Button,
  Container,
  Input,
} from 'native-base';
import { Colors, Screen, IS_iOS } from '../../enums';
import { IWallet } from '../../store/interfaces';
import LoadingSpinner from '../../components/Spinner';
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';
import Keyboard from '../../components/Keyboard';

interface IProps {
  onClose: (...args: any) => any;
  onBuy: (...args: any) => any;
  onSell: (...args: any) => any;
}

const stqSymbol: IWallet = {
  symbol: 'STQ',
  balance: 300,
  name: 'Stoqey',
  marketPrice: '3',
  icon: 'https://firebasestorage.googleapis.com/v0/b/crypsey-01.appspot.com/o/symbols%2FSTQ_dark.png?alt=media',
};

/**
 * Invest @component
 * @param props
 */
const Invest: React.FC<IProps> = ({ onClose, onBuy, onSell }) => {

  const wallets: IWallet[] = [stqSymbol];
  // define local state to hold the transaction data using useState hook
  const [state, setState] = React.useState({ input: '', amountInUSD: 0 });
  // handling selecting a coin from the list/picker list
  // handling the amount imput change and update the input state
  const onInputTextChanged = (text: any): void => {
    setState({ ...state, input: '' });
    const _price: string = stqSymbol ? stqSymbol.marketPrice : '0';

    if (text !== '.' && isNaN(text)) {
      const _input = state.input.substring(0, state.input.length - 1);
      // not a valid number
      setState({
        ...state,
        input: _input,
        amountInUSD: numeral(_input)._value * numeral(_price)._value,
      });
      return;
    } else {
      setState({
        ...state,
        input: state.input + text,
        amountInUSD: numeral(state.input + text)._value * numeral(_price)._value,
      });
    }
    // _input && _input.focus(); // focus to toggle the keyboard
  };
  // call onSell function from the main component to handle the logic
  const _onSell = (): void => {
    if (state.amountInUSD > 0) {
      onSell(state);
      onClose();
    } else {
      Alert.alert('Error', 'Please select the asset and insert a valid amount to invest in! ');
    }
  };
  // call onBuy function from the main component to handle the logic
  const _onBuy = (): void => {
    if (state.amountInUSD > 0) {
      onBuy(state);
      onClose();
    } else {
      Alert.alert('Error', 'Please select the asset and insert a valid amount to invest in! ');
    }
  };
  // render picker only if it doesn't come from specfic coin route
  const renderPicker = (): React.ReactElement<any> => {
    return wallets.length > 1 ? (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}>
        <Picker
          mode="dropdown"
          placeholder="Select Coin"
          inlineLabel
          iosIcon={<Icon name="arrow-dropdown-circle" style={{ color: Colors.white, fontSize: scale(25) }} />}
          style={{
            backgroundColor: Platform.OS === 'android' ? Colors.transparent : Colors.trueBlue,
            borderColor: Colors.trueBlue,
            height: 50,
            borderRadius: 0,
            width: Screen.width,
            marginLeft: Platform.OS === 'android' ? scale(10) : 0,
          }}
          textStyle={{
            color: Colors.white,
            fontSize: scale(18),
            fontWeight: '600',
            backgroundColor: Colors.transparent,
          }}
          headerStyle={{ backgroundColor: Colors.trueBlue }}
          headerBackButtonTextStyle={{ color: Colors.white }}
          headerTitleStyle={{ color: Colors.white }}
          itemTextStyle={{ color: Colors.trueBlue }}
          selectedValue={stqSymbol.symbol}
          onValueChange={() => { }}>
          {wallets.map((coin: IWallet) => (
            <Picker.Item key={coin.symbol} label={coin.name} value={coin.symbol} />
          ))}
        </Picker>
        {Platform.OS === 'android' && (
          <Icon
            name="downcircleo"
            type="AntDesign"
            style={{
              marginLeft: moderateScale(-55),
              marginRight: moderateScale(50),
              color: Colors.black,
              fontSize: scale(25),
            }}
          />
        )}
      </View>
    ) : null;
  };
  // dummy call for the onClose functions received from the main component
  const _onClose = (): void => onClose();
  // dummy rendering
  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <Header style={{ backgroundColor: Colors.darkGrayish, borderBottomColor: Colors.darkGrayish }}>
        {IS_iOS ? <Left /> : null}
        <Body>
          <Title style={{ color: Colors.white }}>{`Trade ${stqSymbol.symbol}`}</Title>
        </Body>
        <Right>
          <Button transparent onPress={_onClose}>
            <Text
              style={{
                color: Colors.white,
              }}>
              Cancel
            </Text>
          </Button>
        </Right>
      </Header>

      <View>

        <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', paddingVertical: 10 }}>
          <Text style={{ fontSize: 28 }}> 30000 </Text>
          <Text style={{ fontSize: 14 }}> Balance</Text>
        </View>
        <Form>
          <Item style={{ marginHorizontal: moderateScale(20) }}>
            <Input
              editable={false}
              style={{
                fontSize: scale(18),
                fontWeight: '600',
              }}
              autoFocus
              value={state.input}
              keyboardAppearance="dark"
              keyboardType="decimal-pad"
              placeholder="Insert amount..."
            // onChangeText={onInputTextChanged}
            />
            <Image source={{ uri: stqSymbol.icon }} style={{ height: 40, width: 40 }} />
          </Item>
          <Item style={{ marginHorizontal: moderateScale(20) }}>
            <Input
              style={{
                color: Colors.trueBlue,
                fontSize: scale(18),
                fontWeight: '600',
              }}
              editable={false}
              placeholder="$ 0.0"
              value={numeral(state.amountInUSD).format('$0,0[.]0[0000]')}
            />
            <Icon active name="swap-vert" type="MaterialIcons" />
          </Item>
          <View style={styles.buttonContainer}>
            <Button onPress={_onBuy} style={[styles.button, { backgroundColor: Colors.green }]} block>
              <Text style={styles.buttonText}>Buy</Text>
            </Button>
            <Button onPress={_onSell} style={[styles.button, { backgroundColor: Colors.red }]} block>
              <Text style={styles.buttonText}>Sell</Text>
            </Button>
          </View>
        </Form>
      </View>

      <Keyboard inputChange={onInputTextChanged} />
    </View>
  );
};
const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(10),
  },
  button: { flex: 1, marginHorizontal: moderateScale(10), backgroundColor: Colors.trueBlue },
  buttonText: {
    color: Colors.white,
    fontWeight: '600',
    alignSelf: 'center',
    fontSize: scale(13),
  },
});
export default Invest;
