import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ScrollView,
} from 'react-native';
import axios from 'axios';
import MultiSelect from 'react-native-multiple-select';

interface Subject {
  _id?: string;
  departmentId: string;
  courseId: string;
  year: number;
  semester: number;
  subjectName: string;
  teacherIds: string[];
}

export default function SubjectsPage() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [selectedDept, setSelectedDept] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadInitialData = async () => {
    const [dRes, cRes, tRes, sRes] = await Promise.all([
      axios.get('/api/departments'),
      axios.get('/api/courses'),
      axios.get('/api/users?role=teacher'),
      axios.get('/api/subjects'),
    ]);
    setDepartments(dRes.data);
    setCourses(cRes.data);
    setTeachers(tRes.data);
    setSubjects(sRes.data);
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleSubmit = async () => {
    const payload = {
      departmentId: selectedDept,
      courseId: selectedCourse,
      year: parseInt(year),
      semester: parseInt(semester),
      subjectName,
      teacherIds: selectedTeachers,
    };

    if (editingId) {
      await axios.put(`/api/subjects/${editingId}`, payload);
    } else {
      await axios.post('/api/subjects', payload);
    }

    resetForm();
    loadInitialData();
  };

  const resetForm = () => {
    setSelectedDept('');
    setSelectedCourse('');
    setYear('');
    setSemester('');
    setSubjectName('');
    setSelectedTeachers([]);
    setEditingId(null);
  };

  const handleEdit = (subject: Subject) => {
    setSelectedDept(subject.departmentId);
    setSelectedCourse(subject.courseId);
    setYear(subject.year.toString());
    setSemester(subject.semester.toString());
    setSubjectName(subject.subjectName);
    setSelectedTeachers(subject.teacherIds);
    setEditingId(subject._id || null);
  };

  const handleDelete = async (id: string) => {
    await axios.delete(`/api/subjects/${id}`);
    loadInitialData();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{editingId ? 'Update Subject' : 'Add Subject'}</Text>

      <TextInput
        placeholder="Year"
        style={styles.input}
        keyboardType="numeric"
        value={year}
        onChangeText={setYear}
      />
      <TextInput
        placeholder="Semester"
        style={styles.input}
        keyboardType="numeric"
        value={semester}
        onChangeText={setSemester}
      />
      <TextInput
        placeholder="Subject Name"
        style={styles.input}
        value={subjectName}
        onChangeText={setSubjectName}
      />

      <Text style={{ marginBottom: 5 }}>Assign Teachers</Text>
      <MultiSelect
        items={teachers.map(t => ({ id: t._id, name: t.name }))}
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
        searchInputStyle={{ color: '#000' }}
        submitButtonColor="#007AFF"
        submitButtonText="Done"
      />

      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>{editingId ? 'Update' : 'Add'} Subject</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Subjects List</Text>
      <FlatList
        data={subjects}
        keyExtractor={(item) => item._id || ''}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={{ fontWeight: 'bold' }}>{item.subjectName}</Text>
            <Text>Year: {item.year} | Semester: {item.semester}</Text>
            <Text>Teachers: {item.teacherIds.length}</Text>
            <View style={styles.row}>
              <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editBtn}>
                <Text>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item._id!)} style={styles.delBtn}>
                <Text>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 15, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginVertical: 15 },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8, marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center', marginVertical: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  card: {
    padding: 15, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, marginVertical: 8,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  editBtn: { backgroundColor: '#eef', padding: 8, borderRadius: 6 },
  delBtn: { backgroundColor: '#fee', padding: 8, borderRadius: 6 },
});