import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native'
import { Input, Icon, Button } from 'react-native-elements'
import { isEmpty } from 'lodash';
import * as  firebase from 'firebase';
import { validateEmail } from '../../utils/validations';
import { useNavigation } from '@react-navigation/native'
import Loading from '../Loading';

export default function LoginForm(props) {
    const { toastRef } = props;
    const navigation = useNavigation();

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const onSubmit = () => {
        if (isEmpty(formData.email) || isEmpty(formData.password)) {
            toastRef.current.show("Todos los campos son obligatorios");
        }
        else if (!validateEmail(formData.email)) {
            toastRef.current.show("El email o contraseña  no es correcto");
        }
        else {
            setLoading(true);
            firebase.auth().signInWithEmailAndPassword(formData.email, formData.password)
                .then(() => {
                    setLoading(false);
                    navigation.navigate('account');

                }).catch(() => {
                    setLoading(false);
                    toastRef.current.show("No se puedo Iniciar sesion")
                })

        }
    }

    const onChange = (e, type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text })
    }

    return (
        <View style={styles.formContainer}>
            <Input
                placeholder="Correo Electronico"
                containerStyle={styles.inputForm}
                onChange={(e) => onChange(e, "email")}
                rightIcon={
                    <Icon
                        type="material-community"
                        name="at"
                        iconStyle={styles.iconRight}
                    />
                } />
            <Input
                placeholder="Contraseña"
                containerStyle={styles.inputForm}
                password={true}
                secureTextEntry={showPassword ? false : true}
                onChange={(e) => onChange(e, "password")}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        iconStyle={styles.iconRight}
                        onPress={() => setShowPassword(!showPassword)} />
                } />
            <Button
                title="Iniciar Sesion"
                containerStyle={styles.btnContainerLogin}
                buttonStyle={styles.btnLogin}
                onPress={onSubmit}
            />
            <Loading
                isVisible={loading}
                text="Iniciando sesion" />
        </View>
    )
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
    btnContainerLogin: {
        marginTop: 20,
        width: "95%"
    },
    btnLogin: {
        backgroundColor: "#00a680"
    },
    iconRight: {
        color: "#c1c1c1"
    }
})