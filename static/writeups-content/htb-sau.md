---
title: "HTB: Sau - Easy Linux Box"
description: "Request Baskets SSRF exploitation to access internal Maltrail service, followed by OS command injection for initial shell. Systemctl privilege escalation to root."
difficulty: "Easy"
platform: "HackTheBox"
category: "Linux"
tags: ["htb", "linux", "ssrf", "command-injection"]
date: "2025-07-25"
featured: false
---

## Overview

Sau features SSRF and command injection vulnerabilities.

## Reconnaissance

Request Baskets application running on port 55555.

## Exploitation

SSRF through Request Baskets exposes internal Maltrail service vulnerable to RCE.

## Privilege Escalation

Systemctl SUID binary abused for privilege escalation.
