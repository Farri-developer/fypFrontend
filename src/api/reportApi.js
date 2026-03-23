const BASE_URL = "http://192.168.100.7:5000/api";





// GET QUESTION REPORT
export const getQuestionReport = async (qid) => {
  try {
    const response = await fetch(`${BASE_URL}/report/qus_rep_admin/${qid}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch report");
    }


    return data;
  } catch (error) {
    console.error("Error fetching question report:", error);
    throw error;
  }
};




// GET all sessions for a student

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