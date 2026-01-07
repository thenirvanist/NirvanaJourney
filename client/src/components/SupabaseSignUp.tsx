import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { Eye, EyeOff, Mail, Lock, User, CheckCircle, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

// Form validation schema
const signUpSchema = z.object({
  email: z.string().email("Please enter a valid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters").min(1, "Password is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

interface SupabaseSignUpProps {
  onSuccess?: () => void;
  showHeader?: boolean;
  className?: string;
}

export function SupabaseSignUp({ 
  onSuccess,
  showHeader = true,
  className = ""
}: SupabaseSignUpProps) {
  const [, navigate] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [otpValue, setOtpValue] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      // Check if Supabase is configured
      if (!supabase) {
        toast({
          title: "Configuration Error",
          description: "Authentication service is not properly configured.",
          variant: "destructive",
        });
        return;
      }

      // Attempt to sign up the user with Supabase
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
          },
          // Enable email confirmation
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error('Supabase signup error:', error);
        
        let errorMessage = "Registration failed. Please try again.";
        if (error.message.includes("already registered")) {
          errorMessage = "An account with this email already exists.";
        } else if (error.message.includes("password")) {
          errorMessage = "Password requirements not met. Please choose a stronger password.";
        } else if (error.message.includes("email")) {
          errorMessage = "Please provide a valid email address.";
        }

        toast({
          title: "Registration Failed",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      // Check if user was created and needs email confirmation
      if (authData.user && !authData.user.email_confirmed_at) {
        setUserEmail(data.email);
        setIsSignedUp(true);
        
        toast({
          title: "Verification Code Sent!",
          description: "Please check your email for the 6-digit verification code.",
        });
        // Don't call onSuccess here - wait until OTP verification completes
      } else if (authData.user && authData.user.email_confirmed_at) {
        // User was created and auto-confirmed (unlikely in most setups)
        toast({
          title: "Welcome!",
          description: "Your account has been created successfully.",
        });
        onSuccess?.();
        navigate('/dashboard');
      }

    } catch (error: any) {
      console.error('Unexpected signup error:', error);
      toast({
        title: "Registration Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleVerifyOtp = async () => {
    if (otpValue.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter the complete 6-digit verification code.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);

    try {
      if (!supabase) {
        toast({
          title: "Configuration Error",
          description: "Authentication service is not properly configured.",
          variant: "destructive",
        });
        setIsVerifying(false);
        return;
      }

      const { data, error } = await supabase.auth.verifyOtp({
        email: userEmail,
        token: otpValue,
        type: 'signup',
      });

      if (error) {
        console.error('OTP verification error:', error);
        toast({
          title: "Verification Failed",
          description: error.message || "Invalid or expired verification code. Please try again.",
          variant: "destructive",
        });
        setIsVerifying(false);
        return;
      }

      if (data.session && data.user) {
        // Set the session in Supabase client
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });
        
        toast({
          title: "Welcome!",
          description: "Your account has been verified successfully.",
        });
        
        onSuccess?.();
        
        // Use window.location to force full page reload, ensuring auth state is fresh
        window.location.href = '/dashboard';
      } else {
        toast({
          title: "Verification Failed",
          description: "Could not complete verification. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Unexpected OTP verification error:', error);
      toast({
        title: "Verification Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // OTP verification screen
  if (isSignedUp) {
    return (
      <Card className={`shadow-xl border-0 overflow-hidden ${className}`}>
        <div className="h-2 bg-[hsl(75,64%,49%)]"></div>
        
        <CardContent className="px-8 py-12 text-center">
          <div className="w-16 h-16 bg-[hsl(75,64%,49%)] rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="text-white w-8 h-8" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Verify Your Email</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            We've sent a 6-digit verification code to <strong>{userEmail}</strong>.
            Please enter the code below to complete your registration.
          </p>
          
          <div className="flex justify-center mb-6">
            <InputOTP
              maxLength={6}
              value={otpValue}
              onChange={(value) => setOtpValue(value)}
              data-testid="input-otp-verification"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button
            onClick={handleVerifyOtp}
            disabled={isVerifying || otpValue.length !== 6}
            className="w-full bg-[hsl(75,64%,49%)] hover:bg-[hsl(75,64%,59%)] text-white py-3 rounded-lg font-semibold text-lg transition-all duration-300 mb-4"
            data-testid="button-verify-otp"
          >
            {isVerifying ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify"
            )}
          </Button>
          
          <p className="text-xs text-gray-500">
            Didn't receive the code? Check your spam folder or try registering again.
            The code will expire in 1 hour.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Registration form
  return (
    <Card className={`shadow-xl border-0 overflow-hidden ${className}`}>
      <div className="h-2 bg-[hsl(75,64%,49%)]"></div>
      
      {showHeader && (
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-bold text-gray-900">Create Account</CardTitle>
          <p className="text-gray-600 mt-2">Join our spiritual community today</p>
        </CardHeader>
      )}

      <CardContent className="px-8 pb-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold">First Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          type="text"
                          placeholder="First name"
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
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold">Last Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          type="text"
                          placeholder="Last name"
                          className="pl-10 py-3 border-2 border-gray-200 focus:border-[hsl(75,64%,49%)] rounded-lg"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

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
                        placeholder="Create a password"
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
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum 6 characters required
                  </p>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full bg-[hsl(75,64%,49%)] hover:bg-[hsl(75,64%,59%)] text-white py-3 rounded-lg font-semibold text-lg transition-all duration-300"
            >
              {form.formState.isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </Form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-center text-gray-500 leading-relaxed">
            By creating an account, you agree to receive verification emails 
            and join our spiritual community with respect and authenticity.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default SupabaseSignUp;