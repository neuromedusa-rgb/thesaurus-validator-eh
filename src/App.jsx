import React, { useState } from 'react';
import { Upload, CheckCircle, XCircle, GitMerge, Download, BarChart3, ArrowRight, ArrowLeft, Info } from 'lucide-react';

// ==================== CLASIFICADOR - STOPWORDS Y KEYWORDS ====================
const STOPWORDS = [
  'action', 'activity', 'addition', 'analysis', 'approach', 'area',
  'article', 'aspect', 'author', 'basis', 'case', 'concept',
  'condition', 'contribution', 'data', 'decade', 'effect', 'example',
  'field', 'focus', 'framework', 'idea', 'impact', 'issue', 'kind',
  'level', 'number', 'paper', 'part', 'point', 'practice', 'problem',
  'process', 'project', 'range', 'result', 'section', 'study', 'term',
  'thing', 'topic', 'type', 'use', 'way', 'year'
];

const PROTECTED_KEYWORDS = [
  'anthropocene', 'posthuman', 'nonhuman', 'multispecies',
  'more-than-human', 'entanglement', 'assemblage',
  'ecocriticism', 'environmental humanities', 'environmental history',
  'political ecology', 'environmental justice',
  'sustainability', 'ecology', 'biodiversity', 'conservation',
  'climate change', 'landscape', 'heritage', 'resilience',
  'ecosystem', 'habitat', 'species', 'nature', 'environment',
  'extinction', 'restoration', 'wilderness', 'urban ecology'
];

const METHODOLOGY_TERMS = [
  'method', 'methodology', 'research', 'literature', 'review',
  'discussion', 'conclusion', 'introduction', 'finding', 'evidence'
];

// ==================== FUNCIÓN DE CLASIFICACIÓN ====================
function classifyTerm(term, occurrences, relevance) {
  const termLower = term.toLowerCase();
  
  if (STOPWORDS.includes(termLower)) {
    return {
      category: 'EMPTY',
      action: 'ELIMINATE',
      confidence: 'HIGH',
      justification: 'Generic methodological term with low semantic value'
    };
  }
  
  if (PROTECTED_KEYWORDS.some(keyword => termLower.includes(keyword))) {
    return {
      category: 'CONCEPTUAL',
      action: 'KEEP',
      confidence: 'HIGH',
      justification: 'Core Environmental Humanities concept'
    };
  }
  
  if (relevance > 1.5) {
    return {
      category: 'SPECIFIC',
      action: 'KEEP',
      confidence: 'HIGH',
      justification: `High relevance score (${relevance.toFixed(2)}) indicates corpus-specific term`
    };
  }
  
  if (occurrences > 50) {
    return {
      category: 'CONCEPTUAL',
      action: 'KEEP',
      confidence: 'MEDIUM',
      justification: `High frequency (${occurrences} occurrences) suggests central concept`
    };
  }
  
  if (relevance < 0.3 && occurrences < 20) {
    return {
      category: 'EMPTY',
      action: 'ELIMINATE',
      confidence: 'MEDIUM',
      justification: `Low relevance (${relevance.toFixed(2)}) and frequency (${occurrences}) indicates noise`
    };
  }
  
  if (METHODOLOGY_TERMS.some(method => termLower.includes(method))) {
    return {
      category: 'META-TERM',
      action: 'EVALUATE',
      confidence: 'MEDIUM',
      justification: 'Methodological term requiring expert evaluation'
    };
  }
  
  if (relevance >= 0.5 && occurrences >= 20) {
    return {
      category: 'EMPIRICAL',
      action: 'KEEP',
      confidence: 'MEDIUM',
      justification: `Moderate relevance (${relevance.toFixed(2)}) and frequency (${occurrences})`
    };
  }
  
  return {
    category: 'UNDETERMINED',
    action: 'REVIEW',
    confidence: 'LOW',
    justification: `Ambiguous case: relevance=${relevance.toFixed(2)}, occurrences=${occurrences}`
  };
}

