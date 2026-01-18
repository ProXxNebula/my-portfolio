<script lang="ts">
  import { onMount } from 'svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import projectsData from '$lib/../data/projects.json';

  interface Project {
    title: string;
    description: string;
    tags: string[];
    date: string;
    featured?: boolean;
    githubUrl?: string;
    [key: string]: unknown;
  }

  let visible = false;
  let featuredWriteups: any[] = [];
  let writeupsCount = 0;

  onMount(async () => {
    visible = true;

    // Fetch writeups from API
    try {
      const response = await fetch('/api/writeups');
      if (response.ok) {
        const writeups = await response.json();
        writeupsCount = writeups.length;
        featuredWriteups = writeups.filter((w: any) => w.featured).slice(0, 3);
      }
    } catch (error) {
      console.error('Error loading writeups:', error);
    }
  });

  const projects = projectsData as Project[];
  const featuredProjects = projects.filter((p: Project) => p.featured).slice(0, 3);

  const interests = [
    { name: 'Offensive Security', icon: '&#x1F480;' },
    { name: 'Tool Development', icon: '&#x1F6E0;' },
    { name: 'CTF Challenges', icon: '&#x1F3C1;' },
    { name: 'Linux Tinkering', icon: '&#x1F427;' },
    { name: 'Scripting', icon: '&#x1F40D;' },
    { name: 'Homelab Experiments', icon: '&#x1F5A5;' }
  ];

  function getDifficultyColor(difficulty: string): string {
    switch(difficulty) {
      case 'Easy': return 'var(--color-success)';
      case 'Medium': return 'var(--color-warning)';
      case 'Hard': return 'var(--color-error)';
      default: return 'var(--color-text-tertiary)';
    }
  }
</script>

<svelte:head>
  <title>Security Enthusiast | Portfolio</title>
  <meta name="description" content="A hobbyist exploring offensive security, CTF challenges, and tool development. Check out my writeups and homelab experiments." />
</svelte:head>

<Navbar />

