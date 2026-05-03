# BuffBook Project Instructions

## Project Overview
BuffBook is a comprehensive, science-based guide to muscle hypertrophy and resistance training. It is built as a static site using Jekyll and the `just-the-docs` theme. The project is primarily composed of Markdown files organized into chapters.

## Core Constraints
- **Immutable Content:** Existing educational content must not be modified for any reason unless explicitly directed by the user. Do not "fix" or rephrase the scientific text.

## Technical Stack
- **Static Site Generator:** Jekyll
- **Theme:** `just-the-docs` (Remote theme)
- **Content Format:** Markdown with YAML front matter
- **Dependencies:** Managed via `Gemfile` (Ruby)

## Directory Structure
- `_config.yml`: Jekyll configuration file.
- `index.md`: The homepage and main entry point.
- `introduction/`: Files covering the basics and industry overview.
- `chapter[1-6]/`: Hierarchical folders containing the book's core content.
    - `[X].md`: Main chapter file (e.g., `1.md`).
    - `[X.Y]-[topic].md`: Sub-section files (e.g., `1.1-mechanotransduction.md`).
    - `summary-references.md`: Chapter-specific references and summaries.
- `Glossary.md`: Definitions of terms.
- `README.md`: High-level project description.

## Content Conventions

### Front Matter
Every Markdown file must include YAML front matter.
- **Main Chapter Files:**
  ```yaml
  ---
  layout: default
  title: "Chapter X: Title"
  nav_order: [number]
  has_children: true
  ---
  ```
- **Sub-section Files:**
  ```yaml
  ---
  layout: default
  title: "X.Y Sub-section Title"
  parent: "Chapter X: Title"
  nav_order: [number]
  ---
  ```
  Note: The `parent` must exactly match the `title` of the parent page.

### Formatting & Style
- **Heading Styles:** Use standard Markdown `#` for titles and `##`, `###` for sections.
- **Special Classes:** Utilize `just-the-docs` CSS classes for styling:
    - `{: .fs-9 }`: Large font size for main headers.
    - `{: .fs-6 .fw-300 }`: Sub-header styling.
    - `{: .note }`: Styling for blockquotes or callouts.
- **References:** Cite peer-reviewed research. Use numbered brackets (e.g., `[1]`) and list full references in the `summary-references.md` file of each chapter.

## Building and Running
To preview the site locally, you typically need Ruby and Jekyll installed.
- **Install dependencies:** `bundle install`
- **Run local server:** `bundle exec jekyll serve`
- **Build site:** `bundle exec jekyll build`

## Development Workflow
1.  **Adding Content:** Create a new Markdown file in the appropriate chapter directory.
2.  **Updating Navigation:** Ensure `nav_order` and `parent` / `has_children` fields are correctly set to maintain the hierarchy.
3.  **Cross-linking:** Use relative URLs for internal links: `[Link Text]({{ "/path/to/file" | relative_url }})`.
