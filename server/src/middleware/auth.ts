import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';
import { AuthError } from './errorHandler';

// Initialize Firebase Admin only once
if (!admin.apps.length) {
  // In production on GCP, applicationDefault() works automatically.
  // For local dev without a service account, we initialize with just the projectId
  // and verify tokens using the Firebase Auth REST API approach.
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: process.env.FIREBASE_PROJECT_ID || 'decision-vaultx'
    });
  } catch {
    // Fallback: initialize without credential for environments where
    // application default credentials are not available
    admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || 'decision-vaultx'
    });
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email?: string;
        name?: string;
        picture?: string;
      };
    }
  }
}

export const authMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthError('No authentication token provided');
    }

    const token = authHeader.split('Bearer ')[1];
    if (!token) {
      throw new AuthError('Invalid authorization header format');
    }

    const decodedToken = await admin.auth().verifyIdToken(token);

    // Derive identity from verified token — NEVER trust client-supplied uid
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name || decodedToken.displayName,
      picture: decodedToken.picture
    };

    next();
  } catch (error: any) {
    if (error instanceof AuthError) {
      next(error);
    } else {
      next(new AuthError('Invalid or expired authentication token'));
    }
  }
};
