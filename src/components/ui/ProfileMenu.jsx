import { useState, useRef, useEffect } from 'react';
import { FaChevronDown, FaChevronUp, FaUser, FaSignOutAlt } from 'react-icons/fa';

const ProfileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const PROFILE_OPTIONS = [
    { id: 'guest', label: 'مهمان', icon: FaUser },
    { id: 'logout', label: 'خروج', icon: FaSignOutAlt },
  ];

  const getCurrentLabel = () => {
    return 'مهمان';
  };

  const handleSelect = (option) => {
    option.action();
    setIsOpen(false);
  };


  return (
    <div className="relative flex items-center gap-2 flex-row-reverse" ref={dropdownRef}>
      
      {/* Profile button */}
      <div className="relative inline-block">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex flex-row-reverse items-center justify-between gap-4 px-4 py-2 bg-white border border-light-green rounded-3xl shadow-sm transition-colors min-w-[120px] hover:border-green-400"
        >
          <div className="flex items-center gap-2 flex-row-reverse">
            <FaUser className="text-light-green text-sm" />
            <span className="text-light-green">{getCurrentLabel()}</span>
          </div>
          {isOpen ? (
            <FaChevronUp className="text-light-green text-sm" />
          ) : (
            <FaChevronDown className="text-light-green text-sm" />
          )}
        </button>

        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-20 animate-fadeIn">
            {PROFILE_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSelect(option)}
                className="w-full flex items-center justify-between px-4 py-2 transition-colors text-gray-700 hover:bg-gray-100"
              >
                <span>{option.label}</span>
                <option.icon className="text-gray-500 text-sm" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileMenu;