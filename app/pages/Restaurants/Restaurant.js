import React, { useState, useCallback, useRef, useEffect } from 'react'
import { StyleSheet, ScrollView, Dimensions, View, Text } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { Rating, ListItem, Icon } from "react-native-elements"
import Loading from "../../components/Loading";
import CarouselImg from '../../components/Carousel';
import { firebaseApp } from "../../utils/firebase"
import firebase from 'firebase/app'
import "firebase/firestore";
import Map from '../../components/Map'
import { map } from 'lodash'
import ListReview from "../../components/Restaurants/ListReview";
import Toast from "react-native-easy-toast";

const db = firebase.firestore(firebaseApp);
const screenWidth = Dimensions.get("window").width;

export default function Restaurant(props) {
    const { navigation, route } = props;
    const { id, name } = route.params;
    const [restaurant, setRestaurant] = useState(null);
    const [rating, setRating] = useState(0);
    const [isFavorite, setIsFavotire] = useState(false);
    const [userLogged, setUserLogged] = useState(false);
    const toastRef = useRef();

    firebase.auth().onAuthStateChanged(user => {
        user ? setUserLogged(true) : setUserLogged(false);
    })

    useFocusEffect(
        useCallback(() => {
            navigation.setOptions({ title: name });

            db.collection("restaurants")
                .doc(id)
                .get()
                .then(response => {
                    const data = response.data();
                    data.id = response.id;
                    setRestaurant(data);
                    setRating(data.rating);
                })
        }, [])
    );

    useEffect(() => {
        if (userLogged && restaurant) {
            db.collection("favorites")
                .where("idRestaurant", "==", restaurant.id)
                .where("idUser", "==", firebase.auth().currentUser.uid)
                .get()
                .then((response) => {
                    if (response.docs.length === 1) {
                        setIsFavotire(true);
                    }
                })
        }
    }, [userLogged, restaurant])

    const addFavorite = () => {
        if (!userLogged) {
            toastRef.current.show("Para usar el sistemas de favoritos tienes que estar logeado")

        } else {
            const payload = {
                idUser: firebase.auth().currentUser.uid,
                idRestaurant: restaurant.id
            }
            db.collection("favorites")
                .add(payload)
                .then(response => {
                    setIsFavotire(true);
                    toastRef.current.show("Restaurante añado a favorito")
                }).catch(() => {
                    setIsFavotire(false);
                    toastRef.current.show("Error al agregar el Restaurante a favorito")
                })

        }

    }

    const removeFavorite = () => {
        db.collection("favorites")
            .where("idRestaurant", "==", restaurant.id)
            .where("idUser", "==", firebase.auth().currentUser.uid)
            .get()
            .then((response) => {
                response.forEach(doc => {
                    const idFavorite = doc.id
                    db.collection("favorites").doc(doc.id)
                        .delete()
                        .then(() => {
                            setIsFavotire(false);
                            toastRef.current.show("Restaurante eliminado de la lista de favoritos")
                        }).catch(() => {
                            toastRef.current.show("Error al Eliminar de favoritos el Restaurante")
                        })
                })
            })
    }

    if (!restaurant) return <Loading isVisible={true} text="Cargando..." />
    return (
        <ScrollView vertical style={styles.viewBody}>
            <View style={styles.viewFavorite}>
                <Icon
                    type="material-community"
                    name={isFavorite ? "heart" : "heart-outline"}
                    color={isFavorite ? "#f00" : "#000"}
                    size={35}
                    underlayColor="transparent"
                    onPress={isFavorite ? removeFavorite : addFavorite}
                />
            </View>
            <CarouselImg
                arrayImages={restaurant.images}
                height={250}
                width={screenWidth}
            />
            <TitleRestaurant
                name={restaurant.name}
                description={restaurant.description}
                rating={rating}
            />
            <RestaurantInfo
                location={restaurant.location}
                name={restaurant.name}
                address={restaurant.address}
            />
            <ListReview
                navigation={navigation}
                idRestaurant={restaurant.id}
            />
            <Toast ref={toastRef} position="center" opacity={0.9} />
        </ScrollView>
    )
}

function TitleRestaurant(props) {
    const { name, description, rating } = props;

    return (
        <View style={styles.viewRestaurantTitle}>
            <View style={{ flexDirection: "row" }}>
                <Text style={styles.nameRestaurant}>{name}</Text>
                <Rating
                    style={styles.rating}
                    imageSize={20}
                    readonly
                    startingValue={parseFloat(rating)}
                />
            </View>
            <Text style={styles.descriptionRestaurant}>{description}</Text>

        </View>
    )
}

function RestaurantInfo(props) {
    const { location, name, address } = props;
    const listInfo = [
        {
            text: address,
            iconName: "map-marker",
            ionType: "material-community",
            action: null
        },
        {
            text: "112 1212 1221",
            iconName: "phone",
            ionType: "material-community",
            action: null
        }
    ]

    return (
        <View style={styles.viewRestaurantInfo}>
            <Text style={styles.restaurantInfoTitle} >Informacion del restaurante</Text>
            <Map location={location} name={name} address={address} height={100} />
            {map(listInfo, (item, index) => (
                <ListItem
                    key={index}
                    title={item.text}
                    leftIcon={{
                        name: item.iconName,
                        type: item.ionType,
                        color: "#00a680"
                    }}
                    containerStyle={styles.containerListItem}
                />
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#fff"
    },
    viewRestaurantTitle: {
        padding: 15
    },
    nameRestaurant: {
        fontWeight: "bold",
        fontSize: 20
    },
    descriptionRestaurant: {
        marginTop: 5,
        color: "grey"
    },
    rating: {
        position: "absolute",
        right: 0
    },
    viewRestaurantInfo: {
        marginTop: 25,
        margin: 15
    },
    restaurantInfoTitle: {
        fontWeight: "bold",
        fontSize: 20,
        marginBottom: 10
    },
    containerListItem: {
        borderBottomColor: "#d8d8d8",
        borderBottomWidth: 1
    },
    viewFavorite: {
        position: "absolute",
        top: 0,
        right: 0,
        zIndex: 2,
        backgroundColor: "#fff",
        borderBottomLeftRadius: 100,
        padding: 5,
        paddingLeft: 15,

    }
})
