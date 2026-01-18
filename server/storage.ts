import { db } from "./db.js";
import { eq, sql, and } from "drizzle-orm";
import * as schema from "@shared/schema";

// Import all the types we need
export type User = typeof schema.users.$inferSelect;
export type InsertUser = typeof schema.users.$inferInsert;
export type Journey = typeof schema.journeys.$inferSelect;
export type InsertJourney = typeof schema.journeys.$inferInsert;
export type Sage = typeof schema.sages.$inferSelect;
export type InsertSage = typeof schema.sages.$inferInsert;
export type Ashram = typeof schema.ashrams.$inferSelect;
export type InsertAshram = typeof schema.ashrams.$inferInsert;
export type Meetup = typeof schema.meetups.$inferSelect;
export type InsertMeetup = typeof schema.meetups.$inferInsert;
export type Registration = typeof schema.registrations.$inferSelect;
export type InsertRegistration = typeof schema.registrations.$inferInsert;
export type BlogPost = typeof schema.blogPosts.$inferSelect;
export type InsertBlogPost = typeof schema.blogPosts.$inferInsert;

// Simplified types for the basic functionality
export interface Testimonial {
  id: number;
  name: string;
  location: string;
  content: string;
  rating: number;
  journeyId?: number;
  journeyTitle?: string;
  avatar?: string;
  featured?: boolean;
  createdAt?: Date;
}

export interface AuthUser {
  id: number;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  emailVerified?: boolean;
  verificationToken?: string;
  resetToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt?: Date;
}

export interface NewsletterSubscriber {
  id: number;
  email: string;
  verified?: boolean;
  verificationToken?: string;
  subscribedAt?: Date;
}

export interface DailyWisdom {
  id: number;
  title: string;
  author: string;
  quote_text?: string;
  image_url: string;
  display_date: string;  // The date this quote should be displayed
  active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface Bookmark {
  id: number;
  userId: number;
  contentType: string;
  contentId: number;
  createdAt?: Date;
}

export type InsertBookmark = Omit<Bookmark, 'id' | 'createdAt'>;

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Journey operations
  getJourneys(): Promise<Journey[]>;
  getJourney(id: number): Promise<Journey | undefined>;
  createJourney(journey: InsertJourney): Promise<Journey>;
  updateJourney(id: number, journey: Partial<InsertJourney>): Promise<Journey | undefined>;

  // Sage operations
  getSages(): Promise<Sage[]>;
  getSage(id: number): Promise<Sage | undefined>;
  createSage(sage: InsertSage): Promise<Sage>;
  updateSage(id: number, sage: Partial<InsertSage>): Promise<Sage | undefined>;
  deleteSage(id: number): Promise<boolean>;

  // Ashram operations
  getAshrams(): Promise<Ashram[]>;
  getAshram(id: number): Promise<Ashram | undefined>;
  createAshram(ashram: InsertAshram): Promise<Ashram>;
  updateAshram(id: number, ashram: Partial<InsertAshram>): Promise<Ashram | undefined>;
  deleteAshram(id: number): Promise<boolean>;

  // Meetup operations
  getMeetups(): Promise<Meetup[]>;
  getMeetup(id: number): Promise<Meetup | undefined>;
  createMeetup(meetup: InsertMeetup): Promise<Meetup>;
  registerForMeetup(registration: InsertRegistration): Promise<Registration>;

