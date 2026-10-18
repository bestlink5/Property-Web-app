import React, { useState } from 'react';
import { usePropertyContext } from '../../context/PropertyContext';
import { Property, PropertyStatus } from '../../types/property';
import { formatPKR, formatArea } from '../../utils/formatters';
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trash2,
  Eye,
  Star,
  Search,
  Filter,
  FileCheck2,
  Clock,
  Layers,
  Building,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    properties,
    approveProperty,
    rejectProperty,
    deleteProperty,
    toggleFeatured,
    navigateToProperty,
  } = usePropertyContext();

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [rejectingPropId, setRejectingPropId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Incomplete property documentation or invalid contact');

  // Stats
  const totalCount = properties.length;
  const pendingCount = properties.filter((p) => p.status === 'pending').length;
  const approvedCount = properties.filter((p) => p.status === 'approved').length;
  const rejectedCount = properties.filter((p) => p.status === 'rejected').length;

  // Filtered list
  const filteredList = properties.filter((p) => {
    if (activeTab === 'pending' && p.status !== 'pending') return false;
    if (activeTab === 'approved' && p.status !== 'approved') return false;
    if (activeTab === 'rejected' && p.status !== 'rejected') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.id.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.agent.name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleConfirmReject = () => {
    if (rejectingPropId) {
      rejectProperty(rejectingPropId, rejectionReason);
      setRejectingPropId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-6 h-6 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Administration & Quality Control
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Property Advertisements Moderation
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review, verify legal clearances, approve genuine listings, and manage fraud prevention.
          </p>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveTab('pending')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeTab === 'pending'
              ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-400/30'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600">Pending Review</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-2xl font-black text-amber-700 font-mono tabular-nums">
            {pendingCount}
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">Awaiting verification</span>
        </div>

        <div
          onClick={() => setActiveTab('approved')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeTab === 'approved'
              ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-400/30'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600">Live / Approved</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-black text-emerald-700 font-mono tabular-nums">
            {approvedCount}
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">Active on marketplace</span>
        </div>

        <div
          onClick={() => setActiveTab('rejected')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeTab === 'rejected'
              ? 'bg-rose-50/80 border-rose-300 ring-2 ring-rose-400/30'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600">Rejected Ads</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <span className="text-2xl font-black text-rose-700 font-mono tabular-nums">
            {rejectedCount}
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">Declined or flagged</span>
        </div>

        <div
          onClick={() => setActiveTab('all')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeTab === 'all'
              ? 'bg-slate-100 border-slate-400 ring-2 ring-slate-400/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600">Total Ads Catalog</span>
            <Layers className="w-4 h-4 text-slate-600" />
          </div>
          <span className="text-2xl font-black text-slate-900 font-mono tabular-nums">
            {totalCount}
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">All recorded properties</span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-1">
          {(['pending', 'approved', 'rejected', 'all'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer capitalize ${
                activeTab === tab
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab === 'all' ? 'All Listings' : tab}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Ref ID, title, city, agent..."
            className="w-full sm:w-64 pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
          />
        </div>
      </div>

      {/* Moderation Queue List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredList.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            <FileCheck2 className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-slate-700">No properties in this moderation queue</p>
            <p className="text-[11px] text-slate-400 mt-1">All submissions have been reviewed.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Ref & Property</th>
                  <th className="py-3 px-4">City / Location</th>
                  <th className="py-3 px-4">Price & Area</th>
                  <th className="py-3 px-4">Seller / Agent</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredList.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Ref & Title */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 rounded overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                          {p.images && p.images[0] ? (
                            <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Building className="w-5 h-5 m-auto text-slate-300" />
                          )}
                        </div>
                        <div>
                          <span className="font-mono text-[10px] text-slate-400 block font-semibold">
                            {p.id}
                          </span>
                          <span
                            onClick={() => navigateToProperty(p.id)}
                            className="font-bold text-slate-900 hover:text-emerald-700 line-clamp-1 cursor-pointer"
                          >
                            {p.title}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {p.type} · {p.purpose === 'buy' ? 'Sale' : 'Rent'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* City / Location */}
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 block">{p.city}</span>
                      <span className="text-[11px] text-slate-500 line-clamp-1">{p.location}</span>
                    </td>

                    {/* Price & Area */}
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 font-mono block">
                        {formatPKR(p.price)}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {formatArea(p.areaValue, p.areaUnit)}
                      </span>
                    </td>

                    {/* Seller */}
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 block">{p.agent.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{p.agent.phone}</span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      {p.status === 'approved' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                          <CheckCircle className="w-3 h-3" />
                          Approved
                        </span>
                      )}
                      {p.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                          <Clock className="w-3 h-3" />
                          Pending Review
                        </span>
                      )}
                      {p.status === 'rejected' && (
                        <div>
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded">
                            <XCircle className="w-3 h-3" />
                            Rejected
                          </span>
                          {p.rejectionReason && (
                            <p className="text-[10px] text-rose-600 mt-0.5 max-w-xs truncate" title={p.rejectionReason}>
                              {p.rejectionReason}
                            </p>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Action buttons */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Approve */}
                        {p.status !== 'approved' && (
                          <button
                            onClick={() => approveProperty(p.id)}
                            className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[11px] font-bold transition-colors cursor-pointer"
                            title="Approve and Publish Listing"
                          >
                            Approve
                          </button>
                        )}

                        {/* Reject */}
                        {p.status !== 'rejected' && (
                          <button
                            onClick={() => setRejectingPropId(p.id)}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded text-[11px] font-bold transition-colors cursor-pointer border border-rose-200"
                            title="Reject Listing with Reason"
                          >
                            Reject
                          </button>
                        )}

                        {/* Toggle Featured */}
                        <button
                          onClick={() => toggleFeatured(p.id)}
                          className={`p-1.5 rounded transition-colors cursor-pointer ${
                            p.featured
                              ? 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                              : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                          }`}
                          title={p.featured ? 'Remove Featured' : 'Mark as Featured'}
                        >
                          <Star className={`w-3.5 h-3.5 ${p.featured ? 'fill-amber-500' : ''}`} />
                        </button>

                        {/* View Details */}
                        <button
                          onClick={() => navigateToProperty(p.id)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                          title="Preview Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete listing ${p.id}?`)) {
                              deleteProperty(p.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectingPropId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
              <AlertCircle className="w-5 h-5" />
              <span>Reject Listing {rejectingPropId}</span>
            </div>

            <p className="text-xs text-slate-600">
              Please select or enter the specific reason for rejecting this property advertisement:
            </p>

            <select
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-rose-600"
            >
              <option value="Incomplete property documentation or invalid contact">
                Incomplete property documentation or invalid contact
              </option>
              <option value="Unrealistic or misquoted price (market variance)">
                Unrealistic or misquoted price (market variance)
              </option>
              <option value="Duplicate advertisement already listed">
                Duplicate advertisement already listed
              </option>
              <option value="Low resolution, watermarked, or copyrighted photos">
                Low resolution, watermarked, or copyrighted photos
              </option>
              <option value="Unclear sector, plot number, or registry information">
                Unclear sector, plot number, or registry information
              </option>
            </select>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectingPropId(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-1.5 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
