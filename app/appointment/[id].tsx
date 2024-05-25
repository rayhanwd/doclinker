import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";
import * as SecureStore from "expo-secure-store";

const AppointmentDetails = () => {
  const { id } = useLocalSearchParams();
  const [data, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerTitle: "" });
  }, [navigation]);

  const GETAppointment = async () => {
    const token = await SecureStore.getItemAsync("token");
    if (!token) {
      router.push(`/signin?q=appointment`);
    }

    try {
      const res = await fetch(
        `https://doc-api-1.onrender.com/api/appointments/user/getsingle/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        if (res.status === 404) {
          setNotFound(true);
        } else {
          throw new Error("Something went wrong");
        }
      } else {
        const data = await res.json();
        setAppointment(data.data);
      }
    } catch (error) {
      console.log(error)
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GETAppointment();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Button mode="contained" onPress={() => router.push("/")}>
          Back to Home
        </Button>
      </View>
    );
  }

  if (notFound) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Doctor not found</Text>
        <Button mode="contained" onPress={() => router.push("/")}>
          Back to Home
        </Button>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.detailsContainer}>
          <View style={styles.itemContainer}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.text}>
              {new Date(data.appointment.date).toLocaleString()}
            </Text>
          </View>
          <View style={styles.itemContainer}>
            <Text style={styles.label}>Reason:</Text>
            <Text style={styles.text}>{data.appointment.reason}</Text>
          </View>
          <View style={styles.itemContainer}>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.text}>{data.appointment.status}</Text>
          </View>
          {/* user details */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionLabel}>Patient Details</Text>
            <View style={styles.itemContainer}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.text}>{data.user.name}</Text>
            </View>
            <View style={styles.itemContainer}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.text}>{data.user.email}</Text>
            </View>
            <View style={styles.itemContainer}>
              <Text style={styles.label}>Mobile Number:</Text>
              <Text style={styles.text}>{data.user.mobileNumber}</Text>
            </View>
          </View>
          {/* doctor details */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionLabel}>Doctor Details</Text>
            <View style={styles.itemContainer}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.text}>{data.doctor.name}</Text>
            </View>
            <View style={styles.itemContainer}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.text}>{data.doctor.email}</Text>
            </View>
            <View style={styles.itemContainer}>
              <Text style={styles.label}>Mobile Number:</Text>
              <Text style={styles.text}>{data.doctor.mobileNumber}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    marginBottom: 20,
  },
  detailsContainer: {
    width: "100%",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  sectionContainer: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 5,
    width: 100,
  },
  text: {
    fontSize: 16,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default AppointmentDetails;
