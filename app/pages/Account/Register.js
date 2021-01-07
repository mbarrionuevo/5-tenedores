import React, { useRef } from 'react'
import { View, StyleSheet, Image } from 'react-native'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import Toast from "react-native-easy-toast"
import RegisterForm from "../../components/Account/RegisterForm"


export default function Register() {
    const toastRef = useRef();
    return (
        <KeyboardAwareScrollView>
            <Image
                source={require("../../../assets/img/user-guest.jpg")}
                resizeMode="contain"
                style={styles.logo} />
            <View
                style={styles.viewForm}>
                <RegisterForm toastRef={toastRef} />
            </View>
            <Toast ref={toastRef} position="center" opacity={0.9} />
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    logo: {
        width: "100%",
        height: 300,
        marginTop: 20
    },
    viewForm: {
        marginLeft: 40,
        marginRight: 40
    }
}
)
