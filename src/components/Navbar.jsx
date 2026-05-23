import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark, faPhone } from '@fortawesome/free-solid-svg-icons';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

const MOBILE_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

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

  const isActive = (to) => {
    if (!to) return false;
    if (to === '/') return location.pathname === '/';
    return location.pathname.startsWith(to);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-200 ${scrolled ? 'shadow-md border-b border-vvva-sand' : 'border-b border-vvva-sand/50'}`}>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <img src="/vvva-logo.png" alt="VVVA Developer — Plots in Hassan"
              className="h-12 w-auto object-contain" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors duration-150 ${
                  isActive(link.to)
                    ? 'text-vvva-orange border-b-2 border-vvva-orange pb-0.5'
                    : 'text-vvva-black hover:text-vvva-orange'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <a href="tel:+919845659193"
              className="flex items-center gap-1.5 text-sm font-semibold text-vvva-orange hover:text-vvva-orange-dark transition-colors">
              <FontAwesomeIcon icon={faPhone} className="text-xs" />
              Talk to Expert
            </a>
            <button
              onClick={() => navigate('/contact')}
              className="bg-vvva-orange hover:bg-vvva-orange-dark text-white text-sm font-semibold px-4 py-2 rounded-btn transition-colors duration-150"
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
            {menuOpen ? <FontAwesomeIcon icon={faXmark} className="text-xl" /> : <FontAwesomeIcon icon={faBars} className="text-xl" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`md:hidden fixed inset-y-0 right-0 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ width: 'min(280px, 100vw)', height: '100vh', overflowY: 'auto' }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-vvva-sand">
          <span className="font-playfair font-bold text-lg text-vvva-black">Menu</span>
          <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <FontAwesomeIcon icon={faXmark} className="text-vvva-black text-xl" />
          </button>
        </div>

        {/* Mobile phone */}
        <div className="px-5 py-3 bg-stone-50 border-b border-vvva-sand">
          <a href="tel:+919845659193" className="flex items-center gap-2 text-sm font-semibold text-vvva-orange">
            <FontAwesomeIcon icon={faPhone} />
            +91 98456 59193
          </a>
        </div>

        <div className="flex flex-col px-5 py-5 gap-4">
          {MOBILE_LINKS.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className={`text-base font-medium transition-colors ${isActive(to) ? 'text-vvva-orange' : 'text-vvva-black hover:text-vvva-orange'}`}
            >
              {label}
            </Link>
          ))}
          <div className="pt-3 border-t border-vvva-sand flex flex-col gap-3">
            <button
              onClick={() => { navigate('/contact'); setMenuOpen(false); }}
              className="bg-vvva-orange hover:bg-vvva-orange-dark text-white font-semibold px-5 py-2.5 rounded-btn transition-colors text-center"
            >
              Enquire Now
            </button>
            <a href="https://wa.me/919845659193?text=Hi%2C%20I%27m%20interested%20in%20VVVA%20Developer%20plots."
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-600 text-white font-semibold px-5 py-2.5 rounded-btn transition-colors">
              <FontAwesomeIcon icon={faWhatsapp} />
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 bg-stone-800/40 z-40" onClick={() => setMenuOpen(false)} />
      )}
    </nav>
  );
}
