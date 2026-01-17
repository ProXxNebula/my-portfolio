<script lang="ts">
  import { page } from '$app/stores';
  import { onMount, onDestroy } from 'svelte';
  import MarkdownRenderer from '$lib/components/MarkdownRenderer.svelte';
  import { parseFrontmatter } from '$lib/utils/frontmatter';
  import { browser } from '$app/environment';

  $: slug = $page.params.slug;
  let homelab: any = null;

  let markdownContent = '';
  let loading = true;
  let contentExists = false;
  let tableOfContents: { id: string; text: string; level: number }[] = [];
  let activeSection = '';
  let showTableOfContents = false;
  let readingProgress = 0;
  let readingTime = 0;

  // Reader preferences
  let fontSize = 'normal';
  let focusMode = false;
  let showReaderControls = false;

  // Scroll handler reference for cleanup
  let scrollHandler: (() => void) | null = null;

  onMount(async () => {
    try {
      const response = await fetch(`/homelab-content/${slug}.md`);
      if (response.ok) {
        const rawMarkdown = await response.text();
        const parsed = parseFrontmatter(rawMarkdown);

        if (parsed) {
          homelab = { slug, ...parsed.frontmatter };
          markdownContent = parsed.content;
          contentExists = true;
          calculateReadingTime(parsed.content);
          generateTableOfContents(parsed.content);
          setupScrollListeners();
        } else {
          contentExists = false;
        }
      } else {
        contentExists = false;
      }
    } catch (error) {
      contentExists = false;
    }
    loading = false;

    // Load saved preferences
    if (browser) {
      const savedFontSize = localStorage.getItem('reader-font-size');
      if (savedFontSize) fontSize = savedFontSize;
    }
  });

  onDestroy(() => {
    if (browser && scrollHandler) {
      window.removeEventListener('scroll', scrollHandler);
    }
  });

  function calculateReadingTime(content: string) {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    readingTime = Math.ceil(wordCount / wordsPerMinute);
  }

  function generateTableOfContents(markdown: string) {
    const headings = markdown.match(/^#{2,3}\s+(.+)$/gm);
    if (headings) {
      tableOfContents = headings.map((heading, index) => {
        const level = heading.match(/^#+/)?.[0].length || 2;
        const text = heading.replace(/^#+\s+/, '');
        const id = `section-${index}`;
        return { id, text, level };
      });
    }
  }

  function setupScrollListeners() {
    scrollHandler = () => {
      // Calculate reading progress
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      readingProgress = Math.min((scrollTop / (documentHeight - windowHeight)) * 100, 100);

      // Update active section
      const headings = document.querySelectorAll('.markdown-content h2, .markdown-content h3');
      let currentSection = '';

      headings.forEach((heading, index) => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 150) {
          currentSection = `section-${index}`;
        }
      });

      activeSection = currentSection;
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });
  }

  function scrollToSection(id: string) {
    const index = parseInt(id.replace('section-', ''));
    const headings = document.querySelectorAll('.markdown-content h2, .markdown-content h3');
    const target = headings[index];
    if (target) {
      const offset = 100;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      showTableOfContents = false;
      if (browser) {
        history.pushState(null, '', `#${id}`);
      }
    }
  }

  function copyLinkToSection(id: string) {
    if (browser) {
      const url = `${window.location.origin}${window.location.pathname}#${id}`;
      navigator.clipboard.writeText(url);
    }
  }

  function toggleTableOfContents() {
    showTableOfContents = !showTableOfContents;
  }

  function setFontSize(size: string) {
    fontSize = size;
    if (browser) {
      localStorage.setItem('reader-font-size', size);
    }
  }

  function toggleFocusMode() {
    focusMode = !focusMode;
  }

  function getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'beginner': return 'var(--color-success)';
      case 'intermediate': return '#f59e0b';
      case 'advanced': return 'var(--color-error)';
      default: return 'var(--color-accent-primary)';
    }
  }

  function getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      'networking': '🌐',
      'virtualization': '💻',
      'security': '🔒',
      'storage': '💾',
      'automation': '⚙️',
      'monitoring': '📊'
    };
    return icons[category.toLowerCase()] || '🖥️';
  }
</script>

<svelte:head>
  <title>{homelab?.title || 'Homelab'} - Portfolio</title>
  <meta name="description" content={homelab?.description || 'Homelab Documentation'} />
</svelte:head>

