import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Checkbox, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Role {
  _id: string;
  name: string;
  canViewRoles: string[];
  canModifyRoles: string[];
  canDeleteRoles: string[];
}

const CreateRole = () => {
  
  const [roleName, setRoleName] = useState('');
  const [canViewRoles, setCanViewRoles] = useState<string[]>([]);
  const [canModifyRoles, setCanModifyRoles] = useState<string[]>([]);
  const [canDeleteRoles, setCanDeleteRoles] = useState<string[]>([]);
  const [showViewDropdown, setShowViewDropdown] = useState(false);
  const [showModifyDropdown, setShowModifyDropdown] = useState(false);
  const [showDeleteDropdown, setShowDeleteDropdown] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const API_BASE_URL = "http://localhost:5000"
  const togglePermission = (
    roleId: string,
    state: string[],
    setState: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setState((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    );
  };

  const resetForm = () => {
    setRoleName('');
    setCanViewRoles([]);
    setCanModifyRoles([]);
    setCanDeleteRoles([]);
    setShowViewDropdown(false);
    setShowModifyDropdown(false);
    setShowDeleteDropdown(false);
    setEditMode(false);
    setEditingRoleId(null);
  };
const [roles, setRoles] = useState<Role[]>([]);

useEffect(() => {
  const fetchRoles = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/roles`);
      const data = await response.json();
      setRoles(data);
    } catch (err) {
      console.error('Failed to fetch roles', err);
    }
  };

  fetchRoles();
}, []);

const handleSubmit = async () => {
  if (!roleName.trim()) return;
  const email = await AsyncStorage.getItem('email');

  console.log("emial:",email);

 const roleData = {
  identifier:email,
  name: roleName.trim(),
  canAddRoles: canModifyRoles, // map modify to add
  canViewRoles,
  canDeleteRoles,
};

  try {
    const method = editMode ? 'PUT' : 'POST';
    const url = editMode
      ? `${API_BASE_URL}/admin/roles/${editingRoleId}`
      : `${API_BASE_URL}/admin/roles`;

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(roleData),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || 'Failed to submit role');
      return;
    }

    if (editMode) {
      setRoles((prev) =>
        prev.map((r) => (r._id === editingRoleId ? { ...r, ...roleData } : r))
      );
    } else {
      setRoles((prev) => [...prev, data.role]);
    }

    resetForm();
  } catch (error) {
    console.error('Error submitting role:', error);
    alert('Server error while submitting role');
  }
};

  const handleDelete = async (roleId: string) => {
  Alert.alert('Delete Role', 'Are you sure you want to delete this role?', [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Delete',
      style: 'destructive',
      onPress: async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/admin/roles/${roleId}`, {
            method: 'DELETE',
          });

          if (!response.ok) {
            const data = await response.json();
            alert(data.message || 'Failed to delete');
            return;
          }

          setRoles((prev) => prev.filter((r) => r._id !== roleId));
        } catch (error) {
          console.error('Delete error:', error);
          alert('Server error while deleting');
        }
      },
    },
  ]);
};


const handleEdit = (role: Role) => {
  setEditMode(true);
  setEditingRoleId(role._id);
  setRoleName(role.name);
  setCanViewRoles(role.canViewRoles);
  setCanModifyRoles(role.canModifyRoles); // treated as canAddRoles on backend
  setCanDeleteRoles(role.canDeleteRoles);
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
        Select the roles this role can view, modify, or delete. Helps define access control.
      </Text>

      {/* Permission Dropdowns */}
      {[ 
        { title: 'Can View Roles', show: showViewDropdown, toggle: setShowViewDropdown, list: canViewRoles, setList: setCanViewRoles },
        { title: 'Can Modify Roles', show: showModifyDropdown, toggle: setShowModifyDropdown, list: canModifyRoles, setList: setCanModifyRoles },
        { title: 'Can Delete Roles', show: showDeleteDropdown, toggle: setShowDeleteDropdown, list: canDeleteRoles, setList: setCanDeleteRoles }
      ].map(({ title, show, toggle, list, setList }) => (
        <View key={title}>
          <Text style={styles.label}>{title}</Text>
          <TouchableOpacity style={styles.dropdownHeader} onPress={() => toggle(!show)}>
            <Text>{list.length > 0 ? `${list.length} selected` : 'Select roles'}</Text>
            <Text>{show ? '▲' : '▼'}</Text>
          </TouchableOpacity>
          {show &&
            (roles.length === 0 ? (
              <Text style={styles.emptyNote}>No roles available</Text>
            ) : (
              roles.map((role) => (
                <View key={role._id} style={styles.listItemRow}>
                  <Text>{role.name}</Text>
                  <Checkbox
                    status={list.includes(role._id) ? 'checked' : 'unchecked'}
                    onPress={() => togglePermission(role._id, list, setList)}
                  />
                </View>
              ))
            ))}
        </View>
      ))}

      <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
        <View style={[styles.modeBtn, styles.selectedModeBtn]}>
          <Text style={styles.activeTabText}>
            {editMode ? 'Update Role' : 'Create Role'}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.divider} />

      {/* Existing Roles Display */}
      <Text style={styles.label}>Existing Roles</Text>
      {roles.map((role) => (
        <View key={role._id} style={styles.roleCard}>
          <Text style={styles.roleName}>{role.name}</Text>
          <View style={styles.actionRow}>
            <TouchableOpacity onPress={() => handleEdit(role)}>
              <Text style={styles.editBtn}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(role._id)}>
              <Text style={styles.deleteBtn}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
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
    fontSize: 16,
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
  listItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9f9f9',
    marginVertical: 5,
    borderRadius: 6,
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
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 20,
  },
  roleCard: {
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  roleName: {
    fontWeight: '600',
    fontSize: 16,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  editBtn: {
    marginRight: 16,
    color: '#007bff',
    fontWeight: '500',
  },
  deleteBtn: {
    color: '#d9534f',
    fontWeight: '500',
  },
  emptyNote:{
     color: '#999',
  fontStyle: 'italic',
  marginBottom: 10,
  }
});

export default CreateRole;
