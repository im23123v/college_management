import { useState } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';


const collegesList = [
  { id: 'C001', name: 'Oxford College' },
  { id: 'C002', name: 'Cambridge Institute' },
  { id: 'C003', name: 'MIT University' },
   { id: 'C001', name: 'Oxford College' },
  { id: 'C002', name: 'Cambridge Institute' },
  { id: 'C003', name: 'MIT University' },
   { id: 'C001', name: 'Oxford College' },
  { id: 'C002', name: 'Cambridge Institute' },
  { id: 'C003', name: 'MIT University' },
   { id: 'C001', name: 'Oxford College' },
  { id: 'C002', name: 'Cambridge Institute' },
  { id: 'C003', name: 'MIT University' },
   { id: 'C001', name: 'Oxford College' },
  { id: 'C002', name: 'Cambridge Institute' },
  { id: 'C003', name: 'MIT University' },
   { id: 'C001', name: 'Oxford College' },
  { id: 'C002', name: 'Cambridge Institute' },
  { id: 'C003', name: 'MIT University' },
];

export default function Dashboard() {
  const [searchText, setSearchText] = useState('');
  const router = useRouter();

  const filteredColleges = searchText
    ? collegesList.filter(college =>
        college.name.toLowerCase().includes(searchText.toLowerCase()) ||
        college.id.toLowerCase().includes(searchText.toLowerCase())
      )
    : collegesList;

  return (
    <View style={styles.container}>
      <View style={styles.searchWrapper}>
      <Ionicons name="search" size={24} color="black" />
        <TextInput
          placeholder="Search College by Name or ID"
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={filteredColleges}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push('/collegeMainPage')}>
            <Text style={styles.collegeName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center', // center search bar horizontally
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
  icon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 30,
    borderColor:'black',
    borderWidth:2,
    borderRadius:10,
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
