import Sidebar from "./Sidebar";
import ProfileMenu from "../ui/ProfileMenu";
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex  ">
      <div className="mt-12 relative left-10">
        <ProfileMenu />
      </div>

      <main className="flex-1  pr-8 py-8 px-2 lg:px-8">
        <div className="max-w-[1050px] w-full lg:mx-52 relative lg:right-48 ">
          {children}
        </div>
      </main>

      <Sidebar />
    </div>
  );
};

export default Layout;
