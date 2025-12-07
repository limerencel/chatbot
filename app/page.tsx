import React, { Suspense } from "react";
import Chat from "../components/Chat";
import Sidebar from "../components/Sidebar";

function Page() {
  return (
    <div className="bg-white dark:bg-gray-950">
      <div className="min-h-screen mx-auto flex justify-center items-center w-full">
        <Suspense fallback={<div className="w-64" />}>
          <Sidebar />
        </Suspense>
        <Suspense fallback={<div className="flex-1" />}>
          <Chat />
        </Suspense>
      </div>
    </div>
  );
}

export default Page;
