// api/authApi.js

const BASE_URL = 'http://192.168.100.7:5000/api';


export const loginUser = async (username, password) => {
  try {
    const response = await fetch(`${BASE_URL}/admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        users: username,
        passwords: password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    return data;
  } catch (error) {
    throw error;
  }
};
