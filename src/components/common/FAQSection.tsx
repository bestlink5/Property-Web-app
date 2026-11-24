import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  ChevronUp,
  Home,
  Tag,
  KeyRound,
  ShieldCheck,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';

export type FAQCategory = 'all' | 'buying' | 'selling' | 'renting' | 'legal';

export interface FAQItem {
  id: string;
  category: Exclude<FAQCategory, 'all'>;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  // Buying
  {
    id: 'buy-1',
    category: 'buying',
    question: 'How do I search for properties to buy by Sector, Society, Town, or Private Land?',
    answer:
      'Use the search bar on the Home or Listings page and select "Buy Property". You can filter by city, development zone (CDA/MDA Sectors, Housing Societies like DHA & Bahria Town, Planned Towns, or Private Land & Mouza), property category, budget range in PKR, and bedrooms/bathrooms.',
  },
  {
    id: 'buy-2',
    category: 'buying',
    question: 'How are property prices formatted on PropertyMarkaz?',
    answer:
      'All sale and rental prices are displayed in Pakistani Rupees (PKR) using familiar local units—Lakhs and Crores—alongside the full numeric PKR amount on the listing details page.',
  },
  {
    id: 'buy-3',
    category: 'buying',
    question: 'How do I contact a property owner or real estate agent directly?',
    answer:
      'Every property card and listing detail page includes direct WhatsApp and phone call buttons as well as a direct inquiry form. You can reach the owner or assigned broker directly with zero middleman fees or paywalls.',
  },
  {
    id: 'buy-4',
    category: 'buying',
    question: 'Can Overseas Pakistanis buy property through PropertyMarkaz?',
    answer:
      'Yes. Overseas Pakistanis holding a NICOP or POC can legally purchase freehold residential, commercial, and land properties across Pakistan and Azad Jammu & Kashmir. Direct WhatsApp connectivity makes it easy to request video walkthroughs and verify documents remotely.',
  },
  {
    id: 'buy-5',
    category: 'buying',
    question: 'How does the Area Unit Converter and Home Loan Calculator work?',
    answer:
      'On every listing detail page (and on the home page), you can convert plot sizes between Marla (225 sq. ft), Kanal (20 Marlas / 4,500 sq. ft), Square Yards (Guz), and Square Feet. For properties marked For Sale, the built-in installment calculator estimates monthly payments based on down payment, tenure, and markup rate.',
  },

  // Selling
  {
    id: 'sell-1',
    category: 'selling',
    question: 'How do I list my property for sale on PropertyMarkaz?',
    answer:
      'Click "Add Property" in the navigation bar to open the 3-step submission portal: (1) choose purpose, category, city, and sector/society/town/private land details; (2) enter your PKR demand price, area size, and specifications; (3) add your contact numbers and upload property photos before submitting for review.',
  },
  {
    id: 'sell-2',
    category: 'selling',
    question: 'What if my sector, housing society, town, or Mouza is not in the dropdown list?',
    answer:
      'In Step 1 of the Add Property form, click "+ Add Custom Sector / Society / Town / Private Land" (or select the custom option in the dropdown) to enter your exact locality name, street or plot number, and Mouza/Khasra revenue details.',
  },
  {
    id: 'sell-3',
    category: 'selling',
    question: 'What photo formats are supported and how do I set a cover photo?',
    answer:
      'You can upload up to 15 photos in JPG, PNG, or WebP format via drag-and-drop, file picker, or mobile camera. Once uploaded, use the "Set Cover" star button or reorder arrows to choose which photo appears first in search results.',
  },
  {
    id: 'sell-4',
    category: 'selling',
    question: 'Can I update the price, land size, or contact details after my listing is approved?',
    answer:
      'Yes. Use the "Edit Price, Land & Contact" option on your listing or in the moderation console to update the asking price, negotiability, plot dimensions, sector/Mouza details, or assigned owner/agent phone and WhatsApp numbers.',
  },

