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

// Types
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
  const [mode, setMode] = useState<"create" | "edit" | "delete">("create");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");
  const [departmentId, setDepartmentId] = useState("");

  const [roles, setRoles] = useState<Role[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
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

    const userData = { name, email, password, role: roleId, department: departmentId };
    console.log("User Submitted:", userData);

    if (mode === "edit" && selectedUserId) {
      Alert.alert("Success", "User updated successfully!");
    } else {
      Alert.alert("Success", "User created successfully!");
    }

    setName("");
    setEmail("");
    setPassword("");
    setRoleId("");
    setDepartmentId("");
    setSelectedUserId(null);
    setMode("create");
    
  };

  const handleEditUserSelect = (user: User) => {
    setSelectedUserId(user._id);
    setName(user.name);
    setEmail(user.email);
    setPassword(""); // Not showing password
    setRoleId(user.role);
    setDepartmentId(user.department || "");
    setMode("edit");
  };

  const handleDeleteUser = (id: string) => {
    Alert.alert("Confirm", "Are you sure to delete this user?", [
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

  const renderForm = () => (
    <>
      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter name" />

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Enter email" keyboardType="email-address" />

    

      <Text style={styles.label}>Role</Text>
      <View style={styles.pickerWrapper}>
        <Picker selectedValue={roleId} onValueChange={setRoleId} style={styles.picker}>
          <Picker.Item label="Select Role" value="" />
          {roles.map((role) => <Picker.Item key={role._id} label={role.name} value={role._id} />)}
        </Picker>
      </View>

      <Text style={styles.label}>Department (optional)</Text>
      <View style={styles.pickerWrapper}>
        <Picker selectedValue={departmentId} onValueChange={setDepartmentId} style={styles.picker}>
          <Picker.Item label="Select Department" value="" />
          {departments.map((dept) => <Picker.Item key={dept._id} label={dept.name} value={dept._id} />)}
        </Picker>
      </View>

      <View style={styles.btn}>
        <Button title={mode === "edit" ? "Update User" : "Create User"} onPress={handleAddUser} />
      </View>
    </>
    
  );

  const renderEditList = () => (
    <FlatList
      data={users}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => handleEditUserSelect(item)} style={styles.listItem}>
          <Text>{item.name} - {item.email}</Text>
        </TouchableOpacity>
      )}
    />
  );

  const renderDeleteList = () => (
    <>
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
            <Text>{item.name}</Text>
            <Button title="Delete" color="red" onPress={() => handleDeleteUser(item._id)} />
          </View>
        )}
      />
    </>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Mode Switch Buttons */}
      <View style={styles.modeSwitch}>
        {["create", "edit", "delete"].map((m) => (
          <TouchableOpacity 
            key={m} 
          onPress={() => {
        setMode(m as any);
        if (m !== "edit") {
          setSelectedUserId(null);
          setName("");
          setEmail("");
          setPassword("");
          setRoleId("");
          setDepartmentId("");
        }
      }}

            style={[styles.modeBtn, mode === m && styles.selectedModeBtn]}>
          <Text style={mode === m ? styles.activeTabText : styles.tabText}>
          {m.toUpperCase()}
          </Text>

          </TouchableOpacity>
        ))}
      </View>

      {mode === "create" || (mode === "edit" && selectedUserId) ? renderForm() : null}
      {mode === "edit" && !selectedUserId ? renderEditList() : null}
      {mode === "delete" ? renderDeleteList() : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
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
 modeSwitch: {
  flexDirection: "row",
  justifyContent: "space-around",
  backgroundColor: "#eee",
  paddingVertical: 10,
  borderRadius: 10,
  marginBottom: 20,
},
modeBtn: {
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 20,
},
selectedModeBtn: {
  backgroundColor: "#007bff",
},
tabText: {
  color: "#333",
  fontWeight: "500",
},
activeTabText: {
  color: "#fff",
  fontWeight: "bold",
},

  listItem: {
    padding: 12,
    backgroundColor: "#f2f2f2",
    marginVertical: 5,
    borderRadius: 6,
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
});
