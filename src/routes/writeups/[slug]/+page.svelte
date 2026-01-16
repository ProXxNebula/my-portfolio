<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import MarkdownRenderer from '$lib/components/MarkdownRenderer.svelte';
  import { parseFrontmatter } from '$lib/utils/frontmatter';

  $: slug = $page.params.slug;
  let writeup: any = null;

  let markdownContent = '';
  let loading = true;
  let contentExists = false;
  let tableOfContents: { id: string; text: string; level: number }[] = [];
  let activeSection = '';
  let readingProgress = 0;
  let showTableOfContents = false;

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
          // Generate table of contents
          generateTableOfContents(parsed.content);
          // Setup scroll listeners
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

  function generateTableOfContents(markdown: string) {
    const headings = markdown.match(/^#{2,3}\s+(.+)$/gm);
    if (headings) {
      tableOfContents = headings.map((heading, index) => {
        const level = heading.match(/^#+/)?.[0].length || 2;
        const text = heading.replace(/^#+\s+/, '');
        const id = `heading-${index}`;
        return { id, text, level };
      });
    }
  }

  function setupScrollListeners() {
    const handleScroll = () => {
      // Calculate reading progress
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      readingProgress = (scrollTop / (documentHeight - windowHeight)) * 100;

      // Update active section
      const headings = document.querySelectorAll('.markdown-content h2, .markdown-content h3');
      let currentSection = '';

      headings.forEach((heading, index) => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 150) {
          currentSection = `heading-${index}`;
        }
      });

      activeSection = currentSection;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }

  function scrollToSection(id: string) {
    const index = parseInt(id.replace('heading-', ''));
    const headings = document.querySelectorAll('.markdown-content h2, .markdown-content h3');
    const target = headings[index];
    if (target) {
      const offset = 100;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  }

  function toggleTableOfContents() {
    showTableOfContents = !showTableOfContents;
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
  <main class="writeup-detail">
    <!-- Header Section -->
    <header class="writeup-header">
      <div class="container">
        <a href="/writeups" class="back-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Writeups
        </a>

        <div class="header-content">
          <div class="header-meta">
            <span class="platform-badge">
              <span class="platform-icon">{getPlatformIcon(writeup.platform)}</span>
              {writeup.platform}
            </span>
            <span class="difficulty-badge" style="color: {getDifficultyColor(writeup.difficulty)}">
              {writeup.difficulty}
            </span>
            <span class="category-badge">{writeup.category}</span>
            <span class="date-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              {new Date(writeup.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <h1 class="writeup-title">{writeup.title}</h1>
          <p class="writeup-description">{writeup.description}</p>

          <div class="tags-container">
            {#each writeup.tags as tag}
              <span class="tag">{tag}</span>
            {/each}
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
            <aside class="table-of-contents" class:show={showTableOfContents}>
              <div class="toc-header">
                <h3>Table of Contents</h3>
                <button class="toc-close" on:click={toggleTableOfContents} aria-label="Close table of contents">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <nav class="toc-nav">
                {#each tableOfContents as item}
                  <button
                    class="toc-item"
                    class:active={activeSection === item.id}
                    class:level-3={item.level === 3}
                    on:click={() => scrollToSection(item.id)}
                  >
                    <span class="toc-indicator"></span>
                    {item.text}
                  </button>
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
        <a href="/writeups" class="footer-cta">
          <span>View All Writeups</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
      </div>
    </div>
  </main>
{:else}
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

  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  /* Header Section */
  .writeup-header {
    background: linear-gradient(180deg, rgba(83, 155, 245, 0.03) 0%, transparent 100%);
    border-bottom: 1px solid var(--color-border-default);
    padding: 2rem 0 3rem;
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--color-text-tertiary);
    text-decoration: none;
    font-family: var(--font-mono);
    font-size: 0.9rem;
    margin-bottom: 2rem;
    transition: all var(--transition-base);
  }

  .back-link:hover {
    color: var(--color-accent-blue-light);
    gap: 0.75rem;
  }

  .header-content {
    max-width: 900px;
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
  .date-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--color-bg-tertiary);
    border: 1px solid var(--color-border-default);
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
    font-weight: 600;
  }

  .date-badge svg {
    opacity: 0.6;
  }

  .writeup-title {
    font-size: 3rem;
    line-height: 1.2;
    margin-bottom: 1.5rem;
    background: linear-gradient(135deg, var(--color-accent-blue-light) 0%, var(--color-accent-green) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 700;
  }

  .writeup-description {
    font-size: 1.125rem;
    color: var(--color-text-secondary);
    line-height: 1.8;
    margin-bottom: 1.5rem;
  }

  .tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tag {
    padding: 0.375rem 0.875rem;
    background: rgba(83, 155, 245, 0.1);
    border: 1px solid rgba(83, 155, 245, 0.2);
    border-radius: var(--radius-sm);
    font-size: 0.8125rem;
    font-family: var(--font-mono);
    color: var(--color-accent-blue-light);
    transition: all var(--transition-base);
  }

  .tag:hover {
    background: rgba(83, 155, 245, 0.15);
    border-color: rgba(83, 155, 245, 0.3);
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

  /* Table of Contents */
  .table-of-contents {
    position: sticky;
    top: 110px;
    height: fit-content;
    max-height: calc(100vh - 150px);
    overflow-y: auto;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border-default);
    border-radius: var(--radius-lg);
    padding: 1.5rem;
  }

  .toc-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.25rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--color-border-default);
  }

  .toc-header h3 {
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

  .toc-nav {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .toc-item {
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
  }

  .toc-item:hover {
    background: var(--color-bg-tertiary);
    color: var(--color-text-primary);
  }

  .toc-item:hover .toc-indicator {
    background: var(--color-accent-blue);
  }

  .toc-item.active {
    color: var(--color-accent-blue-light);
    background: rgba(83, 155, 245, 0.1);
  }

  .toc-item.active .toc-indicator {
    background: var(--color-accent-blue-light);
    height: 20px;
  }

  /* Article Content */
  .writeup-content {
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border-default);
    border-radius: var(--radius-lg);
    padding: 3.5rem;
    min-height: 60vh;
  }

  .spinner {
    width: 48px;
    height: 48px;
    border: 3px solid var(--color-border-default);
    border-top-color: var(--color-accent-blue);
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

  /* Floating TOC Toggle Button */
  .floating-toc-toggle {
    display: none;
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, var(--color-accent-blue) 0%, var(--color-accent-green) 100%);
    color: var(--color-bg-primary);
    border: none;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(83, 155, 245, 0.3);
    transition: all var(--transition-base);
    z-index: 50;
  }

  .floating-toc-toggle:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(83, 155, 245, 0.4);
  }

  /* Footer */
  .writeup-footer {
    background: var(--color-bg-secondary);
    border-top: 1px solid var(--color-border-default);
    padding: 3rem 0;
    margin-top: 4rem;
  }

  .footer-cta {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 2rem;
    background: linear-gradient(135deg, var(--color-accent-blue) 0%, var(--color-accent-green) 100%);
    color: var(--color-bg-primary);
    text-decoration: none;
    font-weight: 600;
    border-radius: var(--radius-md);
    transition: all var(--transition-base);
    font-family: var(--font-mono);
    box-shadow: 0 2px 8px rgba(83, 155, 245, 0.2);
  }

  .footer-cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(83, 155, 245, 0.4);
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

  /* Responsive Design */
  @media (max-width: 1200px) {
    .content-grid {
      grid-template-columns: 240px 1fr;
      gap: 2rem;
    }

    .table-of-contents {
      padding: 1.25rem;
    }
  }

  @media (max-width: 1024px) {
    .content-grid {
      grid-template-columns: 1fr;
    }

    .table-of-contents {
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

    .table-of-contents.show {
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

    .table-of-contents {
      width: 100%;
      max-width: 100%;
    }

    .floating-toc-toggle {
      bottom: 1.5rem;
      right: 1.5rem;
      width: 52px;
      height: 52px;
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
    .date-badge {
      padding: 0.375rem 0.75rem;
      font-size: 0.8125rem;
    }

    .writeup-content {
      padding: 1.5rem 1rem;
    }
  }
</style>
