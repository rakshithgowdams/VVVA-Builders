import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebook, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
  const quickLinks = [
    { label: 'Home', to: '/' },
    { label: 'About Us', to: '/about' },
    { label: 'Contact Us', to: '/contact' },
    { label: 'Projects', to: '/#projects' },
  ];

  return (
    <footer className="bg-stone-800 text-white">
      <div className="h-[3px] bg-vvva-orange" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div>
              <img
                src="/vvva-logo.png"
                alt="VVVA Developer"
                className="h-20 w-auto object-contain rounded-lg"
              />
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              Premium residential plots in Bengaluru. Building dreams, creating communities.
            </p>
            <p className="text-xs text-white/40 mt-2">
              &copy; 2025 VVVA Developer. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-playfair font-semibold text-base text-white mb-4">Quick Links</h3>
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-sm text-white/60 hover:text-vvva-orange transition-colors duration-150"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social + Contact */}
          <div>
            <h3 className="font-playfair font-semibold text-base text-white mb-4">Connect With Us</h3>
            <div className="flex items-center gap-4 mb-5">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-vvva-orange hover:text-vvva-orange-light transition-colors"
                aria-label="VVVA Developer on Instagram"
              >
                <FontAwesomeIcon icon={faInstagram} className="text-xl" />
              </a>
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="text-vvva-orange hover:text-vvva-orange-light transition-colors"
                aria-label="VVVA Developer on WhatsApp"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="text-xl" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-vvva-orange hover:text-vvva-orange-light transition-colors"
                aria-label="VVVA Developer on Facebook"
              >
                <FontAwesomeIcon icon={faFacebook} className="text-xl" />
              </a>
            </div>
            <div className="text-sm text-white/60 space-y-1.5">
              <p>+91 99999 99999</p>
              <p>info@vvvadeveloper.com</p>
              <p>Bengaluru, Karnataka, India</p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-xs text-white/30 text-center">
            VVVA Developer — Trusted residential plot developer in Bengaluru since 2015.
          </p>
        </div>
      </div>
    </footer>
  );
}
