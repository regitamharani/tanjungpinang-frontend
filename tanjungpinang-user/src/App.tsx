import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useLocation } from "wouter";

import HomePage from "./pages/HomePage";
import DestinationPage from "./pages/DestinationPage";
import DetailDestinasi from "./pages/DetailDestinasi";
import AuthPage from "./pages/AuthPage";
import AccountPage from "./pages/AccountPage";
import AIItineraryPage from "./pages/AIItineraryPage";
import NotFound from "@/pages/not-found";

import Navbar from "./components/layout/Navbar";
import FloatingAIButton from "./components/FloatingAIButton";
import AdminAccessHandler from "./components/AdminAccessHandler";

const queryClient = new QueryClient();

function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const isAuthPage = location === "/login" || location === "/register";
  const isAIItineraryPage = location.startsWith("/ai-itinerary");

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthPage && <Navbar />}

      <main className="flex-1">{children}</main>

      {!isAuthPage && !isAIItineraryPage && <FloatingAIButton />}
    </div>
  );
}

function Router() {
  return (
    <>
      <AdminAccessHandler />

      <Layout>
        <Switch>
          <Route path="/" component={HomePage} />

          <Route path="/destination" component={DestinationPage} />

          <Route path="/destination/:slug" component={DetailDestinasi} />

          <Route path="/login">
            <AuthPage defaultMode="login" />
          </Route>

          <Route path="/register">
            <AuthPage defaultMode="register" />
          </Route>

          <Route path="/account" component={AccountPage} />

          <Route path="/account/riwayat" component={AccountPage} />

          <Route path="/ai-itinerary" component={AIItineraryPage} />

          <Route component={NotFound} />
        </Switch>
      </Layout>
    </>
  );
}

function App() {
  const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={baseUrl}>
          <Router />
        </WouterRouter>

        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;