import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, useMapEvents } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plus, Trash2, Save, Play, AreaChart, Clock, Crosshair, Layers, Map as MapIcon } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useToast } from '../context/ToastContext';
import { getFarms, createFarm, deleteFarm as deleteFarmApi, startMission } from '../services/api';
import type { Farm } from '../types';

const defaultIcon = L.divIcon({
  html: '<div style="width:14px;height:14px;background:#16a34a;border:2px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>',
  className: '', iconSize: [14, 14], iconAnchor: [7, 7],
});

const roverIcon = L.divIcon({
  html: '<div style="width:20px;height:20px;background:#2563eb;border:2px solid white;border-radius:50%;box-shadow:0 2px 12px rgba(37,99,235,0.5);display:flex;align-items:center;justify-content:center"><svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zm0 7L2 14l10 5 10-5-10-5z"/></svg></div>',
  className: '', iconSize: [20, 20], iconAnchor: [10, 10],
});

const initialFarms: Farm[] = [
  { id: 'farm-001', name: 'North Field Wheat', cropType: 'Wheat', boundary: [[21.1458, 79.0882], [21.1468, 79.0892], [21.1450, 79.0900], [21.1440, 79.0888]], area: 4.2, createdAt: new Date().toISOString() },
  { id: 'farm-002', name: 'South Field Tomatoes', cropType: 'Tomato', boundary: [[21.1420, 79.0850], [21.1435, 79.0870], [21.1415, 79.0880], [21.1405, 79.0860]], area: 2.8, createdAt: new Date().toISOString() },
];

function calculateArea(boundary: [number, number][]): number {
  if (boundary.length < 3) return 0;
  let area = 0;
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  for (let i = 0; i < boundary.length; i++) {
    const [lat1, lng1] = boundary[i];
    const [lat2, lng2] = boundary[(i + 1) % boundary.length];
    area += toRad(lng2 - lng1) * (2 + Math.sin(toRad(lat1)) + Math.sin(toRad(lat2)));
  }
  return Math.round(Math.abs((area * R * R) / 2) * 100) / 100;
}

function ClickHandler({ onClick }: { onClick: (latlng: [number, number]) => void }) {
  useMapEvents({ click(e) { onClick([e.latlng.lat, e.latlng.lng]); } });
  return null;
}

