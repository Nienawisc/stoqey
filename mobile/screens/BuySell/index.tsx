import React, { State } from 'react'
import {
    StyleSheet,
    Dimensions,
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native'
import Icons from 'react-native-vector-icons/FontAwesome'
import IconsAntDesign from 'react-native-vector-icons/AntDesign'
import {  } from '@expo/vector-icons';
import { Left, Right, Row } from 'native-base'
import { LineChart } from 'react-native-chart-kit'
import Stoqey from '../../assets/icon.png'
let deviceWidth = Dimensions.get('window').width
let deviceHeight = Dimensions.get('window').height

export function Buysell() {

    const [state, setState] = React.useState({
        periodValue: 0,
        periodTexts: ['Day', 'Week', 'Month', 'Year', '5Year']
    })
    const _handleOnPress = (index) => {
        // @ts-ignore
        setState({
            periodValue: index
        })
    }

    return (
        <View style={styles.container}>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: deviceHeight / 15,
                    marginLeft: -60
                }}
            >
                <Image
                    source={Stoqey}
                    style={styles.logoSm}
                />
                <View style={{ paddingLeft: 2 }}>
                    <Text style={styles.fontLarge}> STOQEY (STQ)</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.smallFontBlack}> $125.78</Text>
                        <IconsAntDesign
                            name='caretup'
                            style={{
                                fontSize: 20,
                                backgroundColor: 'white',
                                color: '#3edd95',
                                marginTop: 3,
                                marginLeft: 5 
                            }}
                        />
                    </View>
                </View>
            </View>
            <View style={{  borderColor: '#d1d0d0', borderWidth: 1, borderRadius: 5, marginTop: deviceHeight / -16, width: '96%',  }}>
                <View style={{ alignItems: 'center' }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Text style={styles.fontLargeGray}>$0.44</Text>
                        <IconsAntDesign
                            name='caretup'
                            style={{
                                fontSize: 16,
                                color: '#868e9a',
                                marginTop: 3,
                                marginLeft: 5
                            }}
                        />
                    </View>
                    <Text style={styles.smallFontGray}>11.17% {state.periodTexts[state.periodValue]} Charge</Text>
                    <View
                        style={{
                            paddingVertical: deviceHeight / 80,
                            flexDirection: 'row'
                        }}
                    >
                        {state.periodTexts.map((periodText, index) => {
                            return (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => _handleOnPress(index)}
                                >
                                    {state.periodValue === index && (
                                        <Text style={styles.roundBtnActive}>{periodText}</Text>
                                    )}
                                    {state.periodValue !== index && (
                                        <Text style={styles.roundBtn}>{periodText}</Text>
                                    )}
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </View>
                <View style={{ width: deviceWidth / 100 }}>
                    <LineChart 
                        data={{
                            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                            datasets: [
                                {
                                    data: [
                                        Math.random() * 100,
                                        Math.random() * 100,
                                        Math.random() * 100,
                                        Math.random() * 100,
                                        Math.random() * 100,
                                        Math.random() * 100
                                    ]
                                }
                            ]
                        }}
                        width={deviceWidth * 0.9} // from react-native
                        height={deviceHeight * 0.4}
                        yAxisLabel='$'
                        yAxisSuffix='M'
                        yAxisInterval={1} // optional, defaults to 1
                        chartConfig={{
                            backgroundGradientFrom: '#1E2923',
                            backgroundGradientFromOpacity: 0,
                            backgroundGradientTo: '#08130D',
                            backgroundGradientToOpacity: 0.1,
                            color: (opacity = 1) => `rgba(9, 142, 247, ${opacity})`,
                            // color:'#abd6f8',
                            strokeWidth: 2, // optional, default 3
                            barPercentage: 0.5

                        }}
                        // bezier 
                    />
                </View>
            </View>
            <View style={styles.borders}>
                <Left>
                    <TouchableOpacity>
                        <Text style={styles.labelBlack}>BUY</Text>
                    </TouchableOpacity>
                </Left>
                <Right>
                    <TouchableOpacity>
                        <Text style={styles.labelred}>SELL</Text>
                    </TouchableOpacity>
                </Right>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: deviceHeight / 100
    },
    borders: {
        borderColor: '#d1d0d0',
        borderWidth: 1,
        borderRadius: 5,
        flexDirection: 'row',
        padding: deviceHeight / 40,
        margin: 5,
        width: deviceWidth * 0.95,
        marginTop: deviceHeight / 40,
        overflow: 'hidden',
    },
    avatar: {
        fontSize: 50,
        color: 'white',
        backgroundColor: '#348ffb',
        width: 80,
        height: 80,
        padding: 15,
        borderRadius: 40,
        borderColor: '#d1d0d0',
        borderWidth: 3,
        overflow: 'hidden',
    },
    fontLarge: {
        fontSize: 26,
        fontWeight: 'bold',
        color: 'black'
    },

    logoSm: {
        borderRadius: deviceWidth / 10,
        width: deviceWidth / 5,
        height: deviceWidth / 5,
        borderColor: '#d1d0d0',
        borderWidth: 3,
        margin: deviceHeight / 80,
        overflow: 'hidden'
    },
    fontLargeGray: {
        fontSize: 26,
        color: '#868e9a'
    },
    smallFontBlack: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingLeft: 5
    },
    smallFontGray: {
        fontSize: 16,
        color: '#868e9a'
    },
    labelBlack: {
        backgroundColor: '#30DB8E',
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        padding: 10,
        paddingHorizontal: 30,
        marginHorizontal: 20,
        borderRadius: 5,
        overflow: 'hidden',
    },
    labelred: {
        backgroundColor: '#F3150B',
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        padding: 10,
        paddingHorizontal: 30,
        marginHorizontal: 20,
        borderRadius: 5,
        overflow: 'hidden',
    },
    roundBtn: {
        padding: 3,
        paddingHorizontal: deviceWidth / 25,
        // width: deviceWidth / 6.5,
        backgroundColor: 'white',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ecebef',
        color: '#3b86ec',
        marginHorizontal: 3,
        overflow: 'hidden',
    },
    roundBtnActive: {
        paddingVertical: 3,
        paddingHorizontal: deviceWidth / 25,
        // width: deviceWidth / 6.5,
        backgroundColor: '#3b86ec',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#3b86ec',
        color: 'white',
        marginHorizontal: 3,
        overflow: 'hidden',
    }
})