import { useState } from "react";
import Paragraph from "./Paragraph";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
    event.currentTarget.reset();
  }

  return (
    <section 
        id="contact"
        className="px-6 py-16 md:px-16"
        aria-labelledby="contact-heading"
    >
      <h2 className="font-service-card text-2xl font-bold text-center">
        Contact Us
      </h2>

        <p className="font-p-text mt-10 mb-10 text-center">
          Have a question about our memberships, facilities or
          services? Get in touch using the form below.        
        </p>

        <form 
            onSubmit={handleSubmit}
            className="grid gap-6"
        >
            <div className="font-p-text grid gap-2">
                <label htmlFor="contact-name">
                    Full Name
                </label>
                <input 
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    maxLength={100}
                    placeholder="Enter your full name"
                    className="font-p-text w-full rounded-md border p-3"
                />
            </div>

            <div className="font-p-text grid gap-2">
                <label htmlFor="contact-email">
                    Email Address
                </label>
                <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    maxLength={100}
                    placeholder="Enter your email address"
                    className="font-p-text w-full rounded-md border p-3"
                />
            </div>

            <div className="font-p-text grid gap-2">
                <label htmlFor="contact-subject">
                    Subject
                </label>
                <select
                    id="contact-subject"
                    name="subject"
                    required
                    defaultValue=""
                    className="font-p-text w-full rounded-md border p-3"
                >
                    <option value="" disabled>
                        Select a subject
                    </option>
                    <option value="membership">Membership Enquiry</option>
                    <option value="facilities">Facilities Enquiry</option>
                    <option value="classes">Classes and Services</option>
                    <option value="other">Other Enquiry</option>
                </select>
            </div>

            <div className="font-p-text grid gap-2">
                <label htmlFor="contact-message">
                    Your message
                </label>
                <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    required
                    placeholder="Write your message here..."
                    className="font-p-text w-full rounded-md border p-3"
                />
            </div>  

            <button
                type="submit"
                className="font-p-text rounded-md bg-header-footer px-6 py-3 font-semibold text-white transition-opacity hover:opacity-85"
            >
                Send Message
            </button>

            {submitted && (
                <p 
                    role="status" 
                    className="font-p-text text-center text-green-700">
                        Thank you for your message! This is demonstration form, so no message has
                        actually been sent.                
                </p>
            )}
        </form>
    </section>
  );
}