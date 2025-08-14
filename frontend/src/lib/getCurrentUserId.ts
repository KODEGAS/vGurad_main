import { auth } from '@/firebase';
import { User } from 'firebase/auth';

export function getCurrentUserId(): string | null {
  const user = auth.currentUser as User | null;
  return user ? user.uid : null;
}
