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
      </div>
      <span class="brand-text">
        <span class="brand-prompt">$</span>
        <span class="brand-name">portfolio</span>
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
      </a>
      <a
        href="/projects"
        class="nav-link"
        class:active={isActive('/projects')}
      >
        <span class="link-prefix">~/</span>projects
      </a>
      <a
        href="/writeups"
        class="nav-link"
        class:active={isActive('/writeups')}
      >
        <span class="link-prefix">~/</span>writeups
      </a>
      <a
        href="/about"
        class="nav-link"
        class:active={isActive('/about')}
      >
        <span class="link-prefix">~/</span>about
      </a>
      <a
        href="/homelab"
        class="nav-link"
        class:active={isActive('/homelab')}
      >
        <span class="link-prefix">~/</span>homelab
      </a>
    </div>
    
    <!-- CTA Button & Theme Toggle -->
    <div class="nav-actions desktop">
      <ThemeToggle />
      <a href="https://github.com/ProXxNebula" target="_blank" rel="noopener noreferrer" class="nav-cta">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        Visit GitHub
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
      </a>

      <div class="mobile-divider"></div>

      <div class="mobile-theme-toggle">
        <ThemeToggle />
      </div>

      <a href="https://github.com/ProXxNebula" target="_blank" rel="noopener noreferrer" class="mobile-cta" on:click={closeMobileMenu}>
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
    background: rgba(var(--bg-rgb), 0.8);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid transparent;
    transition: all 0.3s ease;
  }

  :root[data-theme="dark"] {
    --bg-rgb: 10, 14, 20;
  }

  :root[data-theme="light"],
  :root:not([data-theme]) {
    --bg-rgb: 255, 255, 255;
  }

  .navbar.scrolled {
    background: rgba(var(--bg-rgb), 0.95);
    border-bottom-color: var(--color-border-default);
    box-shadow: var(--shadow-md);
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
    color: var(--color-accent-blue-light);
  }

  .brand-icon {
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, var(--color-accent-blue) 0%, var(--color-accent-green) 100%);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-bg-primary);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .brand-icon::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transform: rotate(45deg);
    animation: shine 3s infinite;
  }

  @keyframes shine {
    0% {
      transform: translateX(-100%) translateY(-100%) rotate(45deg);
    }
    100% {
      transform: translateX(100%) translateY(100%) rotate(45deg);
    }
  }

  .nav-brand:hover .brand-icon {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(83, 155, 245, 0.4);
  }

  /* Server Rack Animations */
  .brand-icon .server-unit {
    animation: pulse 2s ease-in-out infinite;
  }

  .brand-icon .server-1 {
    animation-delay: 0s;
  }

  .brand-icon .server-2 {
    animation-delay: 0.3s;
  }

  .brand-icon .server-3 {
    animation-delay: 0.6s;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }

  /* LED Blinking Animation */
  .brand-icon .led {
    animation: blink 1.5s ease-in-out infinite;
  }

  .brand-icon .led-1 {
    animation-delay: 0s;
  }

  .brand-icon .led-2 {
    animation-delay: 0.5s;
  }

  .brand-icon .led-3 {
    animation-delay: 1s;
  }

  @keyframes blink {
    0%, 100% {
      opacity: 1;
      filter: brightness(1);
    }
    50% {
      opacity: 0.3;
      filter: brightness(0.5);
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
  }

  .brand-prompt {
    color: var(--color-accent-blue-light);
    margin-right: 0.25rem;
  }

  .brand-name {
    color: var(--color-text-primary);
  }

  /* Desktop Navigation */
  .nav-links {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .nav-link {
    position: relative;
    padding: 0.5rem 1rem;
    color: var(--color-text-tertiary);
    text-decoration: none;
    font-family: var(--font-mono);
    font-size: 0.9rem;
    border-radius: var(--radius-md);
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .link-prefix {
    color: var(--color-accent-blue);
    opacity: 0;
    transform: translateX(-4px);
    transition: all 0.2s ease;
  }

  .nav-link:hover {
    color: var(--color-text-primary);
    background: rgba(83, 155, 245, 0.1);
  }

  .nav-link:hover .link-prefix {
    opacity: 1;
    transform: translateX(0);
  }

  .nav-link.active {
    color: var(--color-accent-blue-light);
    background: rgba(83, 155, 245, 0.15);
  }

  .nav-link.active .link-prefix {
    opacity: 1;
    transform: translateX(0);
  }

  .nav-link.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 1rem;
    right: 1rem;
    height: 2px;
    background: linear-gradient(90deg, #6cb6ff 0%, #8ddb8c 100%);
    border-radius: 2px;
  }

  /* CTA Button */
  .nav-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .nav-cta {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1.25rem;
    background: var(--color-accent-blue);
    color: var(--color-bg-primary);
    text-decoration: none;
    font-weight: 500;
    font-size: 0.9rem;
    border-radius: var(--radius-md);
    transition: all 0.2s ease;
    font-family: var(--font-mono);
  }

  .nav-cta:hover {
    background: var(--color-accent-blue-light);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(83, 155, 245, 0.4);
  }

  /* Mobile Menu Button */
  .mobile-menu-btn {
    display: none;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    z-index: 1001;
  }

  .hamburger {
    display: block;
    width: 24px;
    height: 2px;
    background: var(--color-text-primary);
    position: relative;
    transition: all 0.3s ease;
  }

  .hamburger::before,
  .hamburger::after {
    content: '';
    position: absolute;
    width: 24px;
    height: 2px;
    background: var(--color-text-primary);
    left: 0;
    transition: all 0.3s ease;
  }

  .hamburger::before {
    top: -8px;
  }

  .hamburger::after {
    bottom: -8px;
  }

  .hamburger.open {
    background: transparent;
  }

  .hamburger.open::before {
    top: 0;
    transform: rotate(45deg);
  }

  .hamburger.open::after {
    bottom: 0;
    transform: rotate(-45deg);
  }

  /* Mobile Menu */
  .mobile-menu {
    position: fixed;
    top: 73px;
    left: 0;
    right: 0;
    background: rgba(var(--bg-rgb), 0.98);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--color-border-default);
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }

  .mobile-menu.open {
    max-height: 500px;
  }

  .mobile-menu-content {
    padding: 1rem;
  }

  .mobile-link {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    color: var(--color-text-tertiary);
    text-decoration: none;
    border-radius: var(--radius-lg);
    transition: all 0.2s ease;
    margin-bottom: 0.5rem;
    font-family: var(--font-mono);
  }

  .mobile-link:hover {
    background: rgba(83, 155, 245, 0.1);
    color: var(--color-text-primary);
  }

  .mobile-link.active {
    background: rgba(83, 155, 245, 0.15);
    color: var(--color-accent-blue-light);
    border-left: 3px solid var(--color-accent-blue-light);
  }

  .link-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-accent-blue);
  }

  .link-text {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .mobile-divider {
    height: 1px;
    background: var(--color-border-default);
    margin: 1rem 0;
  }

  .mobile-theme-toggle {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
  }

  .mobile-cta {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.875rem 1.5rem;
    background: var(--color-accent-blue);
    color: var(--color-bg-primary);
    text-decoration: none;
    font-weight: 500;
    border-radius: var(--radius-lg);
    transition: all 0.2s ease;
    font-family: var(--font-mono);
  }

  .mobile-cta:hover {
    background: var(--color-accent-blue-light);
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
      width: 32px;
      height: 32px;
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