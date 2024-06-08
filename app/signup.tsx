import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  ToastAndroid,
} from "react-native";
import {
  Text,
  TextInput,
  Button,
  Checkbox,
  RadioButton,
  Provider as PaperProvider,
} from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as SecureStore from "expo-secure-store";
import { Link, router, useLocalSearchParams, useNavigation } from "expo-router";

const SignUpScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [accountType, setAccountType] = useState("patient");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [specialty, setspecialty] = useState("");
  const [acceptTerms, setacceptTerms] = useState(false);
  const [dob, setDob] = useState(new Date(1598051730000));
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const nextPath = useLocalSearchParams();


  function showToast(msg: string) {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  }

  const handleSignUp = async () => {
    if (!name || !email || !password || !mobileNumber || !acceptTerms) {
      Alert.alert(
        "Validation Error",
        "Please fill in all required fields and accept the terms and conditions."
      );
      return;
    }

    if (accountType === "doctor" && (!licenseNumber || !specialty)) {
      Alert.alert(
        "Validation Error",
        "Please fill in all required fields for doctor."
      );
      return;
    }

    const userData = {
      name,
      email,
      password,
      mobileNumber,
      accountType,
      licenseNumber: accountType === "doctor" ? licenseNumber : undefined,
      specialty: accountType === "doctor" ? specialty : undefined,
      dob,
      acceptTerms,
    };

    setLoading(true);

    try {
      const response = await fetch(
        "https://doc-api-1.onrender.com/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

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
      console.log(error);
      // showToast("Sign Up Failed");
    }
  };

  const onChange = (event: any, selectedDate: Date) => {
    const currentDate = selectedDate || dob;
    setShow(false);
    setDob(currentDate);
  };

  const showMode = (currentMode: React.SetStateAction<string>) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  return (
    <PaperProvider>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Sign Up</Text>

        <TextInput
          label="Name"
          mode="outlined"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <TextInput
          label="Email"
          mode="outlined"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <TextInput
          label="Password"
          mode="outlined"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <TextInput
          label="Mobile Number"
          mode="outlined"
          value={mobileNumber}
          onChangeText={setMobileNumber}
          keyboardType="phone-pad"
          style={styles.input}
        />

        <View style={styles.datePickerContainer}>
          <Button
            mode="contained"
            onPress={showDatepicker}
            style={styles.button}
          >
            Select date of birth
          </Button>
          <Text style={styles.dateText}>{dob.toDateString()}</Text>
        </View>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={dob}
            display="default"
             //@ts-ignore
            onChange={onChange}
          />
        )}

        <RadioButton.Group onValueChange={setAccountType} value={accountType}>
          <View style={styles.radioContainer}>
            <Text>Account Type:</Text>
            <View style={styles.radioOption}>
              <RadioButton value="patient" />
              <Text>Patient</Text>
            </View>
            <View style={styles.radioOption}>
              <RadioButton value="doctor" />
              <Text>Doctor</Text>
            </View>
          </View>
        </RadioButton.Group>

        {accountType === "doctor" && (
          <>
            <TextInput
              label="License Number"
              mode="outlined"
              value={licenseNumber}
              onChangeText={setLicenseNumber}
              style={styles.input}
            />

            <TextInput
              label="specialty"
              mode="outlined"
              value={specialty}
              onChangeText={setspecialty}
              style={styles.input}
            />
          </>
        )}

        <View style={styles.checkboxContainer}>
          <Checkbox
            status={acceptTerms ? "checked" : "unchecked"}
            onPress={() => setacceptTerms(!acceptTerms)}
          />
          <Text style={styles.checkboxLabel}>
            I accept the terms and conditions
          </Text>
        </View>

        <Button
          mode="contained"
          onPress={handleSignUp}
          style={styles.button}
          loading={loading}
          disabled={loading}
        >
          Sign Up
        </Button>
        <Text style={styles.message}>
          Don't have an account? Please create an account
          <Link href={`/signin?q=${nextPath.q}`}> Sign in.</Link>
        </Text>
      </ScrollView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  datePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
  },
  dateText: {
    marginTop: 20,
    marginLeft: 10,
    fontSize: 16,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkboxLabel: {
    marginLeft: 8,
  },
  message: {
    marginTop: 10,
    alignSelf: "center",
    color: "black",
  },
});

export default SignUpScreen;
