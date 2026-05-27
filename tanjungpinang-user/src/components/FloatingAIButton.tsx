import { useLocation } from "wouter";
import { Sparkles } from "lucide-react";
import { isLoggedIn } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

export default function FloatingAIButton() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const authenticated = isLoggedIn();

  const isOnAIPage = location.startsWith("/ai-itinerary");

  const handleClick = () => {
    if (!authenticated) {
      toast({
        title: "Login Diperlukan",
        description: "Silakan login terlebih dahulu untuk menggunakan AI Itinerary.",
        variant: "destructive",
      });
      setTimeout(() => setLocation("/login"), 1200);
      return;
    }
    setLocation("/ai-itinerary");
  };

  if (isOnAIPage) return null;

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-3 text-white font-medium shadow-lg shadow-primary/40 hover:scale-105 hover:shadow-xl transition-all duration-300 animate-pulse outline-none"
      aria-label="AI Itinerary Planner"
    >
      <Sparkles className="w-5 h-5" />
      <span>AI Itinerary</span>
    </button>
  );
}
