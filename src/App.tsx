import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { lazy, Suspense, useEffect, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import { supabase } from './lib/supabase';
import InquiryPopup from './components/InquiryPopup.jsx';
import WhatsAppFab from './components/WhatsAppFab.jsx';

// Core pages
const Home = lazy(() => import('./pages/Home.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail.jsx'));
const Projects = lazy(() => import('./pages/Projects.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

// SEO / content pages
const PriceList = lazy(() => import('./pages/PriceList.jsx'));
const Faq = lazy(() => import('./pages/Faq.jsx'));
const Testimonials = lazy(() => import('./pages/Testimonials.jsx'));
const Gallery = lazy(() => import('./pages/Gallery.jsx'));
const Blog = lazy(() => import('./pages/Blog.jsx'));
const BlogPost = lazy(() => import('./pages/BlogPost.jsx'));

// Location pages
const LocationHassan = lazy(() => import('./pages/locations/Hassan.jsx'));
const LocationChannarayapatna = lazy(() => import('./pages/locations/Channarayapatna.jsx'));
const LocationHolenarasipura = lazy(() => import('./pages/locations/Holenarasipura.jsx'));
const LocationArsikere = lazy(() => import('./pages/locations/Arsikere.jsx'));
const LocationSakleshpur = lazy(() => import('./pages/locations/Sakleshpur.jsx'));
const LocationBelur = lazy(() => import('./pages/locations/Belur.jsx'));
const LocationNearHims = lazy(() => import('./pages/locations/NearHims.jsx'));
const LocationNearHassanBypass = lazy(() => import('./pages/locations/NearHassanBypass.jsx'));
const LocationNearRailwayStation = lazy(() => import('./pages/locations/NearRailwayStation.jsx'));

// Buyers guide pages
const BuyersGuideIndex = lazy(() => import('./pages/buyers-guide/BuyersGuideIndex.jsx'));
const DtcpApproval = lazy(() => import('./pages/buyers-guide/DtcpApproval.jsx'));
const KhataExplained = lazy(() => import('./pages/buyers-guide/KhataExplained.jsx'));
const StampDuty = lazy(() => import('./pages/buyers-guide/StampDuty.jsx'));
const PlotHomeLoan = lazy(() => import('./pages/buyers-guide/PlotHomeLoan.jsx'));
const NriBuyingGuide = lazy(() => import('./pages/buyers-guide/NriBuyingGuide.jsx'));

// Admin
const AdminAuth = lazy(() => import('./pages/admin/AdminAuth.jsx'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'));

function PageSpinner() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-vvva-orange border-t-transparent rounded-full" />
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<'loading' | 'auth' | 'unauth'>('loading');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setStatus(data.session ? 'auth' : 'unauth');
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setStatus(session ? 'auth' : 'unauth');
    });

    return () => subscription.unsubscribe();
  }, []);

  if (status === 'loading') return <PageSpinner />;
  return status === 'auth' ? <>{children}</> : <Navigate to="/admin" replace />;
}

function PublicLayout() {
  return (
    <>
      <ScrollToTop />
      <InquiryPopup />
      <Navbar />
      <WhatsAppFab />
      <Suspense fallback={<PageSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/price-list" element={<PriceList />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          {/* Location pages */}
          <Route path="/locations/hassan" element={<LocationHassan />} />
          <Route path="/locations/channarayapatna" element={<LocationChannarayapatna />} />
          <Route path="/locations/holenarasipura" element={<LocationHolenarasipura />} />
          <Route path="/locations/arsikere" element={<LocationArsikere />} />
          <Route path="/locations/sakleshpur" element={<LocationSakleshpur />} />
          <Route path="/locations/belur" element={<LocationBelur />} />
          <Route path="/locations/near-hims" element={<LocationNearHims />} />
          <Route path="/locations/near-hassan-bypass" element={<LocationNearHassanBypass />} />
          <Route path="/locations/near-railway-station" element={<LocationNearRailwayStation />} />
          {/* Buyers guide */}
          <Route path="/buyers-guide" element={<BuyersGuideIndex />} />
          <Route path="/buyers-guide/dtcp-approval" element={<DtcpApproval />} />
          <Route path="/buyers-guide/khata-explained" element={<KhataExplained />} />
          <Route path="/buyers-guide/stamp-duty-karnataka-2026" element={<StampDuty />} />
          <Route path="/buyers-guide/plot-home-loan" element={<PlotHomeLoan />} />
          <Route path="/buyers-guide/nri-buying-guide" element={<NriBuyingGuide />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageSpinner />}>
        <Routes>
          <Route path="/admin" element={<AdminAuth />} />
          <Route
            path="/admin/dashboard"
            element={
              <RequireAuth>
                <AdminDashboard />
              </RequireAuth>
            }
          />
          <Route path="/*" element={<PublicLayout />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
