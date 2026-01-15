import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Video, Users, Globe, Heart, Calendar, Clock } from "lucide-react";
import Seo from "@/components/Seo";
import SchemaOrg, { createBreadcrumbSchema } from "@/components/SchemaOrg";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import satsangImage from "@assets/Satsang_4_1768371365026.png";

const meetupsBreadcrumb = createBreadcrumbSchema([
  { name: "Home", url: "https://www.thenirvanist.com" },
  { name: "Satsangs" }
]);

const registrationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  country: z.string().min(2, "Please select your country"),
  timezone: z.string().min(2, "Please select your timezone"),
  interestedInTravel: z.boolean().default(false),
});

type RegistrationForm = z.infer<typeof registrationSchema>;

export default function Meetups() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      email: "",
      country: "",
      timezone: "",
      interestedInTravel: false,
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegistrationForm) => {
      return apiRequest("POST", "/api/meetups/register", data);
    },
    onSuccess: () => {
      toast({
        title: "Welcome to our spiritual circle!",
        description: "You've successfully registered for our global satsangs. We'll send you the meeting details soon.",
      });
      setIsSubmitted(true);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/meetups"] });
    },
    onError: () => {
      toast({
        title: "Registration failed",
        description: "Please try again or contact our support team for assistance.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RegistrationForm) => {
    registerMutation.mutate(data);
  };

  const timezones = [
    "UTC-12:00 (Baker Island)",
    "UTC-11:00 (American Samoa)",
    "UTC-10:00 (Hawaii)",
    "UTC-09:00 (Alaska)",
    "UTC-08:00 (Pacific Time)",
    "UTC-07:00 (Mountain Time)",
    "UTC-06:00 (Central Time)",
    "UTC-05:00 (Eastern Time)",
    "UTC-04:00 (Atlantic Time)",
    "UTC-03:00 (Argentina)",
    "UTC-02:00 (South Georgia)",
    "UTC-01:00 (Azores)",
    "UTC+00:00 (London, Dublin)",
    "UTC+01:00 (Paris, Berlin)",
    "UTC+02:00 (Cairo, Athens)",
    "UTC+03:00 (Moscow, Nairobi)",
    "UTC+04:00 (Dubai, Mauritius)",
    "UTC+05:00 (Pakistan)",
    "UTC+05:30 (India, Sri Lanka)",
    "UTC+06:00 (Bangladesh)",
    "UTC+07:00 (Thailand, Vietnam)",
    "UTC+08:00 (China, Singapore)",
    "UTC+09:00 (Japan, Korea)",
    "UTC+10:00 (Australia East)",
    "UTC+11:00 (Solomon Islands)",
    "UTC+12:00 (New Zealand)",
  ];

  const countries = [
    "Afghanistan", "Albania", "Algeria", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
    "Bahrain", "Bangladesh", "Belarus", "Belgium", "Brazil", "Bulgaria", "Cambodia", "Canada",
    "Chile", "China", "Colombia", "Croatia", "Czech Republic", "Denmark", "Ecuador", "Egypt",
    "Estonia", "Finland", "France", "Georgia", "Germany", "Ghana", "Greece", "Hungary",
    "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Japan",
    "Jordan", "Kazakhstan", "Kenya", "South Korea", "Kuwait", "Latvia", "Lebanon", "Lithuania",
    "Luxembourg", "Malaysia", "Mauritius", "Mexico", "Morocco", "Nepal", "Netherlands", "New Zealand",
    "Norway", "Pakistan", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia",
    "Saudi Arabia", "Singapore", "Slovakia", "Slovenia", "South Africa", "Spain", "Sri Lanka",
    "Sweden", "Switzerland", "Thailand", "Turkey", "Ukraine", "United Arab Emirates", "United Kingdom",
    "United States", "Uruguay", "Venezuela", "Vietnam"
  ];

  return (
    <div className="min-h-screen">
      <Seo 
        title="Satsangs - Global Online Spiritual Gatherings & Community"
        description="Join our global community for weekly online satsangs and spiritual gatherings. Connect with seekers worldwide for meditation, reflection, and spiritual growth."
      />
      <SchemaOrg schema={meetupsBreadcrumb} />
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center bg-cover bg-center bg-no-repeat" 
               style={{backgroundImage: `url(${satsangImage})`}}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <h1 className="text-6xl font-bold mb-6">Satsangs</h1>
          <h2 className="text-2xl font-semibold mb-4 text-[hsl(70,71%,62%)]">
            Join a Global Circle of Spiritual Seekers
          </h2>
          <p className="text-xl mb-8 opacity-90 leading-relaxed">
            Weekly online satsangs to pause, reflect, and grow — together starting April 2026.
          </p>
          <Button className="brand-primary hover:brand-bright text-white hover:text-black px-8 py-4 text-lg rounded-lg font-semibold transition-all duration-300">
            Join Our Community
          </Button>
        </div>
      </section>

      {/* What is a Satsang Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">What is a 'Satsang'?</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              The word satsang comes from two Sanskrit roots: sat, meaning truth, purity, or the real, and sanga/sangha, meaning company, association, or community. Put together, satsang means associating with people and teachings that reflect spiritual reality rather than ignorance.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Traditionally, a satsang is an audience with an enlightened teacher who provides spiritual instruction. However, in modern contexts, satsang can mean any gathering of people for the purpose of discussing, practicing, or contemplating spirituality.
            </p>
          </div>
          
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">What Happens in a Satsang?</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="text-white text-2xl" />
              </div>
              <h3 className="font-semibold text-lg mb-3">🧘‍♀️ Short Guru Video</h3>
              <p className="text-gray-600 leading-relaxed">
                Each Sunday, we gather online to watch a short video from a spiritual master — 
                Ramana Maharshi, Sri Aurobindo, Anandamayi Ma, and others.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-white text-2xl" />
              </div>
              <h3 className="font-semibold text-lg mb-3">💬 Group Reflection</h3>
              <p className="text-gray-600 leading-relaxed">
                Then, you're placed into a private virtual circle of 6–8 people from around the world.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="text-white text-2xl" />
              </div>
              <h3 className="font-semibold text-lg mb-3">🌍 Global Community</h3>
              <p className="text-gray-600 leading-relaxed">
                Together, you reflect on what touched you, what challenged you, and how to live 
                these teachings more deeply.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Matters Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Why Join a Satsang?</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Heart className="text-[hsl(75,64%,49%)] text-2xl mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Inner Clarity</h3>
                    <p className="text-gray-600">Discover calm and insight through the wisdom of great teachers.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Users className="text-[hsl(75,64%,49%)] text-2xl mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Human Connection</h3>
                    <p className="text-gray-600">Connect deeply with others on the same path.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Calendar className="text-[hsl(75,64%,49%)] text-2xl mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Soulful Consistency</h3>
                    <p className="text-gray-600">One gentle hour each week, dedicated to growth.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <img 
                src={satsangImage} 
                alt="Satsang: Truth, Love, Community gathering" 
                className="rounded-xl shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Who Is It For Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-8">You'll Feel at Home If You...</h2>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 brand-primary rounded-full"></div>
                <span>Are curious about Eastern spirituality</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 brand-primary rounded-full"></div>
                <span>Want to bring calm and meaning into your week</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 brand-primary rounded-full"></div>
                <span>Prefer small, thoughtful circles over large noisy groups</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 brand-primary rounded-full"></div>
                <span>Crave spiritual depth without dogma</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-2xl mx-auto px-6">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold mb-4">Join Our Next Satsang</CardTitle>
              <p className="text-gray-600">
                Every Sunday at various times to accommodate global participants
              </p>
            </CardHeader>
            <CardContent className="p-8">
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="text-white text-2xl" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-[hsl(75,64%,49%)]">Welcome to Our Circle!</h3>
                  <p className="text-gray-600 mb-6">
                    Thank you for joining our global spiritual community. You'll receive an email with 
                    meeting details and preparation guidance within 24 hours.
                  </p>
                  <Button 
                    onClick={() => setIsSubmitted(false)}
                    variant="outline"
                    className="border-[hsl(75,64%,49%)] text-[hsl(75,64%,49%)] hover:bg-[hsl(75,64%,49%)] hover:text-white"
                  >
                    Register Another Person
                  </Button>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Enter your email address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {countries.map((country) => (
                                <SelectItem key={country} value={country}>
                                  {country}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="timezone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Timezone</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your timezone" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {timezones.map((timezone) => (
                                <SelectItem key={timezone} value={timezone}>
                                  {timezone}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="interestedInTravel"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Would you like to be invited for group travel to India in the future?
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={registerMutation.isPending}
                      className="w-full brand-primary hover:brand-bright text-white hover:text-black py-3 text-lg font-semibold transition-all duration-300"
                    >
                      {registerMutation.isPending ? "Joining Circle..." : "Join the Circle"}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
