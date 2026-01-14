# The Nirvanist Design Guidelines

## Design Approach
**Reference-Based:** Drawing from Airbnb's destination showcases, Calm.com's serene aesthetics, and Headspace's approachable spirituality. Integrating Indian philosophical motifs with modern web patterns.

## Typography System

**Primary Font:** Cormorant Garamond (serif) - elegant, spiritual
**Secondary Font:** Inter (sans-serif) - clean, readable

**Hierarchy:**
- H1: 4xl-5xl (48-60px), Cormorant, font-light
- H2: 3xl-4xl (36-48px), Cormorant, font-light
- H3: 2xl (24px), Cormorant, font-normal
- Body Large: xl (20px), Inter, font-light - for introductory text
- Body: base (16px), Inter, font-normal
- Small: sm (14px), Inter, font-normal

## Layout System

**Spacing Primitives:** Tailwind units 4, 8, 12, 16, 20, 24, 32
- Section padding: py-20 to py-32 (desktop), py-12 to py-16 (mobile)
- Card padding: p-8 to p-12
- Element spacing: gap-8, gap-12 between major elements
- Container: max-w-7xl with px-6 to px-8

**Grid Patterns:**
- Destination cards: 3-column (lg), 2-column (md), 1-column (mobile)
- Philosophy/wisdom quotes: 2-column asymmetric layouts
- Feature showcases: alternating image-text sections

## Component Library

**Navigation:**
Floating transparent navbar with backdrop-blur, transforms to solid white on scroll. Logo left, navigation center, CTA right. Mobile: slide-in drawer with soft overlay.

**Hero Section:**
Full-viewport (90vh) immersive image with subtle parallax. Centered content with large headline, subheadline, and dual CTAs (primary + secondary). Add gradient overlay (dark to transparent) for text legibility. Buttons with backdrop-blur-md background.

**Destination Cards:**
Rounded corners (rounded-2xl), aspect-ratio 4:3 images, hover lift effect (translate-y-1), overlay gradient on hover revealing location name and brief description. Clean white background with shadow-lg.

**Wisdom/Philosophy Sections:**
Large serif pull-quotes (text-2xl to text-3xl) with decorative Indian motifs (lotus, mandala) as subtle SVG watermarks. Asymmetric layouts with generous negative space.

**Content Sections:**
Alternating image-text layouts with 60/40 splits. Images with soft rounded-3xl corners. Text blocks max-w-2xl for optimal reading.

**Footer:**
Multi-column (4 on desktop, stacked mobile) with newsletter signup, site links, social icons, and traditional Indian blessing/mantra in Devanagari script as signature element.

## Interactions & Animations

**Subtle Motion:**
- Scroll-triggered fade-ins with translate-y-4 for content sections
- Image parallax at 0.3 speed in hero
- Hover scale (1.02) on cards with smooth transitions (300ms)
- Navigation items: subtle underline grow animation

**No Animations:**
- Avoid spinning elements, excessive bouncing
- Keep page transitions instant

## Images Strategy

**Hero Image:** Large, atmospheric photograph of Indian spiritual destinations (Varanasi ghats at dawn, Himalayan monastery, Kerala backwaters). Full-width, 90vh height.

**Section Images:**
- Destination showcases: High-quality photography of temples, ashrams, natural landscapes
- Philosophy sections: Serene close-ups (meditation hands, incense, marigold flowers, prayer wheels)
- Testimonial backgrounds: Soft-focus spiritual settings

**Image Treatment:**
All images with slight warmth filter, soft vignette. Maintain 4:3 or 16:9 aspect ratios. Use rounded-2xl to rounded-3xl corners for contained images.

## Page Sections (Recommended)

**Homepage:**
1. Hero with immersive destination image
2. Featured philosophy/wisdom quote section
3. Popular destinations grid (3-column)
4. "Why Spiritual Tourism" - alternating image-text
5. Testimonials with pilgrim photos
6. Journey types showcase
7. Newsletter + CTA section
8. Rich footer

**Interior Pages:**
Hero banner (40vh), breadcrumb navigation, content in max-w-4xl containers, sidebar for navigation/related content where appropriate.

## Special Elements

**Iconography:** Use Heroicons (outline style) for UI elements. Custom lotus/mandala SVGs for decorative accents.

**Forms:** Floating labels, rounded-xl inputs, soft focus states with brand green accent ring.

**Buttons:** Primary (brand green background), secondary (outline with green border), tertiary (text only). All rounded-full with px-8 py-3 padding. Buttons on images: backdrop-blur-md with semi-transparent white background.