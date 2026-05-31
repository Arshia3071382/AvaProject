import { NavLink } from 'react-router-dom';

const SIDEBAR_ITEMS = [
  { path: '/', label: 'تبدیل گفتار', iconSrc: '/images/speech Icon.png' },
  { path: '/archive', label: 'آرشیو', iconSrc: '/images/archive Icon.png' },
];

const Sidebar = () => {
  return (
    
    <aside className="fixed flex flex-col gap-5 text-center right-0 top-0  w-[166] primary-gradient-background shadow-lg z-40 pt-24 h-full rounded-l-lg">

      
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img 
          src="/images/Alefba Group.png"   
          alt="watermark" 
          className="w-48 h-auto opacity-90 grayscale scale-150"
        />
      </div>
        
       
    
      <div className="flex justify-center w-full mb-8 pb-4 relative -top-10 "> 
       <img src="/images/site logo.png" alt="لوگوی سایت" />
      </div>

    
      <nav className="flex flex-col gap-2 px-4 mt-5 ">
        {SIDEBAR_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-row-reverse gap-3 items-center py-3 px-4 rounded-lg text-white transition-colors ${
                isActive
                  ? 'bg-[#02816E] text-white'
                  : 'hover:text-gray-700'
              }`
            }
          >
            <img src={item.iconSrc} alt="navIcon" />

            <span>{item.label} </span> 
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;