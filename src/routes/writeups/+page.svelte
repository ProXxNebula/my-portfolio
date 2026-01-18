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
  let visible = false;

  // Pagination
  let currentPage = 1;
  const itemsPerPage = 9;
  $: totalPages = Math.ceil(filteredWriteups.length / itemsPerPage);
  $: paginatedWriteups = filteredWriteups.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
      // Scroll to top of writeups section
      document.querySelector('.writeups-section')?.scrollIntoView({ behavior: 'smooth' });
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

  // Load writeups from API (automatically parses frontmatter from markdown files)
  onMount(async () => {
    visible = true;
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
    { id: 'all', label: 'All Platforms' },
    { id: 'HackTheBox', label: 'HackTheBox' },
    { id: 'TryHackMe', label: 'TryHackMe' },
    { id: 'PortSwigger', label: 'PortSwigger' }
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

    // Reset to page 1 when filters change
    currentPage = 1;
  }
</script>

<svelte:head>
  <title>CTF Writeups | Your Portfolio</title>
  <meta name="description" content="CTF challenges, penetration testing writeups, and security walkthroughs." />
</svelte:head>

<Navbar />

<main class="writeups-page" class:visible>
  <!-- Animated Background -->
  <div class="cyber-bg">
    <div class="grid-overlay"></div>
    <div class="glow-orb orb-1"></div>
    <div class="glow-orb orb-2"></div>
    <div class="scan-line"></div>
  </div>

  <section class="page-hero">
    <div class="hero-content">
      <div class="cyber-badge animate-fadeIn">
        <span class="status-indicator"></span>
        <span class="badge-text">CLASSIFIED_DOCUMENTS: UNLOCKED</span>
      </div>

      <div class="terminal-line animate-slideUp">
        <span class="prompt">$</span>
        <span class="command">cat ~/writeups/README.md</span>
      </div>

      <h1 class="page-title animate-slideUp">
        <span class="title-line">CTF</span>
        <span class="title-gradient">Writeups</span>
      </h1>

      <p class="page-subtitle animate-slideUp">
        Detailed walkthroughs of CTF challenges, penetration testing labs, and security research.
        From initial enumeration to root flags.
      </p>

      <div class="stats-container animate-fadeIn">
        <div class="stat-card">
          <span class="stat-value">{writeups.length}</span>
          <span class="stat-label">TOTAL</span>
          <div class="stat-glow"></div>
        </div>
        <div class="stat-divider">
          <span class="divider-line"></span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{writeups.filter(w => w.platform === 'HackTheBox').length}</span>
          <span class="stat-label">HTB</span>
          <div class="stat-glow"></div>
        </div>
        <div class="stat-divider">
          <span class="divider-line"></span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{writeups.filter(w => w.platform === 'TryHackMe').length}</span>
          <span class="stat-label">THM</span>
          <div class="stat-glow"></div>
        </div>
        <div class="stat-divider">
          <span class="divider-line"></span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{writeups.filter(w => w.platform === 'PortSwigger').length}</span>
          <span class="stat-label">PORTSWIGGER</span>
          <div class="stat-glow"></div>
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
        <label for="platform-group" class="filter-label">PLATFORM</label>
        <div id="platform-group" class="platform-tabs">
          {#each platforms as platform}
            <button
              class="platform-tab"
              class:active={selectedPlatform === platform.id}
              on:click={() => selectedPlatform = platform.id}
            >
              {platform.label}
            </button>
          {/each}
        </div>
      </div>

      <div class="filter-row">
        <div class="select-wrapper">
          <label for="writeup-difficulty-select" class="filter-label">DIFFICULTY</label>
          <select id="writeup-difficulty-select" bind:value={selectedDifficulty} class="filter-select">
            {#each difficulties as difficulty}
              <option value={difficulty.id}>{difficulty.label}</option>
            {/each}
          </select>
        </div>

        <div class="select-wrapper">
          <label for="writeup-category-select" class="filter-label">CATEGORY</label>
          <select id="writeup-category-select" bind:value={selectedCategory} class="filter-select">
            {#each categories as category}
              <option value={category.id}>{category.label}</option>
            {/each}
          </select>
        </div>

        <div class="select-wrapper">
          <label for="writeup-sort-select" class="filter-label">SORT_BY</label>
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
      <div class="section-header">
        <div class="header-line left"></div>
        <h2 class="section-title">
          <span class="title-bracket">[</span>
          ALL_WRITEUPS
          <span class="title-bracket">]</span>
        </h2>
        <div class="header-line right"></div>
      </div>

      {#if loading}
        <div class="loading-state">
          <div class="spinner"></div>
          <p>LOADING_WRITEUPS...</p>
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
          <h3>NO_RESULTS_FOUND</h3>
          <p>Try adjusting your filters or search query.</p>
          <button class="cyber-btn secondary" on:click={() => {
            selectedPlatform = 'all';
            selectedDifficulty = 'all';
            selectedCategory = 'all';
            searchQuery = '';
          }}>
            <span class="btn-content">Clear Filters</span>
          </button>
        </div>
      {:else}
        <div class="writeups-grid">
          {#each paginatedWriteups as writeup, i (writeup.slug)}
            <div class="writeup-wrapper" style="animation-delay: {i * 0.1}s">
              <WriteupCard {writeup} />
            </div>
          {/each}
        </div>

        <!-- Pagination -->
        {#if totalPages > 1}
          <div class="pagination">
            <div class="pagination-info">
              Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredWriteups.length)} of {filteredWriteups.length}
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
     Writeups Page - Cyberpunk Theme
     =================================== */

  .writeups-page {
    padding-top: 73px;
    opacity: 0;
    transition: opacity 0.6s ease;
    position: relative;
    min-height: 100vh;
  }

  .writeups-page.visible {
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

  /* Hero Section */
  .page-hero {
    padding: 5rem 0 3.5rem;
    position: relative;
  }

  .hero-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 3rem;
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
    flex-direction: column;
    gap: 0.25rem;
  }

  .title-line {
    color: var(--color-text-primary);
    letter-spacing: -0.02em;
  }

  .title-gradient {
    background: linear-gradient(135deg, var(--color-accent-blue-light) 0%, var(--color-accent-secondary) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.02em;
  }

  .page-subtitle {
    font-size: 1.15rem;
    line-height: 1.75;
    color: var(--color-text-secondary);
    max-width: 650px;
    margin-bottom: 2.5rem;
  }

  /* Stats Container */
  .stats-container {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex-wrap: wrap;
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

  /* Filters Section */
  .filters-section {
    padding: 2rem 0;
    background: rgba(5, 5, 12, 0.5);
    border-top: 1px solid rgba(139, 92, 246, 0.2);
    border-bottom: 1px solid rgba(139, 92, 246, 0.2);
    backdrop-filter: blur(10px);
  }

  .filters-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 3rem;
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
    border: 1px solid rgba(139, 92, 246, 0.2);
    border-radius: 2px;
    color: var(--color-text-primary);
    font-family: var(--font-mono);
    font-size: 0.9rem;
    transition: all var(--transition-base);
  }

  .search-input:focus {
    outline: none;
    border-color: var(--color-accent-blue);
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15), 0 0 20px rgba(139, 92, 246, 0.1);
  }

  .search-input::placeholder {
    color: var(--color-text-muted);
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
    border-radius: 2px;
    transition: all var(--transition-base);
  }

  .clear-search:hover {
    color: var(--color-accent-blue-light);
    background: rgba(139, 92, 246, 0.1);
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .filter-label {
    font-size: 0.7rem;
    font-weight: 500;
    color: var(--color-text-muted);
    font-family: var(--font-mono);
    letter-spacing: 0.1em;
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
    border: 1px solid rgba(139, 92, 246, 0.2);
    border-radius: 2px;
    color: var(--color-text-tertiary);
    font-family: var(--font-mono);
    font-size: 0.8rem;
    cursor: pointer;
    transition: all var(--transition-base);
  }

  .platform-tab:hover {
    border-color: var(--color-accent-blue);
    color: var(--color-text-primary);
  }

  .platform-tab.active {
    background: rgba(139, 92, 246, 0.15);
    border-color: var(--color-accent-blue);
    color: var(--color-accent-blue-light);
    box-shadow: 0 0 15px rgba(139, 92, 246, 0.2);
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
    border: 1px solid rgba(139, 92, 246, 0.2);
    border-radius: 2px;
    color: var(--color-text-primary);
    font-family: var(--font-mono);
    font-size: 0.8rem;
    cursor: pointer;
    transition: all var(--transition-base);
  }

  .filter-select:focus {
    outline: none;
    border-color: var(--color-accent-blue);
    box-shadow: 0 0 15px rgba(139, 92, 246, 0.15);
  }

  .filter-select:hover {
    border-color: var(--color-accent-blue);
  }

  /* Writeups Section */
  .writeups-section {
    padding: 5rem 0 7rem;
  }

  .writeups-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 3rem;
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

  .writeups-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: 2rem;
  }

  .writeup-wrapper {
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

  .loading-state {
    text-align: center;
    padding: 4rem 2rem;
    color: var(--color-text-tertiary);
  }

  .spinner {
    width: 48px;
    height: 48px;
    border: 3px solid rgba(139, 92, 246, 0.2);
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
    letter-spacing: 0.1em;
  }

  .no-results {
    text-align: center;
    padding: 4rem 2rem;
  }

  .no-results-icon {
    color: var(--color-accent-blue);
    margin-bottom: 1.5rem;
    opacity: 0.5;
  }

  .no-results h3 {
    font-family: var(--font-mono);
    color: var(--color-text-primary);
    margin-bottom: 0.5rem;
    letter-spacing: 0.1em;
  }

  .no-results p {
    color: var(--color-text-tertiary);
    margin-bottom: 1.5rem;
  }

  .cyber-btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    padding: 0.875rem 1.75rem;
    font-family: var(--font-mono);
    font-size: 0.875rem;
    font-weight: 500;
    text-decoration: none;
    border: none;
    cursor: pointer;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .cyber-btn.secondary {
    background: rgba(139, 92, 246, 0.1);
    color: var(--color-accent-blue-light);
    border: 1px solid rgba(139, 92, 246, 0.3);
  }

  .cyber-btn.secondary:hover {
    background: rgba(139, 92, 246, 0.2);
    border-color: var(--color-accent-blue);
    box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
  }

  .btn-content {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 0.5rem;
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

  /* Responsive */
  @media (max-width: 1200px) {
    .hero-content,
    .filters-container,
    .writeups-container {
      padding: 0 2rem;
    }
  }

  @media (max-width: 1024px) {
    .page-title {
      font-size: 2.75rem;
    }

    .writeups-grid {
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    }

    .writeups-section {
      padding: 4rem 0 5rem;
    }
  }

  @media (max-width: 768px) {
    .hero-content,
    .filters-container,
    .writeups-container {
      padding: 0 1.5rem;
    }

    .page-hero {
      padding: 4rem 0 2.5rem;
    }

    .page-title {
      font-size: 2.25rem;
    }

    .page-subtitle {
      font-size: 1.05rem;
    }

    .stats-container {
      gap: 1rem;
    }

    .stat-divider {
      display: none;
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
      gap: 1.5rem;
    }

    .writeups-section {
      padding: 3rem 0 4rem;
    }
  }

  @media (max-width: 480px) {
    .page-hero {
      padding: 3rem 0 2rem;
    }

    .page-title {
      font-size: 2rem;
    }

    .page-subtitle {
      font-size: 1rem;
    }

    .stats-container {
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

  /* Light Mode Overrides */
  :global(:root[data-theme="light"]) .filters-section {
    background: rgba(248, 247, 252, 0.95);
    border-top-color: rgba(124, 58, 237, 0.15);
    border-bottom-color: rgba(124, 58, 237, 0.15);
  }

  :global(:root[data-theme="light"]) .platform-tab {
    background: var(--color-bg-elevated);
    border-color: rgba(124, 58, 237, 0.2);
    color: var(--color-text-tertiary);
  }

  :global(:root[data-theme="light"]) .platform-tab:hover {
    border-color: var(--color-accent-primary);
    color: var(--color-text-primary);
  }

  :global(:root[data-theme="light"]) .platform-tab.active {
    background: rgba(124, 58, 237, 0.1);
    border-color: var(--color-accent-primary);
    color: var(--color-accent-primary);
  }

  :global(:root[data-theme="light"]) .search-input {
    background: var(--color-bg-elevated);
    border-color: rgba(124, 58, 237, 0.2);
    color: var(--color-text-primary);
  }

  :global(:root[data-theme="light"]) .search-input:focus {
    border-color: var(--color-accent-primary);
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
  }

  :global(:root[data-theme="light"]) .filter-select {
    background: var(--color-bg-elevated);
    border-color: rgba(124, 58, 237, 0.2);
    color: var(--color-text-primary);
  }

  :global(:root[data-theme="light"]) .filter-select:focus,
  :global(:root[data-theme="light"]) .filter-select:hover {
    border-color: var(--color-accent-primary);
  }

  :global(:root[data-theme="light"]) .stat-card {
    background: rgba(124, 58, 237, 0.05);
    border-color: rgba(124, 58, 237, 0.15);
  }

  :global(:root[data-theme="light"]) .section-title {
    color: var(--color-text-primary);
  }

  :global(:root[data-theme="light"]) .pagination-btn {
    background: var(--color-bg-elevated);
    border-color: rgba(124, 58, 237, 0.2);
    color: var(--color-text-secondary);
  }

  :global(:root[data-theme="light"]) .pagination-btn:hover:not(:disabled) {
    border-color: var(--color-accent-primary);
    color: var(--color-accent-primary);
  }

  :global(:root[data-theme="light"]) .pagination-btn.active {
    background: var(--color-accent-primary);
    border-color: var(--color-accent-primary);
    color: white;
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
