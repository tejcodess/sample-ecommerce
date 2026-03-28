import Link from 'next/link';
import {
  Facebook,
  Instagram,
  Twitter,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Truck,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      {/* Features Bar */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <Truck className="w-8 h-8 text-gray-400" />
              <div>
                <p className="font-semibold text-white text-sm">Free Delivery</p>
                <p className="text-xs">On orders above ₹999</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="w-8 h-8 text-gray-400" />
              <div>
                <p className="font-semibold text-white text-sm">Easy Returns</p>
                <p className="text-xs">7 days return policy</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-gray-400" />
              <div>
                <p className="font-semibold text-white text-sm">Secure Payment</p>
                <p className="text-xs">100% secure checkout</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard className="w-8 h-8 text-gray-400" />
              <div>
                <p className="font-semibold text-white text-sm">Multiple Payment</p>
                <p className="text-xs">UPI, Card, COD</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Store Info */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">F6 The Fashion Store</h3>
            <p className="text-sm mb-4">ఎఫ్6 ది ఫ్యాషన్ స్టోర్</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <p>Jawaharlal Nehru Rd, opposite KLM Mall, Srinivas Nagar, Gandhipuram, Rajamahendravaram, Andhra Pradesh 533103</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <p>0883 295 6642</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <p>support@f6fashion.com</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?category=tshirts" className="hover:text-white transition-colors">
                  T-Shirts
                </Link>
              </li>
              <li>
                <Link href="/products?category=shirts" className="hover:text-white transition-colors">
                  Shirts
                </Link>
              </li>
              <li>
                <Link href="/products?category=jeans" className="hover:text-white transition-colors">
                  Jeans
                </Link>
              </li>
              <li>
                <Link href="/products?category=shoes" className="hover:text-white transition-colors">
                  Shoes
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies & Social */}
          <div>
            <h4 className="text-white font-semibold mb-4">Policies</h4>
            <ul className="space-y-2 text-sm mb-6">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>

            <h4 className="text-white font-semibold mb-3">Follow Us</h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>© 2024 F6 The Fashion Store. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png" alt="Visa" className="h-6 opacity-70" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6 opacity-70" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/200px-UPI-Logo-vector.svg.png" alt="UPI" className="h-6 opacity-70" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
