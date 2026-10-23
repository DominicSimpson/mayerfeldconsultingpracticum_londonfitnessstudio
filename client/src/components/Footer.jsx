import Paragraph from "./Paragraph";

function Footer() {
  return (
    <footer className="flex gap-y-4 p-16 bg-header-footer">
      <div className="grid ml-auto gap-2 justify-items-end">
        <Paragraph className="text-white">Sign up to our newsletter</Paragraph>
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>

        <input
          type="email"
          placeholder="Enter your email"
          aria-label="Email address for newsletter signup"
          className="font-p-text rounded-md p-2 text-white border border-white"
        />

        <button
          type="submit"
          aria-label="Submit email for newsletter signup"
          className="bg-white text-black rounded-md p-2 px-4 hover:bg-gray-200 transition-colors font-p-text"
        >
          Subscribe
        </button>
      </div>
    </footer>
  );
}

export default Footer;
