---
title: "Proxmox VE Virtualization Setup"
description: "Complete guide to setting up Proxmox Virtual Environment for my homelab infrastructure"
category: "Virtualization"
difficulty: "intermediate"
hardware: "Dell PowerEdge R720"
services: ["Proxmox VE", "LXC Containers", "Virtual Machines"]
tags: ["proxmox", "virtualization", "infrastructure"]
publishedDate: "2026-01-15"
---

# Proxmox VE Virtualization Setup

## Overview

This document details my Proxmox Virtual Environment setup, which serves as the backbone of my homelab infrastructure. Proxmox VE is an open-source virtualization platform that combines KVM hypervisor and LXC containers with a web-based management interface.

## Hardware Specifications

**Server**: Dell PowerEdge R720
- **CPU**: 2x Intel Xeon E5-2670 v2 (20 cores / 40 threads total)
- **RAM**: 128GB DDR3 ECC
- **Storage**:
  - 2x 500GB SSD (RAID 1) - Proxmox OS & VMs
  - 4x 4TB HDD (RAID 10) - Bulk storage
- **Network**: Dual 1Gbps NICs

## Installation Process

### Initial Setup

```bash
# Downloaded Proxmox VE ISO from official website
wget https://www.proxmox.com/en/downloads

# Created bootable USB using dd command
sudo dd if=proxmox-ve_*.iso of=/dev/sdX bs=1M status=progress

# Booted from USB and followed installation wizard
```

### Network Configuration

Configured network bridges for VM connectivity:

```bash
# /etc/network/interfaces configuration
auto lo
iface lo inet loopback

auto eno1
iface eno1 inet manual

auto vmbr0
iface vmbr0 inet static
    address 192.168.1.10/24
    gateway 192.168.1.1
    bridge-ports eno1
    bridge-stp off
    bridge-fd 0
```

### Storage Configuration

Set up ZFS pool for VM storage:

```bash
# Create ZFS pool from RAID array
zpool create -f -o ashift=12 vmdata mirror /dev/sda /dev/sdb

# Create datasets for different purposes
zfs create vmdata/vms
zfs create vmdata/containers
zfs create vmdata/backups

# Enable compression
zfs set compression=lz4 vmdata
```

## Virtual Machines

### Production VMs

1. **Ubuntu Server 22.04** - Docker host for containerized services
   - 8 vCPUs
   - 32GB RAM
   - 500GB storage
   - Running Docker Compose stack

2. **pfSense Firewall** - Network security and routing
   - 4 vCPUs
   - 8GB RAM
   - 100GB storage
   - Handles VPN, firewall rules, and traffic monitoring

3. **TrueNAS Core** - Network-attached storage
   - 2 vCPUs
   - 16GB RAM
   - Direct passthrough to RAID array
   - Manages file shares and backups

## LXC Containers

Lightweight containers for specific services:

```yaml
# Pi-hole DNS Container
lxc.id: 100
cores: 2
memory: 2048
storage: 20GB
purpose: DNS ad-blocking and network-wide filtering

# Monitoring Stack Container
lxc.id: 101
cores: 4
memory: 4096
storage: 50GB
purpose: Prometheus, Grafana, Node Exporter
```

## Backup Strategy

### Automated Backups

Configured Proxmox backup jobs:

```bash
# Weekly full backup of all VMs
vzdump --mode snapshot --compress zstd --storage backups

# Daily incremental backups
vzdump --mode snapshot --compress zstd --storage backups --maxfiles 7
```

### Off-site Backup

- Syncing critical VM backups to cloud storage using rclone
- Retention policy: 4 weekly, 6 monthly, 2 yearly

## Performance Tuning

### CPU Governor

```bash
# Set CPU scaling governor to performance
echo "performance" | tee /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor
```

### I/O Scheduler

```bash
# Use deadline scheduler for better VM performance
echo "deadline" > /sys/block/sda/queue/scheduler
```

## Monitoring & Alerts

Integrated with monitoring stack:
- **Prometheus**: Metrics collection from Proxmox API
- **Grafana**: Dashboards for CPU, RAM, storage, network
- **Alertmanager**: Email notifications for resource thresholds

## Security Hardening

### Firewall Configuration

```bash
# Enable Proxmox firewall
pvesh set /cluster/firewall/options -enable 1

# Allow only necessary ports
# SSH (22), Web UI (8006), VNC (5900-5999)
```

### Two-Factor Authentication

Enabled 2FA for Proxmox web interface using TOTP:

```bash
# Generate 2FA secret for user
pveum user tfa add root@pam -type totp
```

### Regular Updates

```bash
# Update Proxmox and all packages
apt update && apt dist-upgrade -y

# Reboot after kernel updates
systemctl reboot
```

## Lessons Learned

1. **Plan your storage carefully** - ZFS is excellent but requires proper planning for pool creation. Can't easily add drives to existing vdevs.

2. **Resource allocation** - Don't over-provision CPU/RAM. Leave headroom for host system and unexpected spikes.

3. **Backup testing** - Regularly test restore procedures. A backup is only good if you can restore from it.

4. **Network segregation** - Use VLANs and separate bridges to isolate different service types (management, production, DMZ).

5. **Documentation** - Keep detailed notes of configuration changes and network topology.

## Future Improvements

- [ ] Implement Proxmox cluster with additional node for high availability
- [ ] Set up Ceph distributed storage across cluster nodes
- [ ] Migrate to Proxmox Backup Server for dedicated backup solution
- [ ] Implement GPU passthrough for media transcoding VM
- [ ] Add UPS with network management card for graceful shutdowns

## Conclusion

Proxmox VE has been an excellent choice for my homelab virtualization platform. The combination of KVM and LXC provides flexibility, while the web interface makes management straightforward. This setup serves as the foundation for all my self-hosted services and experimental environments.
