import React, { useState } from 'react'
import { StyleSheet, View } from "react-native";
import { ListItem } from 'react-native-elements';
import { map } from 'lodash';
import Modal from "../Modal";
import ChangeDisplaName from './ChangeDisplayName'
import ChangeEmailForm from './ChangeEmailForm';
import ChangePasswordForm from './ChangePasswordForm';

export default function AccountOptions(props) {
    const { userInfo, toastRef, setReloadUserInfo } = props;
    const [showModal, setShowModal] = useState(false);
    const [renderComponent, setRenderComponent] = useState(null);

    const selectedComponent = (key) => {
        switch (key) {
            case 'displayName':
                setRenderComponent(
                    <ChangeDisplaName
                        displayName={userInfo.displayName}
                        setShowModal={setShowModal}
                        toastRef={toastRef}
                        setReloadUserInfo={setReloadUserInfo}
                    />)
                setShowModal(true);
                break;
            case 'email':
                setRenderComponent(<ChangeEmailForm
                    email={userInfo.email}
                    setShowModal={setShowModal}
                    toastRef={toastRef}
                    setReloadUserInfo={setReloadUserInfo}
                />)
                setShowModal(true);
                break;
            case 'password':
                setRenderComponent(<ChangePasswordForm
                    setShowModal={setShowModal}
                    toastRef={toastRef}
                />)
                setShowModal(true);
                break;

            default:
                setRenderComponent(null);
                setShowModal(false);
                break;
        }
    };

    const menuOptions = generateOptions(selectedComponent);

    return (
        <View>
            {map(menuOptions, (menu, index) => (
                <ListItem
                    key={index}
                    title={menu.title}
                    onPress={menu.onPress}
                    leftIcon={{
                        type: menu.iconType,
                        name: menu.iconNameLeft,
                        color: menu.iconColorLeft
                    }}
                    rightIcon={{
                        type: menu.iconType,
                        name: menu.iconNameRigth,
                        color: menu.iconColorRigth
                    }}
                    containerStyle={styles.menuItem}
                />
            ))}

            { renderComponent &&
                <Modal
                    isVisible={showModal}
                    setIsVisible={setShowModal}>
                    {renderComponent}
                </Modal>
            }
        </View>
    )
}

const generateOptions = (selectedComponent) => {
    return [
        {
            title: "Cambiar Nombre y apellido",
            iconType: 'material-community',
            iconNameLeft: 'account-circle',
            iconColorLeft: '#ccc',
            iconNameRigth: 'chevron-right',
            iconColorRigth: '#ccc',
            onPress: () => selectedComponent("displayName")
        },
        {
            title: "Cambiar Email",
            iconType: 'material-community',
            iconNameLeft: 'at',
            iconColorLeft: '#ccc',
            iconNameRigth: 'chevron-right',
            iconColorRigth: '#ccc',
            onPress: () => selectedComponent("email")
        },
        {
            title: "Cambiar contraseña",
            iconType: 'material-community',
            iconNameLeft: 'lock-reset',
            iconColorLeft: '#ccc',
            iconNameRigth: 'chevron-right',
            iconColorRigth: '#ccc',
            onPress: () => selectedComponent("password")
        }
    ]
}

const styles = StyleSheet.create({
    menuItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#e3e3e3'
    }
})
