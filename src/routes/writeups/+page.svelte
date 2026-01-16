<script lang="ts">
  import { onMount } from 'svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import WriteupCard from '$lib/components/WriteupCard.svelte';

  let writeups: any[] = [];
  let filteredWriteups: any[] = [];
  let selectedPlatform = 'all';
  let selectedDifficulty = 'all';
  let selectedCategory = 'all';
  let searchQuery = '';
  let sortBy = 'date';
  let loading = true;

  // Load writeups from API (automatically parses frontmatter from markdown files)
  onMount(async () => {
    try {
      const response = await fetch('/api/writeups');
      if (response.ok) {
        writeups = await response.json();
      }
    } catch (error) {
      console.error('Error loading writeups:', error);
    }
    loading = false;
  });

  const platforms = [
    { id: 'all', label: 'All Platforms', icon: '🌐' },
    { id: 'HackTheBox', label: 'HackTheBox', icon: '🎯' },
    { id: 'TryHackMe', label: 'TryHackMe', icon: '🔐' },
    { id: 'PortSwigger', label: 'PortSwigger', icon: '🔬' }
  ];

  const difficulties = [
    { id: 'all', label: 'All Levels' },
    { id: 'Easy', label: 'Easy' },
    { id: 'Intermediate', label: 'Intermediate' },
    { id: 'Medium', label: 'Medium' },
    { id: 'Advanced', label: 'Advanced' },
    { id: 'Hard', label: 'Hard' }
  ];

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'Web', label: 'Web' },
    { id: 'Linux', label: 'Linux' },
    { id: 'Windows', label: 'Windows' },
    { id: 'Active Directory', label: 'Active Directory' },
    { id: 'Network', label: 'Network' },
    { id: 'Crypto', label: 'Cryptography' }
  ];

  $: {
    filteredWriteups = writeups.filter(writeup => {
      const matchesPlatform = selectedPlatform === 'all' || writeup.platform === selectedPlatform;
      const matchesDifficulty = selectedDifficulty === 'all' || writeup.difficulty === selectedDifficulty;
      const matchesCategory = selectedCategory === 'all' || writeup.category === selectedCategory;

      if (searchQuery === '') {
        return matchesPlatform && matchesDifficulty && matchesCategory;
      }

      const query = searchQuery.toLowerCase();
      const matchesSearch = (
        writeup.title.toLowerCase().includes(query) ||
        writeup.description.toLowerCase().includes(query) ||
        writeup.tags.some((tag: string) => tag.toLowerCase().includes(query))
      );

      return matchesPlatform && matchesDifficulty && matchesCategory && matchesSearch;
    });

    if (sortBy === 'date') {
      filteredWriteups = filteredWriteups.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === 'title') {
      filteredWriteups = filteredWriteups.sort((a, b) => a.title.localeCompare(b.title));
    }
  }
</script>

<svelte:head>
  <title>CTF Writeups | Your Portfolio</title>
  <meta name="description" content="CTF challenges, penetration testing writeups, and security walkthroughs." />
</svelte:head>

<Navbar />

