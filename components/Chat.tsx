"use client";
import { useState, useRef, useMemo, useEffect } from "react";
import { useChat } from "@ai-sdk/react"; // or "ai/react" depending on your install
import { DefaultChatTransport, UIMessage } from "ai";
import { motion } from "motion/react";
import { getChatById, SaveChat } from "../utils/storage";
import { useSearchParams } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import MarkdownRenderer from "./ui/MarkdownRenderer";
import { useAuth } from "./ModalProvider";

export default function Chat() {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [selectedModel, setSelectedModel] = useState("deepseek-chat");

  // Get auth state from context
  const { isAuthenticated, isLoading, openLogin } = useAuth();

  // memoize transport so it's recreated only when selectedModel changes
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: {
          model: selectedModel,
        },
      }),
    [selectedModel]
  );

  const searchParams = useSearchParams();
  const urlId = searchParams.get("id");
  // Use ID, if not, generate a new one
  const idToUse = useMemo(() => {
    return urlId || crypto.randomUUID();
  }, [urlId]);

  // useChat will automatically merge current chat history into the request body when sending
  //! messgaes contains all chat history
  const { messages, sendMessage, setMessages, status, error } = useChat({
    transport,
    id: idToUse,
    messages: [],
    onFinish: ({ messages }) => {
      SaveChat(idToUse, messages);
      if (!urlId) {
        window.history.replaceState(null, "", `?id=${idToUse}`);
      }
    },
  });

  useEffect(() => {
    const loadedChat = getChatById(idToUse);
    if (loadedChat) {
      setMessages(loadedChat?.messages);
    }
  }, [idToUse, setMessages]);

  return (
    <motion.div layout className="w-full pt-8 md:pt-6 h-screen flex justify-center relative bg-background text-foreground">
      <div
        className="flex flex-col max-w-[800px] w-full px-3 h-full"
      >
        {/* Top spacer - pushes hello to center */}
        {messages.length === 0 && <div className="flex-1" />}

        {/* Hello message - centered */}
        {messages.length === 0 && (
          <div className="flex justify-center items-center py-4">
            <span className="text-2xl md:text-3xl text-foreground text-center">
              Hello, anything I can help with?
            </span>
          </div>
        )}
        {/* Messages */}
        {messages.length > 0 && (
          <div className="flex-1 w-full px-4 mb-2 mt-8 relative overflow-y-auto scrollbar-hide">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-2 flex w-full ${message.role === "user" ? "justify-end" : "justify-start"
                  }`}
              >
                {/* Message */}
                <div
                  className={`max-w-full w-fit wrap-break-word px-4 py-2.5 text-base leading-7 ${message.role === "user"
                    ? "bg-secondary text-secondary-foreground rounded-full"
                    : "bg-transparent px-0 text-foreground"
                    }`}
                >
                  {message.parts.map((part, index) =>
                    part.type === "text" ? (
                      <MarkdownRenderer key={index} content={part.text} />
                    ) : null
                  )}
                </div>
              </div>
            ))}
            {/* Loading */}
            {status === "submitted" && (
              <div className="w-full flex items-center">
                <LoaderCircle size={30} className="justify-start animate-spin" />
              </div>
            )}
            {(!messages || error) && <span>Something went wrong</span>}
          </div>
        )}

        {/* Bottom spacer - matches top spacer for vertical centering */}
        {messages.length === 0 && <div className="flex-1" />}

        {/* Input area */}
        <div
          className={`w-full mb-4 md:mb-6 rounded-3xl border border-border bg-card md:p-3 p-2 shadow-md focus-within:shadow-lg transition-all duration-200 ease-in-out`}
        >
          <form
            className="w-full flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const trimmed = input.trim();
              const options = { body: { model: selectedModel } };
              if (!trimmed) return;
              sendMessage({ text: trimmed }, options);
              setInput("");
              textareaRef.current?.focus();
            }}
          >
            <textarea
              ref={textareaRef}
              value={input}
              rows={1}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  const form = e.currentTarget.form;
                  form?.requestSubmit();
                }
              }}
              onClick={() => !isAuthenticated && openLogin()}
              className="w-full field-sizing-content max-h-[120px] resize-none bg-transparent p-2 text-base text-foreground placeholder-muted-foreground focus:outline-none"
              placeholder={isAuthenticated ? "Feel free to ask anything" : "🔒 Click here to login first..."}
              disabled={status !== "ready" || !isAuthenticated}
              readOnly={!isAuthenticated}
            />

            <button
              type="submit"
              className="flex cursor-pointer h-10 w-10 ml-auto shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
              disabled={!input.trim() || status !== "ready" || !isAuthenticated}
            >
              {status === "submitted" ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 11L12 6L17 11M12 18V7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
