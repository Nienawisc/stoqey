import React, { useState } from 'react';
import {
    StyleSheet,
    Dimensions,
    Text,
    View,
    Image,
    TouchableOpacity, Modal
} from 'react-native';
import Icons from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { Left, Right, Container } from 'native-base';
import { RectButton, ScrollView, TouchableHighlight } from 'react-native-gesture-handler';
import CountryPicker from 'react-native-country-picker-modal'
import Stoqey from '../../assets/icon.png';
import { FontAwesome5 } from '@expo/vector-icons';
import { AppRoute } from '../../config/AppRoute';


let deviceWidth = Dimensions.get('window').width
let deviceHeight = Dimensions.get('window').height

const Profile = () => {
    const [countryCode, setCountryCode] = useState('FR')
    const [withCountryNameButton, setWithCountryNameButton] = useState(
        false,
    )
    const [country, setCountry] = useState(null)
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
    const navigation = useNavigation();
    const CountryNames = () => {
        return (
            <View contentContainerStyle={styles.contentContainer}>
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
                    onSelect={() => navigation.navigate('WithDrawer')}
                />
            </View>
        )
    }
    return (
        <Container>
            <CountryNames/>
            <View style={styles.container}>
                <Image source={Stoqey} style={styles.logo} />
                <Text style={styles.header}>Pa Muhi</Text>
                <View style={{ borderColor: '#4CD7D0', borderWidth: 1, borderRadius: 30, paddingBottom: 10 }}>
                    <View style={styles.bordersSmall}>
                        <Left style={{ marginLeft: 15 }}>
                            <Text style={{ flexDirection: 'row' }}>
                                <Icons name='usd' style={{ fontSize: 20 }} />
                                <Text style={styles.labelWhite}>27,196.77</Text>
                            </Text>
                        </Left>
                        <Right style={{ marginRight: 15 }}>
                            <Text style={styles.labelBlue}>+5.62%</Text>
                        </Right>
                    </View>
                    <View style={styles.withdrawCon}>
                        <Left>
                            <TouchableOpacity>
                                <Text style={styles.uploadBlack}>Upload Funds</Text>
                            </TouchableOpacity>
                        </Left>
                        <Right>
                            <TouchableOpacity onPress={() => setCountryModal(true)} >
                                <Text style={styles.labelBlack}>Withdraw Funds</Text>
                            </TouchableOpacity>
                        </Right>
                    </View>
                </View>
                <View style={{ borderColor: '#4CD7D0', borderWidth: 1, borderRadius: 30, top: 20, borderBottomWidth: 2, }}  >
                    <View style={{ paddingBottom: 10 }}>
                        <View style={styles.borders}>
                            <Left style={{ marginLeft: 15 }}>
                                <Text style={{ flexDirection: 'row' }}>
                                    <Icons name='usd' style={{ fontSize: 20 }} />
                                    <Text style={styles.labelWhite}>1,000</Text>
                                </Text>
                            </Left>
                            <Right style={{ marginRight: 15 }}>
                                <View style={{ flexDirection: 'row', }}>
                                    <View style={{ alignItems: 'center', paddingRight: 10 }}>
                                        <Text style={styles.WithdrawPending}>withdraw</Text>
                                    </View>
                                    <View style={{ alignItems: 'center', }}>
                                        <Text style={styles.labelPending}>Pending</Text>
                                    </View>
                                </View>

                            </Right>
                        </View>
                        <View style={{
                            borderColor: '#d1d0d0',
                            borderBottomWidth: 1, top: -10, width: deviceWidth / 2, marginLeft: '18%'
                        }}></View>
                    </View>
                    <View style={{ paddingBottom: 10 }}>
                        <View style={styles.borders}>
                            <Left style={{ marginLeft: 15 }}>
                                <Text style={{ flexDirection: 'row' }}>
                                    <Icons name='usd' style={{ fontSize: 20 }} />
                                    <Text style={styles.labelWhite}>1,000</Text>
                                </Text>
                            </Left>
                            <Right style={{ marginRight: 15 }}>
                                <View style={{ flexDirection: 'row', }}>
                                    <View style={{ alignItems: 'center', paddingRight: 10 }}>
                                        <Text style={styles.withdrawPending}>Upload</Text>
                                    </View>
                                    <View style={{ alignItems: 'center', }}>
                                        <Text style={styles.labelPending}>Pending</Text>
                                    </View>
                                </View>
                            </Right>
                        </View>
                        <View style={{
                            borderColor: '#d1d0d0',
                            borderBottomWidth: 1, top: -10, width: deviceWidth / 2, marginLeft: '18%'
                        }}></View>
                    </View>
                </View>

                <View style={{ top: 50 }}>
                    <View style={{ alignItems: 'center', }}>
                        <FontAwesome5 name="share-square" size={32} color="black" />
                        <Text style={{ fontSize: 20, paddingTop: 10, fontWeight: 'bold', paddingBottom: 10 }}> Share Stoqey</Text>
                        <Text style={{}}>introduce a friend to Stoqey and you both get $10, </Text>
                    </View>
                    <View style={{ flexDirection: 'row', paddingTop: 20, marginLeft: 20 }}>
                        <View style={{ alignItems: 'center', paddingRight: 10 }}>
                            <Text style={styles.shareStoqey}>Twitter</Text>
                        </View>
                        <View style={{ alignItems: 'center', paddingRight: 10 }}>
                            <Text style={styles.shareStoqey}>Send Text</Text>
                        </View>
                        <View style={{ alignItems: 'center', paddingRight: 10 }}>
                            <Text style={styles.shareStoqey}>Send email</Text>
                        </View>
                        <View style={{ alignItems: 'center', paddingRight: 10 }}>
                            <Text style={styles.shareStoqey}>share</Text>
                        </View>

                    </View>

                </View>




            </View>

        </Container>
    )
}
// onPress={() => navigation.navigate(AppRoute.COIN_DETAILS, { symbol, tradeEnv, enduser })}
export function ProfileFunds() {
    return (
        <>
            <Profile />
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        marginTop: '15%',
        width: '100%',
        marginLeft: 1
    },
    header: {
        fontSize: 25,
        fontWeight: 'bold',
        padding: deviceHeight / 80
    },
    container2: {
        flex: 1,
        backgroundColor: '#fafafa',
    },
    contentContainer: {
        paddingTop: 15,
        justifyContent: 'center'
    },
    optionIconContainer: {
        marginRight: 12,
    },
    option: {
        backgroundColor: '#fdfdfd',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: 0,
        borderColor: '#ededed',
    },
    lastOption: {
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    bordersSmall: {
        borderColor: '#d1d0d0',
        borderWidth: 1,
        borderRadius: 30,
        flexDirection: 'row',
        padding: deviceHeight / 80,
        margin: deviceHeight / 100,
        width: deviceWidth * 0.8,
        overflow: 'hidden'
    },
    withdrawCon: {
        borderColor: '#d1d0d0',
        borderWidth: 1,
        borderRadius: 30,
        flexDirection: 'row',
        padding: deviceHeight / 80,
        // margin: deviceHeight / ,
        marginLeft: 10,
        width: deviceWidth * 0.8,
        overflow: 'hidden',
        // top: -5
    },
    borders: {
        // borderColor: '#d1d0d0',
        // borderWidth: 1,
        borderRadius: 5,
        flexDirection: 'row',
        padding: deviceHeight / 100,
        margin: deviceHeight / 80,
        width: deviceWidth * 0.8,
        overflow: 'hidden'
    },

    withDdraw: {
        borderColor: '#d1d0d0',
        borderWidth: 1,
        top: -20,
        borderRadius: 30,
        flexDirection: 'row',
        padding: deviceHeight / 100,
        margin: deviceHeight / 80,
        width: deviceWidth * 0.8,
        overflow: 'hidden'
    },
    labelWhite: {
        // fontWeight: 'bold',
        fontSize: 20,
        // color: 'white',
    },
    labelBlue: {
        backgroundColor: '#39dc96',
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        padding: 3,
        borderRadius: 5,
        overflow: 'hidden',
    },
    labelBlack: {
        backgroundColor: '#EBADBA',
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold',
        // height: deviceHeight / 30,
        padding: 10,
        borderRadius: 20,
        overflow: 'hidden'
    },
    uploadBlack: {
        backgroundColor: '#C8DF52',
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold',
        // height: deviceHeight / 30,
        padding: 10,
        borderRadius: 20,
        overflow: 'hidden',
    },
    logo: {
        borderRadius: deviceWidth * 0.17,
        width: deviceWidth * 0.24,
        height: deviceWidth * 0.24,
        borderColor: '#d1d0d0',
        borderWidth: 4,
        margin: deviceHeight / 80,
        overflow: 'hidden'
    },
    smalFontBlod: {
        fontSize: 12,
        fontWeight: 'bold',
        paddingLeft: 10
    },
    WithdrawPending: {
        backgroundColor: '#EBADBA',
        fontSize: 12,
        fontWeight: 'bold',
        borderRadius: 10,
        color: 'white',
        // height: deviceHeight / 30,
        padding: 7,
        overflow: 'hidden'
    },

    UploadPending: {
        backgroundColor: '#EBADBA',
        fontSize: 12,
        fontWeight: 'bold',
        borderRadius: 10,
        color: 'white',
        // height: deviceHeight / 30,
        padding: 7,
        overflow: 'hidden'
    },

    withdrawPending: {
        backgroundColor: '#C8DF52',
        fontSize: 12,
        fontWeight: 'bold',
        borderRadius: 10,
        color: 'white',
        // height: deviceHeight / 30,
        padding: 7,
        overflow: 'hidden'
    },
    labelPending: {
        backgroundColor: '#282120',
        fontSize: 12,
        fontWeight: 'bold',
        borderRadius: 10,
        color: 'white',
        // height: deviceHeight / 30,
        padding: 7,
        overflow: 'hidden'
    },

   shareStoqey: {
        backgroundColor: 'blue',
        fontSize: 12,
        fontWeight: 'bold',
        borderRadius: 10,
        color: 'white',
        // height: deviceHeight / 30,
        padding: 7,
        overflow: 'hidden'
    },
    labelDone: {
        backgroundColor: '#3edd96',
        fontSize: 12,
        fontWeight: 'bold',
        padding: 5,
        borderRadius: 3,
        color: 'white',
        width: deviceWidth / 6,
        paddingLeft: 15,
        overflow: 'hidden'
    },
    smalFont: {
        fontSize: 10,
        fontWeight: 'bold'
    }
})

export default ProfileFunds

