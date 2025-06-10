// src/components/layouts/Footer.jsx
import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 text-gray-400 text-sm px-4 md:px-10 py-6 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {/* Brand */}
        <div>
          <h3 className="text-lg font-semibold text-orange-400">Foodie Hub</h3>
          <p className="mt-1 text-xs text-gray-500">&copy; {currentYear} Foodie Hub</p>
        </div>

        {/* Social */}
        <div>
          <h4 className="font-medium text-sm">Follow Us</h4>
          <ul className="mt-2 space-y-1">
            <li><a href="#" className="hover:text-white">Facebook</a></li>
            <li><a href="#" className="hover:text-white">Twitter</a></li>
            <li><a href="#" className="hover:text-white">Instagram</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-medium text-sm">Contact</h4>
          <ul className="mt-2 space-y-1 text-xs">
            <li>Email: support@foodiehub.com</li>
            <li>Phone: +1 (800) 123‑4567</li>
            <li>123 Foodie Lane, Flavor Town</li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="font-medium text-sm">Legal</h4>
          <ul className="mt-2 space-y-1 text-xs">
            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white">Terms of Service</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
