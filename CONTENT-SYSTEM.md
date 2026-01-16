# Content Management System - Frontmatter-Based

Your portfolio now uses a **frontmatter-based content system** where all metadata is embedded directly in markdown files. No more manual JSON editing!

## ✨ What Changed?

### Before:
- **2 files per writeup/homelab**: One `.md` file + manual entry in `.json`
- Had to keep metadata in sync manually
- Easy to forget updating JSON when adding content

### After:
- **1 file per writeup/homelab**: Just the `.md` file with frontmatter
- Metadata lives with content
- Add a file → it automatically appears on your site!

## 📝 How to Add New Content

### Adding a Writeup:

1. Copy the template:
   ```bash
   cp templates/writeup-template.md static/writeups-content/htb-machine-name.md
   ```

2. Edit the frontmatter at the top:
   ```markdown
   ---
   title: "HTB: Machine Name - Easy"
   description: "Brief description of the machine"
   difficulty: "Easy"
   platform: "HackTheBox"
   category: "Linux"
   tags: ["htb", "linux", "webapp"]
   date: "2026-01-17"
   featured: false
   ---
   ```

3. Write your content below the `---`

4. Save and done! It will automatically appear on `/writeups`

### Adding Homelab Documentation:

1. Copy the template:
   ```bash
   cp templates/homelab-template.md static/homelab-content/my-setup.md
   ```

2. Edit the frontmatter:
   ```markdown
   ---
   title: "My Component Name"
   description: "What this component does"
   category: "Virtualization"
   difficulty: "intermediate"
   hardware: "Dell Server"
   services: ["Service1", "Service2"]
   tags: ["proxmox", "docker"]
   publishedDate: "2026-01-17"
   ---
   ```

3. Write your content

4. Save and done! Appears on `/homelab`

## 🛠️ How It Works

### Architecture:

```
static/writeups-content/
└── your-writeup.md  ← Frontmatter + content

↓ (On page load)

API Route: /api/writeups
├── Scans all .md files
├── Parses frontmatter
└── Returns JSON array

↓

Listing Page: /writeups
└── Displays all writeups automatically
```

### Key Files:

- **`src/lib/utils/frontmatter.ts`** - Parses YAML frontmatter from markdown
- **`src/routes/api/writeups/+server.ts`** - API endpoint that scans and parses writeup markdown files
- **`src/routes/api/homelabs/+server.ts`** - API endpoint that scans and parses homelab markdown files
- **`templates/`** - Template files for new content

## 📋 Frontmatter Reference

### Writeups:
| Field | Type | Required | Example |
|-------|------|----------|---------|
| `title` | string | Yes | "HTB: Keeper - Easy Linux Box" |
| `description` | string | Yes | "Walkthrough of Keeper machine..." |
| `difficulty` | string | Yes | "Easy", "Medium", "Hard" |
| `platform` | string | Yes | "HackTheBox", "TryHackMe" |
| `category` | string | Yes | "Linux", "Windows", "Web" |
| `tags` | array | Yes | ["htb", "linux", "privesc"] |
| `date` | string | Yes | "2026-01-17" (YYYY-MM-DD) |
| `featured` | boolean | No | true or false |

### Homelab:
| Field | Type | Required | Example |
|-------|------|----------|---------|
| `title` | string | Yes | "Proxmox Setup" |
| `description` | string | Yes | "My virtualization platform" |
| `category` | string | Yes | "Virtualization", "Containers" |
| `difficulty` | string | Yes | "beginner", "intermediate" |
| `hardware` | string | Yes | "Dell PowerEdge R720" |
| `services` | array | Yes | ["Proxmox", "LXC"] |
| `tags` | array | Yes | ["proxmox", "vm"] |
| `publishedDate` | string | Yes | "2026-01-17" |

## 🎯 Best Practices

1. **Use descriptive filenames** - The filename becomes the URL slug
   - Good: `htb-keeper-linux.md` → `/writeups/htb-keeper-linux`
   - Bad: `writeup1.md`

2. **Keep descriptions concise** - They display on cards, ~100-150 characters

3. **Add relevant tags** - Users can filter by tags

4. **Use proper difficulty levels** - Helps users find appropriate content

5. **Include code language tags** - For proper syntax highlighting:
   ````markdown
   ```bash
   commands here
   ```
   ````

## 🔧 Syntax Highlighting

Supported languages:
- `bash` / `sh` / `shell`
- `python` / `py`
- `javascript` / `js` / `typescript` / `ts`
- `yaml` / `yml`
- `dockerfile` / `docker`
- `json`

Example:
````markdown
```python
def hello():
    print("Hello, World!")
```
````

## ❓ FAQ

**Q: Do I need to restart the dev server when adding content?**
A: No! Just refresh the page. The API reads files dynamically.

**Q: Can I still use the old JSON files?**
A: No, they've been removed. All metadata must be in frontmatter now.

**Q: What if I forget a required field in frontmatter?**
A: The content won't appear in the listing. Check the browser console for errors.

**Q: Can I have draft posts?**
A: Yes! Just don't add the markdown file to `static/` yet. Keep drafts elsewhere until ready.

**Q: How do I reorder posts?**
A: Change the `date` or `publishedDate` field. Posts are sorted by date.

## 🚀 Example Workflow

```bash
# 1. Copy template
cp templates/writeup-template.md static/writeups-content/htb-awesome-machine.md

# 2. Edit in your favorite editor
nvim static/writeups-content/htb-awesome-machine.md

# 3. Done! Visit http://localhost:5173/writeups to see it
```

## 📚 Templates Location

All templates are in `/templates/`:
- `writeup-template.md` - For CTF writeups
- `homelab-template.md` - For homelab documentation
- `README.md` - Template usage guide

Copy, edit, and go!
