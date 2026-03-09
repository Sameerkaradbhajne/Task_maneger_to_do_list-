import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-dark-bg border-t border-primary-foreground/10 py-12 md:py-16">
      <div className="max-w-[120rem] mx-auto px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Section */}
          <div>
            <h3 className="font-heading text-2xl uppercase text-primary-foreground mb-4">
              PRODUCTIVITY
            </h3>
            <p className="font-paragraph text-base text-primary-foreground/70 leading-relaxed">
              Your all-in-one productivity suite for managing tasks, habits, and schedules.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg uppercase text-primary-foreground mb-4 tracking-wider">
              Features
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="font-paragraph text-base text-primary-foreground/70 hover:text-accent-blue hover:underline underline-offset-4 transition-all"
                >
                  Task Manager
                </Link>
              </li>
              <li>
                <Link
                  to="/habits"
                  className="font-paragraph text-base text-primary-foreground/70 hover:text-accent-blue hover:underline underline-offset-4 transition-all"
                >
                  Habit Tracker
                </Link>
              </li>
              <li>
                <Link
                  to="/timetable"
                  className="font-paragraph text-base text-primary-foreground/70 hover:text-accent-blue hover:underline underline-offset-4 transition-all"
                >
                  Timetable
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-heading text-lg uppercase text-primary-foreground mb-4 tracking-wider">
              About
            </h4>
            <p className="font-paragraph text-base text-primary-foreground/70 leading-relaxed">
              Built with modern technology to help you stay organized, build better habits, and manage your time effectively.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10">
          <p className="font-paragraph text-sm text-primary-foreground/50 text-center">
            © {new Date().getFullYear()} Productivity Suite. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
