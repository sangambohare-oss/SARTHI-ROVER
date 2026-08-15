import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ScanLine, MapPin, Sprout, Cpu, Battery, Droplets, ArrowRight, Play, CheckCircle2,
  Quote, Mail, Phone, MapPin as MapPinIcon, Satellite, Bot, ShieldCheck, TrendingUp,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { AnimatedCounter } from '../components/AnimatedCounter';

const features = [
  { icon: ScanLine, title: 'AI Crop Detection', desc: 'YOLOv8-powered disease identification with 94%+ accuracy in real time.' },
  { icon: MapPin, title: 'GPS Navigation', desc: 'Autonomous path planning with centimetre-level precision across your fields.' },
  { icon: Droplets, title: 'Precision Spraying', desc: 'Targeted treatment delivery — only where the crop needs it.' },
  { icon: Cpu, title: 'Autonomous Rover', desc: 'Self-navigating rover that scans, diagnoses, and treats without supervision.' },
  { icon: ShieldCheck, title: 'Disease Prevention', desc: 'Early detection stops outbreaks before they spread across your farm.' },
  { icon: TrendingUp, title: 'Yield Optimization', desc: 'Data-driven insights to maximize crop health and harvest output.' },
];

const steps = [
  { icon: Satellite, title: 'Map Your Farm', desc: 'Draw boundaries and let the rover plan optimal scanning routes.' },
  { icon: Bot, title: 'Deploy Rover', desc: 'Launch an autonomous mission — the rover scans every row of crops.' },
  { icon: ScanLine, title: 'AI Diagnoses', desc: 'Onboard AI detects diseases and assesses plant health in real time.' },
  { icon: Sprout, title: 'Precision Treatment', desc: 'The rover sprays only affected areas, saving water, chemicals, and cost.' },
];

const gallery = [
  { url: 'https://images.pexels.com/photos/159397/agriculture-cereal-field-wheat-grain-159397.jpeg', title: 'Wheat Field Scan' },
  { url: 'https://images.pexels.com/photos/440731/pexels-photo-440731.jpeg', title: 'Tomato Crop Monitoring' },
  { url: 'https://images.pexels.com/photos/1112080/pexels-photo-1112080.jpeg', title: 'Rice Paddy Analysis' },
  { url: 'https://images.pexels.com/photos/2933243/pexels-photo-2933243.jpeg', title: 'Cotton Health Check' },
  { url: 'https://images.pexels.com/photos/2689763/pexels-photo-2689763.jpeg', title: 'Maize Disease Detection' },
  { url: 'https://images.pexels.com/photos/2284166/pexels-photo-2284166.jpeg', title: 'Soybean Inspection' },
];

