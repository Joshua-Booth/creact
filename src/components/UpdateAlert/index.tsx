import React, { useState } from "react";
import { useMainStore } from "@/stores/mainStore";

export default function UpdateAlert() {
  const [showUpdateAlert, setShowUpdateAlert] = useState(false);
  const clearError = useMainStore((state) => state.clearError);

  const handleRefresh = () => {
    clearError();
    window.location.reload();
  };

  const handleDismiss = () => {
    setShowUpdateAlert(false);
  };

  return (
    <>
      {showUpdateAlert && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md">
            <h2 className="text-lg font-bold mb-4">New Version Available</h2>
            <p className="mb-4">
              A new version of the app is available. Would you like to refresh?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Refresh Now
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
