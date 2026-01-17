---
title: "HTB: PC - Easy Linux Box"
description: "gRPC service enumeration and SQL injection exploitation for initial access. PyLoad RCE vulnerability CVE-2023-0297 used for privilege escalation to root."
difficulty: "Easy"
platform: "HackTheBox"
category: "Linux"
tags: ["htb", "linux", "grpc", "sqli", "pyload"]
date: "2025-06-05"
featured: false
---

## Overview

PC features gRPC protocol exploitation and PyLoad vulnerability.

## Reconnaissance

Port 50051 running gRPC service discovered through full port scan.

## Exploitation

SQL injection in gRPC SimpleApp service extracts SSH credentials.

## Privilege Escalation

CVE-2023-0297 PyLoad RCE allows privilege escalation to root.
