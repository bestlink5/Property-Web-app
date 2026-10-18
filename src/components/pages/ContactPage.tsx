import React, { useState } from 'react';
import { usePropertyContext } from '../../context/PropertyContext';
import { MapPin, Phone, Mail, MessageCircle, Send, CheckCircle2, Building, ChevronDown, ChevronUp } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { addToast } = usePropertyContext();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Islamabad');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      addToast('Please fill in required fields.', 'error');
      return;
    }
    setSubmitted(true);
    addToast('Your inquiry has been submitted! Our team will contact you within 24 hours.', 'success');
  };

  const offices = [
    {
      city: 'Islamabad (Headquarters)',
      address: 'Level 5, ISE Towers, Jinnah Avenue, Blue Area, Islamabad',
      phone: '+92 51 289 1000',
      whatsapp: '+92 300 5544321',
      email: 'islamabad@propertymarkaz.pk',
    },
    {
      city: 'Mirpur AJK (Regional Hub)',
      address: 'Chaudhry Plaza, Main Allama Iqbal Road, Sector F-1, Mirpur AJK',
      phone: '+92 5827 442200',
      whatsapp: '+92 345 8899123',
      email: 'mirpur@propertymarkaz.pk',
    },
    {
      city: 'Lahore (Punjab Office)',
      address: 'Floor 3, Gulberg Heights, Main Boulevard Gulberg III, Lahore',
      phone: '+92 42 3577 9000',
      whatsapp: '+92 321 7766554',
      email: 'lahore@propertymarkaz.pk',
    },
    {
      city: 'Karachi (Sindh Office)',
      address: 'Suite 402, Executive Tower, Block 4 Clifton, Karachi',
      phone: '+92 21 3583 4000',
      whatsapp: '+92 333 4455667',
      email: 'karachi@propertymarkaz.pk',
    },
  ];

  const faqs = [
    {
      q: 'Can Overseas Pakistanis buy property through PropertyMarkaz?',
      a: 'Yes. Overseas Pakistanis holding a NICOP or POC card can legally acquire, own, and transfer freehold residential and commercial properties in Pakistan. We provide direct digital verification and vetted agent contacts in Islamabad, Mirpur AJK, and Lahore.',
    },
    {
      q: 'How are property listings verified before publishing?',
      a: 'All advertisements submitted to PropertyMarkaz pass through our administrative moderation dashboard where price realism, ownership veracity, and photographic authenticity are checked before public indexing.',
    },
    {
      q: 'What is the standard Marla size in Pakistan?',
      a: 'In modern master-planned societies like DHA and Bahria Town, 1 Marla is standardized at 225 square feet (25 square yards). In older municipal revenue records in certain rural areas, a traditional 272 sq ft Marla may apply. PropertyMarkaz clearly notes square footage on every listing.',
    },
    {
      q: 'Is there a fee for posting a property advertisement?',
      a: 'Basic property listings posted by direct owners are completely free of charge. Premium verified featured placements and commercial banner slots are available for real estate developers and agencies.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Regional Offices & Nationwide Support
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto">
          Reach our dedicated support team in Islamabad, Mirpur AJK, Lahore, or Karachi.
        </p>
      </div>

      {/* Offices Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {offices.map((office, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Building className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">{office.city}</h2>
              <div className="flex items-start gap-1.5 text-xs text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{office.address}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs">
              <a
                href={`tel:${office.phone.replace(/\s+/g, '')}`}
                className="flex items-center gap-1.5 text-slate-700 hover:text-emerald-700 font-semibold"
              >
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{office.phone}</span>
              </a>
              <a
                href={`https://wa.me/${office.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-semibold"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Desk</span>
              </a>
              <a
                href={`mailto:${office.email}`}
                className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800"
              >
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{office.email}</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Split: Contact Form + FAQs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Contact Form */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-1">Send an Inquiry to PropertyMarkaz</h2>
          <p className="text-xs text-slate-500 mb-6">
            For partnerships, listing assistance, or title clearance advice
          </p>

          {submitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-emerald-900 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-sm font-bold">Message Sent Successfully!</h3>
              <p className="text-xs text-emerald-700">
                Thank you, {name}. Our regional desk in {city} will reach you shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-3 text-xs text-emerald-800 font-bold underline cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Asad Ullah"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.pk"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Target City / Region
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600 cursor-pointer"
                  >
                    <option value="Islamabad">Islamabad Capital</option>
                    <option value="Mirpur AJK">Mirpur AJK</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Faisalabad">Faisalabad</option>
                    <option value="Peshawar">Peshawar</option>
                    <option value="Quetta">Quetta</option>
                    <option value="Gilgit">Gilgit-Baltistan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Message / Details *
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about the property you are inquiring about or looking to sell..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>

        {/* FAQs Accordion */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 mb-1">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-500 mb-4">
            Common questions regarding property transactions and verification in Pakistan
          </p>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-4 py-3 text-left bg-slate-50 hover:bg-slate-100 flex items-center justify-between gap-3 text-xs font-bold text-slate-800 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-4 h-4 text-emerald-700 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-4 py-3 bg-white text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
