import { auth } from '@/firebase';

// Fetches the MongoDB user profile for the currently logged-in user
export async function fetchMongoUserProfile() {
  const user = auth.currentUser;
  if (!user) throw new Error('User not logged in');
  const idToken = await user.getIdToken();
  const res = await fetch('http://localhost:5001/api/user-profile', {
    headers: {
      'Authorization': `Bearer ${idToken}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch user profile');
  return await res.json();
}
