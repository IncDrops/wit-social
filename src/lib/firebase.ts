// Import the functions you need from the SDKs you need
import { initializeApp, type FirebaseOptions } from "firebase/app";
import { getFirestore, collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import type { Trend } from "@/lib/data";

// Your web app's Firebase configuration
const firebaseConfig: FirebaseOptions = {
  projectId: "trendsights-ai-2tpf3",
  appId: "1:240319807394:web:64860f2cf31c165723bcfb",
  storageBucket: "trendsights-ai-2tpf3.firebasestorage.app",
  apiKey: "AIzaSyDmq35VItABLwPvp3-932moH8gp6ZroAVE",
  authDomain: "trendsights-ai-2tpf3.firebaseapp.com",
  messagingSenderId: "240319807394",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
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
        
        return trends;
    } catch (error) {
        console.error("Error fetching trends from Firestore: ", error);
        return [];
    }
}
