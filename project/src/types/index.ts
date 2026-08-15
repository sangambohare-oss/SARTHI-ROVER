export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  farmLocation: string;
  numberOfFarms: number;
  preferredLanguage: Language;
  darkMode: boolean;
  notifications: boolean;
  createdAt: string;
}

export type Language = 'en' | 'hi' | 'mr';

export interface Farm {
  id: string;
  name: string;
  boundary: [number, number][];
  area: number;
  cropType: string;
  createdAt: string;
}

export interface DetectionResult {
  id: string;
  detectedCrop: string;
  diseaseName: string;
  confidence: number;
  plantHealth: number;
  severity: 'Low' | 'Moderate' | 'High' | 'Critical';
  symptoms: string[];
  recommendedFertilizer: string;
  recommendedFungicide: string;
  recommendedPesticide: string;
  treatmentSteps: string[];
  preventionTips: string[];
  expectedRecovery: string;
  imageUrl?: string;
  createdAt: string;
}

export interface Report {
  id: string;
  date: string;
  crop: string;
  disease: string;
  health: number;
  treatment: string;
  status: 'Completed' | 'In Progress' | 'Pending';
}

export type RoverStatus = 'Idle' | 'Scanning' | 'Moving' | 'Spraying' | 'Returning' | 'Completed';

export interface RoverState {
  status: RoverStatus;
  battery: number;
  waterTank: number;
  motorStatus: 'Online' | 'Offline' | 'Maintenance';
  speed: number;
  coordinates: { lat: number; lng: number };
  estimatedTime: number;
  coverage: number;
  currentTask: string;
  signalStrength: number;
}

export interface Mission {
  id: string;
  farmId: string;
  farmName: string;
  status: 'Planned' | 'Active' | 'Paused' | 'Completed' | 'Aborted';
  startedAt: string | null;
  completedAt: string | null;
  coverage: number;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  condition: string;
  windSpeed: number;
  soilMoisture: number;
  airQuality: number;
}

export interface HistoryEntry {
  id: string;
  type: 'detection' | 'mission' | 'report';
  title: string;
  description: string;
  timestamp: string;
}

export interface CropHealth {
  healthyPercent: number;
  diseasePercent: number;
  nutrientStatus: string;
  soilHealth: number;
  waterRequirement: string;
  growthStage: string;
  timeline: { week: string; health: number }[];
}
