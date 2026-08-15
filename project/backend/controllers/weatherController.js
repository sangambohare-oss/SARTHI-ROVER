import { getDb } from '../config/db.js';

export async function getWeather(req, res) {
  try {
    const db = await getDb();
    let w = await db.get('SELECT * FROM weather ORDER BY id DESC LIMIT 1');

    if (!w) {
      w = {
        temperature: 28,
        humidity: 65,
        condition: 'Partly Cloudy',
        wind_speed: 12,
        soil_moisture: 42,
        air_quality: 45
      };
    }

    return res.json({
      temperature: w.temperature,
      humidity: w.humidity,
      condition: w.condition,
      windSpeed: w.wind_speed,
      soilMoisture: w.soil_moisture,
      airQuality: w.air_quality
    });
  } catch (error) {
    console.error('Error in getWeather:', error);
    return res.status(500).json({ error: 'Server error fetching weather' });
  }
}

export async function getCropHealth(req, res) {
  try {
    return res.json({
      healthyPercent: 82,
      diseasePercent: 18,
      nutrientStatus: 'Optimal (N: 140, P: 45, K: 190 kg/ha)',
      soilHealth: 78,
      waterRequirement: '22 Liters / Sq Meter per week',
      growthStage: 'Flowering & Grain Filling',
      timeline: [
        { week: 'W1', health: 95 },
        { week: 'W2', health: 92 },
        { week: 'W3', health: 88 },
        { week: 'W4', health: 80 },
        { week: 'W5', health: 76 },
        { week: 'W6', health: 82 }
      ]
    });
  } catch (error) {
    console.error('Error in getCropHealth:', error);
    return res.status(500).json({ error: 'Server error fetching crop health metrics' });
  }
}
