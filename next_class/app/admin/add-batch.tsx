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
  fromDate: Date | null;
  toDate: Date | null;
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
  const [showPicker, setShowPicker] = useState<{
    yearIndex: number;
    semIndex: number;
    field: 'from' | 'to';
  } | null>(null);
  const [mainDatePicker, setMainDatePicker] = useState<'from' | 'to' | null>(null);

  const [hasSemester, setHasSemester] = useState(false);
  const [semestersPerYear, setSemestersPerYear] = useState(1);
  const [semesterData, setSemesterData] = useState<SemesterGroup[]>([]);

  const calculateYears = () => {
    if (!fromDate || !toDate) return 0;
    const start = new Date(fromDate);
    const end = new Date(toDate);
    return end.getFullYear() - start.getFullYear() + 1;
  };

  const generateSemesterStructure = (years: number, semPerYear: number) => {
    const totalSemesters = semPerYear * years;
    let semesterCounter = 1;
    const newData: SemesterGroup[] = [];

    for (let year = 1; year <= years; year++) {
      const semesters = [];
      for (let s = 0; s < semPerYear; s++) {
        semesters.push({
          semester: semesterCounter++,
          from: null,
          to: null,
        });
      }
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

  const updateSemesterDate = (
    yearIndex: number,
    semIndex: number,
    field: 'from' | 'to',
    value: Date
  ) => {
    const updated = [...semesterData];
    updated[yearIndex].semesters[semIndex][field] = value;
    setSemesterData(updated);
    setShowPicker(null);
  };

  const handleMainDateChange = (date: Date | undefined) => {
    if (!date) {
      setMainDatePicker(null);
      return;
    }

    if (mainDatePicker === 'from') {
      setFromDate(date);
    } else if (mainDatePicker === 'to') {
      setToDate(date);
    }

    setMainDatePicker(null);
  };


   const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);

  const handleSaveBatch = () => {
    if (!course || !department || !fromDate || !toDate) {
      alert('Please fill all required fields.');
      return;
    }

    const newBatch: Batch = {
      id: selectedBatchId ?? Date.now().toString(),
      course,
      department,
      fromDate,
      toDate,
      hasSemester,
      semestersPerYear,
      semesterData,
    };

    if (selectedBatchId) {
      setBatches((prev) =>
        prev.map((b) => (b.id === selectedBatchId ? newBatch : b))
      );
      alert('Batch updated successfully!');
    } else {
      setBatches((prev) => [...prev, newBatch]);
      alert('Batch created successfully!');
    }

    // Reset form
    setCourse('');
    setDepartment('');
    setFromDate(null);
    setToDate(null);
    setHasSemester(false);
    setSemestersPerYear(1);
    setSemesterData([]);
    setSelectedBatchId(null);
  };

  const handleEditBatch = (batch: Batch) => {
    setSelectedBatchId(batch.id);
    setCourse(batch.course);
    setDepartment(batch.department);
    setFromDate(batch.fromDate);
    setToDate(batch.toDate);
    setHasSemester(batch.hasSemester);
    setSemestersPerYear(batch.semestersPerYear);
    setSemesterData(batch.semesterData);
  };

  const handleDeleteBatch = (id: string) => {
    setBatches((prev) => prev.filter((b) => b.id !== id));
    alert('Batch deleted successfully!');
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Course</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Course"
        value={course}
        onChangeText={setCourse}
      />

      <Text style={styles.label}>Department</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Department"
        value={department}
        onChangeText={setDepartment}
      />

      <Text style={styles.label}>From Date</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setMainDatePicker('from')}
      >
        <Text style={styles.dateText}>
          {fromDate ? fromDate.toDateString() : 'Select From Date'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.label}>To Date</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setMainDatePicker('to')}
      >
        <Text style={styles.dateText}>
          {toDate ? toDate.toDateString() : 'Select To Date'}
        </Text>
      </TouchableOpacity>

      {mainDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) =>
            handleMainDateChange(selectedDate || new Date())
          }
        />
      )}

      <View style={[styles.row, { marginTop: 16 }]}>
        <Text style={styles.label}>Has Semester?</Text>
        <Switch
          value={hasSemester}
          onValueChange={(value) => {
            setHasSemester(value);
          }}
        />
      </View>

      {hasSemester && (
        <>
          <Text style={styles.label}>Semesters Per Year</Text>
          <Picker
            selectedValue={semestersPerYear}
            onValueChange={(value) => setSemestersPerYear(value)}
          >
            {semesterOptions.map((num) => (
              <Picker.Item label={`${num}`} value={num} key={num} />
            ))}
          </Picker>

          {semesterData.map((yearGroup, yearIndex) => (
            <View key={yearIndex}>
              <Text style={[styles.label, { fontSize: 18 }]}>
                Year {yearGroup.year}
              </Text>

              {yearGroup.semesters.map((sem, semIndex) => (
                <View key={semIndex} style={styles.semesterContainer}>
                  <Text style={styles.semesterTitle}>
                    Semester {sem.semester}
                  </Text>

                  <Text>Start Date</Text>
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() =>
                      setShowPicker({ yearIndex, semIndex, field: 'from' })
                    }
                  >
                    <Text style={styles.dateText}>
                      {sem.from ? sem.from.toDateString() : 'Select Start Date'}
                    </Text>
                  </TouchableOpacity>

                  <Text>End Date</Text>
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() =>
                      setShowPicker({ yearIndex, semIndex, field: 'to' })
                    }
                  >
                    <Text style={styles.dateText}>
                      {sem.to ? sem.to.toDateString() : 'Select End Date'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ))}


          
        </>
      )}

      {showPicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            if (!selectedDate) {
              setShowPicker(null);
              return;
            }

            updateSemesterDate(
              showPicker.yearIndex,
              showPicker.semIndex,
              showPicker.field,
              selectedDate
            );
          }}
        />
      )}

       <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSaveBatch}
      >
        <Text style={styles.saveButtonText}>
          {selectedBatchId ? 'Update Batch' : 'Create Batch'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.label}>Saved Batches</Text>
      {batches.map((batch) => (
        <View key={batch.id} style={styles.listItemRow}>
          <View>
            <Text style={styles.batchTitle}>{batch.course}</Text>
            <Text style={styles.batchSubtitle}>{batch.department}</Text>
            <Text style={styles.batchSubtitle}>
              {batch.fromDate?.toDateString()} - {batch.toDate?.toDateString()}
            </Text>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.editBtn]}
              onPress={() => handleEditBatch(batch)}
            >
              <Text style={styles.btnText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.deleteBtn]}
              onPress={() => handleDeleteBatch(batch.id)}
            >
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
    paddingBottom: 60,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  semesterContainer: {
    padding: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#ccc',
  },
  semesterTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 8,
  },
  dateButton: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 6,
    marginVertical: 4,
  },
  dateText: {
    color: '#333',
  },
   saveButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    padding: 12,
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
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9f9f9',
    marginVertical: 5,
    borderRadius: 6,
  },
  batchTitle: {
    fontWeight: '600',
    fontSize: 16,
  },
  batchSubtitle: {
    fontSize: 12,
    color: '#555',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editBtn: {
    backgroundColor: '#007bff',
  },
  deleteBtn: {
    backgroundColor: '#dc3545',
  },
  btnText: {
    color: '#fff',
    fontWeight: '500',
  },
});
