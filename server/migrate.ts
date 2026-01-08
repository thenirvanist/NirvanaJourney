import { db } from './db.js';
import { sql } from 'drizzle-orm';

export async function runMigrations() {
  console.log('Running Supabase database migrations...');
  
  try {
    // Create tables if they don't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS journeys (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        full_description TEXT,
        location TEXT NOT NULL,
        duration TEXT NOT NULL,
        price TEXT NOT NULL,
        image TEXT NOT NULL,
        hero_image TEXT,
        inclusions TEXT[],
        itinerary TEXT,
        overview TEXT,
        available BOOLEAN DEFAULT true
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS sages (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        biography TEXT NOT NULL,
        image TEXT NOT NULL,
        location TEXT,
        teachings TEXT[],
        books TEXT[],
        notable_work TEXT[],
        category TEXT,
        era TEXT,
        status TEXT
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS ashrams (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        location TEXT NOT NULL,
        description TEXT NOT NULL,
        facilities TEXT[],
        image TEXT NOT NULL,
        contact TEXT,
        website TEXT,
        region TEXT,
        focus TEXT,
        founders TEXT
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS meetups (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        date TIMESTAMP NOT NULL,
        duration TEXT NOT NULL,
        max_participants INTEGER DEFAULT 8,
        registered_count INTEGER DEFAULT 0
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS registrations (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        country TEXT NOT NULL,
        timezone TEXT NOT NULL,
        interested_in_travel BOOLEAN DEFAULT false,
        meetup_id INTEGER
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        location TEXT NOT NULL,
        content TEXT NOT NULL,
        rating INTEGER NOT NULL,
        journey_id INTEGER,
        image TEXT,
        verified BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS auth_users (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        first_name TEXT,
        last_name TEXT,
        email_verified BOOLEAN DEFAULT false,
        verification_token TEXT,
        reset_token TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        verified BOOLEAN DEFAULT false,
        verification_token TEXT,
        subscribed_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('✓ Database migrations completed successfully');
    return true;
  } catch (error) {
    console.error('✗ Database migration failed:', error);
    return false;
  }
}