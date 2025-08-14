import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { API_BASE_URL } from "../../config";
import { BASE_URL } from '@env';
type Allocation = {
  role: string;
  count: number;
};

type LeaveType = {
  identifier:string,
  _id?: string;
  name: string;
  isPaid: boolean;
  allocations: Allocation[];
};

const AdminLeaveSetup = () => {
 
 

  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [leaveName, setLeaveName] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

const [roleList, setRoleList] = useState<string[]>([]);
const [allocations, setAllocations] = useState<{ [role: string]: number }>({});

  const fetchLeaveTypes = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/leave-types`);
      setLeaveTypes(res.data);
    } catch (error) {
      console.error('Failed to fetch leave types', error);
    }
  };

  useEffect(() => {
    fetchLeaveTypes();
    fetchRoles();
  }, []);


  const fetchRoles = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/admin/roles`);
    const roles = res.data;
    setRoleList(roles);

    // initialize allocations map
    const initial: { [key: string]: number } = {};
    roles.forEach((role: string) => {
      initial[role] = 0;
    });
    setAllocations(initial);
  } catch (error) {
    console.error('Failed to fetch roles', error);
  }
};


  const incrementLeave = (role: string) => {
    setAllocations({ ...allocations, [role]: allocations[role] + 1 });
  };

  const decrementLeave = (role: string) => {
    if (allocations[role] > 0) {
      setAllocations({ ...allocations, [role]: allocations[role] - 1 });
    }
  };

const resetForm = () => {
  setLeaveName('');
  setIsPaid(false);
  setEditingId(null);
  const reset: { [key: string]: number } = {};
  roleList.forEach((role) => (reset[role] = 0));
  setAllocations(reset);
};


  const handleAddOrEdit = async () => {
    if (!leaveName.trim()) {
      Alert.alert('Validation', 'Leave name is required.');
      return;
    }

    const identifier = await AsyncStorage.getItem('email')

    const payload: LeaveType = {
      identifier:identifier || "",
      name: leaveName,
      isPaid,
      allocations: roleList.map((role) => ({
        role,
        count: allocations[role],
      })),
    };

    try {
      if (editingId) {
        await axios.put(`${BASE_URL}/admin/leave-types/${editingId}`, payload);
        Alert.alert('Success', 'Leave type updated.');
      } else {
        await axios.post(BASE_URL, payload);
        Alert.alert('Success', 'Leave type added.');
      }

      resetForm();
      fetchLeaveTypes();
    } catch (error) {
      console.error('Error saving leave type', error);
    }
  };

  const handleEdit = (lt: LeaveType) => {
    setLeaveName(lt.name);
    setIsPaid(lt.isPaid);
    setEditingId(lt._id || null);

    const roleAllocMap: { [key: string]: number } = {};
    roleList.forEach((role) => {
      const found = lt.allocations.find((a) => a.role === role);
      roleAllocMap[role] = found ? found.count : 0;
    });
    setAllocations(roleAllocMap);
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
            await axios.delete(`${BASE_URL}/admin/leave-types/${id}`);
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
    <ScrollView style={styles.container}>
  <Text style={styles.heading}>Create Leave Type</Text>
  <Text style={styles.description}>
    Fill the leave name, choose whether this leave cuts salary, and assign number of leaves to each role.
  </Text>

  <TextInput
    style={styles.input}
    placeholder="Leave Name"
    value={leaveName}
    onChangeText={setLeaveName}
  />

  <View style={styles.switchContainer}>
    <Text style={styles.label}>Cutting Money?</Text>
    <Switch value={isPaid} onValueChange={setIsPaid} />
  </View>

  <Text style={styles.subHeading}>Assign Leaves to Roles</Text>

  {roleList.length === 0 ? (
    <Text style={{ color: 'gray', marginBottom: 16 }}>
      Yet no roles are assigned.
    </Text>
  ) : (
    roleList.map((role, index) => (
      <View key={index} style={styles.roleRow}>
        <Text style={styles.roleName}>{role}</Text>
        <View style={styles.counter}>
          <TouchableOpacity style={styles.counterButton} onPress={() => decrementLeave(role)}>
            <Text style={styles.counterText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.countText}>{allocations[role]}</Text>
          <TouchableOpacity style={styles.counterButton} onPress={() => incrementLeave(role)}>
            <Text style={styles.counterText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    ))
  )}

  <TouchableOpacity style={styles.buttonPrimary} onPress={handleAddOrEdit}>
    <Text style={styles.buttonText}>
      {editingId ? 'Update Leave Type' : 'Save Leave Type'}
    </Text>
  </TouchableOpacity>

  <Text style={styles.heading}>Defined Leave Types</Text>

  <FlatList
    data={leaveTypes}
    keyExtractor={(item) => item._id!}
    renderItem={({ item }) => (
      <View style={styles.leaveCard}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.leaveTitle}>
            {item.name} ({item.isPaid ? 'Paid' : 'Free'})
          </Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity onPress={() => handleEdit(item)}>
              <Text style={{ color: '#007bff' }}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item._id)}>
              <Text style={{ color: '#dc3545' }}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
        {item.allocations.map((alloc, i) => (
          <Text key={i} style={styles.allocationText}>
            {alloc.role} - {alloc.count} leaves
          </Text>
        ))}
      </View>
    )}
  />
</ScrollView>

  );
};

export default AdminLeaveSetup;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginTop: 40,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
  },
  subHeading: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#888',
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    marginRight: 10,
    fontSize: 16,
  },
  roleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingBottom: 6,
  },
  roleName: {
    fontSize: 16,
    fontWeight: '500',
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterButton: {
    backgroundColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  counterText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  countText: {
    fontSize: 16,
    minWidth: 24,
    textAlign: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 6,
    marginVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  allocationText: {
    fontSize: 14,
    marginBottom: 4,
  },
  leaveCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  leaveTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
});
