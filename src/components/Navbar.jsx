import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const location = useLocation();
  const navRef = useRef(null);

  const aboutSubLinks = [
    { name: 'Profil Lembaga', href: '/tentang/profil' },
    { name: 'Visi Misi', href: '/tentang/visi-misi' },
    { name: 'Legalitas', href: '/tentang/legalitas' },
    { name: 'Tim Pengajar', href: '/tentang/tim-kami' },
    { name: 'Fasilitas', href: '/tentang/fasilitas' },
  ];

  const navigation = [
    { name: 'Beranda', href: '/' },
    { name: 'Tentang Kami', href: '/tentang-kami', type: 'dropdown', subLinks: aboutSubLinks, id: 'about' },
    { name: 'Program Jepang', href: '/program-jepang' },
    { name: 'Proses ke Jepang', href: '/proses-ke-jepang' },
    { name: 'Alumni', href: '/alumni' },
    { name: 'Galeri', href: '/galeri' },
    { name: 'Lowker', href: '/lowker' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Daftar', href: '/daftar' },
    { name: 'Login', href: '/login' },
  ];

  const isActive = (href) => {
    const [path, query] = href.split('?');
    if (location.pathname !== path) return false;
    if (!query) return true;
    return location.search === `?${query}`;
  };
  const isParentActive = (subLinks) => subLinks.some((link) => isActive(link.href));

  const toggleDropdown = (id) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenDropdown(null);
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav ref={navRef} className="bg-white shadow-lg fixed w-full z-50 top-0">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-base lg:text-sm xl:text-lg 2xl:text-xl font-bold text-blue-600">
                <span className="flex items-center gap-2">
                  <img
                    src="/logo.png"
                    alt="Creativa Bridging International"
                    className="h-10 w-10 md:h-11 md:w-11 xl:h-12 xl:w-12 object-contain"
                  />
                  <span className="md:hidden xl:inline">CREATIVA BRIDGING INTERNATIONAL</span>
                  <span className="hidden md:inline xl:hidden">CREATIVA</span>
                </span>
              </Link>
            </div>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {navigation.map((item) => {
              if (item.type === 'dropdown') {
                const active = isActive(item.href) || isParentActive(item.subLinks);
                return (
                  <div key={item.name} className="relative">
                    <div
                      className={`flex items-center rounded-md transition-colors duration-200 ${
                        active ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Link
                        to={item.href}
                        onClick={() => setOpenDropdown(null)}
                        className="px-1 md:px-1 xl:px-2 py-2 rounded-md text-xs md:text-xs xl:text-sm font-medium"
                      >
                        {item.name}
                      </Link>
                      <button
                        type="button"
                        aria-expanded={openDropdown === item.id}
                        onClick={() => toggleDropdown(item.id)}
                        className="py-2 pr-1 md:pr-1 xl:pr-2 focus:outline-none"
                      >
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${openDropdown === item.id ? 'transform rotate-180' : ''}`}
                        />
                      </button>
                    </div>
                    {openDropdown === item.id && (
                      <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 z-50">
                        {item.subLinks.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                              isActive(subItem.href) ? 'bg-gray-50 text-blue-600 font-medium' : ''
                            }`}
                            onClick={() => setOpenDropdown(null)}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-1 md:px-1 xl:px-2 py-2 rounded-md text-xs md:text-xs xl:text-sm font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => {
                setIsOpen(!isOpen);
                setOpenDropdown(null);
              }}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 max-h-[80vh] overflow-y-auto">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item) => {
              if (item.type === 'dropdown') {
                const active = isActive(item.href) || isParentActive(item.subLinks);
                return (
                  <div key={item.name} className="space-y-1">
                    <div
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium ${
                        active ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Link
                        to={item.href}
                        onClick={() => {
                          setIsOpen(false);
                          setOpenDropdown(null);
                        }}
                        className="flex-1"
                      >
                        {item.name}
                      </Link>
                      <button
                        type="button"
                        aria-expanded={openDropdown === item.id}
                        onClick={() => toggleDropdown(item.id)}
                        className="ml-2 p-1 focus:outline-none"
                      >
                        <ChevronDown
                          className={`h-5 w-5 transition-transform duration-200 ${openDropdown === item.id ? 'transform rotate-180' : ''}`}
                        />
                      </button>
                    </div>
                    {openDropdown === item.id && (
                      <div className="pl-4 space-y-1">
                        {item.subLinks.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            onClick={() => {
                              setIsOpen(false);
                              setOpenDropdown(null);
                            }}
                            className={`block px-3 py-2 rounded-md text-sm font-medium ${
                              isActive(subItem.href) ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
                            }`}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive(item.href)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
