<script lang="ts">
  import { onMount } from 'svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';

  let homelabs: any[] = [];
  let loading = true;
  let selectedCategory = 'all';
  let categories: string[] = ['all'];
  let visible = false;

  // Pagination
  let currentPage = 1;
  const itemsPerPage = 9;
  $: totalPages = Math.ceil(filteredHomelabs.length / itemsPerPage);
  $: paginatedHomelabs = filteredHomelabs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
      document.querySelector('.content-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function getVisiblePages(current: number, total: number): (number | string)[] {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    if (current <= 3) {
      return [1, 2, 3, 4, '...', total];
    }

    if (current >= total - 2) {
      return [1, '...', total - 3, total - 2, total - 1, total];
    }

    return [1, '...', current - 1, current, current + 1, '...', total];
  }

  // Load homelabs from API (automatically parses frontmatter from markdown files)
  onMount(async () => {
    visible = true;
    try {
      const response = await fetch('/api/homelabs');
      if (response.ok) {
        homelabs = await response.json();
        // Extract unique categories
        const uniqueCategories = [...new Set(homelabs.map(h => h.category))];
        categories = ['all', ...uniqueCategories];
      }
    } catch (error) {
      console.error('Error loading homelabs:', error);
    }
    loading = false;
  });

  $: {
    filteredHomelabs = selectedCategory === 'all'
      ? homelabs
      : homelabs.filter(h => h.category === selectedCategory);

    // Reset to page 1 when filters change
    currentPage = 1;
  }

  let filteredHomelabs: any[] = [];

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
  <title>Homelab | Your Portfolio</title>
  <meta name="description" content="Detailed documentation of my homelab setup, infrastructure, and experiments" />
</svelte:head>

<Navbar />

