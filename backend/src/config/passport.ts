import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import User, { IUser } from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

// ─── JWT Strategy ─────────────────────────────────────────────────────────────
const jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'fallback_secret',
};

passport.use(
  new JwtStrategy(jwtOptions, async (jwtPayload: { id: string }, done) => {
    try {
      const user = await User.findById(jwtPayload.id).select('-password');
      if (!user) return done(null, false);
      if (user.status === 'suspended') return done(null, false, { message: 'Account suspended' });
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

// ─── Google OAuth Strategy ────────────────────────────────────────────────────
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
        scope: ['profile', 'email'],
      },
      async (
        _accessToken: string,
        _refreshToken: string,
        profile: Profile,
        done: (error: Error | null, user?: IUser | false) => void
      ) => {
        try {
          // Extract email from Google profile
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error('No email from Google profile'));
          }

          // Find existing user or create one
          let user = await User.findOne({ email });

          if (!user) {
            user = await User.create({
              name: profile.displayName || `${profile.name?.givenName} ${profile.name?.familyName}`,
              email,
              googleId: profile.id,
              avatar: profile.photos?.[0]?.value,
              role: 'student',
              status: 'active',
              authProvider: 'google',
            });
          } else if (!user.googleId) {
            // Link Google to existing email/password account
            user.googleId = profile.id;
            if (!user.avatar) user.avatar = profile.photos?.[0]?.value;
            await user.save();
          }

          return done(null, user);
        } catch (error) {
          return done(error as Error);
        }
      }
    )
  );
  console.log('✅ Google OAuth strategy configured');
} else {
  console.warn('⚠️  Google OAuth env vars not set — Google login disabled');
}

// Serialize/deserialize for session (not used in JWT mode, but required by passport)
passport.serializeUser((user: Express.User, done) => {
  done(null, (user as IUser)._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id).select('-password');
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
