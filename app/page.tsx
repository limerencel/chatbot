import React from "react";
import Chat from "../components/Chat";
import Sidebar from "../components/Sidebar";

function page() {
  return (
    <div className="bg-white dark:bg-gray-950">
      <div className="min-h-screen mx-auto flex justify-center items-center w-full">
        <Sidebar />
        <Chat />
      </div>
    </div>
  );
}

export default page;
