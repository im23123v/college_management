import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Checkbox } from 'react-native-paper';

interface Role {
  _id: string;
  name: string;
}

const dummyRoles: Role[] = [
  { _id: '1', name: 'Admin' },
  { _id: '2', name: 'Manager' },
  { _id: '3', name: 'Editor' },
];

const CreateRole: React.FC = () => {
  const [roleName, setRoleName] = useState('');
  const [canViewRoles, setCanViewRoles] = useState<string[]>([]);
  const [canModifyRoles, setCanModifyRoles] = useState<string[]>([]);
  const [canDeleteRoles, setCanDeleteRoles] = useState<string[]>([]);
  const [showViewDropdown, setShowViewDropdown] = useState(false);
  const [showModifyDropdown, setShowModifyDropdown] = useState(false);
  const [showDeleteDropdown, setShowDeleteDropdown] = useState(false);

  const togglePermission = (
    roleId: string,
    state: string[],
    setState: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setState((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    );
  };

  const handleSubmit = () => {
    if (!roleName.trim()) return;
    const newRole = {
      name: roleName.trim(),
      canViewRoles,
      canModifyRoles,
      canDeleteRoles,
    };
    console.log('Created Role:', newRole);

    // Reset
    setRoleName('');
    setCanViewRoles([]);
    setCanModifyRoles([]);
    setCanDeleteRoles([]);
    setShowViewDropdown(false);
    setShowModifyDropdown(false);
    setShowDeleteDropdown(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Role Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter role name"
        value={roleName}
        onChangeText={setRoleName}
      />

      <Text style={styles.description}>
        Select the roles which this new role can view, modify, or delete. This helps control
        what permissions are granted to each role based on previous ones.
      </Text>

      {/* Can View Roles Dropdown */}
      <Text style={styles.label}>Can View Roles</Text>
      <TouchableOpacity
        style={styles.dropdownHeader}
        onPress={() => setShowViewDropdown(!showViewDropdown)}
      >
        <Text style={{ fontSize: 16 }}>
          {canViewRoles.length > 0 ? `${canViewRoles.length} selected` : 'Select roles'}
        </Text>
        <Text style={{ fontSize: 16 }}>{showViewDropdown ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      {showViewDropdown &&
        (dummyRoles.length === 0 ? (
          <Text style={styles.emptyNote}>No roles available</Text>
        ) : (
          dummyRoles.map((role) => (
            <View key={role._id} style={styles.listItemRow}>
              <Text>{role.name}</Text>
              <Checkbox
                status={canViewRoles.includes(role._id) ? 'checked' : 'unchecked'}
                onPress={() => togglePermission(role._id, canViewRoles, setCanViewRoles)}
              />
            </View>
          ))
        ))}

      {/* Can Modify Roles Dropdown */}
      <Text style={styles.label}>Can Modify Roles</Text>
      <TouchableOpacity
        style={styles.dropdownHeader}
        onPress={() => setShowModifyDropdown(!showModifyDropdown)}
      >
        <Text style={{ fontSize: 16 }}>
          {canModifyRoles.length > 0 ? `${canModifyRoles.length} selected` : 'Select roles'}
        </Text>
        <Text style={{ fontSize: 16 }}>{showModifyDropdown ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      {showModifyDropdown &&
        (dummyRoles.length === 0 ? (
          <Text style={styles.emptyNote}>No roles available</Text>
        ) : (
          dummyRoles.map((role) => (
            <View key={role._id} style={styles.listItemRow}>
              <Text>{role.name}</Text>
              <Checkbox
                status={canModifyRoles.includes(role._id) ? 'checked' : 'unchecked'}
                onPress={() => togglePermission(role._id, canModifyRoles, setCanModifyRoles)}
              />
            </View>
          ))
        ))}

      {/* Can Delete Roles Dropdown */}
      <Text style={styles.label}>Can Delete Roles</Text>
      <TouchableOpacity
        style={styles.dropdownHeader}
        onPress={() => setShowDeleteDropdown(!showDeleteDropdown)}
      >
        <Text style={{ fontSize: 16 }}>
          {canDeleteRoles.length > 0 ? `${canDeleteRoles.length} selected` : 'Select roles'}
        </Text>
        <Text style={{ fontSize: 16 }}>{showDeleteDropdown ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      {showDeleteDropdown &&
        (dummyRoles.length === 0 ? (
          <Text style={styles.emptyNote}>No roles available</Text>
        ) : (
          dummyRoles.map((role) => (
            <View key={role._id} style={styles.listItemRow}>
              <Text>{role.name}</Text>
              <Checkbox
                status={canDeleteRoles.includes(role._id) ? 'checked' : 'unchecked'}
                onPress={() => togglePermission(role._id, canDeleteRoles, setCanDeleteRoles)}
              />
            </View>
          ))
        ))}

      <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
        <View style={[styles.modeBtn, styles.selectedModeBtn]}>
          <Text style={styles.activeTabText}>Create Role</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
  },
  label: {
    marginTop: 10,
    marginBottom: 4,
    fontWeight: '600',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  description: {
    color: '#555',
    marginBottom: 10,
    fontSize: 14,
  },
  emptyNote: {
    color: 'gray',
    marginVertical: 6,
  },
  dropdownHeader: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  btn: {
    marginTop: 20,
  },
  modeBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  selectedModeBtn: {
    backgroundColor: '#007bff',
    alignItems: 'center',
  },
  tabText: {
    color: '#333',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9f9f9',
    marginVertical: 5,
    borderRadius: 6,
  },
});

export default CreateRole;
