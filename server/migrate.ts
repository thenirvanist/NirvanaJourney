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
      CREATE TABLE IF NOT EXISTS newsletter_subscriber (
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

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS heal_donations (
        id SERIAL PRIMARY KEY,
        donor_name TEXT NOT NULL,
        email TEXT NOT NULL,
        content_type TEXT NOT NULL DEFAULT 'quotes',
        content_url TEXT,
        countries TEXT[],
        duration TEXT NOT NULL,
        budget_usd INTEGER NOT NULL,
        dedication TEXT,
        anonymous BOOLEAN DEFAULT false,
        status TEXT DEFAULT 'pending',
        campaign_reach INTEGER DEFAULT 0,
        campaign_reactions INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS heal_campaigns (
        id SERIAL PRIMARY KEY,
        country_code TEXT NOT NULL UNIQUE,
        country_name TEXT NOT NULL,
        total_reach INTEGER DEFAULT 0,
        total_reactions INTEGER DEFAULT 0,
        total_shares INTEGER DEFAULT 0,
        total_comments INTEGER DEFAULT 0,
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Seed heal_campaigns with initial data (ON CONFLICT DO NOTHING is idempotent)
    await db.execute(sql`
      INSERT INTO heal_campaigns (country_code, country_name, total_reach, total_reactions, total_shares, total_comments) VALUES
      ('SD', 'Sudan', 847200, 42300, 8900, 3200),
      ('UA', 'Ukraine', 1243000, 89400, 22100, 7800),
      ('PS', 'Palestine', 632000, 51200, 14300, 5100),
      ('MM', 'Myanmar', 412000, 31800, 7200, 2900),
      ('YE', 'Yemen', 298000, 24600, 5400, 1800),
      ('SY', 'Syria', 521000, 43700, 11200, 4300),
      ('SO', 'Somalia', 187000, 15200, 3100, 1200),
      ('AF', 'Afghanistan', 763000, 58900, 13400, 4700),
      ('IQ', 'Iraq', 384000, 29300, 6800, 2400),
      ('LY', 'Libya', 213000, 18100, 3900, 1500),
      ('ML', 'Mali', 142000, 11300, 2400, 900),
      ('CD', 'DR Congo', 321000, 26400, 5900, 2100),
      ('ET', 'Ethiopia', 487000, 38200, 8700, 3100),
      ('CF', 'Central African Republic', 98000, 7800, 1600, 600),
      ('IN', 'India', 2847000, 198000, 47200, 16800)
      ON CONFLICT (country_code) DO NOTHING;
    `);

    console.log('✓ Database migrations completed successfully');
    return true;
  } catch (error) {
    console.error('✗ Database migration failed:', error);
    return false;
  }
}