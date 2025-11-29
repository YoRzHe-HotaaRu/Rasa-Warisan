import React, { useMemo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie } from 'recharts';
import { DelicacyData } from '../types';
import { Utensils, Award, Flame } from 'lucide-react';

interface StatsDashboardProps {
  history: DelicacyData[];
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ history }) => {
  
  // Calculate category distribution
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    history.forEach(item => {
      if (item.category !== 'Unknown') {
        counts[item.category] = (counts[item.category] || 0) + 1;
      }
    });
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  }, [history]);

  // Aggregate flavor profile
  const flavorData = useMemo(() => {
    const totals = { sweet: 0, salty: 0, spicy: 0, sour: 0, bitter: 0 };
    const validItems = history.filter(h => h.category !== 'Unknown');
    if (validItems.length === 0) return [];

    validItems.forEach(item => {
      totals.sweet += item.flavorProfile.sweet;
      totals.salty += item.flavorProfile.salty;
      totals.spicy += item.flavorProfile.spicy;
      totals.sour += item.flavorProfile.sour;
      totals.bitter += item.flavorProfile.bitter;
    });

    return Object.keys(totals).map(key => ({
      subject: key.charAt(0).toUpperCase() + key.slice(1),
      A: totals[key as keyof typeof totals] / validItems.length,
      fullMark: 10
    }));
  }, [history]);

  // Top regions
  const regionData = useMemo(() => {
    const counts: Record<string, number> = {};
    history.forEach(item => {
      if (item.category !== 'Unknown' && item.originRegion) {
        counts[item.originRegion] = (counts[item.originRegion] || 0) + 1;
      }
    });
    return Object.keys(counts)
      .map(key => ({ name: key, count: counts[key] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [history]);

  const COLORS = ['#d97706', '#92400e', '#65a30d', '#0891b2', '#78716c'];

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-stone-400 bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
        <Utensils size={48} className="mb-4 opacity-50" />
        <p className="text-lg">No culinary data yet. Start scanning!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Summary Cards */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
              <Utensils size={20} />
            </div>
            <h3 className="font-serif font-semibold text-stone-800">Total Scanned</h3>
          </div>
          <p className="text-3xl font-bold text-stone-900">{history.length}</p>
          <p className="text-xs text-stone-500 mt-1">Delicacies discovered</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg text-green-700">
              <Award size={20} />
            </div>
            <h3 className="font-serif font-semibold text-stone-800">Top Category</h3>
          </div>
          <p className="text-3xl font-bold text-stone-900">
            {categoryData.length > 0 
              ? categoryData.reduce((prev, current) => (prev.value > current.value) ? prev : current).name 
              : '-'}
          </p>
          <p className="text-xs text-stone-500 mt-1">Most frequent find</p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-rose-50 p-6 rounded-2xl border border-red-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 rounded-lg text-red-700">
              <Flame size={20} />
            </div>
            <h3 className="font-serif font-semibold text-stone-800">Avg Calories</h3>
          </div>
          <p className="text-3xl font-bold text-stone-900">
            {Math.round(history.reduce((acc, curr) => acc + (curr.nutrition?.calories || 0), 0) / history.length) || 0}
          </p>
          <p className="text-xs text-stone-500 mt-1">kCal per serving</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Flavor Radar */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
          <h3 className="text-lg font-serif font-semibold mb-6 text-stone-800">Flavor Profile Average</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={flavorData}>
                <PolarGrid stroke="#e7e5e4" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#78716c', fontSize: 12 }} />
                <Radar
                  name="Flavor"
                  dataKey="A"
                  stroke="#d97706"
                  strokeWidth={2}
                  fill="#fbbf24"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Pie */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
          <h3 className="text-lg font-serif font-semibold mb-6 text-stone-800">Collection Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {categoryData.map((entry, index) => (
              <div key={entry.name} className="flex items-center text-xs text-stone-600">
                <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                {entry.name}
              </div>
            ))}
          </div>
        </div>
      </div>

       {/* Region Bar Chart */}
       <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
          <h3 className="text-lg font-serif font-semibold mb-6 text-stone-800">Top Origins</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{ fill: '#44403c', fontSize: 12 }} />
                <Tooltip cursor={{fill: '#fafaf9'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" fill="#a8a29e" radius={[0, 4, 4, 0]}>
                   {regionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#d97706' : '#a8a29e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
    </div>
  );
};
