const BASE_URL = "http://192.168.100.7:5000/api";

export const startSession = async () => {
  try {
    const response = await fetch(`${BASE_URL}/devices/start_stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) return false;

    const data = await response.json();

    return data?.status === "stream started";

  } catch (error) {
    console.log("SESSION ERROR:", error);
    return false;
  }
};


export const startBaselineBP = async () => {
  try {
    console.log("➡️ Calling BP API...");

    const response = await fetch(`${BASE_URL}/devices/start_session_bp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log("STATUS:", response.status);

    if (!response.ok) {
      console.log("❌ HTTP ERROR");
      return null;
    }

    const data = await response.json();

    console.log("✅ BP RESPONSE:", data);

    if (data?.status === "baseline captured") {
      return data; // {SYS, DIA, PULSE}
    }

    return null;

  } catch (error) {
    console.log("❌ BP ERROR:", error);
    return null;
  }
};





// 🔥 START RECORDING (NEW API)
export const startRecording = async (sid, qid) => {
  try {
    const response = await fetch(`${BASE_URL}/devices/start_recording`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sid: sid,
        qid: qid
      }),
    });

    const data = await response.json();
    console.log("RECORDING API:", data);

    if (!response.ok) return null;

    return data;

  } catch (error) {
    console.log("RECORDING ERROR:", error);
    return null;
  }
};




// 🔥 STOP RECORDING (NEW FUNCTION)
export const stopRecording = async (answer, gptindex) => {
  try {
    const response = await fetch(`${BASE_URL}/devices/stop_recording`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        answer: answer,
        gptindex: gptindex
      }),
    });

    const data = await response.json();
    console.log("🛑 STOP RECORDING:", data);

    if (!response.ok) return null;

    if (data?.status === "recording stopped") {
      return data;
    }

    return null;

  } catch (error) {
    console.log("STOP RECORDING ERROR:", error);
    return null;
  }
};



// 🔥 AFTER QUESTION BP
export const afterQuestionBP = async () => {
  try {
    const response = await fetch(`${BASE_URL}/devices/after_question_bp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    console.log("📊 AFTER QUESTION BP:", data);

    if (!response.ok) return null;

    if (data?.status === "after question saved") {
      return data;
    }

    return null;

  } catch (error) {
    console.log("AFTER BP ERROR:", error);
    return null;
  }
};


// 🔥 STOP STREAM (END SESSION)
export const stopStream = async () => {
  try {
    const response = await fetch(`${BASE_URL}/devices/stop_stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    console.log("🛑 STOP STREAM:", data);

    if (!response.ok) return null;

    if (data?.status === "stream stopped and session ended") {
      return data;
    }

    return null;

  } catch (error) {
    console.log("STOP STREAM ERROR:", error);
    return null;
  }
};


// 🔥 SELF REPORT (USER FEEDBACK)
export const submitSelfReport = async (
  MentalLoad,
  Frustration,
  Effort,
  Comment
) => {
  try {
    const response = await fetch(`${BASE_URL}/devices/selfreport`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        MentalLoad: MentalLoad,
        Frustration: Frustration,
        Effort: Effort,
        Comment: Comment
      }),
    });

    const data = await response.json();

    console.log("🧠 SELF REPORT:", data);

    if (!response.ok) return null;

    if (data?.status === "self report saved") {
      return data;
    }

    return null;

  } catch (error) {
    console.log("SELF REPORT ERROR:", error);
    return null;
  }
};