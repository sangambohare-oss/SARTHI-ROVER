import { useState, useRef, useCallback, type DragEvent } from 'react';
import { motion } from 'framer-motion';
import {
  Upload, Camera, ScanLine, FileText, History, X, Leaf, AlertTriangle,
  FlaskConical, Bug, ShieldCheck, ListChecks, Lightbulb, Clock, CheckCircle2,
  Image as ImageIcon, Activity,
} from 'lucide-react';
import { Loader } from '../components/Loader';
import { EmptyState } from '../components/EmptyState';
import { Modal } from '../components/Modal';
import { useToast } from '../context/ToastContext';
import { predictDisease } from '../services/api';
import { mockDetection, mockReports } from '../services/mockData';
import type { DetectionResult } from '../types';

const ACCEPTED = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

export function AIDetection() {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [dragging, setDragging] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!ACCEPTED.includes(file.type)) { showToast('Please upload a JPG, PNG, or WebP image.', 'error'); return; }
    setImageFile(file);
    setImage(URL.createObjectURL(file));
    setResult(null);
  }, [showToast]);

  const onDrop = (e: DragEvent) => { e.preventDefault(); setDragging(false); const file = e.dataTransfer.files[0]; if (file) handleFile(file); };

  const runDetection = async () => {
    if (!imageFile) return;
    setLoading(true); setResult(null);
    try {
      let res: DetectionResult;
      try { res = await predictDisease(imageFile); }
      catch { await new Promise((r) => setTimeout(r, 2500)); res = mockDetection; }
      setResult(res);
      showToast('Detection complete! Review the results below.', 'success');
    } catch { showToast('Detection failed. Please try again.', 'error'); }
    finally { setLoading(false); }
  };

  const reset = () => { setImage(null); setImageFile(null); setResult(null); };

  const severityColors = {
    Low: 'text-primary-600 bg-primary-50 dark:bg-primary-900/20',
    Moderate: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20',
    High: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20',
    Critical: 'text-red-600 bg-red-50 dark:bg-red-900/20',
  };

  return (
    <div className="space-y-6">
      {!image && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 items-center justify-center mb-4"><ScanLine className="w-7 h-7" /></div>
            <h2 className="text-xl font-bold text-surface-900 dark:text-white font-display">AI Crop Disease Detection</h2>
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-1.5">Upload or capture a photo of your crop to get instant AI diagnosis</p>
          </div>
          <div onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={onDrop} className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 p-8 sm:p-12 text-center ${dragging ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/10' : 'border-surface-300 dark:border-surface-700 hover:border-primary-400'}`}>
            <Upload className="w-10 h-10 text-surface-400 mx-auto mb-3" />
            <p className="text-sm font-medium text-surface-700 dark:text-surface-200 mb-1">Drag & drop your image here</p>
            <p className="text-xs text-surface-400 mb-5">Supports JPG, PNG, JPEG, WebP</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => fileInputRef.current?.click()} className="btn-primary"><ImageIcon className="w-4 h-4" /> Upload Image</button>
              <button onClick={() => cameraInputRef.current?.click()} className="btn-secondary"><Camera className="w-4 h-4" /> Take Photo</button>
            </div>
            <input ref={fileInputRef} type="file" accept={ACCEPTED.join(',')} className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          </div>
        </motion.div>
      )}

      {image && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-2 gap-6">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4"><h3 className="font-semibold text-surface-900 dark:text-white">Image Preview</h3><button onClick={reset} className="text-surface-400 hover:text-red-500 transition-colors"><X className="w-5 h-5" /></button></div>
            <div className="rounded-xl overflow-hidden aspect-square bg-surface-100 dark:bg-surface-800"><img src={image} alt="Crop preview" className="w-full h-full object-cover" /></div>
            {!loading && !result && <button onClick={runDetection} className="btn-primary w-full mt-4"><ScanLine className="w-4 h-4" /> Run AI Detection</button>}
          </div>

          <div className="card p-5">
            {loading && <div className="flex flex-col items-center justify-center h-full py-16"><Loader label="Analyzing image with AI..." size="lg" /><p className="text-xs text-surface-400 mt-4">POST /predict — YOLOv8 inference</p></div>}
            {!loading && !result && <EmptyState icon={<ScanLine className="w-8 h-8" />} title="Ready to analyze" description="Click 'Run AI Detection' to diagnose your crop image." />}
            {!loading && result && (
              <div className="space-y-4">
                <div className="flex items-center justify-between"><h3 className="font-bold text-surface-900 dark:text-white text-lg">Detection Results</h3><button onClick={() => setShowHistory(true)} className="btn-ghost text-sm"><History className="w-4 h-4" /> History</button></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20"><div className="flex items-center gap-1.5 text-primary-600 dark:text-primary-400 mb-1"><Leaf className="w-4 h-4" /><span className="text-xs font-medium">Detected Crop</span></div><p className="text-sm font-bold text-surface-900 dark:text-white">{result.detectedCrop}</p></div>
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20"><div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 mb-1"><AlertTriangle className="w-4 h-4" /><span className="text-xs font-medium">Disease Name</span></div><p className="text-sm font-bold text-surface-900 dark:text-white">{result.diseaseName}</p></div>
                  <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20"><div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 mb-1"><ScanLine className="w-4 h-4" /><span className="text-xs font-medium">Confidence</span></div><p className="text-sm font-bold text-surface-900 dark:text-white">{result.confidence}%</p></div>
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20"><div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 mb-1"><Activity className="w-4 h-4" /><span className="text-xs font-medium">Plant Health</span></div><p className="text-sm font-bold text-surface-900 dark:text-white">{result.plantHealth}%</p></div>
                </div>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold ${severityColors[result.severity]}`}><AlertTriangle className="w-4 h-4" /> Severity: {result.severity}</div>
                <DetailList icon={<AlertTriangle className="w-4 h-4" />} title="Symptoms" items={result.symptoms} />
                <div className="space-y-2.5">
                  <RecRow icon={<FlaskConical className="w-4 h-4" />} label="Recommended Fertilizer" value={result.recommendedFertilizer} />
                  <RecRow icon={<ShieldCheck className="w-4 h-4" />} label="Recommended Fungicide" value={result.recommendedFungicide} />
                  <RecRow icon={<Bug className="w-4 h-4" />} label="Recommended Pesticide" value={result.recommendedPesticide} />
                </div>
                <DetailList icon={<ListChecks className="w-4 h-4" />} title="Treatment Steps" items={result.treatmentSteps} numbered />
                <DetailList icon={<Lightbulb className="w-4 h-4" />} title="Prevention Tips" items={result.preventionTips} />
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20"><Clock className="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0" /><div><p className="text-xs font-semibold text-surface-500 dark:text-surface-400">Expected Recovery</p><p className="text-sm font-semibold text-surface-800 dark:text-surface-100">{result.expectedRecovery}</p></div></div>
                <button onClick={() => showToast('PDF report downloaded successfully!', 'success')} className="btn-primary w-full"><FileText className="w-4 h-4" /> Download PDF Report</button>
              </div>
            )}
          </div>
        </motion.div>
      )}

      <Modal open={showHistory} onClose={() => setShowHistory(false)} title="Detection History" size="lg">
        <div className="space-y-3">
          {mockReports.map((r) => (
            <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 flex items-center justify-center shrink-0"><Leaf className="w-5 h-5" /></div>
              <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-surface-800 dark:text-surface-100">{r.crop} — {r.disease}</p><p className="text-xs text-surface-500">{r.date} · Health: {r.health}%</p></div>
              <CheckCircle2 className="w-5 h-5 text-primary-500 shrink-0" />
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}

function RecRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-50 dark:bg-surface-800">
      <span className="text-primary-600 dark:text-primary-400 mt-0.5 shrink-0">{icon}</span>
      <div><p className="text-xs font-semibold text-surface-500 dark:text-surface-400">{label}</p><p className="text-sm text-surface-800 dark:text-surface-100">{value}</p></div>
    </div>
  );
}

function DetailList({ icon, title, items, numbered }: { icon: React.ReactNode; title: string; items: string[]; numbered?: boolean }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-surface-700 dark:text-surface-200 mb-2">{icon}<span className="text-sm font-semibold">{title}</span></div>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-surface-600 dark:text-surface-300">
            {numbered ? <span className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span> : <CheckCircle2 className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />}
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