// ==================== PARSER DE ARCHIVO ====================
function parseFrequencyRelevanceFile(fileContent) {
  const lines = fileContent.trim().split('\n');
  const dataLines = lines.slice(1);
  
  return dataLines.map((line, index) => {
    const parts = line.split('\t');
    
    if (parts.length < 4) {
      console.warn(`Skipping malformed line ${index + 2}: ${line}`);
      return null;
    }
    
    const term = parts[1].trim();
    const occurrences = parseInt(parts[2], 10);
    const relevance = parseFloat(parts[3]);
    
    if (isNaN(occurrences) || isNaN(relevance)) {
      console.warn(`Invalid data on line ${index + 2}: ${line}`);
      return null;
    }
    
    const classification = classifyTerm(term, occurrences, relevance);
    
    return {
      id: index + 1,
      term,
      occurrences,
      relevance,
      ...classification,
      validated: false,
      finalAction: null,
      mergeTarget: null
    };
  }).filter(item => item !== null);
}

// ==================== ESTADÍSTICAS ====================
function getStatistics(terms) {
  const total = terms.length;
  const validated = terms.filter(t => t.validated).length;
  
  const actionCounts = terms.reduce((acc, term) => {
    const action = term.finalAction || term.action;
    acc[action] = (acc[action] || 0) + 1;
    return acc;
  }, {});
  
  return {
    total,
    validated,
    pending: total - validated,
    actions: {
      keep: actionCounts.KEEP || 0,
      merge: actionCounts.MERGE || 0,
      eliminate: actionCounts.ELIMINATE || 0,
      review: actionCounts.REVIEW || 0,
      evaluate: actionCounts.EVALUATE || 0
    }
  };
}

