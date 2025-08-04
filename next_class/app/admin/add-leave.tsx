import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
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

  const handleAddLeaveType = () => {
    if (leaveName) {
      const newLeave: LeaveType = {
        name: leaveName,
        isPaid,
        allocations: roleList.map((role) => ({
          role,
          count: allocations[role],
        })),
      };
      setLeaveTypes([...leaveTypes, newLeave]);
      setLeaveName('');
      setIsPaid(false);
      const reset: { [key: string]: number } = {};
      roleList.forEach((role) => (reset[role] = 0));
      setAllocations(reset);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Create Leave Type</Text>
      <Text style={styles.description}>
        Fill the leave name (e.g., "Sick Leave", "Casual Leave"), choose whether this leave cuts salary, 
        and assign number of leaves to each role using the plus (+) and minus (−) buttons.
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

      <TouchableOpacity style={styles.buttonPrimary} onPress={handleAddLeaveType}>
        <Text style={styles.buttonText}>Save Leave Type</Text>
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
