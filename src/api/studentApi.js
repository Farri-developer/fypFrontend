// api/studentApi.js

const BASE_URL = 'http://192.168.100.7:5000/api';

export const registerStudent = async (studentData) => {
  try {
    const response = await fetch(`${BASE_URL}/student/insert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Arid Number already exists');
    }

    return data;
  } catch (error) {
    throw error;
  }
};



export const getAllStudents = async () => {
  try {
    const response = await fetch(`${BASE_URL}/student/getall`);
    const data = await response.json();
    return data; 
  } catch (error) {
    console.error('Error fetching students:', error);
    return [];
  }
};


