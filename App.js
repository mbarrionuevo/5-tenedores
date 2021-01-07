import React, { useEffect } from 'react';
import Navigation from "./app/routers/Router";
import { firebaseApp } from './app/utils/firebase';
import * as firebase from "firebase"
import { LogBox } from "react-native"

LogBox.ignoreLogs(["Setting a timer", "Animated:"]);

export default function App() {
  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      console.log(user);
    })
  }, [])
  return <Navigation />;
}

