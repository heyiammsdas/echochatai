# EchoChat AI

EchoChat AI is a full-stack AI chat application built with Next.js, TypeScript, Tailwind CSS, shadcn/ui, Better Auth, Prisma, PostgreSQL, AI SDK, and OpenRouter.

## Current Features

- **User Authentication:** Email/password signup, login, and logout via Better Auth.
- **Protected Chat Interface:** Dark, modern chat UI requiring user authentication.
- **Responsive Sidebar:** Sidebar navigation for conversations.
- **Conversation Management:**
  - Create new conversations.
  - Automatically title conversations based on the first user message.
  - Group conversations by "Today" and "Yesterday".
  - Click to select and seamlessly load full conversation history.
  - Rename conversation titles.
  - Delete conversations.
  - Case-insensitive search by conversation title.
- **Data Persistence:** User and assistant messages persistently stored in PostgreSQL.
- **AI Streaming:** Real-time streaming AI responses using Vercel AI SDK.
- **Model Selection:** Integrated OpenRouter model selection.
  - Default model: `openrouter/free`
  - Selectable curated models:
    - `liquid/lfm-2.5-2.6b:free`
    - `nvidia/nemotron-3.5-lightning:free`
    - `cohere/north-mini-code:free`
  - Selected models are actively sent with each chat request and stored permanently with generated assistant messages.
- **Security:** Strict authentication and conversation ownership checks for all creation, rename, and deletion queries.

## Tech Stack

| Technology | Purpose |
| --- | --- |
| Next.js | Full-stack React framework |
| TypeScript | Type safety |
| React | UI |
| Tailwind CSS | Styling |
| shadcn/ui | UI components |
| Better Auth | Authentication |
| Prisma | ORM |
| PostgreSQL | Database |
| AI SDK | AI streaming and chat |
| OpenRouter | AI model provider |
| Docker | Local PostgreSQL environment |

## Architecture

**Chat Request Flow:**
```text
User
  ↓
Next.js / React UI
  ↓
AI SDK
  ↓
Next.js API Routes
  ↓
OpenRouter
  ↓
Selected AI Model
```

**Chat History Flow:**
```text
User
  ↓
Next.js API
  ↓
Prisma
  ↓
PostgreSQL
```

## Conversation Flow

1. **New Chat:** User starts a new chat.
2. **First Message:** User sends their first message.
3. **Creation:** A new conversation is generated.
4. **Auto-Titling:** The first user message is truncated and dynamically applied as the conversation title.
5. **Persistence:** The user's message is saved to the database.
6. **Generation:** The selected OpenRouter model generates the assistant response.
7. **Streaming:** The response actively streams to the React UI.
8. **Logging:** The completed assistant response and selected model ID are securely saved to PostgreSQL.

## Conversation Management

Users can:
- **Create** a new chat using the sidebar button.
- **Load** existing conversation histories by clicking threads in the sidebar.
- **Rename** existing conversation titles inline through the options menu.
- **Delete** conversations (cascading message deletion) using the options menu.
- **Search** through active conversations by title directly from the sidebar.

**Security:** All conversation mutations definitively verify that the authenticated user owns the accessed conversation before executing the requested action.

## Model Selection

Users can explicitly determine the OpenRouter AI model driving their conversation through the composer's model selector.

- **Default Model:** `openrouter/free` (Automatically selects an available free model)
- **Included Verified Models:**
  - `liquid/lfm-2.5-2.6b:free`
  - `nvidia/nemotron-3.5-lightning:free`
  - `cohere/north-mini-code:free`

The chosen model is successfully dispatched with the chat request payload, verified server-side via an internal allowlist, and explicitly cataloged with the resulting assistant message in the database.

## Database

The main Prisma models backing EchoChat AI are:
- `User`
- `Session`
- `Account`
- `Verification`
- `Conversation`
- `Message`

**Core Relationships:**
```text
User
 └── Conversation
       └── Message
```
A conversation inherently belongs to a strictly defined `User`. Messages specifically belong to a `Conversation`.

## API Routes

### Authentication
`/api/auth/[...all]`
Handled internally by Better Auth to manage credentials and sessions.

### Conversations
`GET  /api/conversations` — Retrieves all conversations belonging to the authenticated user.
`POST /api/conversations` — Creates a new, blank conversation.

### Individual Conversation
`GET    /api/conversations/[conversationId]` — Retrieves a specific conversation object.
`PATCH  /api/conversations/[conversationId]` — Modifies properties of a conversation (e.g. rename).
`DELETE /api/conversations/[conversationId]` — Deletes a conversation from the database.

### Messages
`GET  /api/conversations/[conversationId]/messages` — Retrieves a conversation including ordered message history.
`POST /api/conversations/[conversationId]/messages` — Saves a user message to the specified conversation database model.

### AI Chat
`POST /api/chat`
Ingests user payloads, verifies model selection, communicates with OpenRouter, handles streaming responses, and records the final AI response to the database.

## Environment Variables

The following `.env` configuration is required (never commit real secrets to Git):

```env
DATABASE_URL=
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=
OPENROUTER_API_KEY=
```

## Local Development

1. **Install Dependencies:**
```bash
npm install
```

2. **Environment Configuration:**
Start PostgreSQL (via Docker or local system), then accurately configure your `.env` parameters.

3. **Database Schema Setup:**
Generate the Prisma Client mapping:
```bash
npx prisma generate
```
Apply migrations to prepare your local database schema:
```bash
npx prisma migrate dev
```

4. **Launch Application:**
Start the Next.js development server:
```bash
npm run dev
```
The application will run locally on: [http://localhost:3000](http://localhost:3000)

## Project Structure

A concise structural overview of the EchoChat repository:

```text
app/
├── api/
│   ├── auth/
│   ├── chat/
│   └── conversations/
│
components/
└── chat/
    └── EchoChatApp.tsx
│
lib/
├── auth.ts
├── auth-client.ts
└── db.ts
│
prisma/
└── schema.prisma
```
