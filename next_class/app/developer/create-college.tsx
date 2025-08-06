import { View, Text, TextInput, Button } from 'react-native';
import { useState } from 'react';

export default function CreateCollege() {
  const [collegeName, setCollegeName] = useState('');
  const [email, setEmail] = useState('');
  const [adminName, setAdminName] = useState(''); // <-- NEW

  const handleCreate = async () => {
    try {
      const res = await fetch('http://localhost:5000/developer/colleges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collegeName: collegeName,
          email,
          adminName, // <-- NEW FIELD
        }),
      });

      const data = await res.json();
      alert(data.message || 'College Created');

      // Reset all fields
      setCollegeName('');
      setEmail('');
      setAdminName('');
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
        placeholder="Enter admin name"
        value={adminName}
        onChangeText={setAdminName}
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
