// You must import the icon for it to work
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 w-full border-b border-gray-800 bg-[#0d0d0d]/95 backdrop-blur-sm z-10">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        <img src="/logo.png" alt="logo" height={35} width={35} />
        <FaUserCircle
          size={30}
          className="text-gray-400 hover:text-green-500 transition-colors cursor-pointer"
          // Later, you might add functionality like this:
          // onClick={() => console.log("User icon clicked!")}
        />
      </div>
    </header>
  );
};

export default Navbar;