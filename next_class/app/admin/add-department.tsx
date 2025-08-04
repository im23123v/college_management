import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { useState } from 'react';

export default function AddDepartment() {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  

  const handleAddDepartment = async () => {
    const department = {
      code, name, description, 
    };

    try {
      const res = await fetch('http://your-backend-url/api/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(department),
      });
      const data = await res.json();
      console.log('Department Added:', data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNameChange = (text: string) => {
    // Convert all input to uppercase
    const upperCaseText = text.toUpperCase();
    setName(upperCaseText);
  };

  return (
    <View style={styles.container}>
      <Text>Code</Text>
      <TextInput style={styles.input} value={code} onChangeText={setCode} autoCapitalize="characters" />

      <Text>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={handleNameChange}
        placeholder="Enter department name"
      />

      <Text>Description</Text>
      <TextInput style={styles.input} value={description} onChangeText={setDescription} />

      <View style={{ marginTop: 20 }}>
        <Button title="Add Department" onPress={handleAddDepartment} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 5,
    padding: 10, marginBottom: 10,
  },
});
