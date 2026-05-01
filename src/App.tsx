/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { 
  ChevronRight, 
  ChevronLeft, 
  Menu, 
  X, 
  ShieldCheck, 
  Leaf, 
  Palette, 
  ArrowRight, 
  MapPin, 
  Phone, 
  Clock, 
  Send,
  CheckCircle,
  Droplets,
  Recycle,
  Sparkles,
  Download,
  Printer
} from 'lucide-react';

// --- Types ---

type Page = 'home' | 'services' | 'about' | 'booking' | 'confirmation';

interface ServiceItem {
  name: string;
  price: string;
  duration: string;
  image: string;
  description?: string;
}

interface Service {
  name: string;
  price: string;
  duration: string;
  description: string;
  category: string;
  image: string;
}

// --- Constants ---

const SERVICES: Service[] = [
  {
    name: 'Manicure + Clear Gel',
    price: 'KES 2,500',
    duration: '60 mins',
    description: 'Essential care for natural nails, finished with a high-gloss, durable clear gel.',
    category: 'Nail Care',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAICTMuvwfW9EfEHxfsuRwoHUW7ecATTL3zCd9YFX-kClQ7k4OiuBR7JFX1yLMjav19K0-ZPVaGXUlksYW2riFMvWzv-bejtUhbcILJ6Oms-I-GZUUM8sBpJm3Gkx9L9LQsPI8iJNFelwjzEAW6hbkGgDJxutr4z_2HkxsqNQP2GMmnR6YUF2DZmjLgm6CcZEV75Fsv7ns7pBE7hDJug_NZaMGBP5FLPLIEWJYnS-j829GT9qEZMdNVxD8nn_OMjZENBs7aE6u9GefZ'
  },
  {
    name: 'Gel Extensions & Artistry',
    price: 'From KES 4,500',
    duration: '120 mins',
    description: 'Sculpted length and bespoke editorial art, tailored to your aesthetic.',
    category: 'Gel Services',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAE3kOCRZgLepLIf3Iw4rbvT71NIUVOzeC-7PLDI4myO3NgQOZXKCR4tyju7c9fEQn99DgzZUTIvJY5Qu2vuWOMprm0-WcOnQT1tN7tuLVY03Z1X9V0R2ztPjnw0ZbNQ5ZYKIadzhcns5ZDG74otIrY1jrz9Cr_5COZZp5h3JwzOl6oOin8WfJNm-qi5WcbuObE7JrIF9IcwwdiyairNY0Z_P2dapKpCNW-b01ixDek0d7XISRzzJL3MiiAKwYmtnZ5Ol1-HK9exiuX'
  },
  {
    name: 'Botanical Spa Pedicure',
    price: 'KES 3,500',
    duration: '90 mins',
    description: 'A rejuvenating ritual for the feet, featuring organic scrubs and meticulous polish.',
    category: 'Spa Care',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtR8bspiS0Ph3kbVLF2UrT-jR5mOY11Mayf1S_NcUFVf-FYqo70h03_nDdjni1l46k0Bco-sGw3eNQzuL_23yH34Pc4Ge5Qg_QmzsUnOazLk6zFrAOZ3BuXRdyZ61awOkN6xHFqgexcn_Kjh1CS_4xP0Fw95uoMbW_BUwqHFvAiyNlLiIeXSdMfJdLqwDWP8ZGehRunAQHKoTvbcRx02Zs52OIPEiR54m5pnXVDwaAa-erzg4DmPZivxGEy9LmriZU_A41tmkSzmYy'
  }
];

const FULL_SERVICES_LIST = {
  'Nail Care': [
    { 
      name: 'Basic Manicure', 
      price: '1000 KES', 
      duration: '45 mins',
      image: 'https://images.unsplash.com/photo-1632345031136-052741b48d39?auto=format&fit=crop&q=80&w=400&h=400',
      description: 'Precision shaping, cuticle care, and a restorative buff or natural polish finish.'
    },
    { 
      name: 'Spa Pedicure', 
      price: '2000 KES', 
      duration: '60 mins',
      image: 'https://images.unsplash.com/photo-1519415510236-85592ac59c97?auto=format&fit=crop&q=80&w=400&h=400',
      description: 'A deep-cleansing ritual including a sea salt soak, exfoliation, and a revitalizing massage.'
    },
    { 
      name: 'Paraffin Treatment', 
      price: '800 KES', 
      duration: '20 mins',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400',
      description: 'Intense hydration therapy that locks in moisture and softens the skin with therapeutic wax.'
    },
  ],
  'Gel Services': [
    { 
      name: 'Plain Gel', 
      price: '500 KES', 
      duration: '30 mins',
      image: 'https://images.unsplash.com/photo-1628143996238-d62153240212?auto=format&fit=crop&q=80&w=400&h=400',
      description: 'High-shine, chip-resistant color application for a flawless, long-lasting look.'
    },
    { 
      name: 'Tips + Gel', 
      price: '1500 KES', 
      duration: '60 mins',
      image: 'https://images.unsplash.com/photo-1632345031136-052741b48d39?auto=format&fit=crop&q=80&w=400&h=400',
      description: 'Added length and durability using professional tips finished with premium gel polish.'
    },
    { 
      name: 'Builder Gel Overlay', 
      price: '2000 KES', 
      duration: '75 mins',
      image: 'https://images.unsplash.com/photo-1604249394944-e82555e4e7c1?auto=format&fit=crop&q=80&w=400&h=400',
      description: 'Strengthening overlay that provides structural support and protection for natural nails.'
    },
    { 
      name: 'Gel Removal', 
      price: '300 KES', 
      duration: '15 mins',
      image: 'https://images.unsplash.com/photo-1610992015822-6e27ab94be9c?auto=format&fit=crop&q=80&w=400&h=400',
      description: 'Gentle, soak-off removal process that preserves the integrity of your natural nail plate.'
    },
  ],
  'Acrylics & Art': [
    { 
      name: 'Full Acrylics', 
      price: '3000 KES', 
      duration: '90 mins',
      image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=400&h=400',
      description: 'Expertly sculpted extensions for maximum strength and dramatic length.'
    },
    { 
      name: 'Acrylic Refill', 
      price: '2000 KES', 
      duration: '75 mins',
      image: 'https://images.unsplash.com/photo-1632345031136-052741b48d39?auto=format&fit=crop&q=80&w=400&h=400',
      description: 'Regular maintenance to fill new growth and maintain the structural balance of your acrylics.'
    },
    { 
      name: 'Custom Nail Art (Per Nail)', 
      price: '150 KES', 
      duration: '10 mins+',
      image: 'https://images.unsplash.com/photo-1540201655000-0e1948f98ae7?auto=format&fit=crop&q=80&w=400&h=400',
      description: 'Bespoke hand-painted designs, foils, or 3D elements tailored to your unique style.'
    },
    { 
      name: 'Acrylic Removal', 
      price: '500 KES', 
      duration: '30 mins',
      image: 'https://images.unsplash.com/photo-1510526019623-1dbe18873491?auto=format&fit=crop&q=80&w=400&h=400',
      description: 'Professional safe removal of acrylic enhancements to avoid natural nail damage.'
    },
  ],
  'Lashes & Brows': [
    { 
      name: 'Classic Lash Extensions', 
      price: '2500 KES', 
      duration: '90 mins',
      image: 'https://images.unsplash.com/photo-1582967702281-662b708b273b?auto=format&fit=crop&q=80&w=400&h=400',
      description: 'A non-natural, yet subtle enhancement where one extension is applied to one natural lash.'
    },
    { 
      name: 'Volume Lash Extensions', 
      price: '3500 KES', 
      duration: '120 mins',
      image: 'https://images.unsplash.com/photo-1595476108010-b4d1f8bc2b3f?auto=format&fit=crop&q=80&w=400&h=400',
      description: 'Handcrafted fans applied to each lash for a dramatic, multidimensional, and lush appearance.'
    },
    { 
      name: 'Brow Tinting & Shaping', 
      price: '1000 KES', 
      duration: '30 mins',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=400&h=400',
      description: 'Precision mapping and custom tinting to create the perfect frame for your features.'
    },
    { 
      name: 'Lash Removal', 
      price: '500 KES', 
      duration: '20 mins',
      image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=400&h=400',
      description: 'Safe and painless removal of lash extensions using professional-grade adhesive solvent.'
    },
  ],
};

