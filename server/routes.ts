import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { authService, authenticateToken } from "./auth";
import multer from "multer";
import path from "path";
import { 
  loginSchema, 
  registerSchema, 
  forgotPasswordSchema, 
  resetPasswordSchema 
} from "@shared/schema";
import { getChatbotResponse, analyzeUserIntent, generateSpiritualInsight } from "./openai";
import { TranslationService } from "./translationService";
import { 
  insertJourneySchema, insertSageSchema, insertAshramSchema, 
  insertMeetupSchema, insertRegistrationSchema, insertBlogPostSchema,
  insertTestimonialSchema, insertContactMessageSchema, insertNewsletterSubscriberSchema,
  insertDailyWisdomSchema
} from "@shared/schema";
import { registerSEORoutes } from "./seo-routes";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Configure multer for file uploads
  const upload = multer({
    dest: 'attached_assets/',
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|gif/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);
      
      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'));
      }
    }
  });

  // Journeys routes
  app.get("/api/journeys", async (req, res) => {
    try {
      const journeys = await storage.getJourneys();
      res.json(journeys);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch journeys" });
    }
  });

  app.get("/api/journeys/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const journey = await storage.getJourney(id);
      if (!journey) {
        return res.status(404).json({ message: "Journey not found" });
      }
      res.json(journey);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch journey" });
    }
  });

  app.post("/api/journeys", async (req, res) => {
    try {
      const validatedData = insertJourneySchema.parse(req.body);
      const journey = await storage.createJourney(validatedData);
      res.status(201).json(journey);
    } catch (error) {
      res.status(400).json({ message: "Invalid journey data" });
    }
  });

  // Sages routes
  app.get("/api/sages", async (req, res) => {
    try {
      const sages = await storage.getSages();
      res.json(sages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sages" });
    }
  });

  app.get("/api/sages/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const sage = await storage.getSage(id);
      if (!sage) {
        return res.status(404).json({ message: "Sage not found" });
      }
      res.json(sage);
    } catch (error) {
      console.error("Error fetching sage:", error);
      res.status(500).json({ message: "Failed to fetch sage" });
    }
  });

  app.post("/api/sages", async (req, res) => {
    try {
      const body = req.body;
      
      // Transform data to match schema
      const transformedData = {
        name: body.name,
        description: body.description || "",
        biography: body.description || body.biography || "",  // Use description as biography if not provided
        image: body.imageUrl || body.image || "",  // Map imageUrl to image
        location: body.location || null,
        teachings: body.teachings ? (Array.isArray(body.teachings) ? body.teachings : [body.teachings]) : [],
        books: body.books ? (Array.isArray(body.books) ? body.books : [body.books]) : [],
        coreTeachings: body.coreTeachings || [],
        notableWork: body.notableWork || [],
        category: body.category || null,
        era: body.era || null,
        status: body.status || null,
      };
      
      const validatedData = insertSageSchema.parse(transformedData);
      const sage = await storage.createSage(validatedData);
      
      // Transform back to match frontend expectations
      const responseData = {
        ...sage,
        imageUrl: sage.image,
        teachings: sage.teachings?.[0] || "",
        books: sage.books?.[0] || "",
      };
      
      res.status(201).json(responseData);
    } catch (error) {
      console.error("Create sage error:", error);
      if (error instanceof Error) {
        res.status(400).json({ message: `Invalid sage data: ${error.message}` });
      } else {
        res.status(400).json({ message: "Invalid sage data" });
      }
    }
  });

  app.put("/api/sages/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      const sage = await storage.updateSage(id, updateData);
      if (!sage) {
        return res.status(404).json({ message: "Sage not found" });
      }
      res.json(sage);
    } catch (error) {
      console.error("Update sage error:", error);
      res.status(400).json({ message: "Failed to update sage" });
    }
  });

  app.delete("/api/sages/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteSage(id);
      if (!deleted) {
        return res.status(404).json({ message: "Sage not found" });
      }
      res.json({ message: "Sage deleted successfully" });
    } catch (error) {
      console.error("Delete sage error:", error);
      res.status(400).json({ message: "Failed to delete sage" });
    }
  });

  // Ashrams routes
  app.get("/api/ashrams", async (req, res) => {
    try {
      const ashrams = await storage.getAshrams();
      res.json(ashrams);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ashrams" });
    }
  });

  app.get("/api/ashrams/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const ashram = await storage.getAshram(id);
      if (!ashram) {
        return res.status(404).json({ message: "Ashram not found" });
      }
      res.json(ashram);
    } catch (error) {
      console.error("Error fetching ashram:", error);
      res.status(500).json({ message: "Failed to fetch ashram" });
    }
  });

  app.post("/api/ashrams", async (req, res) => {
    try {
      const body = req.body;
      
      // Transform data to match schema
      const transformedData = {
        name: body.name || "",
        location: body.location || "",
        description: body.description || "",
        facilities: body.facilities || [],
        image: body.imageUrl || body.image || "",  // Map imageUrl to image
        contact: body.contactEmail || body.contact || null,
        website: body.website || null,
        region: body.region || null,
        focus: body.focus || null,
        founders: body.founders || null,
      };
      
      const validatedData = insertAshramSchema.parse(transformedData);
      const ashram = await storage.createAshram(validatedData);
      
      // Transform back to match frontend expectations
      const responseData = {
        ...ashram,
        imageUrl: ashram.image,
        contactEmail: ashram.contact,
        contactPhone: body.contactPhone || "",
      };
      
      res.status(201).json(responseData);
    } catch (error) {
      console.error("Create ashram error:", error);
      if (error instanceof Error) {
        res.status(400).json({ message: `Invalid ashram data: ${error.message}` });
      } else {
        res.status(400).json({ message: "Invalid ashram data" });
      }
    }
  });

  app.put("/api/ashrams/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      const ashram = await storage.updateAshram(id, updateData);
      if (!ashram) {
        return res.status(404).json({ message: "Ashram not found" });
      }
      res.json(ashram);
    } catch (error) {
      console.error("Update ashram error:", error);
      res.status(400).json({ message: "Failed to update ashram" });
    }
  });

  app.delete("/api/ashrams/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteAshram(id);
      if (!deleted) {
        return res.status(404).json({ message: "Ashram not found" });
      }
      res.json({ message: "Ashram deleted successfully" });
    } catch (error) {
      console.error("Delete ashram error:", error);
      res.status(400).json({ message: "Failed to delete ashram" });
    }
  });

  // Meetups routes
  app.get("/api/meetups", async (req, res) => {
    try {
      const meetups = await storage.getMeetups();
      res.json(meetups);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch meetups" });
    }
  });

  app.post("/api/meetups/register", async (req, res) => {
    try {
      const validatedData = insertRegistrationSchema.parse(req.body);
      const registration = await storage.registerForMeetup(validatedData);
      res.status(201).json(registration);
    } catch (error) {
      res.status(400).json({ message: "Failed to register for meetup" });
    }
  });

  // Blog post routes
  app.get("/api/blog", async (req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error getting blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.getBlogPost(id);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error getting blog post:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  app.get("/api/blog/slug/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const post = await storage.getBlogPostBySlug(slug);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error getting blog post by slug:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  app.post("/api/blog", async (req, res) => {
    try {
      const body = req.body;
      
      // Transform data to match schema
      const transformedData = {
        title: body.title || "",
        content: body.content || "",
        excerpt: body.excerpt || "",
        author: body.author || "Admin",  // Default author if not provided
        category: body.category || "Inner Nutrition",
        image: body.imageUrl || body.image || "",  // Map imageUrl to image
        bannerImage: body.bannerImage || null,
        slug: body.slug || "",
        readTime: body.readTime || "5 min read",
        tags: body.tags || [],
        published: body.published !== undefined ? body.published : true,
        featured: body.featured || false,
        updatedAt: new Date(),
      };
      
      const postData = insertBlogPostSchema.parse(transformedData);
      const post = await storage.createBlogPost(postData);
      
      // Transform back to match frontend expectations
      const responseData = {
        ...post,
        imageUrl: post.image,
      };
      
      res.json(responseData);
    } catch (error) {
      console.error("Error creating blog post:", error);
      if (error instanceof Error) {
        res.status(400).json({ message: `Failed to create blog post: ${error.message}` });
      } else {
        res.status(400).json({ message: "Failed to create blog post" });
      }
    }
  });

  app.put("/api/blog/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      const post = await storage.updateBlogPost(id, updateData);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Update blog post error:", error);
      res.status(400).json({ message: "Failed to update blog post" });
    }
  });

  app.delete("/api/blog/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteBlogPost(id);
      if (!deleted) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json({ message: "Blog post deleted successfully" });
    } catch (error) {
      console.error("Delete blog post error:", error);
      res.status(400).json({ message: "Failed to delete blog post" });
    }
  });

  // Testimonials routes
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      console.error("Testimonials API error:", error);
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  app.get("/api/testimonials/featured", async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      // Filter for featured testimonials
      const featured = testimonials.filter(t => t.featured);
      res.json(featured);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured testimonials" });
    }
  });

  app.post("/api/testimonials", async (req, res) => {
    try {
      const validatedData = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(validatedData);
      res.status(201).json(testimonial);
    } catch (error) {
      res.status(400).json({ message: "Invalid testimonial data" });
    }
  });

  // Daily Wisdom routes
  app.get("/api/quotes", async (req, res) => {
    try {
      const quotes = await storage.getDailyWisdom();
      res.json(quotes);
    } catch (error) {
      console.error("Daily Wisdom API error:", error);
      res.status(500).json({ message: "Failed to fetch daily wisdom" });
    }
  });

  app.get("/api/quotes/active", async (req, res) => {
    try {
      const quotes = await storage.getActiveDailyWisdom();
      res.json(quotes);
    } catch (error) {
      console.error("Active daily wisdom API error:", error);
      res.status(500).json({ message: "Failed to fetch active daily wisdom" });
    }
  });

  app.post("/api/quotes", async (req, res) => {
    try {
      const validatedData = insertDailyWisdomSchema.parse(req.body);
      const quote = await storage.createDailyWisdom(validatedData);
      res.status(201).json(quote);
    } catch (error) {
      console.error("Create daily wisdom error:", error);
      res.status(400).json({ message: "Invalid daily wisdom data" });
    }
  });

  app.put("/api/quotes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      const quote = await storage.updateDailyWisdom(id, updateData);
      if (!quote) {
        return res.status(404).json({ message: "Daily wisdom not found" });
      }
      res.json(quote);
    } catch (error) {
      console.error("Update daily wisdom error:", error);
      res.status(400).json({ message: "Failed to update daily wisdom" });
    }
  });

  app.delete("/api/quotes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteDailyWisdom(id);
      if (!deleted) {
        return res.status(404).json({ message: "Daily wisdom not found" });
      }
      res.json({ message: "Daily wisdom deleted successfully" });
    } catch (error) {
      console.error("Delete daily wisdom error:", error);
      res.status(400).json({ message: "Failed to delete daily wisdom" });
    }
  });

  // Bookmark endpoints (protected routes)
  const requireAuth = authenticateToken; // Use existing auth middleware

  app.get("/api/bookmarks", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      const bookmarks = await storage.getUserBookmarks(userId);
      res.json(bookmarks);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
      res.status(500).json({ message: "Error fetching bookmarks" });
    }
  });

  app.post("/api/bookmarks", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const { contentType, contentId } = req.body;
      if (!contentType || !contentId) {
        return res.status(400).json({ message: "Content type and ID are required" });
      }

      // Check if bookmark already exists
      const existing = await storage.getBookmarkByUserAndContent(userId, contentType, contentId);
      if (existing) {
        return res.status(409).json({ message: "Content already bookmarked" });
      }

      const bookmark = await storage.createBookmark({
        userId,
        contentType,
        contentId
      });
      res.status(201).json(bookmark);
    } catch (error) {
      console.error("Error creating bookmark:", error);
      res.status(500).json({ message: "Error creating bookmark" });
    }
  });

  app.delete("/api/bookmarks/:contentType/:contentId", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const { contentType, contentId } = req.params;
      const success = await storage.deleteBookmark(userId, contentType, parseInt(contentId));
      
      if (success) {
        res.json({ message: "Bookmark removed successfully" });
      } else {
        res.status(404).json({ message: "Bookmark not found" });
      }
    } catch (error) {
      console.error("Error deleting bookmark:", error);
      res.status(500).json({ message: "Error deleting bookmark" });
    }
  });

  // General admin image upload route
  app.post("/api/admin/upload-image", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const category = req.body.category || "general";
      const timestamp = Date.now();
      const fileExtension = path.extname(req.file.originalname);
      const newFilename = `${timestamp}_${category}${fileExtension}`;
      const newPath = path.join('attached_assets', newFilename);
      
      // Move and rename the uploaded file
      const fs = await import('fs/promises');
      await fs.rename(req.file.path, newPath);
      
      const imageUrl = `/attached_assets/${newFilename}`;
      res.json({ imageUrl });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Failed to upload image" });
    }
  });

  // Admin quote image upload route (legacy compatibility)
  app.post("/api/admin/upload-quote-image", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const author = req.body.author || "unknown";
      const timestamp = Date.now();
      const fileExtension = path.extname(req.file.originalname);
      const newFilename = `${timestamp}_${author.replace(/\s+/g, '_')}${fileExtension}`;
      const newPath = path.join('attached_assets', newFilename);
      
      // Move and rename the uploaded file
      const fs = await import('fs/promises');
      await fs.rename(req.file.path, newPath);
      
      const imageUrl = `/attached_assets/${newFilename}`;
      res.json({ imageUrl });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Failed to upload image" });
    }
  });

  // Contact routes
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ message: "Failed to send contact message" });
    }
  });

  // Newsletter routes
  app.post("/api/newsletter", async (req, res) => {
    try {
      const validatedData = insertNewsletterSubscriberSchema.parse(req.body);
      const subscriber = await storage.subscribeNewsletter(validatedData);
      res.status(201).json(subscriber);
    } catch (error) {
      res.status(400).json({ message: "Failed to subscribe to newsletter" });
    }
  });

  // AI Chatbot routes
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      const response = await getChatbotResponse(message, history || []);
      res.json(response);
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ 
        message: "I'm experiencing a moment of silence. Please try again.", 
        intent: "general_info",
        confidence: 0.5 
      });
    }
  });

  app.post("/api/chat/analyze", async (req, res) => {
    try {
      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      const analysis = await analyzeUserIntent(message);
      res.json(analysis);
    } catch (error) {
      console.error("Intent analysis error:", error);
      res.status(500).json({ 
        intent: "general_info", 
        entities: [], 
        confidence: 0.5 
      });
    }
  });

  app.post("/api/spiritual-insight", async (req, res) => {
    try {
      const { topic } = req.body;
      
      if (!topic) {
        return res.status(400).json({ message: "Topic is required" });
      }

      const insight = await generateSpiritualInsight(topic);
      res.json({ insight });
    } catch (error) {
      console.error("Spiritual insight error:", error);
      res.status(500).json({ 
        insight: "In every moment, there is an opportunity for deeper understanding." 
      });
    }
  });

  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      const result = await authService.register(validatedData);
      
      res.json({
        message: "Registration successful. Please check your email to verify your account.",
        user: {
          id: result.user.id,
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          emailVerified: result.user.emailVerified,
        },
        token: result.token,
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      res.status(400).json({ 
        message: error.message || "Registration failed. Please try again." 
      });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      const result = await authService.login(validatedData);
      
      res.json({
        message: "Login successful",
        user: {
          id: result.user.id,
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          emailVerified: result.user.emailVerified,
        },
        token: result.token,
      });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(401).json({ 
        message: error.message || "Invalid credentials" 
      });
    }
  });

  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const validatedData = forgotPasswordSchema.parse(req.body);
      await authService.sendPasswordResetEmail(validatedData.email);
      
      res.json({
        message: "If an account with that email exists, we've sent password reset instructions.",
      });
    } catch (error: any) {
      console.error("Forgot password error:", error);
      res.status(500).json({ 
        message: "Failed to send reset email. Please try again." 
      });
    }
  });

  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const validatedData = resetPasswordSchema.parse(req.body);
      await authService.resetPassword(validatedData.token, validatedData.password);
      
      res.json({
        message: "Password reset successful. You can now login with your new password.",
      });
    } catch (error: any) {
      console.error("Reset password error:", error);
      res.status(400).json({ 
        message: error.message || "Password reset failed. Please try again." 
      });
    }
  });

  app.get("/api/auth/verify-email", async (req, res) => {
    try {
      const token = req.query.token as string;
      if (!token) {
        return res.status(400).json({ message: "Verification token required" });
      }

      await authService.verifyEmail(token);
      res.json({ message: "Email verified successfully" });
    } catch (error: any) {
      console.error("Email verification error:", error);
      res.status(400).json({ 
        message: error.message || "Email verification failed" 
      });
    }
  });

  app.get("/api/auth/user", authenticateToken, async (req: any, res) => {
    try {
      res.json({
        id: req.user.id,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        emailVerified: req.user.emailVerified,
      });
    } catch (error: any) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to fetch user data" });
    }
  });

  // Enhanced newsletter subscription with verification
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const verificationToken = authService.generateVerificationToken();
      await storage.createNewsletterSubscriber(email, verificationToken);
      await authService.sendNewsletterVerificationEmail(email, verificationToken);

      res.json({ 
        message: "Please check your email to confirm your newsletter subscription." 
      });
    } catch (error: any) {
      console.error("Newsletter subscription error:", error);
      res.status(500).json({ 
        message: "Failed to subscribe to newsletter. Please try again." 
      });
    }
  });

  app.get("/api/newsletter/verify", async (req, res) => {
    try {
      const token = req.query.token as string;
      if (!token) {
        return res.status(400).json({ message: "Verification token required" });
      }

      await storage.verifyNewsletterSubscriber(token);
      res.json({ message: "Newsletter subscription confirmed successfully" });
    } catch (error: any) {
      console.error("Newsletter verification error:", error);
      res.status(400).json({ 
        message: "Newsletter verification failed. Token may be invalid or expired." 
      });
    }
  });

  // Translation API routes
  const translationService = new TranslationService();

  // Translate dynamic content endpoint
  app.post("/api/translate", async (req, res) => {
    try {
      const { contentType, contentId, fields, targetLanguage } = req.body;

      if (!contentType || !contentId || !fields || !targetLanguage) {
        return res.status(400).json({ 
          message: "Missing required fields: contentType, contentId, fields, targetLanguage" 
        });
      }

      // Validate content type
      const validContentTypes = ['journey', 'sage', 'ashram', 'blog'];
      if (!validContentTypes.includes(contentType)) {
        return res.status(400).json({ 
          message: `Invalid content type. Must be one of: ${validContentTypes.join(', ')}` 
        });
      }

      const translatedFields = await translationService.translateMultipleFields(
        contentType,
        parseInt(contentId),
        fields,
        targetLanguage
      );

      res.json({
        contentType,
        contentId,
        targetLanguage,
        translatedFields,
      });
    } catch (error) {
      console.error("Translation API error:", error);
      res.status(500).json({ 
        message: "Translation failed. Please try again." 
      });
    }
  });

  // Get Deepl API usage stats (admin only)
  app.get("/api/translate/usage", async (req, res) => {
    try {
      const usage = await translationService.getApiUsage();
      res.json(usage || { message: "API key not configured" });
    } catch (error) {
      console.error("Translation usage API error:", error);
      res.status(500).json({ 
        message: "Failed to fetch usage statistics" 
      });
    }
  });

  // Clear translation cache for content (admin only)
  app.delete("/api/translate/cache/:contentType/:contentId", async (req, res) => {
    try {
      const { contentType, contentId } = req.params;
      
      await translationService.clearCacheForContent(
        contentType, 
        parseInt(contentId)
      );
      
      res.json({ 
        message: `Translation cache cleared for ${contentType}:${contentId}` 
      });
    } catch (error) {
      console.error("Clear cache API error:", error);
      res.status(500).json({ 
        message: "Failed to clear translation cache" 
      });
    }
  });

  // Register SEO routes for sitemap.xml and robots.txt
  registerSEORoutes(app);

  const httpServer = createServer(app);
  return httpServer;
}
