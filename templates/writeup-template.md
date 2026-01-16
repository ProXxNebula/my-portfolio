---
title: "Platform: Machine Name - Difficulty"
description: "Brief 1-2 sentence description of the machine and main exploitation techniques"
difficulty: "Easy"  # Easy, Intermediate, Medium, Advanced, Hard
platform: "HackTheBox"  # HackTheBox, TryHackMe, PortSwigger, etc.
category: "Linux"  # Linux, Windows, Web, etc.
tags: ["tag1", "tag2", "tag3"]  # Relevant tags: htb, linux, windows, privesc, webapp, etc.
date: "2026-01-17"  # Publication date in YYYY-MM-DD format
featured: false  # Set to true to feature this writeup
---

## Overview

Brief overview of the machine and what you'll learn from this writeup.

**Target Information:**
* **IP:** 10.10.11.xxx
* **Difficulty:** Easy/Medium/Hard
* **OS:** Linux/Windows

## Reconnaissance

### Port Scanning

Initial enumeration:

```bash
nmap -sC -sV -oA nmap/initial TARGET_IP
```

**Results:**
```
PORT    STATE SERVICE VERSION
22/tcp  open  ssh     OpenSSH x.x
80/tcp  open  http    nginx x.x
```

### Service Enumeration

Details about discovered services...

## Initial Access

### Vulnerability Discovery

How you found the vulnerability...

```bash
# Commands used
```

### Exploitation

Steps to exploit the vulnerability...

```bash
# Exploitation commands
```

## Privilege Escalation

### Discovery

What you found during enumeration...

```bash
# Enumeration commands
```

### Exploitation

How you escalated privileges...

```bash
# Privesc commands
```

## Key Takeaways

1. **Main lesson 1**
2. **Main lesson 2**
3. **Main lesson 3**

## Remediation

1. Security recommendation 1
2. Security recommendation 2
3. Security recommendation 3
