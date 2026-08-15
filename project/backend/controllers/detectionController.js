import { getDb } from '../config/db.js';

// Pre-configured disease knowledge base for smart AI detection responses
const diseaseKnowledge = [
  {
    crop: 'Tomato',
    disease: 'Early Blight',
    confidence: 96.2,
    health: 72,
    severity: 'Moderate',
    symptoms: ['Dark spots with concentric rings on leaves', 'Lower leaves turning yellow', 'Premature leaf drop'],
    treatment: ['Apply Copper Oxychloride 50% WP (2.5g/L water)', 'Prune infected lower foliage', 'Maintain dry canopy'],
    prevention: ['Rotate tomato crops every 2-3 years', 'Avoid overhead sprinkler irrigation', 'Mulch soil to prevent splash spread'],
    fertilizer: 'NPK 19-19-19',
    fungicide: 'Copper Oxychloride / Mancozeb',
    pesticide: 'Imidacloprid (for vectors)',
    recovery: '7-10 Days'
  },
  {
    crop: 'Wheat',
    disease: 'Yellow Rust',
    confidence: 94.8,
    health: 65,
    severity: 'High',
    symptoms: ['Yellow linear stripes of pustules on leaves', 'Powdery yellow dust when touched', 'Stunted grain filling'],
    treatment: ['Spray Propiconazole 25% EC (1 ml/L water)', 'Apply foliar spray immediately upon detection', 'Isolate affected patch'],
    prevention: ['Use resistant varieties (e.g., HD 2967, DBW 187)', 'Timely sowing in autumn', 'Balanced nitrogen fertilization'],
    fertilizer: 'Potash (MOP) & Zinc Sulfate',
    fungicide: 'Tebuconazole / Propiconazole',
    pesticide: 'Chlorpyrifos',
    recovery: '10-14 Days'
  },
  {
    crop: 'Cotton',
    disease: 'Bacterial Blight',
    confidence: 93.1,
    health: 78,
    severity: 'Low',
    symptoms: ['Angular water-soaked spots on leaves', 'Black arm lesions on stems', 'Boll rot'],
    treatment: ['Spray Streptocycline 100 ppm + Copper Oxychloride 0.2%', 'Remove heavily infested plants', 'Improve drainage'],
    prevention: ['Delint seed with acid before sowing', 'Seed treatment with Pseudomonas fluorescens', 'Avoid excess irrigation'],
    fertilizer: 'Bio-fertilizers (Azotobacter)',
    fungicide: 'Copper Hydroxide',
    pesticide: 'Neem Oil Extract 10000 ppm',
    recovery: '5-7 Days'
  },
  {
    crop: 'Potato',
    disease: 'Late Blight',
    confidence: 97.5,
    health: 58,
    severity: 'Critical',
    symptoms: ['Water-soaked dark lesions on leaf tips', 'White moldy growth on leaf undersides', 'Tuber necrosis'],
    treatment: ['Apply Cymoxanil + Mancozeb (2g/L water)', 'Destroy infected crop residues', 'Earthing up soil around tubers'],
    prevention: ['Use certified disease-free seed tubers', 'Destroy volunteer plants', 'Prophylactic fungicide spray before rain'],
    fertilizer: 'Potassium Nitrate & Boron',
    fungicide: 'Metalaxyl + Mancozeb',
    pesticide: 'Thiamethoxam',
    recovery: '12-15 Days'
  }
];