  // Testimonial operations
  getTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: Partial<Testimonial>): Promise<Testimonial>;

  // Auth user operations
  getAuthUser(id: number): Promise<AuthUser | undefined>;
  getAuthUserByEmail(email: string): Promise<AuthUser | undefined>;
  createAuthUser(userData: Partial<AuthUser>): Promise<AuthUser>;
  updateAuthUser(id: number, userData: Partial<AuthUser>): Promise<AuthUser>;

  // Contact and newsletter operations
  createContactMessage(message: Partial<ContactMessage>): Promise<ContactMessage>;
  createNewsletterSubscriber(email: string, verificationToken: string): Promise<NewsletterSubscriber>;
  getNewsletterSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined>;
  updateNewsletterSubscriber(id: number, data: Partial<NewsletterSubscriber>): Promise<NewsletterSubscriber>;

  // Blog post operations
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;

  // Daily Wisdom operations
  getDailyWisdom(): Promise<DailyWisdom[]>;
  getActiveDailyWisdom(): Promise<DailyWisdom[]>;
  createDailyWisdom(quote: Partial<DailyWisdom>): Promise<DailyWisdom>;
  updateDailyWisdom(id: number, quote: Partial<DailyWisdom>): Promise<DailyWisdom | undefined>;
  deleteDailyWisdom(id: number): Promise<boolean>;

  // Bookmark operations
  getUserBookmarks(userId: number): Promise<Bookmark[]>;
  getBookmarkByUserAndContent(userId: number, contentType: string, contentId: number): Promise<Bookmark | undefined>;
  createBookmark(bookmark: InsertBookmark): Promise<Bookmark>;
  deleteBookmark(userId: number, contentType: string, contentId: number): Promise<boolean>;
}

