import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  ActivityIndicator,
  Button,
  StyleSheet,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { router, useNavigation } from "expo-router";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  const getUserStatus = async () => {
    const token = await SecureStore.getItemAsync("token");
    if (!token) {
      router.push("/signin");
      return;
    }
  };
  useEffect(() => {
    navigation.setOptions({ headerTitle: "" });
    getUserStatus();
  }, [navigation]);
  
  const getUser = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        router.push("/signin");
        return;
      }

      const response = await fetch(
        "https://doc-api-1.onrender.com/api/users/getone",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          setError("User not found");
        } else {
          setError("Failed to fetch user data");
        }
        return;
      }
      const userData = await response.json();
      setUserData(userData);
    } catch (error) {
      console.log("Error fetching user data:", error);
      setError("An error occurred while fetching user data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getUser();
  }, []);

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync("token");
      router.push("/signin");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>User not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.text}>{userData.name}</Text>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.text}>{userData.email}</Text>
        <Text style={styles.label}>Mobile Number:</Text>
        <Text style={styles.text}>{userData.mobileNumber}</Text>
        <Text style={styles.label}>Account Type:</Text>
        <Text style={styles.text}>{userData.accountType}</Text>
        <Text style={styles.label}>Date of Birth:</Text>
        <Text style={styles.text}>
          {new Date(userData.dob).toLocaleDateString()}
        </Text>
      </View>
      <Button title="Logout" onPress={logout} color="#ff6347" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f0f8ff",
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  detailsContainer: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
  },
});

export default UserProfile;
