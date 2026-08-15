import { Link } from 'react-router-dom';
import { Tractor, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-surface-900 dark:bg-surface-950 text-surface-300">
      <div className="container-max px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <Tractor className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-display font-bold text-white text-base">AgriVision AI</p>
                <p className="text-[10px] text-primary-400 font-medium uppercase tracking-wider">Smart Farming Rover</p>
              </div>
            </Link>
            <p className="text-sm leading-relaxed max-w-md text-surface-400">
              Empowering farmers with AI-driven autonomous crop monitoring and precision treatment. Built for sustainable, technology-enabled agriculture.
            </p>
            <div className="flex gap-3 mt-5">
              {[Github, Twitter, Linkedin, Mail].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-surface-800 flex items-center justify-center hover:bg-primary-600 transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-white mb-4">Product</p>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/app/detection" className="hover:text-primary-400 transition-colors">AI Detection</Link></li>
              <li><Link to="/app/rover-control" className="hover:text-primary-400 transition-colors">Rover Control</Link></li>
              <li><Link to="/app/crop-health" className="hover:text-primary-400 transition-colors">Crop Health</Link></li>
              <li><Link to="/app/reports" className="hover:text-primary-400 transition-colors">Reports</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-white mb-4">Company</p>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#about" className="hover:text-primary-400 transition-colors">About</a></li>
              <li><a href="#contact" className="hover:text-primary-400 transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-surface-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-surface-500">© 2026 AgriVision AI. All rights reserved.</p>
          <p className="text-xs text-surface-500">Made for farmers, by innovators.</p>
        </div>
      </div>
    </footer>
  );
}
