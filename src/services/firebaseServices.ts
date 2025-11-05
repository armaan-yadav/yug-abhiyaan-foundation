import { auth, db } from "@/lib/firebase";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import {
  addDoc,
  collection,
  DocumentData,
  getDocs,
  query,
  QuerySnapshot,
  where,
} from "firebase/firestore";

export const signin = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
    console.log("User signed out successfully");
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    const user = result.user;
    console.log("Google sign-in successful:", user);
    return { user, token };
  } catch (error: unknown) {
    console.error("Error signing in with Google:", error);
    const e = error as { code?: string };

    if (e?.code === "auth/popup-closed-by-user") {
      throw new Error("Sign-in was cancelled");
    } else if (e?.code === "auth/popup-blocked") {
      throw new Error("Popup was blocked by browser");
    }

    throw error;
  }
};

export const addData = async (collectionName: string, data: unknown) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log("Document written with ID:", docRef.id);
  } catch (error) {
    console.error("Error adding document:", error);
    throw error;
  }
};

export const getDocBySlug = async (
  collectionName: string,
  slug: string,
  activeOnly: boolean = false
): Promise<DocumentData | null> => {
  try {
    let q;

    if (activeOnly) {
      // Query with both slug and active filters
      q = query(
        collection(db, collectionName),
        where("slug", "==", slug),
        where("active", "==", true)
      );
    } else {
      // Query with only slug filter
      q = query(collection(db, collectionName), where("slug", "==", slug));
    }

    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No document found with slug:", slug);
      return null;
    }

    // Return the first matching document with its ID
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
    };
  } catch (error) {
    console.error("Error getting document by slug:", error);
    throw error;
  }
};
