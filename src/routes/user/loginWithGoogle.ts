import { auth, provider, signInWithPopup } from '/etc/secrets/firebase';

export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, provider);
  const idToken = await result.user.getIdToken();

  return idToken;
}
