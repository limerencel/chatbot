import { UIMessage } from "ai";

export type ChatSession = {
  id: string;
  title: string;
  messages: UIMessage[];
  createdAt: number;
};

export const SaveChat = (id: string, messages: UIMessage[]) => {
  // check if code is running in browser
  if (typeof window === undefined) return;
  const chatArr = getMessageArr(messages);
  const chats = getChats();
  const title = chatArr[0] || "New Chat";

  const updatedChat: ChatSession = {
    id, // message updated, id remains still
    title, // title doesn't need changing
    messages, // new messages array contain both new and old messages
    createdAt: Date.now(),
  };
  const existingIndex = chats.findIndex((c) => c.id === id);
  if (existingIndex > -1) {
    chats[existingIndex] = updatedChat;
  } else {
    chats.unshift(updatedChat);
  }

  localStorage.setItem("chat-history", JSON.stringify(chats));

  // custom event listener to notify the rest of the app that data changed
  window.dispatchEvent(new Event("chat-updated"));
};

export const getChats = (): ChatSession[] => {
  if (typeof window === undefined) return [];
  const stored = localStorage.getItem("chat-history");
  return stored ? JSON.parse(stored) : [];
};

export const getChatById = (id: string) => {
  const chats = getChats();
  return chats.find((c) => c.id === id);
};

// get raw message text array in [user, ai, user, ai...] format
export const getMessageArr = (messages: UIMessage[]): string[] => {
  return messages.map((message) =>
    message.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("")
  );
};

export const deleteChat = (id: string) => {
  if (typeof window === undefined) return;
  const chats = getChats();
  const newChats = chats.filter((c) => c.id !== id);

  localStorage.setItem("chat-history", JSON.stringify(newChats));
  window.dispatchEvent(new Event("chat-updated"));
};

export const renameChat = (id: string, newTitle: string) => {
  if (typeof window === undefined) return;
  const chats = getChats();
  const chatIndex = chats.findIndex((c) => c.id === id);
  if (chatIndex > -1) {
    // update title
    chats[chatIndex].title = newTitle;
  }
  localStorage.setItem("chat-history", JSON.stringify(chats));
  // trigger update
  window.dispatchEvent(new Event("chat-updated"));
};

export const clearChats = () => {
  if (typeof window === undefined) return;
  localStorage.removeItem("chat-history");
  window.dispatchEvent(new Event("chat-updated"));
};
