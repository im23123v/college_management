import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import axios from 'axios';

interface LeaveType {
  _id?: string;
  name: string;
  description: string;
}

const LeaveTypeScreen = () => {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const API_URL = 'http://localhost:5000/admin/leave-types';

  const fetchLeaveTypes = async () => {
    try {
      const res = await axios.get(API_URL);
      setLeaveTypes(res.data);
    } catch (error) {
      console.error('Failed to fetch leave types', error);
    }
  };

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  const handleAddOrEdit = async () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Leave type name is required.');
      return;
    }

    try {
      if (editingId) {
        // Edit existing
        await axios.put(`${API_URL}/${editingId}`, { name, description });
        Alert.alert('Success', 'Leave type updated.');
      } else {
        // Add new
        await axios.post(API_URL, { name, description });
        Alert.alert('Success', 'Leave type added.');
      }

      setName('');
      setDescription('');
      setEditingId(null);
      fetchLeaveTypes();
    } catch (error) {
      console.error('Error saving leave type', error);
    }
  };

  const handleEdit = (type: LeaveType) => {
    setName(type.name);
    setDescription(type.description);
    setEditingId(type._id || null);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;

    Alert.alert('Confirm Delete', 'Are you sure you want to delete this leave type?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`${API_URL}/${id}`);
            Alert.alert('Deleted', 'Leave type deleted.');
            fetchLeaveTypes();
          } catch (error) {
            console.error('Delete error', error);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leave Type</Text>

      <TextInput
        placeholder="Enter Leave Type Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Enter Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />

      <TouchableOpacity onPress={handleAddOrEdit} style={styles.button}>
        <Text style={styles.buttonText}>{editingId ? 'Update' : 'Add'}</Text>
      </TouchableOpacity>

      <FlatList
        data={leaveTypes}
        keyExtractor={(item) => item._id!}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text>{item.description}</Text>
            </View>
            <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionButton}>
              <Text>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.actionButton}>
              <Text>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default LeaveTypeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#888',
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
  },
  button: {
    backgroundColor: '#1976d2',
    padding: 12,
    borderRadius: 6,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  item: {
    flexDirection: 'row',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 10,
    alignItems: 'center',
  },
  name: {
    fontWeight: 'bold',
  },
  actionButton: {
    marginLeft: 10,
  },
});
