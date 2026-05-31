import { useState, useRef, useEffect } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const LanguageSelector = ({ selectedLanguage, onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const LANGUAGE_OPTIONS = [
    { value: 'fa', label: 'فارسی' },
    { value: 'en', label: 'English' },
  ];

  const getCurrentLabel = () => {
    const current = LANGUAGE_OPTIONS.find(opt => opt.value === selectedLanguage);
    return current ? current.label : 'فارسی';
  };

  const handleSelect = (value) => {
    onLanguageChange(value);
    setIsOpen(false); 
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center gap-2 flex-row-reverse" ref={dropdownRef}>
      <span className="text-sm text-gray-600 ml-3">:زبان گفتار</span>
      
      <div className="relative inline-block">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex flex-row-reverse items-center justify-between gap-4 px-4 py-2 bg-white border border-[#00BA9F] rounded-3xl shadow-sm transition-colors min-w-[120px]"
        >
          <span className="text-[#00BA9F] font-semibold">{getCurrentLabel()}</span>
          {isOpen ? (
            <FaChevronUp className="text-[#00BA9F] text-sm" />
          ) : (
            <FaChevronDown className="text-[#00BA9F] text-sm" />
          )}
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-20">
            {LANGUAGE_OPTIONS.map((lang) => (
              <button
                key={lang.value}
                onClick={() => handleSelect(lang.value)}
                className={`w-full text-right px-4 py-2 text-sm transition-colors ${
                  selectedLanguage === lang.value
                    ? 'bg-[#00BA9F] text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageSelector;