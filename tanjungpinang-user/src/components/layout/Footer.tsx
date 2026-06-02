import { Link } from "wouter";
import { SiInstagram, SiFacebook, SiX, SiYoutube } from "react-icons/si";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 print:hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand & Desc */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <img
                src="/logo.png"
                alt="TanjungPinang Guide"
                className="w-9 h-9 rounded-lg object-cover group-hover:scale-105 transition-transform"
              />

              <span className="font-bold text-xl tracking-tight text-white">
                TanjungPinang Guide
              </span>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed">
              Panduan wisata terlengkap untuk menjelajahi keindahan, sejarah,
              dan budaya di Tanjung Pinang, Kepulauan Riau.
            </p>

            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <SiInstagram size={18} />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <SiFacebook size={18} />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-colors"
                aria-label="X"
              >
                <SiX size={18} />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <SiYoutube size={18} />
              </a>
            </div>
          </div>

          {/* Nav Links */}
          <div className="flex flex-col gap-6">
            <h3 className="text-white font-semibold text-lg">Eksplorasi</h3>

            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  href="/"
                  className="hover:text-primary transition-colors"
                >
                  Beranda
                </Link>
              </li>

              <li>
                <Link
                  href="/destination"
                  className="hover:text-primary transition-colors"
                >
                  Destinasi
                </Link>
              </li>

              <li>
                <Link
                  href="/destination?kategori=Wisata%20Alam"
                  className="hover:text-primary transition-colors"
                >
                  Wisata Alam
                </Link>
              </li>

              <li>
                <Link
                  href="/destination?kategori=Wisata%20Sejarah"
                  className="hover:text-primary transition-colors"
                >
                  Wisata Sejarah
                </Link>
              </li>
            </ul>
          </div>

          {/* Kategori */}
          <div className="flex flex-col gap-6">
            <h3 className="text-white font-semibold text-lg">
              Kategori Wisata
            </h3>

            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  href="/destination?kategori=Wisata%20Alam"
                  className="hover:text-primary transition-colors"
                >
                  Wisata Alam
                </Link>
              </li>

              <li>
                <Link
                  href="/destination?kategori=Wisata%20Pantai"
                  className="hover:text-primary transition-colors"
                >
                  Wisata Pantai
                </Link>
              </li>

              <li>
                <Link
                  href="/destination?kategori=Wisata%20Budaya"
                  className="hover:text-primary transition-colors"
                >
                  Wisata Budaya
                </Link>
              </li>

              <li>
                <Link
                  href="/destination?kategori=Wisata%20Kuliner"
                  className="hover:text-primary transition-colors"
                >
                  Wisata Kuliner
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontak */}
          <div className="flex flex-col gap-6">
            <h3 className="text-white font-semibold text-lg">Hubungi Kami</h3>

            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">
                  Jl. Teuku Umar No. 12, Tanjung Pinang, Kepulauan Riau
                </span>
              </li>

              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm">+62 811 2233 4455</span>
              </li>

              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm">
                  halo@tanjungpinangguide.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} TanjungPinang Guide. Hak Cipta
            Dilindungi.
          </p>

          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-white transition-colors">
              Syarat & Ketentuan
            </Link>

            <Link href="#" className="hover:text-white transition-colors">
              Kebijakan Privasi
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}