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
});
