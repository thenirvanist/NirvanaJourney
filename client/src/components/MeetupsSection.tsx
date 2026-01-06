import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Video, Users, Globe } from "lucide-react";
import { Link } from "wouter";

export default function MeetupsSection() {
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

  return (
    <section ref={sectionRef} id="meetups" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="scroll-trigger">
            <h2 className="text-4xl font-bold mb-6">Satsangs</h2>
            <h3 className="text-2xl font-semibold mb-4 text-[hsl(75,64%,49%)]">Join a Global Circle of Spiritual Seekers</h3>
            <p className="text-lg text-gray-700 mb-6">
              Weekly online meetups to pause, reflect, and grow — together. Each Sunday, we gather online to watch a short video from a spiritual master and then join intimate virtual circles of 6-8 people from around the world.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <Video className="text-[hsl(75,64%,49%)] text-xl" />
                <span>Short inspirational videos from spiritual masters</span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="text-[hsl(75,64%,49%)] text-xl" />
                <span>Small group reflections and discussions</span>
              </div>
              <div className="flex items-center space-x-3">
                <Globe className="text-[hsl(75,64%,49%)] text-xl" />
                <span>Connect with seekers worldwide</span>
              </div>
            </div>
          </div>
          
          <div className="scroll-trigger">
            <img 
              src="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Global spiritual video meetup" 
              className="rounded-xl shadow-lg w-full"
            />
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Link href="/meetups" onClick={() => window.scrollTo(0, 0)}>
            <Button className="brand-primary hover:brand-bright text-white hover:text-black px-8 py-3 rounded-lg font-semibold transition-all duration-300">
              Participate Today
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
