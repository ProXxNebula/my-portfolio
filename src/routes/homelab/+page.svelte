<script lang="ts">
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
</script>

<svelte:head>
  <title>Homelab | Your Portfolio</title>
  <meta name="description" content="Homelab setup and infrastructure" />
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
      <div class="coming-soon-card">
        <div class="icon-container">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
        </div>
        <h2>Coming Soon</h2>
        <p>Documentation of my homelab setup, infrastructure, and self-hosted services will be available here soon.</p>

        <div class="planned-content">
          <h3>Planned Content</h3>
          <ul>
            <li>Server hardware and specifications</li>
            <li>Virtualization and containerization setup</li>
            <li>Network architecture and security</li>
            <li>Self-hosted services and applications</li>
            <li>Monitoring and automation</li>
          </ul>
        </div>
      </div>
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

  .coming-soon-card {
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border-default);
    border-radius: var(--radius-lg);
    padding: 4rem 3rem;
    max-width: 700px;
    margin: 0 auto;
    text-align: center;
  }

  .icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 96px;
    height: 96px;
    background: linear-gradient(135deg, rgba(83, 155, 245, 0.1) 0%, rgba(119, 221, 119, 0.1) 100%);
    border: 1px solid var(--color-border-default);
    border-radius: var(--radius-lg);
    margin: 0 auto 2rem;
    color: var(--color-accent-blue-light);
  }

  .coming-soon-card h2 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-text-primary);
    margin-bottom: 1rem;
  }

  .coming-soon-card > p {
    font-size: 1.125rem;
    line-height: 1.8;
    color: var(--color-text-secondary);
    margin-bottom: 3rem;
  }

  .planned-content {
    text-align: left;
    padding: 2rem;
    background: var(--color-bg-tertiary);
    border: 1px solid var(--color-border-default);
    border-radius: var(--radius-md);
  }

  .planned-content h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: 1.25rem;
    font-family: var(--font-mono);
  }

  .planned-content ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .planned-content li {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: var(--color-text-secondary);
    line-height: 1.7;
  }

  .planned-content li::before {
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

    .page-subtitle {
      font-size: 1.125rem;
    }

    .content-section {
      padding: 3rem 0 4rem;
    }

    .coming-soon-card {
      padding: 3rem 2rem;
    }

    .coming-soon-card h2 {
      font-size: 1.75rem;
    }

    .coming-soon-card > p {
      font-size: 1rem;
    }

    .planned-content {
      padding: 1.5rem;
    }
  }

  @media (max-width: 480px) {
    .page-title {
      font-size: 2rem;
    }

    .coming-soon-card {
      padding: 2rem 1.5rem;
    }

    .icon-container {
      width: 80px;
      height: 80px;
    }
  }
</style>
