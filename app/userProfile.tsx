import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  ActivityIndicator,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { router, useNavigation } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import UserDetails from "@/components/card/UserDetails";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editData, setEditData] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerTitle: "" });
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

      const data = await response.json();
      setUserData(data);
    } catch (error) {
      if (error.startsWith("Please")) {
        await logout();
      }
      setError(error);
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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      const uri = result.assets[0].uri;
      setLoading(true);

      try {
        const token = await SecureStore.getItemAsync("token");
        if (!token) {
          router.push("/signin");
          return;
        }

        const formData = new FormData();
        formData.append("file", {
          uri,
          name: "profile.jpg",
          type: "image/jpeg",
        } as any);

        const response = await fetch(
          "https://doc-api-1.onrender.com/api/users/updateone",
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
            body: formData,
          }
        );
        const userData = await response.json();
        setUserData(userData);
      } catch (error) {
        setError("An error occurred while updating user data");
      } finally {
        setLoading(false);
      }
    }
  };

  const openEditModal = () => {
    setEditModalVisible(true);
    setEditData({
      name: userData?.name || "",
      phone: userData?.phone || "",
    });
  };

  const handleSave = async () => {
  
    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        router.push("/signin");
        return;
      }

      const response = await fetch(
        "https://doc-api-1.onrender.com/api/users/updateone/user",
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editData),
        }
      );
      const updatedUserData = await response.json();
      setUserData(updatedUserData);
      setEditModalVisible(false);
    } catch (error) {
      console.log("Error updating user data:", error);
      // setError("An error occurred while updating user data");
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
      <TouchableOpacity onPress={pickImage}>
        {userData.profile ? (
          <Image source={{ uri: userData.profile }} style={{ width: 200, height: 200,borderRadius:100 }} />
        ) : (
          <Feather name="upload-cloud" size={24} color="black" />
        )}
      </TouchableOpacity>
      <UserDetails userData={userData} />
      <Button title="Edit Info" onPress={openEditModal} color="#007bff"/>
      <View style={styles.space}></View>
      <Button title="Logout" onPress={logout} color="#ff6347" />

      <Modal visible={isEditModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Edit User Info</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={editData.name}
            onChangeText={(text) => setEditData({ ...editData, name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone"
            value={editData.phone}
            onChangeText={(text) => setEditData({ ...editData, phone: text })}
          />
          <Button title="Save" onPress={handleSave} color="#007bff" />
          <View style={styles.space}></View>
          <Button title="Cancel" onPress={() => setEditModalVisible(false)} color="#ff6347" />
        </View>
      </Modal>
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
  space:{
    margin:10
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f0f8ff",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
});

export default UserProfile;
