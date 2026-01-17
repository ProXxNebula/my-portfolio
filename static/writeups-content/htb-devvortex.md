---
title: "HTB: Devvortex - Easy Linux Box"
description: "Joomla CMS exploitation through CVE-2023-23752 information disclosure, followed by credential reuse and apport-cli privilege escalation for root access."
difficulty: "Easy"
platform: "HackTheBox"
category: "Linux"
tags: ["htb", "linux", "joomla", "cve", "webapp"]
date: "2025-10-20"
featured: false
---

## Overview

Devvortex features a vulnerable Joomla installation with multiple attack vectors.

## Reconnaissance

Subdomain enumeration reveals dev.devvortex.htb running Joomla 4.2.6.

## Exploitation

CVE-2023-23752 exposes database credentials through API endpoint.

## Privilege Escalation

Apport-cli vulnerability allows privilege escalation to root.