// --- Components ---

const Receipt = ({ onClose, selectedServices, userName, date, time }: { 
  onClose: () => void, 
  selectedServices: ServiceItem[],
  userName: string,
  date: string,
  time: string
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const [isDownloading, setIsDownloading] = useState(false);

  const calculateTotal = () => {
    return selectedServices.reduce((acc, curr) => {
      const price = parseInt(curr.price.replace(/[^0-9]/g, '')) || 0;
      return acc + price;
    }, 0);
  };

  const handleDownload = async () => {
    if (receiptRef.current === null) return;
    setIsDownloading(true);
    
    try {
      // Delay to ensure fonts and images are fully rendered
      await new Promise(resolve => setTimeout(resolve, 800));

      const dataUrl = await toPng(receiptRef.current, { 
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        cacheBust: false,
        filter: (node) => {
          // Additional safety: filter out any img tags during snapshot
          if (node.tagName === 'IMG') return false;
          return true;
        }
      });
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(dataUrl);
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const margin = 10;
      const availableWidth = pdfWidth - (margin * 2);
      const availableHeight = pdfHeight - (margin * 2);

      let finalWidth = availableWidth;
      let finalHeight = (imgProps.height * finalWidth) / imgProps.width;

      if (finalHeight > availableHeight) {
        finalHeight = availableHeight;
        finalWidth = (imgProps.width * finalHeight) / imgProps.height;
      }

      const xOffset = (pdfWidth - finalWidth) / 2;
      const yOffset = margin;
      
      pdf.addImage(dataUrl, 'PNG', xOffset, yOffset, finalWidth, finalHeight);
      pdf.save(`nyangie-receipt-${Date.now()}.pdf`);
    } catch (err) {
      console.error('PDF Generation Error:', err);
      // Give a more helpful message for these specific technical failures (CORS/Iframe)
      alert('We were unable to generate the PDF directly due to browser security restrictions on the images. \n\nPlease use the "Print" button instead, then select "Save as PDF" in your print settings!');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    const printContent = receiptRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }

    const html = `
      <html>
        <head>
          <title>Nyangie Receipt</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
            body { font-family: 'Inter', sans-serif; -webkit-print-color-adjust: exact; background: #fff; }
            .font-serif { font-family: 'Playfair Display', serif; }
            @page { margin: 10mm; size: auto; }
            .print-container { width: 100%; max-width: 500px; margin: 0 auto; padding: 40px; }
          </style>
        </head>
        <body>
          <div class="print-container">
            ${printContent.innerHTML}
          </div>
          <script>
            window.onload = () => {
              setTimeout(() => {
                window.print();
                window.close();
              }, 800);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto receipt-container"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl relative my-auto overflow-hidden receipt-paper"
      >
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-2 rounded-full hover:bg-surface-container transition-colors z-10 print:hidden"
        >
          <X size={24} />
        </button>

        <div className="p-12 bg-white relative overflow-hidden" ref={receiptRef}>
          {/* Subtle Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none select-none">
            <img 
              src="https://artifact.production.internal.fuzzing.com/6c0e5a87-ed31-4abd-813d-9d41fa6e297a/logo.png" 
              alt="" 
              className="w-11/12 h-11/12 object-contain"
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="relative z-10 text-center space-y-6 mb-16 flex flex-col items-center">
            <div className="w-24 h-24 rounded-2xl bg-white p-1 overflow-hidden shadow-xl ring-1 ring-primary/10">
              <img 
                src="https://artifact.production.internal.fuzzing.com/6c0e5a87-ed31-4abd-813d-9d41fa6e297a/logo.png" 
                alt="Nyangie Logo" 
                className="w-full h-full object-cover rounded-xl"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-2">
              <h2 className="text-5xl font-serif text-primary tracking-tight font-bold italic leading-tight">Nyangie</h2>
              <div className="flex items-center justify-center gap-2">
                <div className="h-px w-8 bg-tertiary/30"></div>
                <p className="text-[10px] text-outline uppercase tracking-[0.6em] font-black">Nail Studio</p>
                <div className="h-px w-8 bg-tertiary/30"></div>
              </div>
            </div>
            <p className="text-[9px] text-primary/40 uppercase tracking-[0.4em] font-bold italic">Bespoke Artisan Experience</p>
          </div>

          <div className="relative z-10 space-y-12">
            <div className="flex justify-between items-end border-b border-outline-variant/20 pb-8">
              <div className="space-y-3">
                <p className="text-[9px] text-outline uppercase tracking-[0.2em] font-bold">Client</p>
                <p className="font-serif text-primary text-2xl tracking-wide font-medium italic">{userName || 'Cherished Guest'}</p>
                <p className="text-[10px] text-on-surface-variant italic">Official Booking Summary</p>
              </div>
              <div className="space-y-2 text-right">
                <p className="text-[9px] text-outline uppercase tracking-[0.2em] font-bold">Transaction Ref.</p>
                <p className="font-mono text-xs text-primary font-bold">#NY-{Math.floor(Date.now() / 1000).toString().slice(-6)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-0 py-2 text-sm bg-primary/5 rounded-3xl border border-primary/10">
              <div className="space-y-1 text-center p-4 border-r border-primary/10">
                <p className="text-[8px] text-outline uppercase tracking-[0.25em] font-black">Date</p>
                <p className="font-serif text-lg text-primary tracking-wide font-semibold italic">{date}</p>
              </div>
              <div className="space-y-1 text-center p-4">
                <p className="text-[8px] text-outline uppercase tracking-[0.25em] font-black">Time</p>
                <p className="font-serif text-lg text-primary tracking-wide font-semibold italic">{time}</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex justify-between items-center text-[9px] uppercase tracking-[0.4em] font-black text-outline px-2">
                <span>Services</span>
                <span>Price</span>
              </div>
              
              <div className="space-y-6">
                {selectedServices.map((service, idx) => (
                  <div key={idx} className="flex justify-between items-start group relative">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 shadow-lg ring-1 ring-primary/10 bg-surface-container">
                        {isDownloading ? (
                          <div className="w-full h-full flex items-center justify-center bg-primary/10">
                            <Sparkles size={20} className="text-primary/40" />
                          </div>
                        ) : (
                          <img 
                            src={service.image} 
                            alt="" 
                            className="w-full h-full object-cover" 
                            crossOrigin="anonymous"
                            referrerPolicy="no-referrer" 
                          />
                        )}
                      </div>
                      <div className="flex flex-col space-y-1">
                        <span className="font-serif text-xl tracking-tight text-primary font-bold">{service.name}</span>
                        <span className="text-[9px] uppercase tracking-[0.25em] text-outline-variant font-black flex items-center gap-1.5">
                          <Clock size={10} className="text-primary/40" />
                          {service.duration} Ritual
                        </span>
                      </div>
                    </div>
                    <span className="font-serif text-xl text-primary font-black tabular-nums italic self-center">{service.price}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-10 border-t-2 border-primary/10">
              <div className="flex justify-between items-center bg-primary p-8 rounded-[2.5rem] shadow-xl shadow-primary/20">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-[0.4em] font-black text-on-primary">Total Investment</span>
                  <span className="text-[9px] text-white/60 italic mt-1 font-medium tracking-wider">Gratitude for your visit.</span>
                </div>
                <div className="text-right">
                  <span className="text-4xl font-serif font-black text-white italic tracking-tighter">
                    KES {calculateTotal().toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-16 pb-4 text-center space-y-8">
              <div className="flex justify-center flex-wrap gap-x-8 gap-y-4 text-[9px] text-outline uppercase tracking-[0.25em] font-black">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container rounded-full"><MapPin size={12} className="text-primary" /> Nairobi, Kenya</div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container rounded-full"><Phone size={12} className="text-primary" /> 0720 576 725</div>
              </div>
              <div className="space-y-3">
                <p className="font-serif italic text-3xl text-primary font-bold">L'Art de la Beauté</p>
                <div className="w-24 h-px bg-gradient-to-r from-transparent via-tertiary to-transparent mx-auto"></div>
                <p className="text-[8px] text-outline uppercase tracking-[0.8em] font-black opacity-50">Crafted by Nyangie</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 bg-surface-container/30 border-t border-outline-variant/20 flex gap-4 backdrop-blur-sm print:hidden">
          <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex-1 bg-primary text-on-primary py-5 rounded-2xl text-label-md font-bold flex items-center justify-center gap-3 hover:bg-surface-tint transition-all shadow-lg active:scale-95 disabled:opacity-50"
          >
            {isDownloading ? (
              <>
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
                Curating Receipt...
              </>
            ) : (
              <>
                <Download size={20} /> Save as PDF
              </>
            )}
          </button>
          <button 
            onClick={handlePrint}
            className="flex-1 bg-white text-primary border-2 border-primary/20 py-5 rounded-2xl text-label-md font-bold flex items-center justify-center gap-3 hover:bg-primary hover:text-white transition-all shadow-md active:scale-95"
          >
            <Printer size={20} /> Print
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Header = ({ page, setPage }: { page: Page, setPage: (p: Page) => void }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { label: string, id: Page }[] = [
    { label: 'Home', id: 'home' },
    { label: 'About Us', id: 'about' },
    { label: 'Services', id: 'services' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-md h-16 shadow-sm' : 'bg-transparent h-20'}`}>
      <div className="max-w-7xl mx-auto px-8 h-full flex justify-between items-center">
        <div 
          onClick={() => setPage('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-primary-container p-0.5 overflow-hidden shadow-lg shadow-primary/10 group-hover:scale-105 transition-transform">
            <img 
              src="https://artifact.production.internal.fuzzing.com/6c0e5a87-ed31-4abd-813d-9d41fa6e297a/logo.png" 
              alt="Nyangie Logo" 
              className="w-full h-full object-cover rounded-lg"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className={`flex flex-col ${(page === 'about' || page === 'services' || page === 'booking') ? 'hidden lg:flex' : 'flex'}`}>
            <span className="text-2xl font-serif text-primary leading-none tracking-widest font-bold uppercase">Nyangie</span>
            <span className="text-[9px] text-outline uppercase tracking-[0.4em] -mt-0.5 ml-0.5 opacity-70 font-medium">Nail Studio</span>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8 items-center">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`text-lg font-serif tracking-wide transition-all duration-300 relative py-1 ${page === item.id ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}
            >
              {item.label}
              {page === item.id && (
                <motion.div 
                  layoutId="activeNav"
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-primary/40"
                />
              )}
            </button>
          ))}
          <button 
            onClick={() => setPage('booking')}
            className="bg-primary-container text-on-primary-container px-6 py-2 rounded-full text-label-md hover:bg-primary hover:text-on-primary transition-all duration-300"
          >
            Book Now
          </button>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white border-b border-outline-variant p-8 flex flex-col gap-6 md:hidden"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setPage(item.id); setMenuOpen(false); }}
                className={`text-xl font-serif text-left ${page === item.id ? 'text-primary' : 'text-on-surface-variant'}`}
              >
                {item.label}
              </button>
            ))}
            <button 
              onClick={() => { setPage('booking'); setMenuOpen(false); }}
              className="bg-primary text-on-primary w-full py-4 rounded-full text-label-md"
            >
              Book Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = ({ setPage }: { setPage: (p: Page) => void }) => {
  return (
    <footer className="bg-surface-container py-16 px-8 border-t border-outline-variant/30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary-container p-0.5 overflow-hidden">
              <img 
                src="https://artifact.production.internal.fuzzing.com/6c0e5a87-ed31-4abd-813d-9d41fa6e297a/logo.png" 
                alt="Nyangie Logo" 
                className="w-full h-full object-cover rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-2xl font-serif text-primary tracking-widest uppercase font-semibold">Nyangie Nail Studio</div>
          </div>
          <div className="text-on-surface-variant text-sm">
            Stanbank House, 7th Floor, Room 719. Nairobi.
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-8 text-label-md text-on-surface-variant">
          <button onClick={() => setPage('home')} className="hover:text-primary transition-colors">Home</button>
          <button onClick={() => setPage('about')} className="hover:text-primary transition-colors">About Us</button>
          <button onClick={() => setPage('services')} className="hover:text-primary transition-colors">Services</button>
          <a href="tel:0720576725" className="hover:text-primary transition-colors">0720 576 725</a>
        </div>

        <div className="text-on-surface-variant text-xs text-center md:text-right">
          © 2026 Nyangie Nail Studio.<br />
          Professional precision meets creative joy.
        </div>
      </div>
    </footer>
  );
};

