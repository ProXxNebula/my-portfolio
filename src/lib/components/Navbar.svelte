<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import ThemeToggle from './ThemeToggle.svelte';

  let scrolled = false;
  let mobileMenuOpen = false;

  onMount(() => {
    const handleScroll = () => {
      scrolled = window.scrollY > 20;
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }

  function closeMobileMenu() {
    mobileMenuOpen = false;
  }

  $: currentPath = $page.url.pathname;

  function isActive(path: string): boolean {
    return currentPath === path || currentPath.startsWith(path + '/');
  }
</script>

<nav class="navbar" class:scrolled>
  <!-- Cyber scan line -->
  <div class="nav-scanline"></div>

  <div class="nav-container">
    <!-- Logo/Brand -->
    <a href="/" class="nav-brand" on:click={closeMobileMenu}>
      <div class="brand-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <!-- Server Rack -->
          <rect class="server-unit server-1" x="4" y="3" width="16" height="5" rx="1"></rect>
          <rect class="server-unit server-2" x="4" y="9.5" width="16" height="5" rx="1"></rect>
          <rect class="server-unit server-3" x="4" y="16" width="16" height="5" rx="1"></rect>
          <!-- LED Indicators -->
          <circle class="led led-1" cx="7" cy="5.5" r="0.8" fill="currentColor"></circle>
          <circle class="led led-2" cx="7" cy="12" r="0.8" fill="currentColor"></circle>
          <circle class="led led-3" cx="7" cy="18.5" r="0.8" fill="currentColor"></circle>
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
      <span class="brand-text">
        <span class="brand-prompt">$</span>
        <span class="brand-name">portfolio</span>
        <span class="brand-cursor">_</span>
      </span>
    </a>

    <!-- Desktop Navigation -->
    <div class="nav-links desktop">
      <a
        href="/"
        class="nav-link"
        class:active={currentPath === '/'}
      >
        <span class="link-prefix">~/</span>home
        <span class="link-glow"></span>
      </a>
      <a
        href="/projects"
        class="nav-link"
        class:active={isActive('/projects')}
      >
        <span class="link-prefix">~/</span>projects
        <span class="link-glow"></span>
      </a>
      <a
        href="/writeups"
        class="nav-link"
        class:active={isActive('/writeups')}
      >
        <span class="link-prefix">~/</span>writeups
        <span class="link-glow"></span>
      </a>
      <a
        href="/about"
        class="nav-link"
        class:active={isActive('/about')}
      >
        <span class="link-prefix">~/</span>about
        <span class="link-glow"></span>
      </a>
      <a
        href="/homelab"
        class="nav-link"
        class:active={isActive('/homelab')}
      >
        <span class="link-prefix">~/</span>homelab
        <span class="link-glow"></span>
      </a>
    </div>

    <!-- CTA Button & Theme Toggle -->
    <div class="nav-actions desktop">
      <ThemeToggle />
      <a href="https://github.com/ProXxNebula" target="_blank" rel="noopener noreferrer" class="nav-cta">
        <span class="cta-glow"></span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        <span class="cta-text">Visit GitHub</span>
      </a>
    </div>

    <!-- Mobile Menu Button -->
    <button
      class="mobile-menu-btn"
      on:click={toggleMobileMenu}
      aria-label="Toggle menu"
    >
      <span class="hamburger" class:open={mobileMenuOpen}></span>
    </button>
  </div>

  <!-- Mobile Menu -->
  <div class="mobile-menu" class:open={mobileMenuOpen}>
    <div class="mobile-menu-content">
      <!-- Grid overlay for mobile menu -->
      <div class="mobile-grid-overlay"></div>

      <a
        href="/"
        class="mobile-link"
        class:active={currentPath === '/'}
        on:click={closeMobileMenu}
      >
        <span class="link-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </span>
        <span class="link-text">
          <span class="link-prefix">~/</span>home
        </span>
        <span class="mobile-link-glow"></span>
      </a>

      <a
        href="/projects"
        class="mobile-link"
        class:active={isActive('/projects')}
        on:click={closeMobileMenu}
      >
        <span class="link-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
          </svg>
        </span>
        <span class="link-text">
          <span class="link-prefix">~/</span>projects
        </span>
        <span class="mobile-link-glow"></span>
      </a>

      <a
        href="/writeups"
        class="mobile-link"
        class:active={isActive('/writeups')}
        on:click={closeMobileMenu}
      >
        <span class="link-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </span>
        <span class="link-text">
          <span class="link-prefix">~/</span>writeups
        </span>
        <span class="mobile-link-glow"></span>
      </a>

      <a
        href="/about"
        class="mobile-link"
        class:active={isActive('/about')}
        on:click={closeMobileMenu}
      >
        <span class="link-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </span>
        <span class="link-text">
          <span class="link-prefix">~/</span>about
        </span>
        <span class="mobile-link-glow"></span>
      </a>

      <a
        href="/homelab"
        class="mobile-link"
        class:active={isActive('/homelab')}
        on:click={closeMobileMenu}
      >
        <span class="link-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
        </span>
        <span class="link-text">
          <span class="link-prefix">~/</span>homelab
        </span>
        <span class="mobile-link-glow"></span>
      </a>

      <div class="mobile-divider">
        <span class="divider-text">// SYSTEM</span>
      </div>

      <div class="mobile-theme-toggle">
        <ThemeToggle />
      </div>

      <a href="https://github.com/ProXxNebula" target="_blank" rel="noopener noreferrer" class="mobile-cta" on:click={closeMobileMenu}>
        <span class="cta-glow"></span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        Visit GitHub
      </a>
    </div>
  </div>
</nav>

<style>
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: rgba(10, 10, 15, 0.85);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(139, 92, 246, 0.2);
    transition: all 0.3s ease;
  }

  :root[data-theme="light"] .navbar {
    background: rgba(255, 255, 255, 0.9);
    border-bottom: 1px solid rgba(124, 58, 237, 0.2);
  }

  /* Scan line animation */
  .nav-scanline {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--color-accent-primary), var(--color-accent-secondary), transparent);
    opacity: 0.6;
    animation: navScan 4s linear infinite;
  }

  @keyframes navScan {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  .navbar.scrolled {
    background: rgba(10, 10, 15, 0.95);
    border-bottom-color: rgba(139, 92, 246, 0.4);
    box-shadow:
      0 4px 20px rgba(0, 0, 0, 0.3),
      0 0 30px rgba(139, 92, 246, 0.1);
  }

  :root[data-theme="light"] .navbar.scrolled {
    background: rgba(255, 255, 255, 0.98);
    border-bottom-color: rgba(124, 58, 237, 0.3);
    box-shadow:
      0 4px 20px rgba(0, 0, 0, 0.1),
      0 0 30px rgba(124, 58, 237, 0.1);
  }

  .nav-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  /* Brand/Logo */
  .nav-brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
    color: var(--color-text-primary);
    font-weight: 600;
    font-size: 1.125rem;
    transition: all 0.2s ease;
  }

  .nav-brand:hover {
    color: var(--color-accent-primary-light);
  }

  .brand-icon {
    position: relative;
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(6, 182, 212, 0.2));
    border: 1px solid rgba(139, 92, 246, 0.4);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-accent-primary-light);
    transition: all 0.3s ease;
    overflow: hidden;
  }

  .brand-icon::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .nav-brand:hover .brand-icon::before {
    opacity: 0.2;
  }

  .nav-brand:hover .brand-icon {
    border-color: var(--color-accent-primary);
    box-shadow:
      0 0 20px rgba(139, 92, 246, 0.4),
      inset 0 0 15px rgba(139, 92, 246, 0.1);
  }

  /* Corner accents for icon */
  .icon-corner {
    position: absolute;
    width: 8px;
    height: 8px;
    border: 1px solid var(--color-accent-secondary);
  }

  .icon-corner-tl {
    top: 2px;
    left: 2px;
    border-right: none;
    border-bottom: none;
  }

  .icon-corner-br {
    bottom: 2px;
    right: 2px;
    border-left: none;
    border-top: none;
  }

  /* Server Rack Animations */
  .brand-icon .server-unit {
    animation: serverPulse 2s ease-in-out infinite;
  }

  .brand-icon .server-1 { animation-delay: 0s; }
  .brand-icon .server-2 { animation-delay: 0.3s; }
  .brand-icon .server-3 { animation-delay: 0.6s; }

  @keyframes serverPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }

  /* LED Blinking Animation */
  .brand-icon .led {
    animation: ledBlink 1.5s ease-in-out infinite;
    fill: var(--color-accent-secondary);
  }

  .brand-icon .led-1 { animation-delay: 0s; }
  .brand-icon .led-2 { animation-delay: 0.5s; }
  .brand-icon .led-3 { animation-delay: 1s; }

  @keyframes ledBlink {
    0%, 100% {
      opacity: 1;
      filter: drop-shadow(0 0 4px var(--color-accent-secondary));
    }
    50% {
      opacity: 0.3;
      filter: none;
    }
  }

  /* Ventilation Animation on Hover */
  .nav-brand:hover .brand-icon .vent {
    animation: ventFlow 0.8s linear infinite;
  }

  @keyframes ventFlow {
    0% {
      opacity: 0.4;
      stroke-dasharray: 2 4;
      stroke-dashoffset: 0;
    }
    100% {
      opacity: 0.8;
      stroke-dasharray: 2 4;
      stroke-dashoffset: 6;
    }
  }

  .brand-text {
    font-family: 'Fira Code', 'Courier New', monospace;
    display: flex;
    align-items: center;
  }

  .brand-prompt {
    color: var(--color-accent-primary-light);
    margin-right: 0.25rem;
    text-shadow: 0 0 10px var(--color-accent-primary);
  }

  .brand-name {
    color: var(--color-text-primary);
  }

  .brand-cursor {
    color: var(--color-accent-secondary);
    animation: cursorBlink 1s step-end infinite;
    margin-left: 2px;
  }

  @keyframes cursorBlink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }

  /* Desktop Navigation */
  .nav-links {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .nav-link {
    position: relative;
    padding: 0.6rem 1.1rem;
    color: var(--color-text-tertiary);
    text-decoration: none;
    font-family: var(--font-mono);
    font-size: 0.9rem;
    font-weight: 500;
    border-radius: var(--radius-md);
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    overflow: hidden;
  }

  .link-prefix {
    color: var(--color-accent-primary);
    opacity: 0;
    transform: translateX(-4px);
    transition: all 0.2s ease;
  }

  .link-glow {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.1));
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .nav-link:hover {
    color: var(--color-text-primary);
  }

  .nav-link:hover .link-prefix {
    opacity: 1;
    transform: translateX(0);
  }

  .nav-link:hover .link-glow {
    opacity: 1;
  }

  .nav-link.active {
    color: var(--color-accent-primary-light);
    background: rgba(139, 92, 246, 0.15);
    border: 1px solid rgba(139, 92, 246, 0.3);
  }

  .nav-link.active .link-prefix {
    opacity: 1;
    transform: translateX(0);
  }

  .nav-link.active::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--color-accent-primary), var(--color-accent-secondary));
  }

  .nav-link.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 50%;
    height: 10px;
    background: var(--color-accent-primary);
    filter: blur(8px);
    opacity: 0.5;
  }

  /* CTA Button */
  .nav-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .nav-cta {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.7rem 1.4rem;
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(6, 182, 212, 0.2));
    border: 1px solid rgba(139, 92, 246, 0.4);
    color: var(--color-text-primary);
    text-decoration: none;
    font-weight: 500;
    font-size: 0.9rem;
    border-radius: var(--radius-md);
    transition: all 0.3s ease;
    font-family: var(--font-mono);
    overflow: hidden;
  }

  .cta-glow {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .nav-cta:hover {
    border-color: var(--color-accent-primary);
    transform: translateY(-2px);
    box-shadow:
      0 4px 20px rgba(139, 92, 246, 0.4),
      0 0 30px rgba(139, 92, 246, 0.2);
  }

  .nav-cta:hover .cta-glow {
    opacity: 0.15;
  }

  .nav-cta svg,
  .nav-cta .cta-text {
    position: relative;
    z-index: 1;
  }

  /* Mobile Menu Button */
  .mobile-menu-btn {
    display: none;
    background: rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(139, 92, 246, 0.3);
    border-radius: var(--radius-md);
    cursor: pointer;
    padding: 0.6rem;
    z-index: 1001;
    transition: all 0.2s ease;
  }

  .mobile-menu-btn:hover {
    background: rgba(139, 92, 246, 0.2);
    border-color: var(--color-accent-primary);
  }

  .hamburger {
    display: block;
    width: 24px;
    height: 2px;
    background: var(--color-accent-primary-light);
    position: relative;
    transition: all 0.3s ease;
  }

  .hamburger::before,
  .hamburger::after {
    content: '';
    position: absolute;
    width: 24px;
    height: 2px;
    background: var(--color-accent-primary-light);
    left: 0;
    transition: all 0.3s ease;
  }

  .hamburger::before { top: -8px; }
  .hamburger::after { bottom: -8px; }

  .hamburger.open {
    background: transparent;
  }

  .hamburger.open::before {
    top: 0;
    transform: rotate(45deg);
    background: var(--color-accent-secondary);
  }

  .hamburger.open::after {
    bottom: 0;
    transform: rotate(-45deg);
    background: var(--color-accent-secondary);
  }

  /* Mobile Menu */
  .mobile-menu {
    position: fixed;
    top: 73px;
    left: 0;
    right: 0;
    background: rgba(10, 10, 15, 0.98);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(139, 92, 246, 0.3);
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }

  :root[data-theme="light"] .mobile-menu {
    background: rgba(255, 255, 255, 0.98);
    border-bottom-color: rgba(124, 58, 237, 0.3);
  }

  .mobile-menu.open {
    max-height: 600px;
  }

  .mobile-menu-content {
    position: relative;
    padding: 1.5rem;
  }

  .mobile-grid-overlay {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(139, 92, 246, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(139, 92, 246, 0.03) 1px, transparent 1px);
    background-size: 20px 20px;
    pointer-events: none;
  }

  .mobile-link {
    position: relative;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.25rem;
    color: var(--color-text-secondary);
    text-decoration: none;
    border-radius: var(--radius-lg);
    transition: all 0.2s ease;
    margin-bottom: 0.5rem;
    font-family: var(--font-mono);
    border: 1px solid transparent;
    overflow: hidden;
  }

  .mobile-link-glow {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.1));
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .mobile-link:hover {
    background: rgba(139, 92, 246, 0.1);
    border-color: rgba(139, 92, 246, 0.2);
    color: var(--color-text-primary);
  }

  .mobile-link:hover .mobile-link-glow {
    opacity: 1;
  }

  .mobile-link.active {
    background: rgba(139, 92, 246, 0.15);
    border-color: rgba(139, 92, 246, 0.4);
    color: var(--color-accent-primary-light);
  }

  .mobile-link.active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(180deg, var(--color-accent-primary), var(--color-accent-secondary));
    border-radius: 0 2px 2px 0;
  }

  .link-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-accent-primary);
    position: relative;
    z-index: 1;
  }

  .link-text {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    position: relative;
    z-index: 1;
  }

  .mobile-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent);
    margin: 1.25rem 0;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .divider-text {
    position: absolute;
    background: var(--color-bg-primary);
    padding: 0 1rem;
    color: var(--color-text-muted);
    font-family: var(--font-mono);
    font-size: 0.75rem;
    letter-spacing: 0.1em;
  }

  :root[data-theme="light"] .divider-text {
    background: #fff;
  }

  .mobile-theme-toggle {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
  }

  .mobile-cta {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 1rem 1.5rem;
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(6, 182, 212, 0.2));
    border: 1px solid rgba(139, 92, 246, 0.4);
    color: var(--color-text-primary);
    text-decoration: none;
    font-weight: 500;
    border-radius: var(--radius-lg);
    transition: all 0.2s ease;
    font-family: var(--font-mono);
    overflow: hidden;
  }

  .mobile-cta:hover {
    border-color: var(--color-accent-primary);
    box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
  }

  .mobile-cta:hover .cta-glow {
    opacity: 0.15;
  }

  .desktop {
    display: flex;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .nav-container {
      padding: 1rem 1.5rem;
    }

    .desktop {
      display: none;
    }

    .mobile-menu-btn {
      display: block;
    }
  }

  @media (max-width: 480px) {
    .brand-text {
      font-size: 1rem;
    }

    .brand-icon {
      width: 36px;
      height: 36px;
    }

    .brand-cursor {
      display: none;
    }
  }

  /* Prevent body scroll when mobile menu is open */
  :global(body.mobile-menu-open) {
    overflow: hidden;
  }
</style>

<svelte:head>
  {#if mobileMenuOpen}
    <style>
      body {
        overflow: hidden;
      }
    </style>
  {/if}
</svelte:head>
