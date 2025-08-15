
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = "http://localhost:5000"; 

export const fetchCourses = async () => {
  try {
    const collegeCode = await AsyncStorage.getItem('collegeCode'); 
    if (!collegeCode) {
      throw new Error("College code not found in storage");
    }

    const response = await fetch(`${API_BASE}/admin/courses?collegeCode=${encodeURIComponent(collegeCode)}`);
    if (!response.ok) {
      throw new Error("Failed to fetch courses");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
};



export const fetchDepartments = async () => {
  try {
    const collegeCode = await AsyncStorage.getItem('collegeCode');
    if (!collegeCode) {
      throw new Error("College code not found in storage");
    }

    const response = await fetch(`${API_BASE}/admin/departments?collegeCode=${encodeURIComponent(collegeCode)}`);
    if (!response.ok) {
      throw new Error("Failed to fetch departments");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching departments:", error);
    return [];
  }
};





export const fetchUsersByRole = async (role:string) => {
  try {
    const collegeCode = await AsyncStorage.getItem('collegeCode');
    if (!collegeCode) {
      throw new Error("College code not found in storage");
    }

    const response = await fetch(
      `${API_BASE}/admin/users?collegeCode=${encodeURIComponent(collegeCode)}&role=${encodeURIComponent(role)}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch users with role: ${role}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching users with role ${role}:`, error);
    return [];
  }
};
