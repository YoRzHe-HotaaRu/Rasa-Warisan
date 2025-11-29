export interface Nutrition {
  calories: number;
  protein: string;
  fat: string;
  carbs: string;
}

export interface Ingredient {
  item: string;
  amount: string;
}

export interface DelicacyData {
  id: string;
  name: string;
  malayName: string;
  description: string;
  category: 'Kuih' | 'Main Dish' | 'Beverage' | 'Dessert' | 'Condiment' | 'Unknown';
  originRegion: string;
  ingredients: Ingredient[];
  recipeSteps: string[];
  history: string;
  tips: string[];
  pairing: string;
  nutrition: Nutrition;
  flavorProfile: {
    sweet: number;
    salty: number;
    spicy: number;
    sour: number;
    bitter: number;
  };
  confidence: number;
  timestamp: number;
  imageUrl?: string; // stored as base64 for history display
}

export enum AppView {
  HOME = 'HOME',
  RESULTS = 'RESULTS',
  STATS = 'STATS',
  HISTORY = 'HISTORY'
}
