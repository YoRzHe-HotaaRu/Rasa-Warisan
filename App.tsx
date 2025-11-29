import React, { useState, useEffect, useRef } from 'react';
import { analyzeImage, fileToGenerativePart } from './services/geminiService';
import { DelicacyData, AppView } from './types';
import { Button } from './components/Button';
import { ResultCard } from './components/ResultCard';
import { StatsDashboard } from './components/StatsDashboard';
import { Upload, Camera, History, BarChart3, ChevronLeft, Loader2, UtensilsCrossed, Trash2 } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [currentData, setCurrentData] = useState<DelicacyData | null>(null);
  const [history, setHistory] = useState<DelicacyData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load history from local storage
  useEffect(() => {
    const saved = localStorage.getItem('rasa_warisan_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history
  useEffect(() => {
    localStorage.setItem('rasa_warisan_history', JSON.stringify(history));
  }, [history]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Reset state
    setLoading(true);
    setError(null);
    setView(AppView.RESULTS);
    setCurrentData(null);

    try {
      const base64 = await fileToGenerativePart(file);
      const mimeType = file.type;
      
      const result = await analyzeImage(base64, mimeType);
      
      // Add image url for display purposes (Base64 is heavy but works for local demos)
      const resultWithImage = { ...result, imageUrl: `data:${mimeType};base64,${base64}` };
      
      setCurrentData(resultWithImage);
      
      // Only add to history if it's a valid food item
      if (result.category !== 'Unknown' && result.confidence > 40) {
        setHistory(prev => [resultWithImage, ...prev]);
      }
    } catch (err) {
      setError("Failed to analyze the image. Please try again or check your API key.");
      console.error(err);
    } finally {
      setLoading(false);
      // clear input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const triggerUpload = () => fileInputRef.current?.click();

  const loadFromHistory = (item: DelicacyData) => {
    setCurrentData(item);
    setView(AppView.RESULTS);
  };

  const clearHistory = () => {
    if(confirm('Are you sure you want to clear your collection?')) {
      setHistory([]);
    }
  }

  // --- Components for Layout ---

  const Sidebar = () => (
    <div className="hidden lg:flex flex-col w-80 h-screen fixed left-0 top-0 bg-white border-r border-stone-200 z-20">
      <div className="p-6 border-b border-stone-100 flex items-center gap-3">
        <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center text-white">
          <UtensilsCrossed size={24} />
        </div>
        <div>
          <h1 className="font-serif font-bold text-xl text-stone-900">Rasa Warisan</h1>
          <p className="text-xs text-stone-500 uppercase tracking-wider">Heritage Detector</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <div className="px-2 py-2 text-xs font-semibold text-stone-400 uppercase tracking-wider">Menu</div>
        <button 
          onClick={() => setView(AppView.HOME)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${view === AppView.HOME ? 'bg-amber-50 text-amber-700 font-medium' : 'text-stone-600 hover:bg-stone-50'}`}
        >
          <Camera size={18} /> New Scan
        </button>
        <button 
          onClick={() => setView(AppView.STATS)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${view === AppView.STATS ? 'bg-amber-50 text-amber-700 font-medium' : 'text-stone-600 hover:bg-stone-50'}`}
        >
          <BarChart3 size={18} /> Statistics
        </button>

        <div className="mt-8 px-2 py-2 flex justify-between items-center text-xs font-semibold text-stone-400 uppercase tracking-wider">
          <span>Recent Scans</span>
          {history.length > 0 && (
             <button onClick={clearHistory} className="hover:text-red-500 transition-colors"><Trash2 size={12}/></button>
          )}
        </div>
        
        {history.length === 0 ? (
          <div className="text-center py-10 px-4 text-stone-400 text-sm italic">
            Your collection is empty. Scan your first Kuih!
          </div>
        ) : (
          <div className="space-y-2">
            {history.map(item => (
              <button
                key={item.id}
                onClick={() => loadFromHistory(item)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors hover:bg-stone-50 group`}
              >
                <div className="w-10 h-10 rounded-md overflow-hidden bg-stone-200 shrink-0 border border-stone-200">
                  {item.imageUrl && <img src={item.imageUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="" />}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-stone-800 truncate">{item.malayName}</div>
                  <div className="text-xs text-stone-500 truncate">{new Date(item.timestamp).toLocaleDateString()}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-stone-100">
        <div className="bg-gradient-to-br from-stone-900 to-stone-700 rounded-xl p-4 text-white shadow-lg">
          <p className="text-sm font-medium mb-1">Explore Heritage</p>
          <p className="text-xs text-stone-300 mb-3">Discover the stories behind every bite.</p>
          <div className="h-1 w-full bg-stone-600 rounded-full overflow-hidden">
             <div className="h-full bg-amber-500" style={{ width: `${Math.min(history.length * 5, 100)}%` }}></div>
          </div>
          <p className="text-[10px] mt-2 text-right opacity-70">{history.length} dishes collected</p>
        </div>
      </div>
    </div>
  );

  const MobileNav = () => (
    <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-stone-200 z-50 flex justify-around p-3 shadow-lg">
      <button onClick={() => setView(AppView.HOME)} className={`flex flex-col items-center p-2 ${view === AppView.HOME ? 'text-amber-600' : 'text-stone-400'}`}>
        <Camera size={20} />
        <span className="text-[10px] mt-1 font-medium">Scan</span>
      </button>
      <button onClick={() => setView(AppView.HISTORY)} className={`flex flex-col items-center p-2 ${view === AppView.HISTORY ? 'text-amber-600' : 'text-stone-400'}`}>
        <History size={20} />
        <span className="text-[10px] mt-1 font-medium">History</span>
      </button>
      <button onClick={() => setView(AppView.STATS)} className={`flex flex-col items-center p-2 ${view === AppView.STATS ? 'text-amber-600' : 'text-stone-400'}`}>
        <BarChart3 size={20} />
        <span className="text-[10px] mt-1 font-medium">Stats</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafaf9] text-stone-800 font-sans">
      <Sidebar />
      <MobileNav />
      
      <main className="lg:pl-80 min-h-screen">
        <div className="max-w-7xl mx-auto p-4 md:p-8 pb-24 lg:pb-8">
          
          {/* Top Bar (Mobile Only) */}
          <div className="lg:hidden flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-600 rounded-md flex items-center justify-center text-white">
                <UtensilsCrossed size={16} />
              </div>
              <h1 className="font-serif font-bold text-lg text-stone-900">Rasa Warisan</h1>
            </div>
          </div>

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            accept="image/*" 
          />

          {view === AppView.HOME && (
            <div className="flex flex-col items-center justify-center min-h-[70vh] animate-fade-in">
              <div className="text-center max-w-2xl mx-auto space-y-6">
                <h1 className="text-5xl md:text-7xl font-serif text-stone-900 tracking-tight">
                  Taste the <span className="text-amber-600 italic">Tradition</span>
                </h1>
                <p className="text-lg md:text-xl text-stone-600 leading-relaxed">
                  Discover the rich history, recipes, and nutritional facts of Malay delicacies simply by snapping a photo.
                </p>
                
                <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    onClick={triggerUpload} 
                    icon={<Upload size={20}/>}
                    className="shadow-xl shadow-amber-900/10"
                  >
                    Upload Image
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={() => {
                      if (history.length > 0) setView(AppView.STATS);
                      else alert("Scan an item first to see stats!");
                    }}
                    icon={<BarChart3 size={20}/>}
                  >
                    View Stats
                  </Button>
                </div>
                
                {/* Decorative Elements */}
                <div className="grid grid-cols-3 gap-4 mt-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                   <img src="https://picsum.photos/200/200?random=1" className="rounded-2xl rotate-3 transform translate-y-4" alt="Decoration" />
                   <img src="https://picsum.photos/200/200?random=2" className="rounded-2xl -rotate-2 transform -translate-y-2 z-10 scale-110 shadow-lg" alt="Decoration" />
                   <img src="https://picsum.photos/200/200?random=3" className="rounded-2xl rotate-6 transform translate-y-6" alt="Decoration" />
                </div>
              </div>
            </div>
          )}

          {view === AppView.RESULTS && (
            <div className="animate-fade-in">
              <div className="mb-6 flex items-center gap-4">
                 <button 
                   onClick={() => setView(AppView.HOME)} 
                   className="p-2 hover:bg-stone-200 rounded-full transition-colors"
                 >
                   <ChevronLeft />
                 </button>
                 <span className="text-sm font-medium text-stone-400 uppercase tracking-wider">Analysis Result</span>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-amber-100 rounded-full animate-ping opacity-75"></div>
                    <div className="relative bg-white p-4 rounded-full shadow-lg">
                      <Loader2 size={40} className="animate-spin text-amber-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-serif text-stone-800">Identifying Delicacy...</h3>
                  <p className="text-stone-500">Consulting the culinary archives</p>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 p-8 rounded-2xl text-center">
                  <p className="text-red-600 font-medium mb-4">{error}</p>
                  <Button onClick={triggerUpload} variant="outline">Try Again</Button>
                </div>
              ) : currentData ? (
                <ResultCard data={currentData} />
              ) : null}
            </div>
          )}

          {view === AppView.STATS && (
             <div className="animate-fade-in">
                <div className="mb-8 flex items-center justify-between">
                   <h2 className="text-3xl font-serif font-bold text-stone-900">Culinary Passport Stats</h2>
                   <div className="text-stone-500 text-sm">{history.length} dishes logged</div>
                </div>
                <StatsDashboard history={history} />
             </div>
          )}

          {view === AppView.HISTORY && (
            // Mobile History View (since desktop uses sidebar)
             <div className="animate-fade-in lg:hidden">
                <div className="mb-6 flex items-center justify-between">
                   <h2 className="text-2xl font-serif font-bold text-stone-900">Scan History</h2>
                   {history.length > 0 && <button onClick={clearHistory} className="text-red-500 text-sm">Clear All</button>}
                </div>
                <div className="space-y-4">
                  {history.map(item => (
                    <div 
                      key={item.id} 
                      onClick={() => loadFromHistory(item)}
                      className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-stone-100 active:scale-[0.98] transition-transform"
                    >
                      <div className="w-20 h-20 bg-stone-200 rounded-lg overflow-hidden shrink-0">
                        {item.imageUrl && <img src={item.imageUrl} className="w-full h-full object-cover" alt="" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-stone-800">{item.malayName}</h3>
                        <p className="text-stone-500 text-sm">{item.name}</p>
                        <span className="inline-block mt-2 px-2 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold uppercase rounded-full">
                          {item.category}
                        </span>
                      </div>
                    </div>
                  ))}
                  {history.length === 0 && (
                    <div className="text-center py-10 text-stone-400">No history available yet.</div>
                  )}
                </div>
             </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default App;
