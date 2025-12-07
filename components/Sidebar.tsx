"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, Plus, Moon, Sun, Settings, Trash2, LogIn, LogOut, X } from "lucide-react";
import Conversaion from "./ui/Conversaion";
import { ChatSession, getChats, clearChats } from "../utils/storage";
import { useTheme } from "next-themes";
import MenuWindow, { MenuItem } from "./ui/MenuWindow";
import { useModal } from "./ModalProvider";

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [conversations, setConversations] = useState<ChatSession[]>([]);
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  // Get auth functions from context
  const { openLogin, isAuthenticated, logout } = useModal();

  const toggleSidebar = () => setIsExpanded(!isExpanded);
  const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);
  const closeMobileSidebar = () => setIsMobileOpen(false);

  // Dynamic menu items based on current theme and auth state
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
      id: "auth",
      label: isAuthenticated ? "Logout" : "Login",
      icon: isAuthenticated ? <LogOut size={18} /> : <LogIn size={18} />,
      action: () => {
        if (isAuthenticated) {
          logout();  // Already logged in → logout
        } else {
          openLogin();  // Not logged in → open login modal
        }
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

  // Sidebar content - shared between mobile and desktop
  const sidebarContent = (
    <>
      {/* --- 1. Top Section --- */}
      <div className="p-4 flex flex-col gap-4 items-center">
        {/* Desktop: expand/collapse toggle | Mobile: close button */}
        <button
          onClick={() => {
            // On mobile, close sidebar. On desktop, toggle expand.
            if (window.innerWidth < 768) {
              closeMobileSidebar();
            } else {
              toggleSidebar();
              setIsMenuOpen(false);
            }
          }}
          className="p-2 cursor-pointer rounded-lg hover:bg-accent transition-colors self-start text-muted-foreground"
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <Link
          href="/"
          onClick={closeMobileSidebar}
          className={`
            flex items-center p-2 rounded-lg transition-all shadow-sm w-full 
            bg-secondary hover:bg-accent
          `}
        >
          <Plus size={20} className="shrink-0 text-foreground" />

          <span
            className={`
              whitespace-nowrap overflow-hidden transition-all duration-300 ml-1 text-foreground
              ${isExpanded || isMobileOpen ? "w-auto opacity-100" : "w-0 opacity-0"}
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
            expand={isExpanded || isMobileOpen}
            title={chat.title}
            onSelect={closeMobileSidebar}
          />
        ))}
      </div>

      {/* --- 3. Menu --- */}
      {(isExpanded || isMobileOpen) && (
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
            <span>Settings</span>
          </button>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Mobile hamburger button - fixed position, only visible on mobile */}
      <button
        onClick={toggleMobileSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-card text-muted-foreground hover:bg-accent transition-colors"
        aria-label="Toggle menu"
      >
        <Menu size={24} />
      </button>

      {/* Mobile backdrop overlay */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Mobile sidebar - slides in from left */}
      <div
        className={`
          md:hidden fixed top-0 left-0 h-screen w-64 z-50
          transform transition-transform duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          bg-card border-r border-border flex flex-col
        `}
      >
        {sidebarContent}
      </div>

      {/* Desktop sidebar - always visible */}
      <div
        className={`
          hidden md:flex
          h-screen border-r
          transition-all duration-300 ease-in-out
          flex-col 
          ${isExpanded ? "w-64" : "w-20"} 
          bg-card border-border
        `}
      >
        {sidebarContent}
      </div>
    </>
  );
}
