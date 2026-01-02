
import React, { useEffect, useMemo, useState } from 'react';
import { Search, MapPin, Church as ChurchIcon, Calendar, Info, Filter, X, Navigation, Globe, Phone } from 'lucide-react';
import { LEBANON_CHURCHES } from './data/mockData';
import { Church, Rite, SearchFilters } from './types';

const DEFAULT_FILTERS: SearchFilters = {
  query: '',
  city: 'All',
  rite: 'All',
  day: 'All',
};

const App: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [activeTab, setActiveTab] = useState<'search' | 'info'>('search');
  const [selectedChurch, setSelectedChurch] = useState<Church | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [showChurchesMissingTimes, setShowChurchesMissingTimes] = useState(false);

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
  const hasActiveFilters = filters.query.trim() !== '' || filters.city !== 'All' || filters.rite !== 'All' || filters.day !== 'All';

  const getNextMass = (church: Church) => {
    if (church.schedule.length === 0) return null;
    return church.schedule.find(m => m.day === 'Sunday') || church.schedule[0] || null;
  };

  const filteredChurchesWithTimes = useMemo(
    () => filteredChurches.filter(church => church.schedule.length > 0),
    [filteredChurches],
  );

  const filteredChurchesWithoutTimes = useMemo(
    () => filteredChurches.filter(church => church.schedule.length === 0),
    [filteredChurches],
  );

  const visibleResultsCount =
    filteredChurchesWithTimes.length + (showChurchesMissingTimes ? filteredChurchesWithoutTimes.length : 0);

  useEffect(() => {
    if (!selectedChurch) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedChurch(null);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [selectedChurch]);

  useEffect(() => {
    if (!toast) return;
    const timeoutId = window.setTimeout(() => setToast(null), 2500);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  const clearAllFilters = () => setFilters(DEFAULT_FILTERS);
  const clearFilter = (key: keyof SearchFilters) => setFilters(prev => ({ ...prev, [key]: DEFAULT_FILTERS[key] }));

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
            <a href="./parish-support.html" className="flex items-center gap-2 text-xs text-slate-600 hover:text-blue-600">
              <Globe size={14} /> Parish Support
            </a>
            <a href="./emergency-contacts.html" className="flex items-center gap-2 text-xs text-slate-600 hover:text-blue-600">
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
              <button
                onClick={() => setActiveTab(prev => (prev === 'info' ? 'search' : 'info'))}
                className="text-slate-400 hover:text-blue-600 transition-colors"
                aria-label={activeTab === 'info' ? 'Open directory' : 'Open about'}
                type="button"
              >
                <Info size={20} />
              </button>
            </div>

            {activeTab === 'search' && (
              <div className="flex-1 max-w-xl relative group">
                <label className="sr-only" htmlFor="search-input">Search churches</label>
                <input 
                  id="search-input"
                  type="text"
                  placeholder="Search churches, cities, or districts..."
                  className="w-full bg-slate-100 border-none rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                  value={filters.query}
                  autoComplete="off"
                  spellCheck={false}
                  onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
              </div>
            )}

            {/* Desktop Filters Row */}
            {activeTab === 'search' && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                <label className="sr-only" htmlFor="city-filter">City</label>
                <select 
                  id="city-filter"
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 outline-none hover:border-blue-300 focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                  value={filters.city}
                  onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                >
                  <option value="All">All Cities</option>
	                  {uniqueCities.map(city => <option key={city} value={city}>{city}</option>)}
                </select>
                
                <label className="sr-only" htmlFor="rite-filter">Rite</label>
                <select 
                  id="rite-filter"
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 outline-none hover:border-blue-300 focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                  value={filters.rite}
                  onChange={(e) => setFilters(prev => ({ ...prev, rite: e.target.value as Rite }))}
                >
                  <option value="All">All Rites</option>
	                  {ritesList.map(rite => <option key={rite} value={rite}>{rite}</option>)}
                </select>

                <label className="sr-only" htmlFor="day-filter">Day</label>
                <select 
                  id="day-filter"
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 outline-none hover:border-blue-300 focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                  value={filters.day}
                  onChange={(e) => setFilters(prev => ({ ...prev, day: e.target.value }))}
                >
                  <option value="All">Any Day</option>
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                    <option key={d} value={d}>{d}</option>
	                  ))}
                </select>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="shrink-0 bg-slate-100 text-slate-700 border border-slate-200 rounded-xl px-3 py-2 text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-colors"
                    aria-label="Clear all filters"
                  >
                    Clear
                  </button>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Content Scroll Area */}
        <main className="flex-1 px-4 md:px-8 py-8 pb-28 md:pb-8 max-w-7xl mx-auto w-full">
          {activeTab === 'search' ? (
            <div className="space-y-6">
	              <div className="flex items-center justify-between">
	                <div className="space-y-1">
	                  <h2 className="text-xl font-serif font-bold text-slate-800">Church Directory</h2>
	                  <p className="text-xs text-slate-500">
	                    Browse by city, rite, or day—then open a parish for details.
	                  </p>
	                </div>
	                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
	                  {visibleResultsCount} Results
	                  {!showChurchesMissingTimes && filters.day === 'All' && filteredChurchesWithoutTimes.length > 0 && (
	                    <span className="ml-2 text-slate-300">(+{filteredChurchesWithoutTimes.length} missing times)</span>
	                  )}
	                </span>
	              </div>

              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2">
                  {filters.query.trim() !== '' && (
                    <button
                      type="button"
                      onClick={() => clearFilter('query')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700 transition-colors"
                      aria-label="Clear search query"
                    >
                      <Search size={14} />
                      “{filters.query.trim()}”
                      <X size={14} className="text-slate-400" />
                    </button>
                  )}
                  {filters.city !== 'All' && (
                    <button
                      type="button"
                      onClick={() => clearFilter('city')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700 transition-colors"
                      aria-label="Clear city filter"
                    >
                      <MapPin size={14} />
                      {filters.city}
                      <X size={14} className="text-slate-400" />
                    </button>
                  )}
                  {filters.rite !== 'All' && (
                    <button
                      type="button"
                      onClick={() => clearFilter('rite')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700 transition-colors"
                      aria-label="Clear rite filter"
                    >
                      <ChurchIcon size={14} />
                      {filters.rite}
                      <X size={14} className="text-slate-400" />
                    </button>
                  )}
                  {filters.day !== 'All' && (
                    <button
                      type="button"
                      onClick={() => clearFilter('day')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700 transition-colors"
                      aria-label="Clear day filter"
                    >
                      <Calendar size={14} />
                      {filters.day}
                      <X size={14} className="text-slate-400" />
                    </button>
                  )}
                </div>
              )}
              
              {filteredChurches.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
                  <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                    <Filter size={40} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">No parishes found</h3>
                  <p className="text-slate-500 text-sm mt-2 max-w-xs mx-auto">Try adjusting your filters or search keywords to find what you're looking for.</p>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={clearAllFilters}
                      className="mt-6 inline-flex items-center justify-center px-5 py-3 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-8">
                  <section className="space-y-4">
                    <div className="flex items-end justify-between gap-4">
                      <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">With Mass Times</h3>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        {filteredChurchesWithTimes.length}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredChurchesWithTimes.map(church => (
                    <button
                      type="button"
                      key={church.id}
                      onClick={() => setSelectedChurch(church)}
                      className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col h-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      aria-label={`Open details for ${church.name}`}
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
                        <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors mb-2 truncate">{church.name}</h3>
                        
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
                            {getNextMass(church) ? (
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-slate-700">{getNextMass(church)!.day}</span>
                              <span className="text-sm font-black text-blue-600">{getNextMass(church)!.time}</span>
                            </div>
                            ) : (
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-slate-700">Not available</span>
                                <span className="text-sm font-black text-blue-600">—</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                      ))}
                    </div>
                  </section>

	                  {filters.day === 'All' && filteredChurchesWithoutTimes.length > 0 && (
	                    <section className="space-y-4">
	                      <div className="flex items-end justify-between gap-4">
	                        <div className="space-y-1">
	                          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Needs Mass Times</h3>
	                          <p className="text-xs text-slate-500">
	                            These parishes are listed, but schedules haven’t been added yet.
	                          </p>
	                        </div>
	                        <div className="flex items-center gap-3">
	                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
	                            {filteredChurchesWithoutTimes.length}
	                          </span>
	                          <button
	                            type="button"
	                            onClick={() => setShowChurchesMissingTimes(prev => !prev)}
	                            className="shrink-0 bg-slate-100 text-slate-700 border border-slate-200 rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-colors"
	                            aria-expanded={showChurchesMissingTimes}
	                            aria-label={showChurchesMissingTimes ? 'Hide churches missing mass times' : 'Show churches missing mass times'}
	                          >
	                            {showChurchesMissingTimes ? 'Hide' : 'Show'}
	                          </button>
	                        </div>
	                      </div>

	                      {!showChurchesMissingTimes ? (
	                        <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
	                          <div>
	                            <p className="text-sm font-bold text-slate-900">Hidden by default</p>
	                            <p className="text-sm text-slate-600 mt-1">
	                              {filteredChurchesWithoutTimes.length} parishes are listed but missing verified Mass times.
	                            </p>
	                          </div>
	                          <button
	                            type="button"
	                            onClick={() => setShowChurchesMissingTimes(true)}
	                            className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-white text-slate-800 font-bold hover:bg-slate-100 transition-colors border border-slate-200"
	                          >
	                            Show parishes
	                          </button>
	                        </div>
	                      ) : (
	                        <>
	                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 opacity-90">
	                            {filteredChurchesWithoutTimes.map(church => (
	                              <button
	                                type="button"
	                                key={church.id}
	                                onClick={() => setSelectedChurch(church)}
	                                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col h-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
	                                aria-label={`Open details for ${church.name}`}
	                              >
	                                <div className="h-48 overflow-hidden relative">
	                                  <img
	                                    src={church.imageUrl}
	                                    alt={church.name}
	                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale-[20%]"
	                                  />
	                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity"></div>
	                                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
	                                    <span className="text-[10px] text-white font-bold bg-blue-600/90 backdrop-blur-md px-2 py-1 rounded-lg uppercase tracking-tighter">
	                                      {church.rite}
	                                    </span>
	                                    <span className="text-[10px] text-white font-black bg-amber-600/90 backdrop-blur-md px-2 py-1 rounded-lg uppercase tracking-tighter">
	                                      Missing times
	                                    </span>
	                                  </div>
	                                </div>

	                                <div className="p-5 flex-1 flex flex-col">
	                                  <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors mb-2 truncate">{church.name}</h3>
	                                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
	                                    <MapPin size={14} className="text-blue-400" />
	                                    <span className="truncate">{church.city}, {church.district}</span>
	                                  </div>

	                                  <div className="mt-auto">
	                                    <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
	                                      <div className="flex items-center justify-between mb-1">
	                                        <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Help needed</span>
	                                        <Calendar size={12} className="text-amber-700" />
	                                      </div>
	                                      <div className="flex items-center justify-between">
	                                        <span className="text-sm font-bold text-amber-900">Mass times not added</span>
	                                        <span className="text-xs font-black text-amber-700">Open</span>
	                                      </div>
	                                    </div>
	                                  </div>
	                                </div>
	                              </button>
	                            ))}
	                          </div>

	                          <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
	                            <div>
	                              <p className="text-sm font-bold text-slate-900">Know the schedule?</p>
	                              <p className="text-sm text-slate-600">Message us and we’ll add it.</p>
	                            </div>
	                            <a
	                              href="https://wa.me/971563764536?text=Hi%20Theo%2C%20I%20have%20Mass%20times%20to%20add%20for%20a%20parish%20in%20Lebanon.%0A%0AParish%20name%3A%0ACity%3A%0ARite%3A%0ASchedule%20(day/time/language)%3A"
	                              target="_blank"
	                              rel="noopener noreferrer"
	                              className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
	                            >
	                              Send on WhatsApp
	                            </a>
	                          </div>
	                        </>
	                      )}
	                    </section>
	                  )}
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
                  <a
                    href="https://wa.me/971563764536?text=Hi%20Theo%2C%20I%E2%80%99d%20like%20to%20register%20my%20parish%20on%20Mass%20Times%20Lebanon."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-white text-blue-900 px-8 py-3 rounded-2xl font-bold hover:bg-blue-50 transition-colors shadow-lg"
                    aria-label="Register your parish on WhatsApp"
                  >
                    Register Your Parish
                  </a>
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
              <a href="./privacy.html" className="hover:text-blue-600 transition-colors">Privacy</a>
              <a href="./terms.html" className="hover:text-blue-600 transition-colors">Terms</a>
              <a href="./support.html" className="hover:text-blue-600 transition-colors">Support</a>
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
        <div
          className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
          role="dialog"
          aria-modal="true"
          aria-label={`Details for ${selectedChurch.name}`}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSelectedChurch(null);
          }}
        >
          <div 
            className="bg-white w-full max-w-2xl rounded-t-3xl md:rounded-[40px] max-h-[92vh] md:max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom-full md:slide-in-from-bottom-20 duration-500"
          >
            <div className="relative h-64 md:h-80 flex-shrink-0">
              <img src={selectedChurch.imageUrl} alt={selectedChurch.name} className="w-full h-full object-cover" />
              <button 
                onClick={() => setSelectedChurch(null)}
                className="absolute top-6 right-6 bg-black/30 backdrop-blur-md text-white p-2.5 rounded-full hover:bg-black/50 transition-all border border-white/20"
                aria-label="Close details"
                type="button"
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
                  {selectedChurch.schedule.length > 0 ? (
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
                  ) : (
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-3">
                      <p className="text-sm font-bold text-amber-900">Mass times not added yet.</p>
                      <p className="text-sm text-amber-800">
                        If you know this parish schedule, message us and we’ll add it to the directory.
                      </p>
                      <a
                        href={`https://wa.me/971563764536?text=${encodeURIComponent(
                          `Hi Theo, I have Mass times to add for:\n\n${selectedChurch.name}\n${selectedChurch.city}\nRite: ${selectedChurch.rite}\n\nSchedule (day/time/language):`,
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-full px-5 py-3 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                      >
                        Send schedule on WhatsApp
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 pt-4">
                <button 
                  onClick={() => window.open(
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${selectedChurch.coordinates.lat},${selectedChurch.coordinates.lng}`)}`,
                    '_blank',
                    'noopener,noreferrer',
                  )}
                  className="flex-1 bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-200 flex items-center justify-center gap-2 hover:bg-blue-700 hover:shadow-2xl transition-all"
                  type="button"
                >
                  <Navigation size={20} />
                  Open in Maps
                </button>
                <button 
                  className="flex-1 bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"
                  type="button"
                  onClick={async () => {
                    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${selectedChurch.coordinates.lat},${selectedChurch.coordinates.lng}`)}`;
                    const text = `${selectedChurch.name}\n${selectedChurch.address}, ${selectedChurch.city}\n${mapsUrl}`;

                    try {
                      if (navigator.share) {
                        await navigator.share({ title: selectedChurch.name, text, url: mapsUrl });
                        setToast('Shared.');
                        return;
                      }
                      await navigator.clipboard.writeText(text);
                      setToast('Copied details to clipboard.');
                    } catch {
                      setToast('Could not share right now.');
                    }
                  }}
                >
                  Share Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed z-[110] left-1/2 -translate-x-1/2 bottom-24 md:bottom-8 bg-slate-900 text-white text-sm font-semibold px-4 py-2.5 rounded-2xl shadow-2xl">
          {toast}
        </div>
      )}
    </div>
  );
};

export default App;