<main class="landing-page" class:visible>
  <!-- Animated Background -->
  <div class="cyber-bg">
    <div class="grid-overlay"></div>
    <div class="glow-orb orb-1"></div>
    <div class="glow-orb orb-2"></div>
    <div class="scan-line"></div>
  </div>

  <!-- Hero Section -->
  <section class="hero-section">
    <div class="hero-container">
      <div class="hero-content">
        <div class="cyber-badge animate-fadeIn">
          <span class="status-indicator"></span>
          <span class="badge-text">SYSTEM_STATUS: ACTIVE</span>
        </div>

        <h1 class="hero-title animate-slideUp">
          <span class="title-greeting">Hey, I'm XORRav</span>
          <span class="title-gradient">Security Enthusiast</span>
        </h1>

        <p class="hero-description animate-slideUp">
          A curious hobbyist who enjoys breaking things (ethically), building tools, and exploring offensive security through CTF challenges and homelab experiments. Not a pro — just passionate about learning.
        </p>

        <div class="hero-actions animate-slideUp">
          <a href="/projects" class="cyber-btn primary">
            <span class="btn-bg"></span>
            <span class="btn-content">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              </svg>
              View Projects
            </span>
          </a>
          <a href="/writeups" class="cyber-btn secondary">
            <span class="btn-border"></span>
            <span class="btn-content">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              Read Writeups
            </span>
          </a>
        </div>

        <div class="stats-container animate-fadeIn">
          <div class="stat-card">
            <span class="stat-value">{projectsData.length}</span>
            <span class="stat-label">PROJECTS</span>
            <div class="stat-glow"></div>
          </div>
          <div class="stat-divider">
            <span class="divider-line"></span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{writeupsCount}</span>
            <span class="stat-label">WRITEUPS</span>
            <div class="stat-glow"></div>
          </div>
          <div class="stat-divider">
            <span class="divider-line"></span>
          </div>
          <div class="stat-card">
            <span class="stat-value">24/7</span>
            <span class="stat-label">LEARNING</span>
            <div class="stat-glow"></div>
          </div>
        </div>
      </div>

      <div class="hero-visual animate-fadeIn">
        <div class="terminal-frame">
          <div class="terminal-chrome">
            <div class="terminal-dots">
              <span class="dot red"></span>
              <span class="dot yellow"></span>
              <span class="dot green"></span>
            </div>
            <span class="terminal-title">root@kali:~/security</span>
          </div>
          <div class="terminal-screen">
            <div class="terminal-line">
              <span class="prompt">$</span>
              <span class="command">./scanner.py --target 10.10.10.0/24</span>
            </div>
            <div class="terminal-output">
              <span class="output-line success">[+] Initiating network scan...</span>
              <span class="output-line info">[*] Scanning 256 hosts</span>
              <span class="output-line success">[+] Found 12 active hosts</span>
              <span class="output-line warning">[!] Detected open ports: 22, 80, 443</span>
              <span class="output-line success">[+] Vulnerabilities identified: 3 critical</span>
              <span class="cursor">_</span>
            </div>
          </div>
          <div class="terminal-reflection"></div>
        </div>
      </div>
    </div>
  </section>

  <!-- Interests Section -->
  <section class="skills-section">
    <div class="section-container">
      <div class="section-header">
        <div class="header-line left"></div>
        <h2 class="section-title">
          <span class="title-bracket">[</span>
          STUFF_I_EXPLORE
          <span class="title-bracket">]</span>
        </h2>
        <div class="header-line right"></div>
      </div>

      <div class="skills-grid">
        {#each interests as interest, i}
          <div class="skill-card" style="animation-delay: {i * 0.1}s">
            <div class="skill-icon">{@html interest.icon}</div>
            <span class="skill-name">{interest.name}</span>
            <div class="skill-corner tl"></div>
            <div class="skill-corner br"></div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Featured Projects Section -->
  <section class="featured-section">
    <div class="section-container">
      <div class="section-header">
        <div class="header-line left"></div>
        <h2 class="section-title">
          <span class="title-bracket">[</span>
          FEATURED_PROJECTS
          <span class="title-bracket">]</span>
        </h2>
        <div class="header-line right"></div>
      </div>
      <p class="section-subtitle">Open-source security tools and infrastructure projects</p>
      <a href="/projects" class="view-all-link">
        View all projects
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </a>

      <div class="projects-grid">
        {#each featuredProjects as project}
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" class="project-card">
            <div class="card-glow"></div>
            <div class="card-border"></div>
            <div class="card-content">
              <div class="card-header">
                <h3 class="card-title">{project.title}</h3>
                <svg class="external-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </div>
              <p class="card-description">{project.description}</p>
              <div class="card-tags">
                {#each project.tags as tag}
                  <span class="cyber-tag">{tag}</span>
                {/each}
              </div>
            </div>
            <div class="card-scan-line"></div>
          </a>
        {/each}
      </div>
    </div>
  </section>

  <!-- Featured Writeups Section -->
  <section class="writeups-section">
    <div class="section-container">
      <div class="section-header">
        <div class="header-line left"></div>
        <h2 class="section-title">
          <span class="title-bracket">[</span>
          LATEST_WRITEUPS
          <span class="title-bracket">]</span>
        </h2>
        <div class="header-line right"></div>
      </div>
      <p class="section-subtitle">Recent CTF challenges and penetration testing walkthroughs</p>
      <a href="/writeups" class="view-all-link">
        View all writeups
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </a>

      <div class="writeups-grid">
        {#each featuredWriteups as writeup}
          <a href="/writeups/{writeup.slug}" class="writeup-card">
            <div class="writeup-glow"></div>
            <div class="writeup-border"></div>
            <div class="writeup-content">
              <div class="writeup-header">
                <div class="writeup-badges">
                  <span class="platform-badge">{writeup.platform}</span>
                  <span class="difficulty-badge" style="--diff-color: {getDifficultyColor(writeup.difficulty)}">
                    {writeup.difficulty}
                  </span>
                </div>
                <div class="writeup-indicator"></div>
              </div>
              <h3 class="writeup-title">{writeup.title}</h3>
              <p class="writeup-description">{writeup.description}</p>
              <div class="writeup-tags">
                {#each writeup.tags?.slice(0, 4) || [] as tag}
                  <span class="cyber-tag-sm">{tag}</span>
                {/each}
              </div>
              <div class="writeup-footer">
                <span class="read-more">
                  ACCESS_WRITEUP
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </span>
              </div>
            </div>
            <div class="writeup-scan-line"></div>
          </a>
        {/each}
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="cta-section">
    <div class="cta-container">
      <div class="cta-bg">
        <div class="cta-grid"></div>
      </div>
      <div class="cta-content">
        <h2 class="cta-title">
          <span class="title-bracket">[</span>
          INITIATE_CONNECTION
          <span class="title-bracket">]</span>
        </h2>
        <p class="cta-description">
          Interested in collaboration, security research, or discussing the latest vulnerabilities?
          Let's connect and build something secure together.
        </p>
        <div class="cta-actions">
          <a href="https://github.com/XORRav" target="_blank" rel="noopener noreferrer" class="cyber-btn primary">
            <span class="btn-bg"></span>
            <span class="btn-content">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub Profile
            </span>
          </a>
        </div>
      </div>
    </div>
  </section>
</main>

<Footer />

<style>
  /* ===================================
     Landing Page - Cyberpunk Theme
     =================================== */

  .landing-page {
    opacity: 0;
    transition: opacity 0.6s ease;
    position: relative;
    overflow-x: hidden;
  }

  .landing-page.visible {
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
  .hero-section {
    min-height: calc(100vh - 73px);
    display: flex;
    align-items: center;
    padding: 8rem 0 6rem;
    position: relative;
  }

  .hero-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 3rem;
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 5rem;
    align-items: center;
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

  .badge-text {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--color-accent-blue-light);
    letter-spacing: 0.1em;
  }

  /* Hero Title */
  .hero-title {
    font-size: 3.5rem;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 1.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .title-greeting {
    font-size: 1.5rem;
    font-weight: 500;
    color: var(--color-text-secondary);
    letter-spacing: 0;
  }

  .title-gradient {
    background: linear-gradient(135deg, var(--color-accent-blue-light) 0%, var(--color-accent-secondary) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: none;
    letter-spacing: -0.02em;
  }

  .hero-description {
    font-size: 1.15rem;
    line-height: 1.85;
    color: var(--color-text-secondary);
    margin-bottom: 2.75rem;
    max-width: 540px;
    letter-spacing: 0.01em;
  }

  /* Cyber Buttons */
  .hero-actions {
    display: flex;
    gap: 1rem;
    margin-bottom: 3rem;
    flex-wrap: wrap;
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

  .cyber-btn.primary {
    background: transparent;
    color: var(--color-bg-primary);
  }

  .cyber-btn.primary .btn-bg {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, var(--color-accent-blue) 0%, var(--color-accent-secondary) 100%);
    z-index: 0;
    transition: transform 0.3s ease;
  }

  .cyber-btn.primary:hover .btn-bg {
    transform: scale(1.05);
  }

  .cyber-btn.primary::before,
  .cyber-btn.primary::after {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    border: 2px solid rgba(255, 255, 255, 0.5);
    z-index: 2;
  }

  .cyber-btn.primary::before {
    top: 4px;
    left: 4px;
    border-right: none;
    border-bottom: none;
  }

  .cyber-btn.primary::after {
    bottom: 4px;
    right: 4px;
    border-left: none;
    border-top: none;
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

  .cyber-btn.secondary .btn-border {
    position: absolute;
    inset: 0;
    border: 1px solid transparent;
    background: linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-secondary)) border-box;
    -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .cyber-btn.secondary:hover .btn-border {
    opacity: 1;
  }

  .btn-content {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 0.5rem;
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

  /* Terminal Visual */
  .hero-visual {
    position: relative;
    perspective: 1000px;
  }

  .terminal-frame {
    position: relative;
    background: var(--color-bg-secondary);
    border: 1px solid rgba(139, 92, 246, 0.3);
    border-radius: 8px;
    overflow: hidden;
    transform: rotateY(-5deg) rotateX(5deg);
    transition: transform 0.5s ease;
    box-shadow:
      0 0 0 1px rgba(139, 92, 246, 0.1),
      0 20px 50px -10px rgba(0, 0, 0, 0.5),
      0 0 100px -20px rgba(139, 92, 246, 0.3);
  }

  .terminal-frame:hover {
    transform: rotateY(0deg) rotateX(0deg);
  }

  .terminal-chrome {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 1rem;
    background: rgba(139, 92, 246, 0.1);
    border-bottom: 1px solid rgba(139, 92, 246, 0.2);
  }

  .terminal-dots {
    display: flex;
    gap: 6px;
  }

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }

  .dot.red { background: #ff5f56; }
  .dot.yellow { background: #ffbd2e; }
  .dot.green { background: #27c93f; }

  .terminal-title {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--color-text-tertiary);
  }

  .terminal-screen {
    padding: 1.5rem;
    font-family: var(--font-mono);
    font-size: 0.875rem;
  }

  .terminal-line {
    margin-bottom: 1rem;
  }

  .prompt {
    color: var(--color-accent-blue-light);
    margin-right: 0.5rem;
  }

  .command {
    color: var(--color-accent-secondary);
  }

  .terminal-output {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .output-line {
    display: block;
  }

  .output-line.success { color: var(--color-success); }
  .output-line.info { color: var(--color-accent-blue-light); }
  .output-line.warning { color: var(--color-warning); }

  .cursor {
    color: var(--color-accent-blue-light);
    animation: blink 1s step-end infinite;
  }

  .terminal-reflection {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, transparent 50%);
    pointer-events: none;
  }

  /* Section Styles */
  .skills-section,
  .featured-section,
  .writeups-section {
    padding: 7rem 0;
    position: relative;
  }

  .section-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 3rem;
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    margin-bottom: 1rem;
  }

  .header-line {
    flex: 1;
    max-width: 200px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.5));
  }

  .header-line.right {
    background: linear-gradient(90deg, rgba(139, 92, 246, 0.5), transparent);
  }

  .section-title {
    font-family: var(--font-mono);
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-text-primary);
    letter-spacing: 0.05em;
    text-align: center;
    white-space: nowrap;
  }

  .title-bracket {
    color: var(--color-accent-blue);
  }

  .section-subtitle {
    text-align: center;
    color: var(--color-text-secondary);
    font-size: 1.05rem;
    margin-bottom: 0.75rem;
    line-height: 1.6;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .view-all-link {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-family: var(--font-mono);
    font-size: 0.875rem;
    color: var(--color-accent-blue-light);
    margin-bottom: 3rem;
    transition: all 0.3s ease;
  }

  .view-all-link:hover {
    gap: 0.75rem;
    color: var(--color-accent-secondary);
  }

  /* Skills Grid */
  .skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 1.5rem;
  }

  .skill-card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding: 2rem 1.5rem;
    background: rgba(139, 92, 246, 0.05);
    border: 1px solid rgba(139, 92, 246, 0.15);
    transition: all 0.3s ease;
    animation: fadeInUp 0.6s ease backwards;
  }

  .skill-card:hover {
    background: rgba(139, 92, 246, 0.1);
    border-color: rgba(139, 92, 246, 0.4);
    transform: translateY(-4px);
    box-shadow: 0 10px 40px -10px rgba(139, 92, 246, 0.3);
  }

  .skill-corner {
    position: absolute;
    width: 12px;
    height: 12px;
    border: 1px solid var(--color-accent-blue);
    opacity: 0.5;
    transition: opacity 0.3s ease;
  }

  .skill-card:hover .skill-corner {
    opacity: 1;
  }

  .skill-corner.tl {
    top: -1px;
    left: -1px;
    border-right: none;
    border-bottom: none;
  }

  .skill-corner.br {
    bottom: -1px;
    right: -1px;
    border-left: none;
    border-top: none;
  }

  .skill-icon {
    font-size: 2rem;
  }

  .skill-name {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    color: var(--color-text-secondary);
    text-align: center;
  }

  /* Projects Grid */
  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
  }

  .project-card {
    position: relative;
    display: block;
    text-decoration: none;
    color: inherit;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .project-card .card-glow {
    position: absolute;
    inset: -2px;
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(6, 182, 212, 0.3));
    filter: blur(15px);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 0;
  }

  .project-card:hover .card-glow {
    opacity: 1;
  }

  .project-card .card-border {
    position: absolute;
    inset: 0;
    background: var(--color-bg-tertiary);
    border: 1px solid rgba(139, 92, 246, 0.2);
    z-index: 1;
    transition: border-color 0.3s ease;
  }

  .project-card:hover .card-border {
    border-color: rgba(139, 92, 246, 0.5);
  }

  .project-card .card-content {
    position: relative;
    z-index: 2;
    padding: 1.75rem;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
  }

  .card-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-text-primary);
  }

  .external-icon {
    color: var(--color-text-muted);
    transition: all 0.3s ease;
    flex-shrink: 0;
  }

  .project-card:hover .external-icon {
    color: var(--color-accent-blue-light);
    transform: translate(2px, -2px);
  }

  .card-description {
    color: var(--color-text-tertiary);
    line-height: 1.6;
    margin-bottom: 1.25rem;
    font-size: 0.95rem;
  }

  .card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .cyber-tag {
    padding: 0.3rem 0.75rem;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--color-text-muted);
    background: rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(139, 92, 246, 0.2);
    transition: all 0.3s ease;
  }

  .cyber-tag:hover {
    color: var(--color-accent-blue-light);
    border-color: rgba(139, 92, 246, 0.5);
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

  .project-card:hover .card-scan-line {
    transform: scaleX(1);
  }

  /* Writeups Grid */
  .writeups-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
    gap: 2rem;
  }

  .writeup-card {
    position: relative;
    display: block;
    text-decoration: none;
    color: inherit;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .writeup-card .writeup-glow {
    position: absolute;
    inset: -2px;
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(6, 182, 212, 0.25));
    filter: blur(20px);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 0;
  }

  .writeup-card:hover .writeup-glow {
    opacity: 1;
  }

  .writeup-card .writeup-border {
    position: absolute;
    inset: 0;
    background: var(--color-bg-tertiary);
    border: 1px solid rgba(139, 92, 246, 0.2);
    z-index: 1;
    transition: all 0.3s ease;
  }

  .writeup-card:hover .writeup-border {
    border-color: rgba(139, 92, 246, 0.5);
  }

  .writeup-card .writeup-content {
    position: relative;
    z-index: 2;
    padding: 1.75rem;
  }

  .writeup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .writeup-badges {
    display: flex;
    gap: 0.75rem;
  }

  .platform-badge {
    padding: 0.35rem 0.75rem;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--color-accent-blue-light);
    background: rgba(139, 92, 246, 0.15);
    border: 1px solid rgba(139, 92, 246, 0.3);
    letter-spacing: 0.05em;
  }

  .difficulty-badge {
    padding: 0.35rem 0.75rem;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--diff-color);
    background: color-mix(in srgb, var(--diff-color) 15%, transparent);
    border: 1px solid color-mix(in srgb, var(--diff-color) 40%, transparent);
    letter-spacing: 0.05em;
  }

  .writeup-indicator {
    width: 8px;
    height: 8px;
    background: var(--color-accent-blue);
    box-shadow: 0 0 10px var(--color-accent-blue);
    animation: pulse 2s ease-in-out infinite;
  }

  .writeup-title {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: 0.75rem;
    line-height: 1.4;
  }

  .writeup-description {
    color: var(--color-text-tertiary);
    font-size: 0.9rem;
    line-height: 1.6;
    margin-bottom: 1.25rem;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .writeup-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.25rem;
  }

  .cyber-tag-sm {
    padding: 0.2rem 0.5rem;
    font-family: var(--font-mono);
    font-size: 0.65rem;
    color: var(--color-text-muted);
    background: rgba(139, 92, 246, 0.08);
    border: 1px solid rgba(139, 92, 246, 0.15);
    transition: all 0.3s ease;
  }

  .writeup-footer {
    padding-top: 1rem;
    border-top: 1px solid rgba(139, 92, 246, 0.1);
  }

  .read-more {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--color-accent-blue-light);
    letter-spacing: 0.1em;
    transition: all 0.3s ease;
  }

  .writeup-card:hover .read-more {
    gap: 0.75rem;
    color: var(--color-accent-secondary);
  }

  .writeup-scan-line {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--color-accent-secondary), transparent);
    transform: scaleX(0);
    transition: transform 0.3s ease;
    z-index: 3;
  }

  .writeup-card:hover .writeup-scan-line {
    transform: scaleX(1);
  }

  /* CTA Section */
  .cta-section {
    padding: 6rem 0;
    position: relative;
  }

  .cta-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 4rem 3rem;
    position: relative;
    background: rgba(139, 92, 246, 0.05);
    border: 1px solid rgba(139, 92, 246, 0.2);
    overflow: hidden;
  }

  .cta-container::before,
  .cta-container::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border: 2px solid var(--color-accent-blue);
  }

  .cta-container::before {
    top: -1px;
    left: -1px;
    border-right: none;
    border-bottom: none;
  }

  .cta-container::after {
    bottom: -1px;
    right: -1px;
    border-left: none;
    border-top: none;
  }

  .cta-bg {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }

  .cta-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(139, 92, 246, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(139, 92, 246, 0.05) 1px, transparent 1px);
    background-size: 30px 30px;
  }

  .cta-content {
    position: relative;
    text-align: center;
    z-index: 1;
  }

  .cta-title {
    font-family: var(--font-mono);
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: var(--color-text-primary);
  }

  .cta-description {
    font-size: 1.1rem;
    line-height: 1.7;
    color: var(--color-text-tertiary);
    margin-bottom: 2rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .cta-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  /* Animations */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
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

  .animate-fadeIn {
    animation: fadeIn 0.8s ease backwards;
  }

  .animate-slideUp {
    animation: fadeInUp 0.8s ease backwards;
  }

  .animate-slideUp:nth-child(2) { animation-delay: 0.1s; }
  .animate-slideUp:nth-child(3) { animation-delay: 0.2s; }
  .animate-slideUp:nth-child(4) { animation-delay: 0.3s; }

  /* Responsive */
  @media (max-width: 1200px) {
    .hero-container {
      gap: 4rem;
      padding: 0 2rem;
    }

    .section-container {
      padding: 0 2rem;
    }
  }

  @media (max-width: 1024px) {
    .hero-container {
      grid-template-columns: 1fr;
      gap: 3rem;
      text-align: center;
    }

    .hero-content {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .hero-title {
      font-size: 2.75rem;
      align-items: center;
    }

    .title-greeting {
      font-size: 1.35rem;
    }

    .hero-description {
      max-width: 600px;
    }

    .hero-visual {
      max-width: 500px;
      margin: 0 auto;
    }

    .terminal-frame {
      transform: none;
    }

    .projects-grid,
    .writeups-grid {
      grid-template-columns: 1fr;
    }

    .skills-section,
    .featured-section,
    .writeups-section {
      padding: 5rem 0;
    }
  }

  @media (max-width: 768px) {
    .hero-section {
      padding: 5rem 0 3rem;
    }

    .hero-container {
      padding: 0 1.5rem;
    }

    .hero-title {
      font-size: 2.25rem;
    }

    .title-greeting {
      font-size: 1.15rem;
    }

    .hero-description {
      font-size: 1.05rem;
      line-height: 1.7;
    }

    .stats-container {
      flex-wrap: wrap;
      justify-content: center;
      gap: 1rem;
    }

    .stat-divider {
      display: none;
    }

    .section-container {
      padding: 0 1.5rem;
    }

    .section-title {
      font-size: 1.25rem;
    }

    .section-subtitle {
      font-size: 0.95rem;
    }

    .skills-grid {
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 1rem;
    }

    .cta-container {
      padding: 3rem 1.5rem;
      margin: 0 1rem;
    }

    .cta-title {
      font-size: 1.5rem;
    }

    .cta-description {
      font-size: 1rem;
    }

    .skills-section,
    .featured-section,
    .writeups-section {
      padding: 4rem 0;
    }
  }

  @media (max-width: 480px) {
    .hero-section {
      padding: 4rem 0 2rem;
    }

    .hero-title {
      font-size: 1.85rem;
    }

    .title-greeting {
      font-size: 1rem;
    }

    .hero-description {
      font-size: 1rem;
    }

    .hero-actions {
      flex-direction: column;
      width: 100%;
    }

    .cyber-btn {
      width: 100%;
      justify-content: center;
    }

    .cyber-badge {
      padding: 0.4rem 0.75rem;
    }

    .badge-text {
      font-size: 0.65rem;
    }

    .stat-card {
      padding: 0.75rem 1rem;
    }

    .stat-value {
      font-size: 1.5rem;
    }

    .writeups-grid {
      grid-template-columns: 1fr;
    }

    .writeups-grid .writeup-card {
      min-width: 0;
    }

    .skills-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .skill-card {
      padding: 1.5rem 1rem;
    }
  }

  /* Light Mode Overrides */
  :global(:root[data-theme="light"]) .skill-card {
    background: var(--color-bg-elevated);
    border-color: rgba(124, 58, 237, 0.15);
  }

  :global(:root[data-theme="light"]) .skill-card:hover {
    border-color: rgba(124, 58, 237, 0.4);
  }

  :global(:root[data-theme="light"]) .stat-card {
    background: rgba(124, 58, 237, 0.05);
    border-color: rgba(124, 58, 237, 0.15);
  }

  :global(:root[data-theme="light"]) .cta-container {
    background: rgba(124, 58, 237, 0.03);
    border-color: rgba(124, 58, 237, 0.15);
  }

  :global(:root[data-theme="light"]) .terminal-frame {
    background: linear-gradient(135deg, #1a1a2e 0%, #1e1e30 100%);
    border-color: rgba(124, 58, 237, 0.3);
  }

  :global(:root[data-theme="light"]) .terminal-header {
    background: linear-gradient(180deg, rgba(40, 40, 60, 1) 0%, rgba(30, 30, 48, 1) 100%);
  }

  :global(:root[data-theme="light"]) .project-card .card-border {
    background: var(--color-bg-elevated);
    border-color: rgba(124, 58, 237, 0.15);
  }

  :global(:root[data-theme="light"]) .project-card:hover .card-border {
    border-color: rgba(124, 58, 237, 0.4);
  }

  :global(:root[data-theme="light"]) .writeup-card {
    background: var(--color-bg-elevated);
    border-color: rgba(124, 58, 237, 0.15);
  }

  :global(:root[data-theme="light"]) .writeup-card:hover {
    border-color: rgba(124, 58, 237, 0.4);
  }

  :global(:root[data-theme="light"]) .section-header .header-line.left {
    background: linear-gradient(90deg, transparent, rgba(124, 58, 237, 0.4));
  }

  :global(:root[data-theme="light"]) .section-header .header-line.right {
    background: linear-gradient(90deg, rgba(124, 58, 237, 0.4), transparent);
  }
</style>
