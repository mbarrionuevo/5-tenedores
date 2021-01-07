import React, { useState, useEffect } from 'react'
import { StyleSheet, View, ScrollView, Alert, Dimensions } from 'react-native'
import { Button, Icon, Avatar, Image, Input } from 'react-native-elements'
import * as  Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'
import * as Location from "expo-location"
import { firebaseApp } from "../../utils/firebase"
import firebase from "firebase/app"
import "firebase/storage"
import "firebase/firestore"
import MapView from "react-native-maps"
import { map, size, filter } from "lodash"
import uuid from "random-uuid-v4"
import Modal from "../Modal";

const db = firebase.firestore(firebaseApp);

const widthScreen = Dimensions.get("window").width;

export default function AddRestaurantForm(props) {

    const { toastRef, setIsLoading, navigation } = props;
    const [restaurantName, setRestaurantName] = useState("");
    const [restaurantAddress, setRestaurantAddress] = useState("")
    const [restaurantDescription, setRestaurantDescription] = useState("")
    const [imagesSelected, setImagesSelected] = useState([])
    const [isVisibleMap, setIsVisibleMap] = useState(false)
    const [locationRestaurant, setLocationRestaurant] = useState(null);

    const addRestaurant = () => {
        if (!restaurantName || !restaurantAddress || !restaurantDescription) {
            toastRef.current.show("Todos los campos son obligatorios")
        } else if (imagesSelected.length === 0) {
            toastRef.current.show("El restaurante tiene que tener almenos una foto.")
        } else if (!locationRestaurant) {
            toastRef.current.show("Tienes que localizar el restaurante en el mapa.")
        } else {
            setIsLoading(true);
            uploadImgeStorage().then(response => {
                setIsLoading(false);
                db.collection("restaurants")
                    .add({
                        name: restaurantName,
                        address: restaurantAddress,
                        description: restaurantDescription,
                        location: locationRestaurant,
                        images: response,
                        rating: 0,
                        ratingTotal: 0,
                        quantityVoting: 0,
                        createAt: new Date(),
                        createBy: firebase.auth().currentUser.uid,
                    }).then(() => navigation.navigate("restaurants"))
                    .catch(() => console.error("Algo se rompio :D"))
            })
        }
    }

    const uploadImgeStorage = async () => {
        const imageBlob = [];
        await Promise.all(map(imagesSelected, async img => {
            const response = await fetch(img);
            const blob = await response.blob();
            const ref = firebase.storage().ref("restaurants").child(uuid());
            await ref.put(blob).then(async result => {
                await firebase
                    .storage()
                    .ref(`restaurants/${result.metadata.name}`)
                    .getDownloadURL()
                    .then(photoURL => {
                        imageBlob.push(photoURL);
                    });
            });
        }))

        return imageBlob;
    }

    return (
        <ScrollView style={styles.scrollView}>
            <ImageRestaurant
                imageRestaurant={imagesSelected[0]}
            />
            <FormAdd
                setRestaurantAddress={setRestaurantAddress}
                setRestaurantName={setRestaurantName}
                setRestaurantDescription={setRestaurantDescription}
                setIsVisibleMap={setIsVisibleMap}
                locationRestaurant={locationRestaurant}
            />
            <UploadImage
                toastRef={toastRef}
                imagesSelected={imagesSelected}
                setImagesSelected={setImagesSelected}
            />
            <Button
                title="Crear Restaurante"
                onPress={addRestaurant}
                buttonStyle={styles.btn}
            />
            <Map isVisibleMap={isVisibleMap} setIsVisibleMap={setIsVisibleMap}
                setLocationRestaurant={setLocationRestaurant} toastRef={toastRef} />
        </ScrollView>
    )
}

function FormAdd(props) {
    const { setRestaurantAddress, setRestaurantName, setRestaurantDescription, locationRestaurant, setIsVisibleMap } = props;

    return (
        <View style={styles.viewForm}>
            <Input
                placeholder="Nombre del Restaurante"
                containerStyle={styles.input}
                onChange={(e) => setRestaurantName(e.nativeEvent.text)}
            />
            <Input
                placeholder="Direccion"
                containerStyle={styles.input}
                onChange={(e) => setRestaurantAddress(e.nativeEvent.text)}

                rightIcon={{
                    type: "material-community",
                    name: "google-maps",
                    color: locationRestaurant ? "#00a680" : "#c2c2c2",
                    onPress: () => setIsVisibleMap(true)
                }}
            />

            <Input
                multiline
                placeholder="Description"
                inputContainerStyle={styles.textArea}
                onChange={(e) => setRestaurantDescription(e.nativeEvent.text)}
            />
        </View>
    )
}

