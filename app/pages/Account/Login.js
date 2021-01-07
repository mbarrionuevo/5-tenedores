import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from "react-native"
import { Divider } from "react-native-elements";
import { useNavigation } from "@react-navigation/native"
import LoginFom from '../../components/Account/LoginForm'
import Toast from "react-native-easy-toast";


export default function Login() {
    const toastRef = useRef();

    return (
        <ScrollView>
            <Image source={require("../../../assets/5-tenedores-letras-icono-logo.png")}
                resizeMode="contain"
                style={styles.logo} />
            <View style={styles.viewContainer}>
                <LoginFom toastRef={toastRef} />
                <CreateAccount></CreateAccount>
            </View>
            <Divider style={styles.divider}></Divider>
            <Toast
                ref={toastRef}
                position="center"
                opacity={0.9}
            />
        </ScrollView>
    )
}

function CreateAccount() {
    const navigation = useNavigation();
    return (
        <Text style={styles.textRegister}>
            Create Una cuenta papu { " "}
            <Text onPress={() => navigation.navigate('register')} style={styles.btnRegister}>Registrate</Text>
        </Text>
    )
}

const styles = StyleSheet.create({
    logo: {
        height: 150,
        marginTop: 20,
        width: "100%"
    },
    viewContainer: {
        marginRight: 40,
        marginLeft: 40

    },
    textRegister: {
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10
    },
    btnRegister: {
        color: "#00a680",
        fontWeight: "bold"
    },
    divider: {
        backgroundColor: "#00a680",
        margin: 40,
        height: 1
    }
})