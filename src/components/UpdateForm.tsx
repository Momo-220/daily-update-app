"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { Send, AlertCircle, CheckCircle } from "lucide-react";
import { Confetti } from "./Confetti";

interface UpdateFormProps {
  onUpdateCreated?: () => void;
}

export function UpdateForm({ onUpdateCreated }: UpdateFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Hide success message after 3 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showSuccessMessage) {
      timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showSuccessMessage]);

  // Stop confetti after 2 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showConfetti) {
      timer = setTimeout(() => {
        setShowConfetti(false);
      }, 2000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showConfetti]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch("/api/updates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error: ${response.status}`);
      }
      
      setContent("");
      setShowSuccessMessage(true);
      setShowConfetti(true);
      if (onUpdateCreated) {
        onUpdateCreated();
      }
    } catch (error) {
      console.error("Error creating update:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full bg-white shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md">
      {showConfetti && <Confetti />}
      
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 text-transparent bg-clip-text">New Update</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span>{error}</span>
          </div>
        )}
        
        {showSuccessMessage && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg flex items-center animate-successFadeIn">
            <CheckCircle className="h-4 w-4 mr-2" />
            <span>Update successfully added!</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Textarea
              placeholder="What did you accomplish today?"
              className="min-h-28 resize-none border rounded-xl p-4 w-full focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isSubmitting}
            />
            {isSubmitting && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-xl">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting || !content.trim()}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-full px-6 py-2 text-white font-medium transition-all shadow-sm hover:shadow flex items-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Submit
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 