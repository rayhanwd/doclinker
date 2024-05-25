import React from "react";
import { StyleSheet } from "react-native";
import { Avatar, Button, Card, Text } from "react-native-paper";
interface Service {
  id: string;
  title: string;
  description: string;
}
const ServiceCard = ({ service }: { service: Service }) => {
  return (
    <Card style={styles.card}>
      <Card.Title
        title={service.title}
        left={(props) => <Avatar.Icon {...props} icon="folder" />}
      />
      <Card.Content>
        <Text>{service.description}</Text>
      </Card.Content>
      <Card.Actions>
        <Button>More</Button>
      </Card.Actions>
    </Card>
  );
};

export default ServiceCard;

const styles = StyleSheet.create({
  card: {
    margin: 10,
    width: 300,
    height: 200,
  },
});
