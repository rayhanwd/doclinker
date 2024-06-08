import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface UserData {
  name: string;
  email: string;
  mobileNumber: string;
  accountType: string;
  dob: string;
}

interface Props {
  userData: UserData;
}

const UserDetails: React.FC<Props> = ({ userData }) => {
  return (
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

export default UserDetails;
