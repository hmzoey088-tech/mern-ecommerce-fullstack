import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

export const signAccessToken = (payload, expiresIn = '15m') => jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn });
export const signRefreshToken = (payload, expiresIn = '7d') => jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn });

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
  } catch (err) {
    return null;
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  } catch (err) {
    return null;
  }
};
