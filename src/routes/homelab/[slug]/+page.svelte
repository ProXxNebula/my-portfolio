<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import MarkdownRenderer from '$lib/components/MarkdownRenderer.svelte';
  import { parseFrontmatter } from '$lib/utils/frontmatter';

  $: slug = $page.params.slug;
  let homelab: any = null;

  let markdownContent = '';
  let loading = true;
  let contentExists = false;
  let tableOfContents: { id: string; text: string; level: number }[] = [];
  let activeSection = '';
  let showTableOfContents = false;

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
    switch (difficulty) {
      case 'beginner': return 'var(--color-accent-secondary-light)';
      case 'intermediate': return '#f59e0b';
      case 'advanced': return '#ef4444';
      default: return 'var(--color-accent-primary)';
    }
  }
</script>

<svelte:head>
  <title>{homelab?.title || 'Homelab'} - Portfolio</title>
  <meta name="description" content={homelab?.description || 'Homelab Documentation'} />
</svelte:head>

{#if homelab}
  <main class="homelab-detail">
    <!-- Header Section -->
    <header class="homelab-header">
      <div class="container">
        <a href="/homelab" class="back-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Homelab
        </a>

        <div class="header-content">
          <div class="header-meta">
            <span class="category-badge">{homelab.category}</span>
            <span class="difficulty-badge" style="color: {getDifficultyColor(homelab.difficulty)}">
              {homelab.difficulty}
            </span>
            <span class="date-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              {new Date(homelab.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <h1 class="homelab-title">{homelab.title}</h1>
          <p class="homelab-description">{homelab.description}</p>

          <div class="header-info">
            <div class="info-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
              <span>{homelab.hardware}</span>
            </div>
          </div>

          <div class="services-tags">
            {#each homelab.services as service}
              <span class="service-tag">{service}</span>
            {/each}
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
                <h3>Contents</h3>
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
                    class="toc-item level-{item.level}"
                    class:active={activeSection === item.id}
                    on:click={() => scrollToSection(item.id)}
                  >
                    {item.text}
                  </button>
                {/each}
              </nav>
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

      <!-- Floating TOC Button (Mobile) -->
      <button class="floating-toc-btn" on:click={toggleTableOfContents} aria-label="Toggle table of contents">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
    {/if}
  </main>
{/if}

<style>
  .homelab-detail {
    min-height: 100vh;
    padding-top: 73px;
  }

  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  /* Header Section */
  .homelab-header {
    background: linear-gradient(180deg, rgba(139, 92, 246, 0.05) 0%, transparent 100%);
    border-bottom: 1px solid var(--color-border-default);
    padding: 2rem 0 3rem;
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--color-text-tertiary);
    text-decoration: none;
    font-size: 0.9375rem;
    font-weight: 500;
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
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .category-badge {
    padding: 0.375rem 0.875rem;
    background: rgba(139, 92, 246, 0.15);
    border: 1px solid rgba(139, 92, 246, 0.3);
    border-radius: var(--radius-full);
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--color-accent-blue-light);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .difficulty-badge {
    padding: 0.375rem 0.875rem;
    background: rgba(139, 92, 246, 0.1);
    border: 1px solid currentColor;
    border-radius: var(--radius-full);
    font-size: 0.8125rem;
    font-weight: 600;
    text-transform: capitalize;
  }

  .date-badge {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0.875rem;
    background: var(--color-bg-tertiary);
    border: 1px solid var(--color-border-default);
    border-radius: var(--radius-full);
    font-size: 0.8125rem;
    color: var(--color-text-tertiary);
    font-family: var(--font-mono);
  }

  .homelab-title {
    font-size: 3rem;
    font-weight: 700;
    color: var(--color-text-primary);
    margin-bottom: 1rem;
    line-height: 1.2;
    letter-spacing: -0.02em;
  }

  .homelab-description {
    font-size: 1.25rem;
    line-height: 1.7;
    color: var(--color-text-secondary);
    margin-bottom: 1.5rem;
  }

  .header-info {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .info-item {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    color: var(--color-text-tertiary);
    font-size: 0.9375rem;
  }

  .info-item svg {
    color: var(--color-accent-blue-light);
    flex-shrink: 0;
  }

  .info-item span {
    font-family: var(--font-mono);
    font-size: 0.875rem;
  }

  .services-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.625rem;
  }

  .service-tag {
    padding: 0.5rem 1rem;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border-default);
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    color: var(--color-accent-secondary-light);
    font-weight: 500;
    font-family: var(--font-mono);
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
    border-top-color: var(--color-accent-blue);
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
    color: var(--color-accent-blue-light);
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
    gap: 4rem;
    align-items: start;
  }

  /* Table of Contents Sidebar */
  .toc-sidebar {
    position: sticky;
    top: 100px;
    max-height: calc(100vh - 120px);
    overflow-y: auto;
    padding: 1.5rem;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border-default);
    border-radius: var(--radius-lg);
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
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--color-text-primary);
    margin: 0;
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

  .toc-nav {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .toc-item {
    text-align: left;
    padding: 0.625rem 0.875rem;
    background: transparent;
    border: none;
    border-left: 2px solid transparent;
    color: var(--color-text-secondary);
    font-size: 0.9375rem;
    line-height: 1.5;
    cursor: pointer;
    transition: all var(--transition-base);
    border-radius: var(--radius-sm);
  }

  .toc-item:hover {
    background: var(--color-bg-tertiary);
    color: var(--color-text-primary);
    border-left-color: var(--color-accent-blue-light);
  }

  .toc-item.active {
    background: rgba(139, 92, 246, 0.1);
    color: var(--color-accent-blue-light);
    border-left-color: var(--color-accent-blue);
    font-weight: 600;
  }

  .toc-item.level-3 {
    padding-left: 1.75rem;
    font-size: 0.875rem;
  }

  /* Main Content */
  .content-main {
    min-width: 0;
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
    font-size: 0.9375rem;
    color: var(--color-text-tertiary);
    font-family: var(--font-mono);
    padding: 0.5rem 1rem;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border-default);
    border-radius: var(--radius-md);
    transition: all var(--transition-base);
  }

  .tag:hover {
    border-color: var(--color-accent-blue);
    color: var(--color-accent-blue-light);
  }

  /* Floating TOC Button */
  .floating-toc-btn {
    display: none;
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 56px;
    height: 56px;
    background: var(--color-accent-blue);
    border: none;
    border-radius: 50%;
    color: white;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
    z-index: 100;
    transition: all var(--transition-base);
  }

  .floating-toc-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(139, 92, 246, 0.5);
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    .content-grid {
      grid-template-columns: 240px 1fr;
      gap: 2.5rem;
    }

    .toc-sidebar {
      top: 90px;
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
      font-size: 1.125rem;
    }

    .content-wrapper {
      padding: 2rem 0 4rem;
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
      width: 100%;
      max-height: none;
      border-radius: 0;
      border: none;
      border-bottom: 1px solid var(--color-border-default);
      z-index: 1000;
      overflow-y: auto;
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
  }

  @media (max-width: 480px) {
    .homelab-title {
      font-size: 1.75rem;
    }

    .header-meta {
      flex-direction: column;
      align-items: flex-start;
    }

    .floating-toc-btn {
      bottom: 1.5rem;
      right: 1.5rem;
      width: 48px;
      height: 48px;
    }
  }
</style>
