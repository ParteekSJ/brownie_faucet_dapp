import React from "react";

function InstallMetamask() {
  return (
    <div className="flex items-center justify-center h-full">
      <a
        className="bg-gray-800 hover:bg-gray-700 border-b-4 border-black hover:border-gray-800 text-white text-center py-2 px-4 rounded"
        rel="noreferrer"
        href="https://metamask.io/download"
        target="_blank"
      >
        Install Metamask
      </a>
    </div>
  );
}

export default InstallMetamask;
