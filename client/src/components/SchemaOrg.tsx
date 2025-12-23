import { useEffect } from "react";

type SchemaType = 
  | "WebSite"
  | "Organization"
  | "Article"
  | "Person"
  | "Place"
  | "Trip"
  | "BreadcrumbList"
  | "FAQPage"
  | "Event";

interface BaseSchema {
  "@context": "https://schema.org";
  "@type": SchemaType | SchemaType[];
}

export interface WebSiteSchema extends BaseSchema {
  "@type": "WebSite";
  name: string;
  url: string;
  description?: string;
  potentialAction?: {
    "@type": "SearchAction";
    target: string;
    "query-input": string;
  };
}

export interface OrganizationSchema extends BaseSchema {
  "@type": "Organization";
  name: string;
  url: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
  contactPoint?: {
    "@type": "ContactPoint";
    contactType: string;
    email?: string;
    telephone?: string;
  };
}

export interface ArticleSchema extends BaseSchema {
  "@type": "Article";
  headline: string;
  description?: string;
  image?: string | string[];
  datePublished?: string;
  dateModified?: string;
  author?: {
    "@type": "Person" | "Organization";
    name: string;
    url?: string;
  };
  publisher?: {
    "@type": "Organization";
    name: string;
    logo?: {
      "@type": "ImageObject";
      url: string;
    };
  };
  mainEntityOfPage?: {
    "@type": "WebPage";
    "@id": string;
  };
}

export interface PersonSchema extends BaseSchema {
  "@type": "Person";
  name: string;
  description?: string;
  image?: string;
  url?: string;
  birthPlace?: string;
  knowsAbout?: string[];
  sameAs?: string[];
}

export interface PlaceSchema extends BaseSchema {
  "@type": "Place";
  name: string;
  description?: string;
  image?: string;
  address?: {
    "@type": "PostalAddress";
    addressLocality?: string;
    addressRegion?: string;
    addressCountry?: string;
  };
  geo?: {
    "@type": "GeoCoordinates";
    latitude?: number;
    longitude?: number;
  };
  telephone?: string;
  url?: string;
}

export interface TripSchema extends BaseSchema {
  "@type": "Trip";
  name: string;
  description?: string;
  image?: string;
  itinerary?: {
    "@type": "ItemList";
    itemListElement: Array<{
      "@type": "ListItem";
      position: number;
      item: {
        "@type": "Place";
        name: string;
      };
    }>;
  };
  offers?: {
    "@type": "Offer";
    price?: string;
    priceCurrency?: string;
    availability?: string;
    url?: string;
  };
  provider?: {
    "@type": "Organization";
    name: string;
    url?: string;
  };
}

export interface BreadcrumbSchema extends BaseSchema {
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item?: string;
  }>;
}

type Schema = WebSiteSchema | OrganizationSchema | ArticleSchema | PersonSchema | PlaceSchema | TripSchema | BreadcrumbSchema;

interface SchemaOrgProps {
  schema: Schema | Schema[];
}

const SCHEMA_SCRIPT_ID = "schema-org-jsonld";

export default function SchemaOrg({ schema }: SchemaOrgProps) {
  useEffect(() => {
    const existingScript = document.getElementById(SCHEMA_SCRIPT_ID);
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");
    script.id = SCHEMA_SCRIPT_ID;
    script.type = "application/ld+json";
    
    const schemaData = Array.isArray(schema) ? schema : [schema];
    script.textContent = JSON.stringify(schemaData.length === 1 ? schemaData[0] : schemaData);
    
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById(SCHEMA_SCRIPT_ID);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [schema]);

  return null;
}

export const websiteSchema: WebSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "The Nirvanist",
  url: "https://www.thenirvanist.com",
  description: "Transformative spiritual journeys that foster inner peace, self-discovery, and connection with diverse cultures and natural environments.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://www.thenirvanist.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export const organizationSchema: OrganizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "The Nirvanist",
  url: "https://www.thenirvanist.com",
  logo: "https://www.thenirvanist.com/attached_assets/Logo_Colour_1753290292168.png",
  description: "The Nirvanist connects seekers with transformative spiritual journeys, sage wisdom, ashram retreats, and global meetups for spiritual growth.",
  sameAs: [
    "https://www.facebook.com/thenirvanist",
    "https://www.instagram.com/thenirvanist",
    "https://twitter.com/thenirvanist"
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: "contact@thenirvanist.com"
  }
};

export function createBreadcrumbSchema(items: Array<{ name: string; url?: string }>): BreadcrumbSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem" as const,
      position: index + 1,
      name: item.name,
      ...(item.url && { item: item.url })
    }))
  };
}

export function createArticleSchema(article: {
  title: string;
  description: string;
  image?: string;
  publishedDate?: string;
  modifiedDate?: string;
  author?: string;
  url: string;
}): ArticleSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.publishedDate,
    dateModified: article.modifiedDate || article.publishedDate,
    author: article.author ? {
      "@type": "Person",
      name: article.author
    } : undefined,
    publisher: {
      "@type": "Organization",
      name: "The Nirvanist",
      logo: {
        "@type": "ImageObject",
        url: "https://www.thenirvanist.com/attached_assets/Logo_Colour_1753290292168.png"
      }
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": article.url
    }
  };
}

export function createPersonSchema(person: {
  name: string;
  description?: string;
  image?: string;
  birthPlace?: string;
  teachings?: string[];
  url: string;
}): PersonSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    description: person.description,
    image: person.image,
    url: person.url,
    birthPlace: person.birthPlace,
    knowsAbout: person.teachings
  };
}

export function createPlaceSchema(place: {
  name: string;
  description?: string;
  image?: string;
  location?: string;
  telephone?: string;
  url: string;
}): PlaceSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    name: place.name,
    description: place.description,
    image: place.image,
    url: place.url,
    telephone: place.telephone,
    address: place.location ? {
      "@type": "PostalAddress",
      addressCountry: "India",
      addressLocality: place.location
    } : undefined
  };
}

export function createTripSchema(trip: {
  name: string;
  description?: string;
  image?: string;
  price?: string;
  duration?: string;
  location?: string;
  available?: boolean;
  url: string;
}): TripSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Trip",
    name: trip.name,
    description: trip.description,
    image: trip.image,
    offers: {
      "@type": "Offer",
      price: trip.price?.replace(/[^0-9.]/g, '') || undefined,
      priceCurrency: "USD",
      availability: trip.available 
        ? "https://schema.org/InStock" 
        : "https://schema.org/SoldOut",
      url: trip.url
    },
    provider: {
      "@type": "Organization",
      name: "The Nirvanist",
      url: "https://www.thenirvanist.com"
    }
  };
}
