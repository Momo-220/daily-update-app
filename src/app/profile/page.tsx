"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";

export default function ProfilePage() {
  const [updateCount, setUpdateCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUpdateCount() {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch("/api/updates");
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const updates = await response.json();
        setUpdateCount(updates.length);
      } catch (error) {
        console.error("Error:", error);
        setError("An error occurred while loading data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchUpdateCount();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Profile</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          <span>{error}</span>
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="" alt="User" />
            <AvatarFallback className="text-xl">U</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl">User</CardTitle>
            <p className="text-sm text-gray-500">ID: 1</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">About</h3>
              <p className="text-gray-600">
                User of the Daily Updates application
              </p>
            </div>
            
            <div>
              <h3 className="font-medium">Statistics</h3>
              {isLoading ? (
                <div className="flex items-center gap-2 mt-2">
                  <div className="animate-spin h-4 w-4 border-b-2 border-gray-900 rounded-full"></div>
                  <p>Loading...</p>
                </div>
              ) : (
                <p className="text-gray-600">
                  You have published {updateCount} update{updateCount !== 1 ? 's' : ''}.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 