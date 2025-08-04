import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';

interface Department {
  _id: string;
  name: string;
}

export default function AddCourse() {
  const [courseName, setCourseName] = useState('');
  const [description, setDescription] = useState('');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [existingCourses, setExistingCourses] = useState<string[]>([]);
   

  useEffect(()=>{
     const d = [
    { _id: 'CSE', name: 'Computer Science' },
    { _id: 'ECE', name: 'Electronics' },
    { _id: 'ME', name: 'Mechanical' },
  ];
setDepartments(d);
  },[])
  // Fetch departments on mount
  useEffect(() => {
    fetch('http://your-backend-url/api/departments')
      .then(res => res.json())
      .then(data => setDepartments(data))
      .catch(err => console.error('Error fetching departments:', err));
  }, []);

  // Check if department is already used in any courses
  const checkDepartment = async (deptId: string) => {
    try {
      const res = await fetch(`http://your-backend-url/api/courses/by-department/${deptId}`);
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

  const handleDeptChange = (deptId: string) => {
    setSelectedDept(deptId);
    checkDepartment(deptId);
  };

  const handleAddCourse = async () => {
    const course = {
      courseName,
      description,
      departmentId: selectedDept,
    };

    try {
      const res = await fetch('http://your-backend-url/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course),
      });
      const data = await res.json();
      Alert.alert('Success', 'Course added successfully!');
      setCourseName('');
      setDescription('');
      setSelectedDept('');
      setExistingCourses([]);
    } catch (err) {
      console.error('Error adding course:', err);
    }
  };

  return (
    <View style={styles.container}>
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
           This department is already used in courses: {existingCourses.join(', ')}
        </Text>
      )}

      <Button title="Add Course" onPress={handleAddCourse} />
    </View>
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
});
