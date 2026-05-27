import { useState, useRef, useEffect } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const LanguageSelector = ({ selectedLanguage, onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const LANGUAGE_OPTIONS = [
    { value: 'fa', label: 'فارسی' },
    { value: 'en', label: 'English' },
  ];

  // Get current selected language label
  const getCurrentLabel = () => {
    const current = LANGUAGE_OPTIONS.find(opt => opt.value === selectedLanguage);
    return current ? current.label : 'فارسی';
  };

  // Handle language selection
  const handleSelect = (value) => {
    onLanguageChange(value);
    setIsOpen(false); 
  };

  
 

  return (
    <div className="relative flex items-center gap-2 flex-row-reverse " ref={dropdownRef}>
      
      <span className="text-sm text-gray-600 ml-3">:زبان گفتار</span>
      
      
      <div className="relative inline-block ">
       
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex flex-row-reverse items-center justify-between gap-4 px-4 py-2 bg-white border border-light-green rounded-3xl shadow-sm  transition-colors min-w-[120px]"
        >
          <span className="text-light-green">{getCurrentLabel()}</span>
          {isOpen ? (
            <FaChevronUp className="text-light-green text-sm" />
          ) : (
            <FaChevronDown className="text-light-green text-sm" />
          )}
        </button>

        {/* Dropdown menu - Accordion style */}
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-20 animate-fadeIn">
            {LANGUAGE_OPTIONS.map((lang) => (
              <button
                key={lang.value}
                onClick={() => handleSelect(lang.value)}
                className={`w-full text-right px-4 py-2 transition-colors ${
                  selectedLanguage === lang.value
                    ? 'bg-light-green text-white'
                    : 'text-gray-700 hover:bg-gray-100'
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