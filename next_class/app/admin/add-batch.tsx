import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Platform,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

type SemesterGroup = {
  year: number;
  semesters: {
    semester: number;
    from: Date | null;
    to: Date | null;
  }[];
};

type Batch = {
  id: string;
  course: string;
  department: string;
  fromDate: string; // backend sends date as string
  toDate: string;
  hasSemester: boolean;
  semestersPerYear: number;
  semesterData: SemesterGroup[];
};

const semesterOptions = [1, 2, 3, 4];

export default function BatchPage() {
  const [course, setCourse] = useState('');
  const [department, setDepartment] = useState('');
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [hasSemester, setHasSemester] = useState(false);
  const [semestersPerYear, setSemestersPerYear] = useState(1);
  const [semesterData, setSemesterData] = useState<SemesterGroup[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);

  const BASE_URL = 'http://localhost:5000/api/batches';

  const calculateYears = () => {
    if (!fromDate || !toDate) return 0;
    return toDate.getFullYear() - fromDate.getFullYear() + 1;
  };

  const generateSemesterStructure = (years: number, semPerYear: number) => {
    const newData: SemesterGroup[] = [];
    let semesterCounter = 1;

    for (let year = 1; year <= years; year++) {
      const semesters = Array.from({ length: semPerYear }).map(() => ({
        semester: semesterCounter++,
        from: null,
        to: null,
      }));
      newData.push({ year, semesters });
    }

    setSemesterData(newData);
  };

  const regenerateSemesters = () => {
    if (!hasSemester) return;
    const years = calculateYears();
    if (years > 0) {
      generateSemesterStructure(years, semestersPerYear);
    } else {
      setSemesterData([]);
    }
  };

  useEffect(() => {
    regenerateSemesters();
  }, [fromDate, toDate, semestersPerYear, hasSemester]);

  const fetchBatches = async () => {
    try {
      const res = await fetch(BASE_URL);
      const data = await res.json();
      setBatches(data);
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch batches');
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const updateSemesterDate = (
    yearIndex: number,
    semIndex: number,
    field: 'from' | 'to',
    value: Date
  ) => {
    const updated = semesterData.map((yearGroup, yIdx) => {
      if (yIdx !== yearIndex) return yearGroup;
      return {
        ...yearGroup,
        semesters: yearGroup.semesters.map((sem, sIdx) => {
          if (sIdx !== semIndex) return sem;
          return { ...sem, [field]: value };
        }),
      };
    });
    setSemesterData(updated);
    setShowPicker(null);
  };

  const resetForm = () => {
    setCourse('');
    setDepartment('');
    setFromDate(null);
    setToDate(null);
    setHasSemester(false);
    setSemestersPerYear(1);
    setSemesterData([]);
    setSelectedBatchId(null);
  };

  const handleSaveBatch = async () => {
    if (!course || !department || !fromDate || !toDate) {
      Alert.alert('Validation', 'Please fill all required fields.');
      return;
    }

    const newBatch = {
      course,
      department,
      fromDate,
      toDate,
      hasSemester,
      semestersPerYear,
      semesterData,
    };

    try {
      let res;
      if (selectedBatchId) {
        res = await fetch(`${BASE_URL}/${selectedBatchId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newBatch),
        });
        if (!res.ok) throw new Error('Failed to update batch');
        Alert.alert('Updated', 'Batch updated successfully!');
      } else {
        res = await fetch(BASE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newBatch),
        });
        if (!res.ok) throw new Error('Failed to create batch');
        Alert.alert('Created', 'Batch created successfully!');
      }

      fetchBatches();
      resetForm();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const handleEditBatch = (batch: Batch) => {
    setSelectedBatchId(batch.id);
    setCourse(batch.course);
    setDepartment(batch.department);
    setFromDate(new Date(batch.fromDate));
    setToDate(new Date(batch.toDate));
    setHasSemester(batch.hasSemester);
    setSemestersPerYear(batch.semestersPerYear);
    setSemesterData(batch.semesterData);
  };

  const handleDeleteBatch = async (id: string) => {
    try {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete batch');
      Alert.alert('Deleted', 'Batch deleted successfully');
      fetchBatches();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const [mainDatePicker, setMainDatePicker] = useState<'from' | 'to' | null>(null);
  const [showPicker, setShowPicker] = useState<{
    yearIndex: number;
    semIndex: number;
    field: 'from' | 'to';
  } | null>(null);

  const handleMainDateChange = (_event: any, selectedDate?: Date) => {
    if (mainDatePicker === 'from') {
      setFromDate(selectedDate || null);
    } else if (mainDatePicker === 'to') {
      setToDate(selectedDate || null);
    }
    setMainDatePicker(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Course</Text>
      <TextInput style={styles.input} value={course} onChangeText={setCourse} placeholder="Course" />

      <Text style={styles.label}>Department</Text>
      <TextInput style={styles.input} value={department} onChangeText={setDepartment} placeholder="Department" />

      <Text style={styles.label}>From Date</Text>
      <TouchableOpacity style={styles.dateButton} onPress={() => setMainDatePicker('from')}>
        <Text>{fromDate ? fromDate.toDateString() : 'Select Date'}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>To Date</Text>
      <TouchableOpacity style={styles.dateButton} onPress={() => setMainDatePicker('to')}>
        <Text>{toDate ? toDate.toDateString() : 'Select Date'}</Text>
      </TouchableOpacity>

      {mainDatePicker && (
        <DateTimePicker
          value={fromDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleMainDateChange}
        />
      )}

      <View style={styles.row}>
        <Text style={styles.label}>Has Semester?</Text>
        <Switch value={hasSemester} onValueChange={setHasSemester} />
      </View>

      {hasSemester && (
        <>
          <Text style={styles.label}>Semesters per Year</Text>
          <Picker selectedValue={semestersPerYear} onValueChange={(v) => setSemestersPerYear(v)}>
            {semesterOptions.map((s) => (
              <Picker.Item label={`${s}`} value={s} key={s} />
            ))}
          </Picker>

          {semesterData.map((group, yIdx) => (
            <View key={yIdx}>
              <Text style={styles.label}>Year {group.year}</Text>
              {group.semesters.map((sem, sIdx) => (
                <View key={sIdx} style={styles.semesterContainer}>
                  <Text>Semester {sem.semester}</Text>
                  <Text>From:</Text>
                  <TouchableOpacity onPress={() => setShowPicker({ yearIndex: yIdx, semIndex: sIdx, field: 'from' })}>
                    <Text>{sem.from ? sem.from.toDateString() : 'Select Start Date'}</Text>
                  </TouchableOpacity>
                  <Text>To:</Text>
                  <TouchableOpacity onPress={() => setShowPicker({ yearIndex: yIdx, semIndex: sIdx, field: 'to' })}>
                    <Text>{sem.to ? sem.to.toDateString() : 'Select End Date'}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ))}

          {showPicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(_, selectedDate) => {
                if (!selectedDate) return setShowPicker(null);
                updateSemesterDate(showPicker.yearIndex, showPicker.semIndex, showPicker.field, selectedDate);
              }}
            />
          )}
        </>
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveBatch}>
        <Text style={styles.saveButtonText}>{selectedBatchId ? 'Update Batch' : 'Create Batch'}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Saved Batches</Text>
      {batches.map((batch) => (
        <View key={batch.id} style={styles.listItemRow}>
          <View>
            <Text style={styles.batchTitle}>{batch.course}</Text>
            <Text>{batch.department}</Text>
            <Text>{new Date(batch.fromDate).toDateString()} - {new Date(batch.toDate).toDateString()}</Text>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={[styles.actionBtn, styles.editBtn]} onPress={() => handleEditBatch(batch)}>
              <Text style={styles.btnText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={() => handleDeleteBatch(batch.id)}>
              <Text style={styles.btnText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 80,
  },
  label: { fontWeight: 'bold', marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  dateButton: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 6,
    marginVertical: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  semesterContainer: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 6,
    marginVertical: 6,
    borderColor: '#ccc',
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 12,
    marginTop: 20,
    borderRadius: 6,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#f0f0f0',
    marginVertical: 6,
    borderRadius: 6,
  },
  batchTitle: { fontWeight: 'bold', fontSize: 16 },
  actionButtons: { flexDirection: 'row', gap: 10 },
  actionBtn: { padding: 6, borderRadius: 6 },
  editBtn: { backgroundColor: '#007bff' },
  deleteBtn: { backgroundColor: '#dc3545' },
  btnText: { color: '#fff' },
});
