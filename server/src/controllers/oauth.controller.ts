import { Request, Response } from 'express';
import { IUser } from '../models/User';
import RefreshToken from '../models/RefreshToken';
import { generateTokens, getRefreshTokenExpiry } from '../services/token.service';

export const oauthCallback = async (req: Request, res: Response): Promise<void> => {
    const user = req.user as IUser;

    const { accessToken, refreshToken } = generateTokens(user.id, user.email);

    await RefreshToken.create({
        token:     refreshToken,
        userId:    user._id,
        expiresAt: getRefreshTokenExpiry(),
    });

    const redirectUrl = new URL(process.env.FRONTEND_URL as string);
    redirectUrl.searchParams.set('accessToken', accessToken);
    redirectUrl.searchParams.set('refreshToken', refreshToken);

    res.redirect(redirectUrl.toString());
};
