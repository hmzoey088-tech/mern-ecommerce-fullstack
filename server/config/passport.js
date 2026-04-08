import passport from 'passport';

// Placeholder for future OAuth strategies and JWT passport integration.
export const initializePassport = () => {
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => done(null, id));
};

export default passport;
