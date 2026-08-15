import { getDb } from '../config/db.js';

export async function getHistory(req, res) {
  try {
    const userId = req.user?.id || 'usr-001';
    const db = await getDb();
    const rows = await db.all('SELECT * FROM history WHERE user_id = ? ORDER BY timestamp DESC', [userId]);

    const history = rows.map(h => ({
      id: h.id,
      type: h.type,
      title: h.title,
      description: h.description,
      timestamp: h.timestamp
    }));

    return res.json(history);
  } catch (error) {
    console.error('Error in getHistory:', error);
    return res.status(500).json({ error: 'Server error fetching activity history' });
  }
}
