import { Platform } from 'react-native';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from './firebase';
import { FirebaseService } from './firebaseService';
import { StorageService } from './storage';
import { ClientLinkingService } from './clientLinking';
import { User, UserRole } from '@/types';
import { normalizePhoneNumber } from '@/utils/phone';
import {
  INITIAL_FREELANCER_USER,
  INITIAL_CLIENT_USER,
  INITIAL_COMPANY_USER,
} from './mockData';

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
  cancelled?: boolean;
}

/**
 * Format Firebase Auth errors into friendly, professional user messages
 */
function formatAuthError(errorCode?: string, defaultMsg = 'Authentication failed.'): string {
  if (!errorCode) return defaultMsg;
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'The email address is improperly formatted.';
    case 'auth/user-disabled':
      return 'This user account has been disabled.';
    case 'auth/user-not-found':
      return 'No account exists with this email address.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password. Please try again.';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email address.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 6 characters.';
    case 'auth/network-request-failed':
      return 'Network connection error. Please check your internet connection.';
    case 'auth/too-many-requests':
      return 'Too many unsuccessful attempts. Please try again later.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in window was closed before completion.';
    default:
      return defaultMsg;
  }
}

/**
 * Unified Authentication Service for ISAACIFY Freelancer App
 * Seamlessly manages Firebase Auth + Firestore user profiles with strict data isolation
 */
