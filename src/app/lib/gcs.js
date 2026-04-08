import { Storage } from "@google-cloud/storage";

const projectId = process.env.GCP_PROJECT_ID;
const clientEmail = process.env.GCP_CLIENT_EMAIL;
const privateKey = process.env.GCP_PRIVATE_KEY;
const bucketName = process.env.GCS_BUCKET_NAME;

let bucket = null;

if (projectId && clientEmail && privateKey && bucketName) {
  const storage = new Storage({
    projectId,
    credentials: {
      client_email: clientEmail,
      private_key: privateKey.replace(/\\n/g, "\n"),
    },
  });

  bucket = storage.bucket(bucketName);
}

export { bucket };
