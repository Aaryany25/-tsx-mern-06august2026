import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, type Person, getSpeciesColor } from './components/Card';
import { Pagination } from './components/Pagination';
import { CharacterModal } from './components/CharacterModal';
import { LoginModal } from './components/LoginModal';
import { useAuth } from './context/AuthContext';
import { Search, Loader2, AlertCircle, RefreshCw, LogIn, LogOut, KeyRound, CheckCircle2, ShieldCheck } from 'lucide-react';
import './App.css';

interface Species {
  name: string;
  url: string;
}

function App() {
  const { user, isAuthenticated, isRefreshing, secondsUntilExpiry, lastRefreshNotice, logout } = useAuth();

  const [people, setPeople] = useState<Person[]>([]);
  const [speciesMap, setSpeciesMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal States
  const [selectedCharacter, setSelectedCharacter] = useState<Person | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Search & Pagination States
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(6);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [peopleRes, speciesRes] = await Promise.all([
        axios.get<Person[]>('https://swapi.info/api/people'),
        axios.get<Species[]>('https://swapi.info/api/species'),
      ]);

      setPeople(peopleRes.data);

      const map: Record<string, string> = {};
      speciesRes.data.forEach((sp) => {
        map[sp.url] = sp.name;
      });
      setSpeciesMap(map);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to fetch characters from SWAPI API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getPersonSpeciesName = (person: Person): string => {
    if (person.species && person.species.length > 0) {
      const speciesUrl = person.species[0];
      return speciesMap[speciesUrl] || 'Alien Species';
    }
    return 'Human';
  };

  const filteredPeople = useMemo(() => {
    if (!searchTerm.trim()) return people;
    const term = searchTerm.toLowerCase().trim();
    return people.filter((person) => {
      const spName = getPersonSpeciesName(person).toLowerCase();
      return (
        person.name.toLowerCase().includes(term) ||
        person.gender.toLowerCase().includes(term) ||
        spName.includes(term) ||
        person.birth_year.toLowerCase().includes(term)
      );
    });
  }, [people, searchTerm, speciesMap]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  const paginatedPeople = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPeople.slice(start, start + itemsPerPage);
  }, [filteredPeople, currentPage, itemsPerPage]);

  return (
    <div className="min-h-screen bg-[#fafaf7] text-black font-sans relative overflow-x-hidden selection:bg-yellow-300 selection:text-black">
      {/* Top Navbar with Authentication Status */}
      <nav className="w-full bg-white border-b-2 border-black px-4 sm:px-8 py-3.5 shadow-sm sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-extrabold text-2xl ml-6">
           TechStax
          </div>

          {/* Auth Status & User Controls */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2.5">
                {/* Silent Refreshing Pulse Indicator */}
                {isRefreshing && (
                  <div className="flex items-center gap-1.5 bg-yellow-300 text-black text-xs font-extrabold px-2.5 py-1 rounded-full border-2 border-black animate-pulse shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Silent Refreshing JWT...</span>
                  </div>
                )}

                {/* Live JWT Expiration Countdown Pill */}
                {!isRefreshing && (
                  <div className="hidden sm:flex items-center gap-1 bg-neutral-100 text-neutral-800 text-xs font-mono font-bold px-2.5 py-1 rounded-full border border-neutral-300">
                    <KeyRound className="w-3.5 h-3.5 text-black" />
                    <span>JWT Exp: {secondsUntilExpiry}s</span>
                  </div>
                )}

                {/* User Pill */}
                <div className="flex items-center gap-2 bg-white border-2 border-black px-3 py-1.5 rounded-2xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <div className="w-6 h-6 rounded-full bg-yellow-300 border border-black flex items-center justify-center font-black text-xs">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-extrabold text-black">{user.username}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                </div>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 bg-white hover:bg-red-100 text-black text-xs font-extrabold px-3 py-1.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
                  title="Log out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center gap-2 bg-yellow-300 hover:bg-yellow-400 text-black text-xs font-extrabold px-4 py-2 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Log In (Demo JWT)</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Silent Refresh Toast Banner Notification */}
      <AnimatePresence>
        {lastRefreshNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-40 bg-black text-white text-xs font-bold px-4 py-2 rounded-full border-2 border-yellow-400 shadow-xl flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-yellow-400" />
            <span>{lastRefreshNotice}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col min-h-screen">
        {/* Main Header */}
        <header className="mb-10 max-w-3xl">
          <motion.h1 initial={{ opacity: 0, filter: 'blur(10px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} transition={{duration:0.5}} className="text-4xl sm:text-6xl font-black text-black tracking-tight leading-[1.1] mb-4">
            Meet The Characters of Star Wars
          </motion.h1>
          <motion.p initial={{ opacity: 0, filter: 'blur(10px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} transition={{duration:0.5,delay:0.2}} className="text-neutral-600 text-lg font-medium">
            Click on any character card to expand it into a detailed modal. Authenticate using the JWT button above to test automated silent token refresh.
          </motion.p>
        </header>

        {/* Search & Filter Bar */}
        <div className="mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by character name, species, gender..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border-2 border-black rounded-2xl pl-11 pr-10 py-3 text-sm font-semibold text-black placeholder-neutral-400 outline-none focus:ring-4 focus:ring-yellow-300/60 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-500 hover:text-black bg-neutral-100 px-2 py-1 rounded-md border border-neutral-300 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {!loading && !error && (
            <div className="text-sm font-bold text-neutral-600">
              Showing <span className="text-black font-extrabold">{filteredPeople.length}</span> character cards
            </div>
          )}
        </div>
 <div className="mt-auto pt-6 mb-10">
                <Pagination
                  currentPage={currentPage}
                  totalItems={filteredPeople.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 160, behavior: 'smooth' });
                  }}
                  onItemsPerPageChange={(count) => setItemsPerPage(count)}
                  isLoading={loading}
                />
              </div>
        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Loading State */}
          {loading && (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-neutral-500 space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-black" />
              <p className="text-sm font-bold">Loading Star Wars team members & species...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
              <div className="p-4 rounded-2xl bg-red-100 border-2 border-black text-red-600 mb-4 shadow-[4px_4px_0px_0px_#000]">
                <AlertCircle className="w-8 h-8 mx-auto" />
              </div>
              <h3 className="text-xl font-black text-black mb-2">Failed to load data</h3>
              <p className="text-neutral-600 text-sm max-w-md mb-6">{error}</p>
              <button
                onClick={fetchData}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-yellow-300 hover:bg-yellow-400 text-black font-extrabold text-sm border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Retry Request
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredPeople.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
              <p className="text-neutral-600 text-base font-medium mb-3">No characters found matching &quot;{searchTerm}&quot;</p>
              <button
                onClick={() => setSearchTerm('')}
                className="text-black font-extrabold text-sm underline underline-offset-4 hover:text-neutral-700 cursor-pointer"
              >
                Clear search filter
              </button>
            </div>
          )}

          {/* Cards Grid with Framer Motion Page Transition */}
          {!loading && !error && filteredPeople.length > 0 && (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`page-${currentPage}-${itemsPerPage}-${searchTerm}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
                >
                  {paginatedPeople.map((person, idx) => {
                    const globalIndex = (currentPage - 1) * itemsPerPage + idx;
                    const speciesName = getPersonSpeciesName(person);

                    return (
                      <Card
                        key={person.url || person.name}
                        person={person}
                        index={globalIndex}
                        speciesName={speciesName}
                        isSelected={selectedCharacter?.url === person.url}
                        onSelect={() => setSelectedCharacter(person)}
                      />
                    );
                  })}
                </motion.div>
              </AnimatePresence>

              {/* Bottom Pagination */}
             
            </>
          )}
        </main>
      </div>

      {/* Character Details Modal */}
      <AnimatePresence>
        {selectedCharacter && (
          <CharacterModal
            key={selectedCharacter.url}
            person={selectedCharacter}
            speciesName={getPersonSpeciesName(selectedCharacter)}
            speciesColor={getSpeciesColor(getPersonSpeciesName(selectedCharacter))}
            onClose={() => setSelectedCharacter(null)}
          />
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}

export default App;
