# Thesaurus Validator for Environmental Humanities
Interactive thesaurus validation for bibliometric mapping in Environmental Humanities

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![VOSviewer Compatible](https://img.shields.io/badge/VOSviewer-Compatible-green.svg)](https://www.vosviewer.com/)

Interactive web-based system for validating bibliometric thesauri with intelligent classification and manual review for Environmental Humanities research.

![Screenshot](docs/screenshot.png)

## 🎯 Features

- **Intelligent Auto-Classification**: Terms automatically categorized based on relevance score and occurrence frequency
- **Manual Validation Interface**: Review and override suggestions with confidence levels
- **Batch Processing**: Review 20 terms at a time with progress tracking
- **Real-time Statistics**: Monitor keep/merge/eliminate decisions
- **VOSviewer Integration**: Export validated thesaurus in VOSviewer-compatible CSV format
- **Protected Keywords**: Automatically identifies and protects important EH concepts
- **Decision Review**: Review and modify decisions before final export

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm

### Installation

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

The application will open at `http://localhost:3000`

## 📖 Usage

### Step 1: Prepare Your Data

Export term frequency and relevance data from VOSviewer:
```
File → Export → Save term relevance scores
```

Expected format (`ha_fr_u10.txt`):
```
id    term              occurrences    relevance score
1     anthropocene      94             0.4521
2     climate change    72             0.3419
...
```

### Step 2: Upload and Classify

1. Click "Select File" and choose your frequency-relevance file
2. System automatically classifies terms into categories:
   - **CONCEPTUAL**: Theoretical/analytical terms (keep)
   - **EMPIRICAL**: Concrete entities (keep)
   - **META-TERM**: Methodological language (evaluate)
   - **EMPTY**: Generic/irrelevant (eliminate)
   - **REDUNDANT**: Overlapping meaning (merge)

### Step 3: Validate Terms

Review each term with:
- Occurrence count and relevance score
- Automatic classification and confidence level
- Suggested action (KEEP/MERGE/ELIMINATE)

Make your decision:
- ✅ **Keep**: Maintain term in thesaurus
- 🔀 **Merge**: Combine with another term (enter target term)
- ❌ **Eliminate**: Remove from thesaurus

### Step 4: Export Validated Thesaurus

Click "Export Thesaurus" to download `tesauro_validado.csv`:

```csv
label,replace_by,action,justification
activity,,eliminate,META-TERM - occurrences: 31, relevance: 0.70
climate crisis,environmental crisis,merge,Merged with environmental crisis
anthropocene,,keep,CONCEPTUAL validated
```

Import this file into VOSviewer as a thesaurus file.

## 🧪 Classification Criteria

| Category | Condition | Action |
|----------|-----------|--------|
| EMPTY | relevance < 0.3 AND occurrences < 20 | ELIMINATE |
| EMPTY | term in stopwords list | ELIMINATE |
| CONCEPTUAL | relevance > 1.5 | KEEP |
| CONCEPTUAL | occurrences > 50 | KEEP |
| META-TERM | term in methodology_terms | EVALUATE |
| SPECIFIC | term contains EH_keywords | KEEP |

### Protected Keywords

Terms automatically suggested for keeping:
```
anthropocene, sustainability, ecology, biodiversity, ecocriticism,
nonhuman, posthuman, multispecies, landscape, heritage, conservation,
climate change, environmental justice, resilience
```

## 📊 Example Workflow

```mermaid
graph LR
    A[VOSviewer Export] --> B[Upload to Validator]
    B --> C[Auto-Classification]
    C --> D[Manual Review]
    D --> E[Export Thesaurus]
    E --> F[Import to VOSviewer]
    F --> G[Generate Clean Map]
```

## 🔬 Methodology

This tool implements the term selection methodology described in:

- **Van Eck, N.J., & Waltman, L. (2010).** Software survey: VOSviewer, a computer program for bibliometric mapping. *Scientometrics*, 84(2), 523-538.
- **Sinkovics, N. (2016).** Enhancing the foundations for theorising through bibliometric mapping. *International Marketing Review*, 33(3), 327-350.

The relevance score calculation follows VOSviewer's algorithm, which automatically identifies the most representative terms for a corpus.

## 📚 Documentation

- [User Guide](docs/USER_GUIDE.md) - Detailed usage instructions
- [Methodology](docs/METHODOLOGY.md) - Classification algorithm details
- [Citation Guide](docs/CITATION.md) - How to cite this tool

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

### Development Setup

```bash
npm install
npm start
npm test
```

## 📝 Citation

If you use this tool in your research, please cite:

```bibtex
@software{thesaurus_validator_2025,
  author = {Your Name},
  title = {Thesaurus Validator for Environmental Humanities},
  year = {2025},
  url = {https://github.com/yourusername/thesaurus-validator-eh},
  version = {1.0.0}
}
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Developed as part of a bibliometric mapping project on Environmental Humanities and Education for Sustainability
- Built with [React](https://reactjs.org/)
- Icons from [Lucide](https://lucide.dev/)
- Inspired by [VOSviewer](https://www.vosviewer.com/) methodology

## 📧 Contact

- **Author**: Ana Camila Alvira
- **Email**: aalvira@eafit.edu.co
- **Institution**: Universidad de Vechta
- **Project**: Environmental Humanities + Education for Sustainability

## 🔗 Related Projects

- [VOSviewer](https://www.vosviewer.com/) - Bibliometric mapping software
- [Bibliometrix](https://www.bibliometrix.org/) - R package for bibliometric analysis
- [CiteSpace](http://cluster.cis.drexel.edu/~cchen/citespace/) - Citation network visualization

---