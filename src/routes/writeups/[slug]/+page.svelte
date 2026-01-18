<script lang="ts">
  import { page } from '$app/stores';
  import { onMount, onDestroy } from 'svelte';
  import MarkdownRenderer from '$lib/components/MarkdownRenderer.svelte';
  import { parseFrontmatter } from '$lib/utils/frontmatter';
  import { browser } from '$app/environment';

  $: slug = $page.params.slug;
  let writeup: any = null;

  let markdownContent = '';
  let loading = true;
  let contentExists = false;
  let tableOfContents: { id: string; text: string; level: number }[] = [];
  let activeSection = '';
  let readingProgress = 0;
  let showTableOfContents = false;
  let readingTime = 0;

  // Reader preferences
  let focusMode = false;

  // Scroll handler reference for cleanup
  let scrollHandler: (() => void) | null = null;

  onMount(async () => {
    try {
      const response = await fetch(`/writeups-content/${slug}.md`);
      if (response.ok) {
        const rawMarkdown = await response.text();
        const parsed = parseFrontmatter(rawMarkdown);

        if (parsed) {
          writeup = { slug, ...parsed.frontmatter };
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
      // Close mobile TOC
      showTableOfContents = false;
      // Update URL hash
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

  function toggleFocusMode() {
    focusMode = !focusMode;
  }

  function getDifficultyColor(difficulty: string): string {
    const colors: Record<string, string> = {
      'Easy': 'var(--color-success)',
      'Intermediate': 'var(--color-warning)',
      'Medium': 'var(--color-warning)',
      'Hard': 'var(--color-error)'
    };
    return colors[difficulty] || 'var(--color-text-tertiary)';
  }

  function getPlatformIcon(platform: string): string {
    const icons: Record<string, string> = {
      'HackTheBox': '🎯',
      'TryHackMe': '🔐',
      'PortSwigger': '🌐'
    };
    return icons[platform] || '📝';
  }
</script>

<svelte:head>
  <title>{writeup?.title || 'Writeup'} - Portfolio</title>
  <meta name="description" content={writeup?.description || 'CTF Writeup'} />
</svelte:head>

{#if writeup}
  <main class="writeup-detail" class:focus-mode={focusMode}>
    <!-- Sticky Back Navigation -->
    <div class="sticky-back-nav">
      <a href="/writeups" class="back-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        <span>Writeups</span>
      </a>
    </div>

    <!-- Header Section -->
    <header class="writeup-header">
      <div class="container">
        <div class="header-content">
          <div class="header-meta">
            <span class="platform-badge">
              <span class="platform-icon">{getPlatformIcon(writeup.platform)}</span>
              {writeup.platform}
            </span>
            <span class="difficulty-badge" style="--difficulty-color: {getDifficultyColor(writeup.difficulty)}">
              {writeup.difficulty}
            </span>
            <span class="category-badge">{writeup.category}</span>
            <span class="reading-time-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              {readingTime} min read
            </span>
          </div>

          <h1 class="writeup-title">{writeup.title}</h1>
          <p class="writeup-description">{writeup.description}</p>

          <div class="header-footer">
            <div class="tags-container">
              {#each writeup.tags as tag}
                <span class="tag">{tag}</span>
              {/each}
            </div>
            <div class="date-info">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              {new Date(writeup.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <div class="content-wrapper">
      <div class="container">
        <div class="content-grid">
          <!-- Table of Contents Sidebar -->
          {#if contentExists && tableOfContents.length > 0}
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
                {#each tableOfContents as item, index}
                  <div class="toc-item-wrapper">
                    <button
                      class="toc-item"
                      class:active={activeSection === item.id}
                      class:level-3={item.level === 3}
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
            </aside>
          {/if}

          <!-- Article Content -->
          <article class="writeup-content">
            {#if loading}
              <div class="loading-state">
                <div class="spinner"></div>
                <p>Loading writeup...</p>
              </div>
            {:else if contentExists}
              <MarkdownRenderer content={markdownContent} />
            {:else}
              <div class="no-content-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <h2>Content Coming Soon</h2>
                <p>This writeup is currently being prepared. Check back later for the full walkthrough!</p>
              </div>
            {/if}
          </article>
        </div>
      </div>
    </div>

    <!-- Focus Mode Toggle (Floating) -->
    <button
      class="focus-mode-toggle"
      class:active={focusMode}
      on:click={toggleFocusMode}
      aria-label="Toggle focus mode"
      title={focusMode ? 'Exit focus mode' : 'Enter focus mode'}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        {#if focusMode}
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
          <circle cx="12" cy="12" r="3"/>
          <line x1="2" y1="2" x2="22" y2="22"/>
        {:else}
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        {/if}
      </svg>
    </button>

    <!-- Floating Action Buttons -->
    {#if contentExists && tableOfContents.length > 0}
      <button class="floating-toc-toggle" on:click={toggleTableOfContents} aria-label="Toggle table of contents">
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
    <div class="writeup-footer">
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
          <a href="/writeups" class="footer-cta">
            <span>View All Writeups</span>
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
      <h1>Writeup Not Found</h1>
      <p>The writeup you're looking for doesn't exist.</p>
      <a href="/writeups" class="btn btn-primary">Back to Writeups</a>
    </div>
  </div>
{/if}

<style>
  .writeup-detail {
    padding-top: 73px;
    min-height: 100vh;
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
  .writeup-detail.focus-mode .toc-sidebar {
    opacity: 0.4;
  }

  .writeup-detail.focus-mode .toc-sidebar:hover {
    opacity: 1;
  }

  .writeup-detail.focus-mode .writeup-header {
    opacity: 0.6;
  }

  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  /* Header Section */
  .writeup-header {
    background: linear-gradient(180deg, rgba(139, 92, 246, 0.05) 0%, rgba(6, 182, 212, 0.02) 50%, transparent 100%);
    border-bottom: 1px solid rgba(139, 92, 246, 0.2);
    padding: 2.5rem 0 3.5rem;
    transition: opacity 0.3s ease;
  }

  .header-content {
    max-width: 850px;
  }

  .header-meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
  }

  .platform-badge,
  .difficulty-badge,
  .category-badge,
  .reading-time-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(139, 92, 246, 0.2);
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    font-family: var(--font-mono);
    font-weight: 500;
    color: var(--color-text-secondary);
  }

  .platform-icon {
    font-size: 1.1rem;
  }

  .difficulty-badge {
    color: var(--difficulty-color);
    border-color: var(--difficulty-color);
    background: color-mix(in srgb, var(--difficulty-color) 10%, transparent);
  }

  .reading-time-badge {
    background: rgba(6, 182, 212, 0.1);
    border-color: rgba(6, 182, 212, 0.3);
    color: var(--color-accent-secondary-light);
  }

  .writeup-title {
    font-size: 2.75rem;
    line-height: 1.2;
    margin-bottom: 1.25rem;
    background: linear-gradient(135deg, var(--color-accent-primary-light) 0%, var(--color-accent-secondary) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .writeup-description {
    font-size: 1.15rem;
    color: var(--color-text-secondary);
    line-height: 1.8;
    margin-bottom: 1.75rem;
    max-width: 700px;
  }

  .header-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tag {
    padding: 0.375rem 0.875rem;
    background: rgba(139, 92, 246, 0.08);
    border: 1px solid rgba(139, 92, 246, 0.15);
    border-radius: var(--radius-sm);
    font-size: 0.8125rem;
    font-family: var(--font-mono);
    color: var(--color-accent-primary-light);
    transition: all var(--transition-base);
  }

  .tag:hover {
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

  /* Content Area */
  .content-wrapper {
    padding: 3rem 0 4rem;
  }

  .content-grid {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 3rem;
    max-width: 1400px;
    margin: 0 auto;
  }

  /* Table of Contents Sidebar */
  .toc-sidebar {
    position: sticky;
    top: 90px;
    height: fit-content;
    max-height: calc(100vh - 120px);
    overflow-y: auto;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border-default);
    border-radius: var(--radius-lg);
    padding: 1.5rem;
    transition: opacity 0.3s ease;
  }

  .toc-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
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
    background: transparent;
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
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.625rem 0.75rem;
    background: transparent;
    border: none;
    border-radius: var(--radius-sm);
    color: var(--color-text-tertiary);
    font-size: 0.875rem;
    font-family: var(--font-sans);
    text-align: left;
    cursor: pointer;
    transition: all var(--transition-base);
  }

  .toc-item.level-3 {
    padding-left: 1.75rem;
    font-size: 0.8125rem;
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
    color: var(--color-accent-primary-light);
    background: rgba(139, 92, 246, 0.1);
  }

  .toc-item.active .toc-indicator {
    background: var(--color-accent-primary-light);
    height: 20px;
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

  /* Article Content */
  .writeup-content {
    position: relative;
    background: var(--color-bg-secondary);
    border: 1px solid rgba(139, 92, 246, 0.15);
    border-radius: var(--radius-lg);
    padding: 3rem 4rem;
    min-height: 60vh;
    max-width: 900px;
    margin: 0 auto;
    line-height: 1.8;
    box-shadow:
      0 4px 25px rgba(0, 0, 0, 0.2),
      0 0 50px rgba(139, 92, 246, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
  }

  /* Gradient border effect */
  .writeup-content::before {
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

  .spinner {
    width: 48px;
    height: 48px;
    border: 3px solid var(--color-border-default);
    border-top-color: var(--color-accent-primary);
    border-radius: 50%;
    margin: 0 auto;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    gap: 1.5rem;
  }

  .loading-state p {
    color: var(--color-text-tertiary);
    font-family: var(--font-mono);
    font-size: 0.9rem;
  }

  .no-content-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 5rem 2rem;
    gap: 1.5rem;
    text-align: center;
  }

  .no-content-state svg {
    color: var(--color-text-muted);
    opacity: 0.4;
  }

  .no-content-state h2 {
    font-size: var(--font-size-2xl);
    color: var(--color-text-primary);
    margin: 0;
  }

  .no-content-state p {
    color: var(--color-text-tertiary);
    max-width: 500px;
    line-height: 1.7;
    margin: 0;
  }

  /* Focus Mode Toggle */
  .focus-mode-toggle {
    position: fixed;
    bottom: 6rem;
    right: 2rem;
    z-index: 50;
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

  .focus-mode-toggle:hover {
    border-color: var(--color-accent-primary);
    color: var(--color-accent-primary-light);
    transform: scale(1.05);
  }

  .focus-mode-toggle.active {
    background: rgba(139, 92, 246, 0.2);
    border-color: var(--color-accent-primary);
    color: var(--color-accent-primary-light);
    box-shadow:
      var(--shadow-md),
      0 0 20px rgba(139, 92, 246, 0.3);
  }

  /* Floating TOC Toggle Button */
  .floating-toc-toggle {
    display: none;
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, var(--color-accent-primary) 0%, var(--color-accent-secondary) 100%);
    color: var(--color-bg-primary);
    border: none;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
    transition: all var(--transition-base);
    z-index: 50;
  }

  .floating-toc-toggle:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(139, 92, 246, 0.5);
  }

  /* Footer */
  .writeup-footer {
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

    .writeup-content {
      max-width: none;
    }
  }

  @media (max-width: 1024px) {
    .sticky-back-nav {
      display: none;
    }

    .content-grid {
      grid-template-columns: 1fr;
    }

    .toc-sidebar {
      position: fixed;
      top: 73px;
      left: 0;
      right: 0;
      bottom: 0;
      max-height: 100vh;
      border-radius: 0;
      border: none;
      border-right: 1px solid var(--color-border-default);
      z-index: 90;
      transform: translateX(-100%);
      transition: transform 0.3s ease-out;
      width: 320px;
    }

    .toc-sidebar.show {
      transform: translateX(0);
    }

    .toc-close {
      display: block;
    }

    .floating-toc-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  @media (max-width: 768px) {
    .container {
      padding: 0 1.5rem;
    }

    .writeup-header {
      padding: 1.5rem 0 2rem;
    }

    .writeup-title {
      font-size: 2rem;
    }

    .writeup-description {
      font-size: 1rem;
    }

    .content-wrapper {
      padding: 2rem 0 3rem;
    }

    .writeup-content {
      padding: 2rem 1.5rem;
      border-radius: var(--radius-md);
    }

    .toc-sidebar {
      width: 100%;
      max-width: 100%;
    }

    .floating-toc-toggle {
      bottom: 1.5rem;
      right: 1.5rem;
      width: 52px;
      height: 52px;
    }

    .footer-content {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  @media (max-width: 480px) {
    .writeup-title {
      font-size: 1.75rem;
    }

    .header-meta {
      gap: 0.5rem;
    }

    .platform-badge,
    .difficulty-badge,
    .category-badge,
    .reading-time-badge {
      padding: 0.375rem 0.75rem;
      font-size: 0.8125rem;
    }

    .writeup-content {
      padding: 1.5rem 1rem;
    }

    .header-footer {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  /* Light Mode Overrides */
  :global(:root[data-theme="light"]) .writeup-header {
    background: linear-gradient(180deg, rgba(124, 58, 237, 0.05) 0%, rgba(8, 145, 178, 0.02) 50%, transparent 100%);
    border-bottom-color: rgba(124, 58, 237, 0.15);
  }

  :global(:root[data-theme="light"]) .toc-sidebar {
    background: var(--color-bg-elevated);
    border-color: rgba(124, 58, 237, 0.15);
  }

  :global(:root[data-theme="light"]) .writeup-content {
    background: var(--color-bg-elevated);
    border-color: rgba(124, 58, 237, 0.12);
  }

  :global(:root[data-theme="light"]) .writeup-footer {
    background: var(--color-bg-secondary);
    border-top-color: rgba(124, 58, 237, 0.15);
  }

  :global(:root[data-theme="light"]) .platform-badge,
  :global(:root[data-theme="light"]) .category-badge {
    background: rgba(124, 58, 237, 0.08);
    border-color: rgba(124, 58, 237, 0.15);
  }

  :global(:root[data-theme="light"]) .reading-time-badge {
    background: rgba(8, 145, 178, 0.08);
    border-color: rgba(8, 145, 178, 0.2);
  }

  :global(:root[data-theme="light"]) .tag {
    background: rgba(124, 58, 237, 0.06);
    border-color: rgba(124, 58, 237, 0.12);
  }

  :global(:root[data-theme="light"]) .tag:hover {
    background: rgba(124, 58, 237, 0.12);
    border-color: rgba(124, 58, 237, 0.25);
  }

  :global(:root[data-theme="light"]) .back-btn {
    background: var(--color-bg-elevated);
    border-color: rgba(124, 58, 237, 0.15);
  }

  :global(:root[data-theme="light"]) .focus-mode-toggle {
    background: var(--color-bg-elevated);
    border-color: rgba(124, 58, 237, 0.15);
  }

  :global(:root[data-theme="light"]) .toc-item:hover {
    background: rgba(124, 58, 237, 0.06);
  }

  :global(:root[data-theme="light"]) .toc-item.active {
    background: rgba(124, 58, 237, 0.08);
  }
</style>
