import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  ActivityIndicator,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ExploreCard from "@/components/card/ExploreCard";

interface Doctor {
  _id: string;
  name: string;
  specialty: string;
  languages: string[];
  doctor_id: {
    name: string;
  };
}

export default function ExploreScreen() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(
          "https://doc-api-1.onrender.com/api/doctors/get/more",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch doctors");
        }

        const data = await response.json();
        setDoctors(data);
        setFilteredDoctors(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    const filtered = doctors.filter((doctor) =>
      doctor.specialty.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredDoctors(filtered);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heroContainer}>
        <Text style={styles.heroText}>Find Your Doctor</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by specialty..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      <ScrollView>
        <View style={styles.gridContainer}>
          {filteredDoctors.map((doctor, index) => (
            <View
              key={doctor._id}
              style={[
                styles.cardContainer,
                index % 2 !== 0 && { marginLeft: 10 },
              ]}
            >
              <ExploreCard doctor={doctor} />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const windowWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  heroContainer: {
    backgroundColor: "#007bff",
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginBottom: 20,
  },
  heroText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  cardContainer: {
    width: "48%",
    marginBottom: 20,
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
});
