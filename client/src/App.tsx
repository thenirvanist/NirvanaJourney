import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import SkipLink from "@/components/SkipLink";
import SchemaOrg, { websiteSchema, organizationSchema } from "@/components/SchemaOrg";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Journeys from "@/pages/Journeys";
import JourneyDetail from "@/pages/JourneyDetail";
import Meetups from "@/pages/Meetups";
import Sages from "@/pages/Sages";
import SageDetail from "@/pages/SageDetail";
import Ashrams from "@/pages/Ashrams";
import AshramDetail from "@/pages/AshramDetail";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import AuthCallback from "@/pages/auth/callback";
import InnerNutrition from "@/pages/InnerNutrition";
import BlogArticle from "@/pages/BlogArticle";
import DailyQuotes from "@/pages/DailyQuotes";
import Dashboard from "@/pages/Dashboard";
import QuotesAdmin from "@/pages/admin/QuotesAdmin";
import SagesAdmin from "@/pages/admin/SagesAdmin";
import AshramsAdmin from "@/pages/admin/AshramsAdmin";
import NutritionAdmin from "@/pages/admin/NutritionAdmin";
import AdminDashboard from "@/pages/AdminDashboard";
import ConfirmNewsletter from "@/pages/ConfirmNewsletter";
import Chatbot from "@/components/Chatbot";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/journeys" component={Journeys} />
      <Route path="/journeys/:id" component={JourneyDetail} />
      <Route path="/meetups" component={Meetups} />
      <Route path="/daily-quotes" component={DailyQuotes} />
      <Route path="/inner-nutrition" component={InnerNutrition} />
      <Route path="/inner-nutrition/:slug" component={BlogArticle} />
      <Route path="/sages" component={Sages} />
      <Route path="/sages/:id" component={SageDetail} />
      <Route path="/ashrams" component={Ashrams} />
      <Route path="/ashrams/:id" component={AshramDetail} />
      <Route path="/contact" component={Contact} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/auth/callback" component={AuthCallback} />
      <Route path="/admin/quotes" component={QuotesAdmin} />
      <Route path="/admin/sages" component={SagesAdmin} />
      <Route path="/admin/ashrams" component={AshramsAdmin} />
      <Route path="/admin/nutrition" component={NutritionAdmin} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/confirm-newsletter" component={ConfirmNewsletter} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-background">
      <SchemaOrg schema={[websiteSchema, organizationSchema]} />
      <SkipLink />
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <main id="main-content" role="main">
              <Router />
            </main>
            <Chatbot />
          </TooltipProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
