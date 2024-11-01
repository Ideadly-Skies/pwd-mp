'use client';
import Link from 'next/link';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* Use Eventbrite */}
        <div>
          <h3 className="font-semibold mb-4">Use Eventbrite</h3>
          <ul className="space-y-2">
            {['Create Events', 'Pricing', 'Event Marketing Platform', 
              'Eventbrite Mobile Ticket App', 'Eventbrite Check-In App',
              'Eventbrite App Marketplace', 'Event Registration Software',
              'Community Guidelines', 'FAQs', 'Sitemap'].map((item, index) => (
              <li key={index}>
                <Link href="/" className="hover:underline">{item}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Plan Events */}
        <div>
          <h3 className="font-semibold mb-4">Plan Events</h3>
          <ul className="space-y-2">
            {['Sell Tickets Online', 'Event Planning', 'Sell Concert Tickets Online', 
              'Event Payment System', 'Solutions for Professional Services', 
              'Event Management Software', 'Halloween Party Planning', 
              'Virtual Events Platform', 'QR Codes for Event Check-In', 
              'Post your event online'].map((item, index) => (
              <li key={index}>
                <Link href="/" className="hover:underline">{item}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Find Events */}
        <div>
          <h3 className="font-semibold mb-4">Find Events</h3>
          <ul className="space-y-2">
            {['New Orleans Food & Drink Events', 'San Francisco Holiday Events',
              'Tulum Music Events', 'Denver Hobby Events', 'Atlanta Pop Music Events',
              'New York Events', 'Chicago Events', 'Events in Dallas Today', 
              'Los Angeles Events', 'Washington Events'].map((item, index) => (
              <li key={index}>
                <Link href="/" className="hover:underline">{item}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Connect With Us */}
        <div>
          <h3 className="font-semibold mb-4">Connect With Us</h3>
          <ul className="space-y-2">
            {['Contact Support', 'Contact Sales', 'X', 
              'Facebook', 'LinkedIn', 'Instagram', 'TikTok'].map((item, index) => (
              <li key={index}>
                <Link href="/" className="hover:underline">{item}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="border-t border-gray-700 mt-10 pt-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between text-sm">
          <p>© 2024 Eventbrite</p>
          <div className="space-x-2">
            {['About', 'Blog', 'Help', 'Careers', 'Press', 'Impact', 'Investors', 
              'Security', 'Developers', 'Status', 'Terms', 'Privacy', 'Accessibility', 
              'Cookies'].map((link, index) => (
              <Link key={index} href="/" className="hover:underline">
                {link}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-2 text-sm text-center">
          <Link href="/" className="hover:underline">Manage Cookie Preferences</Link> • 
          <Link href="/" className="hover:underline ml-2">Do Not Sell or Share My Personal Information</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
