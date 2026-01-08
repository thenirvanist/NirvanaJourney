import { storage } from './storage.js';

export async function seedSupabaseData() {
  console.log('Seeding Supabase database with spiritual content...');

  try {
    // Seed Journeys
    const journeys = [
      {
        title: "Mindful Himalayas Retreat",
        description: "7-day transformative journey through sacred Himalayan monasteries and meditation centers",
        fullDescription: "Experience profound transformation in the serene Himalayan valleys. This carefully curated journey takes you through ancient monasteries, meditation caves, and sacred sites where enlightened masters have walked for centuries. Each day begins with sunrise meditation, followed by guided teachings from local monks and mindful walking through pristine mountain landscapes.",
        location: "Himalayas, Nepal",
        duration: "7 days",
        price: "$1,299",
        image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        heroImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
        inclusions: ["Accommodation in monastery guesthouses", "Daily meditation sessions", "Tibetan Buddhist teachings", "Guided mountain walks", "Traditional vegetarian meals", "Airport transfers"],
        itinerary: "Day 1: Arrival in Kathmandu, orientation. Day 2-3: Bouddhanath Stupa and Kopan Monastery. Day 4-5: Namobuddha retreat center. Day 6-7: Silent meditation and departure preparation.",
        overview: "Discover inner peace through ancient Himalayan wisdom and breathtaking mountain landscapes.",
        available: true
      },
      {
        title: "Balinese Sacred Ceremonies",
        description: "5-day immersion in traditional Balinese spiritual practices and temple ceremonies",
        fullDescription: "Dive deep into the mystical world of Balinese Hinduism through authentic temple ceremonies, traditional healings, and sacred rituals. Learn from local priests and spiritual healers while participating in ancient practices that have been preserved for generations. Experience the profound connection between daily life and spirituality that defines Balinese culture.",
        location: "Ubud, Bali",
        duration: "5 days",
        price: "$899",
        image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        heroImage: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
        inclusions: ["Traditional Balinese accommodation", "Temple ceremony participation", "Sacred water blessings", "Traditional healer consultations", "Yoga and meditation sessions", "Cultural workshops"],
        itinerary: "Day 1: Arrival and temple blessing. Day 2: Sacred water ceremony at Tirta Empul. Day 3: Traditional healing session. Day 4: Silent retreat in rice fields. Day 5: Closing ceremony and departure.",
        overview: "Experience the living spirituality of Bali through sacred ceremonies and ancient healing traditions.",
        available: true
      },
      {
        title: "Rishikesh Yoga & Meditation",
        description: "10-day intensive yoga and meditation retreat in the spiritual capital of India",
        fullDescription: "Immerse yourself in the birthplace of yoga with daily asanas, pranayama, and meditation practices along the sacred Ganges River. Study with traditional gurus, attend evening aarti ceremonies, and explore ancient ashrams where spiritual seekers have gathered for millennia. This retreat combines authentic yogic teachings with spiritual exploration.",
        location: "Rishikesh, India",
        duration: "10 days",
        price: "$799",
        image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        heroImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
        inclusions: ["Ashram accommodation", "Daily yoga classes", "Meditation sessions", "Philosophy teachings", "Ganga aarti ceremonies", "Ayurvedic meals", "Sacred site visits"],
        itinerary: "Days 1-2: Foundation yoga and meditation. Days 3-5: Advanced practices and philosophy. Days 6-8: Silent retreat period. Days 9-10: Integration and certification ceremony.",
        overview: "Deepen your yoga practice and spiritual understanding in the yoga capital of the world.",
        available: true
      }
    ];

    for (const journey of journeys) {
      await storage.createJourney(journey);
    }

    // Seed Sages
    const sages = [
      {
        name: "Ramana Maharshi",
        description: "Self-realized sage who taught through silence and the practice of self-inquiry",
        biography: "Born in 1879 in Tiruchuli, Tamil Nadu, Ramana Maharshi experienced spontaneous Self-realization at age 16. He spent the rest of his life at Arunachala Hill, teaching through the simple question 'Who am I?' His method of self-inquiry (atma-vichara) has guided countless seekers to their true nature. He emphasized that the Self is always present and needs no attainment, only recognition.",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400",
        location: "Tiruvannamalai, India",
        teachings: ["Self-inquiry (Who am I?)", "Silence as the highest teaching", "The Self is always present", "Non-dual awareness"],
        books: ["Who Am I?", "Forty Verses on Reality", "The Spiritual Teaching of Ramana Maharshi"],
        notableWork: ["Established Ramanashram", "Taught through silence", "Guided seekers to Self-realization"],
        category: "Hindu",
        era: "Modern",
        status: "Historical"
      },
      {
        name: "Thich Nhat Hanh",
        description: "Vietnamese Zen master, peace activist, and mindfulness teacher",
        biography: "Born in 1926, Thich Nhat Hanh became a monk at 16 and dedicated his life to peace, mindfulness, and social action. He coined the term 'engaged Buddhism' and founded Plum Village in France. His teachings on mindful living have reached millions worldwide through his books and retreats. He emphasized that peace begins with each individual's mindful awareness.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400",
        location: "Plum Village, France",
        teachings: ["Mindful breathing", "Walking meditation", "Engaged Buddhism", "Interbeing"],
        books: ["The Miracle of Mindfulness", "Peace Is Every Step", "Being Peace"],
        notableWork: ["Founded Plum Village", "Promoted engaged Buddhism", "Peace activism"],
        category: "Buddhist",
        era: "Modern", 
        status: "Historical"
      },
      {
        name: "Rumi",
        description: "13th-century Persian poet, mystic, and Sufi master",
        biography: "Jalal ad-Din Muhammad Rumi (1207-1273) was a Persian poet, theologian, and Sufi mystic whose spiritual poetry transcends cultural boundaries. Born in present-day Afghanistan, he settled in Konya, Turkey, where he founded the Mevlevi Order of whirling dervishes. His verses express the soul's longing for divine union and the ecstasy of spiritual love.",
        image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400",
        location: "Konya, Turkey", 
        teachings: ["Divine love", "Unity of being", "Whirling meditation", "Spiritual poetry"],
        books: ["Masnavi", "Divan-e Shams-e Tabrizi", "Fihi Ma Fihi"],
        notableWork: ["Founded Mevlevi Order", "Composed mystical poetry", "Developed whirling meditation"],
        category: "Sufi",
        era: "Ancient",
        status: "Historical"
      }
    ];

    for (const sage of sages) {
      await storage.createSage(sage);
    }

    // Seed Ashrams
    const ashrams = [
      {
        name: "Rishikesh Sacred Valley Ashram",
        location: "Rishikesh, Uttarakhand",
        description: "Peaceful ashram nestled in the sacred Ganges valley, offering traditional yoga and meditation programs",
        facilities: ["Meditation halls", "Yoga studios", "Sacred river access", "Vegetarian kitchen", "Library", "Guest rooms"],
        image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        contact: "info@rishikeshvalley.org",
        website: "www.rishikeshvalley.org",
        region: "North India",
        focus: "Yoga & Meditation",
        founders: "Sri Swami Sivananda lineage"
      },
      {
        name: "Arunachala Ramana Ashram",
        location: "Tiruvannamalai, Tamil Nadu", 
        description: "Sacred ashram at the foot of Arunachala Hill where Ramana Maharshi lived and taught",
        facilities: ["Meditation hall", "Samadhi shrine", "Library", "Dining hall", "Guest accommodation"],
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        contact: "office@ramanashram.org",
        website: "www.ramanashram.org",
        region: "South India",
        focus: "Self-inquiry & Contemplation",
        founders: "Ramana Maharshi"
      },
      {
        name: "Bodh Gaya Meditation Center",
        location: "Bodh Gaya, Bihar",
        description: "International meditation center near the sacred Bodhi Tree where Buddha attained enlightenment",
        facilities: ["Meditation halls", "International dormitories", "Vegetarian restaurant", "Dharma library", "Conference rooms"],
        image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        contact: "info@bodhgayacenter.org",
        website: "www.bodhgayacenter.org", 
        region: "East India",
        focus: "Buddhist Meditation",
        founders: "International Buddhist Community"
      }
    ];

    for (const ashram of ashrams) {
      await storage.createAshram(ashram);
    }

    // Seed Testimonials
    const testimonials = [
      {
        name: "Sarah Chen",
        location: "San Francisco, USA",
        content: "The Himalayan retreat completely transformed my perspective on life and spirituality. The combination of meditation, mountain landscapes, and authentic teachings created a profound inner shift that continues to guide me.",
        rating: 5,
        journeyId: 1,
        avatar: "https://images.unsplash.com/photo-1494790108755-2616c163e820?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        verified: true
      },
      {
        name: "Marco Rodriguez",
        location: "Barcelona, Spain", 
        content: "Participating in Balinese ceremonies opened my heart in ways I never expected. The wisdom of the local healers and the power of ancient rituals created healing on multiple levels.",
        rating: 5,
        journeyId: 2,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        verified: true
      },
      {
        name: "Priya Sharma",
        location: "Mumbai, India",
        content: "Returning to Rishikesh through The Nirvanist's program allowed me to deepen my yoga practice in ways that weren't possible in studios. The authentic teachings and spiritual atmosphere were transformative.",
        rating: 5,
        journeyId: 3,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        verified: true
      }
    ];

    for (const testimonial of testimonials) {
      await storage.createTestimonial(testimonial);
    }

    console.log('✓ Supabase database seeded successfully with spiritual content');
    return true;
  } catch (error) {
    console.error('✗ Seeding failed:', error);
    return false;
  }
}