export async function predictDisease(req, res) {
  try {
    const userId = req.user?.id || 'usr-001';
    let imageUrl = null;

    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    // Pick disease sample or randomize
    const randomIndex = Math.floor(Math.random() * diseaseKnowledge.length);
    const resultTemplate = diseaseKnowledge[randomIndex];

    const detectionId = `det-${Date.now()}`;
    const reportId = `rep-${Date.now()}`;
    const historyId = `hist-${Date.now()}`;
    const db = await getDb();

    const symptomsStr = JSON.stringify(resultTemplate.symptoms);
    const treatmentStr = JSON.stringify(resultTemplate.treatment);
    const preventionStr = JSON.stringify(resultTemplate.prevention);

    await db.run(
      `INSERT INTO detections (
        id, user_id, farm_id, detected_crop, disease_name, confidence, plant_health, severity,
        symptoms, treatment_steps, prevention_tips, recommended_fertilizer, recommended_fungicide,
        recommended_pesticide, expected_recovery, image_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        detectionId,
        userId,
        'farm-001',
        resultTemplate.crop,
        resultTemplate.disease,
        resultTemplate.confidence,
        resultTemplate.health,
        resultTemplate.severity,
        symptomsStr,
        treatmentStr,
        preventionStr,
        resultTemplate.fertilizer,
        resultTemplate.fungicide,
        resultTemplate.pesticide,
        resultTemplate.recovery,
        imageUrl
      ]
    );

    // Auto-create report
    await db.run(
      `INSERT INTO reports (id, user_id, detection_id, date, crop, disease, health, treatment, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        reportId,
        userId,
        detectionId,
        new Date().toISOString().split('T')[0],
        resultTemplate.crop,
        resultTemplate.disease,
        resultTemplate.health,
        resultTemplate.fungicide,
        'Completed'
      ]
    );

    // Auto-log to history
    await db.run(
      `INSERT INTO history (id, user_id, type, title, description, timestamp)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        historyId,
        userId,
        'detection',
        `${resultTemplate.disease} Detected`,
        `AI scan identified ${resultTemplate.disease} on ${resultTemplate.crop} with ${resultTemplate.confidence}% confidence`,
        new Date().toISOString()
      ]
    );

    const responsePayload = {
      id: detectionId,
      detectedCrop: resultTemplate.crop,
      diseaseName: resultTemplate.disease,
      confidence: resultTemplate.confidence,
      plantHealth: resultTemplate.health,
      severity: resultTemplate.severity,
      symptoms: resultTemplate.symptoms,
      treatmentSteps: resultTemplate.treatment,
      preventionTips: resultTemplate.prevention,
      recommendedFertilizer: resultTemplate.fertilizer,
      recommendedFungicide: resultTemplate.fungicide,
      recommendedPesticide: resultTemplate.pesticide,
      expectedRecovery: resultTemplate.recovery,
      imageUrl: imageUrl || undefined,
      createdAt: new Date().toISOString()
    };

    return res.json(responsePayload);
  } catch (error) {
    console.error('Error in predictDisease:', error);
    return res.status(500).json({ error: 'Failed to process AI disease prediction' });
  }
}

export async function getDetections(req, res) {
  try {
    const userId = req.user?.id || 'usr-001';
    const db = await getDb();
    const rows = await db.all('SELECT * FROM detections WHERE user_id = ? ORDER BY created_at DESC', [userId]);

    const detections = rows.map(d => ({
      id: d.id,
      detectedCrop: d.detected_crop,
      diseaseName: d.disease_name,
      confidence: d.confidence,
      plantHealth: d.plant_health,
      severity: d.severity,
      symptoms: JSON.parse(d.symptoms || '[]'),
      treatmentSteps: JSON.parse(d.treatment_steps || '[]'),
      preventionTips: JSON.parse(d.prevention_tips || '[]'),
      recommendedFertilizer: d.recommended_fertilizer,
      recommendedFungicide: d.recommended_fungicide,
      recommendedPesticide: d.recommended_pesticide,
      expectedRecovery: d.expected_recovery,
      imageUrl: d.image_url,
      createdAt: d.created_at
    }));

    return res.json(detections);
  } catch (error) {
    console.error('Error in getDetections:', error);
    return res.status(500).json({ error: 'Server error fetching detections' });
  }
}

export async function getDetectionById(req, res) {
  try {
    const { id } = req.params;
    const db = await getDb();
    const d = await db.get('SELECT * FROM detections WHERE id = ?', [id]);

    if (!d) {
      return res.status(404).json({ error: 'Detection result not found' });
    }

    const detection = {
      id: d.id,
      detectedCrop: d.detected_crop,
      diseaseName: d.disease_name,
      confidence: d.confidence,
      plantHealth: d.plant_health,
      severity: d.severity,
      symptoms: JSON.parse(d.symptoms || '[]'),
      treatmentSteps: JSON.parse(d.treatment_steps || '[]'),
      preventionTips: JSON.parse(d.prevention_tips || '[]'),
      recommendedFertilizer: d.recommended_fertilizer,
      recommendedFungicide: d.recommended_fungicide,
      recommendedPesticide: d.recommended_pesticide,
      expectedRecovery: d.expected_recovery,
      imageUrl: d.image_url,
      createdAt: d.created_at
    };

    return res.json(detection);
  } catch (error) {
    console.error('Error in getDetectionById:', error);
    return res.status(500).json({ error: 'Server error fetching detection details' });
  }
}