<main class="writeups-page">
  <section class="page-hero">
    <div class="hero-content">
      <div class="terminal-line">
        <span class="prompt">$</span>
        <span class="command">cat ~/writeups/README.md</span>
      </div>
      <h1 class="page-title">
        CTF <span class="text-gradient">Writeups</span>
      </h1>
      <p class="page-subtitle">
        Detailed walkthroughs of CTF challenges, penetration testing labs, and security research.
        From initial enumeration to root flags.
      </p>

      <div class="stats-row">
        <div class="stat">
          <span class="stat-value">{writeups.length}</span>
          <span class="stat-label">Total Writeups</span>
        </div>
        <div class="stat">
          <span class="stat-value">{writeups.filter(w => w.platform === 'HackTheBox').length}</span>
          <span class="stat-label">HackTheBox</span>
        </div>
        <div class="stat">
          <span class="stat-value">{writeups.filter(w => w.platform === 'TryHackMe').length}</span>
          <span class="stat-label">TryHackMe</span>
        </div>
        <div class="stat">
          <span class="stat-value">{writeups.filter(w => w.platform === 'PortSwigger').length}</span>
          <span class="stat-label">PortSwigger</span>
        </div>
      </div>
    </div>
  </section>

  <section class="filters-section">
    <div class="filters-container">
      <div class="search-box">
        <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <input
          type="text"
          placeholder="Search writeups, tags, or keywords..."
          bind:value={searchQuery}
          class="search-input"
        />
        {#if searchQuery}
          <button class="clear-search" on:click={() => searchQuery = ''} aria-label="Clear search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        {/if}
      </div>

      <div class="filter-group">
        <label for="platform-group" class="filter-label">Platform</label>
        <div id="platform-group" class="platform-tabs">
          {#each platforms as platform}
            <button
              class="platform-tab"
              class:active={selectedPlatform === platform.id}
              on:click={() => selectedPlatform = platform.id}
            >
              <span class="tab-icon">{platform.icon}</span>
              {platform.label}
            </button>
          {/each}
        </div>
      </div>

      <div class="filter-row">
        <div class="select-wrapper">
          <label for="writeup-difficulty-select" class="filter-label">Difficulty</label>
          <select id="writeup-difficulty-select" bind:value={selectedDifficulty} class="filter-select">
            {#each difficulties as difficulty}
              <option value={difficulty.id}>{difficulty.label}</option>
            {/each}
          </select>
        </div>

        <div class="select-wrapper">
          <label for="writeup-category-select" class="filter-label">Category</label>
          <select id="writeup-category-select" bind:value={selectedCategory} class="filter-select">
            {#each categories as category}
              <option value={category.id}>{category.label}</option>
            {/each}
          </select>
        </div>

        <div class="select-wrapper">
          <label for="writeup-sort-select" class="filter-label">Sort By</label>
          <select id="writeup-sort-select" bind:value={sortBy} class="filter-select">
            <option value="date">Latest First</option>
            <option value="title">Alphabetical</option>
          </select>
        </div>
      </div>
    </div>
  </section>

  <section class="writeups-section">
    <div class="writeups-container">
      {#if loading}
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading writeups...</p>
        </div>
      {:else if filteredWriteups.length === 0}
        <div class="no-results">
          <div class="no-results-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h3>No writeups found</h3>
          <p>Try adjusting your filters or search query.</p>
          <button class="btn-secondary" on:click={() => {
            selectedPlatform = 'all';
            selectedDifficulty = 'all';
            selectedCategory = 'all';
            searchQuery = '';
          }}>
            Clear Filters
          </button>
        </div>
      {:else}
        <div class="writeups-grid">
          {#each filteredWriteups as writeup (writeup.id)}
            <WriteupCard {writeup} />
          {/each}
        </div>
      {/if}
    </div>
  </section>
</main>

<Footer />

<style>
  .writeups-page {
    padding-top: 73px;
  }

  .page-hero {
    padding: 4rem 0 3rem;
    background: linear-gradient(180deg, rgba(83, 155, 245, 0.05) 0%, transparent 100%);
  }

  .hero-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
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
    line-height: 1.6;
    color: var(--color-text-tertiary);
    max-width: 700px;
    margin-bottom: 2rem;
  }

  .stats-row {
    display: flex;
    gap: 3rem;
    flex-wrap: wrap;
  }

  .stat {
    display: flex;
    flex-direction: column;
  }

  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    font-family: var(--font-mono);
    background: linear-gradient(135deg, var(--color-accent-blue-light) 0%, var(--color-accent-green) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .stat-label {
    font-size: 0.875rem;
    color: var(--color-text-tertiary);
    margin-top: 0.25rem;
  }

  .filters-section {
    padding: 2rem 0;
    background: var(--color-bg-secondary);
    border-top: 1px solid var(--color-border-default);
    border-bottom: 1px solid var(--color-border-default);
  }

  .filters-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .search-box {
    position: relative;
    max-width: 600px;
  }

  .search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-text-tertiary);
    pointer-events: none;
  }

  .search-input {
    width: 100%;
    padding: 0.875rem 3rem 0.875rem 3rem;
    background: var(--color-bg-tertiary);
    border: 1px solid var(--color-border-default);
    border-radius: var(--radius-lg);
    color: var(--color-text-primary);
    font-family: var(--font-mono);
    font-size: 0.9rem;
    transition: all var(--transition-base);
  }

  .search-input:focus {
    outline: none;
    border-color: var(--color-accent-blue);
    box-shadow: 0 0 0 3px rgba(83, 155, 245, 0.1);
  }

  .search-input::placeholder {
    color: var(--color-text-tertiary);
  }

  .clear-search {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    background: transparent;
    border: none;
    color: var(--color-text-tertiary);
    cursor: pointer;
    padding: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-sm);
    transition: all var(--transition-base);
  }

  .clear-search:hover {
    color: var(--color-text-primary);
    background: rgba(255, 255, 255, 0.05);
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .filter-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text-tertiary);
    font-family: var(--font-mono);
  }

  .platform-tabs {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .platform-tab {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1.25rem;
    background: var(--color-bg-tertiary);
    border: 1px solid var(--color-border-default);
    border-radius: var(--radius-md);
    color: var(--color-text-tertiary);
    font-family: var(--font-mono);
    font-size: 0.875rem;
    cursor: pointer;
    transition: all var(--transition-base);
  }

  .platform-tab:hover {
    border-color: var(--color-accent-blue);
    color: var(--color-text-primary);
  }

  .platform-tab.active {
    background: rgba(83, 155, 245, 0.15);
    border-color: var(--color-accent-blue);
    color: var(--color-accent-blue-light);
  }

  .tab-icon {
    font-size: 1rem;
  }

  .filter-row {
    display: flex;
    gap: 1rem;
  }

  .select-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .filter-select {
    padding: 0.75rem 1rem;
    background: var(--color-bg-tertiary);
    border: 1px solid var(--color-border-default);
    border-radius: var(--radius-md);
    color: var(--color-text-primary);
    font-family: var(--font-mono);
    font-size: 0.875rem;
    cursor: pointer;
    transition: all var(--transition-base);
  }

  .filter-select:focus {
    outline: none;
    border-color: var(--color-accent-blue);
  }

  .filter-select:hover {
    border-color: var(--color-accent-blue);
  }

  .writeups-section {
    padding: 4rem 0 6rem;
  }

  .writeups-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .writeups-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: 2rem;
  }

  .loading-state {
    text-align: center;
    padding: 4rem 2rem;
    color: var(--color-text-tertiary);
  }

  .spinner {
    width: 48px;
    height: 48px;
    border: 3px solid var(--color-border-default);
    border-top-color: var(--color-accent-blue);
    border-radius: 50%;
    margin: 0 auto 1.5rem;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .loading-state p {
    font-family: var(--font-mono);
    font-size: 0.875rem;
  }

  .no-results {
    text-align: center;
    padding: 4rem 2rem;
  }

  .no-results-icon {
    color: var(--color-text-muted);
    margin-bottom: 1.5rem;
  }

  .no-results h3 {
    color: var(--color-text-primary);
    margin-bottom: 0.5rem;
  }

  .no-results p {
    color: var(--color-text-tertiary);
    margin-bottom: 1.5rem;
  }

  .btn-secondary {
    padding: 0.75rem 1.5rem;
    background: var(--color-bg-tertiary);
    border: 1px solid var(--color-border-default);
    border-radius: var(--radius-md);
    color: var(--color-text-primary);
    font-family: var(--font-mono);
    font-size: 0.875rem;
    cursor: pointer;
    transition: all var(--transition-base);
  }

  .btn-secondary:hover {
    border-color: var(--color-accent-blue);
    background: rgba(83, 155, 245, 0.1);
  }

  @media (max-width: 1024px) {
    .page-title {
      font-size: 2.75rem;
    }

    .writeups-grid {
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    }
  }

  @media (max-width: 768px) {
    .hero-content,
    .filters-container,
    .writeups-container {
      padding: 0 1.5rem;
    }

    .page-hero {
      padding: 3rem 0 2rem;
    }

    .page-title {
      font-size: 2.25rem;
    }

    .page-subtitle {
      font-size: 1.125rem;
    }

    .stats-row {
      gap: 1.5rem;
    }

    .platform-tabs {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
    }

    .platform-tab {
      justify-content: center;
    }

    .filter-row {
      flex-direction: column;
    }

    .writeups-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 480px) {
    .page-title {
      font-size: 2rem;
    }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .platform-tabs {
      grid-template-columns: 1fr;
    }

    .search-input {
      font-size: 0.875rem;
    }
  }
</style>
