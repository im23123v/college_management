import { View, TextInput, Button, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import { useState } from 'react';

interface Department {
  _id: string;
  code: string;
  name: string;
  description: string;
}

export default function AddDepartment() {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
 const [departments, setDepartments] = useState<Department[]>([
  {
    _id: '1',
    code: 'CSE',
    name: 'COMPUTER SCIENCE',
    description: 'Computer Science and Engineering',
  },
  {
    _id: '2',
    code: 'ECE',
    name: 'ELECTRONICS',
    description: 'Electronics and Communication Engineering',
  },
  {
    _id: '3',
    code: 'MECH',
    name: 'MECHANICAL',
    description: 'Mechanical Engineering',
  },
]);

  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleNameChange = (text: string) => setName(text.toUpperCase());

  const handleSubmit = () => {
    if (!code || !name) return;

    const newDepartment: Department = {
      _id: editingId || Math.random().toString(36).substr(2, 9), // fake ID for now
      code,
      name,
      description,
    };

    if (editingId) {
      setDepartments(prev =>
        prev.map(dep => (dep._id === editingId ? newDepartment : dep))
      );
    } else {
      setDepartments(prev => [...prev, newDepartment]);
    }

    clearForm();
  };

  const handleEdit = (dep: Department) => {
    setCode(dep.code);
    setName(dep.name);
    setDescription(dep.description);
    setEditingId(dep._id);
  };

  const handleDelete = (id: string) => {
    setDepartments(prev => prev.filter(dep => dep._id !== id));
    if (editingId === id) clearForm();
  };

  const clearForm = () => {
    setCode('');
    setName('');
    setDescription('');
    setEditingId(null);
  };

  const filteredDepartments = departments.filter(dep =>
    dep.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text>Code</Text>
      <TextInput
        style={styles.input}
        value={code}
        onChangeText={setCode}
        autoCapitalize="characters"
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

      <View style={{ marginTop: 20 }}>
        <Button title={editingId ? 'Update Department' : 'Add Department'} onPress={handleSubmit} />
      </View>

      <TextInput
        style={[styles.input, { marginTop: 20 }]}
        placeholder="Search departments"
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredDepartments}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <View>
              <Text style={styles.listTitle}>{item.name}</Text>
              <Text style={styles.listSub}>{item.code} </Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={[styles.actionBtn, styles.edit]} onPress={() => handleEdit(item)}>
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.delete]} onPress={() => handleDelete(item._id)}>
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
