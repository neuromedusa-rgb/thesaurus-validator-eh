// src/utils/classifier.js

/**
 * Thesaurus Term Classifier
 * Implements rule-based classification for bibliometric term validation
 * Based on Van Eck & Waltman (2010) relevance score methodology
 */

// Stopwords: Generic methodological terms to eliminate
const STOPWORDS = [
  'action', 'activity', 'addition', 'analysis', 'approach', 'area',
  'article', 'aspect', 'author', 'basis', 'case', 'concept',
  'condition', 'contribution', 'data', 'decade', 'effect', 'example',
  'field', 'focus', 'framework', 'idea', 'impact', 'issue', 'kind',
  'level', 'number', 'paper', 'part', 'point', 'practice', 'problem',
  'process', 'project', 'range', 'result', 'section', 'study', 'term',
  'thing', 'topic', 'type', 'use', 'way', 'year'
];

// Protected keywords specific to Environmental Humanities
const PROTECTED_KEYWORDS = [
  // Theoretical concepts
  'anthropocene', 'posthuman', 'nonhuman', 'multispecies',
  'more-than-human', 'entanglement', 'assemblage',
  
  // Methodological approaches
  'ecocriticism', 'environmental humanities', 'environmental history',
  'political ecology', 'environmental justice',
  
  // Core concepts
  'sustainability', 'ecology', 'biodiversity', 'conservation',
  'climate change', 'landscape', 'heritage', 'resilience',
  'ecosystem', 'habitat', 'species', 'nature', 'environment',
  'extinction', 'restoration', 'wilderness', 'urban ecology'
];

// Methodological terms that require evaluation
const METHODOLOGY_TERMS = [
  'method', 'methodology', 'research', 'literature', 'review',
  'discussion', 'conclusion', 'introduction', 'finding', 'evidence'
];

/**
 * Classify a term based on occurrence and relevance
 * @param {string} term - The term to classify
 * @param {number} occurrences - Number of documents containing the term
 * @param {number} relevance - VOSviewer relevance score
 * @returns {Object} Classification result with category, action, confidence, and justification
 */
export function classifyTerm(term, occurrences, relevance) {
  const termLower = term.toLowerCase();
  
  // Rule 1: Check if term is in stopwords
  if (STOPWORDS.includes(termLower)) {
    return {
      category: 'EMPTY',
      action: 'ELIMINATE',
      confidence: 'HIGH',
      justification: 'Generic methodological term with low semantic value'
    };
  }
  
  // Rule 2: Check if term is in protected keywords
  if (PROTECTED_KEYWORDS.some(keyword => termLower.includes(keyword))) {
    return {
      category: 'CONCEPTUAL',
      action: 'KEEP',
      confidence: 'HIGH',
      justification: 'Core Environmental Humanities concept'
    };
  }
  
  // Rule 3: High relevance score (very specific to corpus)
  if (relevance > 1.5) {
    return {
      category: 'SPECIFIC',
      action: 'KEEP',
      confidence: 'HIGH',
      justification: `High relevance score (${relevance.toFixed(2)}) indicates corpus-specific term`
    };
  }
  
  // Rule 4: High frequency (central concept)
  if (occurrences > 50) {
    return {
      category: 'CONCEPTUAL',
      action: 'KEEP',
      confidence: 'MEDIUM',
      justification: `High frequency (${occurrences} occurrences) suggests central concept`
    };
  }
  
  // Rule 5: Low relevance AND low frequency (noise)
  if (relevance < 0.3 && occurrences < 20) {
    return {
      category: 'EMPTY',
      action: 'ELIMINATE',
      confidence: 'MEDIUM',
      justification: `Low relevance (${relevance.toFixed(2)}) and frequency (${occurrences}) indicates noise`
    };
  }
  
  // Rule 6: Check if term is methodological
  if (METHODOLOGY_TERMS.some(method => termLower.includes(method))) {
    return {
      category: 'META-TERM',
      action: 'EVALUATE',
      confidence: 'MEDIUM',
      justification: 'Methodological term requiring expert evaluation'
    };
  }
  
  // Rule 7: Moderate relevance, moderate frequency
  if (relevance >= 0.5 && occurrences >= 20) {
    return {
      category: 'EMPIRICAL',
      action: 'KEEP',
      confidence: 'MEDIUM',
      justification: `Moderate relevance (${relevance.toFixed(2)}) and frequency (${occurrences})`
    };
  }
  
  // Default: Undetermined, requires manual review
  return {
    category: 'UNDETERMINED',
    action: 'REVIEW',
    confidence: 'LOW',
    justification: `Ambiguous case: relevance=${relevance.toFixed(2)}, occurrences=${occurrences}`
  };
}

/**
 * Parse VOSviewer frequency-relevance file
 * Expected format: tab-separated with columns: id, term, occurrences, relevance score
 * @param {string} fileContent - Raw file content
 * @returns {Array} Array of parsed term objects
 */
export function parseFrequencyRelevanceFile(fileContent) {
  const lines = fileContent.trim().split('\n');
  
  // Skip header line
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

/**
 * Get statistics from classified terms
 * @param {Array} terms - Array of term objects
 * @returns {Object} Statistics object
 */
export function getStatistics(terms) {
  const total = terms.length;
  const validated = terms.filter(t => t.validated).length;
  
  const actionCounts = terms.reduce((acc, term) => {
    const action = term.finalAction || term.action;
    acc[action] = (acc[action] || 0) + 1;
    return acc;
  }, {});
  
  const categoryCounts = terms.reduce((acc, term) => {
    acc[term.category] = (acc[term.category] || 0) + 1;
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
      review: actionCounts.REVIEW || 0
    },
    categories: categoryCounts
  };
}

/**
 * Find potential merge candidates for a term
 * @param {string} term - The term to find matches for
 * @param {Array} allTerms - Array of all term objects
 * @returns {Array} Array of similar terms
 */
export function findMergeCandidates(term, allTerms) {
  const termLower = term.toLowerCase();
  const words = termLower.split(/\s+/);
  
  return allTerms
    .filter(t => {
      const tLower = t.term.toLowerCase();
      // Don't suggest the term itself
      if (tLower === termLower) return false;
      
      // Check if terms share significant words
      const tWords = tLower.split(/\s+/);
      const commonWords = words.filter(w => tWords.includes(w) && w.length > 3);
      
      return commonWords.length > 0;
    })
    .slice(0, 5); // Limit to 5 suggestions
}