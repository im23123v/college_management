import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
} from "react-native";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import MultiSelect from "react-native-multiple-select";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { BASE_URL } from '@env';
interface Department {
  _id: string;
  name: string;
}

interface Course {
  _id: string;
  courseName: string;
  duration: number;
  semesters: number;
}

interface Teacher {
  _id: string;
  name: string;
  department: string;
}

interface Subject {
  _id?: string;
  identifier: string;
  department: string;
  course: string;
  year: number;
  semester: number;
  subjectName: string;
  teacherIds: string[];
}



const SubjectManagement = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [subjectName, setSubjectName] = useState("");
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchDepartments();
    fetchCourses();
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      fetchTeachers(selectedDepartment);
    }
  }, [selectedDepartment]);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/departments`);
      setDepartments(res.data);
    } catch (err) {
      console.error("Error fetching departments", err);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/courses`);
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses", err);
    }
  };

  const fetchTeachers = async (department: string) => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/teachers?department=${department}`);
      setTeachers(res.data);
    } catch (err) {
      console.error("Error fetching teachers", err);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/subjects`);
      setSubjects(res.data);
    } catch (err) {
      console.error("Error fetching subjects", err);
    }
  };

  const handleAddOrUpdate = async () => {
    const identifier = await AsyncStorage.getItem("email");

    const subject: Subject = {
      identifier: identifier || "",
      department: selectedDepartment,
      course: selectedCourseId,
      year: selectedYear || 1,
      semester: selectedSemester || 1,
      subjectName,
      teacherIds: selectedTeachers,
    };

    try {
      if (isEditing && editingId) {
        await axios.put(`${BASE_URL}/admin/subjects/${editingId}`, subject);
      } else {
        await axios.post(`${BASE_URL}/admin/subjects`, subject);
      }
      clearForm();
      fetchSubjects();
    } catch (err) {
      console.error("Error saving subject", err);
    }
  };

  const clearForm = () => {
    setSelectedDepartment("");
    setSelectedCourseId("");
    setSelectedYear(null);
    setSelectedSemester(null);
    setSubjectName("");
    setSelectedTeachers([]);
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (subj: Subject) => {
    setSelectedDepartment(subj.department);
    setSelectedCourseId(subj.course);
    setSelectedYear(subj.year);
    setSelectedSemester(subj.semester);
    setSubjectName(subj.subjectName);
    setSelectedTeachers(subj.teacherIds);
    setEditingId(subj._id || null);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${BASE_URL}/admin/subjects/${id}`);
      setSubjects(subjects.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Error deleting subject", err);
    }
  };

  const getSelectedCourse = courses.find((c) => c._id === selectedCourseId);
  const availableYears = getSelectedCourse
    ? Array.from({ length: getSelectedCourse.duration }, (_, i) => i + 1)
    : [];
  const availableSemesters = getSelectedCourse
    ? Array.from({ length: getSelectedCourse.semesters }, (_, i) => i + 1)
    : [];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{isEditing ? "Edit Subject" : "Add Subject"}</Text>

      {/* Department Picker */}
      <Text>Department</Text>
      <Picker
        selectedValue={selectedDepartment}
        onValueChange={(val) => setSelectedDepartment(val)}
        style={styles.picker}
      >
        <Picker.Item label="Select Department" value="" />
        {departments.map((dept) => (
          <Picker.Item key={dept._id} label={dept.name} value={dept.name} />
        ))}
      </Picker>

      {/* Course Picker */}
      <Text>Course</Text>
      <Picker
        selectedValue={selectedCourseId}
        onValueChange={(val) => setSelectedCourseId(val)}
        style={styles.picker}
      >
        <Picker.Item label="Select Course" value="" />
        {courses.map((course) => (
          <Picker.Item key={course._id} label={course.courseName} value={course._id} />
        ))}
      </Picker>

      
      {selectedCourseId && (
        <>
          <Text>Year</Text>
          <Picker
            selectedValue={selectedYear}
            onValueChange={(val) => setSelectedYear(val)}
            style={styles.picker}
          >
            {availableYears.map((year) => (
              <Picker.Item key={year} label={`Year ${year}`} value={year} />
            ))}
          </Picker>

          
          <Text>Semester</Text>
          <Picker
            selectedValue={selectedSemester}
            onValueChange={(val) => setSelectedSemester(val)}
            style={styles.picker}
          >
            {availableSemesters.map((sem) => (
              <Picker.Item key={sem} label={`Semester ${sem}`} value={sem} />
            ))}
          </Picker>
        </>
      )}

      {/* Subject Name */}
      <Text>Subject Name</Text>
      <TextInput
        value={subjectName}
        onChangeText={setSubjectName}
        style={styles.input}
        placeholder="Enter Subject Name"
      />

      {/* Teacher MultiSelect */}
      <Text>Assign Teachers</Text>
      <MultiSelect
        items={teachers.map((t) => ({ id: t._id, name: t.name }))}
        uniqueKey="id"
        onSelectedItemsChange={setSelectedTeachers}
        selectedItems={selectedTeachers}
        selectText="Pick Teachers"
        searchInputPlaceholderText="Search Teachers..."
        tagRemoveIconColor="#CCC"
        tagBorderColor="#CCC"
        tagTextColor="#000"
        selectedItemTextColor="#000"
        selectedItemIconColor="#000"
        itemTextColor="#000"
        displayKey="name"
        searchInputStyle={{ color: "#000" }}
        styleMainWrapper={styles.multiSelect}
      />

      {/* Submit Button */}
      <TouchableOpacity onPress={handleAddOrUpdate} style={styles.button}>
        <Text style={styles.buttonText}>{isEditing ? "Update" : "Add"}</Text>
      </TouchableOpacity>

      {/* Subjects List */}
      <Text style={styles.subtitle}>Subjects Added</Text>
      <FlatList
        data={subjects}
        keyExtractor={(item) => item._id || ""}
        renderItem={({ item }) => (
          <View style={styles.subjectItem}>
            <Text>{item.subjectName}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleEdit(item)}>
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item._id!)}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 18, marginTop: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 },
  picker: { height: 50, borderWidth: 1, marginBottom: 10 },
  button: { backgroundColor: "blue", padding: 10, borderRadius: 5, marginTop: 10 },
  buttonText: { color: "white", textAlign: "center", fontWeight: "bold" },
  multiSelect: { marginBottom: 10 },
  subjectItem: { padding: 10, borderBottomWidth: 1, flexDirection: "row", justifyContent: "space-between" },
  actions: { flexDirection: "row", gap: 15 },
  editText: { color: "orange" },
  deleteText: { color: "red" },
});

export default SubjectManagement;
