import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  ActivityIndicator,
  FlatList,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, Button } from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

// Define types for the appointment data
interface Appointment {
  _id: string;
  reason: string;
  date: string;
  status: string;
}

const AppointmentScreen: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const getAppointments = async () => {
    const token = await SecureStore.getItemAsync("token");
    if (!token) {
      router.push(`/signin?q=appointment`);
      return;
    }
    try {
      const res = await fetch(
        "https://doc-api-1.onrender.com/api/appointments/user/get",
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
        setAppointments(data.appointments);
      }
    } catch (error) {
      //@ts-ignore
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  const renderAppointment = ({ item }: { item: Appointment }) => (
    <Card style={styles.card}>
      <Card.Title title={item.reason} />
      <Card.Content>
        <Text>{new Date(item.date).toLocaleString()}</Text>
        <Text>{item.status}</Text>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => router.push(`/appointment/${item._id}`)}>
          Details
        </Button>
      </Card.Actions>
    </Card>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Button mode="contained" onPress={getAppointments}>
          Retry
        </Button>
      </SafeAreaView>
    );
  }

  if (notFound) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>No appointments found</Text>
        <Button mode="contained" onPress={getAppointments}>
          Retry
        </Button>
      </SafeAreaView>
    );
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Appointments</Text>
        <FlatList
          data={appointments}
          renderItem={renderAppointment}
          keyExtractor={(item) => item._id.toString()}
          contentContainerStyle={styles.listContainer}
        />
        <StatusBar style="auto" />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    marginBottom: 10,
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
});

export default AppointmentScreen;
