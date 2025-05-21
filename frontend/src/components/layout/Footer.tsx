import React from 'react';
import { Link } from '../ui/Link';
import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-base font-medium text-slate-900">About FactRush</h3>
            <p className="mt-2 text-sm text-slate-500">
              A community-driven platform for students and science enthusiasts to ask questions, share knowledge, and learn together.
            </p>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-slate-500">
                <Github className="h-5 w-5" aria-hidden="true" />
              </a>
              <a href="#" className="text-slate-400 hover:text-slate-500">
                <Twitter className="h-5 w-5" aria-hidden="true" />
              </a>
              <a href="#" className="text-slate-400 hover:text-slate-500">
                <Linkedin className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-base font-medium text-slate-900">Resources</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <Link to="/about" className="text-sm text-slate-500 hover:text-slate-700">
                  About
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-sm text-slate-500 hover:text-slate-700">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/guidelines" className="text-sm text-slate-500 hover:text-slate-700">
                  Guidelines
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-slate-500 hover:text-slate-700">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-medium text-slate-900">Community</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <Link to="/blog" className="text-sm text-slate-500 hover:text-slate-700">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-sm text-slate-500 hover:text-slate-700">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/newsletter" className="text-sm text-slate-500 hover:text-slate-700">
                  Newsletter
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-slate-500 hover:text-slate-700">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-slate-200 text-center">
          <p className="text-sm text-slate-500">&copy; {new Date().getFullYear()} FactRush. All rights reserved by MiniMax.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;