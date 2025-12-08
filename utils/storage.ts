import { UIMessage } from "ai";
import Dexie, { type EntityTable } from "dexie";

export type ChatSession = {
  id: string;
  title: string;
  messages: UIMessage[];
  createdAt: number;
};

// Create a typed Dexie database - TypeScript now knows about db.chats!
const db = new Dexie("chat-history") as Dexie & {
  chats: EntityTable<ChatSession, "id">;
};

// Define schema - 'id' is the primary key (no ++, since you provide id)
db.version(1).stores({
  chats: "id, createdAt", // Only index fields you'll query/sort by
});

export const SaveChat = async (id: string, messages: UIMessage[]) => {
  if (typeof window === "undefined") return;

  const chatArr = getMessageArr(messages);
  const title = chatArr[0] || "New Chat";

  const updatedChat: ChatSession = {
    id,
    title,
    messages,
    createdAt: Date.now(),
  };

  // put() will insert or update based on primary key
  await db.chats.put(updatedChat);
  window.dispatchEvent(new Event("chat-updated"));
};

export const getChats = async (): Promise<ChatSession[]> => {
  if (typeof window === "undefined") return [];
  return await db.chats.orderBy("createdAt").reverse().toArray();
};

export const getChatById = async (
  id: string
): Promise<ChatSession | undefined> => {
  if (typeof window === "undefined") return undefined;
  return await db.chats.get(id);
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

export const deleteChat = async (id: string) => {
  if (typeof window === "undefined") return;
  await db.chats.delete(id);
  window.dispatchEvent(new Event("chat-updated"));
};

export const renameChat = async (id: string, newTitle: string) => {
  if (typeof window === "undefined") return;
  await db.chats.update(id, { title: newTitle });
  window.dispatchEvent(new Event("chat-updated"));
};

export const clearChats = async () => {
  if (typeof window === "undefined") return;
  await db.chats.clear();
  window.dispatchEvent(new Event("chat-updated"));
};
