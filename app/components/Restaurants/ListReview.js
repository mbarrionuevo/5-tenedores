import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button, Avatar, Rating } from "react-native-elements"
import { firebaseApp } from "../../utils/firebase"
import firebase from "firebase/app"
import "firebase/firestore"
import { map } from 'lodash'

const db = firebase.firestore(firebaseApp);

export default function ListReview(props) {
    const { navigation, idRestaurant } = props;

    const [userLogged, setUserLogged] = useState(false);
    const [reviews, setReviews] = useState([])


    firebase.auth().onAuthStateChanged((user) => {
        user ? setUserLogged(true) : setUserLogged(false);
    });

    useEffect(() => {
        db.collection("reviews")
            .where("idRestaurant", "==", idRestaurant)
            .get()
            .then(response => {
                const resultReview = [];
                response.forEach(item => {
                    const data = item.data();
                    data.id = item.id;
                    resultReview.push(data);
                });
                setReviews(resultReview);
            })
    }, [])

    return (
        <View>
            {userLogged ? (
                <Button
                    title="Escribe una opinion"
                    buttonStyle={styles.btnAddReview}
                    titleStyle={styles.btnTitleAddReview}
                    onPress={() => navigation.navigate("add-review-restaurant", { idRestaurant: idRestaurant })}
                    icon={{
                        type: "material-community",
                        name: "square-edit-outline",
                        color: "#00a680"
                    }}
                />
            ) : (
                    <View>
                        <Text
                            style={{ textAlign: "center", color: "#00a680", padding: 20 }}
                            onPress={() => navigation.nativate('login')}
                        > Para escribir un comentario es necesario estar logeado {" "}
                            <Text style={{ fontWeight: "bold" }}>
                                pulsa AQUI para inciar sesion
                            </Text>
                        </Text>
                    </View>)}

            {map(reviews, (item, index) => (
                <Review
                    key={index} review={item}
                />
            ))}
        </View>
    )
}

function Review(props) {
    const { title, review, rating, createAt, avatarUser } = props.review;
    const createReview = new Date(createAt.seconds * 1000);
    return (
        <View style={styles.viewReview}>
            <View style={styles.viewImgAvatar}>
                <Avatar
                    size="large"
                    rounded
                    containerStyle={styles.imgAvatar}
                    source={avatarUser ? { uri: avatarUser } : require("../../../assets/avatar-default.jpg")}
                />
            </View>
            <View style={styles.viewInfo}>
                <Text style={styles.reviewTitle}>
                    {title}
                </Text>
                <Text style={styles.reviewText}>{review}</Text>
                <Rating
                    imageSize={15}
                    startingValue={rating}
                    readonly
                />
                <Text style={styles.reviewData}> {createReview.getDate()}/{createReview.getMonth() + 1}/{createReview.getFullYear()}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    btnAddReview: {
        backgroundColor: "transparent"
    },
    btnTitleAddReview: {
        color: "#00a680"
    },
    viewReview: {
        flexDirection: "row",
        padding: 10,
        paddingBottom: 10,
        borderBottomColor: "#e3e3e3",
        borderBottomWidth: 1
    },
    viewImgAvatar: {
        marginRight: 15
    },
    imgAvatar: {
        width: 50,
        height: 50
    },
    viewInfo: {
        flex: 1,
        alignItems: "flex-start"
    },
    reviewTitle: {
        fontWeight: "bold"
    },
    reviewText: {
        paddingTop: 2,
        color: "grey",
        marginBottom: 5
    },
    reviewData: {
        marginTop: 5,
        color: "grey",
        fontSize: 12,
        position: "absolute",
        right: 0
    }

})
