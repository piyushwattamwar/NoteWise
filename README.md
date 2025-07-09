# 📝 NoteWise — Smart AI-Powered Note Taking App

**NoteWise** is a full-stack MERN (MongoDB, Express, React, Node.js) application that allows users to take, manage, and organize notes with added **AI-powered features** like title suggestion, category classification, summarization, and test creation with MCQs.

> 🚀 **Live Demo**: https://notewise-frontend.onrender.com/
> 🔐 Admin: Register/Login to access notes and AI features.

---

## 📌 Features

- ✅ **User Authentication** (JWT-based register & login)
- 📝 **Create, Edit, Delete Notes**
- ⭐ **Pin Notes**
- 📂 **Categorize Notes** (Work, Personal, Ideas, etc.)
- 📊 **User Profile Dashboard** (note stats, test performance)
- 🤖 **AI-Powered Tools**:
  - Suggest short and meaningful titles
  - Auto-categorize notes
  - Summarize long notes
  - Generate MCQ tests from notes
- 🧠 **Take a Test**:
  - Select notes to generate a quiz
  - MCQ questions with score calculation
  - Test history saved in profile
- 📈 **Charts & Insights**:
  - Pie chart for note categories
  - Bar chart for daily note activity
  - Test score trends
- 🌓 **Dark Mode**
- 💡 **Responsive Design** (Mobile & Desktop)

---

## 🛠️ Tech Stack

### Frontend:
- `React.js` + `Vite`
- `Tailwind CSS` + `Recharts` for charts
- `React Router DOM`, `Axios`, `Toast`
- `Dark mode` support

### Backend:
- `Node.js` + `Express.js`
- `MongoDB` with `Mongoose`
- `JWT Authentication`
- `CORS`, `dotenv`, `bcryptjs`

### AI Integration:
- [`Cohere`](https://cohere.com/) for:
  - Generating meaningful titles
  - Generating MCQs
- [`Hugging Face`](https://huggingface.co/) for:
  - Summarization (`facebook/bart-large-cnn`)
  - Categorization (`facebook/bart-large-mnli`)

---

## ⚙️ Setup Locally

### 1. Clone the repo
```bash
git clone https://github.com/your-username/notewise.git
cd notewise