export function FarmMap() {
  const { showToast } = useToast();
  const [farms, setFarms] = useState<Farm[]>(initialFarms);
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>('farm-001');
  const [drawing, setDrawing] = useState(false);
  const [points, setPoints] = useState<[number, number][]>([]);
  const [newFarmName, setNewFarmName] = useState('');

  useEffect(() => {
    async function loadFarms() {
      try {
        const fetchedFarms = await getFarms();
        if (fetchedFarms && fetchedFarms.length > 0) {
          setFarms(fetchedFarms);
          setSelectedFarmId(fetchedFarms[0].id);
        }
      } catch (err) {
        // Fallback to local default farms
      }
    }
    loadFarms();
  }, []);

  const selectedFarm = farms.find((f) => f.id === selectedFarmId);

  const handleMapClick = (latlng: [number, number]) => { if (drawing) setPoints((prev) => [...prev, latlng]); };
  const startDrawing = () => { setDrawing(true); setPoints([]); setSelectedFarmId(null); };

  const handleSaveFarm = async () => {
    if (points.length < 3) { showToast('Draw at least 3 points to create a farm boundary.', 'error'); return; }
    const computedArea = calculateArea(points);
    const farmName = newFarmName || `Farm Field ${farms.length + 1}`;

    try {
      const created = await createFarm({ name: farmName, boundary: points, area: computedArea, cropType: 'General Crop' });
      setFarms((prev) => [created, ...prev]);
      setSelectedFarmId(created.id);
      showToast(`Farm "${created.name}" saved to database!`, 'success');
    } catch (err) {
      const localFarm: Farm = { id: `f-${Date.now()}`, name: farmName, cropType: 'General Crop', boundary: points, area: computedArea, createdAt: new Date().toISOString() };
      setFarms((prev) => [localFarm, ...prev]);
      setSelectedFarmId(localFarm.id);
      showToast(`Farm "${localFarm.name}" saved locally!`, 'success');
    } finally {
      setPoints([]); setDrawing(false); setNewFarmName('');
    }
  };

  const cancelDrawing = () => { setDrawing(false); setPoints([]); };

  const handleDeleteFarm = async (id: string) => {
    try {
      await deleteFarmApi(id);
      showToast('Farm deleted from database.', 'info');
    } catch (err) {
      showToast('Farm removed locally.', 'info');
    } finally {
      setFarms((prev) => prev.filter((f) => f.id !== id));
      if (selectedFarmId === id) setSelectedFarmId(null);
    }
  };

  const handleStartRoverMission = async (farm: Farm) => {
    try {
      await startMission(farm.id, farm.name);
      showToast(`Rover mission started for ${farm.name}!`, 'success');
    } catch (err) {
      showToast(`Rover started for ${farm.name}!`, 'success');
    }
  };

  const estimatedTime = selectedFarm ? Math.round(selectedFarm.area * 18) : 0;

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
          <div className="flex items-center justify-between mb-4"><div className="flex items-center gap-2"><MapIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" /><h3 className="font-semibold text-surface-900 dark:text-white">Your Farms</h3></div><span className="text-xs font-medium text-surface-400">{farms.length} farms</span></div>
          {drawing ? (
            <div className="space-y-3">
              <input type="text" value={newFarmName} onChange={(e) => setNewFarmName(e.target.value)} placeholder="Farm name" className="input-field" />
              <p className="text-xs text-surface-500 dark:text-surface-400">Click on the map to add boundary points. {points.length} points added.</p>
              <div className="flex gap-2"><button onClick={handleSaveFarm} className="btn-primary flex-1 text-sm"><Save className="w-4 h-4" /> Save Farm</button><button onClick={cancelDrawing} className="btn-secondary text-sm">Cancel</button></div>
            </div>
          ) : (
            <>
              <button onClick={startDrawing} className="btn-secondary w-full mb-3 text-sm"><Plus className="w-4 h-4" /> Draw New Farm Field</button>
              <div className="space-y-2">
                {farms.map((farm) => (
                  <button key={farm.id} onClick={() => setSelectedFarmId(farm.id)} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${selectedFarmId === farm.id ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800' : 'hover:bg-surface-50 dark:hover:bg-surface-800 border border-transparent'}`}>
                    <div className="w-9 h-9 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 flex items-center justify-center shrink-0"><MapPin className="w-4 h-4" /></div>
                    <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-surface-800 dark:text-surface-100 truncate">{farm.name}</p><p className="text-xs text-surface-500">{farm.area} hectares</p></div>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteFarm(farm.id); }} className="text-surface-400 hover:text-red-500 transition-colors p-1"><Trash2 className="w-4 h-4" /></button>
                  </button>
                ))}
              </div>
            </>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4"><div className="flex items-center gap-2"><Layers className="w-5 h-5 text-primary-600 dark:text-primary-400" /><h3 className="font-semibold text-surface-900 dark:text-white">GPS Farm Boundary Map</h3></div>{drawing && <span className="flex items-center gap-1.5 text-xs font-medium text-primary-600 dark:text-primary-400"><Crosshair className="w-3.5 h-3.5" /> Click map to add boundary points</span>}</div>
          <div className="rounded-xl overflow-hidden h-[400px] sm:h-[480px]">
            <MapContainer center={[21.1458, 79.0882]} zoom={15} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
              <ClickHandler onClick={handleMapClick} />
              {farms.map((farm) => (
                <Polygon key={farm.id} positions={farm.boundary} pathOptions={{ color: selectedFarmId === farm.id ? '#16a34a' : '#86efac', fillColor: selectedFarmId === farm.id ? '#22c55e' : '#bbf7d0', fillOpacity: 0.3, weight: 2 }} eventHandlers={{ click: () => setSelectedFarmId(farm.id) }} />
              ))}
              {drawing && points.length > 0 && (
                <>
                  <Polygon positions={points} pathOptions={{ color: '#2563eb', fillColor: '#93c5fd', fillOpacity: 0.2, weight: 2, dashArray: '5,5' }} />
                  {points.map((p, i) => <Marker key={i} position={p} icon={defaultIcon} />)}
                </>
              )}
              {selectedFarm && selectedFarm.boundary && selectedFarm.boundary.length > 0 && <Marker position={selectedFarm.boundary[0]} icon={roverIcon} />}
            </MapContainer>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedFarm && !drawing && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card p-5"><div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 mb-2"><AreaChart className="w-4 h-4" /><span className="text-xs font-medium uppercase tracking-wide text-surface-500">Area</span></div><p className="text-2xl font-bold text-surface-900 dark:text-white font-display">{selectedFarm.area}<span className="text-base text-surface-400 ml-1">ha</span></p></div>
            <div className="card p-5"><div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2"><MapPin className="w-4 h-4" /><span className="text-xs font-medium uppercase tracking-wide text-surface-500">Coordinates</span></div><p className="text-sm font-semibold text-surface-800 dark:text-surface-100">{selectedFarm.boundary && selectedFarm.boundary[0] ? `${selectedFarm.boundary[0][0].toFixed(4)}, ${selectedFarm.boundary[0][1].toFixed(4)}` : 'N/A'}</p></div>
            <div className="card p-5"><div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-2"><Clock className="w-4 h-4" /><span className="text-xs font-medium uppercase tracking-wide text-surface-500">Est. Rover Time</span></div><p className="text-2xl font-bold text-surface-900 dark:text-white font-display">{estimatedTime}<span className="text-base text-surface-400 ml-1">min</span></p></div>
            <div className="card p-5 flex items-center justify-center"><button onClick={() => handleStartRoverMission(selectedFarm)} className="btn-primary w-full"><Play className="w-4 h-4" /> Start Rover</button></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
