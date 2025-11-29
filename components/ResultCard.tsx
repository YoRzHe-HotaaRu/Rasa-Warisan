import React from 'react';
import { DelicacyData } from '../types';
import { Clock, Users, Flame, MapPin, ChefHat, Info, BookOpen, Heart } from 'lucide-react';

interface ResultCardProps {
  data: DelicacyData;
}

export const ResultCard: React.FC<ResultCardProps> = ({ data }) => {
  
  if (data.category === 'Unknown' || data.confidence < 40) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20 animate-fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-stone-100 rounded-full mb-6">
          <Info size={40} className="text-stone-400" />
        </div>
        <h2 className="text-3xl font-serif text-stone-800 mb-4">Minta Maaf (Apologies)</h2>
        <p className="text-stone-600 max-w-md mx-auto">
          We couldn't confidently identify this as a Malay traditional delicacy. It might be a non-food object or the image quality is unclear. Please try again!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in pb-20">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-white shadow-sm border border-stone-100 mb-8">
        <div className="absolute top-0 right-0 p-6 opacity-10">
           {/* Abstract Batik Motif Pattern SVG */}
           <svg width="200" height="200" viewBox="0 0 100 100" fill="currentColor" className="text-amber-900">
             <path d="M50 0 C20 0 20 30 0 50 C20 70 20 100 50 100 C80 100 80 70 100 50 C80 30 80 0 50 0 Z" />
           </svg>
        </div>
        
        <div className="p-8 md:p-10 relative z-10 flex flex-col md:flex-row gap-8 items-start">
          {data.imageUrl && (
            <div className="w-full md:w-1/3 shrink-0">
               <div className="aspect-square rounded-2xl overflow-hidden shadow-md border-4 border-white">
                 <img src={data.imageUrl} alt={data.name} className="w-full h-full object-cover" />
               </div>
            </div>
          )}
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold tracking-wider uppercase">
                {data.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-600 text-xs font-medium flex items-center gap-1">
                <MapPin size={12} /> {data.originRegion}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-2">
              {data.malayName}
            </h1>
            <h2 className="text-xl text-stone-500 font-light italic mb-6">
              "{data.name}"
            </h2>
            
            <p className="text-stone-700 leading-relaxed mb-6 text-lg">
              {data.description}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-stone-50 rounded-xl border border-stone-100">
               <div className="text-center">
                 <p className="text-xs text-stone-500 uppercase tracking-wide">Calories</p>
                 <p className="font-semibold text-stone-900">{data.nutrition.calories}</p>
               </div>
               <div className="text-center border-l border-stone-200">
                 <p className="text-xs text-stone-500 uppercase tracking-wide">Protein</p>
                 <p className="font-semibold text-stone-900">{data.nutrition.protein}</p>
               </div>
               <div className="text-center border-l border-stone-200">
                 <p className="text-xs text-stone-500 uppercase tracking-wide">Carbs</p>
                 <p className="font-semibold text-stone-900">{data.nutrition.carbs}</p>
               </div>
               <div className="text-center border-l border-stone-200">
                 <p className="text-xs text-stone-500 uppercase tracking-wide">Fat</p>
                 <p className="font-semibold text-stone-900">{data.nutrition.fat}</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Ingredients & Stats */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
            <h3 className="font-serif text-2xl text-stone-800 mb-4 flex items-center gap-2">
              <BookOpen size={24} className="text-amber-600" /> Bahan (Ingredients)
            </h3>
            <ul className="space-y-3">
              {data.ingredients.map((ing, idx) => (
                <li key={idx} className="flex justify-between items-center text-stone-700 border-b border-stone-50 pb-2 last:border-0">
                  <span>{ing.item}</span>
                  <span className="text-stone-400 text-sm">{ing.amount}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-emerald-50 p-6 rounded-2xl shadow-sm border border-emerald-100">
             <h3 className="font-serif text-xl text-emerald-900 mb-3 flex items-center gap-2">
               <Heart size={20} /> Perfect Pairing
             </h3>
             <p className="text-emerald-800 italic">
               "{data.pairing}"
             </p>
          </div>
        </div>

        {/* Middle/Right: Recipe & History */}
        <div className="md:col-span-2 space-y-8">
           
           {/* History Section */}
           <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-amber-500 relative overflow-hidden">
             <div className="relative z-10">
                <h3 className="font-serif text-2xl text-stone-800 mb-4 flex items-center gap-2">
                  <Clock size={24} className="text-amber-600" /> Sejarah (History)
                </h3>
                <p className="text-stone-700 leading-7 whitespace-pre-line">
                  {data.history}
                </p>
             </div>
           </div>

           {/* Steps */}
           <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100">
             <h3 className="font-serif text-2xl text-stone-800 mb-6 flex items-center gap-2">
               <ChefHat size={24} className="text-amber-600" /> Cara Memasak (Instructions)
             </h3>
             <div className="space-y-6">
               {data.recipeSteps.map((step, idx) => (
                 <div key={idx} className="flex gap-4">
                   <div className="shrink-0 w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold font-serif">
                     {idx + 1}
                   </div>
                   <p className="text-stone-700 mt-1">{step}</p>
                 </div>
               ))}
             </div>
           </div>

           {/* Tips */}
           <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
              <h3 className="font-serif text-xl text-amber-900 mb-4 flex items-center gap-2">
                <Flame size={20} /> Tips & Rahsia
              </h3>
              <ul className="list-disc list-inside space-y-2 text-amber-900/80">
                {data.tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
           </div>

        </div>
      </div>
    </div>
  );
};
