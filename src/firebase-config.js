import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  confirmPasswordReset
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBvXD9owAIKLE-jGH6MQ0uIq9NwF9gVnxM",
  authDomain: "login-dev-areatech.firebaseapp.com",
  projectId: "login-dev-areatech",
  appId: "1:474940460782:web:252384f203434100e8edff"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {
  auth,
  provider,
  sendPasswordResetEmail,
  confirmPasswordReset
};
