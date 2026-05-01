# GEMINI.md - BuffBook Project Context

This directory contains the manuscript and supporting materials for **BuffBook**, a comprehensive, science-based guide to muscle hypertrophy and resistance training.

## Directory Overview

The project is a non-code, documentation-based repository. It consists of a series of Markdown files representing the chapters of a book, organized sequentially. The content bridges the gap between complex exercise physiology (mechanotransduction, mTORC1 signaling) and practical gym application (programming, exercise selection, and mesocycle design).

### Key Files

- **INDEX.md**: The master table of contents, outlining the structure of the entire book from the introduction through all six chapters.
- **Introduction.md**: Sets the stage, discussing the state of the fitness industry, defining hypertrophy (myofibrillar vs. sarcoplasmic), and establishing the "Hierarchy of Evidence" used throughout the text.
- **1.md (The Science of Size)**: Explores the biological mechanisms of growth, including the mechanotransduction pathway, mTORC1 regulation, ribosome biogenesis, and satellite cells.
- **2.md (True Drivers vs. Myths)**: Defines mechanical tension as the primary driver of growth, explains Henneman’s Size Principle and the Force-Velocity Curve, and debunks myths like metabolic stress and muscle damage.
- **3.md (The Specificity of Hypertrophy)**: Discusses regional hypertrophy, contraction types (eccentrics/concentrics), and the role of fiber types.
- **4.md (Exercise Selection & Equipment)**: Provides principles for choosing exercises based on stability, loadability, and joint actions.
- **5.md (Programming the Variables)**: Details the "levers" of training: volume, intensity (RIR/RPE), rep ranges, range of motion, frequency, and progressive overload.
- **6.md (From Plan to Practice)**: A practical guide to designing mesocycles, including a sample Upper/Lower split and strategies for handling plateaus and auto-regulation.
- **image.png**: A supporting visual for Chapter 1 (The Science of Size).

## Usage & Context

### Development Server
To run the project locally as a static website:
1. Install Bundler: `gem install bundler`
2. Install dependencies: `bundle install`
3. Start the Jekyll server: `bundle exec jekyll serve`
The site will be available at `http://localhost:4000`.

### Deployment
This project is configured for GitHub Pages using the `github-pages` gem. Ensure that your GitHub repository is set up to build and deploy from the `main` (or appropriate) branch using Jekyll.

When interacting with this codebase:

1.  **Scientific Accuracy**: Maintain the established tone of "evidence-based practice." References typically use PMID (PubMed ID) for verification.
2.  **Terminology**: Adhere to specific definitions used in the text (e.g., "Stimulating Reps," "Mechanical Tension" at the fiber level, "RIR - Reps in Reserve").
3.  **Structure**: Follow the existing chapter numbering and Markdown formatting conventions.
4.  **Target Audience**: The content is aimed at intermediate to advanced lifters and coaches who value scientific rigor over "bro-science" myths.

## Future Tasks / TODOs

- [ ] Cross-reference all citations with a central bibliography or link PMIDs to external sources.
- [ ] Add more illustrative diagrams (similar to `image.png`) to explain complex physiological concepts like the Force-Velocity Curve or the Length-Tension Relationship.
- [ ] Develop a "Quick Start" or "Glossary" file for easy reference of key terms.
