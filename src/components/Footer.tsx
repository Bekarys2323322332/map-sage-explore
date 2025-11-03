import { Heart, Github, Mail, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative z-10 border-t border-border/50 bg-background/80 backdrop-blur-lg mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">TengriMap</h3>
            <p className="text-sm text-muted-foreground">
              Explore the rich cultural heritage of Central Asia through interactive storytelling
            </p>
            <div className="space-y-3">
              <Link className="hover:text-primary transition-colors cursor-pointer" to="/about">
                About
              </Link>
            </div>
            <div className="space-y-3">
              <Link className="hover:text-primary transition-colors cursor-pointer" to="/resources">
                Resources
              </Link>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Explore</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-primary transition-colors cursor-pointer">Kazakhstan</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Uzbekistan</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Kyrgyzstan</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Tajikistan</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Turkmenistan</li>
            </ul>
          </div>

          {/* Contact section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Connect</h3>
            <div className="flex items-center gap-4">
              <a href="#" className="p-2 rounded-lg bg-muted/50 hover:bg-primary/10 transition-colors">
                <Github className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-muted/50 hover:bg-primary/10 transition-colors">
                <Mail className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
              </a>
              <a
                href="#https://www.youtube.com/watch?v=h8DeZSB2o-c&list=RDX6yOnaeOXns&index=17"
                target="_blank"
                className="p-2 rounded-lg bg-muted/50 hover:bg-primary/10 transition-colors"
              >
                <Instagram className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© 2025 TengriMap. All rights reserved.</p>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <span>for Central Asia</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
