import { useState, useEffect } from "react";
import { getRandomQuote } from "@/lib/quotes";
import { Sparkles } from "lucide-react";

const QuoteSection = () => {
  const [quote, setQuote] = useState(getRandomQuote);

  useEffect(() => {
    const interval = setInterval(() => setQuote(getRandomQuote()), 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card p-5 text-center animate-fade-in">
      <Sparkles size={18} className="mx-auto mb-2 text-primary" />
      <p className="text-sm text-muted-foreground italic leading-relaxed">{quote}</p>
    </div>
  );
};

export default QuoteSection;
