import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
import { storage } from "./storage";
import { emailService } from "./email";
import type { AuthUser, LoginData, RegisterData } from "@shared/schema";

const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret-key";
const JWT_EXPIRES_IN = "7d";

export const authService = {
  // Hash password
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  },

  // Compare password
  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  },

  // Generate JWT token
  generateToken(userId: number): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  },

  // Verify JWT token
  verifyToken(token: string): { userId: number } | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
      return decoded;
    } catch (error) {
      return null;
    }
  },

  // Generate verification token
  generateVerificationToken(): string {
    return randomBytes(32).toString('hex');
  },

  // Register user
  async register(userData: RegisterData): Promise<{ user: AuthUser; token: string }> {
    // Check if user already exists
    const existingUser = await storage.getAuthUserByEmail(userData.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash password
    const hashedPassword = await this.hashPassword(userData.password);
    
    // Generate email verification token
    const emailVerificationToken = this.generateVerificationToken();

    // Create user
    const user = await storage.createAuthUser({
      email: userData.email,
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      emailVerificationToken,
      emailVerified: false,
    });

    // Send verification email
    await this.sendVerificationEmail(user.email, emailVerificationToken);

    // Generate JWT token
    const token = this.generateToken(user.id);

    return { user, token };
  },

  // Login user
  async login(loginData: LoginData): Promise<{ user: AuthUser; token: string }> {
    // Find user by email
    const user = await storage.getAuthUserByEmail(loginData.email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Compare password
    const isPasswordValid = await this.comparePassword(loginData.password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Generate JWT token
    const token = this.generateToken(user.id);

    return { user, token };
  },

  // Verify email
  async verifyEmail(token: string): Promise<boolean> {
    const user = await storage.getAuthUserByVerificationToken(token);
    if (!user) {
      throw new Error("Invalid verification token");
    }

    await storage.updateAuthUser(user.id, {
      emailVerified: true,
      emailVerificationToken: null,
    });

    return true;
  },

  // Send verification email
  async sendVerificationEmail(email: string, token: string): Promise<void> {
    await emailService.sendVerificationEmail(email, token);
  },

  // Send password reset email
  async sendPasswordResetEmail(email: string): Promise<boolean> {
    const user = await storage.getAuthUserByEmail(email);
    if (!user) {
      // Don't reveal if email exists or not
      return true;
    }

    const resetToken = this.generateVerificationToken();
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    await storage.updateAuthUser(user.id, {
      passwordResetToken: resetToken,
      passwordResetExpires: resetExpires,
    });

    await emailService.sendPasswordResetEmail(email, resetToken);
    return true;
  },

  // Reset password
  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const user = await storage.getAuthUserByResetToken(token);
    if (!user || !user.passwordResetExpires || new Date() > user.passwordResetExpires) {
      throw new Error("Invalid or expired reset token");
    }

    const hashedPassword = await this.hashPassword(newPassword);

    await storage.updateAuthUser(user.id, {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    });

    return true;
  },

  // Send newsletter verification email
  async sendNewsletterVerificationEmail(email: string, token: string): Promise<void> {
    await emailService.sendNewsletterConfirmation(email, token);
  },
};

// Middleware for authentication
export const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  const decoded = authService.verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }

  try {
    const user = await storage.getAuthUser(decoded.userId);
    if (!user) {
      return res.status(403).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Authentication error' });
  }
};