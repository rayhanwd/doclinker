import { router } from "expo-router";
import React from "react";
import { Text, StyleSheet } from "react-native";
import { Card, Avatar, Button } from "react-native-paper";

interface Appointment {
  _id: string;
  name: string;
  specialty: string;
  languages: [];
}
const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
  <Card style={styles.card}>
    <Card.Title
      title={appointment.name}
      left={(props) => <Avatar.Icon {...props} icon="account-circle" />}
    />
    <Card.Content>
      <Text>Specialty: {appointment.specialty}</Text>
      <Text>Languages: {appointment.languages.join(", ")}</Text>
    </Card.Content>
    <Card.Actions>
      {/* push /doctor */}
      <Button onPress={() => router.push("/doctor/234234")}>More</Button>
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

export default AppointmentCard;
