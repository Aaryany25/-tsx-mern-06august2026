import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Globe,
  Film,
  Calendar,
  Ruler,
  Weight,
  UserCheck,
  Thermometer,
  Mountain,
  Users,
  Loader2,
  Sparkles,
} from 'lucide-react';
import type { Person } from './Card';

interface HomeworldData {
  name: string;
  terrain: string;
  climate: string;
  population: string;
}

interface CharacterModalProps {
  person: Person | null;
  speciesName?: string;
  speciesColor?: {
    bg: string;
    text: string;
    border: string;
    gradient: string;
  };
  onClose: () => void;
}

export const CharacterModal: React.FC<CharacterModalProps> = ({
  person,
  speciesName = 'Human',
  speciesColor,
  onClose,
}) => {
  const [homeworld, setHomeworld] = useState<HomeworldData | null>(null);
  const [loadingHomeworld, setLoadingHomeworld] = useState<boolean>(false);
  const [homeworldError, setHomeworldError] = useState<string | null>(null);

  useEffect(() => {
    if (!person || !person.homeworld) return;

    let isMounted = true;
    setLoadingHomeworld(true);
    setHomeworldError(null);

    axios
      .get<HomeworldData>(person.homeworld)
      .then((res) => {
        if (isMounted) {
          setHomeworld(res.data);
        }
      })
      .catch((err) => {
        console.error('Error fetching homeworld:', err);
        if (isMounted) {
          setHomeworldError('Could not load homeworld details');
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoadingHomeworld(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [person]);

  if (!person) return null;

  const formattedHeight = () => {
    if (!person.height || person.height === 'unknown') return 'Unknown';
    const heightNum = parseFloat(person.height);
    if (isNaN(heightNum)) return person.height;
    return `${(heightNum / 100).toFixed(2)} m`;
  };

  const formattedMass = () => {
    if (!person.mass || person.mass === 'unknown') return 'Unknown';
    return `${person.mass} kg`;
  };

  const formattedDateAdded = () => {
    if (!person.created) return 'N/A';
    try {
      return format(parseISO(person.created), 'dd-MM-yyyy');
    } catch {
      return person.created;
    }
  };

  const idMatch = person.url ? person.url.match(/\/people\/(\d+)\/?$/) : null;
  const personId = idMatch ? idMatch[1] : '1';
  const picsumUrl = `https://picsum.photos/seed/${encodeURIComponent(person.name)}/600/600`;
  const layoutKey = person.url || person.name;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
        {/* Backdrop Fade */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Modal Dialog with Shared Layout Animation */}
        <motion.div
          layoutId={`card-container-${layoutKey}`}
          transition={{
            type: 'spring',
            stiffness: 350,
            damping: 30,
            mass: 0.8,
          }}
          className="bg-white border-4 border-black rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-2xl max-h-[90vh] overflow-y-auto relative p-6 sm:p-8 text-black z-10 will-change-transform"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-5 right-5 p-2 rounded-xl border-2 border-black bg-yellow-300 hover:bg-yellow-400 text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer z-20"
          >
            <X className="w-5 h-5 stroke-[3]" />
          </motion.button>

          {/* Modal Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-6 pb-6 border-b-2 border-black pr-10">
            {/* Avatar frame */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl rounded-tr-[44px] border-2 border-black overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0 bg-neutral-100">
              <img
                src={picsumUrl}
                alt={person.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                    speciesColor?.bg || 'bg-amber-100'
                  } ${speciesColor?.text || 'text-amber-900'}`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {speciesName}
                </span>
                <span className="text-xs font-bold text-neutral-500 font-mono">
                  #{personId}
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-black tracking-tight leading-tight">
                {person.name}
              </h2>
            </div>
          </div>

          {/* Inner Content Animation */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.08, duration: 0.2 }}
          >
            {/* Attributes Grid */}
            <div className="mb-8">
              <h3 className="text-xs font-black uppercase tracking-wider text-neutral-500 mb-3 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-black" />
                Character Details
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-neutral-50 border-2 border-black p-3.5 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-600 mb-1">
                    <Ruler className="w-4 h-4 text-black" />
                    <span>Height</span>
                  </div>
                  <div className="text-lg font-black text-black">{formattedHeight()}</div>
                </div>

                <div className="bg-neutral-50 border-2 border-black p-3.5 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-600 mb-1">
                    <Weight className="w-4 h-4 text-black" />
                    <span>Mass</span>
                  </div>
                  <div className="text-lg font-black text-black">{formattedMass()}</div>
                </div>

                <div className="bg-neutral-50 border-2 border-black p-3.5 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-600 mb-1">
                    <Calendar className="w-4 h-4 text-black" />
                    <span>Birth Year</span>
                  </div>
                  <div className="text-lg font-black text-black">{person.birth_year}</div>
                </div>

                <div className="bg-neutral-50 border-2 border-black p-3.5 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-600 mb-1">
                    <Calendar className="w-4 h-4 text-black" />
                    <span>Date Added</span>
                  </div>
                  <div className="text-base font-black text-black font-mono">
                    {formattedDateAdded()}
                  </div>
                </div>

                <div className="bg-neutral-50 border-2 border-black p-3.5 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-600 mb-1">
                    <Film className="w-4 h-4 text-black" />
                    <span>Films Count</span>
                  </div>
                  <div className="text-lg font-black text-black">
                    {person.films?.length || 0} {person.films?.length === 1 ? 'Film' : 'Films'}
                  </div>
                </div>

                <div className="bg-neutral-50 border-2 border-black p-3.5 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-600 mb-1">
                    <UserCheck className="w-4 h-4 text-black" />
                    <span>Gender</span>
                  </div>
                  <div className="text-lg font-black text-black capitalize">
                    {person.gender}
                  </div>
                </div>
              </div>
            </div>

            {/* Homeworld Info */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-neutral-500 mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4 text-black" />
                Homeworld Information
              </h3>

              {loadingHomeworld && (
                <div className="bg-neutral-50 border-2 border-black rounded-2xl p-6 flex items-center justify-center gap-3 text-neutral-600 font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <Loader2 className="w-5 h-5 animate-spin text-black" />
                  <span>Fetching homeworld details from API...</span>
                </div>
              )}

              {homeworldError && !loadingHomeworld && (
                <div className="bg-red-50 border-2 border-black text-red-700 rounded-2xl p-4 font-bold text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  {homeworldError}
                </div>
              )}

              {homeworld && !loadingHomeworld && (
                <div className="bg-yellow-300/30 border-2 border-black rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="text-xl font-black text-black mb-3 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-black" />
                    <span>{homeworld.name}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-semibold">
                    <div className="bg-white border-2 border-black p-3 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <div className="flex items-center gap-1 text-neutral-500 mb-1 font-bold">
                        <Mountain className="w-3.5 h-3.5 text-black" />
                        <span>Terrain</span>
                      </div>
                      <span className="font-extrabold text-black capitalize">{homeworld.terrain}</span>
                    </div>

                    <div className="bg-white border-2 border-black p-3 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <div className="flex items-center gap-1 text-neutral-500 mb-1 font-bold">
                        <Thermometer className="w-3.5 h-3.5 text-black" />
                        <span>Climate</span>
                      </div>
                      <span className="font-extrabold text-black capitalize">{homeworld.climate}</span>
                    </div>

                    <div className="bg-white border-2 border-black p-3 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <div className="flex items-center gap-1 text-neutral-500 mb-1 font-bold">
                        <Users className="w-3.5 h-3.5 text-black" />
                        <span>Residents</span>
                      </div>
                      <span className="font-extrabold text-black font-mono">
                        {homeworld.population !== 'unknown'
                          ? Number(homeworld.population).toLocaleString()
                          : 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CharacterModal;
