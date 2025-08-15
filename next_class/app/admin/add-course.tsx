import { View, TextInput, Button, StyleSheet, Text, Alert, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { fetchCourses } from '../api'
interface Department {
  _id: string;
  name: string;
}

interface Course {
  _id: string;
  courseName: string;
  description: string;
  departmentId: string;
}

export default function AddCourse() {
  const [courseName, setCourseName] = useState('');
  const [description, setDescription] = useState('');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [existingCourses, setExistingCourses] = useState<string[]>([]);

 const API_BASE = "http://localhost:5000"

  
  useEffect(() => {
    fetch(`${API_BASE}/admin/departments`)
      .then(res => res.json())
      .then(data => setDepartments(data))
      .catch(err => console.error('Error fetching departments:', err));
  }, []);

  // Fetch all courses
   useEffect(() => {
    const loadCourses = async () => {
      const data = await fetchCourses();
      setCourses(data);
      
    };

    loadCourses();
  }, []);
  const handleDeptChange = (deptId: string) => {
    setSelectedDept(deptId);
    checkDepartment(deptId);
  };

  const checkDepartment = async (deptId: string) => {
    try {
      const res = await fetch(`${API_BASE}/admin/courses/by-department/${deptId}`);
      const data = await res.json();
      if (data.length > 0) {
        setExistingCourses(data.map((course: any) => course.courseName));
      } else {
        setExistingCourses([]);
      }
    } catch (error) {
      console.error('Error checking department:', error);
    }
  };

  const handleSubmit = async () => {
    const identifier = await AsyncStorage.getItem('email')
    const courseData = {
      identifier,
      courseName,
      description,
      departmentId: selectedDept,
    };

    const url = editingId
      ? `${API_BASE}/admin/courses/${editingId}`
      : `${API_BASE}/admin/courses`;
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData),
      });

      const data = await res.json();

      Alert.alert('Success', editingId ? 'Course updated!' : 'Course added!');
      setCourseName('');
      setDescription('');
      setSelectedDept('');
      setEditingId(null);
      setExistingCourses([]);
      fetchCourses();
    } catch (err) {
      console.error('Error saving course:', err);
    }
  };

  const handleEdit = (course: Course) => {
    setEditingId(course._id);
    setCourseName(course.courseName);
    setDescription(course.description);
    setSelectedDept(course.departmentId);
    checkDepartment(course.departmentId);
  };

  const handleDelete = async (id: string) => {
    Alert.alert('Confirm', 'Are you sure you want to delete this course?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            await fetch(`${API_BASE}/admin/courses/${id}`, {
              method: 'DELETE',
            });
            Alert.alert('Deleted', 'Course deleted successfully!');
            fetchCourses();
          } catch (err) {
            console.error('Error deleting course:', err);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>{editingId ? 'Edit Course' : 'Add Course'}</Text>

      <Text>Course Name</Text>
      <TextInput style={styles.input} value={courseName} onChangeText={setCourseName} />

      <Text>Description</Text>
      <TextInput style={styles.input} value={description} onChangeText={setDescription} />

      <Text>Select Department</Text>
      <Picker
        selectedValue={selectedDept}
        onValueChange={handleDeptChange}
        style={styles.picker}
      >
        <Picker.Item label="Select Department" value="" />
        {departments.map(dept => (
          <Picker.Item key={dept._id} label={dept.name} value={dept._id} />
        ))}
      </Picker>

      {existingCourses.length > 0 && (
        <Text style={styles.warningText}>
          This department already has courses: {existingCourses.join(', ')}
        </Text>
      )}

      <Button title={editingId ? 'Update Course' : 'Add Course'} onPress={handleSubmit} />

      <Text style={styles.subHeader}>Existing Courses</Text>
      {courses.map(course => (
        <View key={course._id} style={styles.courseItem}>
          <Text style={styles.courseText}>{course.courseName}</Text>
          <View style={styles.btnRow}>
            <Button title="Edit" onPress={() => handleEdit(course)} />
            <View style={{ width: 10 }} />
            <Button title="Delete" color="red" onPress={() => handleDelete(course._id)} />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  picker: {
    height: 50,
    marginBottom: 15,
  },
  warningText: {
    color: 'red',
    marginBottom: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  subHeader: {
    marginTop: 25,
    fontSize: 18,
    fontWeight: 'bold',
  },
  courseItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  courseText: {
    fontSize: 16,
    marginBottom: 5,
  },
  btnRow: {
    flexDirection: 'row',
  },
});
