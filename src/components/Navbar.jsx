import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'About Us', to: '/about' },
    { label: 'Contact Us', to: '/contact' },
  ];

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname.startsWith(to);
  };

  const handleEnquire = () => {
    navigate('/contact');
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-200 ${
        scrolled ? 'shadow-md border-b border-vvva-sand' : 'border-b border-vvva-sand/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <img
              src="/files_2806306-2026-05-23T05-46-35-685Z-WhatsApp_Image_2026-05-03_at_22.45.12.jpeg"
              alt="VVVA Developer"
              className="h-14 w-auto object-contain"
            />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className={`text-sm font-medium transition-colors duration-150 ${
                  isActive(to)
                    ? 'text-vvva-orange border-b-2 border-vvva-orange pb-0.5'
                    : 'text-vvva-black hover:text-vvva-orange'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <button
              onClick={handleEnquire}
              className="bg-vvva-orange hover:bg-vvva-orange-dark text-white text-sm font-semibold px-5 py-2 rounded-btn transition-colors duration-150"
            >
              Enquire Now
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-btn text-vvva-black hover:text-vvva-orange transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`md:hidden fixed inset-y-0 right-0 w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-vvva-sand">
          <span className="font-playfair font-bold text-lg text-vvva-black">Menu</span>
          <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <X size={22} className="text-vvva-black" />
          </button>
        </div>
        <div className="flex flex-col px-5 py-6 gap-5">
          {navLinks.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className={`text-base font-medium transition-colors ${
                isActive(to) ? 'text-vvva-orange' : 'text-vvva-black hover:text-vvva-orange'
              }`}
            >
              {label}
            </Link>
          ))}
          <button
            onClick={() => { handleEnquire(); setMenuOpen(false); }}
            className="mt-2 bg-vvva-orange hover:bg-vvva-orange-dark text-white font-semibold px-5 py-2.5 rounded-btn transition-colors"
          >
            Enquire Now
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-stone-800/40 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </nav>
  );
}
