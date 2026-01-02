
import React, { useState, useMemo } from 'react';
import { Search, MapPin, Church as ChurchIcon, Calendar, Info, Filter, X, Navigation, Globe, Phone, Clock, Languages } from 'lucide-react';
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
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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

  const activeFilterCount = (filters.city !== 'All' ? 1 : 0) + (filters.rite !== 'All' ? 1 : 0) + (filters.day !== 'All' ? 1 : 0);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
      
      {/* Sidebar - Desktop Only */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-200 sticky top-0 h-screen z-50">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-100">
              <ChurchIcon size={24} />
            </div>
            <h1 className="text-xl font-serif font-bold text-blue-900 leading-tight">Mass Times</h1>
          </div>
          <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">Lebanon Directory</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button 
            onClick={() => setActiveTab('search')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'search' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Search size={18} />
            Browse Parishes
          </button>
          <button 
            onClick={() => setActiveTab('info')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'info' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Info size={18} />
            App Information
          </button>
        </nav>

        <div className="p-6 bg-slate-50/50 mt-auto border-t border-slate-100">
          <p className="text-[10px] text-slate-400 font-bold uppercase mb-4 tracking-wider">Quick Resources</p>
          <div className="space-y-3">
            <a href="#" className="flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-blue-600 transition-colors">
              <Globe size={14} className="text-slate-400" /> Community Portal
            </a>
            <a href="#" className="flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-blue-600 transition-colors">
              <Phone size={14} className="text-slate-400" /> Crisis Support
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-[40] bg-white border-b border-slate-200 px-4 py-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                  <ChurchIcon size={18} />
                </div>
                <h1 className="font-serif font-bold text-lg text-slate-900 tracking-tight">Mass Times</h1>
              </div>
              <button 
                onClick={() => setShowMobileFilters(true)}
                className={`relative p-2 rounded-full border transition-all ${activeFilterCount > 0 ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-600'}`}
              >
                <Filter size={18} />
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
            
            <div className="relative">
              <input 
                type="text"
                placeholder="Find a church or city..."
                className="w-full bg-slate-100 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                value={filters.query}
                onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            </div>
          </div>
        </header>

        {/* Desktop Top Bar (Hidden on Mobile) */}
        <header className="hidden md:flex sticky top-0 z-40 bg-white border-b border-slate-200 px-8 py-4 items-center justify-between gap-6">
          <div className="flex-1 max-w-xl relative group">
            <input 
              type="text"
              placeholder="Search by church, city, or district..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
              value={filters.query}
              onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
          </div>

          <div className="flex gap-2 shrink-0">
            <select 
              className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 outline-none hover:border-blue-300 focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all"
              value={filters.city}
              onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
            >
              <option value="All">All Cities</option>
              {uniqueCities.map(city => <option key={city} value={city}>{city}</option>)}
            </select>
            <select 
              className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 outline-none hover:border-blue-300 focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all"
              value={filters.rite}
              onChange={(e) => setFilters(prev => ({ ...prev, rite: e.target.value as Rite }))}
            >
              <option value="All">All Rites</option>
              {ritesList.map(rite => <option key={rite} value={rite}>{rite}</option>)}
            </select>
            <select 
              className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 outline-none hover:border-blue-300 focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all"
              value={filters.day}
              onChange={(e) => setFilters(prev => ({ ...prev, day: e.target.value }))}
            >
              <option value="All">Any Day</option>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </header>

        {/* Content Scroll Area */}
        <main className="flex-1 px-4 md:px-8 py-6 max-w-7xl mx-auto w-full pb-24 md:pb-8">
          {activeTab === 'search' ? (
            <div className="space-y-6">
              <div className="flex items-end justify-between px-1">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-slate-900">Directory</h2>
                  <p className="text-xs text-slate-500 font-medium">Discover parishes across Lebanon</p>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white border border-slate-200 px-2.5 py-1 rounded-full">{filteredChurches.length} Parishes</span>
              </div>
              
              {filteredChurches.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                  <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <Filter size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">No parishes match</h3>
                  <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto px-6">We couldn't find any results for your current filter selection.</p>
                  <button 
                    onClick={() => setFilters({ query: '', city: 'All', rite: 'All', day: 'All' })}
                    className="mt-6 text-blue-600 font-bold text-sm bg-blue-50 px-6 py-2 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                  {filteredChurches.map(church => (
                    <div 
                      key={church.id}
                      onClick={() => setSelectedChurch(church)}
                      className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col h-full"
                    >
                      <div className="h-44 md:h-52 overflow-hidden relative">
                        <img 
                          src={church.imageUrl} 
                          alt={church.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="absolute top-3 left-3">
                          <span className="text-[10px] text-white font-bold bg-blue-600/90 backdrop-blur-md px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm">
                            {church.rite}
                          </span>
                        </div>
                        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 text-white/90">
                           <MapPin size={14} className="text-blue-400" />
                           <span className="text-xs font-bold truncate">{church.city}</span>
                        </div>
                      </div>
                      
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div className="mb-4">
                          <h3 className="text-base font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">{church.name}</h3>
                          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">{church.district}</p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 group-hover:border-blue-100 group-hover:bg-blue-50/30 transition-all">
                            <div className="flex items-center gap-2">
                              <Clock size={14} className="text-blue-500" />
                              <div className="flex flex-col">
                                <span className="text-[8px] font-black text-slate-400 uppercase">Mass Today</span>
                                <span className="text-xs font-bold text-slate-700">{getNextMass(church).time}</span>
                              </div>
                            </div>
                            <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md uppercase">
                              {getNextMass(church).language}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <section className="text-center space-y-4">
                <div className="inline-block bg-blue-50 p-3 rounded-2xl mb-2">
                  <ChurchIcon className="text-blue-600" size={32} />
                </div>
                <h2 className="text-3xl font-serif font-bold text-blue-900">About Lebanon Mass Times</h2>
                <p className="text-base text-slate-600 leading-relaxed px-4">
                  Providing a comprehensive directory of mass schedules across Lebanon's vibrant multi-rite Christian community.
                </p>
              </section>

              <div className="grid gap-6 px-2">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
                    <Languages size={20} className="text-blue-500" />
                    Traditions & Rites
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ritesList.map(rite => (
                      <div key={rite} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-[13px] font-semibold text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0"></div>
                        {rite}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-3xl p-8 text-white shadow-xl">
                  <h3 className="text-xl font-serif font-bold mb-3">Community Contributions</h3>
                  <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                    Mass schedules can vary by season. If you are a parish administrator and wish to update your schedule, please reach out to our team.
                  </p>
                  <button className="w-full sm:w-auto bg-white text-blue-900 px-8 py-3 rounded-2xl font-bold hover:bg-blue-50 active:scale-95 transition-all shadow-lg text-sm">
                    Contact Administration
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-[32px] p-6 animate-in slide-in-from-bottom-full duration-400">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-slate-900">Filter Directory</h3>
              <button onClick={() => setShowMobileFilters(false)} className="p-2 bg-slate-100 rounded-full text-slate-400">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-6 mb-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">City</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-700 outline-none"
                  value={filters.city}
                  onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                >
                  <option value="All">All Cities</option>
                  {uniqueCities.map(city => <option key={city} value={city}>{city}</option>)}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rite</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-700 outline-none"
                  value={filters.rite}
                  onChange={(e) => setFilters(prev => ({ ...prev, rite: e.target.value as Rite }))}
                >
                  <option value="All">All Rites</option>
                  {ritesList.map(rite => <option key={rite} value={rite}>{rite}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Preferred Day</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-700 outline-none"
                  value={filters.day}
                  onChange={(e) => setFilters(prev => ({ ...prev, day: e.target.value }))}
                >
                  <option value="All">Any Day</option>
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <button 
              onClick={() => setShowMobileFilters(false)}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-200 active:scale-[0.98] transition-all"
            >
              Apply Changes
            </button>
          </div>
        </div>
      )}

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 px-10 py-3.5 flex items-center justify-around z-50">
        <button 
          onClick={() => setActiveTab('search')}
          className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'search' ? 'text-blue-600 scale-110' : 'text-slate-400'}`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'search' ? 'bg-blue-50' : 'bg-transparent'}`}>
            <Search size={22} strokeWidth={activeTab === 'search' ? 2.5 : 2} />
          </div>
          <span className="text-[9px] font-black uppercase tracking-wider">Browse</span>
        </button>
        <button 
          onClick={() => setActiveTab('info')}
          className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'info' ? 'text-blue-600 scale-110' : 'text-slate-400'}`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'info' ? 'bg-blue-50' : 'bg-transparent'}`}>
            <Info size={22} strokeWidth={activeTab === 'info' ? 2.5 : 2} />
          </div>
          <span className="text-[9px] font-black uppercase tracking-wider">About</span>
        </button>
      </nav>

      {/* Details Sheet - Desktop Centered / Mobile Bottom Sheet */}
      {selectedChurch && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-300">
          <div 
            className="bg-white w-full max-w-3xl rounded-t-[40px] md:rounded-[40px] max-h-[96vh] md:max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom-full duration-500 relative"
          >
            {/* Grab Handle - Mobile Only */}
            <div className="md:hidden flex justify-center py-4 shrink-0 bg-white sticky top-0 z-10">
              <div className="w-12 h-1.5 bg-slate-200 rounded-full"></div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide pb-20 md:pb-0">
              <div className="relative h-64 md:h-[400px] flex-shrink-0">
                <img src={selectedChurch.imageUrl} className="w-full h-full object-cover" />
                <button 
                  onClick={() => setSelectedChurch(null)}
                  className="absolute top-4 right-4 md:top-6 md:right-6 bg-black/30 backdrop-blur-md text-white p-2.5 rounded-full hover:bg-black/50 transition-all border border-white/20 z-20"
                >
                  <X size={22} />
                </button>
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                  <span className="text-blue-600 font-black text-xs uppercase tracking-[0.25em] mb-2 block">{selectedChurch.rite}</span>
                  <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 leading-tight tracking-tight">{selectedChurch.name}</h2>
                </div>
              </div>

              <div className="p-6 md:p-10 space-y-10">
                <div className="grid md:grid-cols-5 gap-10">
                  <div className="md:col-span-3 space-y-8">
                    <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-[28px] border border-slate-100 shadow-sm">
                      <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-100">
                        <MapPin size={22} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Parish Address</p>
                        <p className="text-base font-bold text-slate-700 leading-snug">{selectedChurch.address}, {selectedChurch.city}</p>
                        <p className="text-xs text-slate-500 mt-1">{selectedChurch.district} District</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">History & Context</h3>
                      <p className="text-slate-600 leading-relaxed text-base md:text-lg font-medium">
                        {selectedChurch.description}
                      </p>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                        <Clock size={22} className="text-blue-600" />
                        Mass Schedule
                      </h3>
                      <span className="text-[10px] font-bold text-slate-400 px-2 py-1 bg-slate-100 rounded-md">UTC+2</span>
                    </div>
                    <div className="space-y-3">
                      {selectedChurch.schedule.map((mass, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-blue-200 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{mass.day}</span>
                              <span className="text-lg font-black text-slate-900 leading-none">{mass.time}</span>
                            </div>
                          </div>
                          <div className="text-right">
                             <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
                               <Languages size={12} />
                               <span className="text-[10px] font-black uppercase tracking-tighter">{mass.language}</span>
                             </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button 
                    onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${selectedChurch.coordinates.lat},${selectedChurch.coordinates.lng}`, '_blank')}
                    className="flex-1 bg-blue-600 text-white font-bold py-4.5 rounded-[24px] shadow-2xl shadow-blue-200 flex items-center justify-center gap-2.5 hover:bg-blue-700 active:scale-95 transition-all md:py-4"
                  >
                    <Navigation size={20} />
                    Directions in Maps
                  </button>
                  <button 
                    className="flex-1 bg-slate-100 text-slate-600 font-bold py-4.5 rounded-[24px] flex items-center justify-center gap-2.5 hover:bg-slate-200 active:scale-95 transition-all md:py-4"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: selectedChurch.name,
                          text: `Check out mass times for ${selectedChurch.name} in ${selectedChurch.city}`,
                          url: window.location.href,
                        });
                      }
                    }}
                  >
                    Share Parish Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
