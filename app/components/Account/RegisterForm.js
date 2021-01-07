import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native'
import { Input, Icon, Button } from "react-native-elements"
import { validateEmail } from "../../utils/validations"
import { size, isEmpty } from 'lodash'
import * as firebase from 'firebase'
import { useNavigation } from '@react-navigation/native'
import Loading from '../Loading';


export default function RegisterForm(props) {
    const { toastRef } = props;
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [formData, setFormData] = useState(defaultFormValue);
    const [loading, setLoading] = useState(false)

    const navigation = useNavigation();


    const onSubmit = () => {
        if (
            isEmpty(formData.email) ||
            isEmpty(formData.password) ||
            isEmpty(formData.repeatPassword)
        ) {
            console.log(formData);

            toastRef.current.show("asdas");
        } else if (!validateEmail(formData.email)) {
        }
        else if (formData.password != formData.repeatPassword) {

        }
        else if (size(formData.password) < 6) {

        }
        else {
            setLoading(true);
            firebase
                .auth()
                .createUserWithEmailAndPassword(formData.email, formData.password)
                .then(() => {
                    setLoading(false);
                    navigation.navigate('account');
                })
                .catch(e => {
                    console.log(e)
                    setLoading(false);
                })
        }
    }

    const onChange = (e, type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text })
    }

    return (
        <View style={styles.formContainer}>
            <Input
                placeholder="Correo electronico"
                containerStyle={styles.inputForm}
                rightIcon={
                    <Icon iconStyle={styles.iconRight}
                        type="material-community"
                        name="at" />
                }
                onChange={(e) => onChange(e, "email")} />
            <Input
                placeholder="password"
                containerStyle={styles.inputForm}
                password={true}
                secureTextEntry={showPassword ? false : true}
                onChange={(e) => onChange(e, "password")}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        iconStyle={styles.iconRight}
                        onPress={() => setShowPassword(!showPassword)}
                    />
                }
            />
            <Input
                placeholder="Repetir contraseña"
                containerStyle={styles.inputForm}
                passwrod={true}
                secureTextEntry={showRepeatPassword ? false : true}
                onChange={(e) => onChange(e, "repeatPassword")}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={showRepeatPassword ? 'eye-off-outline' : 'eye-outline'}
                        iconStyle={styles.iconRight}
                        onPress={() => setShowRepeatPassword(!showRepeatPassword)}
                    />
                }
            />

            <Button
                title="Unirse"
                containerStyle={styles.btnContainerRegister}
                buttonStyle={styles.btnRegister}
                onPress={onSubmit}
            />
            <Loading isVisible={loading} text="Creando Cuenta" />
        </View>
    )
}

function defaultFormValue() {
    return {
        email: "",
        password: "",
        repeatPassword: ""
    }
}

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30
    },
    inputForm: {
        width: "100%",
        marginTop: 20
    },
    btnContainerRegister: {
        marginTop: 20,
        width: "95%"
    },
    btnRegister: {
        backgroundColor: "#00a680"
    },
    iconRight: {
        color: "#c1c1c1"
    }
})