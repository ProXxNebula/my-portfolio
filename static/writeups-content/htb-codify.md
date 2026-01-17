---
title: "HTB: Codify - Easy Linux Box"
description: "Walkthrough of the Codify machine from HackTheBox. Exploiting a Node.js sandbox escape vulnerability to gain initial access, then leveraging SQLite database credentials for privilege escalation."
difficulty: "Easy"
platform: "HackTheBox"
category: "Linux"
tags: ["htb", "linux", "nodejs", "sandbox-escape", "sqlite"]
date: "2025-11-15"
featured: false
---

## Overview

Codify is an Easy-rated Linux machine featuring a web-based code editor with a vulnerable sandbox implementation.

## Reconnaissance

Initial enumeration reveals a Node.js application running on port 3000.

## Exploitation

The sandbox escape allows command execution through the vm2 library vulnerability.

## Privilege Escalation

Database credentials found in SQLite database lead to root access.