// ==================== COMPONENTE PRINCIPAL ====================
function App() {
  const [terms, setTerms] = useState([]);
  const [currentBatch, setCurrentBatch] = useState(0);
  const [mergeInputs, setMergeInputs] = useState({});
  const [showInfo, setShowInfo] = useState(false);
  const BATCH_SIZE = 20;

  const stats = getStatistics(terms);
  const totalBatches = Math.ceil(terms.length / BATCH_SIZE);
  const currentTerms = terms.slice(currentBatch * BATCH_SIZE, (currentBatch + 1) * BATCH_SIZE);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const parsedTerms = parseFrequencyRelevanceFile(content);
      setTerms(parsedTerms);
      setCurrentBatch(0);
    };
    reader.readAsText(file);
  };

  const handleDecision = (termId, decision, mergeTarget = null) => {
    setTerms(prev => prev.map(term => 
      term.id === termId 
        ? { ...term, validated: true, finalAction: decision, mergeTarget }
        : term
    ));
  };

  const handleMergeInputChange = (termId, value) => {
    setMergeInputs(prev => ({ ...prev, [termId]: value }));
  };

  // ==================== EXPORTADOR CORREGIDO ====================
  const exportThesaurus = () => {
    const headers = ['label', 'replace by'];
    
    // CRÍTICO: Solo exportar términos ELIMINATE y MERGE, NO los KEEP
    const rows = terms
      .filter(term => {
        const action = term.finalAction || term.action;
        return action === 'ELIMINATE' || action === 'MERGE';
      })
      .map(term => {
        const action = term.finalAction || term.action;
        const replaceBy = action === 'MERGE' ? (term.mergeTarget || '') : '';
        
        return [term.term, replaceBy];
      });
    
    // Formato TXT con tabulación (tab-delimited) para VOSviewer
    const txtContent = [headers, ...rows]
      .map(row => row.join('\t'))
      .join('\n');

    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tesauro_validado.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getActionColor = (action) => {
    const colors = {
      KEEP: 'bg-green-100 text-green-800 border-green-300',
      ELIMINATE: 'bg-red-100 text-red-800 border-red-300',
      MERGE: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      EVALUATE: 'bg-blue-100 text-blue-800 border-blue-300',
      REVIEW: 'bg-gray-100 text-gray-800 border-gray-300'
    };
    return colors[action] || colors.REVIEW;
  };

  const getCategoryColor = (category) => {
    const colors = {
      CONCEPTUAL: 'bg-purple-100 text-purple-700',
      EMPIRICAL: 'bg-blue-100 text-blue-700',
      SPECIFIC: 'bg-green-100 text-green-700',
      'META-TERM': 'bg-orange-100 text-orange-700',
      EMPTY: 'bg-gray-100 text-gray-700',
      UNDETERMINED: 'bg-yellow-100 text-yellow-700'
    };
    return colors[category] || colors.UNDETERMINED;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                📚 Thesaurus Validator for Environmental Humanities
              </h1>
              <p className="text-gray-600">
                Interactive validation system for bibliometric term classification based on relevance scores
              </p>
            </div>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
              title="Information"
            >
              <Info className="w-6 h-6 text-blue-600" />
            </button>
          </div>
          
          {showInfo && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-gray-700">
              <p className="font-semibold mb-2">How to use:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Export term frequency and relevance from VOSviewer</li>
                <li>Upload the file (tab-separated format)</li>
                <li>Review automatic classifications and make decisions</li>
                <li>Export validated thesaurus as TXT (only ELIMINATE and MERGE terms)</li>
                <li>Import back into VOSviewer</li>
              </ol>
            </div>
          )}
        </div>

        {/* Upload Section */}
        {terms.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <Upload className="w-16 h-16 mx-auto text-blue-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Upload Frequency-Relevance File</h2>
            <p className="text-gray-600 mb-4">
              Expected format: tab-separated (id, term, occurrences, relevance score)
            </p>
            <input
              type="file"
              accept=".txt"
              onChange={handleFileUpload}
              className="block mx-auto px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500"
            />
            <div className="mt-6 text-left bg-gray-50 p-4 rounded-lg max-w-md mx-auto">
              <p className="text-sm font-semibold text-gray-700 mb-2">Example format:</p>
              <pre className="text-xs text-gray-600 overflow-x-auto">
id    term              occurrences    relevance score
1     anthropocene      94             0.4521
2     climate change    72             0.3419
              </pre>
            </div>
          </div>
        )}

        {/* Statistics Dashboard */}
        {terms.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <BarChart3 className="w-6 h-6" />
                Progress Overview
              </h2>
              <button
                onClick={exportThesaurus}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                <Download className="w-4 h-4" />
                Export Thesaurus TXT
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-700">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Terms</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-700">{stats.validated}</div>
                <div className="text-sm text-gray-600">Validated</div>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-emerald-700">{stats.actions.keep}</div>
                <div className="text-sm text-gray-600">Keep</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-yellow-700">{stats.actions.merge}</div>
                <div className="text-sm text-gray-600">Merge</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-red-700">{stats.actions.eliminate}</div>
                <div className="text-sm text-gray-600">Eliminate</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${stats.total > 0 ? (stats.validated / stats.total) * 100 : 0}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2 text-center">
                {stats.total > 0 ? ((stats.validated / stats.total) * 100).toFixed(1) : 0}% Complete
              </p>
            </div>
          </div>
        )}

        {/* Term Validation */}
        {terms.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                Batch {currentBatch + 1} of {totalBatches}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentBatch(Math.max(0, currentBatch - 1))}
                  disabled={currentBatch === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </button>
                <button
                  onClick={() => setCurrentBatch(Math.min(totalBatches - 1, currentBatch + 1))}
                  disabled={currentBatch === totalBatches - 1}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {currentTerms.map(term => (
                <div key={term.id} className="border rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {term.term}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(term.category)}`}>
                          {term.category}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getActionColor(term.action)}`}>
                          Suggested: {term.action}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          Confidence: {term.confidence}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Occurrences:</span> {term.occurrences} | 
                        <span className="font-medium ml-2">Relevance:</span> {term.relevance.toFixed(2)}
                      </div>
                      <p className="text-sm text-gray-500 mt-1 italic">{term.justification}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleDecision(term.id, 'KEEP')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                        term.validated && term.finalAction === 'KEEP'
                          ? 'bg-green-600 text-white'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Keep
                    </button>
                    
                    <div className="flex gap-2 flex-1 min-w-0">
                      <input
                        type="text"
                        placeholder="Target term for merge..."
                        value={mergeInputs[term.id] || ''}
                        onChange={(e) => handleMergeInputChange(term.id, e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-lg text-sm min-w-0"
                      />
                      <button
                        onClick={() => handleDecision(term.id, 'MERGE', mergeInputs[term.id])}
                        disabled={!mergeInputs[term.id]}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition whitespace-nowrap ${
                          term.validated && term.finalAction === 'MERGE'
                            ? 'bg-yellow-600 text-white'
                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 disabled:opacity-50'
                        }`}
                      >
                        <GitMerge className="w-4 h-4" />
                        Merge
                      </button>
                    </div>
                    
                    <button
                      onClick={() => handleDecision(term.id, 'ELIMINATE')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                        term.validated && term.finalAction === 'ELIMINATE'
                          ? 'bg-red-600 text-white'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      <XCircle className="w-4 h-4" />
                      Eliminate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Based on Van Eck & Waltman (2010) methodology for VOSviewer</p>
          <p className="mt-1">Environmental Humanities Research Project</p>
        </div>
      </div>
    </div>
  );
}

export default App;
