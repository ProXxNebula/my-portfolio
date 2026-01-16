# Markdown Templates

This directory contains templates for creating new content for your portfolio.

## How to Use

### For Writeups:

1. Copy `writeup-template.md` to `static/writeups-content/`
2. Rename it to match your slug (e.g., `htb-machine-name.md`)
3. Fill in the frontmatter fields at the top
4. Write your content below the `---` separator
5. Save the file - it will automatically appear on the writeups page!

### For Homelab Docs:

1. Copy `homelab-template.md` to `static/homelab-content/`
2. Rename it to match your slug (e.g., `proxmox-setup.md`)
3. Fill in the frontmatter fields at the top
4. Write your content below the `---` separator
5. Save the file - it will automatically appear on the homelab page!

## Frontmatter Fields

### Writeups:
- **title**: Full title of the writeup
- **description**: Brief description (shows on card)
- **difficulty**: Easy, Intermediate, Medium, Advanced, or Hard
- **platform**: HackTheBox, TryHackMe, PortSwigger, etc.
- **category**: Linux, Windows, Web, Mobile, etc.
- **tags**: Array of relevant tags
- **date**: Publication date (YYYY-MM-DD)
- **featured**: true/false (highlights the writeup)

### Homelab:
- **title**: Full title of the documentation
- **description**: Brief description (shows on card)
- **category**: Virtualization, Containers, Networking, etc.
- **difficulty**: beginner, intermediate, advanced
- **hardware**: Hardware or VM specifications
- **services**: Array of services/applications
- **tags**: Array of relevant tags
- **publishedDate**: Publication date (YYYY-MM-DD)

## Tips

- Use descriptive slugs (filename without .md)
- Keep descriptions concise for card display
- Add relevant tags for better filtering
- Use code blocks with language tags for syntax highlighting
- Include screenshots and diagrams where helpful
- Break content into sections with ## headings for table of contents

## No Manual JSON Editing!

You no longer need to edit `writeups.json` or `homelabs.json` files.
Just add a markdown file with frontmatter and it will automatically show up!
