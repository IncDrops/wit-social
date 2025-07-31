
export interface Trend {
    id: string;
    title: string;
    category: string;
    engagement_score: number;
    source: string;
}

export const mockTrends: Trend[] = [
    { 
        id: '1', 
        title: 'AI-Generated Influencers', 
        category: 'Technology', 
        engagement_score: 92, 
        source: 'TikTok, LinkedIn' 
    },
    { 
        id: '2', 
        title: 'The Rise of Micro-Vlogging', 
        category: 'Content Creation', 
        engagement_score: 81, 
        source: 'Instagram, YouTube' 
    },
    { 
        id: '3', 
        title: 'Sustainable Fashion Hauls', 
        category: 'E-commerce', 
        engagement_score: 78, 
        source: 'Pinterest, TikTok' 
    },
    { 
        id: '4', 
        title: 'Gamified Marketing Campaigns', 
        category: 'Marketing', 
        engagement_score: 85, 
        source: 'Twitter, TechCrunch' 
    },
    { 
        id: '5', 
        title: 'LinkedIn\'s Creator Mode Push', 
        category: 'Professional', 
        engagement_score: 76, 
        source: 'LinkedIn News, Forbes' 
    },
    {
        id: '6',
        title: 'Short-Form Video Resumes',
        category: 'Career',
        engagement_score: 88,
        source: 'TikTok, LinkedIn'
    }
];