const testimonials = [
  { name: 'Rajesh Patil', role: 'Tomato Farmer, Pune', text: 'AgriVision detected early blight in my tomato crop before I could even see it. Saved 40% of my harvest this season.', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg' },
  { name: 'Sunita Deshmukh', role: 'Cotton Grower, Nagpur', text: 'The rover navigates my 5-acre farm on its own. I just check the reports on my phone. It feels like magic.', avatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg' },
  { name: 'Amit Kulkarni', role: 'Wheat Farmer, Nashik', text: 'Precision spraying cut my pesticide costs by half. The AI diagnosis is more accurate than my old crop consultant.', avatar: 'https://images.pexels.com/photos/834863/pexels-photo-834863.jpeg' },
];

const stats = [
  { value: 94, suffix: '%', label: 'Detection Accuracy' },
  { value: 500, suffix: '+', label: 'Farms Monitored' },
  { value: 1200, suffix: '+', label: 'Diseases Identified' },
  { value: 40, suffix: '%', label: 'Cost Savings' },
];

export function Landing() {
  return (
    <div className="min-h-screen bg-white dark:bg-surface-950">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary-100/40 dark:bg-primary-900/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-accent-100/30 dark:bg-accent-900/10 blur-3xl" />
        </div>
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-xs font-semibold mb-6">
                <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />AI-Powered Smart Farming
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-900 dark:text-white leading-tight text-balance">
                AI Powered Autonomous Crop Health Monitoring & Treatment Rover
              </h1>
              <p className="mt-5 text-base sm:text-lg text-surface-600 dark:text-surface-300 leading-relaxed">
                Smart Farming. AI Crop Detection. Disease Diagnosis. GPS Navigation. Precision Agriculture.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link to="/signup" className="btn-primary text-base px-6 py-3">Start Now <ArrowRight className="w-5 h-5" /></Link>
                <a href="#about" className="btn-secondary text-base px-6 py-3"><Play className="w-4 h-4" /> Learn More</a>
              </div>
              <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {stats.map((s, i) => (
                  <div key={i}>
                    <p className="text-2xl font-bold text-surface-900 dark:text-white font-display"><AnimatedCounter value={s.value} suffix={s.suffix} /></p>
                    <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-soft aspect-[4/3]">
                <img src="https://images.pexels.com/photos/440731/pexels-photo-440731.jpeg" alt="Smart farming rover in a field" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/30 to-transparent" />
              </div>
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} className="absolute -top-4 -left-4 sm:-left-8 card p-3 shadow-soft flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 flex items-center justify-center"><ScanLine className="w-5 h-5" /></div>
                <div><p className="text-xs font-semibold text-surface-800 dark:text-surface-100">Disease Detected</p><p className="text-[10px] text-surface-500">Early Blight · 94%</p></div>
              </motion.div>
              <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }} className="absolute -bottom-4 -right-4 sm:-right-8 card p-3 shadow-soft flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center"><Battery className="w-5 h-5" /></div>
                <div><p className="text-xs font-semibold text-surface-800 dark:text-surface-100">Rover Battery</p><p className="text-[10px] text-surface-500">87% · Scanning</p></div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="section-pad bg-surface-50 dark:bg-surface-900/30">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide mb-3">About AgriVision</p>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-surface-900 dark:text-white mb-4">Bringing AI to Every Farm</h2>
            <p className="text-surface-600 dark:text-surface-300 leading-relaxed">
              AgriVision AI is an autonomous rover platform that monitors crop health, detects diseases early, and delivers precision treatment — all controlled from your phone. We make advanced agricultural technology accessible to farmers of all scales.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: Sprout, title: 'For Every Farmer', desc: 'Simple enough for first-time users, powerful enough for large operations.' },
              { icon: Cpu, title: 'AI On-Board', desc: 'Real-time inference at the edge — no internet required in the field.' },
              { icon: ShieldCheck, title: 'Sustainable Farming', desc: 'Reduce chemical usage by up to 50% with targeted treatment.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card card-hover p-6">
                <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-4"><item.icon className="w-6 h-6" /></div>
                <h3 className="font-semibold text-surface-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="section-pad">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide mb-3">Features</p>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-surface-900 dark:text-white mb-4">Everything You Need for Smart Farming</h2>
            <p className="text-surface-600 dark:text-surface-300">Comprehensive tools from detection to treatment, all in one platform.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="card card-hover p-6 group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><f.icon className="w-6 h-6" /></div>
                <h3 className="font-semibold text-surface-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="section-pad bg-surface-50 dark:bg-surface-900/30">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide mb-3">How It Works</p>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-surface-900 dark:text-white mb-4">Four Steps to a Healthier Farm</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card p-6 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center font-bold text-sm">{i + 1}</div>
                  <s.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="font-semibold text-surface-900 dark:text-white mb-2">{s.title}</h3>
                <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Detection highlight */}
      <section className="section-pad">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide mb-3">AI Detection</p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white mb-4">Detect 50+ Crop Diseases Instantly</h2>
              <p className="text-surface-600 dark:text-surface-300 leading-relaxed mb-6">
                Our YOLOv8-based model identifies diseases from a single photo — right from your phone. Get instant diagnosis with confidence scores, severity levels, and treatment recommendations.
              </p>
              <ul className="space-y-3">
                {['94%+ detection accuracy', 'Treatment recommendations in seconds', 'Works offline with rover camera', 'Downloadable PDF reports'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-surface-700 dark:text-surface-200"><CheckCircle2 className="w-5 h-5 text-primary-600 dark:text-primary-400 shrink-0" />{item}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative rounded-3xl overflow-hidden shadow-soft aspect-[4/3]">
              <img src="https://images.pexels.com/photos/268415/pexels-photo-268415.jpeg" alt="AI crop detection" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 card p-4 glass">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 flex items-center justify-center"><ScanLine className="w-5 h-5" /></div>
                  <div><p className="text-sm font-semibold text-surface-900 dark:text-white">Early Blight Detected</p><p className="text-xs text-surface-500">Confidence: 94.2% · Severity: Moderate</p></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* GPS Navigation highlight */}
      <section className="section-pad bg-surface-50 dark:bg-surface-900/30">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative rounded-3xl overflow-hidden shadow-soft aspect-[4/3] order-2 lg:order-1">
              <img src="https://images.pexels.com/photos/159397/agriculture-cereal-field-wheat-grain-159397.jpeg" alt="GPS farm navigation" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/40 to-transparent" />
              <div className="absolute top-4 right-4 card p-3 glass flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary-600" />
                <div><p className="text-xs font-semibold text-surface-900 dark:text-white">Route Planned</p><p className="text-[10px] text-surface-500">2.4 acres · 45 min</p></div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-1 lg:order-2">
              <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide mb-3">GPS Navigation</p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white mb-4">Autonomous Field Navigation</h2>
              <p className="text-surface-600 dark:text-surface-300 leading-relaxed mb-6">
                Draw your farm boundary on the map, and the rover calculates the optimal scanning path. It navigates rows autonomously, avoids obstacles, and returns to base when the mission is complete.
              </p>
              <ul className="space-y-3">
                {['Centimetre-level GPS accuracy', 'Auto-calculated farm area', 'Multi-farm support', 'Real-time rover tracking'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-surface-700 dark:text-surface-200"><CheckCircle2 className="w-5 h-5 text-primary-600 dark:text-primary-400 shrink-0" />{item}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="section-pad">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide mb-3">Gallery</p>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-surface-900 dark:text-white mb-4">AgriVision in Action</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {gallery.map((g, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="relative rounded-2xl overflow-hidden group aspect-[4/3] cursor-pointer">
                <img src={g.url} alt={g.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-950/60 to-transparent" />
                <p className="absolute bottom-3 left-4 text-white text-sm font-semibold">{g.title}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-pad bg-surface-50 dark:bg-surface-900/30">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide mb-3">Testimonials</p>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-surface-900 dark:text-white mb-4">Trusted by Farmers</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card p-6">
                <Quote className="w-8 h-8 text-primary-200 dark:text-primary-800 mb-4" />
                <p className="text-sm text-surface-600 dark:text-surface-300 leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div><p className="text-sm font-semibold text-surface-900 dark:text-white">{t.name}</p><p className="text-xs text-surface-500 dark:text-surface-400">{t.role}</p></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section-pad">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide mb-3">Contact</p>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-surface-900 dark:text-white mb-4">Get in Touch</h2>
              <p className="text-surface-600 dark:text-surface-300 leading-relaxed mb-8">
                Have questions about AgriVision AI? Want a demo on your farm? Our team is ready to help you transform your agricultural operations.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Mail, label: 'Email', value: 'hello@agrivision.ai' },
                  { icon: Phone, label: 'Phone', value: '+91 98765 43210' },
                  { icon: MapPinIcon, label: 'Office', value: 'Pune, Maharashtra, India' },
                ].map((c, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 flex items-center justify-center"><c.icon className="w-5 h-5" /></div>
                    <div><p className="text-xs text-surface-500 dark:text-surface-400">{c.label}</p><p className="text-sm font-semibold text-surface-800 dark:text-surface-100">{c.value}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-6 sm:p-8">
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div><label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-1.5">Name</label><input type="text" placeholder="Your name" className="input-field" /></div>
                <div><label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-1.5">Email</label><input type="email" placeholder="you@example.com" className="input-field" /></div>
                <div><label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-1.5">Message</label><textarea rows={4} placeholder="How can we help?" className="input-field resize-none" /></div>
                <button type="submit" className="btn-primary w-full">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 p-8 sm:p-12 lg:p-16 text-center overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white/30 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-accent-300/30 blur-3xl" />
            </div>
            <div className="relative">
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">Ready to Transform Your Farm?</h2>
              <p className="text-primary-50 mb-8 max-w-xl mx-auto">Join hundreds of farmers using AgriVision AI to grow healthier crops, save costs, and increase yields.</p>
              <Link to="/signup" className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors">Get Started Free <ArrowRight className="w-5 h-5" /></Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
