import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

import Layout from '@/components/admin/Layout';
import Dashboard from '@/pages/admin/Dashboard';
import Destinations from '@/pages/admin/Destinations';
import Users from '@/pages/admin/Users';
import Categories from '@/pages/admin/Categories';
import Gallery from '@/pages/admin/Gallery';
import Reviews from '@/pages/admin/Reviews';
import Visits from '@/pages/admin/Visits';
import HomepageHighlight from '@/pages/admin/HomepageHighlight';
import TravelGuide from '@/pages/admin/TravelGuide';
import Itinerary from '@/pages/admin/Itinerary';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/users" element={<Users />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/visits" element={<Visits />} />
        <Route path="/highlight" element={<HomepageHighlight />} />
        <Route path="/travel-guide" element={<TravelGuide />} />
        <Route path="/itinerary" element={<Itinerary />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App