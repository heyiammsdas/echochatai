# echochatai
=======
# 💬 EchoChat AI

A modern full-stack AI chat application built with **Next.js**, **TypeScript**, **Prisma**, and **PostgreSQL**. It provides secure authentication, real-time AI conversations, persistent chat history, and a clean responsive interface.

---

## ✨ Features

- 🔐 Secure authentication with Better Auth
- 🤖 AI-powered conversations using OpenRouter API
- ⚡ Real-time streaming responses
- 📝 Markdown & code syntax highlighting
- 💾 Persistent chat history
- ✏️ Rename & delete conversations
- 📱 Responsive UI with Tailwind CSS + shadcn/ui

---

## 🛠 Tech Stack

| Category | Technologies |
|----------|--------------|
| Framework | Next.js 15 |
| Language | TypeScript |
| Styling | Tailwind CSS, shadcn/ui |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | Better Auth |
| AI | OpenRouter API, AI SDK |
| Deployment | Vercel |

---

## 📁 Project Structure

```text
echochat-ai/
│
├── app/                # App Router pages & API routes
├── components/         # Reusable UI components
├── hooks/              # Custom React hooks
├── lib/                # Utilities, AI & auth configuration
├── modules/            # Feature modules
├── prisma/             # Prisma schema & migrations
├── public/             # Static assets
│
├── components.json
├── next.config.ts
├── eslint.config.mjs
├── package.json
└── README.md
```

---

## 🚀 Installation

Clone the repository

```bash
git clone https://github.com/yourusername/echochatai.git
cd echochat-ai
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
DATABASE_URL=

BETTER_AUTH_SECRET=
BETTER_AUTH_URL=

OPENROUTER_API_KEY=
```

Generate Prisma Client

```bash
npx prisma generate
```

Push the database schema

```bash
npx prisma db push
```

Run the development server

```bash
npm run dev
```

Open **http://localhost:3000**

---

## 📸 Screenshots

I will upload it later

---

## 🌟 Future Improvements

- Multiple AI model support
- Image generation
- File uploads
- Chat export
- Conversation search

---

## 👨‍💻 Author

**Madhusudan Das**

- GitHub: https://github.com/heyiammsdas
- LinkedIn: https://linkedin.com/in/msdas7476

---

## 📄 License

This project is licensed under the MIT License.
