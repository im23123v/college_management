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
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Subject {
  identifier: string,
  _id?: string;
  course: string;
  year: number;
  semester: number;
  subjectName: string;
  teacherIds: string[];
}

interface Course {
  _id: string;
  name: string;
  duration: number; // in years
  semesters: number; // total number of semesters
}

interface Teacher {
  _id: string;
  name: string;
}

const SubjectManagement = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedYear, setSelectedYear] = useState(1);
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [subjectName, setSubjectName] = useState("");
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
    fetchTeachers();
  }, []);

  const fetchCourses = async () => {
    const res = await axios.get("http://localhost:5000/api/courses");
    setCourses(res.data);
  };

  const fetchTeachers = async () => {
    const res = await axios.get("http://localhost:5000/api/teachers");
    setTeachers(res.data);
  };

  const handleAddOrUpdate = async () => {
    const identifier = await AsyncStorage.getItem('email')
    const subject: Subject = {
      identifier: identifier || '',
      course: selectedCourseId,
      year: selectedYear,
      semester: selectedSemester,
      subjectName,
      teacherIds: selectedTeachers,
    };

    if (isEditing && editingId) {
      await axios.put(`http://localhost:5000/api/subjects/${editingId}`, subject);
      setIsEditing(false);
      setEditingId(null);
    } else {
      await axios.post("http://localhost:5000/api/subjects", subject);
    }

    clearForm();
    // Optional: fetch subjects again if needed later
  };

  const clearForm = () => {
    setSelectedCourseId("");
    setSelectedYear(1);
    setSelectedSemester(1);
    setSubjectName("");
    setSelectedTeachers([]);
  };

  const handleEdit = (subject: Subject) => {
    setSelectedCourseId(subject.course);
    setSelectedYear(subject.year);
    setSelectedSemester(subject.semester);
    setSubjectName(subject.subjectName);
    setSelectedTeachers(subject.teacherIds);
    setEditingId(subject._id || null);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    await axios.delete(`http://localhost:5000/api/subjects/${id}`);
    setSubjects(subjects.filter((s) => s._id !== id));
  };

  const getSelectedCourse = courses.find((c) => c._id === selectedCourseId);
  const availableYears = getSelectedCourse ? Array.from({ length: getSelectedCourse.duration }, (_, i) => i + 1) : [];
  const availableSemesters = getSelectedCourse ? Array.from({ length: getSelectedCourse.semesters }, (_, i) => i + 1) : [];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{isEditing ? "Edit Subject" : "Add Subject"}</Text>

      <Text>Course</Text>
      <Picker
        selectedValue={selectedCourseId}
        onValueChange={(itemValue) => setSelectedCourseId(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select Course" value="" />
        {courses.map((course) => (
          <Picker.Item key={course._id} label={course.name} value={course._id} />
        ))}
      </Picker>

      {selectedCourseId && (
        <>
          <Text>Year</Text>
          <Picker
            selectedValue={selectedYear}
            onValueChange={(itemValue) => setSelectedYear(itemValue)}
            style={styles.picker}
          >
            {availableYears.map((year) => (
              <Picker.Item key={year} label={`Year ${year}`} value={year} />
            ))}
          </Picker>

          <Text>Semester</Text>
          <Picker
            selectedValue={selectedSemester}
            onValueChange={(itemValue) => setSelectedSemester(itemValue)}
            style={styles.picker}
          >
            {availableSemesters.map((sem) => (
              <Picker.Item key={sem} label={`Semester ${sem}`} value={sem} />
            ))}
          </Picker>
        </>
      )}

      <Text>Subject Name</Text>
      <TextInput
        value={subjectName}
        onChangeText={setSubjectName}
        style={styles.input}
        placeholder="Enter Subject Name"
      />

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

      <TouchableOpacity onPress={handleAddOrUpdate} style={styles.button}>
        <Text style={styles.buttonText}>{isEditing ? "Update" : "Add"}</Text>
      </TouchableOpacity>

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