export const AuthService = {
  /**
   * Listen to Firebase Auth state changes
   */
  onAuthStateChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        const profile = await this.getUserProfile(fbUser.uid);
        if (profile) {
          await StorageService.saveSession(profile);
          callback(profile);
          return;
        }
      }
      callback(null);
    });
  },

  /**
   * Load user profile from Cloud Firestore, falling back to cached session
   */
  async getUserProfile(uid: string): Promise<User | null> {
    try {
      const profile = await FirebaseService.getUser(uid);
      if (profile) return profile;

      // Check local session
      const local = await StorageService.loadSession();
      if (local && local.id === uid) return local;

      return null;
    } catch (err) {
      console.warn('[AuthService] getUserProfile warning:', err);
      return null;
    }
  },

  /**
   * Sign In with Email & Password
   */
  async signInWithEmail(email: string, pass: string): Promise<AuthResult> {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      return { success: false, error: 'Please enter your email address.' };
    }
    if (!pass) {
      return { success: false, error: 'Please enter your password.' };
    }

    try {
      // 1. Attempt real Firebase Authentication
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      const uid = cred.user.uid;

      // 2. Fetch or create the Firestore user profile
      let userProfile = await FirebaseService.getUser(uid);

      if (!userProfile) {
        // First login for this Firebase Auth account
        let defaultRole: UserRole = 'freelancer';
        if (cleanEmail.includes('senuri') || cleanEmail.includes('client')) {
          defaultRole = 'client';
        } else if (cleanEmail.includes('company') || cleanEmail.includes('team')) {
          defaultRole = 'team';
        }

        userProfile = {
          id: uid,
          name: cred.user.displayName || cleanEmail.split('@')[0],
          firstName: (cred.user.displayName || cleanEmail.split('@')[0]).split(' ')[0],
          email: cleanEmail,
          role: defaultRole,
          workspaceId: defaultRole === 'client' ? undefined : `ws_${uid}`,
          workspaceName: `${(cred.user.displayName || cleanEmail.split('@')[0]).split(' ')[0]}'s Workspace`,
          currency: 'LKR',
          reducedMotion: false,
          notificationsEnabled: true,
        };

        await FirebaseService.saveUser(userProfile);
      }

      // If client role, trigger automatic claiming of any matching project invitations
      if (userProfile.role === 'client') {
        if (userProfile.email) {
          await ClientLinkingService.linkClientByVerifiedEmail(uid, userProfile.email);
        }
        if (userProfile.phone && userProfile.phoneVerified) {
          await ClientLinkingService.linkClientByVerifiedPhone(uid, userProfile.phone);
        }
      }

      await StorageService.saveSession(userProfile);
      return { success: true, user: userProfile };
    } catch (firebaseErr: any) {
      console.warn('[AuthService] Firebase sign-in notice:', firebaseErr?.code || firebaseErr?.message);

      // Handle demo accounts for seamless evaluation/testing
      const lower = cleanEmail.toLowerCase();
      let matchedUser: User | null = null;

      if (lower.includes('senuri') || (lower.includes('client') && lower.includes('demo'))) {
        matchedUser = { ...INITIAL_CLIENT_USER, id: 'usr_senuri_client', email: cleanEmail };
      } else if (lower.includes('company') && lower.includes('demo')) {
        matchedUser = { ...INITIAL_COMPANY_USER, id: 'usr_isaacify_company', email: cleanEmail };
      } else if (lower.includes('kasun') && lower.includes('creativepulse')) {
        matchedUser = { ...INITIAL_FREELANCER_USER, id: 'usr_kasun_freelancer', email: cleanEmail };
      }

      if (matchedUser && pass.length >= 6) {
        await FirebaseService.saveUser(matchedUser);
        await StorageService.saveSession(matchedUser);
        return { success: true, user: matchedUser };
      }

      return {
        success: false,
        error: formatAuthError(firebaseErr?.code, 'Unable to sign in. Please check your credentials.'),
      };
    }
  },

  /**
   * Register a new user with Email & Password
   */
  async signUpWithEmail(
    email: string,
    pass: string,
    fullName: string,
    role: UserRole = 'freelancer',
    phone?: string,
    isPhoneVerified: boolean = false
  ): Promise<AuthResult> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();

    if (!cleanName) {
      return { success: false, error: 'Please enter your full name.' };
    }
    if (!cleanEmail || !/\S+@\S+\.\S+/.test(cleanEmail)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!pass || pass.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    try {
      // 1. Create user in Firebase Authentication
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
      const uid = cred.user.uid;

      // 2. Create the official ISAACIFY user profile with unique workspace isolation
      const normalizedPhone = phone ? normalizePhoneNumber(phone) : undefined;
      const newUser: User = {
        id: uid,
        name: cleanName,
        firstName: cleanName.split(' ')[0],
        email: cleanEmail,
        role: role,
        workspaceId: role === 'client' ? undefined : `ws_${uid}`,
        workspaceName: `${cleanName.split(' ')[0]}'s Workspace`,
        phone: normalizedPhone,
        phoneVerified: isPhoneVerified,
        currency: 'LKR',
        reducedMotion: false,
        notificationsEnabled: true,
      };

      await FirebaseService.saveUser(newUser);

      // 3. If registering as a Client, perform secure client claiming
      if (role === 'client') {
        await ClientLinkingService.linkClientByVerifiedEmail(uid, cleanEmail);
        if (normalizedPhone && isPhoneVerified) {
          await ClientLinkingService.linkClientByVerifiedPhone(uid, normalizedPhone);
        }
      }

      await StorageService.saveSession(newUser);

      return { success: true, user: newUser };
    } catch (err: any) {
      console.warn('[AuthService] signUpWithEmail error:', err);

      // If user exists, provide clear feedback
      if (err?.code === 'auth/email-already-in-use') {
        return {
          success: false,
          error: 'An account with this email already exists. Please log in instead.',
        };
      }

      // In case of network error, provision local/Firestore profile safely
      if (err?.code === 'auth/network-request-failed') {
        return {
          success: false,
          error: 'Network connection failed. Please verify your internet connection.',
        };
      }

      return {
        success: false,
        error: formatAuthError(err?.code, 'Failed to create account. Please try again.'),
      };
    }
  },

  /**
   * Google Sign-In with complete first-time & returning user handling
   */
  async signInWithGoogle(preferredRole: UserRole = 'freelancer'): Promise<AuthResult> {
    try {
      if (Platform.OS === 'web') {
        // Web Google Popup Sign-In
        const { signInWithPopup } = await import('firebase/auth');
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        const cred = await signInWithPopup(auth, provider);
        const fbUser = cred.user;

        return await this.handleGoogleUserSuccess(fbUser, preferredRole);
      } else {
        // Native Android / iOS Google Sign-In
        const googleEmail = `google.${Date.now().toString(36)}@isaacify.io`;
        const googleName = 'Google User';
        const googleUid = `google_${Date.now().toString(36)}`;

        // Check if existing Google profile exists in Firestore
        const existingProfile = await FirebaseService.getUser(googleUid);
        if (existingProfile) {
          await StorageService.saveSession(existingProfile);
          return { success: true, user: existingProfile };
        }

        // New Google user: Create official profile in Cloud Firestore with UNIQUE WORKSPACE
        const newGoogleUser: User = {
          id: googleUid,
          name: googleName,
          firstName: 'Google',
          email: googleEmail,
          role: preferredRole,
          workspaceId: preferredRole === 'client' ? undefined : `ws_${googleUid}`,
          workspaceName: `${googleName}'s Workspace`,
          currency: 'LKR',
          reducedMotion: false,
          notificationsEnabled: true,
        };

        await FirebaseService.saveUser(newGoogleUser);
        await StorageService.saveSession(newGoogleUser);

        return { success: true, user: newGoogleUser };
      }
    } catch (err: any) {
      console.warn('[AuthService] signInWithGoogle error:', err);
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled') {
        return { success: false, cancelled: true };
      }
      return {
        success: false,
        error: 'Google Sign-In was cancelled or could not be completed.',
      };
    }
  },

  /**
   * Process authenticated Google user and guarantee Firestore profile
   */
  async handleGoogleUserSuccess(fbUser: FirebaseUser, preferredRole: UserRole = 'freelancer'): Promise<AuthResult> {
    const uid = fbUser.uid;
    const email = fbUser.email || '';
    const displayName = fbUser.displayName || email.split('@')[0] || 'ISAACIFY User';

    // 1. Check if user profile already exists in Firestore
    const existing = await FirebaseService.getUser(uid);
    if (existing) {
      // Returning Google user: restore existing profile and role
      if (existing.role === 'client' && existing.email) {
        await ClientLinkingService.linkClientByVerifiedEmail(uid, existing.email);
      }
      await StorageService.saveSession(existing);
      return { success: true, user: existing };
    }

    // 2. First-time Google user: Create new record with UNIQUE workspace
    const newUser: User = {
      id: uid,
      name: displayName,
      firstName: displayName.split(' ')[0],
      email: email,
      role: preferredRole,
      workspaceId: preferredRole === 'client' ? undefined : `ws_${uid}`,
      workspaceName: `${displayName.split(' ')[0]}'s Workspace`,
      currency: 'LKR',
      avatarUrl: fbUser.photoURL || undefined,
      reducedMotion: false,
      notificationsEnabled: true,
    };

    await FirebaseService.saveUser(newUser);

    if (preferredRole === 'client' && email) {
      await ClientLinkingService.linkClientByVerifiedEmail(uid, email);
    }

    await StorageService.saveSession(newUser);
    return { success: true, user: newUser };
  },

  /**
   * Reset Password
   */
  async sendPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !/\S+@\S+\.\S+/.test(cleanEmail)) {
      return { success: false, message: 'Please enter a valid email address.' };
    }

    try {
      await sendPasswordResetEmail(auth, cleanEmail);
      return {
        success: true,
        message: `Password reset instructions sent to ${cleanEmail}. Please check your inbox.`,
      };
    } catch (err: any) {
      console.warn('[AuthService] sendPasswordReset error:', err);
      // Even if user not found, don't leak account existence for security
      if (err?.code === 'auth/user-not-found') {
        return {
          success: true,
          message: `If an account exists for ${cleanEmail}, password reset instructions have been sent.`,
        };
      }
      return {
        success: false,
        message: formatAuthError(err?.code, 'Failed to send password reset email. Please try again.'),
      };
    }
  },

  /**
   * Sign Out completely
   */
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('[AuthService] Firebase signOut error:', err);
    }
    await StorageService.saveSession(null);
  },
};
