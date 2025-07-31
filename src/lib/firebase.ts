
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getFirestore, collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import type { Trend } from "@/lib/data";

// Your web app's Firebase configuration
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// Function to fetch trends from Firestore
export async function getTrends(): Promise<Trend[]> {
    try {
        const trendsCollection = collection(db, 'trends');
        const trendsQuery = query(trendsCollection, orderBy('engagement_score', 'desc'), limit(10));
        const querySnapshot = await getDocs(trendsQuery);
        
        const trends: Trend[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            trends.push({
                id: doc.id,
                title: data.title,
                category: data.category,
                engagement_score: data.engagement_score,
                source: data.source,
            });
        });
        
        if (trends.length === 0) {
           console.warn("No trends found in Firestore. Make sure the 'trends' collection exists and has documents.");
        }
        
        return trends;
    } catch (error) {
        console.error("Error fetching trends from Firestore: ", error);
        // This could be due to permissions or incorrect setup.
        // Return an empty array to prevent the app from crashing.
        return [];
    }
}
