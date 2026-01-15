# Test ID Strategy

## Overview

This document defines the data-testid strategy for E2E tests to ensure stable, maintainable test selectors.

## Naming Convention

- Use kebab-case: `data-testid="component-element-purpose"`
- Be descriptive but concise
- Group related elements with common prefixes

## Common Test IDs

### Navigation

- `data-testid="primary-nav"` - Primary navigation container
- `data-testid="nav-my-prison"` - My Prison nav link
- `data-testid="nav-sentence-journey"` - Sentence Journey nav link
- `data-testid="nav-news-events"` - News and Events nav link
- `data-testid="nav-learning-skills"` - Learning and Skills nav link
- `data-testid="nav-inspire-entertain"` - Inspire and Entertain nav link
- `data-testid="nav-health-wellbeing"` - Health and Wellbeing nav link
- `data-testid="nav-faith"` - Faith nav link

### Header/Top Bar

- `data-testid="top-bar"` - Top bar container
- `data-testid="site-logo"` - Content Hub logo
- `data-testid="site-title"` - Site title link
- `data-testid="search-input"` - Search input field
- `data-testid="search-button"` - Search submit button

### Footer

- `data-testid="footer"` - Footer container
- `data-testid="footer-privacy-link"` - Privacy policy link
- `data-testid="footer-browse-topics"` - Browse all topics section

### Page Navigation

- `data-testid="page-nav-home"` - Home link
- `data-testid="page-nav-back"` - Back button
- `data-testid="page-nav-forward"` - Forward button

### Content Elements

- `data-testid="page-heading"` - Main h1 page title
- `data-testid="content-card-{id}"` - Individual content card
- `data-testid="series-tiles-section"` - Series tiles container
- `data-testid="series-tile-{id}"` - Individual series tile
- `data-testid="series-tile-heading"` - Series tile heading
- `data-testid="series-tile-image"` - Series tile image
- `data-testid="series-tile-tag"` - Series tag/badge

### Feedback Widget (Already Implemented)

- `data-testid="feedback-widget"`
- `data-testid="feedback-like-button"`
- `data-testid="feedback-dislike-button"`
- `data-testid="feedback-form"`
- `data-testid="feedback-text"`
- `data-testid="feedback-confirmation"`
- `data-testid="feedback-more-info"`
- `data-testid="feedback-like-options"`
- `data-testid="feedback-dislike-options"`
- `data-testid="feedback-submit-button"`

### Search

- `data-testid="search-form"` - Search form container
- `data-testid="search-query-input"` - Search query input
- `data-testid="search-submit-button"` - Search submit button
- `data-testid="search-suggestions"` - Search autocomplete suggestions
- `data-testid="search-results"` - Search results container

### Content Types

- `data-testid="news-item-{id}"` - News items
- `data-testid="event-item-{id}"` - Event items
- `data-testid="featured-item-{id}"` - Featured content items

## Implementation Priority

1. ✅ Feedback widget (Complete)
2. 🔄 Navigation elements (In Progress)
3. 🔄 Common page elements (In Progress)
4. 📋 Content tiles and cards (Pending)
5. 📋 Search components (Pending)

## Benefits

- **Resilient**: Tests won't break when CSS classes change
- **Explicit**: Clear intent that elements are for testing
- **Fast**: `getByTestId()` is performant
- **Maintainable**: Easy to find and update test selectors
- **Consistent**: Standardized naming across all tests
