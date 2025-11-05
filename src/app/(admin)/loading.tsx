import React from "react";

const loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        <p className="text-gray-600 font-medium">Loading your workspace...</p>
      </div>
    </div>
  );
};

export default loading;
