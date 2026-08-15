import { getDb } from '../config/db.js';

export async function getRoverStatus(req, res) {
  try {
    const db = await getDb();
    let state = await db.get('SELECT * FROM rover_state ORDER BY id DESC LIMIT 1');

    if (!state) {
      state = {
        status: 'Idle',
        battery: 87,
        water_tank: 64,
        motor_status: 'Online',
        speed: 0,
        lat: 21.1458,
        lng: 79.0882,
        estimated_time: 0,
        coverage: 0,
        current_task: 'Standby',
        signal_strength: 94
      };
    }

    return res.json({
      status: state.status,
      battery: state.battery,
      waterTank: state.water_tank,
      motorStatus: state.motor_status,
      speed: state.speed,
      coordinates: { lat: state.lat, lng: state.lng },
      estimatedTime: state.estimated_time,
      coverage: state.coverage,
      currentTask: state.current_task,
      signalStrength: state.signal_strength
    });
  } catch (error) {
    console.error('Error in getRoverStatus:', error);
    return res.status(500).json({ error: 'Server error fetching rover telemetry' });
  }
}

export async function controlRover(req, res) {
  try {
    const { action } = req.body;
    const db = await getDb();

    let newStatus = 'Idle';
    let currentTask = 'Standby';
    let speed = 0;

    switch (action) {
      case 'start_scan':
      case 'start':
        newStatus = 'Scanning';
        currentTask = 'Scanning field boundary & leaf sampling';
        speed = 2.4;
        break;
      case 'spray':
        newStatus = 'Spraying';
        currentTask = 'Targeted fungicide spot application';
        speed = 1.2;
        break;
      case 'return':
      case 'dock':
        newStatus = 'Returning';
        currentTask = 'Navigating back to docking station';
        speed = 3.0;
        break;
      case 'pause':
        newStatus = 'Idle';
        currentTask = 'Paused by operator';
        speed = 0;
        break;
      default:
        newStatus = 'Idle';
        currentTask = 'Standby';
        speed = 0;
    }

    await db.run(
      `UPDATE rover_state
       SET status = ?, current_task = ?, speed = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = (SELECT id FROM rover_state ORDER BY id DESC LIMIT 1)`,
      [newStatus, currentTask, speed]
    );

    return res.json({
      success: true,
      action,
      roverState: {
        status: newStatus,
        currentTask,
        speed
      }
    });
  } catch (error) {
    console.error('Error in controlRover:', error);
    return res.status(500).json({ error: 'Server error controlling rover' });
  }
}

export async function startMission(req, res) {
  try {
    const userId = req.user?.id || 'usr-001';
    const { farmId, farmName } = req.body;
    const db = await getDb();

    const missionId = `mis-${Date.now()}`;
    const now = new Date().toISOString();

    await db.run(
      `INSERT INTO missions (id, user_id, farm_id, farm_name, status, started_at, coverage)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [missionId, userId, farmId || 'farm-001', farmName || 'North Field Wheat', 'Active', now, 0]
    );

    await db.run(
      `UPDATE rover_state
       SET status = 'Scanning', current_task = 'Executing field scan mission', speed = 2.5
       WHERE id = (SELECT id FROM rover_state ORDER BY id DESC LIMIT 1)`
    );

    await db.run(
      `INSERT INTO history (id, user_id, type, title, description, timestamp)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [`hist-${Date.now()}`, userId, 'mission', 'Mission Started', `Rover started automated scan for ${farmName || 'North Field Wheat'}`, now]
    );

    const mission = {
      id: missionId,
      farmId: farmId || 'farm-001',
      farmName: farmName || 'North Field Wheat',
      status: 'Active',
      startedAt: now,
      completedAt: null,
      coverage: 0
    };

    return res.json({ mission });
  } catch (error) {
    console.error('Error in startMission:', error);
    return res.status(500).json({ error: 'Server error starting mission' });
  }
}

export async function stopMission(req, res) {
  try {
    const userId = req.user?.id || 'usr-001';
    const { missionId } = req.body;
    const db = await getDb();
    const now = new Date().toISOString();

    if (missionId) {
      await db.run(
        `UPDATE missions
         SET status = 'Completed', completed_at = ?, coverage = 100
         WHERE id = ? AND user_id = ?`,
        [now, missionId, userId]
      );
    } else {
      await db.run(
        `UPDATE missions
         SET status = 'Completed', completed_at = ?, coverage = 100
         WHERE user_id = ? AND status = 'Active'`,
        [now, userId]
      );
    }

    await db.run(
      `UPDATE rover_state
       SET status = 'Idle', current_task = 'Standby', speed = 0
       WHERE id = (SELECT id FROM rover_state ORDER BY id DESC LIMIT 1)`
    );

    await db.run(
      `INSERT INTO history (id, user_id, type, title, description, timestamp)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [`hist-${Date.now()}`, userId, 'mission', 'Mission Completed', 'Rover completed full field coverage and returned to base', now]
    );

    return res.json({ success: true, message: 'Mission stopped and saved successfully' });
  } catch (error) {
    console.error('Error in stopMission:', error);
    return res.status(500).json({ error: 'Server error stopping mission' });
  }
}

export async function getMissions(req, res) {
  try {
    const userId = req.user?.id || 'usr-001';
    const db = await getDb();
    const rows = await db.all('SELECT * FROM missions WHERE user_id = ? ORDER BY created_at DESC', [userId]);

    const missions = rows.map(m => ({
      id: m.id,
      farmId: m.farm_id,
      farmName: m.farm_name,
      status: m.status,
      startedAt: m.started_at,
      completedAt: m.completed_at,
      coverage: m.coverage
    }));

    return res.json(missions);
  } catch (error) {
    console.error('Error in getMissions:', error);
    return res.status(500).json({ error: 'Server error fetching missions' });
  }
}
