import React from 'react';
import numeral from 'numeral';
import { View, Text, StyleSheet } from 'react-native';
import { Header, Form, Item, Icon, Left, Body, Title, Right, Button, Input } from 'native-base';
import { Colors, IS_iOS } from '../../enums';
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';
import Keyboard from '../../components/Keyboard';

interface IProps {
  onContinue: (amount: number) => void;
  onClose: () => void;
}
/**
 * Invest @component
 * @param props
 */
const EnterAmount: React.FC<IProps> = ({ onContinue, onClose }) => {
  /**
  |--------------------------------------------------
  | if the wallets.length is 1 means it is coming from specific coin/asset details (from Coin.tsx).
  | otherwise the picker will represent all assets / wallets
  |--------------------------------------------------
  */

  // define local state to hold the transaction data using useState hook
  const [state, setState] = React.useState({ input: '', amountInUSD: 0 });
  // handling selecting a coin from the list/picker list

  // handling the amount imput change and update the input state
  const onInputTextChanged = (text: any): void => {
    if (text !== '.' && isNaN(text)) {
      const _input = state.input.substring(0, state.input.length - 1);
      // not a valid number
      setState({
        ...state,
        input: _input,
        amountInUSD: numeral(_input)._value,
      });
      return;
    } else {
      setState({
        ...state,
        input: state.input + text,
        amountInUSD: numeral(state.input + text)._value,
      });
    }
  };

  // dummy call for the onClose functions received from the main component
  const _onClose = (): void => onClose();
  // dummy rendering
  return (
    <View style={{ flex: 1 }}>
      <Header style={{ backgroundColor: Colors.darkGrayish, borderBottomColor: Colors.darkGrayish }}>
        {IS_iOS ? <Left /> : null}
        <Body>
          <Title style={{ color: Colors.white }}>{`Enter amount`}</Title>
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
        <Form>
          {/* {renderPicker()} */}
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
            <Button onPress={() => onContinue(state.amountInUSD)} style={styles.button} block>
              <Text style={styles.buttonText}>Continue with PayPal</Text>
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
  button: { flex: 1, marginHorizontal: moderateScale(10), backgroundColor: Colors.green },
  buttonText: {
    color: Colors.white,
    fontWeight: '600',
    alignSelf: 'center',
    fontSize: scale(13),
  },
});
export default EnterAmount;
