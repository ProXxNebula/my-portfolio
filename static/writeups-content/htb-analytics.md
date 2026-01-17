---
title: "HTB: Analytics - Easy Linux Box"
description: "Exploiting Metabase pre-auth RCE vulnerability CVE-2023-38646 for initial access, then abusing Docker container escape for privilege escalation on the host."
difficulty: "Easy"
platform: "HackTheBox"
category: "Linux"
tags: ["htb", "linux", "metabase", "docker", "cve", "rce"]
date: "2025-11-01"
featured: false
---

## Overview

Analytics is an Easy Linux box featuring Metabase vulnerability exploitation and Docker escape.

## Reconnaissance

Web server running Metabase analytics platform discovered on port 3000.

## Exploitation

CVE-2023-38646 allows pre-authenticated remote code execution.

## Privilege Escalation

Docker container escape through environment variable exposure leads to root.
