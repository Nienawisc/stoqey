import numeral from 'numeral';
import moment from 'moment';
import React, { useRef } from 'react';
import { StyleSheet, View, Text, TextInput, StyleProp, ViewStyle } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import {
  State,
  GestureHandlerStateChangeNativeEvent,
  PanGestureHandlerEventExtra,
  TapGestureHandlerEventExtra,
  LongPressGestureHandlerEventExtra,
  RotationGestureHandlerEventExtra,
  FlingGestureHandlerEventExtra,
  PinchGestureHandlerEventExtra,
  ForceTouchGestureHandlerEventExtra,
  PanGestureHandler,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { LineChart } from 'react-native-svg-charts';
import { CHART_HEADER_HEIGHT, MAXIMUM_CHART_HEIGHT, Colors, Screen } from '../enums';
import { ICoin, IRange } from '../store/interfaces';

// the cursor radius
const cursorRadius = 10;
// reanimated props
const { Value, event, block, set, eq, call, cond, Extrapolate, interpolate } = Animated;
// interface
export interface IPathValues {
  value: number;
  time: string | number;
}
export interface IChartProps {
  color?: string;
  coin: ICoin;
  values: IPathValues[];
  range: IRange;
  fillColor?: string;
  strokeColor: string;
  strokeWidth: number;
  withHeader?: boolean;
  defaultChartValue?: string;
  style?: StyleProp<ViewStyle>;
}
/**
|--------------------------------------------------
| Built coin chart path. here is how to draw the path based on the prices (values) using react native ART
|--------------------------------------------------
*/
const buildPath = (values: IPathValues[], height: number, width: number, strokeWidth: number): any => {
  let firstPoint = true,
    // holds x and y coordinates of the previous point when iterating
    previous: { x: number; y: number },
    cursors: object[] = [], // to hold coordinates
    _values: number[] = [];

  const minValue = Math.min(...values.map(obj => obj.value)),
    maxValue = Math.max(...values.map(obj => obj.value)) - minValue,
    // step between each value point on horizontal (x) axis
    stepX = width / (values.length - 1 || 1),
    // step between each value point on vertical (y) axis
    stepY = maxValue ? (height - strokeWidth * 2) / maxValue : 0,
    // adjust values so that min value becomes 0 and goes to the bottom edge
    adjustedValues = values.map((obj): number => obj.value - minValue);

  adjustedValues.forEach((number, index): void => {
    let x = index * stepX,
      y = -number * stepY - strokeWidth;
    // save current x and y coordinates for the next point
    previous = { x, y };
    // save the coordinates to use for cursor
    cursors.push({ x, y, price: values[index].value, time: values[index].time });
    _values.push(values[index].value);
    firstPoint = false;
  });
  return {
    chartPoints: _values,
    cursors,
  };
};
const Chart: React.FC<IChartProps> = props => {
  // dummy rendering and calls. all the logic is in the components under screens folder (screens/)
  //create refrence to the InputText to maniplulate programmatically
  const label = React.useRef<TextInput>();
  const time = React.useRef<TextInput>();
  const cursorLine = React.useRef<View>();
  // extract components props
  const {
    fillColor,
    strokeColor,
    strokeWidth,
    coin: { change, changePct, price },
    withHeader,
    values,
    style,
    defaultChartValue,
  } = props;

  // get path and cursors
  const { chartPoints, cursors } = buildPath(
    values,
    MAXIMUM_CHART_HEIGHT - CHART_HEADER_HEIGHT,
    Screen.width,
    strokeWidth,
  );
  /**
   * reanimated gestures
   */
  const cursorOpacity = useRef(new Value(0)).current;
  const coinValueOpacity = useRef(new Value(1)).current;

  type NativeEvent = GestureHandlerStateChangeNativeEvent &
    (
      | PanGestureHandlerEventExtra
      | TapGestureHandlerEventExtra
      | LongPressGestureHandlerEventExtra
      | RotationGestureHandlerEventExtra
      | FlingGestureHandlerEventExtra
      | PinchGestureHandlerEventExtra
      | ForceTouchGestureHandlerEventExtra
    );

  type Adaptable<T> = { [P in keyof T]: Animated.Adaptable<T[P]> };

  const onGestureEvent = (nativeEvent: Partial<Adaptable<NativeEvent>>) => {
    const gestureEvent = event([{ nativeEvent }]);
    const stateChanged = event([
      {
        ...nativeEvent,
        nativeEvent: ({ state, x }: { state: any; x: any }) =>
          block([
            cond(
              eq(state, State.ACTIVE),
              [set(cursorOpacity, 1), set(coinValueOpacity, 0)],
              [set(cursorOpacity, 0), set(coinValueOpacity, 1)],
            ),
            cond(eq(state, State.END), [set(cursorOpacity, 0), set(coinValueOpacity, 1)]),
          ]),
      },
    ]);
    return {
      onHandlerStateChange: stateChanged,
      onGestureEvent: gestureEvent,
      cursorOpacity,
      coinValueOpacity,
    };
  };

  const panGestureHandler = () => {
    const x = new Value(0);
    const state = new Value(State.UNDETERMINED);
    const gestureHandler = onGestureEvent({
      x,
      state,
    });
    return {
      x,
      gestureHandler,
      state,
    };
  };
  let { gestureHandler, x } = panGestureHandler();

  const inputRange = cursors.map((_: any): number => _.x);
  const translateX = interpolate(x, {
    // we need to interpolate here so the output should take in considertation the cursor radius to center it
    inputRange: cursors.length ? inputRange : [0, 1],
    outputRange: cursors.length ? cursors.map((_: any): number => _.x - cursorRadius) : [0, 1],
    extrapolate: Extrapolate.CLAMP,
  });
  const translateLineX = interpolate(x, {
    // we need to interpolate here so the output should take in considertation the cursor radius to center it
    inputRange: cursors.length ? inputRange : [0, 1],
    outputRange: cursors.length
      ? cursors.map((_: any): number => _.x - moderateScale(StyleSheet.hairlineWidth) / 2)
      : [0, 1],
    extrapolate: Extrapolate.CLAMP,
  });
  const translateY = interpolate(x, {
    // we to interpolate to get the y output and use x interpolation bcuz we gesture is sliding right & left on x axis
    inputRange: cursors.length ? inputRange : [0, 1],
    outputRange: cursors.length ? cursors.map((_: any): number => _.y - cursorRadius) : [0, 1],
    extrapolate: Extrapolate.CLAMP,
  });

  const __label = interpolate(x, {
    // interpolate x to get the price to update later when moving the cursor:: see the listener down below
    inputRange: cursors.length ? inputRange : [0, 1],
    outputRange: cursors.length ? cursors.map((_: any): number => _.price) : [0, 1],
    extrapolate: Extrapolate.CLAMP,
  });

  const __time = interpolate(x, {
    // interpolate x to get the price to update later when moving the cursor:: see the listener down below
    inputRange: cursors.length ? inputRange : [0, 1],
    outputRange: cursors.length ? cursors.map((_: any): number => _.time) : [0, 1],
    extrapolate: Extrapolate.CLAMP,
  });
  // render prices when moving cursor
  const renderPrice = ([__label__, __time__]: [any, any]) => {
    label.current &&
      label.current.setNativeProps({
        text:
          numeral(__label__).value() < 10
            ? numeral(__label__).format('$0,0[.]0[000]')
            : numeral(__label__).format('$0,0[.]0[0]'),
      });
    time.current &&
      time.current.setNativeProps({
        text: `${moment(__time__ * 1000).format('MM/DD/YYYY hh:mm:ss a')}`,
      });
  };

  const tapGesture = event([
    {
      nativeEvent: ({ state, x: X }: { state: any; x: any }) =>
        block([
          cond(eq(state, State.BEGAN), [set(cursorOpacity, 1), set(coinValueOpacity, 0), set(x, X)]),
          cond(eq(state, State.END), [set(cursorOpacity, 0), set(coinValueOpacity, 1)]),
        ]),
    },
  ]);

  const renderHeader = () =>
    withHeader ? (
      <Animated.View style={{ ...styles.header, opacity: coinValueOpacity }}>
        <View style={styles.left}>
          <Text style={styles.price}>{price ? numeral(price).format('$0,0[.]0[0000]') : '—'}</Text>
          <View style={styles.row}>
            <Text
              style={[
                styles.change,
                {
                  color: change >= 0 ? Colors.green : Colors.red,
                },
              ]}>
              {change
                ? change < 0
                  ? `▼${numeral(Math.abs(change)).format('$0,0[.]0[0]')} (${numeral(Math.abs(changePct)).format(
                      '0,0[.]0[0]',
                    )}%)`
                  : `▲${numeral(Math.abs(change)).format('$0,0[.]0[0]')} (${numeral(Math.abs(changePct)).format(
                      '0,0[.]0[0]',
                    )}%)`
                : '—'}
            </Text>
          </View>
        </View>
        <View
          style={{
            height: CHART_HEADER_HEIGHT - verticalScale(15),
            width: moderateScale(1.5),
            backgroundColor: '#ccc',
          }}
        />
        <View style={styles.right}>
          <View style={styles.row}>
            <Text
              style={[
                styles.change,
                {
                  fontWeight: 'bold',
                  color: Colors.green,
                  paddingHorizontal: scale(10),
                },
              ]}>{`▲`}</Text>
            <Text style={[styles.change, { color: Colors.green }]}>{`${
              values.length ? numeral(Math.max(...cursors.map((o: any) => o.price))).format('$0,0[.]0[0000]') : '—'
            }`}</Text>
          </View>
          <View style={[styles.row, { justifyContent: 'flex-end' }]}>
            <Text
              style={[
                styles.change,
                {
                  fontWeight: 'bold',
                  color: Colors.red,
                  paddingHorizontal: scale(10),
                },
              ]}>
              {`▼`}
            </Text>
            <Text style={[styles.change, { color: Colors.red }]}>{`${
              values.length ? numeral(Math.min(...cursors.map((o: any) => o.price))).format('$0,0[.]0[0000]') : '—'
            }`}</Text>
          </View>
        </View>
      </Animated.View>
    ) : null;
  //* default rendering

  return (
    <View style={[style, { zIndex: 99 }]}>
      {renderHeader()}
      <Animated.View
        style={[styles.header, { flexDirection: 'column', justifyContent: 'center', opacity: cursorOpacity }]}>
        <Animated.Code>{() => call([__label, __time], renderPrice)}</Animated.Code>
        <TextInput
          style={[styles.price, { color: Colors.black, textAlign: 'center' }]}
          editable={false}
          selectTextOnFocus={false}
          ref={label}
        />
        <TextInput
          style={[styles.change, { color: Colors.black + '80', textAlign: 'center' }]}
          editable={false}
          selectTextOnFocus={false}
          ref={time}
        />
      </Animated.View>
      {defaultChartValue !== undefined ? (
        <Animated.View
          style={[styles.header, { flexDirection: 'column', justifyContent: 'center', opacity: coinValueOpacity }]}>
          <Text style={[styles.price, { color: Colors.black, textAlign: 'center' }]}>
            {numeral(defaultChartValue).format('$0,0[.]0[0000]')}
          </Text>
          <Text style={[styles.change, { color: Colors.black + '80', textAlign: 'center' }]}>current balance</Text>
        </Animated.View>
      ) : null}
      <PanGestureHandler
        onGestureEvent={gestureHandler.onGestureEvent}
        onHandlerStateChange={gestureHandler.onHandlerStateChange}>
        <Animated.View
          style={{
            height: MAXIMUM_CHART_HEIGHT - CHART_HEADER_HEIGHT,
            width: Screen.width,
            marginTop: CHART_HEADER_HEIGHT,
          }}>
          <TapGestureHandler onHandlerStateChange={tapGesture}>
            <Animated.View>
              <LineChart
                style={{
                  width: Screen.width,
                  height: MAXIMUM_CHART_HEIGHT - CHART_HEADER_HEIGHT,
                }}
                data={chartPoints}
                svg={{ stroke: strokeColor, strokeWidth, fill: fillColor }}
                contentInset={{ top: 5, bottom: 5 }}
              />
              <Animated.View
                style={{
                  position: 'absolute',
                  height: MAXIMUM_CHART_HEIGHT - CHART_HEADER_HEIGHT,
                  backgroundColor: Colors.gray,
                  width: moderateScale(StyleSheet.hairlineWidth),
                  marginRight: moderateScale(-cursorRadius),
                  transform: [{ translateX: translateLineX }],
                  opacity: cursorOpacity,
                }}
              />

              <Animated.View
                style={[
                  styles.cursor,
                  {
                    opacity: cursorOpacity,
                    transform: [{ translateX }, { translateY }],
                  },
                ]}
              />
            </Animated.View>
          </TapGestureHandler>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.transparent,
    height: MAXIMUM_CHART_HEIGHT,
    zIndex: 999,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    width: Screen.width,
    height: CHART_HEADER_HEIGHT,
  },
  right: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: scale(15),
  },
  left: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: scale(15),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: scale(22),
    color: Colors.black,
    fontWeight: '600',
  },
  change: {
    fontSize: scale(15),
  },
  scroll: {
    height: Screen.height,
    width: Screen.width,
    backgroundColor: Colors.transparent,
  },
  cursor: {
    width: moderateScale(cursorRadius * 2),
    height: moderateScale(cursorRadius * 2),
    borderRadius: moderateScale(cursorRadius),
    borderColor: Colors.trueBlue,
    borderWidth: moderateScale(cursorRadius / 2),
    backgroundColor: Colors.ghostwhite,
  },
  cursorText: {
    color: Colors.white,
    fontSize: scale(12),
    marginLeft: -20,
    marginTop: moderateScale(-(cursorRadius * 3.75)),
  },
});

export default Chart;
