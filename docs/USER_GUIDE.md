# User Guide - Thesaurus Validator

Complete guide for using the Thesaurus Validator system for bibliometric term curation in Environmental Humanities research.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Data Preparation](#data-preparation)
4. [Step-by-Step Workflow](#step-by-step-workflow)
5. [Understanding Classifications](#understanding-classifications)
6. [Making Validation Decisions](#making-validation-decisions)
7. [Exporting Results](#exporting-results)
8. [Troubleshooting](#troubleshooting)
9. [Best Practices](#best-practices)
10. [FAQ](#faq)

---

## Introduction

### What is Thesaurus Validator?

Thesaurus Validator is an interactive web tool designed to help researchers validate and curate term lists extracted from bibliometric analyses. It's specifically optimized for Environmental Humanities research but can be adapted to other fields.

### Why Use It?

When performing bibliometric mapping with VOSviewer, you often get hundreds of terms that need manual curation. This tool:

- **Saves time**: Automatic classification reduces manual work by 60-70%
- **Improves consistency**: Standardized criteria ensure reproducible decisions
- **Enhances quality**: Systematic review catches errors and inconsistencies
- **Facilitates documentation**: Every decision is tracked with justification

### Who Is It For?

- Bibliometric researchers
- Systematic literature reviewers
- Librarians conducting knowledge mapping
- Graduate students in scientometrics
- Interdisciplinary research teams

---

## Installation

### Requirements

- **Node.js** 16 or higher ([download here](https://nodejs.org/))
- **npm** (included with Node.js)
- Modern web browser (Chrome, Firefox, Safari, Edge)
- At least 4GB RAM
- 200MB free disk space

### Installation Steps

#### Option 1: Using Git (Recommended)
```bash
# Clone the repository
git clone https://github.com/yourusername/thesaurus-validator-eh.git

# Navigate to directory
cd thesaurus-validator-eh

# Install dependencies
npm install

# Start the application
npm start
```

#### Option 2: Download ZIP

1. Download ZIP from GitHub repository
2. Extract to desired location
3. Open terminal in extracted folder
4. Run: `npm install`
5. Run: `npm start`

### Verify Installation

After running `npm start`, you should see:
```
Compiled successfully!

You can now view thesaurus-validator-eh in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.1.X:3000
```

Open `http://localhost:3000` in your browser.

---

## Data Preparation

### Export from VOSviewer

#### Step 1: Create Term Map in VOSviewer

1. Open VOSviewer
2. **File → Create Map from Bibliographic Data**
3. Choose your data source (Web of Science, Scopus, etc.)
4. Select **"Create map based on text data"**
5. Choose **"Title and abstract fields"**
6. Select **"Binary counting"** method
7. Set minimum occurrences (e.g., 10)

#### Step 2: Export Relevance Scores

1. After map is created, go to **File → Export**
2. Select **"Save term relevance scores"**
3. Save as `ha_fr_u10.txt` (or similar name)
4. This creates a tab-delimited file

### Expected File Format

Your exported file should look like this:
```
id    term                    occurrences    relevance score
1     anthropocene            94             2.4521
2     climate change          72             1.8419
3     sustainability          65             1.6234
4     education               58             0.9012
5     environmental justice   45             2.1234
6     biodiversity            42             1.5678
7     analysis                38             0.2145
8     study                   35             0.1523
...
```

#### Column Descriptions

- **id**: Sequential number (not used by validator)
- **term**: The keyword or phrase
- **occurrences**: Number of documents containing this term
- **relevance score**: VOSviewer's specificity metric (0-∞)

### File Quality Checks

Before uploading, verify:

- [ ] File is tab-delimited (not comma-delimited)
- [ ] Header row is present
- [ ] No empty rows
- [ ] Terms are lowercase
- [ ] No special characters causing encoding issues

### Common Issues

**Problem**: File won't upload
- **Solution**: Save as UTF-8 encoded text file

**Problem**: Occurrences column shows wrong values
- **Solution**: Ensure proper tab separation, not spaces

**Problem**: Relevance scores look wrong
- **Solution**: Use "term relevance" export, not "term occurrences"

---

## Step-by-Step Workflow

### Phase 1: Upload and Initial Classification

#### 1. Start the Application
```bash
npm start
```

Browser opens at `http://localhost:3000`

#### 2. Upload Your File

- Click **"Select File"** button
- Navigate to your exported VOSviewer file
- Select file (e.g., `ha_fr_u10.txt`)
- Click **"Open"**

#### 3. Review Auto-Classification Summary

After upload, you'll see:
```
✓ File uploaded successfully
📊 275 terms classified

Distribution:
- CONCEPTUAL: 89 terms (32%)
- EMPIRICAL: 34 terms (12%)
- META-TERM: 45 terms (16%)
- EMPTY: 67 terms (24%)
- REDUNDANT: 18 terms (7%)
- UNDETERMINED: 22 terms (8%)
```

**What This Means:**

- **32% conceptual terms**: Core theoretical vocabulary (likely keep)
- **24% empty terms**: Generic words (likely eliminate)
- **16% meta-terms**: Methodological language (needs review)
- **8% undetermined**: Requires your expert judgment

#### 4. Click "Start Validation"

This loads the first batch of 20 terms for review.

---

### Phase 2: Manual Validation

#### Understanding the Validation Interface

Each term card shows:
```
┌─────────────────────────────────────────────┐
│ 🏷️ anthropocene                            │
│                                             │
│ 📊 Occurrences: 94                          │
│ ⭐ Relevance: 2.45                          │
│                                             │
│ 🤖 Auto-Classification:                     │
│    CONCEPTUAL (HIGH confidence)             │
│                                             │
│ 💡 Suggested Action: KEEP                   │
│    Reason: High relevance + Protected term  │
│                                             │
│ 👤 Your Decision:                           │
│    ○ Keep   ○ Merge   ○ Eliminate          │
│                                             │
│ [Next →]                                    │
└─────────────────────────────────────────────┘
```

#### Decision Process for Each Term

**1. Read the term**
- Is it relevant to your research question?
- Is it specific enough to be useful?
- Does it represent a distinct concept?

**2. Check occurrence and relevance**
- High occurrences (>50) = central concept
- High relevance (>1.5) = specific to corpus
- Both low = probably eliminate

**3. Consider auto-classification**
- HIGH confidence = system is usually right
- MEDIUM confidence = review carefully
- LOW confidence = use your expertise

**4. Make your decision** (see next section)

---

### Phase 3: Making Validation Decisions

#### Decision Type 1: KEEP

**When to Keep:**
- Term represents a distinct, important concept
- High relevance score (>1.5)
- Frequent occurrence (>50)
- Protected EH keyword
- Specific to your research domain

**Examples of Terms to Keep:**
```
✓ anthropocene (conceptual framework)
✓ climate change (core phenomenon)
✓ environmental justice (key concept)
✓ multispecies (theoretical approach)
✓ conservation (practice/field)
✓ biodiversity (empirical object)
```

**How to Keep:**
1. Select **"Keep"** radio button
2. Click **"Next"**
3. Term is marked for retention

---

#### Decision Type 2: MERGE

**When to Merge:**
- Term is synonym of another term
- Same concept, different wording
- Singular/plural variations
- Abbreviations vs full terms
- Regional spelling differences

**Examples of Terms to Merge:**
```
climate crisis → climate change
eco-criticism → ecocriticism
non-human → nonhuman
bio-diversity → biodiversity
sustainability development → sustainable development
environmental education → education environmental (order variation)
```

**How to Merge:**
1. Select **"Merge"** radio button
2. **Enter target term** in text field (the term you want to keep)
3. Click **"Next"**

**⚠️ Important Merge Guidelines:**

- Target term must exist in your corpus
- Use the most common/standard form
- Check spelling carefully
- Consider which form is more widely used in literature

**Example Merge Process:**
```
Term: "climate crisis"
Your decision: MERGE
Target term: "climate change"
Result: All occurrences of "climate crisis" will 
        redirect to "climate change" in final map
```

---

#### Decision Type 3: ELIMINATE

**When to Eliminate:**
- Generic methodological terms
- Too broad to be useful
- Low relevance (<0.3) and low occurrences (<20)
- Stopwords (study, analysis, paper, etc.)
- Irrelevant to research question

**Examples of Terms to Eliminate:**
```
✗ study (meta-term)
✗ analysis (meta-term)
✗ paper (meta-term)
✗ approach (too generic)
✗ result (methodological)
✗ author (not content-related)
✗ thing (empty term)
```

**How to Eliminate:**
1. Select **"Eliminate"** radio button
2. Click **"Next"**
3. Term is marked for removal

---

### Phase 4: Batch Processing

#### Progress Tracking

As you validate terms, you'll see:
```
Progress: 40/275 terms validated (15%)
Current Batch: 20/20 completed

[Load Next Batch →]
```

#### Statistics Dashboard

Real-time updates:
```
📊 Validation Statistics

✓ Kept: 85 terms (31%)
🔀 Merged: 12 terms (4%)
✗ Eliminated: 43 terms (16%)
⏳ Pending: 135 terms (49%)
```

#### Batch Management

- Review 20 terms at a time
- Can go back to previous batch
- Can skip difficult terms (mark as "Review Later")
- Progress is saved in browser

---

### Phase 5: Review Mode

#### Before Final Export

After validating all terms:

1. Click **"Review Decisions"**
2. See complete list of your choices
3. Filter by decision type (Keep/Merge/Eliminate)
4. Modify any decision if needed

#### Review Interface
```
┌─────────────────────────────────────────────┐
│ Filter: [All ▼] [Keep] [Merge] [Eliminate]│
│                                             │
│ 🔍 Search: [____________]                  │
│                                             │
│ Results: 275 terms                          │
│ ────────────────────────────────────────────│
│                                             │
│ ✓ anthropocene (KEEP)                       │
│   Occurrences: 94, Relevance: 2.45         │
│   [Edit]                                    │
│                                             │
│ 🔀 climate crisis → climate change (MERGE) │
│   Occurrences: 23, Relevance: 1.89         │
│   [Edit]                                    │
│                                             │
│ ✗ study (ELIMINATE)                         │
│   Occurrences: 31, Relevance: 0.18         │
│   [Edit]                                    │
│                                             │
└─────────────────────────────────────────────┘
```

#### Editing Decisions

1. Click **[Edit]** on any term
2. Change decision if needed
3. Click **[Save]**
4. Return to review list

---

### Phase 6: Export Validated Thesaurus

#### Generate Export File

1. Click **"Export Thesaurus"** button
2. File `tesauro_validado.csv` downloads automatically
3. File is saved to your Downloads folder

#### Export File Format

The exported CSV has this structure:
```csv
label,replace_by,action,justification
anthropocene,,keep,CONCEPTUAL - occurrences: 94, relevance: 2.45
climate crisis,climate change,merge,Merged with climate change
study,,eliminate,META-TERM - occurrences: 31, relevance: 0.18
sustainability,,keep,CONCEPTUAL - occurrences: 65, relevance: 1.62
analysis,,eliminate,Generic meta-term
environmental justice,,keep,Protected EH keyword - occurrences: 45, relevance: 2.12
```

#### Column Descriptions

- **label**: Original term from VOSviewer
- **replace_by**: Target term (only for merges)
- **action**: keep, merge, or eliminate
- **justification**: Reason for decision (for documentation)

---

## Exporting Results

### Import into VOSviewer

#### Step 1: Prepare Thesaurus File

Your exported `tesauro_validado.csv` is ready to use.

#### Step 2: Import in VOSviewer

1. Open VOSviewer
2. **File → Create Map** (using your original data)
3. Before clicking "Finish", click **"Thesaurus file..."**
4. Select your `tesauro_validado.csv` file
5. Click **"Open"**
6. Click **"Finish"** to generate map

#### Step 3: Verify Results

VOSviewer will:
- Eliminate terms marked for removal
- Merge redirected terms
- Keep validated terms
- Generate cleaner map

### Alternative Exports

#### Export as JSON

For programmatic use:
```javascript
// Click "Export as JSON"
// Downloads: tesauro_validado.json

{
  "metadata": {
    "total_terms": 275,
    "kept": 163,
    "merged": 23,
    "eliminated": 89,
    "export_date": "2025-10-18"
  },
  "decisions": [
    {
      "term": "anthropocene",
      "action": "keep",
      "category": "CONCEPTUAL",
      "occurrences": 94,
      "relevance": 2.45
    },
    ...
  ]
}
```

#### Export Statistics Report
```
Validation Summary Report
Generated: 2025-10-18 14:35:22

Original Corpus: 275 terms
Final Thesaurus: 186 terms (67.6% retained)

Decisions:
- Kept: 163 terms (59.3%)
- Merged: 23 terms (8.4%)
- Eliminated: 89 terms (32.4%)

By Category:
- CONCEPTUAL: 89 kept, 3 merged, 2 eliminated
- EMPIRICAL: 34 kept, 1 merged, 0 eliminated
- META-TERM: 12 kept, 5 merged, 28 eliminated
- EMPTY: 0 kept, 0 merged, 67 eliminated
- REDUNDANT: 0 kept, 18 merged, 0 eliminated
- UNDETERMINED: 28 kept, 2 merged, 2 eliminated
```

---

## Understanding Classifications

### Category Definitions

#### CONCEPTUAL
**Theoretical or analytical terms central to the field**

- Abstract concepts
- Theoretical frameworks
- Disciplinary paradigms
- Analytical categories

Examples: `anthropocene`, `sustainability`, `environmental justice`, `posthuman`

**Typical Action:** KEEP

---

#### EMPIRICAL
**Concrete entities, objects, or phenomena**

- Physical objects
- Biological entities
- Geographic locations
- Specific practices

Examples: `biodiversity`, `species`, `habitat`, `conservation area`, `renewable energy`

**Typical Action:** KEEP

---

#### META-TERM
**Methodological or structural language**

- Research methods
- Document structure terms
- Generic academic language
- Procedural terminology

Examples: `study`, `analysis`, `approach`, `framework`, `method`, `result`

**Typical Action:** EVALUATE (often eliminate, sometimes keep if specific)

---

#### EMPTY
**Generic, irrelevant, or non-substantive terms**

- Common stopwords
- Overly generic terms
- Non-content words
- Low information value

Examples: `thing`, `way`, `kind`, `type`, `case`, `part`, `number`

**Typical Action:** ELIMINATE

---

#### REDUNDANT
**Terms with overlapping meaning**

- Synonyms
- Spelling variants
- Singular/plural forms
- Abbreviations

Examples: 
- `climate crisis` / `climate change`
- `bio-diversity` / `biodiversity`
- `eco criticism` / `ecocriticism`

**Typical Action:** MERGE

---

#### UNDETERMINED
**Ambiguous cases requiring expert judgment**

- Context-dependent terms
- Borderline relevance
- Conflicting criteria
- Domain-specific edge cases

Examples depend on your specific corpus and research question

**Typical Action:** REVIEW carefully based on your expertise

---

### Confidence Levels Explained

#### HIGH Confidence
- Multiple classification criteria agree
- Clear-cut case
- Protected keyword matched
- Extreme values (very high or very low relevance/occurrences)

**Recommendation:** Trust the suggestion unless you have strong domain knowledge suggesting otherwise

#### MEDIUM Confidence
- Single strong criterion met
- Moderate values
- Some ambiguity

**Recommendation:** Review suggestion carefully, consider context

#### LOW Confidence
- Conflicting criteria
- Borderline values
- Undetermined category
- No clear classification rule applies

**Recommendation:** Rely entirely on your domain expertise

---

## Troubleshooting

### Upload Issues

**Problem:** File won't upload

**Solutions:**
1. Check file format (must be .txt, tab-delimited)
2. Ensure UTF-8 encoding
3. Verify header row is present
4. Try smaller file (<5000 terms)
5. Remove special characters from file path

---

**Problem:** "Parse error" message

**Solutions:**
1. Open file in text editor
2. Check for proper tab separation (not spaces or commas)
3. Ensure no empty rows
4. Verify four columns: id, term, occurrences, relevance
5. Re-export from VOSviewer if corrupted

---

### Classification Issues

**Problem:** Too many terms classified as UNDETERMINED

**Possible causes:**
- Unusual corpus (not typical academic text)
- Relevance scores in unexpected range
- Specialized terminology not in protected keywords list

**Solutions:**
1. Review a sample manually
2. Adjust thresholds if needed (contact developers)
3. Rely more on manual judgment
4. Add domain-specific keywords to protected list

---

**Problem:** Obviously important terms marked for elimination

**Solution:**
- Override the suggestion (that's why manual review exists!)
- Consider adding to protected keywords list for future use
- Check if term is misspelled or hyphenated differently

---

### Performance Issues

**Problem:** Application slow with large files (>1000 terms)

**Solutions:**
1. Close other browser tabs
2. Use Chrome or Firefox (better performance)
3. Clear browser cache
4. Process in multiple sessions
5. Reduce batch size (edit configuration)

---

**Problem:** Browser crashes during validation

**Solutions:**
1. Split large file into smaller chunks
2. Increase browser memory limit
3. Use desktop app version if available
4. Contact support for server-based processing

---

### Export Issues

**Problem:** CSV file won't open in VOSviewer

**Solutions:**
1. Ensure file is saved as CSV (not Excel format)
2. Check comma separation (not semicolons)
3. Verify no special characters in terms
4. Try opening in text editor to inspect format
5. Re-export from validator

---

**Problem:** Merge targets not recognized by VOSviewer

**Solution:**
- Target term must exist in original corpus
- Check exact spelling (case-sensitive)
- Ensure no extra spaces
- Verify term wasn't already eliminated

---

## Best Practices

### Before You Start

1. **Define your research question clearly**
   - What aspects of EH are you mapping?
   - What level of specificity do you need?
   - What time period are you covering?

2. **Familiarize yourself with your corpus**
   - Browse terms in VOSviewer first
   - Understand frequency distribution
   - Note any unusual patterns

3. **Establish decision criteria**
   - What makes a term relevant to YOUR question?
   - What level of abstractness is appropriate?
   - How will you handle borderline cases?

4. **Plan your time**
   - Allow 2-5 seconds per term
   - For 300 terms: budget 15-25 minutes
   - Take breaks every 100 terms

---

### During Validation

1. **Be consistent**
   - Use same criteria throughout
   - Don't change standards midway
   - Document unusual decisions

2. **Trust the system for obvious cases**
   - HIGH confidence suggestions are usually right
   - Focus attention on MEDIUM and LOW confidence

3. **Take notes for edge cases**
   - Keep a separate note file
   - Document why you kept/eliminated borderline terms
   - Useful for methodology section

4. **Review in context**
   - Consider how term relates to others
   - Think about final map visualization
   - Anticipate term clusters

5. **Use domain expertise**
   - Override suggestions when needed
   - You know your field better than the algorithm
   - System is a tool, not a replacement for judgment

---

### After Validation

1. **Review statistics**
   - Do percentages make sense?
   - Are you keeping too many/few terms?
   - Compare to similar studies

2. **Spot-check decisions**
   - Randomly review 10-20 terms
   - Look for inconsistencies
   - Make corrections if needed

3. **Test in VOSviewer**
   - Import thesaurus
   - Generate map
   - Does it look reasonable?
   - Iterate if necessary

4. **Document your process**
   - Note any modifications to classification rules
   - Describe decision criteria in methods section
   - Report statistics in results

---

## FAQ

### General Questions

**Q: How long does validation take?**

A: For a typical corpus of 250-300 terms, expect 15-30 minutes. Highly specialized or ambiguous corpora may take longer.

---

**Q: Can multiple people validate the same corpus?**

A: Yes, but decisions are stored locally in browser. For collaborative validation:
1. Export decisions after each session
2. Merge manually, or
3. Use server-based version (contact developers)

---

**Q: Can I save my progress and continue later?**

A: Yes! Decisions are automatically saved in your browser. Don't clear browser data or use incognito mode.

---

**Q: What if I disagree with the auto-classification?**

A: **Always override it!** The auto-classification is a suggestion based on heuristics. Your domain expertise is more important.

---

### Technical Questions

**Q: Which browsers are supported?**

A: Chrome, Firefox, Safari, and Edge. Chrome recommended for best performance.

---

**Q: Can I run this offline?**

A: Yes, after installation. All processing is local (no internet required).

---

**Q: Can I modify the classification algorithm?**

A: Yes! The code is open-source. Edit `src/utils/classifier.js` to adjust:
- Relevance thresholds
- Protected keywords list
- Confidence calculation
- Stopwords

---

**Q: Can I use this for non-English corpora?**

A: Yes, but:
- Protected keywords list is English-focused (customize it)
- Stopwords are English (add your language)
- UTF-8 encoding ensures special characters work

---

### Methodological Questions

**Q: Should I always follow the suggested action?**

A: No. Suggestions are based on general heuristics. Use your domain knowledge to make final decisions.

---

**Q: How do I handle discipline-specific terms?**

A: Add them to the protected keywords list in the code, or simply override suggestions during validation.

---

**Q: What if a term is important but has low relevance?**

A: Keep it! Low relevance might mean it's common across many fields, but still important to yours. Example: "education" in Environmental Education research.

---

**Q: Should I merge singular/plural forms?**

A: Generally yes, merge to the more common form. VOSviewer treats them as separate by default.

---

**Q: How specific should terms be?**

A: Depends on your research question:
- Broad overview: Keep more general terms
- Specific niche: Keep only highly specific terms
- Theoretical mapping: Favor conceptual terms
- Empirical mapping: Favor concrete entities

---

## Contact and Support

### Getting Help

- **Issues**: https://github.com/yourusername/thesaurus-validator-eh/issues
- **Email**: your.email@example.com
- **Documentation**: https://github.com/yourusername/thesaurus-validator-eh/docs

### Contributing

Contributions welcome! See `CONTRIBUTING.md` for guidelines.

### Citation

If you use this tool, please cite it (see `CITATION.md`).

---

**Version**: 1.0.0  
**Last Updated**: October 18, 2025  
**Author**: [Your Name]

---

**Happy Validating! 📚🔍✨**