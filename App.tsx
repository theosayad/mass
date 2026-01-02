
import React, { useState, useMemo } from 'react';
import { Search, MapPin, Church as ChurchIcon, Calendar, Info, Filter, X, Navigation, Globe, Phone } from 'lucide-react';
import { LEBANON_CHURCHES } from './data/mockData';
import { Church, Rite, SearchFilters } from './types';

const App: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    city: 'All',
    rite: 'All',
    day: 'All'
  });
  const [activeTab, setActiveTab] = useState<'search' | 'info'>('search');
  const [selectedChurch, setSelectedChurch] = useState<Church | null>(null);

  const filteredChurches = useMemo(() => {
    return LEBANON_CHURCHES.filter(church => {
      const matchQuery = church.name.toLowerCase().includes(filters.query.toLowerCase()) || 
                         church.city.toLowerCase().includes(filters.query.toLowerCase());
      const matchCity = filters.city === 'All' || church.city === filters.city;
      const matchRite = filters.rite === 'All' || church.rite === filters.rite;
      const matchDay = filters.day === 'All' || church.schedule.some(m => m.day === filters.day);
      
      return matchQuery && matchCity && matchRite && matchDay;
    });
  }, [filters]);

  const uniqueCities = Array.from(new Set(LEBANON_CHURCHES.map(c => c.city))).sort();
  const ritesList = Object.values(Rite);

  const getNextMass = (church: Church) => {
    return church.schedule.find(m => m.day === 'Sunday') || church.schedule[0];
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 text-slate-900">
      
      {/* Sidebar - Desktop Only */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-200 sticky top-0 h-screen">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-blue-600 p-2 rounded-xl text-white">
              <ChurchIcon size={24} />
            </div>
            <h1 className="text-xl font-serif font-bold text-blue-900 leading-tight">Mass Times</h1>
          </div>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Lebanon Edition</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('search')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'search' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Search size={20} />
            Directory
          </button>
          <button 
            onClick={() => setActiveTab('info')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'info' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Info size={20} />
            About & Rites
          </button>
        </nav>

        <div className="p-6 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 font-bold uppercase mb-4">Quick Links</p>
          <div className="space-y-3">
            <a href="#" className="flex items-center gap-2 text-xs text-slate-600 hover:text-blue-600">
              <Globe size={14} /> Parish Support
            </a>
            <a href="#" className="flex items-center gap-2 text-xs text-slate-600 hover:text-blue-600">
              <Phone size={14} /> Emergency Contacts
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        
        {/* Mobile Header / Search Bar */}
        <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Mobile Title View */}
            <div className="md:hidden flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ChurchIcon className="text-blue-600" size={24} />
                <h1 className="font-serif font-bold text-lg">Mass Times Lebanon</h1>
              </div>
              <button onClick={() => setActiveTab('info')} className="text-slate-400">
                <Info size={20} />
              </button>
            </div>

            {activeTab === 'search' && (
              <div className="flex-1 max-w-xl relative group">
                <input 
                  type="text"
                  placeholder="Search churches, cities, or districts..."
                  className="w-full bg-slate-100 border-none rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                  value={filters.query}
                  onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
              </div>
            )}

            {/* Desktop Filters Row */}
            {activeTab === 'search' && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                <select 
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 outline-none hover:border-blue-300 focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                  value={filters.city}
                  onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                >
                  <option value="All">All Cities</option>
                  {uniqueCities.map(city => <option key={city} value={city}>{city}</option>)}
                </select>
                
                <select 
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 outline-none hover:border-blue-300 focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                  value={filters.rite}
                  onChange={(e) => setFilters(prev => ({ ...prev, rite: e.target.value as Rite }))}
                >
                  <option value="All">All Rites</option>
                  {ritesList.map(rite => <option key={rite} value={rite}>{rite}</option>)}
                </select>

                <select 
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 outline-none hover:border-blue-300 focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                  value={filters.day}
                  onChange={(e) => setFilters(prev => ({ ...prev, day: e.target.value }))}
                >
                  <option value="All">Any Day</option>
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </header>

        {/* Content Scroll Area */}
        <main className="flex-1 px-4 md:px-8 py-8 max-w-7xl mx-auto w-full">
          {activeTab === 'search' ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-serif font-bold text-slate-800">Church Directory</h2>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{filteredChurches.length} Results</span>
              </div>
              
              {filteredChurches.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
                  <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                    <Filter size={40} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">No parishes found</h3>
                  <p className="text-slate-500 text-sm mt-2 max-w-xs mx-auto">Try adjusting your filters or search keywords to find what you're looking for.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredChurches.map(church => (
                    <div 
                      key={church.id}
                      onClick={() => setSelectedChurch(church)}
                      className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col h-full"
                    >
                      <div className="h-48 overflow-hidden relative">
                        <img 
                          src={church.imageUrl} 
                          alt={church.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                          <span className="text-[10px] text-white font-bold bg-blue-600/90 backdrop-blur-md px-2 py-1 rounded-lg uppercase tracking-tighter">
                            {church.rite}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors mb-2 line-clamp-1">{church.name}</h3>
                        
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
                          <MapPin size={14} className="text-blue-400" />
                          <span className="truncate">{church.city}, {church.district}</span>
                        </div>

                        <div className="mt-auto space-y-3">
                          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Primary Mass</span>
                              <Calendar size={12} className="text-blue-500" />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-slate-700">{getNextMass(church).day}</span>
                              <span className="text-sm font-black text-blue-600">{getNextMass(church).time}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* About Tab Content */
            <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
              <section className="text-center space-y-4">
                <h2 className="text-4xl font-serif font-bold text-blue-900">Faith in the Cedar's Land</h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                  Lebanon is home to a rich tapestry of Christian traditions. Our app helps you navigate mass schedules across the country's most historic and vibrant parishes.
                </p>
              </section>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <ChurchIcon size={18} />
                    </div>
                    Recognized Rites
                  </h3>
                  <div className="grid gap-3">
                    {ritesList.map(rite => (
                      <div key={rite} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm font-semibold text-slate-700">
                        <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                        {rite}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-900 rounded-3xl p-8 text-white flex flex-col justify-center shadow-xl">
                  <h3 className="text-2xl font-serif font-bold mb-4">Parish Administration</h3>
                  <p className="text-blue-100 mb-6 leading-relaxed">
                    Mass times are subject to change during liturgical seasons and holidays. We encourage parish administrators to keep their data updated.
                  </p>
                  <button className="bg-white text-blue-900 px-8 py-3 rounded-2xl font-bold hover:bg-blue-50 transition-colors shadow-lg">
                    Register Your Parish
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Desktop Footer */}
        <footer className="mt-auto border-t border-slate-200 py-8 px-8 hidden md:block">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-sm">
            <p>© 2024 Mass Times Lebanon. Supporting Christian Communities.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Support</a>
            </div>
          </div>
        </footer>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-200 px-8 py-3 flex items-center justify-around z-50">
        <button 
          onClick={() => setActiveTab('search')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'search' ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <Search size={22} />
          <span className="text-[10px] font-black uppercase tracking-widest">Search</span>
        </button>
        <button 
          onClick={() => setActiveTab('info')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'info' ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <Info size={22} />
          <span className="text-[10px] font-black uppercase tracking-widest">About</span>
        </button>
      </nav>

      {/* Details Modal - Desktop Centered / Mobile Bottom Sheet */}
      {selectedChurch && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div 
            className="bg-white w-full max-w-2xl rounded-t-3xl md:rounded-[40px] max-h-[92vh] md:max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom-full md:slide-in-from-bottom-20 duration-500"
          >
            <div className="relative h-64 md:h-80 flex-shrink-0">
              <img src={selectedChurch.imageUrl} className="w-full h-full object-cover" />
              <button 
                onClick={() => setSelectedChurch(null)}
                className="absolute top-6 right-6 bg-black/30 backdrop-blur-md text-white p-2.5 rounded-full hover:bg-black/50 transition-all border border-white/20"
              >
                <X size={24} />
              </button>
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span className="text-blue-600 font-black text-xs uppercase tracking-[0.2em] mb-2 block">{selectedChurch.rite}</span>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 leading-tight">{selectedChurch.name}</h2>
              </div>
            </div>

            <div className="p-8 overflow-y-auto space-y-8 scrollbar-hide">
              <div className="grid md:grid-cols-5 gap-8">
                <div className="md:col-span-3 space-y-6">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <MapPin size={20} className="text-blue-500" />
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Location</p>
                      <p className="text-sm font-semibold text-slate-700">{selectedChurch.address}, {selectedChurch.city}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">About the Parish</h3>
                    <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                      {selectedChurch.description}
                    </p>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-4">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-2">
                    <Calendar size={20} className="text-blue-600" />
                    Weekly Schedule
                  </h3>
                  <div className="space-y-2">
                    {selectedChurch.schedule.map((mass, idx) => (
                      <div key={idx} className="flex flex-col p-3 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase">{mass.day}</span>
                          <span className="text-[10px] font-bold text-blue-600 px-1.5 py-0.5 bg-blue-50 rounded">{mass.language}</span>
                        </div>
                        <span className="text-lg font-black text-slate-900">{mass.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 pt-4">
                <button 
                  onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${selectedChurch.coordinates.lat},${selectedChurch.coordinates.lng}`, '_blank')}
                  className="flex-1 bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-200 flex items-center justify-center gap-2 hover:bg-blue-700 hover:shadow-2xl transition-all"
                >
                  <Navigation size={20} />
                  Open in Maps
                </button>
                <button 
                  className="flex-1 bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"
                  onClick={() => {/* Mock share functionality */}}
                >
                  Share Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
