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