{#if homelab}
  <main class="homelab-detail" class:focus-mode={focusMode} class:font-small={fontSize === 'small'} class:font-large={fontSize === 'large'}>
    <!-- Sticky Back Navigation -->
    <div class="sticky-back-nav">
      <a href="/homelab" class="back-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        <span>Homelab</span>
      </a>
    </div>

    <!-- Header Section -->
    <header class="homelab-header">
      <div class="container">
        <div class="header-content">
          <div class="header-meta">
            <span class="category-badge">
              <span class="category-icon">{getCategoryIcon(homelab.category)}</span>
              {homelab.category}
            </span>
            <span class="difficulty-badge" style="--difficulty-color: {getDifficultyColor(homelab.difficulty)}">
              {homelab.difficulty}
            </span>
            <span class="reading-time-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              {readingTime} min read
            </span>
          </div>

          <h1 class="homelab-title">{homelab.title}</h1>
          <p class="homelab-description">{homelab.description}</p>

          <!-- Hardware Info Callout -->
          <div class="info-callout">
            <div class="callout-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
            </div>
            <div class="callout-content">
              <span class="callout-label">Hardware</span>
              <span class="callout-value">{homelab.hardware}</span>
            </div>
          </div>

          <div class="header-footer">
            <div class="services-tags">
              {#each homelab.services as service}
                <span class="service-tag">{service}</span>
              {/each}
            </div>
            <div class="date-info">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              {new Date(homelab.publishedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </div>
      </div>
    </header>

    {#if loading}
      <div class="loading-container">
        <div class="spinner"></div>
        <p>Loading documentation...</p>
      </div>
    {:else if !contentExists}
      <div class="no-content">
        <div class="container">
          <div class="no-content-card">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <h2>Documentation Coming Soon</h2>
            <p>The detailed documentation for this homelab setup is currently being prepared.</p>
          </div>
        </div>
      </div>
    {:else}
      <!-- Content Section with Sidebar -->
      <div class="content-wrapper">
        <div class="container">
          <div class="content-grid">
            <!-- Table of Contents Sidebar -->
            <aside class="toc-sidebar" class:show={showTableOfContents}>
              <div class="toc-header">
                <h3>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="8" y1="6" x2="21" y2="6"></line>
                    <line x1="8" y1="12" x2="21" y2="12"></line>
                    <line x1="8" y1="18" x2="21" y2="18"></line>
                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                  </svg>
                  Contents
                </h3>
                <button class="toc-close" on:click={toggleTableOfContents} aria-label="Close table of contents">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <!-- Progress in TOC -->
              <div class="toc-progress">
                <span class="toc-progress-text">{Math.round(readingProgress)}% read</span>
              </div>

              <nav class="toc-nav">
                {#each tableOfContents as item}
                  <div class="toc-item-wrapper">
                    <button
                      class="toc-item level-{item.level}"
                      class:active={activeSection === item.id}
                      on:click={() => scrollToSection(item.id)}
                    >
                      <span class="toc-indicator"></span>
                      <span class="toc-text">{item.text}</span>
                    </button>
                    <button
                      class="toc-copy-link"
                      on:click={() => copyLinkToSection(item.id)}
                      aria-label="Copy link to section"
                      title="Copy link"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                      </svg>
                    </button>
                  </div>
                {/each}
              </nav>

              <!-- Quick Links Section -->
              {#if homelab.relatedWriteups && homelab.relatedWriteups.length > 0}
                <div class="toc-related">
                  <h4>Related Writeups</h4>
                  {#each homelab.relatedWriteups as writeup}
                    <a href="/writeups/{writeup.slug}" class="related-link">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                      {writeup.title}
                    </a>
                  {/each}
                </div>
              {/if}
            </aside>

            <!-- Main Content -->
            <article class="content-main">
              <MarkdownRenderer content={markdownContent} />

              <!-- Tags Footer -->
              <footer class="content-footer">
                <div class="footer-tags">
                  {#each homelab.tags as tag}
                    <span class="tag">#{tag}</span>
                  {/each}
                </div>
              </footer>
            </article>
          </div>
        </div>
      </div>

      <!-- Reader Controls (Floating) -->
      <div class="reader-controls" class:expanded={showReaderControls}>
        <button
          class="reader-controls-toggle"
          on:click={() => showReaderControls = !showReaderControls}
          aria-label="Toggle reader controls"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </button>

        {#if showReaderControls}
          <div class="reader-controls-panel">
            <!-- Font Size Controls -->
            <div class="control-group">
              <span class="control-label">Font Size</span>
              <div class="font-size-controls">
                <button
                  class="font-btn"
                  class:active={fontSize === 'small'}
                  on:click={() => setFontSize('small')}
                  aria-label="Small font"
                >A-</button>
                <button
                  class="font-btn"
                  class:active={fontSize === 'normal'}
                  on:click={() => setFontSize('normal')}
                  aria-label="Normal font"
                >A</button>
                <button
                  class="font-btn"
                  class:active={fontSize === 'large'}
                  on:click={() => setFontSize('large')}
                  aria-label="Large font"
                >A+</button>
              </div>
            </div>

            <!-- Focus Mode Toggle -->
            <div class="control-group">
              <span class="control-label">Focus Mode</span>
              <button
                class="focus-toggle"
                class:active={focusMode}
                on:click={toggleFocusMode}
                aria-label="Toggle focus mode"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                {focusMode ? 'On' : 'Off'}
              </button>
            </div>
          </div>
        {/if}
      </div>

      <!-- Floating TOC Button (Mobile) -->
      <button class="floating-toc-btn" on:click={toggleTableOfContents} aria-label="Toggle table of contents">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
      </button>
    {/if}

    <!-- Footer Navigation -->
    <div class="homelab-footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-meta">
            <span class="completion-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              You've reached the end
            </span>
          </div>
          <a href="/homelab" class="footer-cta">
            <span>View All Homelab</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </main>
{:else if !loading}
  <div class="error-state">
    <div class="container">
      <h1>Homelab Not Found</h1>
      <p>The homelab documentation you're looking for doesn't exist.</p>
      <a href="/homelab" class="btn btn-primary">Back to Homelab</a>
    </div>
  </div>
{/if}

<style>
  .homelab-detail {
    min-height: 100vh;
    padding-top: 73px;
  }

  /* Sticky Back Navigation */
  .sticky-back-nav {
    position: fixed;
    top: 85px;
    left: 2rem;
    z-index: 80;
  }

  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1rem;
    background: var(--color-bg-elevated);
    border: 1px solid var(--color-border-default);
    border-radius: var(--radius-md);
    color: var(--color-text-secondary);
    text-decoration: none;
    font-family: var(--font-mono);
    font-size: 0.85rem;
    font-weight: 500;
    box-shadow: var(--shadow-md);
    transition: all var(--transition-base);
  }

  .back-btn:hover {
    border-color: var(--color-accent-primary);
    color: var(--color-accent-primary-light);
    transform: translateX(-4px);
  }

  /* Focus mode dims non-content areas */
  .homelab-detail.focus-mode .toc-sidebar {
    opacity: 0.4;
  }

  .homelab-detail.focus-mode .toc-sidebar:hover {
    opacity: 1;
  }

  .homelab-detail.focus-mode .homelab-header {
    opacity: 0.6;
  }

  /* Font size variations */
  .homelab-detail.font-small .content-main {
    font-size: 0.9375rem;
  }

  .homelab-detail.font-large .content-main {
    font-size: 1.1875rem;
  }

  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  /* Reading Progress Bar */
  .reading-progress-container {
    position: fixed;
    top: 73px;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--color-bg-tertiary);
    z-index: 100;
  }

  .reading-progress-bar {
    height: 100%;
    background: linear-gradient(90deg, var(--color-accent-primary), var(--color-accent-secondary));
    transition: width 0.1s ease-out;
    box-shadow: 0 0 10px var(--color-accent-primary);
  }

  /* Header Section */
  .homelab-header {
    background: linear-gradient(180deg, rgba(139, 92, 246, 0.03) 0%, transparent 100%);
    border-bottom: 1px solid var(--color-border-default);
    padding: 2rem 0 3rem;
    transition: opacity 0.3s ease;
  }

  .header-content {
    max-width: 800px;
  }

  .header-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .category-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: rgba(139, 92, 246, 0.15);
    border: 1px solid rgba(139, 92, 246, 0.3);
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-accent-primary-light);
    text-transform: capitalize;
    font-family: var(--font-mono);
  }

  .category-icon {
    font-size: 1.1rem;
  }

  .difficulty-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.5rem 1rem;
    background: color-mix(in srgb, var(--difficulty-color) 10%, transparent);
    border: 1px solid var(--difficulty-color);
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--difficulty-color);
    text-transform: capitalize;
    font-family: var(--font-mono);
  }

  .reading-time-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: rgba(6, 182, 212, 0.1);
    border: 1px solid rgba(6, 182, 212, 0.3);
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    color: var(--color-accent-secondary-light);
    font-family: var(--font-mono);
  }

  .homelab-title {
    font-size: 2.75rem;
    font-weight: 700;
    color: var(--color-text-primary);
    margin-bottom: 1rem;
    line-height: 1.2;
    letter-spacing: -0.02em;
  }

  .homelab-description {
    font-size: 1.125rem;
    line-height: 1.7;
    color: var(--color-text-secondary);
    margin-bottom: 1.5rem;
  }

  /* Info Callout */
  .info-callout {
    display: inline-flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.5rem;
    background: rgba(6, 182, 212, 0.08);
    border: 1px solid rgba(6, 182, 212, 0.2);
    border-left: 3px solid var(--color-accent-secondary);
    border-radius: var(--radius-md);
    margin-bottom: 1.5rem;
  }

  .callout-icon {
    color: var(--color-accent-secondary-light);
    display: flex;
    align-items: center;
  }

  .callout-content {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .callout-label {
    font-size: 0.75rem;
    font-family: var(--font-mono);
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .callout-value {
    font-size: 0.9375rem;
    color: var(--color-text-primary);
    font-family: var(--font-mono);
  }

  .header-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .services-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .service-tag {
    padding: 0.375rem 0.875rem;
    background: rgba(139, 92, 246, 0.08);
    border: 1px solid rgba(139, 92, 246, 0.15);
    border-radius: var(--radius-sm);
    font-size: 0.8125rem;
    color: var(--color-accent-secondary-light);
    font-weight: 500;
    font-family: var(--font-mono);
    transition: all var(--transition-base);
  }

  .service-tag:hover {
    background: rgba(139, 92, 246, 0.15);
    border-color: rgba(139, 92, 246, 0.3);
  }

  .date-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--color-text-tertiary);
    font-family: var(--font-mono);
    font-size: 0.875rem;
  }

  /* Loading State */
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 6rem 2rem;
    gap: 1.5rem;
  }

  .spinner {
    width: 48px;
    height: 48px;
    border: 3px solid var(--color-border-default);
    border-top-color: var(--color-accent-primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .loading-container p {
    color: var(--color-text-tertiary);
    font-size: 1.0625rem;
  }

  /* No Content State */
  .no-content {
    padding: 4rem 0 6rem;
  }

  .no-content-card {
    max-width: 600px;
    margin: 0 auto;
    text-align: center;
    padding: 4rem 2rem;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border-default);
    border-radius: var(--radius-lg);
  }

  .no-content-card svg {
    color: var(--color-accent-primary-light);
    margin-bottom: 1.5rem;
  }

  .no-content-card h2 {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--color-text-primary);
    margin-bottom: 1rem;
  }

  .no-content-card p {
    font-size: 1.0625rem;
    color: var(--color-text-secondary);
    line-height: 1.7;
  }

  /* Content Grid */
  .content-wrapper {
    padding: 3rem 0 6rem;
  }

  .content-grid {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 3rem;
    align-items: start;
  }

  /* Table of Contents Sidebar */
  .toc-sidebar {
    position: sticky;
    top: 90px;
    max-height: calc(100vh - 120px);
    overflow-y: auto;
    padding: 1.5rem;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border-default);
    border-radius: var(--radius-lg);
    transition: opacity 0.3s ease;
  }

  .toc-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--color-border-default);
  }

  .toc-header h3 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-family: var(--font-mono);
    color: var(--color-text-primary);
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .toc-close {
    display: none;
    background: none;
    border: none;
    color: var(--color-text-tertiary);
    cursor: pointer;
    padding: 0.25rem;
    transition: color var(--transition-base);
  }

  .toc-close:hover {
    color: var(--color-text-primary);
  }

  /* TOC Progress */
  .toc-progress {
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--color-border-muted);
  }

  .toc-progress-text {
    font-size: 0.75rem;
    color: var(--color-accent-primary-light);
    font-family: var(--font-mono);
    font-weight: 500;
  }

  .toc-nav {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .toc-item-wrapper {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .toc-item {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-align: left;
    padding: 0.625rem 0.875rem;
    background: transparent;
    border: none;
    color: var(--color-text-secondary);
    font-size: 0.875rem;
    line-height: 1.5;
    cursor: pointer;
    transition: all var(--transition-base);
    border-radius: var(--radius-sm);
  }

  .toc-indicator {
    width: 3px;
    height: 16px;
    background: var(--color-border-default);
    border-radius: 2px;
    transition: all var(--transition-base);
    flex-shrink: 0;
  }

  .toc-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .toc-item:hover {
    background: var(--color-bg-tertiary);
    color: var(--color-text-primary);
  }

  .toc-item:hover .toc-indicator {
    background: var(--color-accent-primary);
  }

  .toc-item.active {
    background: rgba(139, 92, 246, 0.1);
    color: var(--color-accent-primary-light);
  }

  .toc-item.active .toc-indicator {
    background: var(--color-accent-primary-light);
    height: 20px;
  }

  .toc-item.level-3 {
    padding-left: 1.75rem;
    font-size: 0.8125rem;
  }

  .toc-copy-link {
    opacity: 0;
    background: transparent;
    border: none;
    color: var(--color-text-muted);
    cursor: pointer;
    padding: 0.375rem;
    border-radius: var(--radius-sm);
    transition: all var(--transition-base);
  }

  .toc-item-wrapper:hover .toc-copy-link {
    opacity: 1;
  }

  .toc-copy-link:hover {
    color: var(--color-accent-primary-light);
    background: rgba(139, 92, 246, 0.1);
  }

  /* Related Writeups */
  .toc-related {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--color-border-default);
  }

  .toc-related h4 {
    font-size: 0.75rem;
    font-family: var(--font-mono);
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.75rem;
  }

  .related-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    color: var(--color-text-tertiary);
    text-decoration: none;
    font-size: 0.8125rem;
    border-radius: var(--radius-sm);
    transition: all var(--transition-base);
  }

  .related-link:hover {
    background: var(--color-bg-tertiary);
    color: var(--color-accent-primary-light);
  }

  /* Main Content */
  .content-main {
    position: relative;
    min-width: 0;
    background: var(--color-bg-secondary);
    border: 1px solid rgba(139, 92, 246, 0.15);
    border-radius: var(--radius-lg);
    padding: 3rem 4rem;
    max-width: 900px;
    margin: 0 auto;
    line-height: 1.8;
    box-shadow:
      0 4px 25px rgba(0, 0, 0, 0.2),
      0 0 50px rgba(139, 92, 246, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
  }

  /* Gradient border effect */
  .content-main::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--color-accent-primary), var(--color-accent-secondary), var(--color-accent-primary));
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    opacity: 0.8;
  }

  .content-footer {
    margin-top: 4rem;
    padding-top: 2rem;
    border-top: 1px solid var(--color-border-default);
  }

  .footer-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .tag {
    font-size: 0.875rem;
    color: var(--color-text-tertiary);
    font-family: var(--font-mono);
    padding: 0.5rem 1rem;
    background: rgba(139, 92, 246, 0.08);
    border: 1px solid rgba(139, 92, 246, 0.15);
    border-radius: var(--radius-md);
    transition: all var(--transition-base);
  }

  .tag:hover {
    border-color: var(--color-accent-primary);
    color: var(--color-accent-primary-light);
  }

  /* Reader Controls */
  .reader-controls {
    position: fixed;
    bottom: 6rem;
    right: 2rem;
    z-index: 50;
  }

  .reader-controls-toggle {
    width: 48px;
    height: 48px;
    background: var(--color-bg-elevated);
    border: 1px solid var(--color-border-default);
    border-radius: var(--radius-md);
    color: var(--color-text-secondary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition-base);
    box-shadow: var(--shadow-md);
  }

  .reader-controls-toggle:hover {
    border-color: var(--color-accent-primary);
    color: var(--color-accent-primary-light);
  }

  .reader-controls-panel {
    position: absolute;
    bottom: 100%;
    right: 0;
    margin-bottom: 0.5rem;
    background: var(--color-bg-elevated);
    border: 1px solid var(--color-border-default);
    border-radius: var(--radius-lg);
    padding: 1rem;
    min-width: 200px;
    box-shadow: var(--shadow-lg);
  }

  .control-group {
    margin-bottom: 1rem;
  }

  .control-group:last-child {
    margin-bottom: 0;
  }

  .control-label {
    display: block;
    font-size: 0.75rem;
    font-family: var(--font-mono);
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.5rem;
  }

  .font-size-controls {
    display: flex;
    gap: 0.25rem;
  }

  .font-btn {
    flex: 1;
    padding: 0.5rem;
    background: var(--color-bg-tertiary);
    border: 1px solid var(--color-border-default);
    border-radius: var(--radius-sm);
    color: var(--color-text-secondary);
    font-family: var(--font-mono);
    font-size: 0.875rem;
    cursor: pointer;
    transition: all var(--transition-base);
  }

  .font-btn:hover {
    border-color: var(--color-accent-primary);
  }

  .font-btn.active {
    background: rgba(139, 92, 246, 0.15);
    border-color: var(--color-accent-primary);
    color: var(--color-accent-primary-light);
  }

  .focus-toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.5rem 0.75rem;
    background: var(--color-bg-tertiary);
    border: 1px solid var(--color-border-default);
    border-radius: var(--radius-sm);
    color: var(--color-text-secondary);
    font-family: var(--font-mono);
    font-size: 0.875rem;
    cursor: pointer;
    transition: all var(--transition-base);
  }

  .focus-toggle:hover {
    border-color: var(--color-accent-primary);
  }

  .focus-toggle.active {
    background: rgba(139, 92, 246, 0.15);
    border-color: var(--color-accent-primary);
    color: var(--color-accent-primary-light);
  }

  /* Floating TOC Button */
  .floating-toc-btn {
    display: none;
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, var(--color-accent-primary) 0%, var(--color-accent-secondary) 100%);
    border: none;
    border-radius: 50%;
    color: white;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
    z-index: 100;
    transition: all var(--transition-base);
  }

  .floating-toc-btn:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(139, 92, 246, 0.5);
  }

  /* Footer */
  .homelab-footer {
    background: var(--color-bg-secondary);
    border-top: 1px solid var(--color-border-default);
    padding: 3rem 0;
    margin-top: 4rem;
  }

  .footer-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1.5rem;
  }

  .footer-meta {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .completion-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.3);
    border-radius: var(--radius-md);
    color: var(--color-success);
    font-family: var(--font-mono);
    font-size: 0.875rem;
  }

  .footer-cta {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 2rem;
    background: linear-gradient(135deg, var(--color-accent-primary) 0%, var(--color-accent-secondary) 100%);
    color: var(--color-bg-primary);
    text-decoration: none;
    font-weight: 600;
    border-radius: var(--radius-md);
    transition: all var(--transition-base);
    font-family: var(--font-mono);
    box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
  }

  .footer-cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
  }

  /* Error State */
  .error-state {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 73px;
    text-align: center;
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    * {
      transition: none !important;
    }
  }

  /* Responsive Design */
  @media (max-width: 1200px) {
    .content-grid {
      grid-template-columns: 240px 1fr;
      gap: 2rem;
    }

    .toc-sidebar {
      padding: 1.25rem;
    }

    .content-main {
      max-width: none;
    }
  }

  @media (max-width: 1024px) {
    .sticky-back-nav {
      display: none;
    }

    .content-grid {
      grid-template-columns: 1fr;
      gap: 0;
    }

    .toc-sidebar {
      display: none;
      position: fixed;
      top: 73px;
      left: 0;
      right: 0;
      bottom: 0;
      width: 320px;
      max-height: none;
      border-radius: 0;
      border: none;
      border-right: 1px solid var(--color-border-default);
      z-index: 90;
    }

    .toc-sidebar.show {
      display: block;
    }

    .toc-close {
      display: block;
    }

    .floating-toc-btn {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .reader-controls {
      bottom: 7rem;
    }
  }

  @media (max-width: 768px) {
    .container {
      padding: 0 1.5rem;
    }

    .homelab-header {
      padding: 1.5rem 0 2rem;
    }

    .homelab-title {
      font-size: 2rem;
    }

    .homelab-description {
      font-size: 1rem;
    }

    .content-wrapper {
      padding: 2rem 0 4rem;
    }

    .content-main {
      padding: 2rem 1.5rem;
      border-radius: var(--radius-md);
    }

    .toc-sidebar {
      width: 100%;
      max-width: 100%;
    }

    .floating-toc-btn {
      bottom: 1.5rem;
      right: 1.5rem;
      width: 52px;
      height: 52px;
    }

    .reader-controls {
      bottom: 5.5rem;
      right: 1.5rem;
    }

    .reader-controls-toggle {
      width: 44px;
      height: 44px;
    }

    .footer-content {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  @media (max-width: 480px) {
    .homelab-title {
      font-size: 1.75rem;
    }

    .header-meta {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .info-callout {
      width: 100%;
    }

    .content-main {
      padding: 1.5rem 1rem;
    }

    .header-footer {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>
