const BASE_URL = "http://192.168.100.7:5000/api";

export const getAllSessions = async (studentId) => {

  try {

    const url = `${BASE_URL}/report/allsession/${studentId}`;

    console.log("API URL:", url);

    const response = await fetch(url);

    if (!response.ok) {
      console.log("API ERROR STATUS:", response.status);
      return [];
    }

    const data = await response.json();

    console.log("API RESPONSE:", data);

    return data;

  } catch (error) {

    console.log("API ERROR:", error);

    return [];

  }

};