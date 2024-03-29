import React, { useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import * as firebase from 'firebase'
import { Input, Button } from 'react-native-elements'
import { validateEmail } from '../../utils/validations';
import { reAuthenticate } from '../../utils/api';

export default function ChangeEmailForm(props) {

    const { email, setShowModal, toastRef, setReloadUserInfo } = props;
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false)

    const onChange = (e, type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text })
    }

    const onSubmit = () => {
        setErrors({});
        if (!formData.email || email === formData.email) {
            setErrors({
                email: "El email no ha cambiado."
            })
        } else if (!validateEmail(formData.email)) {
            setErrors({
                email: "Email incorrecto."
            });
        } else if (!formData.password) {
            setErrors({
                password: "La contraseña no puede estar Vacia"
            })
        }
        else {
            setIsLoading(true);
            reAuthenticate(formData.password).then(() => {
                firebase.auth()
                    .currentUser.updateEmail(formData.email)
                    .then(() => {
                        setIsLoading(false);
                        setReloadUserInfo(true);
                        toastRef.current.show("Email Actualizado Correctamente.");
                        setShowModal(false);
                    })
                    .catch(() => {
                        setIsLoading(false);
                        setErrors({
                            email: "Error al actualizar el email"
                        })
                    })
            }).catch(() => {
                setIsLoading(false);
                setErrors({
                    password: "La contraseña no es correcta"
                })
            })
        }
    }

    return (
        <View style={styles.view}>
            <Input containerStyle={styles.input}
                placeholder="Cambiar Email"
                defaultValue={email}
                rightIcon={{
                    type: "material-community",
                    name: "at",
                    color: "#c2c2c2"
                }}
                onChange={(e) => onChange(e, "email")}
                errorMessage={errors.email}
            />
            <Input
                placeholder="Contraseña"
                containerStyle={styles.input}
                password={true}
                secureTextEntry={showPassword ? false : true}
                rightIcon={{
                    type: "material-community",
                    name: showPassword ? "eye-off-outline" : "eye-outline",
                    color: "#c2c2c2",
                    onPress: () => setShowPassword(!showPassword)
                }}
                onChange={(e) => onChange(e, "password")}
                errorMessage={errors.password}
            />
            <Button
                title="Cambiar Email"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={onSubmit}
                loading={isLoading} />
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 10
    },
    input: {
        marginBottom: 10,
    },
    btnContainer: {
        marginTop: 20,
        width: "95%"
    },
    btn: {
        backgroundColor: "#00a680"
    }
})