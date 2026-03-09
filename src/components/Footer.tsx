export default function Footer() {
  return (
    <footer className="w-full bg-background border-t border-foreground/10 py-12 md:py-16">
      <div className="max-w-[100rem] mx-auto px-8 md:px-16 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Section */}
          <div>
            <h3 className="font-heading text-2xl uppercase text-foreground mb-4">
              TASK MANAGER
            </h3>
            <p className="font-paragraph text-base text-subtletext leading-relaxed">
              Professional task management designed for clarity and efficiency.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg uppercase text-foreground mb-4 tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#tasks"
                  className="font-paragraph text-base text-subtletext hover:text-primary hover:underline underline-offset-4 transition-all"
                >
                  View Tasks
                </a>
              </li>
              <li>
                <a
                  href="#create"
                  className="font-paragraph text-base text-subtletext hover:text-primary hover:underline underline-offset-4 transition-all"
                >
                  Create Task
                </a>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-heading text-lg uppercase text-foreground mb-4 tracking-wider">
              About
            </h4>
            <p className="font-paragraph text-base text-subtletext leading-relaxed">
              Built with modern technology for seamless task organization and productivity enhancement.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-foreground/10">
          <p className="font-paragraph text-sm text-subtletext text-center">
            © {new Date().getFullYear()} Task Manager. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
