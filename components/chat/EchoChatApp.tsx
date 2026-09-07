"use client";

import { useState, useEffect, useRef} from "react";
import { useChat } from "@ai-sdk/react" ;
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Code2,
  FileText,
  GraduationCap,
  Lightbulb,
  LogOut,
  MessageSquare,
  Paperclip,
  Plus,
  Search,
  Send,
  Settings2,
  Sparkles,
  Globe,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

type EchoChatAppProps = {
  user: {
    name: string;
    email: string;
  };
};


const suggestions = [
  {
    icon: Lightbulb,
    label: "Create",
  },
  {
    icon: FileText,
    label: "Explore",
  },
  {
    icon: Code2,
    label: "Code",
  },
  {
    icon: GraduationCap,
    label: "Learn",
  },
];

const exampleQuestions = [
  "How does AI work?",
  "Are black holes real?",
  'How many Rs are in the word "strawberry"?',
  "What is the meaning of life?",
];

type Conversation = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};
const yesterdayDate = new Date(
  Date.now() - 86400000
).toDateString();

export default function EchoChatApp({
  user,
}: EchoChatAppProps) {
  const router = useRouter();
const {messages: aiMessages, setMessages, sendMessage, status, error} = useChat()
const [message, setMessage] = useState("");
const [conversationId, setConversationId] = useState<string | null>(null); 



const messagesEndRef = useRef<HTMLDivElement>(null); 

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [aiMessages]);


