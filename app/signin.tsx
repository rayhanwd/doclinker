import { Link, router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useState } from "react";
import { View, StyleSheet, ToastAndroid } from "react-native";
import {
  Text,
  TextInput,
  Button,
  Provider as PaperProvider,
} from "react-native-paper";
import * as SecureStore from "expo-secure-store";

const SignInScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const nextPath = useLocalSearchParams()


  function showToast(msg: string) {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  }
  const handleSignIn = async () => {
    setLoading(true);
    try {
      // Replace with your API call
      const response = await fetch("https://doc-api-1.onrender.com/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      setLoading(false);
      if (result.token) {
        const existingToken = await SecureStore.getItemAsync('token');
        if (existingToken) {
          // Remove existing token
          await SecureStore.deleteItemAsync('token');
        }
        await SecureStore.setItemAsync('token', result.token);

        if(nextPath.q){
          router.push(`${nextPath.q}`);
        }
        router.push(`/`);
        // showToast("Sign In Successful");
      } else {
        // showToast("Sign In Failed");
      }
    } catch (error) {
      setLoading(false);
      // showToast("Sign In Failed");
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.title}>Sign In</Text>
        <TextInput
          label="Email"
          mode="outlined"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          label="Password"
          mode="outlined"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
        <Button
          mode="contained"
          onPress={handleSignIn}
          loading={loading}
          disabled={loading}
        >
          Sign In
        </Button>
        <Button
          mode="text"
          onPress={() => console.log("Forgot Password pressed")}
          style={styles.link}
        >
          Forgot Password?
        </Button>
        <Text style={styles.message}>
          Don't have an account? Please create an account
          <Link href={`/signup?q=${nextPath.q}`}> Sign up.</Link>
        </Text>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "center",
  },
  input: {
    marginBottom: 20,
  },
  link: {
    marginTop: 15,
  },
  message: {
    marginTop: 10,
    alignSelf: "center",
    color: "black",
  },
});

export default SignInScreen;
