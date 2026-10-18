import React from 'react';
import { usePropertyContext } from '../../context/PropertyContext';
import { PropertyCard } from '../property/PropertyCard';
import { getWhatsAppUrl, getTelUrl } from '../../utils/formatters';
import {
  ShieldCheck,
  Star,
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  Award,
  ArrowLeft,
  Building,
} from 'lucide-react';

export const AgentProfileView: React.FC = () => {
  const { agents, properties, selectedAgentId, setActiveView } = usePropertyContext();

  const agent = agents.find((a) => a.id === selectedAgentId) || agents[0];

  const agentListings = properties.filter(
    (p) => p.agent.id === agent.id || p.agent.name === agent.name
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <button
        onClick={() => setActiveView('listings')}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-700 cursor-pointer transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Property Listings</span>
      </button>

      {/* Agent Bio Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <img
            src={agent.avatar}
            alt={agent.name}
            referrerPolicy="no-referrer"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover border-2 border-emerald-600/20 shadow-xs"
          />

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{agent.name}</h1>
              {agent.verified && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Real Estate Partner
                </span>
              )}
            </div>

            <p className="text-sm font-semibold text-slate-700">{agent.agency}</p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{agent.city}, Pakistan</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="font-bold text-slate-900">{agent.rating}</span>
                <span className="text-slate-400">({agent.reviewsCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-slate-400" />
                <span>{agent.experienceYears} Years Market Experience</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 pt-1 leading-relaxed max-w-3xl">
              {agent.bio}
            </p>

            {/* Languages */}
            <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Languages:</span>
              <span>{agent.languages.join(' · ')}</span>
            </div>
          </div>

          {/* Quick Contact Column */}
          <div className="flex flex-col gap-2 w-full sm:w-auto shrink-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100">
            <a
              href={getWhatsAppUrl(agent.whatsapp, 'Direct Agent Inquiry', 'AGENT')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>

            <a
              href={getTelUrl(agent.phone)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>{agent.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Active Listings by Agent */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            Active Properties by {agent.name} ({agentListings.length})
          </h2>
        </div>

        {agentListings.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-500">
            <Building className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p>No active properties currently published under this agent.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {agentListings.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
