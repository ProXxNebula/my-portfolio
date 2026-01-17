<script>
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com/ProXxNebula',
      icon: 'github',
      username: '@ProXxNebula'
    }
  ];

  const quickLinks = [
    { name: 'Home', url: '/' },
    { name: 'Projects', url: '/projects' },
    { name: 'Writeups', url: '/writeups' },
    { name: 'Homelab', url: '/homelab' },
    { name: 'About', url: '/about' }
  ];

  const resources = [
    { name: 'GitHub', url: 'https://github.com/ProXxNebula' }
  ];
</script>

<footer class="footer">
  <!-- Animated background elements -->
  <div class="footer-bg">
    <div class="grid-overlay"></div>
    <div class="glow-orb glow-orb-1"></div>
    <div class="glow-orb glow-orb-2"></div>
  </div>

  <!-- Top border glow -->
  <div class="footer-border-glow"></div>

  <div class="footer-container">
    <!-- Main Footer Content -->
    <div class="footer-content">
      <!-- Brand Section -->
      <div class="footer-section brand-section">
        <div class="footer-brand">
          <div class="brand-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <!-- Server Rack -->
              <rect class="server-unit" x="4" y="3" width="16" height="5" rx="1"></rect>
              <rect class="server-unit" x="4" y="9.5" width="16" height="5" rx="1"></rect>
              <rect class="server-unit" x="4" y="16" width="16" height="5" rx="1"></rect>
              <!-- LED Indicators -->
              <circle class="led" cx="7" cy="5.5" r="0.8" fill="currentColor"></circle>
              <circle class="led" cx="7" cy="12" r="0.8" fill="currentColor"></circle>
              <circle class="led" cx="7" cy="18.5" r="0.8" fill="currentColor"></circle>
              <!-- Ventilation Slots -->
              <line class="vent" x1="12" y1="4" x2="18" y2="4" stroke-width="1"></line>
              <line class="vent" x1="12" y1="6" x2="18" y2="6" stroke-width="1"></line>
              <line class="vent" x1="12" y1="10.5" x2="18" y2="10.5" stroke-width="1"></line>
              <line class="vent" x1="12" y1="12.5" x2="18" y2="12.5" stroke-width="1"></line>
              <line class="vent" x1="12" y1="17" x2="18" y2="17" stroke-width="1"></line>
              <line class="vent" x1="12" y1="19" x2="18" y2="19" stroke-width="1"></line>
            </svg>
            <!-- Corner accents -->
            <div class="icon-corner icon-corner-tl"></div>
            <div class="icon-corner icon-corner-br"></div>
          </div>
          <div class="brand-text">
            <span class="brand-prompt">$</span>
            <span class="brand-name">portfolio</span>
          </div>
        </div>
        <p class="brand-tagline">
          Building secure solutions, one commit at a time.
        </p>
        <div class="terminal-badge">
          <span class="status-indicator"></span>
          <span class="terminal-prompt">~$</span>
          <span class="terminal-text">status: <span class="status-active">online</span></span>
        </div>
      </div>

      <!-- Quick Links -->
      <div class="footer-section">
        <h3 class="section-title">
          <span class="title-bracket">[</span>
          <span class="title-prefix">~/</span>Navigation
          <span class="title-bracket">]</span>
        </h3>
        <ul class="footer-links">
          {#each quickLinks as link}
            <li>
              <a href={link.url} class="footer-link">
                <span class="link-arrow">></span>
                <span class="link-name">{link.name}</span>
                <span class="link-underline"></span>
              </a>
            </li>
          {/each}
        </ul>
      </div>

      <!-- Resources -->
      <div class="footer-section">
        <h3 class="section-title">
          <span class="title-bracket">[</span>
          <span class="title-prefix">~/</span>Resources
          <span class="title-bracket">]</span>
        </h3>
        <ul class="footer-links">
          {#each resources as link}
            <li>
              <a href={link.url} class="footer-link" target="_blank" rel="noopener noreferrer">
                <span class="link-arrow">></span>
                <span class="link-name">{link.name}</span>
                <span class="link-underline"></span>
              </a>
            </li>
          {/each}
        </ul>
      </div>

      <!-- Social Links -->
      <div class="footer-section">
        <h3 class="section-title">
          <span class="title-bracket">[</span>
          <span class="title-prefix">~/</span>Connect
          <span class="title-bracket">]</span>
        </h3>
        <div class="social-links">
          {#each socialLinks as social}
            <a
              href={social.url}
              class="social-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
            >
              <span class="social-glow"></span>
              {#if social.icon === 'github'}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              {:else if social.icon === 'linkedin'}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              {:else if social.icon === 'twitter'}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              {:else if social.icon === 'mail'}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              {/if}
              <span class="social-tooltip">{social.username}</span>
            </a>
          {/each}
        </div>
      </div>
    </div>

    <!-- Divider -->
    <div class="footer-divider">
      <span class="divider-text">// END TRANSMISSION</span>
    </div>

    <!-- Bottom Bar -->
    <div class="footer-bottom">
      <div class="footer-bottom-left">
        <p class="copyright">
          <span class="terminal-prompt">©</span>
          {currentYear} <span class="copyright-name">ProXxNebula</span>
        </p>
        <p class="build-info">
          <span class="build-label">Built with</span>
          <a href="https://kit.svelte.dev" target="_blank" rel="noopener" class="tech-link">
            SvelteKit
          </a>
          <span class="build-separator">//</span>
          <a href="https://github.com/ProXxNebula" target="_blank" rel="noopener" class="tech-link">
            View Source
          </a>
        </p>
      </div>

      <div class="footer-bottom-right">
        <div class="footer-stats">
          <div class="stat-item">
            <span class="stat-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </span>
            <span class="stat-text">Fast</span>
          </div>
          <div class="stat-item">
            <span class="stat-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </span>
            <span class="stat-text">Secure</span>
          </div>
          <div class="stat-item">
            <span class="stat-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            </span>
            <span class="stat-text">Dark Mode</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll to Top Button -->
    <button class="scroll-top" on:click={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Scroll to top">
      <span class="scroll-glow"></span>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
    </button>
  </div>
</footer>

<style>
  .footer {
    position: relative;
    background: var(--color-bg-secondary);
    margin-top: 8rem;
    overflow: hidden;
  }

  /* Background elements */
  .footer-bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
  }

  .grid-overlay {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(139, 92, 246, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(139, 92, 246, 0.03) 1px, transparent 1px);
    background-size: 40px 40px;
  }

  .glow-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.3;
  }

  .glow-orb-1 {
    width: 300px;
    height: 300px;
    background: var(--color-accent-primary);
    top: -100px;
    left: 10%;
    animation: orbFloat 8s ease-in-out infinite;
  }

  .glow-orb-2 {
    width: 250px;
    height: 250px;
    background: var(--color-accent-secondary);
    bottom: -80px;
    right: 15%;
    animation: orbFloat 10s ease-in-out infinite reverse;
  }

  @keyframes orbFloat {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(20px, -20px); }
  }

  /* Top border glow */
  .footer-border-glow {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--color-accent-primary), var(--color-accent-secondary), var(--color-accent-primary), transparent);
  }

  .footer-container {
    position: relative;
    max-width: 1400px;
    margin: 0 auto;
    padding: 4rem 2rem 2rem;
  }

  /* Main Footer Content */
  .footer-content {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 3rem;
    margin-bottom: 3rem;
  }

  /* Brand Section */
  .brand-section {
    max-width: 350px;
  }

  .footer-brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .brand-icon {
    position: relative;
    width: 44px;
    height: 44px;
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(6, 182, 212, 0.2));
    border: 1px solid rgba(139, 92, 246, 0.4);
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-accent-primary-light);
  }

  /* Corner accents for icon */
  .icon-corner {
    position: absolute;
    width: 8px;
    height: 8px;
    border: 1px solid var(--color-accent-secondary);
  }

  .icon-corner-tl {
    top: 3px;
    left: 3px;
    border-right: none;
    border-bottom: none;
  }

  .icon-corner-br {
    bottom: 3px;
    right: 3px;
    border-left: none;
    border-top: none;
  }

  /* Server Rack LED Animation */
  .brand-icon .led {
    animation: ledPulse 2s ease-in-out infinite;
    fill: var(--color-accent-secondary);
  }

  @keyframes ledPulse {
    0%, 100% {
      opacity: 1;
      filter: drop-shadow(0 0 4px var(--color-accent-secondary));
    }
    50% {
      opacity: 0.4;
      filter: none;
    }
  }

  .brand-text {
    font-family: var(--font-mono);
    font-size: 1.25rem;
    font-weight: 600;
  }

  .brand-prompt {
    color: var(--color-accent-primary-light);
    margin-right: 0.25rem;
    text-shadow: 0 0 10px var(--color-accent-primary);
  }

  .brand-name {
    color: var(--color-text-primary);
  }

  .brand-tagline {
    color: var(--color-text-secondary);
    line-height: 1.6;
    margin-bottom: 1.5rem;
    font-size: 0.95rem;
  }

  .terminal-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(139, 92, 246, 0.3);
    padding: 0.6rem 1.2rem;
    border-radius: var(--radius-md);
    font-family: var(--font-mono);
    font-size: 0.85rem;
  }

  .status-indicator {
    width: 8px;
    height: 8px;
    background: var(--color-success);
    border-radius: 50%;
    box-shadow: 0 0 10px var(--color-success);
    animation: statusPulse 2s ease-in-out infinite;
  }

  @keyframes statusPulse {
    0%, 100% { opacity: 1; box-shadow: 0 0 10px var(--color-success); }
    50% { opacity: 0.6; box-shadow: 0 0 5px var(--color-success); }
  }

  .terminal-prompt {
    color: var(--color-accent-primary-light);
  }

  .terminal-text {
    color: var(--color-text-secondary);
  }

  .status-active {
    color: var(--color-success);
    font-weight: 500;
  }

  /* Footer Sections */
  .footer-section {
    display: flex;
    flex-direction: column;
  }

  .section-title {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: 1.25rem;
    font-family: var(--font-mono);
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .title-bracket {
    color: var(--color-accent-secondary);
  }

  .title-prefix {
    color: var(--color-accent-primary-light);
  }

  .footer-links {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .footer-link {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--color-text-secondary);
    text-decoration: none;
    font-size: 0.9rem;
    transition: all var(--transition-base);
    font-family: var(--font-mono);
    padding: 0.25rem 0;
  }

  .link-arrow {
    color: var(--color-accent-primary);
    opacity: 0;
    transform: translateX(-4px);
    transition: all var(--transition-base);
    font-weight: bold;
  }

  .link-underline {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 1px;
    background: linear-gradient(90deg, var(--color-accent-primary), var(--color-accent-secondary));
    transition: width var(--transition-base);
  }

  .footer-link:hover {
    color: var(--color-text-primary);
    padding-left: 0.5rem;
  }

  .footer-link:hover .link-arrow {
    opacity: 1;
    transform: translateX(0);
  }

  .footer-link:hover .link-underline {
    width: 100%;
  }

  /* Social Links */
  .social-links {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .social-link {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    background: rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(139, 92, 246, 0.3);
    border-radius: var(--radius-md);
    color: var(--color-text-secondary);
    text-decoration: none;
    transition: all var(--transition-base);
    overflow: hidden;
  }

  .social-glow {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary));
    opacity: 0;
    transition: opacity var(--transition-base);
  }

  .social-link svg {
    position: relative;
    z-index: 1;
  }

  .social-link:hover {
    border-color: var(--color-accent-primary);
    color: var(--color-text-primary);
    transform: translateY(-3px);
    box-shadow:
      0 4px 15px rgba(139, 92, 246, 0.3),
      0 0 20px rgba(139, 92, 246, 0.2);
  }

  .social-link:hover .social-glow {
    opacity: 0.15;
  }

  .social-tooltip {
    position: absolute;
    bottom: calc(100% + 0.5rem);
    left: 50%;
    transform: translateX(-50%);
    background: var(--color-bg-elevated);
    color: var(--color-text-primary);
    padding: 0.5rem 0.75rem;
    border-radius: var(--radius-md);
    font-size: 0.75rem;
    font-family: var(--font-mono);
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--transition-base);
    border: 1px solid rgba(139, 92, 246, 0.3);
    box-shadow: var(--shadow-md);
    z-index: 10;
  }

  .social-link:hover .social-tooltip {
    opacity: 1;
  }

  /* Footer Divider */
  .footer-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, rgba(139, 92, 246, 0.4) 50%, transparent 100%);
    margin: 2rem 0;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .divider-text {
    position: absolute;
    background: var(--color-bg-secondary);
    padding: 0 1.5rem;
    color: var(--color-text-muted);
    font-family: var(--font-mono);
    font-size: 0.75rem;
    letter-spacing: 0.15em;
  }

  /* Footer Bottom */
  .footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1.5rem;
  }

  .footer-bottom-left {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .copyright {
    color: var(--color-text-secondary);
    font-size: 0.9rem;
    font-family: var(--font-mono);
  }

  .copyright-name {
    color: var(--color-accent-primary-light);
    font-weight: 500;
  }

  .build-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--color-text-tertiary);
    font-size: 0.85rem;
    font-family: var(--font-mono);
  }

  .build-label {
    color: var(--color-text-muted);
  }

  .tech-link {
    color: var(--color-accent-primary);
    text-decoration: none;
    transition: all var(--transition-base);
  }

  .tech-link:hover {
    color: var(--color-accent-primary-light);
    text-shadow: 0 0 10px var(--color-accent-primary);
  }

  .build-separator {
    color: var(--color-text-muted);
  }

  /* Footer Stats */
  .footer-stats {
    display: flex;
    gap: 1rem;
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1rem;
    background: rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(139, 92, 246, 0.2);
    border-radius: var(--radius-md);
    transition: all var(--transition-base);
  }

  .stat-item:hover {
    border-color: rgba(139, 92, 246, 0.4);
    background: rgba(139, 92, 246, 0.15);
    box-shadow: 0 0 15px rgba(139, 92, 246, 0.2);
  }

  .stat-icon {
    color: var(--color-accent-primary);
    display: flex;
    align-items: center;
  }

  .stat-text {
    color: var(--color-text-secondary);
    font-size: 0.85rem;
    font-family: var(--font-mono);
  }

  /* Scroll to Top Button */
  .scroll-top {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(6, 182, 212, 0.3));
    border: 1px solid rgba(139, 92, 246, 0.5);
    color: var(--color-accent-primary-light);
    border-radius: var(--radius-md);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition-base);
    overflow: hidden;
    z-index: 90;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  .scroll-glow {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary));
    opacity: 0;
    transition: opacity var(--transition-base);
  }

  .scroll-top svg {
    position: relative;
    z-index: 1;
  }

  .scroll-top:hover {
    transform: translateY(-4px);
    border-color: var(--color-accent-primary);
    box-shadow:
      0 8px 25px rgba(139, 92, 246, 0.4),
      0 0 30px rgba(139, 92, 246, 0.2);
  }

  .scroll-top:hover .scroll-glow {
    opacity: 0.2;
  }

  .scroll-top:active {
    transform: translateY(-2px);
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    .footer-content {
      grid-template-columns: repeat(2, 1fr);
    }

    .brand-section {
      max-width: 100%;
    }
  }

  @media (max-width: 768px) {
    .footer-container {
      padding: 3rem 1.5rem 2rem;
    }

    .footer-content {
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .footer-bottom {
      flex-direction: column;
      align-items: flex-start;
    }

    .footer-stats {
      width: 100%;
      justify-content: space-between;
    }

    .stat-item {
      flex: 1;
      justify-content: center;
      padding: 0.5rem;
    }

    .scroll-top {
      right: 1.5rem;
      bottom: 1.5rem;
    }

    .glow-orb-1 {
      width: 200px;
      height: 200px;
    }

    .glow-orb-2 {
      width: 150px;
      height: 150px;
    }
  }

  @media (max-width: 480px) {
    .social-links {
      width: 100%;
    }

    .social-link {
      flex: 1;
      min-width: 44px;
    }

    .build-info {
      flex-wrap: wrap;
    }

    .footer-stats {
      flex-direction: column;
      gap: 0.75rem;
    }

    .stat-item {
      width: 100%;
    }
  }
</style>
