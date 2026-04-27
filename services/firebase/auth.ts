import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User,
    } from 'firebase/auth';
    import { auth } from '../../config/firebase';
  
    export const register = (email: string, password: string) =>
        createUserWithEmailAndPassword(auth, email, password);
  
    export const login = (email: string, password: string) =>
        signInWithEmailAndPassword(auth, email, password);
  
    export const logout = () => signOut(auth);
  
    export const onAuthChange = (callback: (user: User | null) => void) =>
        onAuthStateChanged(auth, callback);