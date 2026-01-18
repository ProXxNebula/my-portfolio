<script lang="ts">
  import { onMount } from 'svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import ProjectCard from '$lib/components/ProjectCard.svelte';
  import projectsData from '$lib/../data/projects.json';

  interface Project {
    title: string;
    description: string;
    tags: string[];
    date: string;
    [key: string]: unknown;
  }

  let projects: Project[] = projectsData as Project[];
  let filteredProjects: Project[] = projectsData as Project[];
  let searchQuery = '';
  let sortBy = 'date';
  let visible = false;

  onMount(() => {
    visible = true;
  });

  $: {
    filteredProjects = projects.filter((project: Project) => {
      if (searchQuery === '') return true;

      const query = searchQuery.toLowerCase();
      return (
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.tags.some((tag: string) => tag.toLowerCase().includes(query))
      );
    });

    if (sortBy === 'date') {
      filteredProjects = filteredProjects.sort((a: Project, b: Project) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === 'title') {
      filteredProjects = filteredProjects.sort((a: Project, b: Project) => a.title.localeCompare(b.title));
    }
  }
</script>

<svelte:head>
  <title>Projects | Your Portfolio</title>
  <meta name="description" content="Explore my open-source projects and development work." />
</svelte:head>

<Navbar />

<main class="projects-page" class:visible>
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
        <span class="badge-text">REPOSITORY_ACCESS: GRANTED</span>
      </div>

      <div class="terminal-line animate-slideUp">
        <span class="prompt">$</span>
        <span class="command">ls -la ~/projects</span>
      </div>

      <h1 class="page-title animate-slideUp">
        <span class="title-line">Open Source</span>
        <span class="title-gradient">Projects</span>
      </h1>

      <p class="page-subtitle animate-slideUp">
        Collection of tools, utilities, and infrastructure projects. Built with security, performance, and automation in mind.
      </p>

      <div class="stats-container animate-fadeIn">
        <div class="stat-card">
          <span class="stat-value">{projects.length}</span>
          <span class="stat-label">PROJECTS</span>
          <div class="stat-glow"></div>
        </div>
        <div class="stat-divider">
          <span class="divider-line"></span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{projects.filter(p => p.featured).length}</span>
          <span class="stat-label">FEATURED</span>
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
          placeholder="Search projects or tags..."
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

      <div class="select-wrapper">
        <label for="sort-select" class="filter-label">SORT_BY</label>
        <select id="sort-select" bind:value={sortBy} class="filter-select">
          <option value="date">Latest First</option>
          <option value="title">Alphabetical</option>
        </select>
      </div>
    </div>
  </section>

  <section class="projects-section">
    <div class="projects-container">
      <div class="section-header">
        <div class="header-line left"></div>
        <h2 class="section-title">
          <span class="title-bracket">[</span>
          ALL_PROJECTS
          <span class="title-bracket">]</span>
        </h2>
        <div class="header-line right"></div>
      </div>

      {#if filteredProjects.length === 0}
        <div class="no-results">
          <div class="no-results-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h3>NO_RESULTS_FOUND</h3>
          <p>Try adjusting your search query.</p>
          <button class="cyber-btn secondary" on:click={() => searchQuery = ''}>
            <span class="btn-content">Clear Search</span>
          </button>
        </div>
      {:else}
        <div class="projects-grid">
          {#each filteredProjects as project, i (project.id)}
            <div class="project-wrapper" style="animation-delay: {i * 0.1}s">
              <ProjectCard {project} />
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </section>
</main>

<Footer />

<style>
  /* ===================================
     Projects Page - Cyberpunk Theme
     =================================== */

  .projects-page {
    padding-top: 73px;
    opacity: 0;
    transition: opacity 0.6s ease;
    position: relative;
    min-height: 100vh;
  }

  .projects-page.visible {
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
    right: -200px;
    animation: floatOrb 20s ease-in-out infinite;
  }

  .orb-2 {
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, transparent 70%);
    bottom: -150px;
    left: -150px;
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
  }

  .title-gradient {
    background: linear-gradient(135deg, var(--color-accent-blue-light) 0%, var(--color-accent-secondary) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
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
    gap: 1rem;
    align-items: flex-end;
  }

  .search-box {
    position: relative;
    flex: 1;
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

  .select-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-width: 180px;
  }

  .filter-label {
    font-size: 0.7rem;
    font-weight: 500;
    color: var(--color-text-muted);
    font-family: var(--font-mono);
    letter-spacing: 0.1em;
  }

  .filter-select {
    padding: 0.875rem 1rem;
    background: var(--color-bg-tertiary);
    border: 1px solid rgba(139, 92, 246, 0.2);
    border-radius: 2px;
    color: var(--color-text-primary);
    font-family: var(--font-mono);
    font-size: 0.875rem;
    cursor: pointer;
    transition: all var(--transition-base);
  }

  .filter-select:focus {
    outline: none;
    border-color: var(--color-accent-blue);
    box-shadow: 0 0 20px rgba(139, 92, 246, 0.15);
  }

  .filter-select:hover {
    border-color: var(--color-accent-blue);
  }

  /* Projects Section */
  .projects-section {
    padding: 5rem 0 7rem;
  }

  .projects-container {
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

  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: 2rem;
  }

  .project-wrapper {
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
    .projects-container {
      padding: 0 2rem;
    }
  }

  @media (max-width: 1024px) {
    .page-title {
      font-size: 2.75rem;
    }

    .projects-grid {
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    }

    .projects-section {
      padding: 4rem 0 5rem;
    }
  }

  @media (max-width: 768px) {
    .hero-content,
    .filters-container,
    .projects-container {
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
      flex-wrap: wrap;
      justify-content: flex-start;
      gap: 1rem;
    }

    .stat-divider {
      display: none;
    }

    .filters-container {
      flex-direction: column;
      align-items: stretch;
    }

    .search-box {
      max-width: 100%;
    }

    .projects-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .projects-section {
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

    .search-input {
      font-size: 0.875rem;
    }

    .cyber-badge {
      padding: 0.4rem 0.75rem;
    }

    .badge-text {
      font-size: 0.65rem;
    }
  }

  /* Light Mode Overrides */
  :global(:root[data-theme="light"]) .filters-section {
    background: rgba(248, 247, 252, 0.95);
    border-top-color: rgba(124, 58, 237, 0.15);
    border-bottom-color: rgba(124, 58, 237, 0.15);
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

  :global(:root[data-theme="light"]) .project-card .card-border {
    background: var(--color-bg-elevated);
    border-color: rgba(124, 58, 237, 0.15);
  }

  :global(:root[data-theme="light"]) .project-card:hover .card-border {
    border-color: rgba(124, 58, 237, 0.4);
  }
</style>
