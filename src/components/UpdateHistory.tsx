"use client";

import { Update } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";

interface UpdateHistoryProps {
  updates: Update[];
}

export function UpdateHistory({ updates }: UpdateHistoryProps) {
  if (updates.length === 0) {
    return (
      <Card className="w-full bg-white shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 text-transparent bg-clip-text">
            Update History
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-teal-500 mb-6 p-4 bg-teal-50 rounded-full">
            <Calendar className="h-12 w-12 mx-auto" />
          </div>
          <p className="text-gray-600 text-center text-lg">
            No updates yet
          </p>
          <p className="text-teal-500 text-center font-medium mt-2">
            Create your first update!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-white shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 text-transparent bg-clip-text">
          Update History
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {updates.map((update, index) => (
          <Card 
            key={update.id} 
            className={`overflow-hidden border border-gray-200 hover:border-blue-200 transition-all duration-200 hover:shadow-md ${index === 0 ? 'animate-fadeIn' : ''}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <div className="bg-blue-50 p-1.5 rounded-full mr-2">
                  <Clock className="h-3.5 w-3.5 text-blue-500" />
                </div>
                <time dateTime={update.createdAt} className="font-medium">
                  {format(new Date(update.createdAt), "PPP 'at' p", { locale: enUS })}
                </time>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {update.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}

// Ajouter cette animation dans globals.css
const styles = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-out forwards;
}
`; 