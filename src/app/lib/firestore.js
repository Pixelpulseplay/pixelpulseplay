// src/lib/firebaseAdmin.js
export const runtime = "nodejs";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const projectId = process.env.GCP_PROJECT_ID;
const clientEmail = process.env.GCP_CLIENT_EMAIL;
const privateKey = process.env.GCP_PRIVATE_KEY;

const hasFirebaseConfig = Boolean(projectId && clientEmail && privateKey);

let db = null;

if (hasFirebaseConfig) {
  const serviceAccount = {
    projectId,
    clientEmail,
    privateKey: privateKey.replace(/\\n/g, "\n"),
  };

  if (!getApps().length) {
    initializeApp({
      credential: cert(serviceAccount),
    });
  }

  db = getFirestore(undefined, "pixelpulse");
}

export { db };
