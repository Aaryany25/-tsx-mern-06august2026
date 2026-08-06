import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';

export interface Person {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld: string;
  films?: string[];
  vehicles?: string[];
  starships?: string[];
  species?: string[];
  created?: string;
  edited?: string;
  url: string;
}

export interface SpeciesColorConfig {
  name: string;
  bg: string;
  text: string;
  border: string;
  gradient: string;
}

export const getSpeciesColor = (speciesName: string = 'Human'): SpeciesColorConfig => {
  const normalized = speciesName.toLowerCase();
  
  if (normalized.includes('droid')) {
    return {
      name: speciesName,
      bg: 'bg-cyan-200',
      text: 'text-cyan-950',
      border: 'border-cyan-600',
      gradient: 'from-cyan-300 via-sky-400 to-blue-600',
    };
  }
  if (normalized.includes('wookiee') || normalized.includes('ewok')) {
    return {
      name: speciesName,
      bg: 'bg-orange-200',
      text: 'text-orange-950',
      border: 'border-orange-600',
      gradient: 'from-amber-400 via-orange-500 to-amber-700',
    };
  }
  if (normalized.includes('rodian') || normalized.includes('gungan') || normalized.includes('trandoshan') || normalized.includes('yoda')) {
    return {
      name: speciesName,
      bg: 'bg-emerald-200',
      text: 'text-emerald-950',
      border: 'border-emerald-600',
      gradient: 'from-emerald-300 via-teal-400 to-green-600',
    };
  }
  if (normalized.includes('zabrak') || normalized.includes('hutt') || normalized.includes('twi\'lek')) {
    return {
      name: speciesName,
      bg: 'bg-purple-200',
      text: 'text-purple-950',
      border: 'border-purple-600',
      gradient: 'from-purple-300 via-pink-400 to-rose-600',
    };
  }
  if (normalized.includes('mon calamari') || normalized.includes('kaminoan')) {
    return {
      name: speciesName,
      bg: 'bg-blue-200',
      text: 'text-blue-950',
      border: 'border-blue-600',
      gradient: 'from-blue-300 via-indigo-400 to-violet-600',
    };
  }

  return {
    name: speciesName || 'Human',
    bg: 'bg-amber-200',
    text: 'text-amber-950',
    border: 'border-amber-600',
    gradient: 'from-yellow-300 via-amber-400 to-orange-500',
  };
};

interface CardProps {
  person: Person;
  index: number;
  speciesName?: string;
  isSelected?: boolean;
  onSelect?: () => void;
}

export const Card: React.FC<CardProps> = ({
  person,
  index,
  speciesName = 'Human',
  isSelected = false,
  onSelect,
}) => {
  const idMatch = person.url ? person.url.match(/\/people\/(\d+)\/?$/) : null;
  const personId = idMatch ? idMatch[1] : (index + 1).toString();
  const picsumUrl = `https://picsum.photos/seed/${encodeURIComponent(person.name)}/500/500`;

  const speciesColor = getSpeciesColor(speciesName);
  const layoutKey = person.url || person.name;

  return (
    <motion.div
      layoutId={`card-container-${layoutKey}`}
      onClick={onSelect}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6, scale: 1.015 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: 'spring',
        stiffness: 350,
        damping: 30,
        mass: 0.8,
      }}
      className="group cursor-pointer flex flex-col will-change-transform"
    >
      {/* Photo Frame Container */}
      <div
        className={`relative aspect-square w-full border-2 border-black rounded-xl rounded-tr-[48px] overflow-hidden transition-all duration-300 ${
          isSelected
            ? `bg-gradient-to-tr ${speciesColor.gradient} shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ring-4 ring-yellow-400`
            : `bg-[#f4f4f0] group-hover:bg-gradient-to-tr group-hover:${speciesColor.gradient} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`
        }`}
      >
        {/* Character Image */}
        <img
          src={picsumUrl}
          alt={person.name}
          className="w-full h-full object-cover object-center filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-400 ease-out"
          loading="lazy"
        />

        {/* Index badge */}
        <div className="absolute top-3 left-3 bg-black text-white text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-white/20 shadow-md pointer-events-none">
          #{personId}
        </div>

        {/* Species Tag Badge */}
        <div className="absolute top-3 right-3 pointer-events-none">
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${speciesColor.bg} ${speciesColor.text}`}
          >
            <Sparkles className="w-3 h-3" />
            {speciesColor.name}
          </span>
        </div>
      </div>

      {/* Card Info */}
      <div className="mt-3 flex items-start justify-between gap-2 px-0.5">
        <div>
          <h3 className="text-lg font-extrabold text-black tracking-tight leading-tight group-hover:underline decoration-2">
            {person.name}
          </h3>
          <p className="text-sm font-semibold text-neutral-500 capitalize mt-0.5">
            {person.gender !== 'n/a' && person.gender !== 'none' ? `${person.gender} • ` : ''}
            {person.birth_year !== 'unknown' ? person.birth_year : 'Galactic Era'}
          </p>
        </div>

        {/* Arrow Icon */}
        <motion.div
          whileHover={{ rotate: 45, scale: 1.15 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          className="p-1.5 rounded-xl bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:bg-yellow-300 transition-colors duration-200"
        >
          <ArrowUpRight className="w-5 h-5 stroke-[2.5] text-black" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Card;
