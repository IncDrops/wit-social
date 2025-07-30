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
        title: 'TikTok’s New Algorithm Update', 
        category: 'Social Media', 
        engagement_score: 87, 
        source: 'Twitter, Reddit, Google Trends' 
    },
    { 
        id: '2', 
        title: 'AI-Generated Influencers', 
        category: 'Technology', 
        engagement_score: 92, 
        source: 'TikTok, LinkedIn' 
    },
    { 
        id: '3', 
        title: 'The Rise of Micro-Vlogging', 
        category: 'Content Creation', 
        engagement_score: 81, 
        source: 'Instagram, YouTube' 
    },
    { 
        id: '4', 
        title: 'Sustainable Fashion Hauls', 
        category: 'E-commerce', 
        engagement_score: 78, 
        source: 'Pinterest, TikTok' 
    },
    { 
        id: '5', 
        title: 'Gamified Marketing Campaigns', 
        category: 'Marketing', 
        engagement_score: 85, 
        source: 'Twitter, TechCrunch' 
    },
    { 
        id: '6', 
        title: 'LinkedIn\'s Creator Mode Push', 
        category: 'Professional', 
        engagement_score: 76, 
        source: 'LinkedIn News, Forbes' 
    },
];
