import { getDb } from '../config/db.js';

export async function getFarms(req, res) {
  try {
    const userId = req.user.id;
    const db = await getDb();
    const rows = await db.all('SELECT * FROM farms WHERE user_id = ? ORDER BY created_at DESC', [userId]);

    const farms = rows.map(f => ({
      id: f.id,
      name: f.name,
      cropType: f.crop_type,
      boundary: JSON.parse(f.boundary || '[]'),
      area: f.area,
      createdAt: f.created_at
    }));

    return res.json(farms);
  } catch (error) {
    console.error('Error in getFarms:', error);
    return res.status(500).json({ error: 'Server error getting farms' });
  }
}

export async function createFarm(req, res) {
  try {
    const userId = req.user.id;
    const { name, cropType, boundary, area } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Farm name is required' });
    }

    const id = `farm-${Date.now()}`;
    const db = await getDb();
    const boundaryStr = JSON.stringify(boundary || []);

    await db.run(
      `INSERT INTO farms (id, user_id, name, crop_type, boundary, area)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, userId, name, cropType || '', boundaryStr, area || 1.5]
    );

    const newFarm = {
      id,
      name,
      cropType: cropType || '',
      boundary: boundary || [],
      area: area || 1.5,
      createdAt: new Date().toISOString()
    };

    return res.status(201).json(newFarm);
  } catch (error) {
    console.error('Error in createFarm:', error);
    return res.status(500).json({ error: 'Server error creating farm' });
  }
}

export async function deleteFarm(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const db = await getDb();

    await db.run('DELETE FROM farms WHERE id = ? AND user_id = ?', [id, userId]);
    return res.json({ success: true, message: 'Farm deleted successfully' });
  } catch (error) {
    console.error('Error in deleteFarm:', error);
    return res.status(500).json({ error: 'Server error deleting farm' });
  }
}
