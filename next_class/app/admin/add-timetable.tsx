import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { fetchDepartments, fetchUsersByRole } from '../api';

interface Slot {
  startTime: string;
  endTime: string;
  type: 'class' | 'break' | 'lunch';
  subjectId?: string;
  teacherId?: string;
}

interface DaySchedule {
  day: string;
  slots: Slot[];
}

interface Department {
  _id: string;
  name: string;
}

interface Course {
  _id: string;
  courseName: string;
}

interface Subject {
  _id: string;
  subjectName: string;
}

interface Teacher {
  _id: string;
  name: string;
}

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function TimeTableForm() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const [formData, setFormData] = useState({
    collegeCode: '',
    departmentId: '',
    courseId: '',
    batchId: '',
    year: 1,
    semester: 1,
    schedule: days.map(day => ({ day, slots: [] as Slot[] }))
  });

  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [timeField, setTimeField] = useState<'startTime' | 'endTime'>('startTime');
  const API_URL="http://localhost:5000";

  useEffect(() => {
    axios.get<Department[]>(`${API_URL}/api/departments`).then(res => setDepartments(res.data));
    axios.get<Teacher[]>(`${API_URL}/admin/users?role=teacher`).then(res => setTeachers(res.data));
  }, []);

   useEffect(() => {
       const loadDepartments = async () => {
         const data = await fetchDepartments();
         setDepartments(data);
         
       };
   
       loadDepartments();
     }, []);


      useEffect(() => {
    const loadTeachers = async () => {
      const data = await fetchUsersByRole('teacher');
      setTeachers(data);
    };

    loadTeachers();
  }, []);
  

  // Fetch courses when department changes
  useEffect(() => {
    if (formData.departmentId) {
      axios.get<Course[]>(`/admin/courses?departmentId=${formData.departmentId}`)
        .then(res => setCourses(res.data));
    } else {
      setCourses([]);
    }
  }, [formData.departmentId]);

  // Fetch subjects when course/year/semester changes
  useEffect(() => {
    if (formData.courseId && formData.year && formData.semester) {
      axios.get<Subject[]>(`/admin/subjects?courseId=${formData.courseId}&year=${formData.year}&semester=${formData.semester}`)
        .then(res => setSubjects(res.data));
    } else {
      setSubjects([]);
    }
  }, [formData.courseId, formData.year, formData.semester]);

const handleAddSlot = (dayIndex: number) => {
  const newSchedule = [...formData.schedule];
  const newSlot: Slot = {
    startTime: '',
    endTime: '',
    type: 'class', // ✅ literal value, matches union type
    subjectId: '',
    teacherId: ''
  };
  newSchedule[dayIndex].slots.push(newSlot);
  setFormData({ ...formData, schedule: newSchedule });
};


  const handleSlotChange = <K extends keyof Slot>(
    dayIndex: number,
    slotIndex: number,
    field: K,
    value: Slot[K]
  ) => {
    setFormData(prev => {
      const newSchedule = [...prev.schedule];
      const newSlots = [...newSchedule[dayIndex].slots];
      newSlots[slotIndex] = { ...newSlots[slotIndex], [field]: value };
      newSchedule[dayIndex] = { ...newSchedule[dayIndex], slots: newSlots };
      return { ...prev, schedule: newSchedule };
    });
  };

  const handleTimeConfirm = (date: Date) => {
    if (selectedDayIndex !== null && selectedSlotIndex !== null) {
      handleSlotChange(
        selectedDayIndex,
        selectedSlotIndex,
        timeField,
        date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
    }
    setTimePickerVisible(false);
  };

  const handleSubmit = async () => {
    try {
      await axios.post('/api/timetable', formData);
      Alert.alert('Success', 'Timetable saved!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save timetable');
    }
  };

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Create Timetable</Text>

      {/* Department Picker */}
      <Picker
        selectedValue={formData.departmentId}
        onValueChange={(value) => setFormData({ ...formData, departmentId: value })}
      >
        <Picker.Item label="Select Department" value="" />
        {departments.map(d => <Picker.Item key={d._id} label={d.name} value={d._id} />)}
      </Picker>

      {/* Course Picker */}
      <Picker
        selectedValue={formData.courseId}
        onValueChange={(value) => setFormData({ ...formData, courseId: value })}
      >
        <Picker.Item label="Select Course" value="" />
        {courses.map(c => <Picker.Item key={c._id} label={c.courseName} value={c._id} />)}
      </Picker>

      {/* Year & Semester */}
      <Picker
        selectedValue={formData.year}
        onValueChange={(value) => setFormData({ ...formData, year: value })}
      >
        {[1, 2, 3, 4].map(y => <Picker.Item key={y} label={`Year ${y}`} value={y} />)}
      </Picker>

      <Picker
        selectedValue={formData.semester}
        onValueChange={(value) => setFormData({ ...formData, semester: value })}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <Picker.Item key={s} label={`Semester ${s}`} value={s} />)}
      </Picker>

      {formData.schedule.map((day, di) => (
        <View key={day.day} style={{ marginVertical: 12, borderBottomWidth: 1, borderColor: '#ccc', paddingBottom: 8 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{day.day}</Text>
          {day.slots.map((slot, si) => (
            <View key={si} style={{ marginTop: 8, padding: 8, backgroundColor: '#f9f9f9', borderRadius: 5 }}>
              <TouchableOpacity onPress={() => { setSelectedDayIndex(di); setSelectedSlotIndex(si); setTimeField('startTime'); setTimePickerVisible(true); }}>
                <Text>Start Time: {slot.startTime || 'Select'}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => { setSelectedDayIndex(di); setSelectedSlotIndex(si); setTimeField('endTime'); setTimePickerVisible(true); }}>
                <Text>End Time: {slot.endTime || 'Select'}</Text>
              </TouchableOpacity>

              <Picker
                selectedValue={slot.type}
                onValueChange={(value) => handleSlotChange(di, si, 'type', value)}
              >
                <Picker.Item label="Class" value="class" />
                <Picker.Item label="Break" value="break" />
                <Picker.Item label="Lunch" value="lunch" />
              </Picker>

              {slot.type === 'class' && (
                <>
                  <Picker
                    selectedValue={slot.subjectId}
                    onValueChange={(value) => handleSlotChange(di, si, 'subjectId', value)}
                  >
                    <Picker.Item label="Select Subject" value="" />
                    {subjects.map(s => <Picker.Item key={s._id} label={s.subjectName} value={s._id} />)}
                  </Picker>

                  <Picker
                    selectedValue={slot.teacherId}
                    onValueChange={(value) => handleSlotChange(di, si, 'teacherId', value)}
                  >
                    <Picker.Item label="Select Teacher" value="" />
                    {teachers.map(t => <Picker.Item key={t._id} label={t.name} value={t._id} />)}
                  </Picker>
                </>
              )}
            </View>
          ))}
          <Button title="+ Add Slot" onPress={() => handleAddSlot(di)} />
        </View>
      ))}

      <Button title="Save Timetable" onPress={handleSubmit} />

      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleTimeConfirm}
        onCancel={() => setTimePickerVisible(false)}
      />
    </ScrollView>
  );
}
