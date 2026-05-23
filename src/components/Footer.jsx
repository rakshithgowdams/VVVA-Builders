import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faLocationDot, faClock } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp, faInstagram, faFacebook, faYoutube } from '@fortawesome/free-brands-svg-icons';

const QUICK_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'All Projects', to: '/projects' },
  { label: 'Price List', to: '/price-list' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Contact Us', to: '/contact' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Testimonials', to: '/testimonials' },
];

const LOCATION_LINKS = [
  { label: 'Plots in Hassan', to: '/locations/hassan' },
  { label: 'Plots in Channarayapatna', to: '/locations/channarayapatna' },
  { label: 'Plots in Holenarasipura', to: '/locations/holenarasipura' },
  { label: 'Near HIMS Hospital', to: '/locations/near-hims' },
  { label: 'Near Hassan Bypass', to: '/locations/near-hassan-bypass' },
  { label: 'Plots in Belur', to: '/locations/belur' },
  { label: 'Plots in Sakleshpur', to: '/locations/sakleshpur' },
];

const GUIDE_LINKS = [
  { label: "Buyer's Guide", to: '/buyers-guide' },
  { label: 'DTCP Approval Guide', to: '/buyers-guide/dtcp-approval' },
  { label: 'Khata A vs B', to: '/buyers-guide/khata-explained' },
  { label: 'Stamp Duty 2026', to: '/buyers-guide/stamp-duty-karnataka-2026' },
  { label: 'Plot Loan Guide', to: '/buyers-guide/plot-home-loan' },
  { label: 'NRI Buying Guide', to: '/buyers-guide/nri-buying-guide' },
];

const TRUST_BADGES = [
  { label: 'DTCP Approved', icon: '✓' },
  { label: 'RERA Registered', icon: '✓' },
  { label: 'Clear Title', icon: '✓' },
  { label: 'Bank Loan Available', icon: '✓' },
];

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-white">
      <div className="h-[3px] bg-gradient-to-r from-vvva-orange to-amber-400" />

      {/* Trust badges bar */}
      <div className="bg-stone-800 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {TRUST_BADGES.map((badge) => (
              <div key={badge.label} className="flex items-center gap-1.5 text-xs text-white/60">
                <span className="text-vvva-orange font-bold">{badge.icon}</span>
                <span>{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand + NAP */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/">
              <img src="/vvva-logo.png" alt="VVVA Developer — Residential Plots Hassan Karnataka"
                className="h-16 w-auto object-contain rounded-lg mb-4" />
            </Link>
            <p className="text-sm text-white/60 leading-relaxed mb-4 max-w-xs">
              VVVA Developer — Hassan's most trusted residential plot developer since 2015. DTCP & RERA-approved layouts across Hassan district.
            </p>

            {/* NAP (Name Address Phone) — important for local SEO */}
            <address className="not-italic space-y-2.5">
              <div className="flex items-start gap-2.5">
                <FontAwesomeIcon icon={faLocationDot} className="text-vvva-orange text-sm mt-0.5 shrink-0" />
                <p className="text-xs text-white/50 leading-relaxed">
                  Opp Canara Bank, Near MCE College,<br />
                  Salagame Road, Hassan – 573201,<br />
                  Karnataka, India
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <FontAwesomeIcon icon={faPhone} className="text-vvva-orange text-sm shrink-0" />
                <div className="space-y-0.5">
                  <a href="tel:+919845659193" className="block text-xs text-white/60 hover:text-vvva-orange transition-colors">+91 98456 59193</a>
                  <a href="tel:+917204401456" className="block text-xs text-white/60 hover:text-vvva-orange transition-colors">+91 72044 01456</a>
                  <a href="tel:+919353640323" className="block text-xs text-white/60 hover:text-vvva-orange transition-colors">+91 93536 40323</a>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <FontAwesomeIcon icon={faClock} className="text-vvva-orange text-sm shrink-0" />
                <p className="text-xs text-white/50">Mon–Sat: 9:00 AM – 7:00 PM</p>
              </div>
            </address>

            {/* Social */}
            <div className="flex items-center gap-3 mt-4">
              <a href="https://wa.me/919845659193" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors"
                aria-label="WhatsApp VVVA Developer">
                <FontAwesomeIcon icon={faWhatsapp} className="text-sm" />
              </a>
              <a href="https://www.instagram.com/vvva_developer" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Instagram VVVA Developer">
                <FontAwesomeIcon icon={faInstagram} className="text-sm" />
              </a>
              <a href="https://www.facebook.com/vvvadeveloper" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Facebook VVVA Developer">
                <FontAwesomeIcon icon={faFacebook} className="text-sm" />
              </a>
              <a href="https://www.youtube.com/@vvvadeveloper" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="YouTube VVVA Developer">
                <FontAwesomeIcon icon={faYoutube} className="text-sm" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-playfair font-semibold text-base text-white mb-4">Quick Links</h3>
            <ul className="flex flex-col gap-2">
              {QUICK_LINKS.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-xs text-white/50 hover:text-vvva-orange transition-colors duration-150">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h3 className="font-playfair font-semibold text-base text-white mb-4">Locations</h3>
            <ul className="flex flex-col gap-2">
              {LOCATION_LINKS.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-xs text-white/50 hover:text-vvva-orange transition-colors duration-150">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Guides */}
          <div>
            <h3 className="font-playfair font-semibold text-base text-white mb-4">Buyer Guides</h3>
            <ul className="flex flex-col gap-2">
              {GUIDE_LINKS.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-xs text-white/50 hover:text-vvva-orange transition-colors duration-150">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/25 text-center sm:text-left">
            &copy; 2026 VVVA Developer. All rights reserved. | RERA Reg. No.: On request
          </p>
          <p className="text-xs text-white/25 text-center sm:text-right">
            Designed &amp; Developed by{' '}
            <a href="https://www.mydesignnexus.in" target="_blank" rel="noopener noreferrer"
              className="text-white/40 hover:text-vvva-orange transition-colors duration-150">
              www.mydesignnexus.in
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
