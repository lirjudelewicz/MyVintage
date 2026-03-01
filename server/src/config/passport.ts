import passport from 'passport';
import { Strategy as GoogleStrategy, Profile as GoogleProfile, VerifyCallback } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy, Profile as FacebookProfile } from 'passport-facebook';
import User from '../models/User';

const buildUsername = (displayName: string): string =>
    displayName.replace(/\s+/g, '_').toLowerCase().slice(0, 20) || 'user';

// ── Google ────────────────────────────────────────────────────────────────────
passport.use(
    new GoogleStrategy(
        {
            clientID:     process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL:  '/api/auth/google/callback',
        },
        async (_accessToken: string, _refreshToken: string, profile: GoogleProfile, done: VerifyCallback) => {
            try {
                // 1. Already linked
                let user = await User.findOne({ googleId: profile.id });
                if (user) return done(null, user);

                // 2. Same email → link accounts
                const email = profile.emails?.[0]?.value;
                if (email) {
                    user = await User.findOne({ email });
                    if (user) {
                        user.googleId = profile.id;
                        await user.save();
                        return done(null, user);
                    }
                }

                // 3. New user
                user = await User.create({
                    googleId:       profile.id,
                    email:          email ?? `${profile.id}@google.placeholder`,
                    username:       buildUsername(profile.displayName),
                    profilePicture: profile.photos?.[0]?.value ?? undefined,
                });
                return done(null, user);
            } catch (err) {
                return done(err as Error);
            }
        }
    )
);

// ── Facebook ──────────────────────────────────────────────────────────────────
passport.use(
    new FacebookStrategy(
        {
            clientID:     process.env.FACEBOOK_APP_ID as string,
            clientSecret: process.env.FACEBOOK_APP_SECRET as string,
            callbackURL:  '/api/auth/facebook/callback',
            profileFields: ['id', 'displayName', 'emails', 'photos'],
        },
        async (_accessToken: string, _refreshToken: string, profile: FacebookProfile, done: (error: any, user?: Express.User | false) => void) => {
            try {
                // 1. Already linked
                let user = await User.findOne({ facebookId: profile.id });
                if (user) return done(null, user);

                // 2. Same email → link accounts
                const email = profile.emails?.[0]?.value;
                if (email) {
                    user = await User.findOne({ email });
                    if (user) {
                        user.facebookId = profile.id;
                        await user.save();
                        return done(null, user);
                    }
                }

                // 3. New user
                user = await User.create({
                    facebookId:     profile.id,
                    email:          email ?? `${profile.id}@facebook.placeholder`,
                    username:       buildUsername(profile.displayName),
                    profilePicture: profile.photos?.[0]?.value ?? undefined,
                });
                return done(null, user);
            } catch (err) {
                return done(err as Error);
            }
        }
    )
);

export default passport;
