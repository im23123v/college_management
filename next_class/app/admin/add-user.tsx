import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

interface Role {
  _id: string;
  name: string;
}
interface Department {
  _id: string;
  name: string;
}
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
}

export default function AddUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [search, setSearch] = useState("");

  const [roles, setRoles] = useState<Role[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    const dummyRoles: Role[] = [
      { _id: "1", name: "Admin" },
      { _id: "2", name: "Teacher" },
      { _id: "3", name: "Student" },
      { _id: "4", name: "Clerk" },
      { _id: "5", name: "HOD" },
    ];
    const dummyDepartments: Department[] = [
      { _id: "a1", name: "Computer Science" },
      { _id: "a2", name: "Mechanical" },
      { _id: "a3", name: "Civil" },
      { _id: "a4", name: "Electronics" },
      { _id: "a5", name: "IT" },
    ];
    const dummyUsers: User[] = [
      { _id: "u1", name: "John Doe", email: "john@example.com", role: "1", department: "a1" },
      { _id: "u2", name: "Jane Smith", email: "jane@example.com", role: "2", department: "a2" },
    ];
    setRoles(dummyRoles);
    setDepartments(dummyDepartments);
    setUsers(dummyUsers);
  }, []);

  const handleAddUser = () => {
    if (!name || !email || !password || !roleId) {
      Alert.alert("Validation Error", "Name, email, password, and role are required.");
      return;
    }

    const newUser: User = {
      _id: selectedUserId ?? Date.now().toString(),
      name,
      email,
      role: roleId,
      department: departmentId,
    };

    if (selectedUserId) {
      // Update existing user
      setUsers((prev) =>
        prev.map((u) => (u._id === selectedUserId ? newUser : u))
      );
      Alert.alert("Success", "User updated successfully!");
    } else {
      setUsers((prev) => [...prev, newUser]);
      Alert.alert("Success", "User created successfully!");
    }

    // Clear form
    setName("");
    setEmail("");
    setPassword("");
    setRoleId("");
    setDepartmentId("");
    setSelectedUserId(null);
  };

  const handleEditUserSelect = (user: User) => {
    setSelectedUserId(user._id);
    setName(user.name);
    setEmail(user.email);
    setPassword(""); // Not shown
    setRoleId(user.role);
    setDepartmentId(user.department || "");
  };

  const handleDeleteUser = (id: string) => {
    Alert.alert("Confirm", "Are you sure you want to delete this user?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setUsers((prev) => prev.filter((u) => u._id !== id));
          Alert.alert("Deleted", "User deleted successfully.");
        },
      },
    ]);
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Add / Edit User</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter name"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter email"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Enter password"
        secureTextEntry
      />

      <Text style={styles.label}>Role</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={roleId}
          onValueChange={setRoleId}
          style={styles.picker}
        >
          <Picker.Item label="Select Role" value="" />
          {roles.map((role) => (
            <Picker.Item key={role._id} label={role.name} value={role._id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Department (optional)</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={departmentId}
          onValueChange={setDepartmentId}
          style={styles.picker}
        >
          <Picker.Item label="Select Department" value="" />
          {departments.map((dept) => (
            <Picker.Item key={dept._id} label={dept.name} value={dept._id} />
          ))}
        </Picker>
      </View>

      <View style={styles.btn}>
        <Button
          title={selectedUserId ? "Update User" : "Create User"}
          onPress={handleAddUser}
        />
      </View>

      <Text style={[styles.heading, { marginTop: 30 }]}>User List</Text>

      <TextInput
        style={styles.input}
        value={search}
        onChangeText={setSearch}
        placeholder="Search users"
      />

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.listItemRow}>
            <View>
              <Text style={styles.userInfo}>{item.name}</Text>
              <Text style={styles.userEmail}>{item.email}</Text>
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.editBtn]}
                onPress={() => handleEditUserSelect(item)}
              >
                <Text style={styles.btnText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, styles.deleteBtn]}
                onPress={() => handleDeleteUser(item._id)}
              >
                <Text style={styles.btnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  label: {
    marginTop: 10,
    marginBottom: 4,
    fontWeight: "600",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 6,
    marginBottom: 10,
    overflow: "hidden",
  },
  picker: {
    height: 40,
  },
  btn: {
    marginTop: 20,
  },
  listItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f9f9f9",
    marginVertical: 5,
    borderRadius: 6,
  },
  userInfo: {
    fontWeight: "600",
  },
  userEmail: {
    fontSize: 12,
    color: "#555",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
  },
  actionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editBtn: {
    backgroundColor: "#007bff",
  },
  deleteBtn: {
    backgroundColor: "#dc3545",
  },
  btnText: {
    color: "#fff",
    fontWeight: "500",
  },
});
