'use client';

import { useState, useRef, useEffect, useMemo } from 'react';

interface SearchableCitySelectProps {
  name: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
}

export default function SearchableCitySelect({
  name,
  placeholder = 'Select your city',
  value,
  onChange,
  required = false,
  disabled = false
}: SearchableCitySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [internalCity, setInternalCity] = useState(value || '');
  
  // Sync internal state if controlled
  useEffect(() => {
    if (value !== undefined) {
      setInternalCity(value);
    }
  }, [value]);

  const selectedCity = value !== undefined ? value : internalCity;
  const [cities, setCities] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Dynamic import for performance (Code Splitting)
  useEffect(() => {
    import('../utils/cityData').then((mod) => {
      setCities(mod.CITIES);
    });
  }, []);

  // Filter logic
  const filteredCities = useMemo(() => {
    if (!searchTerm) return cities;
    const lowerSearch = searchTerm.toLowerCase();
    const matches = cities.filter(city => 
      city.toLowerCase().includes(lowerSearch)
    );
    
    // Always include 'Others' if searching and not already in matches
    if (matches.length === 0 || !matches.includes('Others')) {
      const others = cities.find(c => c === 'Others');
      if (others) matches.push(others);
    }
    
    return matches;
  }, [searchTerm, cities]);

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: string) => {
    if (onChange) {
      onChange(city);
    } else {
      setInternalCity(city);
    }
    setSearchTerm('');
    setIsOpen(false);
  };

  const inputCls = `
    w-full px-4 py-3 rounded-xl border border-[#D6ECEB] bg-white
    text-[#09263F] text-sm placeholder-[#9BBAC0]
    focus:outline-none focus:ring-2 focus:ring-[#1DE5B5]/40 focus:border-[#1DE5B5]
    transition-all duration-200 cursor-pointer
  `.trim();

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Hidden input to ensure FormData picks up the value */}
      <input type="hidden" name={name} value={selectedCity} required={required} />
      
      <div 
        className={`relative ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <input
          type="text"
          readOnly
          value={selectedCity || ''}
          placeholder={placeholder}
          className={inputCls}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-200" style={{ transform: `translateY(-50%) rotate(${isOpen ? '180deg' : '0deg'})` }}>
          <svg className="w-4 h-4 text-[#4A6275]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-[#D6ECEB] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2 border-b border-[#F0F7F7]">
            <input
              ref={inputRef}
              type="text"
              autoFocus
              placeholder="Search your city..."
              className="w-full px-4 py-2 bg-[#F4FAFA] rounded-xl text-sm focus:outline-none border border-transparent focus:border-[#1DE5B5]/30"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          <div className="max-h-[250px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#D6ECEB] scrollbar-track-transparent">
            {filteredCities.length > 0 ? (
              filteredCities.map((city) => (
                <div
                  key={city}
                  className={`
                    px-4 py-2.5 text-sm cursor-pointer transition-colors
                    ${selectedCity === city ? 'bg-[#1DE5B5]/10 text-[#09263F] font-bold' : 'text-[#4A6275] hover:bg-[#F4FAFA]'}
                  `}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(city);
                  }}
                >
                  {city}
                </div>
              ))
            ) : (
              <div 
                className="px-4 py-3 text-sm text-[#4A6275] hover:bg-[#F4FAFA] cursor-pointer italic"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect('Others');
                }}
              >
                City not found? Select "Others"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
