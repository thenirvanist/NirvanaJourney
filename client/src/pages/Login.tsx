import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation } from "wouter";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { loginSchema, type LoginData } from "@shared/schema";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SocialAuth } from "@/components/SocialAuth";

export default function Login() {
  const [, navigate] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginData) => {
    setIsLoading(true);
    
    try {
      // Check if Supabase is configured
      if (!supabase) {
        toast({
          title: "Configuration Error",
          description: "Authentication service is not properly configured. Please contact support.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Use Supabase signInWithPassword
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        console.error('Supabase login error:', error);
        
        let errorMessage = "Invalid email or password.";
        if (error.message.includes("Email not confirmed")) {
          errorMessage = "Please verify your email address before logging in.";
        } else if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Invalid email or password. Please try again.";
        } else if (error.message.includes("Too many requests")) {
          errorMessage = "Too many login attempts. Please wait a moment and try again.";
        }

        toast({
          title: "Login Failed",
          description: errorMessage,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (authData.session && authData.user) {
        toast({
          title: "Welcome back!",
          description: "You have been logged in successfully.",
        });

        // Use window.location to force full page reload, ensuring auth state is fresh
        window.location.href = "/";
      }
    } catch (error: any) {
      console.error('Unexpected login error:', error);
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navigation />
      
      <div className="pt-24 pb-20">
        <div className="max-w-md mx-auto px-6">
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" className="mb-4 hover:bg-gray-100">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          <Card className="shadow-xl border-0 overflow-hidden">
            <div className="h-2 brand-primary"></div>
            
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-3xl font-bold text-gray-900">Welcome Back</CardTitle>
              <p className="text-gray-600 mt-2">Sign in to continue your spiritual journey</p>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              {/* Social Authentication Section */}
              <div className="mb-8">
                <SocialAuth 
                  onSuccess={() => navigate("/")}
                  redirectTo={`${window.location.origin}/`}
                />
              </div>

              {/* Divider */}
              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or continue with email</span>
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-semibold">Email Address</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                              type="email"
                              placeholder="Enter your email"
                              className="pl-10 py-3 border-2 border-gray-200 focus:border-[hsl(75,64%,49%)] rounded-lg"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-semibold">Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              className="pl-10 pr-12 py-3 border-2 border-gray-200 focus:border-[hsl(75,64%,49%)] rounded-lg"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Link href="/forgot-password">
                      <button
                        type="button"
                        className="text-[hsl(75,64%,49%)] hover:underline text-sm font-medium"
                      >
                        Forgot your password?
                      </button>
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full brand-primary hover:brand-bright text-white hover:text-black py-3 rounded-lg font-semibold text-lg transition-all duration-300"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </Form>

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <Link href="/register">
                    <button className="text-[hsl(75,64%,49%)] hover:underline font-semibold">
                      Create Account
                    </button>
                  </Link>
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-xs text-center text-gray-500 leading-relaxed">
                  By signing in, you agree to our spiritual community guidelines and 
                  commitment to creating a safe, respectful space for all seekers.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
