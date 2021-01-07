import React from 'react';
import { StyleSheet, View, ScrollView, Text, Image } from 'react-native';
import { Button } from 'react-native-elements';
import { useNavigation } from "@react-navigation/native";

export default function UserGuest() {
    const navigation = useNavigation();

    return (
        <ScrollView centerContent={true} style={styles.viewBody}>
            <Image style={styles.image} source={require("../../../assets/img/user-guest.jpg")}
                resizeMode="contain" />
            <Text style={styles.title}>
                Consulta tu perfil
                </Text>
            <Text style={styles.description}>
                Lorem ipsum dolor sit amet consectetur adipiscing elit, magna netus velit rhoncus lectus leo luctus sociis, purus libero integer accumsan habitasse condimentum.
                Magnis lacinia enim inceptos posuere egestas phasellus pulvinar sociosqu,
                ligula ac consequat nisi facilisi non arcu nibh, sed augue vitae proin nostra magna rutrum.
                </Text>
            <View style={styles.viewBtn}>
                <Button buttonStyle={styles.btnStyle} containerStyle={styles.btnContainer} title="Ver tu Perfil"
                    onPress={() => navigation.navigate('login')}>

                </Button>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    viewBody: {
        marginLeft: 30,
        marginRight: 30
    },
    image: {
        height: 300,
        width: "100%",
        marginBottom: 40
    },
    title: {
        fontWeight: "bold",
        fontSize: 19,
        marginBottom: 10,
        textAlign: "center"
    },
    description: {
        textAlign: "center",
        marginBottom: 20
    },
    viewBtn: {
        flex: 1,
        alignItems: "center"
    },
    btnStyle: {
        backgroundColor: "#00a680"
    },
    btnContainer: {
        width: "70%"
    }

});