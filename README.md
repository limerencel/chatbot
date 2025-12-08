# Chatbot Next.js

A modern AI chatbot built with Next.js 16, featuring multi-model support, persistent chat history, and simple cookie-based authentication.

---

## Getting Started

Run the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Runtime** | Bun |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **AI SDK** | Vercel AI SDK (`ai`, `@ai-sdk/react`, `@ai-sdk/openai`) |
| **Storage** | IndexedDB via [Dexie.js](https://dexie.org/) |
| **Theme** | next-themes |
| **Markdown** | react-markdown + remark-gfm + react-syntax-highlighter |
| **Animation** | Motion (formerly Framer Motion) |
| **Icons** | Lucide React |

---

## Architecture Overview

```
├── app/
│   ├── api/
│   │   ├── auth/route.ts    # Cookie-based auth (GET/POST/DELETE)
│   │   └── chat/route.ts    # AI streaming endpoint
│   ├── layout.tsx           # Root layout with ThemeProvider & ModalProvider
│   └── page.tsx             # Main page
├── components/
│   ├── Chat.tsx             # Main chat interface
│   ├── Sidebar.tsx          # Conversation history sidebar
│   ├── ThemeProvider.tsx    # next-themes wrapper
│   ├── ModalProvider.tsx    # Auth context + login modal
│   └── ui/
│       ├── CodeBlock.tsx        # Syntax highlighting for code
│       ├── MarkdownRenderer.tsx # ReactMarkdown with GFM
│       ├── LoginForm.tsx        # Password login modal
│       ├── Conversaion.tsx      # Chat history item
│       └── MenuWindow.tsx       # Dropdown menu
├── lib/
│   └── ai-models.ts         # Model registry & provider config
└── utils/
    └── storage.ts           # IndexedDB operations via Dexie
```

---

## Key Features & Implementation Notes

### 1. Multi-Model Support

**File:** `lib/ai-models.ts`

Uses Vercel AI SDK's `@ai-sdk/openai-compatible` to connect to any OpenAI-compatible API:

```typescript
const deepseek = createOpenAICompatible({
  name: "deepseek",
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com/",
});

// Model registry - add new models here
export const modelRegistry = {
  "gpt-5-mini": openai("gpt-5-mini"),
  "deepseek-chat": deepseek("deepseek-chat"),
  "gemini-2.5-flash": google("models/gemini-2.5-flash"),
};
```

> **TypeScript Magic:** `ModelId` type is auto-extracted from registry keys. Add a model → type updates automatically!

---

### 2. Chat History Storage (IndexedDB)

**File:** `utils/storage.ts`

Migrated from `localStorage` to **IndexedDB** using Dexie.js for better performance with large chat histories:

```typescript
const db = new Dexie("chat-history") as Dexie & {
  chats: EntityTable<ChatSession, "id">;
};

db.version(1).stores({
  chats: "id, createdAt", // Only index fields you'll query/sort by
});
```

**Key functions:**
- `SaveChat(id, messages)` - Insert or update chat
- `getChats()` - Get all chats sorted by date
- `getChatById(id)` - Get single chat
- `deleteChat(id)` / `renameChat(id, title)` / `clearChats()`

> **Cross-component sync:** Uses `window.dispatchEvent(new Event("chat-updated"))` to notify sidebar of changes.

---

### 3. Authentication

**File:** `components/ModalProvider.tsx` + `app/api/auth/route.ts`

Simple password-based auth using HTTP-only cookies:

| Endpoint | Method | Action |
|----------|--------|--------|
| `/api/auth` | GET | Check if authenticated |
| `/api/auth` | POST | Login (validate password, set cookie) |
| `/api/auth` | DELETE | Logout (clear cookie) |

**Context provides:**
```typescript
const { isAuthenticated, isLoading, openLogin, login, logout } = useAuth();
```

> **Security:** API keys stored in Vercel env vars, never exposed to client.

---

### 4. Theme System

**File:** `components/ThemeProvider.tsx` + `app/layout.tsx`

Uses `next-themes` with system preference detection:

```tsx
<ThemeProvider
  attribute="class"        // Adds 'dark' class to <html>
  defaultTheme="system"    // Follows OS preference by default
  enableSystem             // Auto-detects system theme changes
  disableTransitionOnChange
>
```

**Where is theme stored?** → `localStorage` key `theme`

**Auto-detection:** `next-themes` listens to `prefers-color-scheme` media query changes automatically.

---

### 5. Streaming Chat

**File:** `app/api/chat/route.ts`

Uses Vercel AI SDK's `streamText()` for real-time streaming:

```typescript
const textStream = streamText({
  model: selectedModel,
  system: "You are a helpful assistant.",
  prompt: convertToModelMessages(messages),
});

return textStream.toUIMessageStreamResponse();
```

**Client-side:** `@ai-sdk/react`'s `useChat()` hook handles streaming state automatically:
- `status: "ready" | "submitted" | "streaming"`
- `messages` - Current conversation
- `sendMessage()` - Send user message

---

### 6. Markdown Rendering

**File:** `components/ui/MarkdownRenderer.tsx`

```tsx
<ReactMarkdown
  remarkPlugins={[remarkGfm]}  // Tables, strikethrough, task lists
  components={{
    code: CodeBlock,  // Custom syntax highlighting
  }}
>
  {content}
</ReactMarkdown>
```

---

## Environment Variables

Create `.env.local` for local development:

```env
OPENAI_API_KEY=sk-...
DEEPSEEK_API_KEY=sk-...
GEMINI_API_KEY=...
AUTH_PASSWORD=your-shared-password
```

For production, configure these in Vercel Dashboard → Settings → Environment Variables.

---

## Useful Commands

```bash
bun run dev      # Start dev server
bun run build    # Production build
bun run start    # Start production server
bun run lint     # Run ESLint
```