// --- Pages ---

const HomePage = ({ setPage }: { setPage: (p: Page) => void }) => {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center p-8 overflow-hidden bg-surface">
        <div className="absolute inset-0 z-0">
          <img 
            alt="Ethereal Nail Art" 
            className="w-full h-full object-cover opacity-20"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSNBgb1Z9_D1BmK_lD8G0wL7yx5wXH32_I00dsBMQaLSRnwmdGfulF9Sz8V_xaIxfeb33iMQcuMtBwr1dfSD1xhE1SEpAdAMI1_8ct_QHolXhnoWyPB-r3XzIczWiF96FOjnvz44Yly2Lb14FTOaMZx82qWWpcPyRiO3z7ZXIZgKMSdNreN8F5ReViULumoBMVAFdM9jdz4xpr2eej0qcBKowm7adOgpFT7QC2xhfTC0DP55LnJ1SpWM8KPmib5bTqf7RtJkk_mKoH"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-surface/50 via-transparent to-surface"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-secondary-container/50 text-on-secondary-container text-label-sm backdrop-blur-md border border-secondary-container/30">
              Ethereal Lacquer Aesthetic
            </span>
            <h1 className="text-headline-xl text-primary md:text-[88px] leading-tight md:leading-[1] italic font-semibold tracking-tighter">
              Elevate<br/>
              <span className="not-italic">Your Polish.</span>
            </h1>
            <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">
              Experience precision artistry in a serene, boutique environment. We blend high-fashion aesthetics with medical-grade care.
            </p>
            <div className="pt-4">
              <button 
                onClick={() => setPage('booking')}
                className="bg-primary text-on-primary px-10 py-4 rounded-full text-label-md hover:bg-surface-tint hover:shadow-xl hover:shadow-primary/20 transition-all duration-300"
              >
                Book Your Session
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-xl px-8 bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-lg items-center">
          <div className="space-y-md">
            <h2 className="text-headline-lg text-primary">Our Philosophy</h2>
            <p className="text-body-md text-on-surface-variant">
              We believe that beauty should never compromise health. Our studio is dedicated to providing an immaculate environment where creativity flourishes safely.
            </p>
            <ul className="space-y-6 pt-4">
              {[
                { icon: ShieldCheck, text: "Medical-grade sterilization protocols" },
                { icon: Leaf, text: "Premium vegan & cruelty-free products" },
                { icon: Palette, text: "Bespoke artistry tailored to you" }
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-4 text-on-surface">
                  <div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center text-tertiary shadow-sm">
                    <item.icon size={20} />
                  </div>
                  <span className="text-body-md font-medium">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="relative h-[480px] rounded-3xl overflow-hidden shadow-2xl shadow-primary/10"
          >
            <img 
              alt="Artistic Detail" 
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDh5pcGP6nE5i2hTNiOzKk9weqxkLQkgj4FOD8baVO1qT1VW6Ee7HxRkg-ZGldoPckrcoTSQ6gFNrwqURf20alXRqGB6XDMsQxPf-5nBnfUKunGBwkzJJcqqnZDzRlNUYp5ce56dTsoG6Xa8h587rAi7a7yw4N7mgv-wflOX3IJFBert3oza10mHBOxMWasVvyw3ttaoPYmeIguDKzgUPoADdK9z40L98P91TLa7fIlm_6LcQfkx-ZzQgCv4rXBqa3JYMnTFqv-V9U0"
            />
          </motion.div>
        </div>
      </section>

      {/* Services Breakdown */}
      <section className="py-xl px-8 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-headline-lg text-primary">Curated Services</h2>
            <p className="text-body-md text-on-surface-variant max-w-xl mx-auto">Discover our signature treatments designed to enhance your natural grace.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-gutter">
            {SERVICES.map((s, idx) => (
              <div 
                key={idx} 
                className={`glass-panel p-6 rounded-3xl group cursor-pointer hover:border-primary/30 transition-all duration-500 ${idx === 1 ? 'md:col-span-2' : ''}`}
                onClick={() => setPage('services')}
              >
                <div className={`overflow-hidden rounded-2xl mb-6 relative ${idx === 1 ? 'h-64' : 'h-48'}`}>
                  <img src={s.image} alt={s.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-headline-md text-on-surface">{s.name}</h3>
                  <div className="text-right">
                    <span className="text-label-md text-primary font-bold block">{s.price}</span>
                    <span className="text-[10px] text-outline uppercase tracking-widest">{s.duration}</span>
                  </div>
                </div>
                <p className="text-body-md text-on-surface-variant mb-6 line-clamp-2">{s.description}</p>
                <button className="flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
                  Details <ArrowRight size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const ServicesPage = ({ setPage, onSelectService, selectedServices }: { 
  setPage: (p: Page) => void, 
  onSelectService: (s: ServiceItem) => void,
  selectedServices: ServiceItem[]
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const categories = ['All', ...Object.keys(FULL_SERVICES_LIST)];

  const filteredServices = activeCategory === 'All' 
    ? Object.entries(FULL_SERVICES_LIST)
    : Object.entries(FULL_SERVICES_LIST).filter(([category]) => category === activeCategory);

  return (
    <div className="pt-24 pb-xl px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-headline-xl text-primary md:text-[64px] italic">Studio <span className="not-italic">Menu</span></h1>
        <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Experience precision, artistry, and premium care. Choose from our curated selection of services designed to elevate your natural beauty.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-16">
        {categories.map((cat) => (
          <motion.button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-2.5 rounded-full text-label-md transition-all border ${
              activeCategory === cat 
                ? 'bg-primary text-on-primary border-primary shadow-lg shadow-primary/20' 
                : 'bg-surface-container-low text-on-surface-variant border-outline-variant hover:border-primary/40'
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      <motion.div 
        layout
        className="grid md:grid-cols-2 gap-12"
      >
        <AnimatePresence mode="popLayout">
          {filteredServices.map(([category, items], catIdx) => (
            <motion.div 
              key={category}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ 
                scale: 1.015, 
                y: -5,
                transition: { duration: 0.2, ease: "easeOut" }
              }}
              transition={{ duration: 0.3, delay: activeCategory === 'All' ? catIdx * 0.1 : 0 }}
              className="glass-panel p-8 rounded-3xl hover:shadow-2xl hover:shadow-primary/10 transition-shadow duration-300"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-headline-lg text-primary">{category}</h2>
                <span className="bg-secondary-container/30 text-secondary px-4 py-1 rounded-full text-label-sm border border-secondary-fixed/30 italic">
                  {category === 'Nail Care' || category === 'Gel Services' ? 'Essentials' : 'Detail'}
                </span>
              </div>
              
              <div className="space-y-6 mb-8">
                {items.map((item, idx) => {
                  const isSelected = selectedServices.some(s => s.name === item.name);
                  return (
                    <div 
                      key={idx} 
                      onClick={() => onSelectService(item)}
                      className="flex justify-between items-center border-b border-outline-variant/30 pb-4 group cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full transition-all shrink-0 ${isSelected ? 'bg-primary scale-125' : 'bg-outline-variant group-hover:bg-primary/40'}`}></div>
                        
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          
                          <div className="flex flex-col">
                            <span className={`text-body-lg transition-colors ${isSelected ? 'text-primary font-semibold' : 'text-on-surface group-hover:text-primary'}`}>
                              {item.name}
                            </span>
                            {item.description && (
                              <p className="text-[11px] text-on-surface-variant/80 mt-0.5 max-w-[280px] line-clamp-1">
                                {item.description}
                              </p>
                            )}
                            <div className="flex items-center gap-1.5 opacity-60 mt-1">
                              <Clock size={10} className="text-outline" />
                              <span className="text-[10px] uppercase tracking-widest">{item.duration}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <span className="text-label-md text-primary tracking-widest tabular-nums">{item.price}</span>
                    </div>
                  );
                })}
              </div>

              <button 
                onClick={() => setPage('booking')}
                className="w-full py-4 border border-outline text-primary rounded-full text-label-md hover:bg-primary-container/20 transition-all hover:border-primary/40 active:scale-95"
              >
                Confirm Selection & Book
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const AboutPage = ({ setPage }: { setPage: (p: Page) => void }) => {
  return (
    <div className="pt-24 pb-xl w-full">
      <section className="max-w-7xl mx-auto px-8 mb-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-md">
            <h1 className="text-headline-xl text-primary md:text-[64px] italic leading-tight">
              A Vision of <span className="not-italic">Elegance</span>
            </h1>
            <p className="text-body-lg text-on-surface-variant max-w-lg">
              Welcome to Nyangie Nail Studio, where the art of manicuring transcends the ordinary. We believe that nail care is a vital ritual of self-expression, blending meticulous technique with a touch of polished playfulness.
            </p>
          </div>
          <div className="relative h-[560px] rounded-3xl overflow-hidden shadow-2xl glass-panel p-2">
            <img 
              alt="Studio Interior" 
              className="w-full h-full object-cover rounded-2xl"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBmRxEr90BH7htpWITKRSPYbKyLFrsfN_BCLWwfjl0sCxQmGPEqQb9fKLJjVuTPCk3QgZJAuLutk3gyBfIAtdfr5KeiWrJeu8Jh64lWM8Tvvk3AhRxe2duTAxW7K0_FtmdlWCBJewt5sW7AS87y_agByQiVN6fmmF2FPsGBmLx7nq9iHXpho5wdmscFwljCtygOVedyvWCnHhWYiapnpgRONqp_SRZ1n27Hgb6Gb5mmN6hFHKK9hmUu4iEdLJNgWIpa2qpUUswSWaF" 
            />
          </div>
        </div>
      </section>

      <section className="bg-surface-container-low py-20 px-8 mb-xl rounded-[4rem] mx-4 lg:mx-12">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-headline-lg text-primary">Crafted for Polished Playfulness</h2>
          <p className="text-body-md text-on-surface-variant leading-relaxed">
            Our philosophy is rooted in the delicate balance between high-end editorial perfection and the joy of creative beauty. Every service at Nyangie is designed to be an immersive experience—from the soothing ambiance of our studio to the flawless execution of intricate nail art. We cater to those who appreciate the details and aren't afraid to let their personality shine through their fingertips.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-8 mb-xl">
        <h2 className="text-headline-lg text-primary text-center mb-16">Meet the Artisans</h2>
        <div className="grid md:grid-cols-3 gap-gutter">
          {[
            { name: "Nyangie", role: "Founder & Visionary", bio: "With over a decade of experience, Nyangie established the studio to redefine quality.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDAdYQrIalxWDB9yGgAqNAOYTzSC_XHtbZlFcZMm7VvHfCrN8G67cejYMANH5IwuVnZ_3zUFl7tQisWsrzJt5P74m8Vn4T3yPawqxxwI8evownBd-TWDa8n8PKDk5FYJ1tSV7pdJgA8b1tnZsuebbyqsiK065X0Nhoaqc0vOSEQ9EIneaHiJjrvmFkmmvOhJJznLWaFfd8iTf1j_GAOJ3_3Fqx0cWYz3qz-Zc6AWSiOaYBcNNGh5sDBQTpxeaF_Huon38mLk0zH0ipv" },
            { name: "Julian", role: "Lead Art Specialist", bio: "Julian transforms nail plates into bespoke wearable masterpieces with creative precision.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDVDIG85sQXLFVe9h7Zfq5qT7On66h93Jl5Z8JJcL8aGEhSmpJjjpjVfIhu6XjwfOEYHVPjMiqpXmzY__2ISheEar2pbXYO6ntQl8ujgL0QF7uP0iNlS0aFgW2bx7oyj06-p5IO1ZDV4xMigmdULm3JYyBNaxwlvbMvgYgRxv0e7TJLVp6MakoNfMdO0e408Ijjh7fngbzD1BPQvQgDUGH5VoslDuhItxeo8mmFLW8_hhMNP2oTqm34JIHNVa0qAxl87kHpHGblSHh8" },
            { name: "Elena", role: "Spa Care Expert", bio: "Elena specializes in restorative treatments that build beauty on a foundation of wellness.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvVjmoaFuaPqS9KH3ZjLcCZhO8o4ugTdPhuWFz2WPkjpgvgYgpRoJiogSH859jViw7nuyBrzCkEIA8VugiqcKw7wX149Bzy9CQkpdRBlG4WwHZXvS-VN51fUdMKCOzjJ0kHfo4E0yvETmvGR6BT5XNtbmKckaKcG9WJ998cDvO4p1TBs3i5ipnUcSG__asftcM5-UGzJwGh-uz8lNCYo8znRy0t0DTFVNYN04cdHBVRfXRAP7d3Ev2lKOC47MJeJ1iJR595cWKxjbt" }
          ].map((artist, idx) => (
            <div key={idx} className="glass-panel p-8 rounded-3xl flex flex-col items-center text-center space-y-4">
              <div className="w-40 h-40 rounded-full overflow-hidden mb-4 shadow-xl border-4 border-white">
                <img src={artist.img} alt={artist.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-headline-md text-on-surface">{artist.name}</h3>
              <p className="text-label-md text-primary">{artist.role}</p>
              <p className="text-body-md text-on-surface-variant text-sm line-clamp-3">{artist.bio}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-8">
        <div className="glass-panel p-12 rounded-[3rem] grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-headline-lg text-primary mb-6">Unwavering Standards</h2>
            <p className="text-body-md text-on-surface-variant mb-8">We prioritize your health without ever compromising on the luxury of the experience.</p>
            
            <div className="grid gap-8">
              {[
                { icon: Droplets, title: "Medical-Grade", desc: "Hospital-grade autoclave sterilization for all implements." },
                { icon: Sparkles, title: "13-Free Formula", desc: "Consciously selected products for healthier nails." },
                { icon: Recycle, title: "Single-Use", desc: "Strict hygiene with disposable files and buffers." }
              ].map((std, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-secondary shrink-0">
                    <std.icon size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface">{std.title}</h4>
                    <p className="text-sm text-on-surface-variant">{std.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="h-full min-h-[400px] rounded-2xl overflow-hidden bg-primary-container shadow-inner p-4">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCK-JR8kEpbIIkowgnYY7WQ7CTWrnheZ52b2G5voEd0IkIzYljcb7A2E7vioLLJhfFurmvSbswYYgYNPpctEK7pILXkPcVP5hkIz3BY3ns_sFKu9cHgp0G9doO-h9iSEz1g6SiotnBL9P4ddPxJoFt5ET4tV2kIrdJSilyr0qro4AV2cEEzqvwMQGnBGbnu4Vu96a2CmRYc_SYW9oaXSPyEp_u0-YjOMH2ST4Kd0Vnsv54UeLUK5iQEQsvWTA8BCP6w3X1kG_viY5ac" 
              className="w-full h-full object-cover rounded-xl"
              alt="Editorial Art"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const BookingPage = ({ 
  setPage, 
  selectedServices, 
  onSelectService, 
  userName, 
  setUserName,
  userPhone,
  setUserPhone,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime
}: { 
  setPage: (p: Page) => void,
  selectedServices: ServiceItem[],
  onSelectService: (s: ServiceItem) => void,
  userName: string,
  setUserName: (n: string) => void,
  userPhone: string,
  setUserPhone: (p: string) => void,
  selectedDate: Date,
  setSelectedDate: (d: Date) => void,
  selectedTime: string,
  setSelectedTime: (t: string) => void
}) => {
  const [viewDate, setViewDate] = useState(new Date(selectedDate));
  const [called, setCalled] = useState(false);

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();

  const isSunday = (date: Date) => date.getDay() === 0;
  const isSaturday = (date: Date) => date.getDay() === 6;

  const calculateTotal = () => {
    return selectedServices.reduce((acc, curr) => {
      const price = parseInt(curr.price.replace(/[^0-9]/g, '')) || 0;
      return acc + price;
    }, 0);
  };

  const calculateTotalDuration = () => {
    return selectedServices.reduce((acc, curr) => {
      const duration = parseInt(curr.duration.replace(/[^0-9]/g, '')) || 0;
      return acc + duration;
    }, 0);
  };

  const timeToMinutes = (timeStr: string) => {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  const getClosingTime = (date: Date) => {
    const day = date.getDay();
    if (day === 6) return 18 * 60; // 6 PM
    return 19 * 60; // 7 PM
  };

  const totalDuration = calculateTotalDuration();
  const startTimeMinutes = timeToMinutes(selectedTime);
  const closingTimeMinutes = getClosingTime(selectedDate);
  const isSundayDate = isSunday(selectedDate);
  const isTimeExceeded = !isSundayDate && (startTimeMinutes + totalDuration > closingTimeMinutes);

  const [sundayMessage, setSundayMessage] = useState('');
  const [isEnquiryFormVisible, setIsEnquiryFormVisible] = useState(false);

  const handleWhatsApp = async () => {
    const servicesText = selectedServices.map(s => `• ${s.name} (${s.price})`).join('%0A');
    const total = calculateTotal();
    const dateText = `${selectedDate.getDate()} ${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
    
    // Attempt to save appointment to backend for automated reminders
    try {
      await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: userName || 'Client',
          phone: userPhone,
          date: dateText,
          time: isSundayDate ? 'TBD' : selectedTime,
          services: selectedServices.map(s => s.name)
        })
      });
      // In a real app we'd handle response
    } catch (error) {
      console.error('Failed to schedule reminder', error);
      // Graceful degradation, continue to WhatsApp
    }

    let message = '';
    
    if (isSundayDate) {
      message = `Hello Nyangie Nail Studio!%0A%0AMy name is ${userName || 'Client'}.%0A%0AI am reaching out for a special Sunday appointment on ${dateText}.%0A%0ARequest Details: ${sundayMessage || 'No specific details provided.'}%0A%0ASelected Services:%0A${servicesText}%0A%0ATotal Inquiry: ${total.toLocaleString()} KES%0A%0APlease let me know if you can accommodate this request at your earliest convenience. I look forward to your feedback on whether this will be possible!%0A%0AThank you.`;
    } else {
      message = `Hello Nyangie Nail Studio!%0A%0AMy name is ${userName || 'Client'}. I'd like to book a session on ${dateText} at ${selectedTime}.%0A%0ASelected Services:%0A${servicesText}%0A%0ATotal Duration: ${totalDuration} mins%0A%0ATotal Price: ${total.toLocaleString()} KES%0A%0ASee you soon!`;
    }

    const phone = '254720576725';
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    setPage('confirmation');
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getEffectiveToday = () => {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1-5 = Mon-Fri, 6 = Saturday
    const hours = now.getHours();

    // Monday - Friday: Past 7 PM
    if (day >= 1 && day <= 5 && hours >= 19) {
      const nextDay = new Date(now);
      nextDay.setDate(now.getDate() + 1);
      nextDay.setHours(0, 0, 0, 0);
      return nextDay;
    }

    // Saturday: Past 6 PM
    if (day === 6 && hours >= 18) {
      const nextDay = new Date(now);
      nextDay.setDate(now.getDate() + 1);
      nextDay.setHours(0, 0, 0, 0);
      return nextDay;
    }

    const effectiveToday = new Date(now);
    effectiveToday.setHours(0, 0, 0, 0);
    return effectiveToday;
  };

  const effectiveToday = getEffectiveToday();

  const isPastMonth = (year: number, month: number) => {
    const currentMonthDate = new Date(effectiveToday.getFullYear(), effectiveToday.getMonth(), 1);
    const targetMonthDate = new Date(year, month, 1);
    return targetMonthDate < currentMonthDate;
  };

  const isPastDay = (day: number) => {
    const dateToCompare = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    return dateToCompare < effectiveToday;
  };

  const getTimeSlots = (date: Date) => {
    if (isSunday(date)) return [];
    if (isSaturday(date)) {
      return ['10:00 AM', '11:00 AM', '12:00 PM', '1:30 PM', '3:00 PM', '4:30 PM', '6:00 PM'];
    }
    return ['9:00 AM', '10:30 AM', '12:00 PM', '1:30 PM', '3:00 PM', '4:30 PM', '6:00 PM'];
  };

  const timeSlots = getTimeSlots(selectedDate);
  const sundayMode = isSundayDate;

  const handlePrevMonth = () => {
    const prevDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
    if (!isPastMonth(prevDate.getFullYear(), prevDate.getMonth())) {
      setViewDate(prevDate);
    }
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleCall = () => {
    window.location.href = 'tel:0720576725';
    setCalled(true);
  };

  if (called) {
    return (
      <div className="pt-32 pb-xl px-8 flex items-center justify-center min-h-[60vh]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-12 rounded-[3.5rem] text-center max-w-lg space-y-8 bg-white/80"
        >
          <div className="w-24 h-24 rounded-full bg-primary-container flex items-center justify-center text-primary mx-auto shadow-xl shadow-primary/10">
            <Phone size={40} className="scale-animation" />
          </div>
          <div className="space-y-4">
            <h2 className="text-headline-lg text-primary">Thank you for contacting us!</h2>
            <p className="text-body-md text-on-surface-variant">
              We appreciate you reaching out to Nyangie Nail Studio. We look forward to seeing you soon for your session.
            </p>
          </div>
          <button 
            onClick={() => setPage('home')}
            className="bg-primary text-on-primary px-8 py-3 rounded-full text-label-md hover:bg-surface-tint transition-all"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-xl px-8 max-w-7xl mx-auto w-full grid md:grid-cols-12 gap-12 lg:gap-24">
      {/* Form Side */}
      <div className="md:col-span-7 space-y-12">
        <div className="space-y-4">
          <h1 className="text-headline-xl text-primary md:text-[64px] italic leading-tight">
            Reserve Your <span className="not-italic">Moment.</span>
          </h1>
          <p className="text-body-lg text-on-surface-variant max-w-md">
            Select your preferred service and time. We balance professional precision with creative joy.
          </p>
        </div>

        <form className="glass-panel p-10 rounded-[2.5rem] space-y-10 border border-outline-variant/30 shadow-2xl shadow-primary/5">
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-label-md text-on-surface-variant">Name</label>
              <input 
                type="text" 
                placeholder="Your full name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-transparent border-0 border-b border-outline focus:border-tertiary focus:ring-0 text-on-surface py-2 px-0 transition-colors placeholder:text-outline-variant"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-label-md text-on-surface-variant">Phone (for automated reminder)</label>
              <input 
                type="tel" 
                placeholder="e.g. 0720 576 725"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                className="w-full bg-transparent border-0 border-b border-outline focus:border-tertiary focus:ring-0 text-on-surface py-2 px-0 transition-colors placeholder:text-outline-variant"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-label-md text-on-surface-variant flex items-center gap-2"><Sparkles size={16} /> Selected Services</label>
            <div className="flex flex-wrap gap-3">
              {Object.values(FULL_SERVICES_LIST).flat().map((s) => {
                const isSelected = selectedServices.some(selected => selected.name === s.name);
                return (
                  <button 
                    key={s.name} 
                    type="button"
                    onClick={() => onSelectService(s)}
                    className={`px-6 py-2.5 rounded-full text-label-sm transition-all shadow-sm ${isSelected ? 'bg-tertiary text-on-tertiary shadow-tertiary/20' : 'border border-tertiary text-tertiary hover:bg-tertiary/10'}`}
                  >
                    {s.name}
                  </button>
                );
              })}
            </div>
            {selectedServices.length > 0 && (
              <div className="pt-2">
                <p className="text-headline-md text-primary text-[20px]">Total: {calculateTotal().toLocaleString()} KES</p>
              </div>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-label-md text-on-surface-variant flex items-center gap-2"><Clock size={16} /> Date</label>
              <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-label-md text-primary">{monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}</span>
                  <div className="flex gap-1 text-outline">
                    <ChevronLeft 
                      size={20} 
                      className={`transition-colors ${isPastMonth(viewDate.getFullYear(), viewDate.getMonth() - 1) ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer hover:text-primary'}`} 
                      onClick={handlePrevMonth} 
                    />
                    <ChevronRight size={20} className="cursor-pointer hover:text-primary transition-colors" onClick={handleNextMonth} />
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-outline mb-2">
                  {['S','M','T','W','T','F','S'].map((d, i) => <div key={`${d}-${i}`}>{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1 text-center font-bold text-sm">
                  {[...Array(firstDayOfMonth)].map((_, i) => <div key={`empty-${i}`}></div>)}
                  {[...Array(daysInMonth(viewDate.getFullYear(), viewDate.getMonth()))].map((_, i) => {
                    const day = i + 1;
                    const disabled = isPastDay(day);
                    const isSelected = selectedDate.getDate() === day && 
                                     selectedDate.getMonth() === viewDate.getMonth() && 
                                     selectedDate.getFullYear() === viewDate.getFullYear();
                    return (
                      <div 
                        key={i} 
                        onClick={() => !disabled && setSelectedDate(new Date(viewDate.getFullYear(), viewDate.getMonth(), day))}
                        className={`py-2 rounded-full transition-all ${disabled ? 'opacity-20 cursor-not-allowed' : (isSelected ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'hover:bg-surface-container cursor-pointer')}`}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-label-md text-on-surface-variant flex items-center gap-2"><Clock size={16} /> Time</label>
              <div className="grid grid-cols-2 gap-4">
                {sundayMode ? (
                  <div className="col-span-2 space-y-4">
                    {!isEnquiryFormVisible ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-8 rounded-[2.5rem] bg-tertiary/5 border border-dashed border-tertiary/30 text-center space-y-6"
                      >
                        <div className="w-16 h-16 bg-tertiary/10 rounded-full flex items-center justify-center mx-auto text-tertiary">
                          <Clock size={32} />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-display-sm text-tertiary italic font-serif">Sunday Special</h3>
                          <p className="text-body-sm text-on-surface-variant max-w-[240px] mx-auto leading-relaxed">
                            Sundays are reserved for exclusive appointments. We would love to accommodate your request.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsEnquiryFormVisible(true)}
                          className="w-full bg-tertiary text-on-tertiary py-4 rounded-2xl text-label-md font-bold shadow-lg shadow-tertiary/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                        >
                          Enquiry Now
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 rounded-3xl bg-surface-container border border-outline-variant space-y-4"
                      >
                        <div className="flex justify-between items-center">
                          <label className="text-label-sm uppercase tracking-wider text-tertiary font-bold">Special Inquiry Form</label>
                          <button 
                            type="button"
                            onClick={() => setIsEnquiryFormVisible(false)}
                            className="text-xs text-on-surface-variant hover:text-primary transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase tracking-wider text-outline px-1 font-bold">Your Name</label>
                            <input 
                              type="text"
                              value={userName}
                              onChange={(e) => setUserName(e.target.value)}
                              placeholder="Who are we meeting?"
                              className="w-full bg-white border border-outline-variant rounded-xl p-3 text-sm focus:ring-1 focus:ring-tertiary focus:border-tertiary outline-none shadow-sm"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase tracking-wider text-outline px-1 font-bold">Phone (for automated reminder)</label>
                            <input 
                              type="tel"
                              value={userPhone}
                              onChange={(e) => setUserPhone(e.target.value)}
                              placeholder="e.g. 0720 576 725"
                              className="w-full bg-white border border-outline-variant rounded-xl p-3 text-sm focus:ring-1 focus:ring-tertiary focus:border-tertiary outline-none shadow-sm"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-wider text-outline px-1 font-bold">Selected Services for Inquiry</label>
                            <div className="bg-white/50 border border-outline-variant rounded-xl p-3 space-y-2">
                              {selectedServices.map((s, i) => (
                                <div key={i} className="flex justify-between items-center text-xs">
                                  <span className="text-on-surface font-medium">{s.name}</span>
                                  <span className="text-primary font-bold">{s.price}</span>
                                </div>
                              ))}
                              <div className="pt-2 border-t border-outline-variant/30 flex justify-between items-center">
                                <span className="text-[9px] uppercase tracking-tighter text-outline font-bold">Estimated Total</span>
                                <span className="text-sm font-bold text-primary italic">KES {calculateTotal().toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase tracking-wider text-outline px-1 font-bold">Additional Message / Special Requests</label>
                            <textarea
                              value={sundayMessage}
                              onChange={(e) => setSundayMessage(e.target.value)}
                              placeholder="Tell us more (e.g., Is this for an event? Do you have a preferred time between 10 AM - 4 PM?)"
                              className="w-full bg-white border border-outline-variant rounded-xl p-3 text-sm focus:ring-1 focus:ring-tertiary focus:border-tertiary outline-none min-h-[100px] shadow-sm"
                            ></textarea>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <>
                    {timeSlots.map((t) => (
                      <button 
                        key={t}
                        type="button"
                        onClick={() => setSelectedTime(t)}
                        className={`py-4 px-2 rounded-xl text-label-sm border transition-all ${selectedTime === t ? 'border-tertiary bg-tertiary/10 text-tertiary font-bold shadow-sm' : 'border-outline-variant hover:border-tertiary hover:bg-surface-container'}`}
                      >
                        {t}
                      </button>
                    ))}
                    
                    {isTimeExceeded && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="col-span-2 bg-error/5 border border-error/20 p-4 rounded-xl flex items-start gap-3 mt-2"
                      >
                        <div className="bg-error/10 p-1.5 rounded-lg text-error">
                          <Clock size={16} />
                        </div>
                        <p className="text-[11px] text-error font-medium leading-normal">
                           The total duration of your selected services ({totalDuration} mins) will extend beyond our closing hours if you start at {selectedTime}. We kindly ask you to book an earlier slot to ensure a relaxed and comfortable experience for you!
                        </p>
                      </motion.div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button 
              onClick={handleWhatsApp}
              type="button" 
              disabled={selectedServices.length === 0 || (!sundayMode && isTimeExceeded) || (sundayMode && !isEnquiryFormVisible)}
              className={`flex-1 bg-primary text-on-primary py-4 rounded-full text-label-md hover:bg-surface-tint shadow-xl shadow-primary/10 transition-all flex items-center justify-center gap-2 active:scale-95 ${(selectedServices.length === 0 || (!sundayMode && isTimeExceeded) || (sundayMode && !isEnquiryFormVisible)) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Send size={18} /> {sundayMode ? 'Send Special Inquiry' : 'Send via WhatsApp'}
            </button>

            <button 
              onClick={handleCall}
              type="button" 
              className="flex-1 border-2 border-outline text-primary py-4 rounded-full text-label-md hover:bg-surface-container transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Phone size={18} /> Call to Book
            </button>
          </div>
        </form>
      </div>

      {/* Info Side */}
      <div className="md:col-span-5 flex flex-col gap-12">
        <div className="h-96 rounded-[3rem] overflow-hidden shadow-2xl relative group">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCK-JR8kEpbIIkowgnYY7WQ7CTWrnheZ52b2G5voEd0IkIzYljcb7A2E7vioLLJhfFurmvSbswYYgYNPpctEK7pILXkPcVP5hkIz3BY3ns_sFKu9cHgp0G9doO-h9iSEz1g6SiotnBL9P4ddPxJoFt5ET4tV2kIrdJSilyr0qro4AV2cEEzqvwMQGnBGbnu4Vu96a2CmRYc_SYW9oaXSPyEp_u0-YjOMH2ST4Kd0Vnsv54UeLUK5iQEQsvWTA8BCP6w3X1kG_viY5ac" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            alt="Editorial Art"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
          <div className="absolute bottom-10 left-10 text-white font-serif italic text-2xl">Ethereal Lacquer Collection</div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-8 rounded-3xl flex gap-6 items-center">
            <div className="w-14 h-14 rounded-full bg-primary-container flex items-center justify-center text-primary shrink-0 shadow-sm">
              <MapPin size={24} />
            </div>
            <div>
              <h3 className="text-headline-md text-primary text-[20px]">Studio Location</h3>
              <p className="text-on-surface-variant">Stanbank House, 7th Floor</p>
              <p className="border-t border-outline-variant/30 mt-1 pt-1 opacity-60">Room 719</p>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl space-y-6">
            <h3 className="text-headline-md text-primary text-[20px] flex items-center gap-3">
              <Clock size={20} /> Studio Hours
            </h3>
            <div className="space-y-4 text-on-surface-variant">
              <div className="flex justify-between border-b border-outline-variant/30 pb-2">
                <span>Mon - Fri</span>
                <span className="font-bold text-on-surface">9:00 AM - 7:00 PM</span>
              </div>
              <div className="flex justify-between border-b border-outline-variant/30 pb-2">
                <span>Saturday</span>
                <span className="font-bold text-on-surface">10:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span className="italic text-tertiary">By Appointment Only</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ConfirmationPage = ({ setPage, selectedServices, userName, date, time, isSunday }: { 
  setPage: (p: Page) => void, 
  selectedServices: ServiceItem[],
  userName: string,
  date: string,
  time: string,
  isSunday: boolean
}) => {
  const [showReceipt, setShowReceipt] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex-grow flex items-center justify-center p-8 min-h-[70vh]"
    >
      <div className="text-center space-y-8 max-w-xl">
        <div className="inline-flex w-32 h-32 rounded-full bg-primary-container items-center justify-center text-primary shadow-2xl shadow-primary-container/30 mb-4 scale-animation">
          <CheckCircle size={64} />
        </div>
        <h1 className="text-headline-xl text-primary md:text-[56px] italic">
          {isSunday ? 'Enquiry' : 'Booking'} <span className="not-italic">Sent</span>
        </h1>
        <p className="text-body-lg text-on-surface-variant">
          {isSunday 
            ? "Your special Sunday appointment inquiry has been sent! We'll get back to you shortly to confirm our availability."
            : "Thank you for choosing Nyangie Nail Studio. Your request has been sent! We'll confirm your session shortly."}
        </p>

        <div className="glass-panel p-8 rounded-3xl text-left border-primary/20 space-y-6">
          <h2 className="text-headline-md text-primary">Booking Summary</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex gap-4">
              <Clock className="text-primary mt-1" />
              <div>
                <p className="font-bold">{date}</p>
                <p className="text-sm text-on-surface-variant font-medium">{time}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <MapPin className="text-primary mt-1" />
              <div>
                <p className="font-bold">Stanbank House</p>
                <p className="text-sm text-on-surface-variant font-medium">Room 719</p>
              </div>
            </div>
          </div>
          <div className="flex gap-4 pt-2 border-t border-outline-variant/30">
            <Phone className="text-primary mt-1" />
            <div>
              <p className="font-bold">0720 576 725</p>
              <p className="text-sm text-on-surface-variant font-medium text-[12px] opacity-70">Call if you need to reschedule</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button 
            onClick={() => setPage('home')}
            className="flex-1 bg-primary text-on-primary py-4 rounded-full text-label-md hover:bg-surface-tint transition-all"
          >
            Return Home
          </button>
          <button 
            onClick={() => setShowReceipt(true)}
            className="flex-1 border border-primary text-primary py-4 rounded-full text-label-md hover:bg-surface-container transition-all"
          >
            View Receipt
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showReceipt && (
          <Receipt 
            onClose={() => setShowReceipt(false)} 
            selectedServices={selectedServices} 
            userName={userName}
            date={date}
            time={time}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const getEffectiveToday = () => {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1-5 = Mon-Fri, 6 = Saturday
    const hours = now.getHours();

    // Monday - Friday: Past 7 PM
    if (day >= 1 && day <= 5 && hours >= 19) {
      const nextDay = new Date(now);
      nextDay.setDate(now.getDate() + 1);
      nextDay.setHours(0, 0, 0, 0);
      return nextDay;
    }

    // Saturday: Past 6 PM
    if (day === 6 && hours >= 18) {
      const nextDay = new Date(now);
      nextDay.setDate(now.getDate() + 1);
      nextDay.setHours(0, 0, 0, 0);
      return nextDay;
    }

    const effectiveToday = new Date(now);
    effectiveToday.setHours(0, 0, 0, 0);
    return effectiveToday;
  };

  const [page, setPage] = useState<Page>('home');
  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([]);
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [selectedDate, setSelectedDate] = useState(getEffectiveToday());
  const [selectedTime, setSelectedTime] = useState('11:30 AM');

  const toggleService = (service: ServiceItem) => {
    setSelectedServices(prev => {
      const exists = prev.find(s => s.name === service.name);
      if (exists) {
        return prev.filter(s => s.name !== service.name);
      }
      return [...prev, service];
    });
  };

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const renderPage = () => {
    switch (page) {
      case 'home': return <HomePage setPage={setPage} />;
      case 'services': return <ServicesPage setPage={setPage} onSelectService={toggleService} selectedServices={selectedServices} />;
      case 'about': return <AboutPage setPage={setPage} />;
      case 'booking': return (
        <BookingPage 
          setPage={setPage} 
          selectedServices={selectedServices} 
          onSelectService={toggleService} 
          userName={userName} 
          setUserName={setUserName}
          userPhone={userPhone}
          setUserPhone={setUserPhone}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
        />
      );
      case 'confirmation': return (
        <ConfirmationPage 
          setPage={setPage} 
          selectedServices={selectedServices} 
          userName={userName}
          date={formatDate(selectedDate)}
          time={selectedTime}
          isSunday={selectedDate.getDay() === 0}
        />
      );
      default: return <HomePage setPage={setPage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container">
      <Header page={page} setPage={setPage} />
      
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer setPage={setPage} />

      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-40">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary-container rounded-full mix-blend-multiply filter blur-[100px]"></div>
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] bg-tertiary-container rounded-full mix-blend-multiply filter blur-[120px]"></div>
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[40%] bg-secondary-container rounded-full mix-blend-multiply filter blur-[100px]"></div>
      </div>
    </div>
  );
}
