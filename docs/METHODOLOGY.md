# Classification Methodology

## Overview

The Thesaurus Validator implements a rule-based classification system 
inspired by Van Eck & Waltman's (2010) relevance score methodology for 
VOSviewer, adapted specifically for Environmental Humanities research.

## Classification Algorithm

### Input Parameters
- `term`: The keyword to classify
- `occurrences`: Number of documents containing the term
- `relevance`: VOSviewer relevance score (0-∞, typical range 0-4)

### Decision Tree

```
IF term IN stopwords_list:
    category = "EMPTY"
    action = "ELIMINATE"
    confidence = "HIGH"

ELSE IF term IN protected_keywords:
    category = "CONCEPTUAL" 
    action = "KEEP"
    confidence = "HIGH"

ELSE IF relevance > 1.5:
    category = "SPECIFIC"
    action = "KEEP"
    confidence = "HIGH"

ELSE IF occurrences > 50:
    category = "CONCEPTUAL"
    action = "KEEP"
    confidence = "MEDIUM"

ELSE IF relevance < 0.3 AND occurrences < 20:
    category = "EMPTY"
    action = "ELIMINATE"
    confidence = "MEDIUM"

ELSE IF term IN methodology_terms:
    category = "META-TERM"
    action = "EVALUATE"
    confidence = "MEDIUM"

ELSE:
    category = "UNDETERMINED"
    action = "REVIEW"
    confidence = "LOW"
```

## Stopwords List

Generic methodological terms automatically marked for elimination:

```javascript
const stopwords = [
  'action', 'activity', 'addition', 'analysis', 'approach', 'area',
  'article', 'aspect', 'author', 'basis', 'case', 'concept',
  'condition', 'contribution', 'data', 'decade', 'effect', 'example',
  'field', 'focus', 'framework', 'idea', 'impact', 'issue', 'kind',
  'level', 'number', 'paper', 'part', 'point', 'practice', 'problem',
  'process', 'project', 'range', 'result', 'section', 'study', 'term',
  'thing', 'topic', 'type', 'use', 'way', 'year'
];
```

## Protected Keywords

Environmental Humanities-specific terms automatically protected:

```javascript
const protected_keywords = [
  // Theoretical concepts
  'anthropocene', 'posthuman', 'nonhuman', 'multispecies',
  'more-than-human', 'entanglement', 'assemblage',
  
  // Methodological approaches
  'ecocriticism', 'environmental humanities', 'environmental history',
  'political ecology', 'environmental justice',
  
  // Core concepts
  'sustainability', 'ecology', 'biodiversity', 'conservation',
  'climate change', 'landscape', 'heritage', 'resilience',
  'ecosystem', 'habitat', 'species'
];
```

## Relevance Score Interpretation

Based on Van Eck & Waltman (2010):

| Score Range | Interpretation | Typical Action |
|-------------|----------------|----------------|
| > 2.0 | Highly specific to corpus | Always keep |
| 1.5 - 2.0 | Very specific | Keep |
| 0.5 - 1.5 | Moderately specific | Evaluate context |
| 0.3 - 0.5 | Low specificity | Consider frequency |
| < 0.3 | Generic/common | Likely eliminate |

## Occurrence Threshold

- **High frequency** (>50): Central concepts, keep regardless of relevance
- **Medium frequency** (20-50): Evaluate based on relevance score
- **Low frequency** (<20): Require high relevance (>1.5) to keep

## Confidence Levels

- **HIGH**: Multiple criteria agree on classification
- **MEDIUM**: Single strong criterion, or two moderate criteria
- **LOW**: Indeterminate, requires manual judgment

## References

Van Eck, N.J., & Waltman, L. (2010). Software survey: VOSviewer, a computer 
program for bibliometric mapping. *Scientometrics*, 84(2), 523-538.

Sinkovics, N. (2016). Enhancing the foundations for theorising through 
bibliometric mapping. *International Marketing Review*, 33(3), 327-350.
```