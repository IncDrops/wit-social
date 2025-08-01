
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getFirestore, collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import type { Trend } from "@/lib/data";

// Your web app's Firebase configuration, sourced from environment variables
const firebaseConfig: FirebaseOptions = {
    apiKey: "AIzaSyB0d8UN2oydwdBdl55UuJ7Qzo7XDLmhRlg",
    authDomain: "trendsights-ai-7ji66.firebaseapp.com",
    projectId: "trendsights-ai-7ji66",
    storageBucket: "trendsights-ai-7ji66.firebasestorage.app",
    messagingSenderId: "430412186565",
    appId: "1:430412186565:web:04c1992ba4b71444e981ac"
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
