import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import { Checkbox } from "react-native-paper";


interface Role {
  _id: string;
  name: string;
}

interface Department {
  _id: string;
  code: string;
  name: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string | Role;
  department: string | Department;
}

export default function AddUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");

  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const API_BASE = "http://localhost:5000";

  useEffect(() => {
    fetchAll(searchQuery);
  }, [searchQuery]);

  const fetchAll = async (query = "") => {
    try {
      console.log("Fetching data...");
      const [rolesRes, departmentsRes, usersRes] = await Promise.all([
        axios.get(`${API_BASE}/admin/roles`),
        axios.get(`${API_BASE}/admin/departments`),
        axios.get(`${API_BASE}/admin/users`, {
          params: query ? { search: query } : {},
        }),
      ]);

      setRoles(rolesRes.data);
      setDepartments(departmentsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setRole("");
    setDepartment("");
    setEditingUserId(null);
  };

  const handleSubmit = async () => {
    try {
      const identifier = await AsyncStorage.getItem("email");
      const userPayload = { identifier, name, email, role, department };

      if (editingUserId) {
        await axios.put(`${API_BASE}/admin/users/${editingUserId}`, userPayload);
        Alert.alert("User updated successfully!");
      } else {
        await axios.post(`${API_BASE}/admin/users`, userPayload);
        Alert.alert("User added successfully!");
      }

      fetchAll(searchQuery);
      resetForm();
    } catch (err) {
      console.error("Error submitting user", err);
    }
  };

  const handleEdit = (user: User) => {
    setName(user.name);
    setEmail(user.email);
    setRole(typeof user.role === "string" ? user.role : user.role?._id || "");
    setDepartment(
      typeof user.department === "string"
        ? user.department
        : user.department?._id || ""
    );
    setEditingUserId(user._id);
  };

  const handleDelete = async (id: string) => {
    Alert.alert("Delete User", "Are you sure you want to delete this user?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            await axios.delete(`${API_BASE}/admin/users/${id}`);
            fetchAll(searchQuery);
          } catch (err) {
            console.error("Error deleting user", err);
          }
        },
      },
    ]);
  };

  const getRoleName = (userRole: string | Role) => {
    const roleId = typeof userRole === "string" ? userRole : userRole?._id;
    return roles.find((r) => r._id === roleId)?.name || "N/A";
  };

  const getDepartmentName = (userDept: string | Department) => {
    const deptId = typeof userDept === "string" ? userDept : userDept?._id;
    return departments.find((d) => d._id === deptId)?.name || "N/A";
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>
        {editingUserId ? "Edit User" : "Add User"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Text style={styles.label}>Select Role:</Text>
      {roles.length > 0 ? (
        roles.map((r) => (
          <TouchableOpacity
            key={r._id}
            style={styles.checkboxContainer}
            onPress={() => setRole(r._id)}
          >
            <Checkbox status={role === r._id ? "checked" : "unchecked"} />
            <Text>{r.name}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={{ marginBottom: 10 }}>No roles found</Text>
      )}

      <Text style={styles.label}>Select Department:</Text>
      {departments.length > 0 ? (
        departments.map((d) => (
          <TouchableOpacity
            key={d._id}
            style={styles.checkboxContainer}
            onPress={() => setDepartment(d._id)}
          >
            <Checkbox
              status={department === d._id ? "checked" : "unchecked"}
            />
            <Text>{d.name}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={{ marginBottom: 10 }}>No departments found</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>
          {editingUserId ? "Update User" : "Add User"}
        </Text>
      </TouchableOpacity>

      {/* Search Bar */}
      <TextInput
        style={styles.input}
        placeholder="Search by name"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <Text style={styles.heading}>Users</Text>
      {users.map((user) => (
        <View key={user._id} style={styles.userCard}>
          <Text>Name: {user.name}</Text>
          <Text>Email: {user.email}</Text>
          <Text>Role: {getRoleName(user.role)}</Text>
          <Text>Department: {getDepartmentName(user.department)}</Text>
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => handleEdit(user)}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(user._id)}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  heading: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#999",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  label: { fontWeight: "600", marginTop: 10 },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  button: {
    backgroundColor: "#0066cc",
    padding: 10,
    marginTop: 16,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  userCard: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  editText: { color: "blue" },
  deleteText: { color: "red" },
});
