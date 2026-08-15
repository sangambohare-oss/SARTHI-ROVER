import { getDb } from '../config/db.js';

export async function getReports(req, res) {
  try {
    const userId = req.user?.id || 'usr-001';
    const db = await getDb();
    const rows = await db.all('SELECT * FROM reports WHERE user_id = ? ORDER BY created_at DESC', [userId]);

    const reports = rows.map(r => ({
      id: r.id,
      date: r.date,
      crop: r.crop,
      disease: r.disease,
      health: r.health,
      treatment: r.treatment,
      status: r.status
    }));

    return res.json(reports);
  } catch (error) {
    console.error('Error in getReports:', error);
    return res.status(500).json({ error: 'Server error fetching reports' });
  }
}

export async function createReport(req, res) {
  try {
    const userId = req.user?.id || 'usr-001';
    const { crop, disease, health, treatment, status } = req.body;

    if (!crop || !disease) {
      return res.status(400).json({ error: 'Crop and disease name are required' });
    }

    const id = `rep-${Date.now()}`;
    const date = new Date().toISOString().split('T')[0];
    const db = await getDb();

    await db.run(
      `INSERT INTO reports (id, user_id, date, crop, disease, health, treatment, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, userId, date, crop, disease, health || 80, treatment || '', status || 'Pending']
    );

    const newReport = {
      id,
      date,
      crop,
      disease,
      health: health || 80,
      treatment: treatment || '',
      status: status || 'Pending'
    };

    return res.status(201).json(newReport);
  } catch (error) {
    console.error('Error in createReport:', error);
    return res.status(500).json({ error: 'Server error creating report' });
  }
}

export async function deleteReport(req, res) {
  try {
    const userId = req.user?.id || 'usr-001';
    const { id } = req.params;
    const db = await getDb();

    await db.run('DELETE FROM reports WHERE id = ? AND user_id = ?', [id, userId]);
    return res.json({ success: true, message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Error in deleteReport:', error);
    return res.status(500).json({ error: 'Server error deleting report' });
  }
}
