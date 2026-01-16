<script lang="ts">
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
</script>

<svelte:head>
  <title>About | Your Portfolio</title>
  <meta name="description" content="Documentation of my projects and writeups" />
</svelte:head>

<Navbar />

<main class="about-page">
  <section class="hero-section">
    <div class="container">
      <div class="terminal-line">
        <span class="prompt">$</span>
        <span class="command">cat ~/about.md</span>
      </div>
      <h1 class="page-title">
        About This <span class="text-gradient">Portfolio</span>
      </h1>
    </div>
  </section>

  <section class="content-section">
    <div class="container">
      <div class="content-card">
        <div class="card-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
        </div>
        <h2>Documentation Hub</h2>
        <p class="lead-text">
          This website serves as a central repository for documenting my cybersecurity journey, technical projects, and learning experiences.
        </p>

        <div class="info-grid">
          <div class="info-item">
            <div class="info-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
            </div>
            <div class="info-content">
              <h3>Projects</h3>
              <p>Technical projects showcasing development skills, tools, and implementations across various technologies.</p>
            </div>
          </div>

          <div class="info-item">
            <div class="info-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
              </svg>
            </div>
            <div class="info-content">
              <h3>CTF Writeups</h3>
              <p>Detailed walkthroughs of Capture The Flag challenges from platforms like HackTheBox, TryHackMe, and PortSwigger.</p>
            </div>
          </div>

          <div class="info-item">
            <div class="info-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <div class="info-content">
              <h3>Learning Journey</h3>
              <p>A collection of notes, techniques, and methodologies learned through hands-on practice and research.</p>
            </div>
          </div>
        </div>

        <div class="purpose-section">
          <h3>Purpose</h3>
          <p>
            This portfolio exists to:
          </p>
          <ul class="purpose-list">
            <li>Document technical knowledge and skills</li>
            <li>Share learning experiences with the community</li>
            <li>Track progress in cybersecurity and development</li>
            <li>Serve as a reference for future projects</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</main>

<Footer />

<style>
  .about-page {
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
    background: linear-gradient(180deg, rgba(83, 155, 245, 0.05) 0%, transparent 100%);
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
    margin: 0;
  }

  .text-gradient {
    background: linear-gradient(135deg, var(--color-accent-blue-light) 0%, var(--color-accent-green) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* Content Section */
  .content-section {
    padding: 4rem 0 6rem;
  }

  .content-card {
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border-default);
    border-radius: var(--radius-lg);
    padding: 3rem;
    max-width: 900px;
    margin: 0 auto;
  }

  .card-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, rgba(83, 155, 245, 0.1) 0%, rgba(119, 221, 119, 0.1) 100%);
    border: 1px solid var(--color-border-default);
    border-radius: var(--radius-lg);
    margin-bottom: 2rem;
    color: var(--color-accent-blue-light);
  }

  .content-card h2 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-text-primary);
    margin-bottom: 1.5rem;
  }

  .lead-text {
    font-size: 1.25rem;
    line-height: 1.8;
    color: var(--color-text-secondary);
    margin-bottom: 3rem;
  }

  /* Info Grid */
  .info-grid {
    display: grid;
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .info-item {
    display: flex;
    gap: 1.5rem;
    padding: 1.5rem;
    background: var(--color-bg-tertiary);
    border: 1px solid var(--color-border-default);
    border-radius: var(--radius-md);
    transition: all var(--transition-base);
  }

  .info-item:hover {
    border-color: var(--color-accent-blue);
    transform: translateY(-2px);
  }

  .info-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    background: rgba(83, 155, 245, 0.1);
    border-radius: var(--radius-md);
    color: var(--color-accent-blue-light);
    flex-shrink: 0;
  }

  .info-content h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: 0.5rem;
  }

  .info-content p {
    color: var(--color-text-secondary);
    line-height: 1.7;
    margin: 0;
  }

  /* Purpose Section */
  .purpose-section {
    padding-top: 2rem;
    border-top: 1px solid var(--color-border-default);
  }

  .purpose-section h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: 1rem;
  }

  .purpose-section > p {
    color: var(--color-text-secondary);
    line-height: 1.8;
    margin-bottom: 1rem;
  }

  .purpose-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .purpose-list li {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: var(--color-text-secondary);
    line-height: 1.7;
    font-size: 1.0625rem;
  }

  .purpose-list li::before {
    content: "▸";
    color: var(--color-accent-blue-light);
    font-weight: 600;
    font-size: 1.25rem;
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

    .content-section {
      padding: 3rem 0 4rem;
    }

    .content-card {
      padding: 2rem 1.5rem;
    }

    .content-card h2 {
      font-size: 1.75rem;
    }

    .lead-text {
      font-size: 1.125rem;
    }

    .info-item {
      flex-direction: column;
      gap: 1rem;
    }

    .info-icon {
      width: 40px;
      height: 40px;
    }
  }

  @media (max-width: 480px) {
    .page-title {
      font-size: 2rem;
    }

    .content-card h2 {
      font-size: 1.5rem;
    }

    .lead-text {
      font-size: 1rem;
    }
  }
</style>
