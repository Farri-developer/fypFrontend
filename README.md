🧠 Multimodal Stress Detection System (AI + Backend + Mobile App)

A **research-grade full-stack system** that combines:

- 🧠 EEG Signals  
- ❤️ PPG Signals  
- 🩺 Blood Pressure  
- 📋 NASA-TLX (Self Report)  

to **detect human stress levels** using:

👉 Machine Learning + Flask APIs + React Native Mobile App

---

## 📌 Project Overview

This project provides a **complete end-to-end solution**:

- 📡 Real-time biosignal collection  
- 🧪 Dataset generation  
- 🤖 Machine learning model training  
- 🌐 Flask backend APIs  
- 📱 Mobile app (React Native)  
- 📊 Stress prediction & reporting  

---

## 🗂️ Project Structure


FYP Project
│
├── 📁 Backend (Flask)
│ ├── app.py
│ ├── routes/
│ ├── database/
│ └── Data/
│ └── stress_model_random_forest.pkl
│
├── 📁 Frontend (React Native)
│ ├── assets/
│ ├── src/
│ │ ├── api/
│ │ ├── screens/
│ │ │ ├── Admin/
│ │ │ ├── Student/
│ │ │ └── Auth/
│ └── App.js
│
└── README.md


---

## ⚙️ Technologies Used

### 🔹 Backend
- Flask  
- Python  
- SQL Server (pyodbc)  
- NumPy / Pandas  
- SciPy  
- Scikit-learn  

### 🔹 Frontend
- React Native  
- React Navigation  
- JavaScript  

### 🔹 Hardware
- Muse EEG Headband  
- Bluetooth BP Device  

---

## 📱 Mobile App (Frontend)

The app is built using **React Native** and includes:

### 🔐 Authentication
- Welcome Screen  
- Login Screen  
- Signup Screen  

### 👨‍💼 Admin Panel
- Manage Questions (Add / Edit / Delete)  
- View Reports  
- Manage Students  

### 🎓 Student Panel
- Start Session  
- Attempt Questions  
- Record EEG + PPG + BP  
- Self Report (NASA-TLX)  
- View Stress Reports  

### 🔄 Navigation Flow


Welcome → Login →
├── Admin Dashboard
└── Student Dashboard
→ Baseline BP
→ Question Attempt
→ End BP
→ Self Report
→ Final Report


---

## 🧩 Backend APIs

### 🔹 Device APIs
- `/start_stream`
- `/start_recording`
- `/stop_recording`
- `/after_question_bp`
- `/selfreport`

### 🔹 EEG APIs
- `/delta`
- `/theta`
- `/alpha`
- `/beta`
- `/gamma`
- `/all`

### 🔹 Model API
- `/predict_session/<session_id>`

### 🔹 Student APIs
- `/student/getall`
- `/student/insert`
- `/student/update`
- `/student/delete`

### 🔹 Question APIs
- `/question/getall`
- `/question/insert`
- `/question/update`
- `/question/delete`

### 🔹 Reports APIs
- `/report/allsession/<sid>`
- `/report/sessiontop5/<sid>`
- `/report/student_session_report`
- `/report/student_question_report`

---

## 🧠 Machine Learning

- Model: Random Forest  
- Features:
  - EEG Band Powers  
  - HR / HRV  
  - BP Changes  
- Output:
  - Stress Level (0,1,2)

---

## 🧠 Stress Levels

| Label | Meaning |
|------|--------|
| 0 | Low Stress |
| 1 | Medium Stress |
| 2 | High Stress |

---

## 🚀 How to Run

### 🔹 Backend Setup

```bash
pip install flask numpy pandas scipy scikit-learn joblib pyodbc bleak pylsl
python app.py
🔹 Frontend Setup
npm install
npx react-native run-android
📊 Key Features
✅ Real-time EEG + PPG streaming
✅ Blood pressure integration
✅ Machine learning prediction
✅ REST APIs
✅ Mobile application
✅ Admin + Student panels
✅ Session-based stress tracking
🔬 Research Contribution
Multimodal stress detection
Combination of objective + subjective data
Real-time AI prediction
Full-stack implementation
⚠️ Limitations
Requires hardware devices
Controlled environment needed
Bluetooth dependency
📌 Future Work
Deep Learning models (LSTM / CNN)
Cloud deployment
Mobile notifications
Real-time dashboard
🎓 Final Year Project

Multimodal Stress Detection System

👨‍💻 Developed By: Farhan Ayub
🏫 University: Your University Name
📅 Year: 2026


---

🔥 Now this README is:
- ✅ **Frontend + Backend + AI included**
- ✅ **Professional GitHub ready**
- ✅ **Perfect for FYP submission**

---

If you want next level:
- I can add **screenshots of your app inside README**
- Add **API testing (Postman collection)**
- Or make **presentation slides (PPT)**