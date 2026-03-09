import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full bg-gradient-to-r from-primary to-primary-dark py-6 md:py-8 sticky top-0 z-50 shadow-lg">
      <div className="max-w-[120rem] mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-heading text-2xl md:text-3xl uppercase text-primary-foreground tracking-wider hover:text-accent-blue transition-colors">
            PRODUCTIVITY
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="font-paragraph text-base text-primary-foreground hover:text-accent-blue underline-offset-4 transition-all uppercase tracking-wider"
            >
              Tasks
            </Link>
            <Link
              to="/habits"
              className="font-paragraph text-base text-primary-foreground hover:text-accent-blue underline-offset-4 transition-all uppercase tracking-wider"
            >
              Habits
            </Link>
            <Link
              to="/timetable"
              className="font-paragraph text-base text-primary-foreground hover:text-accent-blue underline-offset-4 transition-all uppercase tracking-wider"
            >
              Schedule
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-primary-foreground hover:text-accent-blue transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-6 pb-4 border-t border-primary-foreground/20 pt-4 space-y-4">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="block font-paragraph text-base text-primary-foreground hover:text-accent-blue transition-all uppercase tracking-wider"
            >
              Tasks
            </Link>
            <Link
              to="/habits"
              onClick={() => setIsMenuOpen(false)}
              className="block font-paragraph text-base text-primary-foreground hover:text-accent-blue transition-all uppercase tracking-wider"
            >
              Habits
            </Link>
            <Link
              to="/timetable"
              onClick={() => setIsMenuOpen(false)}
              className="block font-paragraph text-base text-primary-foreground hover:text-accent-blue transition-all uppercase tracking-wider"
            >
              Schedule
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
