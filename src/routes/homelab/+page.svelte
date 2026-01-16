<script lang="ts">
  import { onMount } from 'svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';

  let homelabs: any[] = [];
  let loading = true;
  let selectedCategory = 'all';
  let categories: string[] = ['all'];

  // Load homelabs from API (automatically parses frontmatter from markdown files)
  onMount(async () => {
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

  $: filteredHomelabs = selectedCategory === 'all'
    ? homelabs
    : homelabs.filter(h => h.category === selectedCategory);

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

<main class="homelab-page">
  <section class="hero-section">
    <div class="container">
      <div class="terminal-line">
        <span class="prompt">$</span>
        <span class="command">ssh admin@homelab</span>
      </div>
      <h1 class="page-title">
        Home<span class="text-gradient">lab</span>
      </h1>
      <p class="page-subtitle">
        Detailed documentation of my homelab setup, infrastructure, and experiments
      </p>
    </div>
  </section>

  <section class="content-section">
    <div class="container">
      {#if loading}
        <div class="loading">
          <div class="spinner"></div>
          <p>Loading homelab documentation...</p>
        </div>
      {:else if homelabs.length === 0}
        <div class="empty-state">
          <div class="empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
          </div>
          <h2>No Documentation Yet</h2>
          <p>Homelab documentation is being prepared. Check back soon!</p>
        </div>
      {:else}
        <!-- Category Filter -->
        <div class="filter-section">
          <div class="filter-label">Filter by:</div>
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
          {#each filteredHomelabs as homelab}
            <a href="/homelab/{homelab.slug}" class="homelab-card">
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
                  Read Documentation
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </span>
              </div>
            </a>
          {/each}
        </div>
      {/if}
    </div>
  </section>
</main>

<Footer />

<style>
  .homelab-page {
    padding-top: 73px;
    min-height: 100vh;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  /* Hero Section */
  .hero-section {
    padding: 4rem 0 3rem;
    background: linear-gradient(180deg, rgba(139, 92, 246, 0.05) 0%, transparent 100%);
    border-bottom: 1px solid var(--color-border-default);
  }

  .terminal-line {
    font-family: var(--font-mono);
    font-size: 0.875rem;
    color: var(--color-text-tertiary);
    margin-bottom: 1rem;
  }

  .prompt {
    color: var(--color-accent-blue);
    margin-right: 0.5rem;
  }

  .command {
    color: var(--color-accent-green);
  }

  .page-title {
    font-size: 3.5rem;
    font-weight: 700;
    color: var(--color-text-primary);
    margin-bottom: 1rem;
  }

  .text-gradient {
    background: linear-gradient(135deg, var(--color-accent-blue-light) 0%, var(--color-accent-green) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .page-subtitle {
    font-size: 1.25rem;
    color: var(--color-text-tertiary);
    margin: 0;
  }

  /* Content Section */
  .content-section {
    padding: 4rem 0 6rem;
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
    border: 3px solid var(--color-border-default);
    border-top-color: var(--color-accent-blue);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .loading p {
    color: var(--color-text-tertiary);
    font-size: 1.0625rem;
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
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%);
    border: 1px solid var(--color-border-default);
    border-radius: var(--radius-lg);
    margin: 0 auto 2rem;
    color: var(--color-accent-blue-light);
  }

  .empty-state h2 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-text-primary);
    margin-bottom: 1rem;
  }

  .empty-state p {
    font-size: 1.125rem;
    color: var(--color-text-secondary);
  }

  /* Filter Section */
  .filter-section {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 3rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid var(--color-border-default);
  }

  .filter-label {
    font-weight: 600;
    color: var(--color-text-primary);
    font-size: 1.0625rem;
  }

  .category-filters {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .category-btn {
    padding: 0.5rem 1.25rem;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border-default);
    border-radius: var(--radius-full);
    color: var(--color-text-secondary);
    font-size: 0.9375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-base);
  }

  .category-btn:hover {
    border-color: var(--color-accent-blue);
    color: var(--color-accent-blue-light);
    transform: translateY(-1px);
  }

  .category-btn.active {
    background: var(--color-accent-blue);
    border-color: var(--color-accent-blue);
    color: white;
  }

  /* Homelab Grid */
  .homelab-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 2rem;
  }

  .homelab-card {
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border-default);
    border-radius: var(--radius-lg);
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    transition: all var(--transition-base);
    text-decoration: none;
    color: inherit;
  }

  .homelab-card:hover {
    border-color: var(--color-accent-blue);
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(139, 92, 246, 0.15);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
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
    background: rgba(var(--difficulty-color), 0.15);
    border: 1px solid var(--difficulty-color);
    border-radius: var(--radius-full);
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--difficulty-color);
    text-transform: capitalize;
  }

  .card-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-text-primary);
    margin: 0;
    line-height: 1.3;
  }

  .card-description {
    font-size: 1rem;
    line-height: 1.7;
    color: var(--color-text-secondary);
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
    font-size: 0.9375rem;
  }

  .meta-item svg {
    flex-shrink: 0;
    color: var(--color-accent-blue-light);
  }

  .hardware-info {
    font-family: var(--font-mono);
    font-size: 0.875rem;
  }

  .services-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .service-tag {
    padding: 0.375rem 0.75rem;
    background: var(--color-bg-tertiary);
    border: 1px solid var(--color-border-default);
    border-radius: var(--radius-sm);
    font-size: 0.8125rem;
    color: var(--color-accent-secondary-light);
    font-weight: 500;
    font-family: var(--font-mono);
  }

  .service-tag.more {
    color: var(--color-text-tertiary);
    font-style: italic;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.625rem;
  }

  .tag {
    font-size: 0.8125rem;
    color: var(--color-text-tertiary);
    font-family: var(--font-mono);
  }

  .card-footer {
    padding-top: 1rem;
    border-top: 1px solid var(--color-border-default);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .read-more {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    color: var(--color-accent-blue-light);
    font-size: 0.9375rem;
    transition: gap var(--transition-base);
  }

  .homelab-card:hover .read-more {
    gap: 0.75rem;
  }

  .read-more svg {
    transition: transform var(--transition-base);
  }

  .homelab-card:hover .read-more svg {
    transform: translateX(4px);
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
      font-size: 1.125rem;
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

    .homelab-card {
      padding: 1.5rem;
    }

    .card-title {
      font-size: 1.25rem;
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
  }
</style>
