import { useEffect, useState } from "react";

const slides = [
  {
    title: "Software Engineers Are Being Displaced",
    subtitle: "Automation and restructuring are reshaping tech careers."
  },
  {
    title: "Reskilling Without Direction Fails",
    subtitle: "Popular paths don’t always mean suitable paths."
  },
  {
    title: "AI-Guided Career Transitions",
    subtitle: "Personalised, explainable, skill-based guidance."
  }
];

export default function HeroSlideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 flex items-center justify-center text-center px-6">
      <div>
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
          {slides[index].title}
        </h2>
        <p className="text-red-400 text-lg max-w-xl mx-auto">
          {slides[index].subtitle}
        </p>
      </div>
    </div>
  );
}
