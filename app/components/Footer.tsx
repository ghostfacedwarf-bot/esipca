'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, Facebook, Award, CheckCircle, Zap, Lock } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-dark-900 text-white pt-12 pb-8">
      <div className="container-max">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company info */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/images/1024.png"
                alt="Esipca Metalica Logo"
                width={120}
                height={60}
                className="h-16 w-auto object-contain invert"
              />
            </Link>
            <p className="text-dark-300 text-sm mb-4">
              30 de ani de experiență în furnizarea de produse metalice de calitate pentru construcții și industrie.
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-dark-800 rounded-lg hover:bg-primary-600 transition-colors"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-bold mb-4">Meniu Rapid</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-dark-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/produse" className="text-dark-300 hover:text-white transition-colors">
                  Produse
                </Link>
              </li>
              <li>
                <Link href="/despre-noi" className="text-dark-300 hover:text-white transition-colors">
                  Despre Noi
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-dark-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="font-bold mb-4">Politici</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-dark-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-dark-300 hover:text-white transition-colors">
                  Termeni și Condiții
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-dark-300 hover:text-white transition-colors">
                  Livrare și Returnări
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="text-dark-300 hover:text-white transition-colors">
                  Garanție
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="font-bold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <Phone size={18} className="text-accent-400 flex-shrink-0 mt-0.5" />
                <a href="tel:+40722292519" className="text-dark-300 hover:text-white transition-colors">
                  +40 (722) 292 519
                </a>
              </li>
              <li className="flex gap-2">
                <Mail size={18} className="text-accent-400 flex-shrink-0 mt-0.5" />
                <a href="mailto:office@exprestrading.com" className="text-dark-300 hover:text-white transition-colors">
                  office@exprestrading.com
                </a>
              </li>
              <li className="flex gap-2">
                <MapPin size={18} className="text-accent-400 flex-shrink-0 mt-0.5" />
                <span className="text-dark-300">
                  Galati, DN26 Nr 19, România
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-dark-700 pt-8 mt-8">
          {/* Trust badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="text-center">
              <Award size={32} className="text-accent-400 mx-auto mb-2" />
              <div className="text-accent-400 font-bold mb-1">30+</div>
              <div className="text-xs text-dark-300">Ani Experiență</div>
            </div>
            <div className="text-center">
              <CheckCircle size={32} className="text-accent-400 mx-auto mb-2" />
              <div className="text-accent-400 font-bold mb-1">100%</div>
              <div className="text-xs text-dark-300">Calitate Garantată</div>
            </div>
            <div className="text-center">
              <Zap size={32} className="text-accent-400 mx-auto mb-2" />
              <div className="text-accent-400 font-bold mb-1">Rapid</div>
              <div className="text-xs text-dark-300">Livrare în 1-7 zile</div>
            </div>
            <div className="text-center">
              <Lock size={32} className="text-accent-400 mx-auto mb-2" />
              <div className="text-accent-400 font-bold mb-1">Sigur</div>
              <div className="text-xs text-dark-300">Plată Securizată</div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-dark-700 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-dark-400">
            <p>&copy; {currentYear} SC ROMEXPRES TRADING SRL. Toate drepturile rezervate.</p>
            <p className="mt-4 md:mt-0">
              Developed & Designed by <a href="https://lbidesign.studio" target="_blank" rel="noopener noreferrer" className="text-accent-400 hover:text-accent-300 transition-colors">LBIDesign.Studio</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