export class SupabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id));
      return user || undefined;
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(schema.users).where(eq(schema.users.username, username));
      return user || undefined;
    } catch (error) {
      console.error('Error getting user by username:', error);
      return undefined;
    }
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(schema.users).values(user).returning();
    return newUser;
  }

  // Journey operations
  async getJourneys(): Promise<Journey[]> {
    try {
      return await db.select().from(schema.journeys);
    } catch (error) {
      console.error('Error getting journeys:', error);
      return [];
    }
  }

  async getJourney(id: number): Promise<Journey | undefined> {
    try {
      const [journey] = await db.select().from(schema.journeys).where(eq(schema.journeys.id, id));
      return journey || undefined;
    } catch (error) {
      console.error('Error getting journey:', error);
      return undefined;
    }
  }

  async createJourney(journey: InsertJourney): Promise<Journey> {
    const [newJourney] = await db.insert(schema.journeys).values(journey).returning();
    return newJourney;
  }

  async updateJourney(id: number, journey: Partial<InsertJourney>): Promise<Journey | undefined> {
    try {
      const [updated] = await db.update(schema.journeys).set(journey).where(eq(schema.journeys.id, id)).returning();
      return updated || undefined;
    } catch (error) {
      console.error('Error updating journey:', error);
      return undefined;
    }
  }

  // Sage operations
  async getSages(): Promise<Sage[]> {
    try {
      return await db.select().from(schema.sages);
    } catch (error) {
      console.error('Error getting sages:', error);
      return [];
    }
  }

  async getSage(id: number): Promise<Sage | undefined> {
    try {
      const [sage] = await db.select().from(schema.sages).where(eq(schema.sages.id, id));
      return sage || undefined;
    } catch (error) {
      console.error('Error getting sage:', error);
      return undefined;
    }
  }

  async createSage(sage: InsertSage): Promise<Sage> {
    const [newSage] = await db.insert(schema.sages).values(sage).returning();
    return newSage;
  }

  async updateSage(id: number, sage: Partial<InsertSage>): Promise<Sage | undefined> {
    try {
      const [updated] = await db.update(schema.sages).set(sage).where(eq(schema.sages.id, id)).returning();
      return updated || undefined;
    } catch (error) {
      console.error('Error updating sage:', error);
      return undefined;
    }
  }

  async deleteSage(id: number): Promise<boolean> {
    try {
      const deleted = await db.delete(schema.sages).where(eq(schema.sages.id, id));
      return deleted.rowCount > 0;
    } catch (error) {
      console.error("Error deleting sage:", error);
      return false;
    }
  }

  // Ashram operations
  async getAshrams(): Promise<Ashram[]> {
    try {
      return await db.select().from(schema.ashrams);
    } catch (error) {
      console.error('Error getting ashrams:', error);
      return [];
    }
  }

  async getAshram(id: number): Promise<Ashram | undefined> {
    try {
      const [ashram] = await db.select().from(schema.ashrams).where(eq(schema.ashrams.id, id));
      return ashram || undefined;
    } catch (error) {
      console.error('Error getting ashram:', error);
      return undefined;
    }
  }

  async createAshram(ashram: InsertAshram): Promise<Ashram> {
    const [newAshram] = await db.insert(schema.ashrams).values(ashram).returning();
    return newAshram;
  }

  async updateAshram(id: number, ashram: Partial<InsertAshram>): Promise<Ashram | undefined> {
    try {
      const [updated] = await db.update(schema.ashrams).set(ashram).where(eq(schema.ashrams.id, id)).returning();
      return updated || undefined;
    } catch (error) {
      console.error('Error updating ashram:', error);
      return undefined;
    }
  }

  async deleteAshram(id: number): Promise<boolean> {
    try {
      const deleted = await db.delete(schema.ashrams).where(eq(schema.ashrams.id, id));
      return deleted.rowCount > 0;
    } catch (error) {
      console.error("Error deleting ashram:", error);
      return false;
    }
  }

  // Meetup operations
  async getMeetups(): Promise<Meetup[]> {
    try {
      return await db.select().from(schema.meetups);
    } catch (error) {
      console.error('Error getting meetups:', error);
      return [];
    }
  }

  async getMeetup(id: number): Promise<Meetup | undefined> {
    try {
      const [meetup] = await db.select().from(schema.meetups).where(eq(schema.meetups.id, id));
      return meetup || undefined;
    } catch (error) {
      console.error('Error getting meetup:', error);
      return undefined;
    }
  }

  async createMeetup(meetup: InsertMeetup): Promise<Meetup> {
    const [newMeetup] = await db.insert(schema.meetups).values(meetup).returning();
    return newMeetup;
  }

  async registerForMeetup(registration: InsertRegistration): Promise<Registration> {
    const [newRegistration] = await db.insert(schema.registrations).values(registration).returning();
    return newRegistration;
  }

  // Testimonial operations
  async getTestimonials(): Promise<Testimonial[]> {
    try {
      const result = await db.execute(sql`SELECT * FROM testimonials ORDER BY created_at DESC`);
      return result as any[];
    } catch (error) {
      console.error('Error getting testimonials:', error);
      return [];
    }
  }

  async createTestimonial(testimonial: Partial<Testimonial>): Promise<Testimonial> {
    try {
      const result = await db.execute(sql`
        INSERT INTO testimonials (name, location, content, rating, journey_id, featured, created_at) 
        VALUES (${testimonial.name}, ${testimonial.location}, ${testimonial.content}, ${testimonial.rating}, ${testimonial.journeyId || null}, ${testimonial.featured || false}, NOW()) 
        RETURNING *
      `);
      return result[0] as any;
    } catch (error) {
      console.error('Error creating testimonial:', error);
      throw error;
    }
  }

  // Auth user operations (basic implementations)
  async getAuthUser(id: number): Promise<AuthUser | undefined> {
    try {
      const result = await db.execute(sql`SELECT * FROM auth_users WHERE id = ${id}`);
      return result[0] as any || undefined;
    } catch (error) {
      console.error('Error getting auth user:', error);
      return undefined;
    }
  }

  async getAuthUserByEmail(email: string): Promise<AuthUser | undefined> {
    try {
      const result = await db.execute(sql`SELECT * FROM auth_users WHERE email = ${email}`);
      return result[0] as any || undefined;
    } catch (error) {
      console.error('Error getting auth user by email:', error);
      return undefined;
    }
  }

  async createAuthUser(userData: Partial<AuthUser>): Promise<AuthUser> {
    try {
      const result = await db.execute(sql`
        INSERT INTO auth_users (email, password, first_name, last_name, email_verified, verification_token, created_at) 
        VALUES (${userData.email}, ${userData.password}, ${userData.firstName || null}, ${userData.lastName || null}, ${userData.emailVerified || false}, ${userData.verificationToken || null}, NOW()) 
        RETURNING *
      `);
      return result[0] as any;
    } catch (error) {
      console.error('Error creating auth user:', error);
      throw error;
    }
  }

  async updateAuthUser(id: number, userData: Partial<AuthUser>): Promise<AuthUser> {
    try {
      const result = await db.execute(sql`
        UPDATE auth_users 
        SET email_verified = COALESCE(${userData.emailVerified}, email_verified),
            verification_token = COALESCE(${userData.verificationToken}, verification_token),
            reset_token = COALESCE(${userData.resetToken}, reset_token),
            updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `);
      return result[0] as any;
    } catch (error) {
      console.error('Error updating auth user:', error);
      throw error;
    }
  }

  // Contact and newsletter operations
  async createContactMessage(message: Partial<ContactMessage>): Promise<ContactMessage> {
    try {
      const result = await db.execute(sql`
        INSERT INTO contact_messages (name, email, subject, message, created_at) 
        VALUES (${message.name}, ${message.email}, ${message.subject}, ${message.message}, NOW()) 
        RETURNING *
      `);
      return result[0] as any;
    } catch (error) {
      console.error('Error creating contact message:', error);
      throw error;
    }
  }

  async createNewsletterSubscriber(email: string, verificationToken: string): Promise<NewsletterSubscriber> {
    try {
      const result = await db.execute(sql`
        INSERT INTO newsletter_subscriber (email, verification_token, verified, subscribed_at) 
        VALUES (${email}, ${verificationToken}, false, NOW()) 
        RETURNING *
      `);
      return result[0] as any;
    } catch (error) {
      console.error('Error creating newsletter subscriber:', error);
      throw error;
    }
  }

  async getNewsletterSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined> {
    try {
      const result = await db.execute(sql`SELECT * FROM newsletter_subscriber WHERE email = ${email}`);
      return result[0] as any || undefined;
    } catch (error) {
      console.error('Error getting newsletter subscriber:', error);
      return undefined;
    }
  }

  async updateNewsletterSubscriber(id: number, data: Partial<NewsletterSubscriber>): Promise<NewsletterSubscriber> {
    try {
      const result = await db.execute(sql`
        UPDATE newsletter_subscriber 
        SET verified = COALESCE(${data.verified}, verified),
            verification_token = COALESCE(${data.verificationToken}, verification_token)
        WHERE id = ${id}
        RETURNING *
      `);
      return result[0] as any;
    } catch (error) {
      console.error('Error updating newsletter subscriber:', error);
      throw error;
    }
  }

  // Blog post operations
  async getBlogPosts(): Promise<BlogPost[]> {
    try {
      const posts = await db.select().from(schema.blogPosts)
        .where(eq(schema.blogPosts.published, true))
        .orderBy(sql`created_at DESC`);
      return posts;
    } catch (error) {
      console.error('Error getting blog posts:', error);
      return [];
    }
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    try {
      const [post] = await db.select().from(schema.blogPosts)
        .where(eq(schema.blogPosts.id, id));
      return post || undefined;
    } catch (error) {
      console.error('Error getting blog post:', error);
      return undefined;
    }
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    try {
      const [post] = await db.select().from(schema.blogPosts)
        .where(eq(schema.blogPosts.slug, slug));
      return post || undefined;
    } catch (error) {
      console.error('Error getting blog post by slug:', error);
      return undefined;
    }
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    try {
      const [newPost] = await db.insert(schema.blogPosts)
        .values(post)
        .returning();
      return newPost;
    } catch (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
  }

  async updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    try {
      const [updatedPost] = await db.update(schema.blogPosts)
        .set({ ...post, updatedAt: new Date() })
        .where(eq(schema.blogPosts.id, id))
        .returning();
      return updatedPost || undefined;
    } catch (error) {
      console.error('Error updating blog post:', error);
      return undefined;
    }
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    try {
      const deleted = await db.delete(schema.blogPosts).where(eq(schema.blogPosts.id, id));
      return deleted.rowCount > 0;
    } catch (error) {
      console.error("Error deleting blog post:", error);
      return false;
    }
  }

  // Daily Wisdom operations
  async getDailyWisdom(): Promise<DailyWisdom[]> {
    try {
      const quotes = await db.select().from(schema.dailyWisdom)
        .orderBy(sql`display_date DESC`);
      return quotes as DailyWisdom[];
    } catch (error) {
      console.error('Error getting daily wisdom:', error);
      return [];
    }
  }

  async getActiveDailyWisdom(): Promise<DailyWisdom[]> {
    try {
      const quotes = await db.select().from(schema.dailyWisdom)
        .where(eq(schema.dailyWisdom.active, true))
        .orderBy(sql`display_date DESC`);
      return quotes as DailyWisdom[];
    } catch (error) {
      console.error('Error getting active daily wisdom:', error);
      return [];
    }
  }

  async createDailyWisdom(quote: Partial<DailyWisdom>): Promise<DailyWisdom> {
    try {
      const [newQuote] = await db.insert(schema.dailyWisdom)
        .values({
          title: quote.title!,
          author: quote.author!,
          quote_text: quote.quote_text || null,
          image_url: quote.image_url!,
          display_date: quote.display_date!,
          active: quote.active ?? true,
        })
        .returning();
      return newQuote as DailyWisdom;
    } catch (error) {
      console.error('Error creating daily wisdom:', error);
      throw error;
    }
  }

  async updateDailyWisdom(id: number, quote: Partial<DailyWisdom>): Promise<DailyWisdom | undefined> {
    try {
      const [updatedQuote] = await db.update(schema.dailyWisdom)
        .set({ ...quote, updated_at: new Date() })
        .where(eq(schema.dailyWisdom.id, id))
        .returning();
      return updatedQuote as DailyWisdom || undefined;
    } catch (error) {
      console.error('Error updating daily wisdom:', error);
      return undefined;
    }
  }

  async deleteDailyWisdom(id: number): Promise<boolean> {
    try {
      const [deletedQuote] = await db.delete(schema.dailyWisdom)
        .where(eq(schema.dailyWisdom.id, id))
        .returning();
      return !!deletedQuote;
    } catch (error) {
      console.error('Error deleting daily wisdom:', error);
      return false;
    }
  }

  // Bookmark operations
  async getUserBookmarks(userId: number): Promise<Bookmark[]> {
    try {
      const bookmarks = await db.select()
        .from(schema.bookmarks)
        .where(eq(schema.bookmarks.userId, userId));
      return bookmarks;
    } catch (error) {
      console.error("Error fetching user bookmarks:", error);
      return [];
    }
  }

  async getBookmarkByUserAndContent(userId: number, contentType: string, contentId: number): Promise<Bookmark | undefined> {
    try {
      const [bookmark] = await db.select()
        .from(schema.bookmarks)
        .where(
          and(
            eq(schema.bookmarks.userId, userId),
            eq(schema.bookmarks.contentType, contentType),
            eq(schema.bookmarks.contentId, contentId)
          )
        );
      return bookmark;
    } catch (error) {
      console.error("Error fetching bookmark:", error);
      return undefined;
    }
  }

  async createBookmark(bookmark: InsertBookmark): Promise<Bookmark> {
    try {
      const [newBookmark] = await db.insert(schema.bookmarks)
        .values(bookmark)
        .returning();
      return newBookmark;
    } catch (error) {
      console.error("Error creating bookmark:", error);
      throw error;
    }
  }

  async deleteBookmark(userId: number, contentType: string, contentId: number): Promise<boolean> {
    try {
      await db.delete(schema.bookmarks)
        .where(
          and(
            eq(schema.bookmarks.userId, userId),
            eq(schema.bookmarks.contentType, contentType),
            eq(schema.bookmarks.contentId, contentId)
          )
        );
      return true;
    } catch (error) {
      console.error("Error deleting bookmark:", error);
      return false;
    }
  }
}

export const storage = new SupabaseStorage();