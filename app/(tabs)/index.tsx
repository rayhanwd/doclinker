import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Card, Button, Avatar } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import DoctorCard from "@/components/card/Doctor";
import ServiceCard from "@/components/card/Service";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { EvilIcons } from "@expo/vector-icons";
interface Service {
  _id: string;
  title: string;
  description: string;
}
interface Doctor {
  _id: string;
  name: string;
  specialty: string;
  languages: [];
}

export default function HomeScreen() {
  const [userName, setUserName] = useState("John Doe");
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [status, setStatus] = useState(false);
  const GETDoctors = async () => {
    try {
      const res = await fetch("https://doc-api-1.onrender.com/api/doctors/get", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setDoctors(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    GETDoctors();
  }, []);

  const GETServices = async () => {
    try {
      const res = await fetch("https://doc-api-1.onrender.com/api/services/get", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setServices(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    GETServices();
    GetStatus();
  }, []);

  const GetStatus = async () => {
    const existingToken = await SecureStore.getItemAsync("token");
    if (existingToken) {
      setStatus(true);
    }
  };

  return (
    <>
      <SafeAreaView>
        <ScrollView>
          <View style={styles.header}>
            <Text style={styles.greeting}>Hello</Text>
            {status ? (
              <Button
                mode="contained"
                onPress={() => router.push("/userProfile")}
              >
                <EvilIcons name="user" size={24} color="white" />
              </Button>
            ) : (
              <Button mode="contained" onPress={() => router.push("/")}>
                <EvilIcons name="user" size={24} color="white" />
              </Button>
            )}
          </View>
          <Text style={styles.setionTitle}>Newly added</Text>
          <FlatList
            data={doctors}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <DoctorCard doctor={item} />}
            contentContainerStyle={styles.listContainer}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            bounces={false}
          />
          <Text style={styles.setionTitle}>Recommend</Text>
          <FlatList
            data={doctors}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <DoctorCard doctor={item} />}
            contentContainerStyle={styles.listContainer}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            bounces={false}
          />
          <Text style={styles.setionTitle}>Our services</Text>
          <FlatList
            data={services}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <ServiceCard service={item} />}
            contentContainerStyle={styles.listContainer}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            bounces={false}
          />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
  },
  setionTitle: {
    fontSize: 18,
    paddingLeft: 20,
    fontWeight: "bold",
  },
  listContainer: {
    padding: 10,
  },
});
