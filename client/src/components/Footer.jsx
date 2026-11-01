import Paragraph from "./Paragraph";
import logo from "../assets/logo/lfs_logo.png";
import { useState } from "react";

function Footer() {
    const [submitted, setSubmitted] = useState(false);

    function handleSubmit(event) {
      event.preventDefault();
      setSubmitted(true);
      event.currentTarget.reset();
    }

    return (
      <footer className="bg-header-footer text-white px-8 py-12 md:p-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">

        {/* Left: Logo and copyright */}
          <div className="flex flex-col items-start gap-4">
            <img
              src={logo}
              alt="London Fitness Studio Logo"
              className="h-20 w-auto block"
            />

            <Paragraph className="text-gray-500 text-xs text-center">
              © London Fitness Centre 2026
            </Paragraph>
          </div>

          {/* Middle: Navigation links */}
          <nav 
            aria-label="Footer navigation"
            className="flex flex-col items-center gap-4 font-p-text"
          >
            <a href="#find-us" className="hover:text-gray-300 transition-colors">
              Find Us
            </a>
        
            <a href="#about-us" className="hover:text-gray-300 transition-colors">
              About Us
            </a>

            <a href="#careers" className="hover:text-gray-300 transition-colors">
              Careers
            </a>
        
          </nav>

          <form 
              onSubmit={handleSubmit}
              className="grid gap-6"
          >
          {/* Right: Newsletter signup */}
          <div className="flex flex-col items-center md:items-end gap-2">
            <Paragraph className="text-white">
              Sign up to our newsletter
            </Paragraph>
        
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>

            <input
              id="newsletter-email"
              type="email"
              placeholder="Enter your email"
              className="font-p-text rounded-md p-2 text-white border border-white"
            />

            <button
              type="submit"
              aria-label="Submit email for newsletter signup"
              className="bg-white text-black rounded-md p-2 px-4 hover:bg-gray-200 transition-colors font-p-text"
            >
              Subscribe
            </button>

            {submitted && (
                <p 
                    role="status" 
                    className="font-p-text text-center text-green-700">
                        Thank you for your message! This is demonstration form, so no email has
                        actually been submitted.                
                </p>
            )}
            </div>
          </form>

        </div>
      </footer>
  );
}

export default Footer;