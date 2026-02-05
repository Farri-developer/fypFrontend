// api/Question api
const BASE_URL = 'http://192.168.100.7:5000/api';


export const getAllQuestions = async () => {
  try {
    const response = await fetch(`${BASE_URL}/question/getall`);
    const data = await response.json();
    return data; 
  } catch (error) {
    console.error('Error fetching questions:', error);
    return [];
  }
};



export const deleteQuestion = async (qid) => {
  try {
    const response = await fetch(`${BASE_URL}/question/delete/${qid}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Delete failed');
    }

    return data;
  } catch (error) {
    throw error;
  }
};