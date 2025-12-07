"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, Plus, Moon, Sun, Settings, Trash2, LogIn } from "lucide-react";
import Conversaion from "./ui/Conversaion";
import { ChatSession, getChats, clearChats } from "../utils/storage";
import { useTheme } from "next-themes";
import MenuWindow, { MenuItem } from "./ui/MenuWindow";
import { useModal } from "./ModalProvider";

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [conversations, setConversations] = useState<ChatSession[]>([]);
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  // Get openLogin from the modal context
  const { openLogin } = useModal();

  const toggleSidebar = () => setIsExpanded(!isExpanded);

  // Dynamic menu items based on current theme
  const menuItems: MenuItem[] = [
    {
      id: "theme",
      label: resolvedTheme === "dark" ? "Light Mode" : "Dark Mode",
      icon: resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />,
      action: () => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
      },
    },
    {
      id: "clear",
      label: "Clear Chats",
      icon: <Trash2 size={18} />,
      action: () => {
        if (confirm("Are you sure you want to clear all chats?")) {
          clearChats();
          setConversations([]);
          setIsMenuOpen(false);
        }
      },
      dividerAfter: true,
    },
    {
      id: "login",
      label: "Login",
      icon: <LogIn size={18} />,
      action: () => {
        openLogin();  // <-- THIS IS IT! Just call openLogin()
        setIsMenuOpen(false);
      },
    },
  ];

  useEffect(() => {
    setMounted(true);
    setConversations(getChats());

    const handleStorageUpdate = () => {
      setConversations(getChats());
    };
    window.addEventListener("storage", handleStorageUpdate);
    window.addEventListener("chat-updated", handleStorageUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageUpdate);
      window.removeEventListener("chat-updated", handleStorageUpdate);
    };
  }, []);

  // close menu window when clicked outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`
        h-screen border-r
        transition-all duration-300 ease-in-out
        flex flex-col 
        ${isExpanded ? "w-64" : "w-20"} 
        bg-card border-border
      `}
    >
      {/* --- 1. Top Section --- */}
      <div className="p-4 flex flex-col gap-4 items-center">
        <button
          onClick={() => { toggleSidebar(); setIsMenuOpen(false); }}
          className="p-2 cursor-pointer rounded-lg hover:bg-accent transition-colors self-start text-muted-foreground"
        >
          <Menu size={20} />
        </button>

        <Link
          href="/"
          className={`
            flex items-center p-2 rounded-lg transition-all shadow-sm w-full 
            bg-secondary hover:bg-accent
          `}
        >
          <Plus size={20} className="shrink-0 text-foreground" />

          <span
            className={`
              whitespace-nowrap overflow-hidden transition-all duration-300 ml-1 text-foreground
              ${isExpanded ? "w-auto opacity-100" : "w-0 opacity-0"}
            `}
          >
            New Chat
          </span>
        </Link>
      </div>

      {/* --- 2. Chat List --- */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-2 scrollbar-hide">
        {conversations.map((chat) => (
          <Conversaion
            id={chat.id}
            key={chat.id}
            expand={isExpanded}
            title={chat.title}
          />
        ))}
      </div>

      {/* --- 3. Menu --- */}
      {isExpanded && (
        <div className="mb-4 mx-3" ref={wrapperRef}>
          {isMenuOpen && (
            <MenuWindow
              items={menuItems}
              title="Menu"
              onClose={() => setIsMenuOpen(false)}
            />
          )}
          <button
            className="flex items-center justify-center w-full p-2 rounded-lg 
              hover:bg-accent transition-colors
              text-muted-foreground cursor-pointer gap-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Settings size={20} />
            {isExpanded && <span>Settings</span>}
          </button>
        </div>
      )}
    </div>
  );
}
