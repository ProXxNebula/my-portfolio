<script lang="ts">
  import { onMount } from 'svelte';

  export let content: string = '';

  let htmlContent = '';

  // Syntax highlighting for code blocks
  function highlightCode(code: string, lang: string): string {
    const escaped = escapeHtml(code);

    if (!lang || lang === 'text' || lang === 'plain') {
      return escaped;
    }

    let highlighted = escaped;

    // Bash/Shell highlighting
    if (lang === 'bash' || lang === 'sh' || lang === 'shell') {
      // Comments
      highlighted = highlighted.replace(/(#.*$)/gm, '<span class="comment">$1</span>');
      // Strings
      highlighted = highlighted.replace(/(&quot;[^&]*&quot;|&#39;[^&]*&#39;)/g, '<span class="string">$1</span>');
      // Commands (common ones)
      highlighted = highlighted.replace(/\b(cd|ls|mkdir|rm|cp|mv|cat|grep|sed|awk|sudo|apt|yum|docker|npm|git|ssh|scp|chmod|chown|curl|wget)\b/g, '<span class="keyword">$1</span>');
      // Flags
      highlighted = highlighted.replace(/(\s-+[\w-]+)/g, '<span class="flag">$1</span>');
    }

    // Python highlighting
    if (lang === 'python' || lang === 'py') {
      // Comments
      highlighted = highlighted.replace(/(#.*$)/gm, '<span class="comment">$1</span>');
      // Strings
      highlighted = highlighted.replace(/(&quot;[^&]*&quot;|&#39;[^&]*&#39;)/g, '<span class="string">$1</span>');
      // Keywords
      highlighted = highlighted.replace(/\b(def|class|import|from|if|elif|else|for|while|return|yield|with|as|try|except|finally|raise|pass|break|continue|and|or|not|in|is|True|False|None)\b/g, '<span class="keyword">$1</span>');
      // Functions
      highlighted = highlighted.replace(/\b(\w+)(?=\()/g, '<span class="function">$1</span>');
    }

    // JavaScript/TypeScript highlighting
    if (lang === 'javascript' || lang === 'js' || lang === 'typescript' || lang === 'ts') {
      // Comments (single line and multi-line)
      highlighted = highlighted.replace(/(\/\/.*$)/gm, '<span class="comment">$1</span>');
      highlighted = highlighted.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="comment">$1</span>');
      // Strings
      highlighted = highlighted.replace(/(&quot;[^&]*&quot;|&#39;[^&]*&#39;|`[^`]*`)/g, '<span class="string">$1</span>');
      // Keywords
      highlighted = highlighted.replace(/\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|class|extends|import|export|from|default|async|await|try|catch|finally|throw|new|this|typeof|instanceof)\b/g, '<span class="keyword">$1</span>');
      // Functions
      highlighted = highlighted.replace(/\b(\w+)(?=\()/g, '<span class="function">$1</span>');
    }

    // YAML highlighting
    if (lang === 'yaml' || lang === 'yml') {
      // Comments
      highlighted = highlighted.replace(/(#.*$)/gm, '<span class="comment">$1</span>');
      // Keys
      highlighted = highlighted.replace(/^(\s*)(\w+):/gm, '$1<span class="property">$2</span>:');
      // Strings
      highlighted = highlighted.replace(/(&quot;[^&]*&quot;|&#39;[^&]*&#39;)/g, '<span class="string">$1</span>');
      // Boolean/null values
      highlighted = highlighted.replace(/\b(true|false|null|yes|no)\b/g, '<span class="keyword">$1</span>');
    }

    // Docker highlighting
    if (lang === 'dockerfile' || lang === 'docker') {
      // Comments
      highlighted = highlighted.replace(/(#.*$)/gm, '<span class="comment">$1</span>');
      // Instructions
      highlighted = highlighted.replace(/\b(FROM|RUN|CMD|LABEL|EXPOSE|ENV|ADD|COPY|ENTRYPOINT|VOLUME|USER|WORKDIR|ARG|ONBUILD|STOPSIGNAL|HEALTHCHECK|SHELL)\b/g, '<span class="keyword">$1</span>');
      // Strings
      highlighted = highlighted.replace(/(&quot;[^&]*&quot;|&#39;[^&]*&#39;)/g, '<span class="string">$1</span>');
    }

    // JSON highlighting
    if (lang === 'json') {
      // Property names
      highlighted = highlighted.replace(/(&quot;[\w-]+&quot;)(\s*:)/g, '<span class="property">$1</span>$2');
      // Strings
      highlighted = highlighted.replace(/:\s*(&quot;[^&]*&quot;)/g, ': <span class="string">$1</span>');
      // Numbers, booleans, null
      highlighted = highlighted.replace(/\b(true|false|null|\d+\.?\d*)\b/g, '<span class="keyword">$1</span>');
    }

    return highlighted;
  }

  // Simple markdown to HTML converter
  function parseMarkdown(markdown: string): string {
    let html = markdown;

    // Code blocks with syntax highlighting
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
      const highlighted = highlightCode(code.trim(), lang || 'text');
      return `<pre><code class="language-${lang || 'text'}">${highlighted}</code></pre>`;
    });

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // Unordered lists
    html = html.replace(/^\* (.+)$/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    // Ordered lists
    html = html.replace(/^\d+\. (.+)$/gim, '<li>$1</li>');

    // Line breaks
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/^(?!<[hup]|<pre|<code|<li)(.*)/gim, '<p>$1</p>');

    // Clean up
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>(<h[1-6]>)/g, '$1');
    html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
    html = html.replace(/<p>(<pre>)/g, '$1');
    html = html.replace(/(<\/pre>)<\/p>/g, '$1');
    html = html.replace(/<p>(<ul>)/g, '$1');
    html = html.replace(/(<\/ul>)<\/p>/g, '$1');

    return html;
  }

  function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  $: htmlContent = parseMarkdown(content);
</script>

<div class="markdown-content">
  {@html htmlContent}
</div>

<style>
  .markdown-content {
    line-height: 1.8;
    color: var(--color-text-secondary);
    font-size: 1.0625rem;
  }

  .markdown-content :global(h1) {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--color-text-primary);
    margin-top: 3rem;
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid var(--color-border-default);
    letter-spacing: -0.02em;
    line-height: 1.2;
  }

  .markdown-content :global(h1:first-child) {
    margin-top: 0;
  }

  .markdown-content :global(h2) {
    font-size: 1.875rem;
    font-weight: 700;
    color: var(--color-text-primary);
    margin-top: 3rem;
    margin-bottom: 1.25rem;
    padding-bottom: 0.625rem;
    border-bottom: 2px solid var(--color-border-default);
    letter-spacing: -0.01em;
    line-height: 1.3;
    scroll-margin-top: 100px;
  }

  .markdown-content :global(h3) {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin-top: 2.5rem;
    margin-bottom: 1rem;
    line-height: 1.4;
    scroll-margin-top: 100px;
  }

  .markdown-content :global(p) {
    margin-bottom: 1.5rem;
    line-height: 1.8;
  }

  .markdown-content :global(a) {
    color: var(--color-accent-blue-light);
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 2px;
    transition: all var(--transition-base);
  }

  .markdown-content :global(a:hover) {
    color: var(--color-accent-green);
    text-decoration-thickness: 2px;
  }

  .markdown-content :global(strong) {
    font-weight: 600;
    color: var(--color-text-primary);
  }

  .markdown-content :global(em) {
    font-style: italic;
    color: var(--color-text-secondary);
  }

  .markdown-content :global(code) {
    font-family: var(--font-mono);
    font-size: 0.9em;
    background: rgba(83, 155, 245, 0.1);
    border: 1px solid rgba(83, 155, 245, 0.2);
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius-sm);
    color: var(--color-accent-blue-light);
  }

  .markdown-content :global(pre) {
    position: relative;
    background: linear-gradient(135deg, #0d0d14 0%, #12121a 100%);
    border: 1px solid rgba(139, 92, 246, 0.25);
    border-radius: var(--radius-lg);
    padding: 0;
    overflow: hidden;
    margin: 2rem 0;
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.4),
      0 0 40px rgba(139, 92, 246, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.03);
  }

  /* Code block header bar */
  .markdown-content :global(pre)::before {
    content: '';
    display: block;
    height: 40px;
    background: linear-gradient(90deg, rgba(139, 92, 246, 0.12), rgba(6, 182, 212, 0.08));
    border-bottom: 1px solid rgba(139, 92, 246, 0.2);
  }

  /* Terminal dots */
  .markdown-content :global(pre)::after {
    content: '';
    position: absolute;
    top: 14px;
    left: 16px;
    width: 12px;
    height: 12px;
    background: #ff5f57;
    border-radius: 50%;
    box-shadow:
      20px 0 0 #ffbd2e,
      40px 0 0 #28ca42;
  }

  .markdown-content :global(pre code) {
    display: block;
    background: transparent;
    border: none;
    padding: 1.5rem 1.75rem 1.75rem;
    font-size: 0.875rem;
    color: #e4e4ef;
    line-height: 1.75;
    overflow-x: auto;
  }

  :root[data-theme="light"] .markdown-content :global(pre) {
    background: linear-gradient(135deg, #1a1a2e 0%, #1e1e30 100%);
  }

  /* Syntax highlighting colors - Cyberpunk/VS Code Dark+ inspired */
  .markdown-content :global(.keyword) {
    color: #c792ea;
    font-weight: 500;
  }

  .markdown-content :global(.string) {
    color: #a5d6ff;
  }

  .markdown-content :global(.comment) {
    color: #6a737d;
    font-style: italic;
  }

  .markdown-content :global(.function) {
    color: #dcdcaa;
  }

  .markdown-content :global(.property) {
    color: #f472b6;
  }

  .markdown-content :global(.flag) {
    color: #4ade80;
  }

  .markdown-content :global(.number) {
    color: #f97316;
  }

  .markdown-content :global(.variable) {
    color: #9cdcfe;
  }

  .markdown-content :global(ul),
  .markdown-content :global(ol) {
    margin: 1.5rem 0;
    padding-left: 2rem;
  }

  .markdown-content :global(li) {
    margin-bottom: 0.75rem;
    line-height: 1.8;
  }

  .markdown-content :global(li::marker) {
    color: var(--color-accent-blue-light);
    font-weight: 600;
  }

  .markdown-content :global(ul li::marker) {
    content: "▸ ";
  }

  .markdown-content :global(blockquote) {
    border-left: 4px solid var(--color-accent-blue);
    padding: 1rem 1.5rem;
    margin: 2rem 0;
    background: rgba(83, 155, 245, 0.05);
    border-radius: var(--radius-md);
    color: var(--color-text-secondary);
    font-style: italic;
  }

  .markdown-content :global(hr) {
    border: none;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, var(--color-border-default) 50%, transparent 100%);
    margin: 3rem 0;
  }

  /* First paragraph special styling */
  .markdown-content :global(h2 + p) {
    font-size: 1.125rem;
    color: var(--color-text-primary);
  }

  /* Responsive typography */
  @media (max-width: 768px) {
    .markdown-content {
      font-size: 1rem;
    }

    .markdown-content :global(h1) {
      font-size: 2rem;
    }

    .markdown-content :global(h2) {
      font-size: 1.5rem;
      margin-top: 2.5rem;
    }

    .markdown-content :global(h3) {
      font-size: 1.25rem;
      margin-top: 2rem;
    }

    .markdown-content :global(pre) {
      padding: 1.25rem;
      margin: 1.5rem -0.5rem;
    }
  }
</style>
