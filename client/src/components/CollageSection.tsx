import { useEffect, useRef } from "react";

export default function CollageSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll(".scroll-trigger");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const images = [
    {
      src: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      alt: "Sunrise yoga session"
    },
    {
      src: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      alt: "Ashram architecture"
    },
    {
      src: "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      alt: "Group meditation"
    },
    {
      src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      alt: "Spiritual teacher"
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="scroll-trigger text-center mb-12">
          <h2 className="text-4xl font-bold mb-6">Experience the Journey</h2>
          <p className="text-xl text-gray-600">A glimpse into the transformative experiences awaiting you</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 scroll-trigger">
          {images.map((image, index) => (
            <img
              key={index}
              src={image.src}
              alt={image.alt}
              className="rounded-lg shadow-lg w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
