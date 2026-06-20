const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Guard: don't register strategy if credentials are missing
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.warn('⚠️  Google OAuth credentials missing — Google login disabled');
} else {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        // Prevents token from being passed in query string (more secure)
        proxy: true,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Validate profile has required fields
          if (!profile.emails || profile.emails.length === 0) {
            return done(new Error('No email returned from Google'), null);
          }

          const email = profile.emails[0].value;
          const avatar = profile.photos?.[0]?.value || '';

          // 1. Already linked Google account
          let user = await User.findOne({ googleId: profile.id });
          if (user) {
            // Keep avatar fresh from Google
            if (avatar && user.avatar !== avatar) {
              user.avatar = avatar;
              await user.save({ validateBeforeSave: false });
            }
            return done(null, user);
          }

          // 2. Email exists but no Google ID — link accounts
          user = await User.findOne({ email });
          if (user) {
            user.googleId = profile.id;
            if (!user.avatar && avatar) user.avatar = avatar;
            user.isEmailVerified = true;
            await user.save({ validateBeforeSave: false });
            return done(null, user);
          }

          // 3. Brand new user — create account
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName || email.split('@')[0],
            email,
            avatar,
            isEmailVerified: true, // Google already verified the email
          });

          return done(null, user);
        } catch (error) {
          // Duplicate key race condition — find and return existing user
          if (error.code === 11000) {
            const existing = await User.findOne({ email: profile.emails[0].value }).catch(() => null);
            if (existing) return done(null, existing);
          }
          return done(error, null);
        }
      }
    )
  );
}

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select('-password');
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
