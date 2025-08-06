import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';

type LeaveType = {
  name: string;
  isPaid: boolean;
  allocations: {
    role: string;
    count: number;
  }[];
};

export default function AdminLeaveSetup() {
  const roleList = ['Admin', 'Teacher', 'Student', 'HR'];

  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [leaveName, setLeaveName] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const [allocations, setAllocations] = useState<{ [role: string]: number }>(() => {
    const initial: { [key: string]: number } = {};
    roleList.forEach((role) => (initial[role] = 0));
    return initial;
  });

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
    setEditIndex(null);
    const reset: { [key: string]: number } = {};
    roleList.forEach((role) => (reset[role] = 0));
    setAllocations(reset);
  };

  const handleAddOrUpdateLeaveType = () => {
    if (!leaveName.trim()) {
      Alert.alert('Validation', 'Leave name cannot be empty.');
      return;
    }

    const newLeave: LeaveType = {
      name: leaveName.trim(),
      isPaid,
      allocations: roleList.map((role) => ({
        role,
        count: allocations[role],
      })),
    };

    if (editIndex !== null) {
      const updated = [...leaveTypes];
      updated[editIndex] = newLeave;
      setLeaveTypes(updated);
    } else {
      setLeaveTypes([...leaveTypes, newLeave]);
    }

    resetForm();
  };

  const handleEdit = (index: number) => {
    const selected = leaveTypes[index];
    setLeaveName(selected.name);
    setIsPaid(selected.isPaid);
    const newAllocations: { [key: string]: number } = {};
    selected.allocations.forEach((a) => {
      newAllocations[a.role] = a.count;
    });
    setAllocations(newAllocations);
    setEditIndex(index);
  };

  const handleDelete = (index: number) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this leave type?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updated = [...leaveTypes];
            updated.splice(index, 1);
            setLeaveTypes(updated);
            resetForm();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>
        {editIndex !== null ? 'Edit Leave Type' : 'Create Leave Type'}
      </Text>
      <Text style={styles.description}>
        Fill the leave name, toggle whether it's paid, and assign leave count to each role.
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

      {roleList.map((role, index) => (
        <View key={index} style={styles.roleRow}>
          <Text style={styles.roleName}>{role}</Text>
          <View style={styles.counter}>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => decrementLeave(role)}
            >
              <Text style={styles.counterText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.countText}>{allocations[role]}</Text>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => incrementLeave(role)}
            >
              <Text style={styles.counterText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.buttonPrimary} onPress={handleAddOrUpdateLeaveType}>
        <Text style={styles.buttonText}>
          {editIndex !== null ? 'Update Leave Type' : 'Save Leave Type'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.heading}>Defined Leave Types</Text>

      {leaveTypes.map((lt, idx) => (
        <View key={idx} style={styles.leaveCard}>
          <Text style={styles.leaveTitle}>
            {lt.name} ({lt.isPaid ? 'Paid (cuts money)' : 'Free'})
          </Text>
          {lt.allocations.map((alloc, i) => (
            <Text key={i} style={styles.allocationText}>
              {alloc.role} - {alloc.count} leaves
            </Text>
          ))}
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#28a745' }]}
              onPress={() => handleEdit(idx)}
            >
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#dc3545' }]}
              onPress={() => handleDelete(idx)}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

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
  actionButton: {
    padding: 10,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
    marginRight: 10,
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
