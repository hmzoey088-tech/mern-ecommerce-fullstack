import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';

import User from '../models/User.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/tokenUtils.js';
import { sendEmail } from '../utils/emailUtils.js';

const ACCESS_TOKEN_EXPIRES_IN = '15m';
const REFRESH_TOKEN_EXPIRES_IN = '7d';
const EMAIL_TOKEN_EXPIRES_IN = '1d';

const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

const createRefreshToken = async (user) => {
  const refreshToken = signRefreshToken({ userId: user._id, tokenVersion: user.tokenVersion }, REFRESH_TOKEN_EXPIRES_IN);
  const hashed = await bcrypt.hash(refreshToken, 12);
  user.refreshToken = hashed;
  await user.save();
  return refreshToken;
};

const validateRefreshToken = async (token, user) => {
  if (!token || !user?.refreshToken) return false;
  const isValid = await bcrypt.compare(token, user.refreshToken);
  if (!isValid) return false;
  const payload = verifyRefreshToken(token);
  return payload && payload.userId.toString() === user._id.toString();
};

/**
 * Register a new user, send verification email, and issue tokens.
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email is already in use.' });
    }

    const user = await User.create({ name, email, password });
    const accessToken = signAccessToken({ userId: user._id, role: user.role }, ACCESS_TOKEN_EXPIRES_IN);
    const refreshToken = await createRefreshToken(user);

    const verificationToken = jwt.sign({ userId: user._id }, process.env.EMAIL_SECRET, { expiresIn: EMAIL_TOKEN_EXPIRES_IN });
    const verificationUrl = `${process.env.CLIENT_ORIGIN}/verify-email?token=${verificationToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Verify your NexaShop account',
      html: `<p>Welcome ${user.name},</p><p>Please verify your email by clicking <a href="${verificationUrl}">here</a>.</p>`,
    });

    res.cookie('refreshToken', refreshToken, getCookieOptions());
    return res.status(201).json({ user: { id: user._id, email: user.email, role: user.role }, accessToken });
  } catch (error) {
    return next(error);
  }
};

/**
 * Authenticate credentials, protect against brute-force, and issue tokens.
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password +refreshToken +loginAttempts +lockUntil');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (user.isLocked) {
      return res.status(429).json({ message: 'Account locked due to too many login attempts. Try again later.' });
    }

    const passwordMatches = await user.comparePassword(password);
    if (!passwordMatches) {
      await user.incLoginAttempts();
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Email address is not verified.' });
    }

    user.loginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLogin = new Date();
    await user.save();

    const accessToken = signAccessToken({ userId: user._id, role: user.role }, ACCESS_TOKEN_EXPIRES_IN);
    const refreshToken = await createRefreshToken(user);
    res.cookie('refreshToken', refreshToken, getCookieOptions());

    return res.status(200).json({ user: { id: user._id, email: user.email, role: user.role }, accessToken });
  } catch (error) {
    return next(error);
  }
};

/**
 * Rotate refresh token and return a fresh access token.
 */
export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ message: 'Refresh token missing.' });
    }

    const payload = verifyRefreshToken(token);
    if (!payload) {
      return res.status(401).json({ message: 'Invalid refresh token.' });
    }

    const user = await User.findById(payload.userId).select('+refreshToken');
    if (!user || !await validateRefreshToken(token, user)) {
      return res.status(401).json({ message: 'Refresh token invalid or expired.' });
    }

    user.tokenVersion += 1;
    const freshRefreshToken = await createRefreshToken(user);
    const accessToken = signAccessToken({ userId: user._id, role: user.role }, ACCESS_TOKEN_EXPIRES_IN);

    res.cookie('refreshToken', freshRefreshToken, getCookieOptions());
    return res.status(200).json({ accessToken });
  } catch (error) {
    return next(error);
  }
};

/**
 * Logout user by clearing the HTTP-only cookie and invalidating refresh token.
 */
export const logout = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      const payload = verifyRefreshToken(token);
      if (payload) {
        await User.findByIdAndUpdate(payload.userId, { $inc: { tokenVersion: 1 }, refreshToken: null });
      }
    }

    res.clearCookie('refreshToken', getCookieOptions());
    return res.status(200).json({ message: 'Logged out successfully.' });
  } catch (error) {
    return next(error);
  }
};

/**
 * Send a password reset link to the user after secure token generation.
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ message: 'If the email exists, a reset link will be sent.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetExpires = Date.now() + 60 * 60 * 1000;

    user.passwordResetToken = hashedResetToken;
    user.passwordResetExpires = resetExpires;
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_ORIGIN}/reset-password?token=${resetToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Reset your NexaShop password',
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`,
    });

    return res.status(200).json({ message: 'Reset instructions sent if the account exists.' });
  } catch (error) {
    return next(error);
  }
};

/**
 * Validate reset token, update password, and invalidate old refresh tokens.
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select('+password');

    if (!user) {
      return res.status(400).json({ message: 'Reset token is invalid or has expired.' });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.tokenVersion += 1;
    user.refreshToken = null;
    await user.save();

    return res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    return next(error);
  }
};

/**
 * Verify user's email using a signed email token.
 */
export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;
    const payload = jwt.verify(token, process.env.EMAIL_SECRET);
    const user = await User.findById(payload.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    user.isVerified = true;
    await user.save();
    return res.status(200).json({ message: 'Email verified successfully.' });
  } catch (error) {
    return next(error);
  }
};