function Map(props) {
    const { isVisibleMap, setIsVisibleMap, setLocationRestaurant
        , toastRef } = props;
    const [location, setLocation] = useState(null);


    useEffect(() => {
        (async () => {
            const resultPermissions = await Permissions.askAsync(
                Permissions.LOCATION
            );
            const statusPermission = resultPermissions.permissions.location.status;
            if (statusPermission !== "granted") {
                toastRef.current.show("Tienes que aceptar los permisos de localizacion para crear un restaurante", 3000)
            } else {
                const loc = await Location.getCurrentPositionAsync({});
                setLocation({
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001
                })
            }
        })()
    }, [])

    const confirmLocation = () => {
        setLocationRestaurant(location);
        toastRef.current.show("Localizacion guardada correctamente.")
        setIsVisibleMap(false);
    }
    return (
        <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
            <View>
                {location && (
                    <MapView
                        style={styles.mapStyle}
                        initialRegion={location}
                        showsUserLocation={true}
                        onRegionChange={(region) => {
                            setLocation(region);
                        }}
                    >
                        <MapView.Marker
                            coordinate={{
                                latitude: location.latitude,
                                longitude: location.longitude
                            }}
                            draggable
                        />
                    </MapView>
                )}
                <View style={styles.viewMapBtn}>
                    <Button
                        title="Guardar Ubicacion"
                        containerStyle={styles.viewMapBtnContainerSave}
                        buttonStyle={styles.viewMapBtnSave}
                        onPress={confirmLocation}
                    />
                    <Button
                        title="Cancelar Ubicacion"
                        containerStyle={styles.viewMapBtnContainerCancel}
                        buttonStyle={styles.viewMapBtnCancel}
                        onPress={() => setIsVisibleMap(false)}
                    />
                </View>
            </View>
        </Modal>
    )
}

function ImageRestaurant(props) {
    const { imageRestaurant } = props;
    return (
        <View style={styles.viewPhoto}>
            <Image
                source={imageRestaurant ? { uri: imageRestaurant } : require("../../../assets/image-not-found.png")}
                style={{ width: widthScreen, height: 200 }}
            />
        </View>
    )
}

function UploadImage(props) {
    const { toastRef, setImagesSelected, imagesSelected } = props;
    const imageSelect = async () => {
        const resultPermissions = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (resultPermissions === "denied") {
            toastRef.current.show("Es necesario aceptar los permisos de la galeria", 3000)
        } else {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3]
            });
            if (result.cancelled) {
                toastRef.current.show("Has cerrado la galeria sin seleccionar ninguna imagen", 2000)
            } else {
                setImagesSelected([...imagesSelected, result.uri]);

            }
        }

    }

    const removeImg = (img) => {

        Alert.alert("Eliminar Imagen",
            "Estas seguro de eliminar Img",
            [{
                text: "Cancel",
                style: "cancel"
            },
            {
                text: "Eliminar",
                onPress: () => {
                    setImagesSelected(filter(imagesSelected, imgURL => imgURL !== img))
                }
            }])
    }

    return (
        <View style={styles.viewImg}>
            {size(imagesSelected) < 4 && (
                <Icon
                    type="material-community"
                    name="camera"
                    color="#7a7a7a"
                    containerStyle={styles.containerIcon}
                    onPress={imageSelect}
                />
            )}

            {map(imagesSelected, (img, index) =>
                (
                    <Avatar
                        key={index}
                        style={styles.miniatureStyle}
                        source={{ uri: img }}
                        onPress={() => removeImg(img)}
                    />
                )
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        height: "100%"
    },
    viewForm: {
        marginLeft: 10,
        marginRight: 10
    },
    input: {
        marginTop: 10
    },
    textArea: {
        height: 100,
        width: "100%",
        padding: 0,
        margin: 0
    },
    btn: {
        backgroundColor: "#00a890",
        margin: 20
    },
    viewImg: {
        flexDirection: "row",
        marginLeft: 20,
        marginRight: 20,
        marginTop: 30
    },
    containerIcon: {
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
        height: 70,
        width: 70,
        backgroundColor: "#e3e3e3"
    },
    miniatureStyle: {
        width: 70,
        height: 70,
        marginRight: 10,
        marginLeft: 10
    },
    viewPhoto: {
        alignItems: "center",
        height: 200,
        marginBottom: 20
    },
    mapStyle: {
        width: "100%",
        height: 550,
    },
    viewMapBtn: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10
    },
    viewMapBtnContainerCancel: {
        paddingLeft: 5
    },
    viewMapBtnCancel: {
        backgroundColor: "#a60a0d"
    },
    viewMapBtnContainerSave: {
        paddingRight: 5
    },
    viewMapBtnSave: {
        backgroundColor: "#00a680"
    }
})