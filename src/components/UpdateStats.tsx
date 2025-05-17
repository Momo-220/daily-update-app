"use client";

import { UpdateStats as UpdateStatsType } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, Hash, Calendar, TrendingUp, Activity } from "lucide-react";

interface UpdateStatsProps {
  stats: UpdateStatsType;
}

export function UpdateStats({ stats }: UpdateStatsProps) {
  const { total, byDay, frequentWords } = stats;

  // Formatage des dates pour l'affichage
  const formattedDayStats = Object.entries(byDay).map(([date, count]) => ({
    date,
    count,
  })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Calculer le max pour les barres de stats
  const maxCount = formattedDayStats.reduce((max, day) => Math.max(max, day.count), 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border border-gray-200 hover:shadow-md transition-all duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span>Total Updates</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 text-transparent bg-clip-text">
                {total}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                total contributions
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 hover:shadow-md transition-all duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              <span>Most Active Day</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {formattedDayStats.length > 0 ? (
              <div className="flex flex-col">
                <div className="text-2xl font-semibold">
                  {formattedDayStats[0].date.split('-').reverse().join('/')}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {formattedDayStats[0].count} update{formattedDayStats[0].count > 1 ? 's' : ''}
                </div>
              </div>
            ) : (
              <div className="text-gray-500">No data yet</div>
            )}
          </CardContent>
        </Card>
      </div>

      {formattedDayStats.length > 0 && (
        <Card className="border border-gray-200 hover:shadow-md transition-all duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-blue-500" />
              <span>Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {formattedDayStats.slice(0, 5).map((day) => (
                <div key={day.date} className="flex items-center gap-2">
                  <div className="w-24 text-sm text-gray-500">
                    {day.date.split('-').reverse().join('/')}
                  </div>
                  <div className="flex-1 h-7 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                      style={{ width: `${(day.count / maxCount) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-sm font-medium w-6 text-right">{day.count}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border border-gray-200 hover:shadow-md transition-all duration-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Hash className="h-4 w-4 text-blue-500" />
            <span>Most Used Words</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {frequentWords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {frequentWords.map((word) => (
                <div
                  key={word.word}
                  className="flex items-center bg-gradient-to-r from-blue-50 to-cyan-50 rounded-full px-3 py-1.5 border border-blue-100"
                >
                  <Hash className="h-3 w-3 text-blue-500 mr-1" />
                  <span className="text-sm font-medium text-gray-700">
                    {word.word} <span className="text-blue-500">{word.count}</span>
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500">No data yet</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 