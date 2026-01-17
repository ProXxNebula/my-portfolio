---
title: "HTB: CozyHosting - Easy Linux Box"
description: "Spring Boot Actuator exposure leads to session hijacking, then command injection in SSH functionality provides shell access. PostgreSQL credentials enable privilege escalation."
difficulty: "Easy"
platform: "HackTheBox"
category: "Linux"
tags: ["htb", "linux", "spring-boot", "command-injection", "postgresql"]
date: "2025-10-05"
featured: false
---

## Overview

CozyHosting is an Easy box featuring Spring Boot vulnerabilities and command injection.

## Reconnaissance

Spring Boot application with exposed actuator endpoints discovered.

## Exploitation

Session cookie stolen from actuator/sessions endpoint enables admin access.

## Privilege Escalation

PostgreSQL database contains hashed credentials leading to root.
