import { router } from "expo-router";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card, Avatar, Button } from "react-native-paper";

interface Doctor {
  _id: string;
  name: string;
  specialty: string;
  languages: [];
}
const DoctorCard = ({ doctor }: { doctor: Doctor }) => (
  <Card style={styles.card}>
    <Card.Title
      title={doctor.doctor_id.name}
      left={(props) => <Avatar.Icon {...props} icon="account-circle" />}
    />
    <Card.Content>
      <Text>Specialty: {doctor.specialty}</Text>
      <Text>Languages: {doctor.languages.join(", ")}</Text>
    </Card.Content>
    <Card.Actions>
      <Button onPress={() => router.push(`/doctor/${doctor._id}`)}>More</Button>
    </Card.Actions>
  </Card>
);

const styles = StyleSheet.create({
  card: {
    margin: 10,
    width: 300,
    height: 200,
  },
});

export default DoctorCard;
