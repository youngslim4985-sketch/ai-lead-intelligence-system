import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Settings as SettingsIcon, 
  Plus, 
  Download, 
  Play, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  Search,
  Filter,
  Mail,
  Globe,
  MapPin,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster, toast } from 'sonner';
import { cn } from './lib/utils';
import { Lead, LeadStatus, DashboardStats } from './types';

// Mock Data
const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    companyName: 'TechFlow Solutions',
    website: 'https://techflow.io',
    location: 'San Francisco, CA',
    email: 'hello@techflow.io',
    isVerified: true,
    isIdeal: true,
    status: 'completed',
    summary: 'B2B SaaS platform specializing in workflow automation for creative agencies.',
    icebreaker: 'I noticed TechFlow recently launched their new automation API—really impressive stuff!',
    subjectLine: 'Quick question about TechFlow\'s workflow automation',
    emailBody: 'Hi team, I saw your new API launch. We help agencies like yours scale...',
    enrichedAt: '2024-03-24 14:30'
  },
  {
    id: '2',
    companyName: 'GreenGrid Energy',
    website: 'https://greengrid.com',
    location: 'Austin, TX',
    email: 'contact@greengrid.com',
    isVerified: true,
    isIdeal: false,
    status: 'completed',
    summary: 'Renewable energy infrastructure provider focusing on solar grid management.',
    icebreaker: 'Your recent project in West Texas is a great example of sustainable scaling.',
    enrichedAt: '2024-03-24 15:15'
  },
  {
    id: '3',
    companyName: 'Stellar Design',
    website: 'https://stellar.design',
    status: 'scraping',
  },
  {
    id: '4',
    companyName: 'Nova Health',
    website: 'https://novahealth.app',
    location: 'New York, NY',
    status: 'verifying',
    email: 'info@novahealth.app'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'leads' | 'settings'>('dashboard');
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [isProcessing, setIsProcessing] = useState(false);

  const stats: DashboardStats = {
    totalLeads: leads.length,
    enrichedLeads: leads.filter(l => l.status === 'completed').length,
    verifiedEmails: leads.filter(l => l.isVerified).length,
    idealLeads: leads.filter(l => l.isIdeal).length,
  };

  const handleRunWorkflow = () => {
    setIsProcessing(true);
    toast.info('Starting outbound engine workflow...');
    
    // Simulate processing
    setTimeout(() => {
      setLeads(prev => prev.map(l => 
        l.status === 'scraping' ? { ...l, status: 'enriching' } : l
      ));
      toast.success('Website scraping completed for pending leads.');
    }, 2000);

    setTimeout(() => {
      setIsProcessing(false);
      toast.success('Workflow batch completed.');
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A] font-sans selection:bg-black selection:text-white">
      <Toaster position="top-right" />
      
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-[#E5E5E5] z-50">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Play className="w-4 h-4 text-white fill-current" />
            </div>
            <span className="font-bold text-xl tracking-tight">T&F ENGINE</span>
          </div>

          <nav className="space-y-1">
            <NavItem 
              icon={<LayoutDashboard className="w-4 h-4" />} 
              label="Dashboard" 
              active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')} 
            />
            <NavItem 
              icon={<Users className="w-4 h-4" />} 
              label="Leads" 
              active={activeTab === 'leads'} 
              onClick={() => setActiveTab('leads')} 
            />
            <NavItem 
              icon={<SettingsIcon className="w-4 h-4" />} 
              label="Settings" 
              active={activeTab === 'settings'} 
              onClick={() => setActiveTab('settings')} 
            />
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 border-t border-[#E5E5E5]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-red-500" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">Young Slim</span>
              <span className="text-xs text-[#9E9E9E]">Pro Plan</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pl-64 min-h-screen">
        <header className="h-16 bg-white border-bottom border-[#E5E5E5] flex items-center justify-between px-8 sticky top-0 z-40">
          <h1 className="text-lg font-semibold capitalize">{activeTab}</h1>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={handleRunWorkflow}
              disabled={isProcessing}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                isProcessing 
                  ? "bg-[#F5F5F5] text-[#9E9E9E] cursor-not-allowed" 
                  : "bg-black text-white hover:bg-[#333] active:scale-95"
              )}
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
              Run Engine
            </button>
            <button className="p-2 hover:bg-[#F5F5F5] rounded-full transition-colors">
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard label="Total Leads" value={stats.totalLeads} icon={<Users className="text-blue-500" />} />
                  <StatCard label="Enriched" value={stats.enrichedLeads} icon={<CheckCircle2 className="text-green-500" />} />
                  <StatCard label="Verified Emails" value={stats.verifiedEmails} icon={<Mail className="text-purple-500" />} />
                  <StatCard label="Ideal Leads" value={stats.idealLeads} icon={<CheckCircle2 className="text-orange-500" />} />
                </div>

                {/* Recent Activity / Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5E5E5] p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-semibold text-lg italic serif">Recent Leads</h2>
                      <button onClick={() => setActiveTab('leads')} className="text-sm text-[#9E9E9E] hover:text-black flex items-center gap-1">
                        View all <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      {leads.slice(0, 3).map(lead => (
                        <div key={lead.id} className="flex items-center justify-between p-4 rounded-xl border border-[#F5F5F5] hover:border-[#E5E5E5] transition-all group cursor-pointer">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-[#F5F5F5] rounded-lg flex items-center justify-center font-bold text-xs">
                              {lead.companyName.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-medium">{lead.companyName}</h3>
                              <div className="flex items-center gap-2 text-xs text-[#9E9E9E]">
                                <Globe className="w-3 h-3" /> {lead.website}
                              </div>
                            </div>
                          </div>
                          <StatusBadge status={lead.status} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-black text-white rounded-2xl p-6 flex flex-col justify-between">
                    <div>
                      <h2 className="font-semibold text-lg mb-2">Ready to scale?</h2>
                      <p className="text-sm text-white/70 leading-relaxed">
                        Your current workflow is processing 10 leads per batch. Upgrade to Enterprise for unlimited concurrent runs.
                      </p>
                    </div>
                    <button className="w-full py-3 bg-white text-black rounded-xl font-semibold text-sm hover:bg-[#F5F5F5] transition-colors mt-8">
                      Upgrade to Enterprise
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'leads' && (
              <motion.div 
                key="leads"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div className="relative w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E9E9E]" />
                    <input 
                      type="text" 
                      placeholder="Search leads, companies, domains..." 
                      className="w-full pl-10 pr-4 py-2 bg-white border border-[#E5E5E5] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E5E5] rounded-full text-sm hover:bg-[#F5F5F5] transition-colors">
                      <Filter className="w-4 h-4" /> Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E5E5] rounded-full text-sm hover:bg-[#F5F5F5] transition-colors">
                      <Download className="w-4 h-4" /> Export CSV
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#E5E5E5] bg-[#FAFAFA]">
                        <th className="p-4 text-[11px] uppercase tracking-wider font-semibold text-[#9E9E9E] italic serif">Company</th>
                        <th className="p-4 text-[11px] uppercase tracking-wider font-semibold text-[#9E9E9E] italic serif">Status</th>
                        <th className="p-4 text-[11px] uppercase tracking-wider font-semibold text-[#9E9E9E] italic serif">Location</th>
                        <th className="p-4 text-[11px] uppercase tracking-wider font-semibold text-[#9E9E9E] italic serif">Email</th>
                        <th className="p-4 text-[11px] uppercase tracking-wider font-semibold text-[#9E9E9E] italic serif">Ideal</th>
                        <th className="p-4 text-[11px] uppercase tracking-wider font-semibold text-[#9E9E9E] italic serif">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map(lead => (
                        <tr key={lead.id} className="border-b border-[#F5F5F5] hover:bg-[#FAFAFA] transition-colors group">
                          <td className="p-4">
                            <div className="flex flex-col">
                              <span className="font-medium">{lead.companyName}</span>
                              <span className="text-xs text-[#9E9E9E] flex items-center gap-1">
                                <Globe className="w-3 h-3" /> {lead.website}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <StatusBadge status={lead.status} />
                          </td>
                          <td className="p-4 text-sm text-[#666]">
                            {lead.location || '—'}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{lead.email || '—'}</span>
                              {lead.isVerified && <CheckCircle2 className="w-3 h-3 text-green-500" />}
                            </div>
                          </td>
                          <td className="p-4">
                            {lead.isIdeal ? (
                              <span className="px-2 py-1 bg-orange-50 text-orange-600 text-[10px] font-bold rounded uppercase tracking-tight">Ideal</span>
                            ) : (
                              <span className="text-[#9E9E9E] text-xs">—</span>
                            )}
                          </td>
                          <td className="p-4">
                            <button className="p-2 hover:bg-[#F5F5F5] rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                              <ExternalLink className="w-4 h-4 text-[#9E9E9E]" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div 
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-2xl space-y-8"
              >
                <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 space-y-6">
                  <h2 className="font-semibold text-lg italic serif">API Credentials</h2>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#9E9E9E]">Gemini API Key</label>
                      <input 
                        type="password" 
                        value="••••••••••••••••" 
                        readOnly
                        className="w-full px-4 py-2 bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl text-sm focus:outline-none"
                      />
                      <p className="text-[10px] text-[#9E9E9E]">Used for company summarization and email generation.</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#9E9E9E]">Reoon Email Verifier Key</label>
                      <input 
                        type="password" 
                        placeholder="Enter Reoon API Key"
                        className="w-full px-4 py-2 bg-white border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#9E9E9E]">n8n Webhook URL</label>
                      <input 
                        type="text" 
                        placeholder="https://n8n.your-domain.com/webhook/..."
                        className="w-full px-4 py-2 bg-white border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                      />
                    </div>
                  </div>

                  <button className="px-6 py-2 bg-black text-white rounded-full text-sm font-semibold hover:bg-[#333] transition-colors">
                    Save Changes
                  </button>
                </div>

                <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 space-y-6">
                  <h2 className="font-semibold text-lg italic serif">Workflow Configuration</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium">Batch Size</h3>
                        <p className="text-xs text-[#9E9E9E]">Number of leads to process in a single run.</p>
                      </div>
                      <select className="bg-[#F5F5F5] border border-[#E5E5E5] rounded-lg px-3 py-1 text-sm outline-none">
                        <option>5</option>
                        <option>10</option>
                        <option>25</option>
                        <option>50</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium">Strict Qualification</h3>
                        <p className="text-xs text-[#9E9E9E]">Only generate emails for leads marked as 'Ideal'.</p>
                      </div>
                      <div className="w-10 h-6 bg-black rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
        active 
          ? "bg-black text-white shadow-lg shadow-black/10" 
          : "text-[#9E9E9E] hover:text-black hover:bg-[#F5F5F5]"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function StatCard({ label, value, icon }: { label: string, value: string | number, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-[#E5E5E5] space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#9E9E9E]">{label}</span>
        {icon}
      </div>
      <div className="text-3xl font-light tracking-tight">{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: LeadStatus }) {
  const configs: Record<LeadStatus, { label: string, color: string, icon?: React.ReactNode }> = {
    pending: { label: 'Pending', color: 'bg-[#F5F5F5] text-[#9E9E9E]' },
    scraping: { label: 'Scraping', color: 'bg-blue-50 text-blue-600', icon: <Loader2 className="w-3 h-3 animate-spin" /> },
    enriching: { label: 'Enriching', color: 'bg-purple-50 text-purple-600', icon: <Loader2 className="w-3 h-3 animate-spin" /> },
    verifying: { label: 'Verifying', color: 'bg-yellow-50 text-yellow-600', icon: <Loader2 className="w-3 h-3 animate-spin" /> },
    completed: { label: 'Ready', color: 'bg-green-50 text-green-600', icon: <CheckCircle2 className="w-3 h-3" /> },
    failed: { label: 'Failed', color: 'bg-red-50 text-red-600', icon: <XCircle className="w-3 h-3" /> },
  };

  const config = configs[status];

  return (
    <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight", config.color)}>
      {config.icon}
      {config.label}
    </div>
  );
}
