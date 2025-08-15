import { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

interface College {
  _id: string;
  name: string;
  code: string;
  adminEmail: string;
}

export default function Dashboard() {
  const [searchText, setSearchText] = useState<string>('');
  const [collegesList, setCollegesList] = useState<College[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        console.log("developer dash board");
        const response = await axios.get<College[]>('http://localhost:5000/developer/colleges'); 

        setCollegesList(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching colleges:', error);
        setLoading(false);
      }
    };

    fetchColleges();
  }, []);

  const filteredColleges = searchText
    ? collegesList.filter(college =>
        college.name.toLowerCase().includes(searchText.toLowerCase()) ||
        college.code.toLowerCase().includes(searchText.toLowerCase())
      )
    : collegesList;

  return (
    <View style={styles.container}>
      <View style={styles.searchWrapper}>
        <Ionicons name="search" size={24} color="black" />
        <TextInput
          placeholder="Search College by Name or Code"
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={filteredColleges}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity>
              <Text style={styles.collegeName}>
                {item.name} ({item.code})
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    width: '90%',
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  collegeName: {
    padding: 12,
    backgroundColor: '#dff9fb',
    marginVertical: 4,
    borderRadius: 6,
    fontSize: 16,
    width: 330,
  },
});
