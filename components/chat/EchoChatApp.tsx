"use client";

import { useState } from "react";
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

const conversations = [
  {
    title: "Greeting",
    date: "Today",
  },
  {
    title: "React Hooks Explained",
    date: "Today",
  },
  {
    title: "Next.js Authentication",
    date: "Today",
  },
  {
    title: "PostgreSQL Relationships",
    date: "Today",
  },
  {
    title: "Docker Basics",
    date: "Yesterday",
  },
  {
    title: "Tailwind CSS Tips",
    date: "Yesterday",
  },
  {
    title: "What is TypeScript?",
    date: "Yesterday",
  },
];

export default function EchoChatApp({
  user,
}: EchoChatAppProps) {
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  const handleSuggestion = (text: string) => {
    setMessage(text);
  };

  const handleSend = () => {
    if (!message.trim()) return;

    console.log("Message:", message);

    setMessage("");
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
                onClick={() => setMessage("")}
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

                <span className="flex-1 text-sm">
                  Search your threads...
                </span>

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

              <p className="px-2 text-xs font-medium text-zinc-500">
                Today
              </p>

              <div className="mt-3 space-y-1">
                {conversations
                  .filter((chat) => chat.date === "Today")
                  .map((chat, index) => (
                    <button
                      type="button"
                      key={chat.title}
                      className={`
                        group flex w-full items-center gap-3
                        rounded-lg px-3 py-2.5
                        text-left text-sm
                        transition
                        ${
                          index === 0
                            ? "bg-white/7 text-zinc-100"
                            : "text-zinc-400 hover:bg-white/4 hover:text-zinc-200"
                        }
                      `}
                    >
                      <MessageSquare
                        size={16}
                        className="shrink-0"
                      />

                      <span className="truncate">
                        {chat.title}
                      </span>

                      {index === 0 && (
                        <span className="ml-auto text-zinc-500">
                          ···
                        </span>
                      )}
                    </button>
                  ))}
              </div>

              <p className="mt-7 px-2 text-xs font-medium text-zinc-500">
                Yesterday
              </p>

              <div className="mt-3 space-y-1">
                {conversations
                  .filter((chat) => chat.date === "Yesterday")
                  .map((chat) => (
                    <button
                      type="button"
                      key={chat.title}
                      className="
                        flex w-full items-center gap-3
                        rounded-lg px-3 py-2.5
                        text-left text-sm
                        text-zinc-400
                        transition
                        hover:bg-white/4
                        hover:text-zinc-200
                      "
                    >
                      <MessageSquare
                        size={16}
                        className="shrink-0"
                      />

                      <span className="truncate">
                        {chat.title}
                      </span>
                    </button>
                  ))}
              </div>
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
          <div
            className="
              h-full
              overflow-y-auto
              px-6
              pb-55
            "
          >
            <div
              className="
                mx-auto flex min-h-full w-full max-w-4xl
                flex-col items-center justify-center
              "
            >

              {/* EchoChat Icon */}
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

              {/* Action buttons */}
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

              {/* Questions */}
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
          </div>

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
                    disabled={!message.trim()}
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