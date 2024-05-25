import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { Avatar, Button } from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import DateTimePicker from "@react-native-community/datetimepicker";

const DoctorDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [reason, setReason] = useState("");
  const [creatingAppointment, setCreatingAppointment] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerTitle: "" });
  }, [navigation]);


  const handleCreateAppointment = async () => {
    setModalVisible(true);
  };
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const confirmAppointment = async () => {
    const token = await SecureStore.getItemAsync("token");

    if (!token) {
      router.push(`/signin?q=doctor/${id}`);
      return;
    }

    const appointmentData = {
      doctor: doctorDetails.doctor_id,
      date,
      reason,
    };

    try {
      setCreatingAppointment(true);
      const response = await fetch(
        "https://doc-api-1.onrender.com/api/appointments/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(appointmentData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create appointment");
      }

      setCreatingAppointment(false);
      setModalVisible(false);
      Alert.alert("Success", "Appointment created successfully", [
        { text: "OK", onPress: () => router.push("/appointment") },
      ]);
    } catch (error) {
      console.error(error);
      setCreatingAppointment(false);
      Alert.alert("Error", "Failed to create appointment");
    }
  };

  const getDoctorDetails = async () => {
    try {
      const res = await fetch(
        `https://doc-api-1.onrender.com/api/doctors/getsingle/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
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
        setDoctorDetails(data);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDoctorDetails();
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
    <ScrollView contentContainerStyle={styles.container}>
      <Avatar.Icon style={styles.avatar} size={80} icon="account-circle" />
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.text}>{doctorDetails.doctor_id.name}</Text>
        <Text style={styles.label}>DOB:</Text>
        <Text style={styles.text}>{doctorDetails.doctor_id.dob}</Text>
        <Text style={styles.label}>Mobile Number:</Text>
        <Text style={styles.text}>{doctorDetails.doctor_id.mobileNumber}</Text>
        <Text style={styles.label}>Account Type:</Text>
        <Text style={styles.text}>{doctorDetails.doctor_id.accountType}</Text>
        <Text style={styles.label}>Specialty:</Text>
        <Text style={styles.text}>{doctorDetails.specialty}</Text>
        <Text style={styles.label}>Languages:</Text>
        <Text style={styles.text}>
          {doctorDetails.languages.length > 0
            ? doctorDetails.languages.join(", ")
            : "None"}
        </Text>
      </View>
      <TouchableOpacity onPress={handleCreateAppointment} style={styles.button}>
        <Button
          mode="contained"
          style={{ width: "100%", backgroundColor: "#007bff" }}
        >
          Get appointment
        </Button>
      </TouchableOpacity>

      {/* Modal for creating appointment */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Create Appointment</Text>
            <View style={styles.datePickerContainer}>
              <Button
                mode="contained"
                onPress={showDatepicker}
                style={styles.button}
              >
                Select Date and time
              </Button>
              <Text style={styles.dateText}>{date.toDateString()}</Text>
            </View>
            {showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="date"
                display="default"
                onChange={onChange}
              />
            )}
            <TextInput
              style={styles.input}
              placeholder="Reason"
              value={reason}
              onChangeText={setReason}
            />
            <View style={styles.modalButtons}>
              <Button
                mode="contained"
                onPress={confirmAppointment}
                disabled={creatingAppointment}
                style={{ backgroundColor: "#007bff", marginRight: 10 }}
              >
                {creatingAppointment ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  "Confirm"
                )}
              </Button>
              <Button
                mode="outlined"
                onPress={() => setModalVisible(false)}
                disabled={creatingAppointment}
              >
                Cancel
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  avatar: {
    marginBottom: 20,
  },
  detailsContainer: {
    width: "100%",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    width: "100%",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  datePickerContainer: {
    marginBottom: 20,
  },
  dateText: {
    fontSize: 18,
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    marginTop: 20,
  },
});

export default DoctorDetailsScreen;
