import Link from "next/link";
import { MessageSquare, Menu, Check, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { deleteChat, renameChat } from "../../utils/storage";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

interface ConversationProps {
  id: string;
  expand: boolean;
  title?: string;
  onSelect?: () => void;
}

export default function Conversaion({ id, expand, title, onSelect }: ConversationProps) {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title || "");

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null); // grab the actual input html element

  const router = useRouter();
  const searchParams = useSearchParams();
  const currentChatId = searchParams.get("id");

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentChatId === id) {
      router.push("/");
    }
    deleteChat(id);
  };

  //? Reset local state if prop title changes (e.g. from a fresh load)
  useEffect(() => {
    setEditTitle(title || "");
  }, [title]);

  // handle clikc outside for the popup menu
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        console.log("Clicked outside");
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- LOGIC: Save & Cancel ---
  const handleSave = () => {
    if (!editTitle.trim()) return; // do not save empty title
    renameChat(id, editTitle); // update loaclstorage
    setIsEditing(false); // turn off input
  };
  const handleCancel = () => {
    setEditTitle(title || ""); // revert to original
    setIsEditing(false);
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (!expand) return null;
  return (
    <div className="group w-full">
      {/* EDIT MODE */}
      {isEditing ? (
        <div className="flex items-center gap-1 p-3 justify-between transition rounded-lg group-active:shadow-sm shadow-md ">
          <MessageSquare size={20} className="shrink-0" />
          <input
            type="text"
            ref={inputRef}
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave} // auto-save when clicking away
            className="flex-1 min-w-0 bg-transparent outline-none text-foreground whitespace-nowrap overflow-hidden text-ellipsis"
          />
          {/* mini action button */}
          <button
            onClick={handleSave}
            className="rouned-lg p-1 hover:bg-accent rounded cursor-pointer"
          >
            <Check size={14} />
          </button>
          <button
            onClick={handleCancel}
            className="rouned-lg p-1 hover:bg-accent rounded cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        // --- VIEW MODE ---
        <div className="flex items-center justify-between hover:bg-accent text-muted-foreground transition-colors rounded-lg group">
          <Link
            href={`/?id=${id}`}
            onClick={onSelect}
            className="flex flex-4 min-w-0 justify-start items-center gap-1 p-3 "
          >
            <MessageSquare size={20} className="shrink-0" />
            <span
              className="
            whitespace-nowrap overflow-hidden transition-all duration-200
            opacity-100 w-auto delay-100 text-ellipsis min-w-0 
            "
            >
              {editTitle}
            </span>
          </Link>
          <div className="relative" ref={wrapperRef}>
            {/* menu button */}
            <Menu
              size={20}
              className="shrink-0 mr-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={() => setOpen((v) => !v)}
            />
            {/* popup */}
            {open && (
              <div className="w-24 p-3 flex flex-col gap-2 absolute right-1 top-6 z-50 rounded-md bg-popover shadow-md border border-border">
                <button
                  className="hover:bg-accent rounded-md cursor-pointer w-full text-left px-2 py-1"
                  onClick={() => {
                    setIsEditing(true);
                    setOpen(false);
                  }}
                >
                  Rename
                </button>
                <button
                  className="hover:bg-accent rounded-md cursor-pointer w-full text-left px-2 py-1"
                  onClick={(e) => {
                    handleDelete(e);
                    setOpen(false);
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
