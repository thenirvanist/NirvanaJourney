import { Button } from "@/components/ui/button";
import { Video, Users, Globe, Heart, Calendar } from "lucide-react";
import { Link } from "wouter";
import Seo from "@/components/Seo";
import SchemaOrg, { createBreadcrumbSchema } from "@/components/SchemaOrg";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import satsangImage from "@assets/Satsang_4_1768371365026.png";
import { useTranslation } from "@/hooks/useTranslation";

const meetupsBreadcrumb = createBreadcrumbSchema([
  { name: "Home", url: "https://www.thenirvanist.com" },
  { name: "Satsangs" }
]);

export default function Meetups() {
  const { t } = useTranslation();

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
          <h1 className="text-6xl font-bold mb-6">{t("pages.meetups.heroTitle")}</h1>
          <h2 className="text-2xl font-semibold mb-4 text-[hsl(70,71%,62%)]">
            {t("pages.meetups.heroSubtitle")}
          </h2>
          <p className="text-xl mb-8 opacity-90 leading-relaxed">
            {t("pages.meetups.heroDesc")}
          </p>
          <Link href="/register">
            <Button className="brand-primary hover:brand-bright text-white hover:text-black px-8 py-4 text-lg rounded-lg font-semibold transition-all duration-300">
              {t("pages.meetups.attendSatsangs")}
            </Button>
          </Link>
        </div>
      </section>

      {/* What is a Satsang Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">{t("pages.meetups.whatIsSatsangTitle")}</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              {t("pages.meetups.whatIsSatsangDesc1")}
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              {t("pages.meetups.whatIsSatsangDesc2")}
            </p>
          </div>
          
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">{t("pages.meetups.whatHappensTitle")}</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="text-white text-2xl" />
              </div>
              <h3 className="font-semibold text-lg mb-3">{t("pages.meetups.guruVideoTitle")}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t("pages.meetups.guruVideoDesc")}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-white text-2xl" />
              </div>
              <h3 className="font-semibold text-lg mb-3">{t("pages.meetups.groupReflectionTitle")}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t("pages.meetups.groupReflectionDesc")}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="text-white text-2xl" />
              </div>
              <h3 className="font-semibold text-lg mb-3">{t("pages.meetups.globalCommunityTitle")}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t("pages.meetups.globalCommunityDesc")}
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
              <h2 className="text-4xl font-bold mb-6">{t("pages.meetups.whyJoinTitle")}</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Heart className="text-[hsl(75,64%,49%)] text-2xl mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{t("pages.meetups.innerClarityTitle")}</h3>
                    <p className="text-gray-600">{t("pages.meetups.innerClarityDesc")}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Users className="text-[hsl(75,64%,49%)] text-2xl mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{t("pages.meetups.humanConnectionTitle")}</h3>
                    <p className="text-gray-600">{t("pages.meetups.humanConnectionDesc")}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Calendar className="text-[hsl(75,64%,49%)] text-2xl mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{t("pages.meetups.soulfulConsistencyTitle")}</h3>
                    <p className="text-gray-600">{t("pages.meetups.soulfulConsistencyDesc")}</p>
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
          <h2 className="text-4xl font-bold mb-8">{t("pages.meetups.feelAtHomeTitle")}</h2>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 brand-primary rounded-full"></div>
                <span>{t("pages.meetups.curious")}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 brand-primary rounded-full"></div>
                <span>{t("pages.meetups.wantCalm")}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 brand-primary rounded-full"></div>
                <span>{t("pages.meetups.preferSmall")}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 brand-primary rounded-full"></div>
                <span>{t("pages.meetups.craveDepth")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">{t("pages.meetups.joinNextTitle")}</h2>
          <p className="text-gray-600 mb-8">
            {t("pages.meetups.joinNextDesc")}
          </p>
          <Link href="/register">
            <Button className="brand-primary hover:brand-bright text-white hover:text-black px-8 py-4 text-lg rounded-lg font-semibold transition-all duration-300">
              {t("pages.meetups.attendSatsangs")}
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