const [sidebarOpen, setSidebarOpen] = useState(true);
const [showProfile, setShowProfile] = useState(false);
const [dbConversations, setDbConversations] = useState<Conversation[]>([]);
const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
const [editingId, setEditingId] = useState<string | null>(null);
const [editingTitle, setEditingTitle] = useState("");
const [searchQuery, setSearchQuery] = useState("");




  useEffect(() => {
  const loadConversations = async () => {
    const response = await fetch("/api/conversations");

    if (!response.ok) return;

    const data = await response.json();

    setDbConversations(data);
  };

  loadConversations();
}, []);

  useEffect(() => {
  if (!conversationId) return;

  const loadMessages = async () => {
    const response = await fetch(
      `/api/conversations/${conversationId}/messages`
    );

    if (!response.ok) return;

    const conversation = await response.json();

    setMessages(
  conversation.messages.map((msg: { id: string; role: "user" | "assistant" | "system" | "data"; content: string }) => ({
    id: msg.id,
    role: msg.role,
    content: msg.content,
    parts: [
      {
        type: "text",
        text: msg.content,
      },
    ],
  }))
);
  };

  loadMessages();
}, [conversationId, setMessages]);


  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  const handleRename = async (id: string) => {
    const trimmed = editingTitle.trim();
    if (!trimmed) {
      setEditingId(null);
      return;
    }

    const response = await fetch(`/api/conversations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: trimmed }),
    });

    if (response.ok) {
      const updated = await response.json();
      setDbConversations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, title: updated.title } : c))
      );
    }

    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this conversation?")) return;

    const response = await fetch(`/api/conversations/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setDbConversations((prev) => prev.filter((c) => c.id !== id));
      if (conversationId === id) {
        setConversationId(null);
        setMessages([]);
        setMessage("");
      }
    }
    setMenuOpenId(null);
  };

  const handleSuggestion = (text: string) => {
    setMessage(text);
  };

  const handleSend = async () => {
  if (!message.trim() || status !== "ready") return;

  let currentConversationId = conversationId;

  if (!currentConversationId) {
    const response = await fetch("/api/conversations", {
      method: "POST",
    });

    const conversation = await response.json();

    currentConversationId = conversation.id;
    setConversationId(currentConversationId);
    setDbConversations((prev) => [conversation, ...prev]);
  }

  const response = await fetch(
    `/api/conversations/${currentConversationId}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: message.trim(),
      }),
    }
  );

  if (response.ok) {
    const data = await response.json();
    if (data.updatedTitle) {
      setDbConversations((prev) =>
        prev.map((c) =>
          c.id === currentConversationId
            ? { ...c, title: data.updatedTitle }
            : c
        )
      );
    }
  }

  sendMessage({
    text: message.trim(),
  }, 
  {
    body: {
      conversationId: currentConversationId,
    },
  }


);

  setMessage("");
};

  const filteredConversations = dbConversations.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const todayChats = filteredConversations.filter(
    (chat) => new Date(chat.updatedAt).toDateString() === new Date().toDateString()
  );

  const yesterdayChats = filteredConversations.filter(
    (chat) => new Date(chat.updatedAt).toDateString() === yesterdayDate
  );

  const renderChatItem = (chat: Conversation) => {
    const isActive = conversationId === chat.id;
    const isEditing = editingId === chat.id;

    if (isEditing) {
      return (
        <div key={chat.id} className="flex w-full items-center gap-2 rounded-lg bg-white/5 px-3 py-2.5 text-sm">
          <MessageSquare size={16} className="shrink-0 text-zinc-400" />
          <input
            autoFocus
            value={editingTitle}
            onChange={(e) => setEditingTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRename(chat.id);
              if (e.key === "Escape") setEditingId(null);
            }}
            className="flex-1 bg-transparent text-zinc-100 outline-none"
          />
          <button onClick={() => handleRename(chat.id)} className="text-zinc-400 hover:text-green-400">
            ✓
          </button>
          <button onClick={() => setEditingId(null)} className="text-zinc-400 hover:text-red-400">
            ✕
          </button>
        </div>
      );
    }

    return (
      <div
        key={chat.id}
        className={`group relative flex w-full items-center rounded-lg text-sm transition ${
          isActive ? "bg-white/7 text-zinc-100" : "text-zinc-400 hover:bg-white/4 hover:text-zinc-200"
        }`}
      >
        <button
          type="button"
          onClick={() => setConversationId(chat.id)}
          className="flex flex-1 items-center gap-3 px-3 py-2.5 text-left"
        >
          <MessageSquare size={16} className="shrink-0" />
          <span className="truncate">{chat.title}</span>
        </button>

        <div className="absolute right-2 flex items-center">
          <button
            type="button"
            onClick={() => setMenuOpenId(menuOpenId === chat.id ? null : chat.id)}
            className={`p-1 text-zinc-500 hover:text-zinc-200 ${
              menuOpenId === chat.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
          >
            ···
          </button>
          {menuOpenId === chat.id && (
            <div className="absolute right-0 top-full z-50 mt-1 flex w-32 flex-col overflow-hidden rounded-lg border border-white/10 bg-[#15151c] py-1 shadow-xl">
              <button
                onClick={() => {
                  setEditingId(chat.id);
                  setEditingTitle(chat.title);
                  setMenuOpenId(null);
                }}
                className="px-3 py-1.5 text-left text-sm text-zinc-300 hover:bg-white/5 hover:text-white"
              >
                Rename
              </button>
              <button
                onClick={() => handleDelete(chat.id)}
                className="px-3 py-1.5 text-left text-sm text-red-400 hover:bg-white/5 hover:text-red-300"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <main className="flex h-screen w-full overflow-hidden bg-[#09090d] text-zinc-100">

      {/* ================= SIDEBAR ================= */}

      <aside
        className={`
          flex h-full shrink-0 flex-col
          border-r border-white/7
          bg-[#0c0c11]
          transition-all duration-300
          ${sidebarOpen ? "w-75" : "w-18"}
        `}
      >

        {/* Logo */}
        <div className="flex h-18 shrink-0 items-center justify-between px-5">

          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <div
                className="
                  flex h-9 w-9 items-center justify-center
                  rounded-xl
                  border border-violet-400/20
                  bg-violet-500/10
                  text-violet-400
                "
              >
                <MessageSquare size={20} />
              </div>

              <span className="text-xl font-semibold tracking-tight">
                EchoChat
              </span>
            </div>
          ) : (
            <div
              className="
                mx-auto flex h-9 w-9 items-center justify-center
                rounded-xl
                bg-violet-500/10
                text-violet-400
              "
            >
              <MessageSquare size={20} />
            </div>
          )}

          {sidebarOpen && (
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="
                rounded-lg p-2
                text-zinc-500
                transition
                hover:bg-white/6
                hover:text-zinc-200
              "
            >
              <ChevronLeft size={18} />
            </button>
          )}
        </div>

        {!sidebarOpen && (
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="
              mx-auto mb-4 rounded-lg p-2
              text-zinc-500
              hover:bg-white/6
              hover:text-zinc-200
            "
          >
            <ChevronRight size={18} />
          </button>
        )}

        {sidebarOpen && (
          <>
            {/* New Chat */}
            <div className="px-4">
              <button
                type="button"
                onClick={() => {
                  setMessage("");
                  setConversationId(null);
                  setMessages([]);
                }}
                className="
                  flex w-full items-center justify-center gap-2
                  rounded-xl
                  bg-violet-600
                  px-4 py-3
                  text-sm font-semibold text-white
                  shadow-lg shadow-violet-950/30
                  transition
                  hover:bg-violet-500
                "
              >
                <Plus size={18} />
                New Chat
              </button>
            </div>

            {/* Search */}
            <div className="px-4 pt-4">
              <div
                className="
                  flex items-center gap-3
                  rounded-xl
                  border border-white/7
                  bg-white/3
                  px-3 py-2.5
                  text-zinc-500
                "
              >
                <Search size={18} />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search your threads..."
                  className="flex-1 bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
                />

                <kbd
                  className="
                    rounded-md
                    border border-white/8
                    px-1.5 py-0.5
                    text-[10px]
                  "
                >
                  ⌘ K
                </kbd>
              </div>
            </div>

            {/* Chat History */}
            <div className="mt-7 flex-1 overflow-y-auto px-3">
              {filteredConversations.length === 0 && searchQuery && (
                <div className="px-4 py-4 text-center text-sm text-zinc-500">
                  No conversations found.
                </div>
              )}

              {todayChats.length > 0 && (
                <>
                  <p className="px-2 text-xs font-medium text-zinc-500">Today</p>
                  <div className="mt-3 space-y-1">
                    {todayChats.map(renderChatItem)}
                  </div>
                </>
              )}

              {yesterdayChats.length > 0 && (
                <>
                  <p className="mt-7 px-2 text-xs font-medium text-zinc-500">Yesterday</p>
                  <div className="mt-3 space-y-1">
                    {yesterdayChats.map(renderChatItem)}
                  </div>
                </>
              )}
            </div>
            {/* User */}
            <div className="relative shrink-0 border-t border-white/7 p-3">

              {showProfile && (
                <div
                  className="
                    absolute bottom-18 left-3 right-3
                    rounded-xl
                    border border-white/8
                    bg-[#15151c]
                    p-2
                    shadow-2xl
                  "
                >
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="
                      flex w-full items-center gap-3
                      rounded-lg px-3 py-2.5
                      text-sm text-zinc-300
                      transition
                      hover:bg-white/6
                    "
                  >
                    <LogOut size={17} />
                    Sign out
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowProfile(!showProfile)}
                className="
                  flex w-full items-center gap-3
                  rounded-xl p-2
                  text-left
                  transition
                  hover:bg-white/5
                "
              >
                <div
                  className="
                    flex h-10 w-10 shrink-0 items-center justify-center
                    rounded-full
                    bg-violet-600
                    text-sm font-semibold
                    text-white
                  "
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {user.name}
                  </p>

                  <p className="truncate text-xs text-zinc-500">
                    {user.email}
                  </p>
                </div>

                <ChevronDown
                  size={17}
                  className="text-zinc-500"
                />
              </button>
            </div>
          </>
        )}
      </aside>

      {/* ================= MAIN ================= */}

      <section className="relative flex min-w-0 flex-1 flex-col bg-[#0b0b10]">

        {/* Header */}
        <header className="flex h-18 shrink-0 items-center justify-end gap-2 px-6">

          <button
            type="button"
            className="
              rounded-xl
              border border-white/7
              bg-white/2.5
              p-2.5
              text-zinc-500
              transition
              hover:bg-white/6
              hover:text-zinc-200
            "
          >
            <Clock3 size={18} />
          </button>

          <button
            type="button"
            className="
              rounded-xl
              border border-white/7
              bg-white/2.5
              p-2.5
              text-zinc-500
              transition
              hover:bg-white/6
              hover:text-zinc-200
            "
          >
            <Settings2 size={18} />
          </button>
        </header>

        {/* Chat Area */}
        <div className="relative min-h-0 flex-1">
          {/* Welcome */}
          <div className="h-full overflow-y-auto px-6 pb-55">
  {aiMessages.length === 0 ? (
    /* ================= WELCOME SCREEN ================= */
    <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col items-center justify-center">

      <div className="mb-6">
        <div
          className="
            flex h-16 w-16 items-center justify-center
            rounded-2xl
            border border-violet-400/20
            bg-violet-500/10
            text-violet-400
            shadow-xl shadow-violet-950/20
          "
        >
          <Sparkles size={30} />
        </div>
      </div>

      <h1
        className="
          text-center
          text-4xl
          font-semibold
          tracking-tight
          md:text-5xl
        "
      >
        How can I help you today?
      </h1>

      <p className="mt-4 text-center text-base text-zinc-500">
        Ask anything. I&apos;m here to help.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {suggestions.map((item) => {
          const Icon = item.icon;

          return (
            <button
              type="button"
              key={item.label}
              onClick={() => handleSuggestion(item.label)}
              className="
                flex items-center gap-2
                rounded-full
                border border-white/8
                bg-white/2.5
                px-5 py-2.5
                text-sm font-medium
                text-zinc-300
                transition
                hover:border-violet-400/20
                hover:bg-violet-500/8
                hover:text-white
              "
            >
              <Icon
                size={17}
                className="text-violet-400"
              />

              {item.label}
            </button>
          );
        })}
      </div>

      <div
        className="
          mx-auto mt-8
          w-full max-w-3xl
          overflow-hidden
          rounded-2xl
          border border-white/7
          bg-white/1.5
        "
      >
        {exampleQuestions.map((question) => (
          <button
            type="button"
            key={question}
            onClick={() => handleSuggestion(question)}
            className="
              flex w-full items-center
              border-b border-white/6
              px-5 py-4
              text-left text-sm
              text-zinc-300
              transition
              last:border-b-0
              hover:bg-white/4
              hover:text-white
            "
          >
            <span className="flex-1">
              {question}
            </span>

            <ArrowRight
              size={17}
              className="text-zinc-600"
            />
          </button>
        ))}
      </div>
    </div>
  ) : (
    /* ================= MESSAGES ================= */
    <div className="mx-auto w-full max-w-3xl space-y-6 pt-8">

    {status === "submitted" && (
      <div className="text-sm text-zinc-500">
        Thinking...
      </div>
   )}

   {status === "streaming" && (
      <div className="text-sm text-zinc-500">
        Generating...
      </div>
   )}
      {aiMessages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${
            msg.role === "user"
              ? "justify-end"
              : "justify-start"
          }`}
        >
          <div
            className={`
              max-w-[80%]
              rounded-2xl
              px-5 py-3.5
              text-sm leading-7
              ${
                msg.role === "user"
                  ? "bg-violet-600 text-white"
                  : "border border-white/7 bg-white/4 text-zinc-200"
              }
            `}
          >
             {msg.parts.map((part, index) => {
                if (part.type === "text") {
                return <span key={index}>{part.text}</span>;
              }

                return null;
              })}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )}
          </div>

          {error && (
            <p className="mx-auto max-w-3xl px-6 text-sm text-red-400">
              Something went wrong. Please try again.
            </p>
          )}


          {/* Composer */}
          <div
            className="
              absolute
              bottom-0
              left-0
              right-0
              px-6
              pb-5
              pt-8
              bg-linear-to-t
              from-[#0b0b10]
              via-[#0b0b10]
              to-transparent
            "
          >
            <div className="mx-auto max-w-4xl">

              <div
                className="
                  overflow-hidden
                  rounded-2xl
                  border border-white/9
                  bg-[#15151c]
                  shadow-2xl shadow-black/40
                  transition
                  focus-within:border-violet-400/30
                "
              >
                {/* Textarea */}
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Type your message here..."
                  rows={3}
                  className="
                    w-full resize-none
                    bg-transparent
                    px-5 pt-5
                    text-sm text-zinc-100
                    outline-none
                    placeholder:text-zinc-600
                  "
                />

                {/* Composer controls */}
                <div className="flex items-center gap-2 px-4 pb-4">

                  <button
                    type="button"
                    className="
                      flex items-center gap-2
                      rounded-lg px-2 py-2
                      text-sm font-medium
                      text-violet-400
                      transition
                      hover:bg-white/5
                    "
                  >
                    <Sparkles size={16} />
                    Free Model
                    <ChevronDown size={14} />
                  </button>

                  <div className="h-5 w-px bg-white/7" />

                  <button
                    type="button"
                    className="
                      rounded-lg p-2
                      text-zinc-500
                      transition
                      hover:bg-white/5
                      hover:text-zinc-200
                    "
                  >
                    <Sparkles size={17} />
                  </button>

                  <button
                    type="button"
                    className="
                      rounded-lg p-2
                      text-zinc-500
                      transition
                      hover:bg-white/5
                      hover:text-zinc-200
                    "
                  >
                    <Globe size={17} />
                  </button>

                  <button
                    type="button"
                    className="
                      rounded-lg p-2
                      text-zinc-500
                      transition
                      hover:bg-white/5
                      hover:text-zinc-200
                    "
                  >
                    <Paperclip size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={!message.trim() || status!=="ready"}
                    className="
                      ml-auto
                      flex h-10 w-10
                      items-center justify-center
                      rounded-xl
                      bg-violet-600
                      text-white
                      transition
                      hover:bg-violet-500
                      disabled:cursor-not-allowed
                      disabled:opacity-30
                    "
                  >
                    <Send size={18} />
                  </button>

                </div>
              </div>

              <p className="mt-3 text-center text-[11px] text-zinc-600">
                EchoChat can make mistakes. Please double-check important
                information.
              </p>

            </div>
          </div>
        </div>
      </section>
    </main>
  );
}