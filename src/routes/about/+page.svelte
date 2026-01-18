<script lang="ts">
  import { onMount } from 'svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';

  let visible = false;

  onMount(() => {
    visible = true;
  });
</script>

<svelte:head>
  <title>About | Security Enthusiast</title>
  <meta name="description" content="A hobbyist's journey into security, CTFs, and tool development" />
</svelte:head>

<Navbar />

<main class="about-page" class:visible>
  <!-- Animated Background -->
  <div class="cyber-bg">
    <div class="grid-overlay"></div>
    <div class="glow-orb orb-1"></div>
    <div class="glow-orb orb-2"></div>
  </div>

  <section class="hero-section">
    <div class="container">
      <div class="cyber-badge">
        <span class="status-indicator"></span>
        <span class="badge-text">USER_PROFILE: LOADED</span>
      </div>
      <div class="terminal-line">
        <span class="prompt">$</span>
        <span class="command">cat ~/about.md</span>
      </div>
      <h1 class="page-title">
        <span class="title-line">About This</span>
        <span class="title-gradient">Portfolio</span>
      </h1>
      <p class="page-subtitle">
        A space for documenting my learning journey in cybersecurity and development.
      </p>
    </div>
  </section>

  <section class="content-section">
    <div class="container">
      <div class="content-grid">
        <!-- Main Content Card -->
        <div class="main-card">
          <div class="card-header">
            <div class="card-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h2>Hey, I'm XORRav</h2>
          </div>
          <p class="lead-text">
            I'm not a professional penetration tester or security researcher — just a curious hobbyist who loves figuring out how things work (and how they break). This site documents my learning journey through CTFs, homelab experiments, and whatever else catches my interest.
          </p>

          <!-- Info Cards -->
          <div class="info-grid">
            <div class="info-card">
              <div class="info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="16 18 22 12 16 6"></polyline>
                  <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
              </div>
              <h3>Projects & Tools</h3>
              <p>Random things I've built while learning - scripts, tools, and experiments that helped me understand concepts better.</p>
            </div>

            <div class="info-card">
              <div class="info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                </svg>
              </div>
              <h3>CTF Writeups</h3>
              <p>Notes and walkthroughs from CTF challenges I've attempted on HackTheBox, TryHackMe, PortSwigger, and similar platforms.</p>
            </div>

            <div class="info-card">
              <div class="info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
              </div>
              <h3>Homelab Stuff</h3>
              <p>Documentation of my homelab setup - servers, containers, networking experiments, and things that broke along the way.</p>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="sidebar">
          <!-- Purpose Section -->
          <div class="sidebar-card">
            <div class="sidebar-header">
              <span class="bracket">[</span>
              WHY_THIS_SITE
              <span class="bracket">]</span>
            </div>
            <ul class="purpose-list">
              <li>Keep notes for myself (and maybe help others)</li>
              <li>Document what I've learned and tried</li>
              <li>Have a place to share writeups and experiments</li>
              <li>Track my progress as I learn new things</li>
            </ul>
          </div>

          <!-- Disclaimer Section -->
          <div class="disclaimer-card">
            <div class="disclaimer-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <span>Disclaimer</span>
            </div>
            <p>
              I'm just a hobbyist and enthusiast learning this stuff for fun. I'm not a certified professional, and you shouldn't take anything here as expert advice.
            </p>
            <p class="disclaimer-emphasis">
              All security techniques, tools, and knowledge shared on this site are intended for educational purposes and authorized testing only.
            </p>
            <p>
              Always get proper permission before testing on systems you don't own. Use this information ethically and responsibly.
            </p>
          </div>
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
    opacity: 0;
    transition: opacity 0.6s ease;
    position: relative;
  }

  .about-page.visible {
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
    opacity: 0.35;
  }

  .orb-1 {
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%);
    top: -150px;
    right: -100px;
    animation: floatOrb 20s ease-in-out infinite;
  }

  .orb-2 {
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, transparent 70%);
    bottom: 0;
    left: -100px;
    animation: floatOrb 25s ease-in-out infinite reverse;
  }

  @keyframes floatOrb {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(30px, -30px) scale(1.05); }
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  /* Hero Section */
  .hero-section {
    padding: 5rem 0 4rem;
    position: relative;
  }

  .cyber-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 1rem;
    background: rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(139, 92, 246, 0.3);
    border-radius: 2px;
    margin-bottom: 1.5rem;
    position: relative;
  }

  .cyber-badge::before,
  .cyber-badge::after {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    border: 1px solid var(--color-accent-primary);
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
    color: var(--color-accent-primary-light);
    letter-spacing: 0.1em;
  }

  .terminal-line {
    font-family: var(--font-mono);
    font-size: 0.875rem;
    color: var(--color-text-tertiary);
    margin-bottom: 1rem;
  }

  .prompt {
    color: var(--color-accent-primary-light);
    margin-right: 0.5rem;
  }

  .command {
    color: var(--color-accent-secondary);
  }

  .page-title {
    font-size: 3.25rem;
    font-weight: 700;
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .title-line {
    color: var(--color-text-primary);
  }

  .title-gradient {
    background: linear-gradient(135deg, var(--color-accent-primary-light) 0%, var(--color-accent-secondary) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .page-subtitle {
    font-size: 1.15rem;
    line-height: 1.7;
    color: var(--color-text-secondary);
    max-width: 600px;
  }

  /* Content Section */
  .content-section {
    padding: 2rem 0 6rem;
  }

  .content-grid {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 2.5rem;
    align-items: start;
  }

  /* Main Card */
  .main-card {
    background: var(--color-bg-secondary);
    border: 1px solid rgba(139, 92, 246, 0.2);
    border-radius: 8px;
    padding: 2.5rem;
    position: relative;
  }

  .main-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--color-accent-primary), var(--color-accent-secondary));
    border-radius: 8px 8px 0 0;
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .card-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%);
    border: 1px solid rgba(139, 92, 246, 0.3);
    border-radius: 8px;
    color: var(--color-accent-primary-light);
  }

  .main-card h2 {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--color-text-primary);
  }

  .lead-text {
    font-size: 1.1rem;
    line-height: 1.85;
    color: var(--color-text-secondary);
    margin-bottom: 2.5rem;
  }

  /* Info Grid */
  .info-grid {
    display: grid;
    gap: 1.25rem;
  }

  .info-card {
    display: flex;
    gap: 1.25rem;
    padding: 1.5rem;
    background: var(--color-bg-tertiary);
    border: 1px solid rgba(139, 92, 246, 0.15);
    border-radius: 6px;
    transition: all 0.3s ease;
  }

  .info-card:hover {
    border-color: rgba(139, 92, 246, 0.4);
    transform: translateX(4px);
    box-shadow: 0 4px 20px rgba(139, 92, 246, 0.1);
  }

  .info-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    background: rgba(139, 92, 246, 0.1);
    border-radius: 6px;
    color: var(--color-accent-primary-light);
    flex-shrink: 0;
  }

  .info-card h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: 0.5rem;
  }

  .info-card p {
    color: var(--color-text-secondary);
    line-height: 1.7;
    font-size: 0.95rem;
    margin: 0;
  }

  /* Sidebar */
  .sidebar {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    position: sticky;
    top: 100px;
  }

  .sidebar-card {
    background: var(--color-bg-secondary);
    border: 1px solid rgba(139, 92, 246, 0.2);
    border-radius: 8px;
    padding: 1.75rem;
  }

  .sidebar-header {
    font-family: var(--font-mono);
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: 1.25rem;
    letter-spacing: 0.05em;
  }

  .bracket {
    color: var(--color-accent-primary);
  }

  .purpose-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
  }

  .purpose-list li {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    color: var(--color-text-secondary);
    line-height: 1.6;
    font-size: 0.95rem;
  }

  .purpose-list li::before {
    content: "▸";
    color: var(--color-accent-primary-light);
    font-weight: 600;
    flex-shrink: 0;
    margin-top: 0.1rem;
  }

  /* Disclaimer Card */
  .disclaimer-card {
    background: rgba(255, 107, 107, 0.03);
    border: 1px solid rgba(255, 107, 107, 0.2);
    border-left: 3px solid var(--color-accent-pink);
    border-radius: 8px;
    padding: 1.5rem;
  }

  .disclaimer-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-accent-pink);
    margin-bottom: 1rem;
  }

  .disclaimer-card p {
    color: var(--color-text-secondary);
    line-height: 1.7;
    font-size: 0.9rem;
    margin-bottom: 0.875rem;
  }

  .disclaimer-card p:last-child {
    margin-bottom: 0;
  }

  .disclaimer-emphasis {
    color: var(--color-text-primary) !important;
    font-weight: 500;
    background: rgba(255, 107, 107, 0.05);
    padding: 0.75rem;
    border-radius: 4px;
    border: 1px solid rgba(255, 107, 107, 0.1);
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    .content-grid {
      grid-template-columns: 1fr;
    }

    .sidebar {
      position: static;
      flex-direction: row;
      flex-wrap: wrap;
    }

    .sidebar-card,
    .disclaimer-card {
      flex: 1;
      min-width: 280px;
    }
  }

  @media (max-width: 768px) {
    .container {
      padding: 0 1.5rem;
    }

    .hero-section {
      padding: 4rem 0 3rem;
    }

    .page-title {
      font-size: 2.5rem;
    }

    .page-subtitle {
      font-size: 1.05rem;
    }

    .content-section {
      padding: 1.5rem 0 4rem;
    }

    .main-card {
      padding: 2rem 1.5rem;
    }

    .main-card h2 {
      font-size: 1.5rem;
    }

    .lead-text {
      font-size: 1rem;
    }

    .info-card {
      flex-direction: column;
      gap: 1rem;
    }

    .sidebar {
      flex-direction: column;
    }

    .sidebar-card,
    .disclaimer-card {
      min-width: 100%;
    }
  }

  @media (max-width: 480px) {
    .page-title {
      font-size: 2rem;
    }

    .cyber-badge {
      padding: 0.4rem 0.75rem;
    }

    .badge-text {
      font-size: 0.65rem;
    }

    .card-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
    }

    .main-card h2 {
      font-size: 1.35rem;
    }
  }

  /* Light Mode Overrides */
  :global(:root[data-theme="light"]) .main-card {
    background: var(--color-bg-elevated);
    border-color: rgba(124, 58, 237, 0.15);
  }

  :global(:root[data-theme="light"]) .info-card {
    background: var(--color-bg-secondary);
    border-color: rgba(124, 58, 237, 0.12);
  }

  :global(:root[data-theme="light"]) .info-card:hover {
    border-color: rgba(124, 58, 237, 0.35);
  }

  :global(:root[data-theme="light"]) .sidebar-card {
    background: var(--color-bg-elevated);
    border-color: rgba(124, 58, 237, 0.15);
  }

  :global(:root[data-theme="light"]) .disclaimer-card {
    background: rgba(255, 107, 107, 0.05);
    border-color: rgba(255, 107, 107, 0.25);
  }

  :global(:root[data-theme="light"]) .card-icon {
    background: linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(8, 145, 178, 0.1) 100%);
    border-color: rgba(124, 58, 237, 0.25);
  }

  :global(:root[data-theme="light"]) .info-icon {
    background: rgba(124, 58, 237, 0.08);
  }

  :global(:root[data-theme="light"]) .stat-card {
    background: rgba(124, 58, 237, 0.05);
    border-color: rgba(124, 58, 237, 0.15);
  }
</style>
