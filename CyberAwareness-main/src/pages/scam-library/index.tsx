import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Database } from 'lucide-react';
import { scamDatabase, ScamCategory, getScamsByCategory, searchScams } from '../../data/scamDatabase';
import ScamCard from '../../components/scam-library/ScamCard';
import CategoryFilter from '../../components/scam-library/CategoryFilter';
import SearchBar from '../../components/scam-library/SearchBar';

export default function ScamLibrary() {
  const [selectedCategory, setSelectedCategory] = useState<ScamCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredScams = useMemo(() => {
    let scams = selectedCategory === 'all' 
      ? scamDatabase 
      : getScamsByCategory(selectedCategory);
    
    if (searchQuery.trim()) {
      scams = searchScams(searchQuery);
    }
    
    return scams;
  }, [selectedCategory, searchQuery]);


  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Top bar */}
      <div className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-cyan-400 transition-colors">
            ← Back to Home
          </Link>
          <span className="text-slate-700">/</span>
          <span className="text-xs text-slate-400">Scam Library</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
        {/* Hero */}
        <div className="relative rounded-2xl overflow-hidden px-8 py-16 text-center flex flex-col items-center justify-center"
          style={{ background: 'linear-gradient(160deg, #0f172a 0%, #0c1a2e 50%, #0f172a 100%)', border: '1px solid #1e293b' }}>
          <div className="absolute -top-16 left-1/4 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 65%)' }} />
          <div className="absolute -bottom-16 right-1/4 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(45,212,191,0.09) 0%, transparent 65%)' }} />
          <div className="relative z-10 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-7 uppercase tracking-wider"
              style={{ background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)', color: '#22d3ee' }}>
              <Database className="w-3.5 h-3.5" /> Comprehensive Scam Database
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight text-white text-center">
              Scam{' '}
              <span style={{ background: 'linear-gradient(90deg,#22d3ee,#2dd4bf)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Library
              </span>
            </h1>
            <p className="text-sm max-w-lg mx-auto mb-9 text-slate-500 text-center">
              Explore {scamDatabase.length-1}+ crypto scams, cyber crimes, and fraud types with detailed indicators and prevention tips.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="rounded-xl p-4 text-center bg-slate-900 border border-slate-800">
            <div className="text-xl font-bold mb-1 text-cyan-400">{scamDatabase.length}</div>
            <div className="text-xs text-slate-500">Total Scams</div>
          </div>
          <div className="rounded-xl p-4 text-center bg-slate-900 border border-slate-800">
            <div className="text-xl font-bold mb-1 text-orange-400">{getScamsByCategory('Crypto-Fraud').length}</div>
            <div className="text-xs text-slate-500">Crypto Fraud</div>
          </div>
          <div className="rounded-xl p-4 text-center bg-slate-900 border border-slate-800">
            <div className="text-xl font-bold mb-1 text-red-400">{getScamsByCategory('Phishing-Social-Engineering').length}</div>
            <div className="text-xs text-slate-500">Phishing</div>
          </div>
          <div className="rounded-xl p-4 text-center bg-slate-900 border border-slate-800">
            <div className="text-xl font-bold mb-1 text-purple-400">{getScamsByCategory('Technical-Attacks').length}</div>
            <div className="text-xs text-slate-500">Technical</div>
          </div>
          <div className="rounded-xl p-4 text-center bg-slate-900 border border-slate-800">
            <div className="text-xl font-bold mb-1 text-pink-400">{getScamsByCategory('Financial-Fraud').length + getScamsByCategory('Identity-Crimes').length}</div>
            <div className="text-xs text-slate-500">Other</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="space-y-6">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
        </div>

        {/* Results */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-base font-bold text-slate-200">
              {selectedCategory === 'all' ? 'All Scams' : selectedCategory.replace('-', ' ')}
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium"
              style={{ background: 'rgba(34,211,238,0.1)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.2)' }}>
              {filteredScams.length} Results
            </span>
          </div>
          
          {filteredScams.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredScams.map((scam) => (
                <ScamCard key={scam.id} scam={scam} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl p-12 text-center bg-slate-900 border border-slate-800">
              <Shield className="w-12 h-12 text-slate-700 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No scams found</h3>
              <p className="text-sm text-slate-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>

        {/* Helpline banner */}
        <div className="rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-5"
          style={{ background: 'linear-gradient(135deg, #0f172a 0%, rgba(14,116,144,0.18) 100%)', border: '1px solid rgba(34,211,238,0.18)' }}>
          <div>
            <div className="font-bold text-base text-white mb-1">🚨 Victim of a Scam?</div>
            <p className="text-sm text-slate-500">Report immediately at the National Cyber Crime Portal or call the helpline.</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <a href="tel:1930"
              className="px-5 py-2.5 rounded-xl font-bold text-white text-sm transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg,#b91c1c,#ef4444)' }}>
              📞 Call 1930
            </a>
            <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer"
              className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-105"
              style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.25)', color: '#22d3ee' }}>
              Report Online
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
