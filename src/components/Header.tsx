import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="w-full bg-primary py-6 md:py-8 sticky top-0 z-50">
      <div className="max-w-[100rem] mx-auto px-8 md:px-16 lg:px-24">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-heading text-3xl md:text-4xl uppercase text-primary-foreground tracking-wider">
            TASK MANAGER
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#tasks"
              className="font-paragraph text-base text-primary-foreground hover:underline underline-offset-4 transition-all uppercase tracking-wider"
            >
              Tasks
            </a>
            <a
              href="#create"
              className="font-paragraph text-base text-primary-foreground hover:underline underline-offset-4 transition-all uppercase tracking-wider"
            >
              Create
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
