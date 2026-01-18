import { db } from "./db.js";
import { eq, sql } from "drizzle-orm";
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

// Simplified types for the basic functionality
export interface Testimonial {
  id: number;
  name: string;
  location: string;
  content: string;
  rating: number;
  journeyId?: number;
  image?: string;
  verified?: boolean;
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

  // Ashram operations
  getAshrams(): Promise<Ashram[]>;
  getAshram(id: number): Promise<Ashram | undefined>;
  createAshram(ashram: InsertAshram): Promise<Ashram>;
  updateAshram(id: number, ashram: Partial<InsertAshram>): Promise<Ashram | undefined>;

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
      // Use raw SQL since we have a simplified testimonial structure
      const result = await db.execute('SELECT * FROM testimonials ORDER BY created_at DESC');
      return result.rows as any[] || [];
    } catch (error) {
      console.error('Error getting testimonials:', error);
      return [];
    }
  }

  async createTestimonial(testimonial: Partial<Testimonial>): Promise<Testimonial> {
    try {
      const result = await db.execute(sql`
        INSERT INTO testimonials (name, location, content, rating, journey_id, featured, created_at) 
        VALUES (${testimonial.name}, ${testimonial.location}, ${testimonial.content}, ${testimonial.rating}, ${testimonial.journeyId || null}, ${testimonial.verified || false}, NOW()) 
        RETURNING *
      `);
      return result[0] as any;
    } catch (error) {
      console.error('Error creating testimonial:', error);
      throw error;
    }
  }

  // Auth user operations  
  async getAuthUser(id: number): Promise<AuthUser | undefined> {
    try {
      const result = await db.execute('SELECT * FROM auth_users WHERE id = $1', [id]);
      return result.rows[0] as any || undefined;
    } catch (error) {
      console.error('Error getting auth user:', error);
      return undefined;
    }
  }

  async getAuthUserByEmail(email: string): Promise<AuthUser | undefined> {
    try {
      const result = await db.execute('SELECT * FROM auth_users WHERE email = $1', [email]);
      return result.rows[0] as any || undefined;
    } catch (error) {
      console.error('Error getting auth user by email:', error);
      return undefined;
    }
  }

  async createAuthUser(userData: Partial<AuthUser>): Promise<AuthUser> {
    try {
      const result = await db.execute(`
        INSERT INTO auth_users (email, password, first_name, last_name, email_verified, verification_token, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        RETURNING *
      `, [
        userData.email,
        userData.password,
        userData.firstName || null,
        userData.lastName || null,
        userData.emailVerified || false,
        userData.verificationToken || null
      ]);
      return result.rows[0] as any;
    } catch (error) {
      console.error('Error creating auth user:', error);
      throw error;
    }
  }

  async updateAuthUser(id: number, userData: Partial<AuthUser>): Promise<AuthUser> {
    try {
      const result = await db.execute(`
        UPDATE auth_users 
        SET email = COALESCE($2, email),
            password = COALESCE($3, password),
            first_name = COALESCE($4, first_name),
            last_name = COALESCE($5, last_name),
            email_verified = COALESCE($6, email_verified),
            verification_token = COALESCE($7, verification_token),
            reset_token = COALESCE($8, reset_token),
            updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `, [
        id,
        userData.email,
        userData.password,
        userData.firstName,
        userData.lastName,
        userData.emailVerified,
        userData.verificationToken,
        userData.resetToken
      ]);
      return result.rows[0] as any;
    } catch (error) {
      console.error('Error updating auth user:', error);
      throw error;
    }
  }

  // Contact and newsletter operations
  async createContactMessage(message: Partial<ContactMessage>): Promise<ContactMessage> {
    try {
      const result = await db.execute(`
        INSERT INTO contact_messages (name, email, subject, message, created_at)
        VALUES ($1, $2, $3, $4, NOW())
        RETURNING *
      `, [message.name, message.email, message.subject, message.message]);
      return result.rows[0] as any;
    } catch (error) {
      console.error('Error creating contact message:', error);
      throw error;
    }
  }

  async createNewsletterSubscriber(email: string, verificationToken: string): Promise<NewsletterSubscriber> {
    try {
      const result = await db.execute(`
        INSERT INTO newsletter_subscriber (email, verified, verification_token, subscribed_at)
        VALUES ($1, false, $2, NOW())
        RETURNING *
      `, [email, verificationToken]);
      return result.rows[0] as any;
    } catch (error) {
      console.error('Error creating newsletter subscriber:', error);
      throw error;
    }
  }

  async getNewsletterSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined> {
    try {
      const result = await db.execute('SELECT * FROM newsletter_subscriber WHERE email = $1', [email]);
      return result.rows[0] as any || undefined;
    } catch (error) {
      console.error('Error getting newsletter subscriber:', error);
      return undefined;
    }
  }

  async updateNewsletterSubscriber(id: number, data: Partial<NewsletterSubscriber>): Promise<NewsletterSubscriber> {
    try {
      const result = await db.execute(`
        UPDATE newsletter_subscriber 
        SET verified = COALESCE($2, verified),
            verification_token = COALESCE($3, verification_token)
        WHERE id = $1
        RETURNING *
      `, [id, data.verified, data.verificationToken]);
      return result.rows[0] as any;
    } catch (error) {
      console.error('Error updating newsletter subscriber:', error);
      throw error;
    }
  }
}

export const storage = new SupabaseStorage();