  // Renting
  {
    id: 'rent-1',
    category: 'renting',
    question: 'How do I browse houses, apartments, or commercial spaces for rent?',
    answer:
      'Click "Rent" in the top menu or switch the purpose toggle to "Rent Property" in the search bar. Rental listings show monthly PKR rates and include specialized budget ranges (from PKR 30,000 up to PKR 10 Lakh+ per month).',
  },
  {
    id: 'rent-2',
    category: 'renting',
    question: 'Are furnishing details and utilities listed on rental properties?',
    answer:
      'Yes. Rental advertisements specify furnishing status (Unfurnished, Semi-Furnished, or Fully Furnished), bedrooms, bathrooms, car parking, and available utilities such as 24/7 electricity, Sui Gas, and water supply.',
  },
  {
    id: 'rent-3',
    category: 'renting',
    question: 'What is the typical security deposit and advance rent in Pakistan?',
    answer:
      'Standard residential leases in major Pakistani cities typically require 1 to 2 months of security deposit plus 1 month of advance rent, while commercial rentals vary by building and plaza management. Always confirm exact terms directly with the landlord or agent before signing a tenancy agreement.',
  },

  // Legal & Verification
  {
    id: 'legal-1',
    category: 'legal',
    question: 'What legal details should I check when buying Private Land or Agricultural plots?',
    answer:
      'For Private Land listings, inspect the Mouza / Revenue Estate name, Khasra / Khatooni number, legal title deed (Registry & Inteqal, Fard Malkiat, or Power of Attorney), physical possession status, road frontage, and utility connections. Always verify original revenue records through the local Patwar Halqa or Sub-Registrar before making payments.',
  },
  {
    id: 'legal-2',
    category: 'legal',
    question: 'Why do newly submitted advertisements go through review before appearing publicly?',
    answer:
      'New property submissions enter a moderation queue so administrators can check for realistic PKR pricing, clear location information, valid contact numbers, and clean photos before publishing to the marketplace.',
  },
];

const CATEGORY_TABS: { id: FAQCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'all', label: 'All Topics', icon: HelpCircle },
  { id: 'buying', label: 'Buying', icon: Home },
  { id: 'selling', label: 'Selling', icon: Tag },
  { id: 'renting', label: 'Renting', icon: KeyRound },
  { id: 'legal', label: 'Land & Verification', icon: ShieldCheck },
];

const CATEGORY_LABELS: Record<Exclude<FAQCategory, 'all'>, string> = {
  buying: 'Buying',
  selling: 'Selling',
  renting: 'Renting',
  legal: 'Land & Verification',
};

interface FAQSectionProps {
  initialCategory?: FAQCategory;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ initialCategory = 'all' }) => {
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [openIds, setOpenIds] = useState<string[]>([FAQ_ITEMS[0].id]);

  const filteredFaqs = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.question.toLowerCase().includes(q) ||
          item.answer.toLowerCase().includes(q) ||
          CATEGORY_LABELS[item.category].toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  const toggleItem = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const allExpanded =
    filteredFaqs.length > 0 && filteredFaqs.every((item) => openIds.includes(item.id));

  const handleToggleAll = () => {
    if (allExpanded) {
      setOpenIds([]);
    } else {
      setOpenIds(filteredFaqs.map((item) => item.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Category Filter Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions about buying, selling, renting, Mouza, PKR, or photos..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
            />
          </div>

          <button
            type="button"
            onClick={handleToggleAll}
            disabled={filteredFaqs.length === 0}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            {allExpanded ? 'Collapse All' : 'Expand All'}
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {CATEGORY_TABS.map((tab) => {
            const Icon = tab.icon;
            const count =
              tab.id === 'all'
                ? FAQ_ITEMS.length
                : FAQ_ITEMS.filter((i) => i.category === tab.id).length;
            const isActive = selectedCategory === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    isActive ? 'bg-emerald-800 text-emerald-100' : 'bg-white text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Questions Accordion List */}
      {filteredFaqs.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center space-y-3">
          <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No matching questions found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try clearing your search keyword or switching back to all FAQ topics.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Show All FAQs</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openIds.includes(faq.id);
            return (
              <div
                key={faq.id}
                className={`bg-white rounded-xl border transition-colors overflow-hidden shadow-2xs ${
                  isOpen ? 'border-emerald-300' : 'border-slate-200'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full px-5 py-4 text-left flex items-start justify-between gap-4 hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <div className="space-y-1">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {CATEGORY_LABELS[faq.category]}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {faq.question}
                    </h3>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-emerald-700 shrink-0 mt-1" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-4 pt-2 border-t border-slate-100 bg-slate-50/50 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
