import { View, TextInput, Button, StyleSheet, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
interface Department {
  _id: string;
  code: string;
  name: string;
  description: string;
}
import { API_BASE_URL } from "../../app/config";

const API_BASE = API_BASE_URL;

export default function AddDepartment() {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleNameChange = (text: string) => setName(text.toUpperCase());

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/departments`);
      const data = await res.json();
      setDepartments(data);
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  };

  const handleSubmit = async () => {
    if (!code || !name) return;
      const identifier = await AsyncStorage.getItem('email')
    const department = { identifier,code, name, description };

    try {
      const res = await fetch(`${API_BASE}/admin/departments${editingId ? `/${editingId}` : ''}`, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(department),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      Alert.alert('Success', editingId ? 'Department updated' : 'Department added');
      clearForm();
      fetchDepartments();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const handleEdit = (dep: Department) => {
    setCode(dep.code);
    setName(dep.name);
    setDescription(dep.description);
    setEditingId(dep._id);
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`${API_BASE}/admin/departments/${id}`, {
        method: 'DELETE',
      });
      fetchDepartments();
    } catch (err) {
      console.error('Error deleting department:', err);
    }
  };

  const clearForm = () => {
    setCode('');
    setName('');
    setDescription('');
    setEditingId(null);
  };

  return (
    <View style={styles.container}>
      <Text>Code</Text>
      <TextInput
        style={styles.input}
        value={code}
        onChangeText={setCode}
        autoCapitalize="characters"
        placeholder="ex: CSE, ECE"
      />

      <Text>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={handleNameChange}
        placeholder="Enter department name"
      />

      <Text>Description</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter description"
      />

      <Button
        title={editingId ? 'Update Department' : 'Add Department'}
        onPress={handleSubmit}
      />

      <FlatList
        data={departments}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <View>
              <Text style={styles.listTitle}>{item.name}</Text>
              <Text style={styles.listSub}>{item.code}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.edit]}
                onPress={() => handleEdit(item)}>
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, styles.delete]}
                onPress={() => handleDelete(item._id)}>
                <Text style={styles.actionText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  listItem: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    marginVertical: 6,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listTitle: {
    fontWeight: '600',
  },
  listSub: {
    fontSize: 12,
    color: '#555',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  edit: {
    backgroundColor: '#007bff',
  },
  delete: {
    backgroundColor: '#dc3545',
  },
  actionText: {
    color: '#fff',
    fontWeight: '500',
  },
});
