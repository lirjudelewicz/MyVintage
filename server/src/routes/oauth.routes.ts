import { Router } from 'express';
import passport from 'passport';
import { oauthCallback } from '../controllers/oauth.controller';

const router = Router();

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Initiate Google OAuth login
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to Google consent screen
 */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to frontend with accessToken and refreshToken in query string
 */
router.get(
    '/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/api/auth/oauth-error' }),
    oauthCallback
);

/**
 * @swagger
 * /api/auth/facebook:
 *   get:
 *     summary: Initiate Facebook OAuth login
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to Facebook consent screen
 */
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'], session: false }));

/**
 * @swagger
 * /api/auth/facebook/callback:
 *   get:
 *     summary: Facebook OAuth callback
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to frontend with accessToken and refreshToken in query string
 */
router.get(
    '/facebook/callback',
    passport.authenticate('facebook', { session: false, failureRedirect: '/api/auth/oauth-error' }),
    oauthCallback
);

/**
 * @swagger
 * /api/auth/oauth-error:
 *   get:
 *     summary: OAuth failure fallback
 *     tags: [Auth]
 *     responses:
 *       401:
 *         description: OAuth authentication failed
 */
router.get('/oauth-error', (_req, res) => {
    res.status(401).json({ message: 'OAuth authentication failed' });
});

export default router;
