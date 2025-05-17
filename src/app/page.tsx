"use client";

import { useEffect, useState } from "react";
import { Update } from "@/types";
import { UpdateForm } from "@/components/UpdateForm";
import { UpdateHistory } from "@/components/UpdateHistory";

export default function Home() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUpdates = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/updates");
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setUpdates(data);
    } catch (error) {
      console.error("Error fetching updates:", error);
      setError("An error occurred while loading updates");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

  return (
    <div className="space-y-6">
      <UpdateForm onUpdateCreated={fetchUpdates} />
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <UpdateHistory updates={updates} />
      )}
    </div>
  );
}
