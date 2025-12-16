import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900">Vera</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Your trusted partner in remote healthcare consultation.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900">Quick Links</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>
                <Link href="/about" className="hover:text-blue-600 transition-colors duration-200">About Us</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-blue-600 transition-colors duration-200">Services</Link>
              </li>
              <li>
                <Link href="/doctors" className="hover:text-blue-600 transition-colors duration-200">Our Doctors</Link>
              </li>
            </ul>
          </div>

          {/* Patient Resources */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900">For Patients</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>
                <Link href="/dashboard" className="hover:text-blue-600 transition-colors duration-200">Patient Portal</Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-blue-600 transition-colors duration-200">FAQ</Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-blue-600 transition-colors duration-200">Help Center</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900">Contact</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="hover:text-blue-600 transition-colors duration-200">support@Vera.com</li>
              <li className="hover:text-blue-600 transition-colors duration-200">+1 (555) 123-4567</li>
              <li>Available 24/7</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Vera. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