<main class="homelab-page" class:visible>
  <!-- Animated Background -->
  <div class="cyber-bg">
    <div class="grid-overlay"></div>
    <div class="glow-orb orb-1"></div>
    <div class="glow-orb orb-2"></div>
    <div class="scan-line"></div>
  </div>

  <section class="hero-section">
    <div class="container">
      <div class="cyber-badge animate-fadeIn">
        <span class="status-indicator"></span>
        <span class="badge-text">INFRASTRUCTURE_STATUS: ONLINE</span>
      </div>

      <div class="terminal-line animate-slideUp">
        <span class="prompt">$</span>
        <span class="command">ssh admin@homelab</span>
      </div>

      <h1 class="page-title animate-slideUp">
        <span class="title-line">Home</span>
        <span class="title-gradient">lab</span>
      </h1>

      <p class="page-subtitle animate-slideUp">
        Detailed documentation of my homelab setup, infrastructure, and experiments
      </p>

      <div class="stats-container animate-fadeIn">
        <div class="stat-card">
          <span class="stat-value">{homelabs.length}</span>
          <span class="stat-label">SYSTEMS</span>
          <div class="stat-glow"></div>
        </div>
        <div class="stat-divider">
          <span class="divider-line"></span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{categories.length - 1}</span>
          <span class="stat-label">CATEGORIES</span>
          <div class="stat-glow"></div>
        </div>
      </div>
    </div>
  </section>

  <section class="content-section">
    <div class="container">
      <div class="section-header">
        <div class="header-line left"></div>
        <h2 class="section-title">
          <span class="title-bracket">[</span>
          LAB_DOCUMENTATION
          <span class="title-bracket">]</span>
        </h2>
        <div class="header-line right"></div>
      </div>

      {#if loading}
        <div class="loading">
          <div class="spinner"></div>
          <p>LOADING_SYSTEMS...</p>
        </div>
      {:else if homelabs.length === 0}
        <div class="empty-state">
          <div class="empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
          </div>
          <h2>NO_DOCUMENTATION_YET</h2>
          <p>Homelab documentation is being prepared. Check back soon!</p>
        </div>
      {:else}
        <!-- Category Filter -->
        <div class="filter-section">
          <div class="filter-label">FILTER_BY</div>
          <div class="category-filters">
            {#each categories as category}
              <button
                class="category-btn"
                class:active={selectedCategory === category}
                on:click={() => selectedCategory = category}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            {/each}
          </div>
        </div>

        <!-- Homelab Grid -->
        <div class="homelab-grid">
          {#each paginatedHomelabs as homelab, i}
            <a href="/homelab/{homelab.slug}" class="homelab-card" style="animation-delay: {i * 0.1}s">
              <div class="card-glow"></div>
              <div class="card-border"></div>
              <div class="card-content">
                <div class="card-header">
                  <div class="category-badge">{homelab.category}</div>
                  <div class="difficulty-badge" style="--difficulty-color: {getDifficultyColor(homelab.difficulty)}">
                    {homelab.difficulty}
                  </div>
                </div>

                <h2 class="card-title">{homelab.title}</h2>
                <p class="card-description">{homelab.description}</p>

                <div class="card-meta">
                  <div class="meta-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                      <line x1="8" y1="21" x2="16" y2="21"></line>
                      <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                    <span class="hardware-info">{homelab.hardware}</span>
                  </div>
                </div>

                <div class="services-list">
                  {#each homelab.services.slice(0, 3) as service}
                    <span class="service-tag">{service}</span>
                  {/each}
                  {#if homelab.services.length > 3}
                    <span class="service-tag more">+{homelab.services.length - 3} more</span>
                  {/if}
                </div>

                <div class="tags">
                  {#each homelab.tags as tag}
                    <span class="tag">#{tag}</span>
                  {/each}
                </div>

                <div class="card-footer">
                  <span class="read-more">
                    ACCESS_DOCUMENTATION
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </span>
                </div>
              </div>
              <div class="card-scan-line"></div>
            </a>
          {/each}
        </div>

        <!-- Pagination -->
        {#if totalPages > 1}
          <div class="pagination">
            <div class="pagination-info">
              Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredHomelabs.length)} of {filteredHomelabs.length}
            </div>

            <div class="pagination-controls">
              <button
                class="pagination-btn nav-btn"
                on:click={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>

              <div class="pagination-pages">
                {#each getVisiblePages(currentPage, totalPages) as page}
                  {#if page === '...'}
                    <span class="pagination-ellipsis">...</span>
                  {:else}
                    <button
                      class="pagination-btn page-btn"
                      class:active={currentPage === page}
                      on:click={() => goToPage(Number(page))}
                    >
                      {page}
                    </button>
                  {/if}
                {/each}
              </div>

              <button
                class="pagination-btn nav-btn"
                on:click={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </div>
          </div>
        {/if}
      {/if}
    </div>
  </section>
</main>

<Footer />

<style>
  /* ===================================
     Homelab Page - Cyberpunk Theme
     =================================== */

  .homelab-page {
    padding-top: 73px;
    min-height: 100vh;
    opacity: 0;
    transition: opacity 0.6s ease;
    position: relative;
  }

  .homelab-page.visible {
    opacity: 1;
  }

  /* Animated Background */
  .cyber-bg {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: -1;
    overflow: hidden;
  }

  .grid-overlay {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(139, 92, 246, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(139, 92, 246, 0.03) 1px, transparent 1px);
    background-size: 60px 60px;
  }

  .glow-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.4;
  }

  .orb-1 {
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%);
    top: -200px;
    left: -200px;
    animation: floatOrb 20s ease-in-out infinite;
  }

  .orb-2 {
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, transparent 70%);
    bottom: -150px;
    right: -150px;
    animation: floatOrb 25s ease-in-out infinite reverse;
  }

  @keyframes floatOrb {
    0%, 100% { transform: translate(0, 0) scale(1); }
    25% { transform: translate(50px, 50px) scale(1.1); }
    50% { transform: translate(0, 100px) scale(0.9); }
    75% { transform: translate(-50px, 50px) scale(1.05); }
  }

  .scan-line {
    position: absolute;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.5), transparent);
    animation: scanDown 8s linear infinite;
    opacity: 0.3;
  }

  @keyframes scanDown {
    0% { top: -10%; }
    100% { top: 110%; }
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  /* Hero Section */
  .hero-section {
    padding: 4rem 0 3rem;
    position: relative;
  }

  /* Cyber Badge */
  .cyber-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 1rem;
    background: rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(139, 92, 246, 0.3);
    border-radius: 2px;
    margin-bottom: 2rem;
    position: relative;
  }

  .cyber-badge::before,
  .cyber-badge::after {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    border: 1px solid var(--color-accent-blue);
  }

  .cyber-badge::before {
    top: -1px;
    left: -1px;
    border-right: none;
    border-bottom: none;
  }

  .cyber-badge::after {
    bottom: -1px;
    right: -1px;
    border-left: none;
    border-top: none;
  }

  .status-indicator {
    width: 8px;
    height: 8px;
    background: var(--color-success);
    border-radius: 50%;
    box-shadow: 0 0 10px var(--color-success);
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .badge-text {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--color-accent-blue-light);
    letter-spacing: 0.1em;
  }

  .terminal-line {
    font-family: var(--font-mono);
    font-size: 0.875rem;
    color: var(--color-text-tertiary);
    margin-bottom: 1rem;
  }

  .prompt {
    color: var(--color-accent-blue-light);
    margin-right: 0.5rem;
  }

  .command {
    color: var(--color-accent-secondary);
  }

  .page-title {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    display: flex;
    gap: 0.25rem;
  }

  .title-line {
    color: var(--color-text-primary);
  }

  .title-gradient {
    background: linear-gradient(135deg, var(--color-accent-blue-light) 0%, var(--color-accent-secondary) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .page-subtitle {
    font-size: 1.1rem;
    line-height: 1.7;
    color: var(--color-text-tertiary);
    margin-bottom: 2rem;
  }

  /* Stats Container */
  .stats-container {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .stat-card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem 1.5rem;
    background: rgba(139, 92, 246, 0.05);
    border: 1px solid rgba(139, 92, 246, 0.2);
  }

  .stat-card::before,
  .stat-card::after {
    content: '';
    position: absolute;
    width: 6px;
    height: 6px;
    border: 1px solid var(--color-accent-blue);
  }

  .stat-card::before {
    top: -1px;
    left: -1px;
    border-right: none;
    border-bottom: none;
  }

  .stat-card::after {
    bottom: -1px;
    right: -1px;
    border-left: none;
    border-top: none;
  }

  .stat-value {
    font-family: var(--font-mono);
    font-size: 1.75rem;
    font-weight: 700;
    background: linear-gradient(135deg, var(--color-accent-blue-light) 0%, var(--color-accent-secondary) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .stat-label {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    color: var(--color-text-muted);
    letter-spacing: 0.15em;
    margin-top: 0.25rem;
  }

  .stat-glow {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, rgba(139, 92, 246, 0.15) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .stat-card:hover .stat-glow {
    opacity: 1;
  }

  .stat-divider {
    display: flex;
    align-items: center;
    height: 40px;
  }

  .divider-line {
    width: 1px;
    height: 100%;
    background: linear-gradient(to bottom, transparent, rgba(139, 92, 246, 0.5), transparent);
  }

  /* Content Section */
  .content-section {
    padding: 4rem 0 6rem;
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    margin-bottom: 3rem;
  }

  .header-line {
    flex: 1;
    max-width: 200px;
    height: 1px;
  }

  .header-line.left {
    background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.5));
  }

  .header-line.right {
    background: linear-gradient(90deg, rgba(139, 92, 246, 0.5), transparent);
  }

  .section-title {
    font-family: var(--font-mono);
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-text-primary);
    letter-spacing: 0.05em;
    white-space: nowrap;
  }

  .title-bracket {
    color: var(--color-accent-blue);
  }

  /* Loading State */
  .loading {
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
    border: 3px solid rgba(139, 92, 246, 0.2);
    border-top-color: var(--color-accent-blue);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .loading p {
    font-family: var(--font-mono);
    color: var(--color-text-tertiary);
    font-size: 0.875rem;
    letter-spacing: 0.1em;
  }

  /* Empty State */
  .empty-state {
    text-align: center;
    padding: 6rem 2rem;
  }

  .empty-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 96px;
    height: 96px;
    background: rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(139, 92, 246, 0.3);
    margin: 0 auto 2rem;
    color: var(--color-accent-blue-light);
  }

  .empty-state h2 {
    font-family: var(--font-mono);
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-text-primary);
    margin-bottom: 1rem;
    letter-spacing: 0.1em;
  }

  .empty-state p {
    font-size: 1rem;
    color: var(--color-text-tertiary);
  }

  /* Filter Section */
  .filter-section {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 3rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid rgba(139, 92, 246, 0.15);
  }

  .filter-label {
    font-family: var(--font-mono);
    font-weight: 600;
    color: var(--color-text-muted);
    font-size: 0.75rem;
    letter-spacing: 0.1em;
  }

  .category-filters {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .category-btn {
    padding: 0.5rem 1.25rem;
    background: var(--color-bg-tertiary);
    border: 1px solid rgba(139, 92, 246, 0.2);
    border-radius: 2px;
    color: var(--color-text-tertiary);
    font-family: var(--font-mono);
    font-size: 0.8rem;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-base);
  }

  .category-btn:hover {
    border-color: var(--color-accent-blue);
    color: var(--color-text-primary);
  }

  .category-btn.active {
    background: rgba(139, 92, 246, 0.15);
    border-color: var(--color-accent-blue);
    color: var(--color-accent-blue-light);
    box-shadow: 0 0 15px rgba(139, 92, 246, 0.2);
  }

  /* Homelab Grid */
  .homelab-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 2rem;
  }

  .homelab-card {
    position: relative;
    display: block;
    text-decoration: none;
    color: inherit;
    overflow: hidden;
    animation: fadeInUp 0.6s ease backwards;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .homelab-card .card-glow {
    position: absolute;
    inset: -2px;
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(6, 182, 212, 0.3));
    filter: blur(15px);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 0;
  }

  .homelab-card:hover .card-glow {
    opacity: 1;
  }

  .homelab-card .card-border {
    position: absolute;
    inset: 0;
    background: var(--color-bg-tertiary);
    border: 1px solid rgba(139, 92, 246, 0.2);
    z-index: 1;
    transition: border-color 0.3s ease;
  }

  .homelab-card:hover .card-border {
    border-color: rgba(139, 92, 246, 0.5);
  }

  .homelab-card .card-content {
    position: relative;
    z-index: 2;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .category-badge {
    padding: 0.35rem 0.75rem;
    background: rgba(139, 92, 246, 0.15);
    border: 1px solid rgba(139, 92, 246, 0.3);
    font-family: var(--font-mono);
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--color-accent-blue-light);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .difficulty-badge {
    padding: 0.35rem 0.75rem;
    background: color-mix(in srgb, var(--difficulty-color) 15%, transparent);
    border: 1px solid var(--difficulty-color);
    font-family: var(--font-mono);
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--difficulty-color);
    text-transform: capitalize;
  }

  .card-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0;
    line-height: 1.4;
  }

  .card-description {
    font-size: 0.95rem;
    line-height: 1.6;
    color: var(--color-text-tertiary);
    margin: 0;
    flex-grow: 1;
  }

  .card-meta {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--color-text-tertiary);
    font-size: 0.875rem;
  }

  .meta-item svg {
    flex-shrink: 0;
    color: var(--color-accent-blue-light);
  }

  .hardware-info {
    font-family: var(--font-mono);
    font-size: 0.8rem;
  }

  .services-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .service-tag {
    padding: 0.3rem 0.6rem;
    background: rgba(6, 182, 212, 0.1);
    border: 1px solid rgba(6, 182, 212, 0.2);
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--color-accent-secondary-light);
    font-weight: 500;
  }

  .service-tag.more {
    color: var(--color-text-tertiary);
    background: rgba(139, 92, 246, 0.1);
    border-color: rgba(139, 92, 246, 0.2);
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tag {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--color-text-muted);
  }

  .card-footer {
    padding-top: 1rem;
    border-top: 1px solid rgba(139, 92, 246, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .read-more {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-accent-blue-light);
    letter-spacing: 0.1em;
    transition: all 0.3s ease;
  }

  .homelab-card:hover .read-more {
    gap: 0.75rem;
    color: var(--color-accent-secondary);
  }

  .read-more svg {
    transition: transform 0.3s ease;
  }

  .homelab-card:hover .read-more svg {
    transform: translateX(4px);
  }

  .card-scan-line {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--color-accent-blue), transparent);
    transform: scaleX(0);
    transition: transform 0.3s ease;
    z-index: 3;
  }

  .homelab-card:hover .card-scan-line {
    transform: scaleX(1);
  }

  /* Animations */
  .animate-fadeIn {
    animation: fadeIn 0.8s ease backwards;
  }

  .animate-slideUp {
    animation: fadeInUp 0.8s ease backwards;
  }

  .animate-slideUp:nth-child(2) { animation-delay: 0.1s; }
  .animate-slideUp:nth-child(3) { animation-delay: 0.2s; }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .container {
      padding: 0 1.5rem;
    }

    .hero-section {
      padding: 3rem 0 2rem;
    }

    .page-title {
      font-size: 2.5rem;
    }

    .page-subtitle {
      font-size: 1rem;
    }

    .stats-container {
      flex-wrap: wrap;
      justify-content: flex-start;
    }

    .stat-divider {
      display: none;
    }

    .content-section {
      padding: 3rem 0 4rem;
    }

    .filter-section {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    .homelab-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .homelab-card .card-content {
      padding: 1.5rem;
    }

    .card-title {
      font-size: 1.1rem;
    }
  }

  @media (max-width: 480px) {
    .page-title {
      font-size: 2rem;
    }

    .card-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .cyber-badge {
      padding: 0.4rem 0.75rem;
    }

    .badge-text {
      font-size: 0.65rem;
    }

    .pagination {
      flex-direction: column;
      gap: 1rem;
    }

    .pagination-pages {
      gap: 0.25rem;
    }

    .pagination-btn.page-btn {
      width: 36px;
      height: 36px;
      font-size: 0.75rem;
    }
  }

  /* Pagination Styles */
  .pagination {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    margin-top: 4rem;
    padding-top: 3rem;
    border-top: 1px solid rgba(139, 92, 246, 0.15);
  }

  .pagination-info {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    color: var(--color-text-muted);
    letter-spacing: 0.05em;
  }

  .pagination-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .pagination-pages {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .pagination-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-bg-tertiary);
    border: 1px solid rgba(139, 92, 246, 0.2);
    color: var(--color-text-secondary);
    font-family: var(--font-mono);
    cursor: pointer;
    transition: all var(--transition-base);
  }

  .pagination-btn.nav-btn {
    width: 40px;
    height: 40px;
    border-radius: 2px;
  }

  .pagination-btn.page-btn {
    width: 40px;
    height: 40px;
    font-size: 0.85rem;
    font-weight: 500;
  }

  .pagination-btn:hover:not(:disabled) {
    border-color: var(--color-accent-blue);
    color: var(--color-accent-blue-light);
    box-shadow: 0 0 15px rgba(139, 92, 246, 0.2);
  }

  .pagination-btn.active {
    background: rgba(139, 92, 246, 0.2);
    border-color: var(--color-accent-blue);
    color: var(--color-accent-blue-light);
    box-shadow: 0 0 15px rgba(139, 92, 246, 0.3);
  }

  .pagination-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .pagination-ellipsis {
    color: var(--color-text-muted);
    font-family: var(--font-mono);
    padding: 0 0.5rem;
  }
</style>
