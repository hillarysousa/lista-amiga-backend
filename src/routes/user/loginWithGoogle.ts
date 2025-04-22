import { auth, provider, signInWithPopup } from '../../../firebase';

export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, provider);
  const idToken = await result.user.getIdToken();

  return idToken;
}
