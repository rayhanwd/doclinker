import { Link, router } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Button } from "react-native-paper";

interface Doctor {
  _id: string;
  doctor_id: {
    name: string;
    profile: string;
  };
  specialty: string;
  languages: string[];
}

const ExploreCard = ({ doctor }: { doctor: Doctor }) => {
  return (
    <Link href={`/doctor/${doctor._id}`}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          {doctor.doctor_id.profile && (
            <Image
              source={{ uri: doctor.doctor_id.profile }}
              style={styles.photo}
              resizeMode="cover"
            />
          )}
        </View>
        <Text style={styles.cardTitle}>{doctor.doctor_id.name}</Text>
        <View style={styles.content}>
          <Text style={styles.contentText}>Specialty: {doctor.specialty}</Text>
          <Text style={styles.contentText}>
            Languages: {doctor.languages.join(", ")}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => router.push(`/doctor/${doctor._id}`)}
            color="#007bff"
          >
            More
          </Button>
        </View>
      </View>
    </Link>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    width: 200,
    borderRadius: 15,
    borderColor: "#ddd",
    borderWidth: 1,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    overflow: "hidden",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  imageContainer: {
    width: "100%",
    height: 150,
    overflow: "hidden",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  content: {
    marginLeft: 10,
  },
  contentText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  buttonContainer: {
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#eee",
  },
});

export default ExploreCard;
