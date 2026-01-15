import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SocialAuth } from "@/components/SocialAuth";
import { SupabaseSignUp } from "@/components/SupabaseSignUp";
import { useTranslation } from "@/hooks/useTranslation";

export default function Register() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const [registrationComplete, setRegistrationComplete] = useState(false);

  if (registrationComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navigation />
        
        <div className="pt-24 pb-20">
          <div className="max-w-md mx-auto px-6">
            <Card className="shadow-xl border-0 overflow-hidden">
              <div className="h-2 brand-primary"></div>
              
              <CardContent className="px-8 py-12 text-center">
                <div className="w-16 h-16 brand-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="text-white text-2xl" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Check Your Email</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  We've sent a verification link to your email address. Please click the link to verify your account and complete your registration.
                </p>
                
                <div className="space-y-4">
                  <Link href="/login">
                    <Button className="w-full brand-primary hover:brand-bright text-white hover:text-black py-3 rounded-lg font-semibold">
                      Go to Login
                    </Button>
                  </Link>
                  
                  <Link href="/">
                    <Button variant="ghost" className="w-full hover:bg-gray-100">
                      Return to Home
                    </Button>
                  </Link>
                </div>
                
                <p className="text-xs text-gray-500 mt-6">
                  Didn't receive the email? Check your spam folder or contact support.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navigation />
      
      <div className="pt-24 pb-20">
        <div className="max-w-md mx-auto px-6">
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" className="mb-4 hover:bg-gray-100">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("navigation.backToHome")}
              </Button>
            </Link>
          </div>

          <Card className="shadow-xl border-0 overflow-hidden">
            <div className="h-2 brand-primary"></div>
            
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-3xl font-bold text-gray-900">{t("pages.register.title")}</CardTitle>
              <p className="text-gray-600 mt-2">{t("pages.register.subtitle")}</p>
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
                  <span className="px-4 bg-white text-gray-500">{t("pages.register.or")}</span>
                </div>
              </div>

              {/* Use the new Supabase SignUp component */}
              <SupabaseSignUp 
                showHeader={false}
                onSuccess={() => setRegistrationComplete(true)}
              />

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  {t("pages.register.hasAccount")}{" "}
                  <Link href="/login">
                    <button className="text-[hsl(75,64%,49%)] hover:underline font-semibold">
                      {t("pages.register.signIn")}
                    </button>
                  </Link>
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-xs text-center text-gray-500 leading-relaxed">
                  By creating an account, you agree to our spiritual community guidelines and 
                  commitment to fostering growth, respect, and authentic connection.
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