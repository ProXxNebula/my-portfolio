<script lang="ts">
  import { onMount } from 'svelte';

  export let content: string = '';

  let htmlContent = '';

  // Simple markdown to HTML converter
  function parseMarkdown(markdown: string): string {
    let html = markdown;

    // Code blocks
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<pre><code class="language-${lang || 'text'}">${escapeHtml(code.trim())}</code></pre>`;
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
    background: var(--color-bg-tertiary);
    border: 1px solid var(--color-border-default);
    border-radius: var(--radius-lg);
    padding: 1.75rem;
    overflow-x: auto;
    margin: 2rem 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .markdown-content :global(pre code) {
    background: transparent;
    border: none;
    padding: 0;
    font-size: 0.9375rem;
    color: var(--color-accent-green);
    line-height: 1.8;
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
