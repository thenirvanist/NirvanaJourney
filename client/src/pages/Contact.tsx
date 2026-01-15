import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Clock, MessageCircle, HelpCircle, Heart } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useTranslation } from "@/hooks/useTranslation";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function Contact() {
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactForm) => {
      return apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully!",
        description: "Thank you for reaching out. We'll respond to your message within 24 hours.",
      });
      setIsSubmitted(true);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/contact"] });
    },
    onError: () => {
      toast({
        title: "Failed to send message",
        description: "Please try again or contact us directly via email or phone.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactForm) => {
    contactMutation.mutate(data);
  };

  const subjects = [
    "General Inquiry",
    "Journey/Retreat Information",
    "Spiritual Meetup Questions",
    "Ashram Connections",
    "Sage Wisdom Resources",
    "Technical Support",
    "Partnership Opportunities",
    "Media Inquiries",
  ];

  const faqs = [
    {
      question: "How do I book a spiritual journey?",
      answer: "You can explore our available journeys on the Sacred Journeys page and click 'Begin Your Journey' on any retreat that resonates with you. Our team will then contact you within 24 hours to discuss details, answer questions, and guide you through the booking process."
    },
    {
      question: "What's included in the journey price?",
      answer: "Our journeys follow a transparent pricing model of $299-399 USD plus actual expenses. This covers our comprehensive digital guidance system, AI-generated audio podcasts, detailed itineraries, and 24/7 support. Accommodation, meals, and local transport are additional and vary by destination."
    },
    {
      question: "Are the spiritual meetups really free?",
      answer: "Yes, our weekly online satsangs are completely free. We believe spiritual growth should be accessible to all. You'll join intimate circles of 6-8 people from around the world for meaningful discussions based on teachings from spiritual masters."
    },
    {
      question: "Do I need prior spiritual experience?",
      answer: "Not at all! Our journeys and meetups welcome seekers at all levels. Whether you're just beginning your spiritual exploration or have years of practice, you'll find a supportive community and appropriate guidance for your path."
    },
    {
      question: "How do you ensure authentic spiritual experiences?",
      answer: "We work directly with established ashrams, experienced local guides, and authentic spiritual centers. Our team personally vets each location and experience to ensure they align with genuine spiritual traditions and provide meaningful growth opportunities."
    },
    {
      question: "What if I need to cancel my journey?",
      answer: "We understand that life circumstances can change. Please contact us as soon as possible if you need to cancel. Our cancellation policy varies by journey and timing, but we always work with travelers to find fair solutions."
    },
    {
      question: "Can I travel alone or do I need a group?",
      answer: "Both solo travelers and groups are welcome! Many of our most transformative experiences come from solo journeys, while others find strength in traveling with like-minded companions. We'll help you choose the best option for your needs."
    },
    {
      question: "How do I access the AI guidance and audio content?",
      answer: "After booking, you'll receive access to our digital platform with personalized AI guidance, daily meditation prompts, and location-specific audio content. This technology replaces traditional human guides while providing 24/7 support throughout your journey."
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">{t("pages.contact.title")}</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            {t("pages.contact.subtitle")}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Send Us a Message</CardTitle>
                <p className="text-gray-600 text-center">
                  Share your thoughts, questions, or spiritual insights with us
                </p>
              </CardHeader>
              <CardContent className="p-8">
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="text-white text-2xl" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-[hsl(75,64%,49%)]">Message Received!</h3>
                    <p className="text-gray-600 mb-6">
                      Thank you for reaching out to us. Your message has been received and one of our guides 
                      will respond within 24 hours. We appreciate your connection to our spiritual community.
                    </p>
                    <Button 
                      onClick={() => setIsSubmitted(false)}
                      variant="outline"
                      className="border-[hsl(75,64%,49%)] text-[hsl(75,64%,49%)] hover:bg-[hsl(75,64%,49%)] hover:text-white"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("pages.contact.form.name")}</FormLabel>
                              <FormControl>
                                <Input placeholder={t("pages.contact.form.name")} {...field} />
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
                      </div>

                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a subject" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {subjects.map((subject) => (
                                  <SelectItem key={subject} value={subject}>
                                    {subject}
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
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Share your thoughts, questions, or spiritual insights..."
                                className="min-h-32"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        disabled={contactMutation.isPending}
                        className="w-full brand-primary hover:brand-bright text-white hover:text-black py-3 text-lg font-semibold transition-all duration-300"
                      >
                        {contactMutation.isPending ? "Sending Message..." : "Send Message"}
                      </Button>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            
            {/* Contact Details */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="text-[hsl(75,64%,49%)]" />
                  <span>Get in Touch</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="text-[hsl(75,64%,49%)] w-5 h-5" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-gray-600">hello@thenirvanist.com</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="text-[hsl(75,64%,49%)] w-5 h-5" />
                  <div>
                    <p className="font-medium">Response Time</p>
                    <p className="text-sm text-gray-600">Within 24 hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl text-center flex items-center justify-center space-x-2">
                <HelpCircle className="text-[hsl(75,64%,49%)]" />
                <span>Frequently Asked Questions</span>
              </CardTitle>
              <p className="text-gray-600 text-center">
                Find answers to common questions about our spiritual journeys and services
              </p>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg">
                    <AccordionTrigger className="px-6 py-4 text-left hover:no-underline hover:bg-gray-50">
                      <span className="font-medium">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
