---
title: "HTB: Pilgrimage - Easy Linux Box"
description: "ImageMagick arbitrary file read vulnerability CVE-2022-44268 exploited to extract credentials. Binwalk RCE vulnerability used for privilege escalation to root."
difficulty: "Easy"
platform: "HackTheBox"
category: "Linux"
tags: ["htb", "linux", "imagemagick", "cve", "binwalk"]
date: "2025-07-10"
featured: false
---

## Overview

Pilgrimage features ImageMagick and Binwalk vulnerabilities.

## Reconnaissance

Image shrinking web application discovered on port 80.

## Exploitation

CVE-2022-44268 allows arbitrary file read through crafted PNG files.

## Privilege Escalation

Binwalk path traversal vulnerability leads to root shell.
