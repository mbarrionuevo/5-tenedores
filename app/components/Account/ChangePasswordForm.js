import React, { useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Input, Button } from 'react-native-elements';
import { reAuthenticate } from "../../utils/api";
import * as firebase from 'firebase'

export default function ChangePasswordForm(props) {

    const { setShowModal, toastRef } = props;
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        newPassword: '',
        password: '',
        repeatNewPassword: ''
    });

    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false);

    const onChange = (e, type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text })
    }

    const onSubmit = async () => {
        let isSetErrors = true;
        let errorsTemp = {};
        setErrors({})
        if (!formData.password || !formData.newPassword || !formData.repeatNewPassword) {
            errorsTemp = {
                password: !formData.password ? "La contraseña no puede estar vacia" : "",
                newPassword: !formData.newPassword ? "La contraseña no puede estar vacia" : "",
                repeatNewPassword: !formData.repeatNewPassword ? "La contraseña no puede estar vacia" : "",
            }
        } else if (formData.newPassword != formData.repeatNewPassword) {
            errorsTemp = {
                newPassword: "Las Contraseñas no son iguales",
                repeatNewPassword: "Las Contraseñas no son iguales"
            }
        } else if (formData.newPassword.length < 6) {
            errorsTemp = {
                newPassword: "La contraseña tiene que ser mayor a 5 caracteres.",
                repeatNewPassword: "La contraseña tiene que ser mayor a 5 caracteres."
            }
        }
        else {
            setIsLoading(true);
            await reAuthenticate(formData.password)
                .then(async () => {
                    await firebase
                        .auth()
                        .currentUser
                        .updatePassword.apply(formData.newPassword)
                        .then(() => {
                            isSetErrors = false;
                            setIsLoading(false);
                            setShowModal(false);
                            firebase.auth().signOut();
                        }).catch(() => {
                            errorsTemp = {
                                other: "Error al actualizar la contraseña"
                            }
                        })

                }).catch(() => {
                    errorsTemp = {
                        password: "La contraseña no es correcta"
                    }
                    setIsLoading(false);
                })
        }

        isSetErrors && setErrors(errorsTemp);
    }

    return (
        <View style={styles.view}>
            <Input
                containerStyle={styles.input}
                placeholder="Contraseña Actual"
                password={true}
                secureTextEntry={showPassword ? false : true}
                onChange={(e) => onChange(e, "password")}
                errorMessage={errors.password}
                rightIcon={{
                    type: "material-community",
                    name: showPassword ? "eye-off-outline" : "eye-outline",
                    color: "#c2c2c2",
                    onPress: () => setShowPassword(!showPassword)

                }}
            />
            <Input
                containerStyle={styles.input}
                placeholder="Contraseña Nueva"
                password={true}
                secureTextEntry={showPassword ? false : true}
                onChange={(e) => onChange(e, "newPassword")}
                errorMessage={errors.newPassword}
                rightIcon={{
                    type: "material-community",
                    name: showPassword ? "eye-off-outline" : "eye-outline",
                    color: "#c2c2c2",
                    onPress: () => setShowPassword(!showPassword)
                }}
            />
            <Input
                containerStyle={styles.input}
                placeholder="Repetir Nueva Contraseña"
                password={true}
                secureTextEntry={showPassword ? false : true}
                onChange={(e) => onChange(e, "repeatNewPassword")}
                errorMessage={errors.repeatNewPassword}
                rightIcon={{
                    type: "material-community",
                    name: showPassword ? "eye-off-outline" : "eye-outline",
                    color: "#c2c2c2",
                    onPress: () => setShowPassword(!showPassword)
                }}
            />
            <Button
                buttonStyle={styles.btn}
                containerStyle={styles.btnContainer}
                title="Cambiar Password"
                loading={isLoading}
                onPress={onSubmit} />
            <Text>{errors.other}</Text>
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