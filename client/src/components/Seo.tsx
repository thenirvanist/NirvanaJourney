import { useEffect } from "react";
import { useLocation } from "wouter";

export interface SeoProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "profile";
  twitterCard?: "summary" | "summary_large_image";
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  noIndex?: boolean;
}

const BASE_URL = "https://www.thenirvanist.com";
const DEFAULT_TITLE = "The Nirvanist - Nourish Your Soul";
const DEFAULT_DESCRIPTION = "Embark on a spiritual odyssey towards inner transformation and holistic well-being. Join The Nirvanist for sacred retreats, meditation tours, and spiritual growth experiences.";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;

export default function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  canonicalUrl,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  twitterCard = "summary_large_image",
  article,
  noIndex = false,
}: SeoProps) {
  const [location] = useLocation();
  
  const fullTitle = title ? `${title} | The Nirvanist` : DEFAULT_TITLE;
  const fullCanonicalUrl = canonicalUrl || `${BASE_URL}${location}`;

  useEffect(() => {
    document.title = fullTitle;

    const updateMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? "property" : "name";
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    const updateLink = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", rel);
        document.head.appendChild(element);
      }
      element.setAttribute("href", href);
    };

    updateMeta("description", description);
    updateMeta("robots", noIndex ? "noindex, nofollow" : "index, follow");
    
    updateLink("canonical", fullCanonicalUrl);

    updateMeta("og:title", fullTitle, true);
    updateMeta("og:description", description, true);
    updateMeta("og:url", fullCanonicalUrl, true);
    updateMeta("og:type", ogType, true);
    updateMeta("og:image", ogImage, true);
    updateMeta("og:site_name", "The Nirvanist", true);
    updateMeta("og:locale", "en_US", true);

    updateMeta("twitter:card", twitterCard);
    updateMeta("twitter:title", fullTitle);
    updateMeta("twitter:description", description);
    updateMeta("twitter:image", ogImage);
    updateMeta("twitter:site", "@thenirvanist");

    if (article && ogType === "article") {
      if (article.publishedTime) {
        updateMeta("article:published_time", article.publishedTime, true);
      }
      if (article.modifiedTime) {
        updateMeta("article:modified_time", article.modifiedTime, true);
      }
      if (article.author) {
        updateMeta("article:author", article.author, true);
      }
      if (article.section) {
        updateMeta("article:section", article.section, true);
      }
      if (article.tags) {
        article.tags.forEach((tag, index) => {
          updateMeta(`article:tag:${index}`, tag, true);
        });
      }
    }

    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [fullTitle, description, fullCanonicalUrl, ogImage, ogType, twitterCard, article, noIndex]);

  return null;
}
