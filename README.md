# 🧠 SensAI – AI-Powered Career Coaching Platform

![Stack](https://img.shields.io/badge/Stack-Next.js%20%7C%20Prisma%20%7C%20NeonDB-green?style=flat-square)
![AI Powered](https://img.shields.io/badge/AI-LLM%20Integrated-purple?style=flat-square)
![Auth](https://img.shields.io/badge/Auth-Clerk-blue?style=flat-square)
![Status](https://img.shields.io/badge/Status-Active-success?style=flat-square)
![Deployment](https://img.shields.io/badge/Deployed-Vercel-orange?style=flat-square)

> **SensAI** is an AI-powered career coaching platform that delivers personalized career guidance, resume generation, cover letter creation, and interview preparation using intelligent LLM-driven workflows.

---

## 🚀 Features

### 🎯 Personalized Career Roadmap
- AI-generated career path recommendations
- Skill-gap analysis based on target role
- Actionable improvement steps

### 📄 Resume & Cover Letter Generator
- Role-specific resume generation
- Dynamic cover letter creation
- Optimized prompt pipelines for structured outputs
- Download-ready professional format

### 🎤 Interview Preparation Module
- Generates technical + behavioral questions
- Role-based interview simulations
- AI feedback suggestions for better answers

### 📊 Career Insights Dashboard
- Structured dashboard showing:
  - User goals
  - Skills
  - Target job role
  - Suggested learning path
- Clean and interactive UI

### 🔐 Secure Authentication
- User authentication & onboarding powered by **Clerk**
- Protected routes and session handling
- Secure environment variable configuration

### ⚡ Scalable Backend Architecture
- Prisma ORM for efficient database modeling
- NeonDB (PostgreSQL) for scalable cloud database
- Optimized schema design and query performance

---

## 🏗️ Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | Next.js 14 (App Router), React, Tailwind CSS, ShadCN UI |
| **Backend** | Next.js Server Actions / API Routes |
| **Database** | NeonDB (PostgreSQL) |
| **ORM** | Prisma |
| **Authentication** | Clerk |
| **AI Integration** | Gemini / LLM APIs |
| **Deployment** | Vercel |

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Sreenu-y/SensAI--AI-Career-Coach.git
cd sensai
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Setup Environment Variables

Create a `.env` file in the root directory:

```env
# Clerk Setup
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Neon Database
DATABASE_URL=your_neon_database_url

# AI API
GEMINI_API_KEY=your_gemini_api_key
```

⚠️ Never commit `.env` to GitHub.

---

### 4️⃣ Setup Prisma

```bash
npx prisma generate
npx prisma migrate dev
```

---

### 5️⃣ Run the Development Server

```bash
npm run dev
```

Open your browser and go to:

```
http://localhost:3000
```

---

## 📁 Project Structure

```bash
├── actions
│   ├── cover-letter.js
│   ├── dashboard.js
│   ├── interview.js
│   ├── resume.js
│   └── user.js
├── app
│   ├── (auth)
│   ├── (main)
│   ├── api
│   ├── lib
│   ├── globals.css
│   ├── layout.js
│   ├── not-found.jsx
│   └── page.js
├── components
├── lib
├── prisma
│   └── schema.prisma
├── public
├── styles
└── utils
```

---

---

## 📌 Future Enhancements

- 🎙 AI mock interview voice simulation
- 📈 Skill progress analytics
- 🌍 Real-time job market trend insights
- 📄 LinkedIn profile optimizer
- 🤖 AI career mentor chatbot

---

## 🤝 Contributing

Contributions are welcome!  
Feel free to fork the repository and submit a pull request.

---

## 🌐 Live Demo

🚀 Experience SensAI in action:

🔗 **Live Application:** https://sensai-ai-career-coach45.vercel.app/ 

📂 **GitHub Repository:** https://github.com/Sreenu-y/SensAI--AI-Career-Coach

---

## 👨‍💻 Author

Developed with &hearts; by **Sreenu Yelesam**  
Empowering careers using AI.
