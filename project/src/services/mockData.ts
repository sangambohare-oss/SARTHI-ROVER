import type {
  RoverState, WeatherData, DetectionResult, Report, CropHealth, HistoryEntry, Mission,
} from '../types';

export const mockRoverState: RoverState = {
  status: 'Idle', battery: 87, waterTank: 64, motorStatus: 'Online', speed: 0,
  coordinates: { lat: 18.5204, lng: 73.8567 }, estimatedTime: 0, coverage: 0,
  currentTask: 'Awaiting mission start', signalStrength: 92,
};

export const mockWeather: WeatherData = {
  temperature: 28, humidity: 62, condition: 'Partly Cloudy', windSpeed: 12, soilMoisture: 41, airQuality: 78,
};

export const mockDetection: DetectionResult = {
  id: 'det-001', detectedCrop: 'Tomato', diseaseName: 'Early Blight', confidence: 94.2, plantHealth: 62,
  severity: 'Moderate',
  symptoms: [
    'Dark brown concentric rings on older leaves',
    'Yellowing around affected leaf areas',
    'Premature leaf drop in lower canopy',
  ],
  recommendedFertilizer: 'NPK 10-26-26 — apply 2 kg per acre',
  recommendedFungicide: 'Chlorothalonil 75 WP — 2 g per litre spray',
  recommendedPesticide: 'Imidacloprid 17.8 SL — 0.5 ml per litre',
  treatmentSteps: [
    'Remove and destroy infected lower leaves',
    'Apply fungicide spray in early morning or late evening',
    'Repeat fungicide application every 7–10 days for 3 cycles',
    'Ensure proper spacing between plants for airflow',
  ],
  preventionTips: [
    'Use disease-resistant tomato varieties',
    'Practice crop rotation with non-solanaceous crops',
    'Avoid overhead irrigation to keep foliage dry',
    'Maintain balanced soil fertility',
  ],
  expectedRecovery: '7–14 days with consistent treatment',
  createdAt: new Date().toISOString(),
};

export const mockReports: Report[] = [
  { id: 'r1', date: '2026-07-12', crop: 'Tomato', disease: 'Early Blight', health: 62, treatment: 'Fungicide spray', status: 'Completed' },
  { id: 'r2', date: '2026-07-10', crop: 'Wheat', disease: 'Leaf Rust', health: 71, treatment: 'Propiconazole', status: 'In Progress' },
  { id: 'r3', date: '2026-07-08', crop: 'Cotton', disease: 'Healthy', health: 95, treatment: 'None required', status: 'Completed' },
  { id: 'r4', date: '2026-07-05', crop: 'Maize', disease: 'Northern Leaf Blight', health: 54, treatment: 'Mancozeb spray', status: 'Pending' },
  { id: 'r5', date: '2026-07-02', crop: 'Rice', disease: 'Bacterial Blight', health: 48, treatment: 'Copper-based bactericide', status: 'In Progress' },
  { id: 'r6', date: '2026-06-28', crop: 'Soybean', disease: 'Healthy', health: 91, treatment: 'None required', status: 'Completed' },
];

export const mockCropHealth: CropHealth = {
  healthyPercent: 78, diseasePercent: 22,
  nutrientStatus: 'Balanced — Nitrogen slightly low', soilHealth: 84,
  waterRequirement: 'Moderate — 12 mm/week', growthStage: 'Flowering',
  timeline: [
    { week: 'W1', health: 92 }, { week: 'W2', health: 88 }, { week: 'W3', health: 81 },
    { week: 'W4', health: 76 }, { week: 'W5', health: 79 }, { week: 'W6', health: 78 },
  ],
};

export const mockHistory: HistoryEntry[] = [
  { id: 'h1', type: 'detection', title: 'Disease detected: Early Blight', description: 'Tomato crop — 94.2% confidence', timestamp: '2026-07-12T10:30:00Z' },
  { id: 'h2', type: 'mission', title: 'Mission completed', description: 'Farm A — 2.4 acres covered', timestamp: '2026-07-11T14:00:00Z' },
  { id: 'h3', type: 'report', title: 'Report generated', description: 'Wheat leaf rust analysis', timestamp: '2026-07-10T09:15:00Z' },
  { id: 'h4', type: 'detection', title: 'Crop scanned: Cotton', description: 'Healthy — 95% plant health', timestamp: '2026-07-08T16:45:00Z' },
  { id: 'h5', type: 'mission', title: 'Mission started', description: 'Farm B — spraying task', timestamp: '2026-07-07T08:00:00Z' },
];

export const mockMissions: Mission[] = [
  { id: 'm1', farmId: 'f1', farmName: 'North Field', status: 'Completed', startedAt: '2026-07-11T06:00:00Z', completedAt: '2026-07-11T08:30:00Z', coverage: 100 },
  { id: 'm2', farmId: 'f2', farmName: 'South Field', status: 'Completed', startedAt: '2026-07-09T06:00:00Z', completedAt: '2026-07-09T09:00:00Z', coverage: 100 },
];
