import { View, Text, TextInput, Button } from 'react-native';
import { useState } from 'react';

export default function CreateCollege() {
  const [collegeName, setCollegeName] = useState('');
  const [email, setEmail] = useState('');

  const handleCreate = async () => {
    try {
      const res = await fetch('http://<your-backend-url>/developer/colleges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: collegeName, email }),
      });

      const data = await res.json();
      alert(data.message || 'College Created');
      setCollegeName('');
      setEmail('');
    } catch (err) {
      alert('Error creating college');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Create a New College</Text>

      <TextInput
        placeholder="Enter college name"
        value={collegeName}
        onChangeText={setCollegeName}
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 }}
      />

      <TextInput
        placeholder="Enter admin email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 }}
      />

      <Button title="Generate" onPress={handleCreate} />
    </View>
  );
}
