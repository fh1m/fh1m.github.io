---
act: next
chapterKey: "08"
name: secure-terminal-p2p-chat
category: compute
status: prototype
yearLabel: "2026"
dateStart: 2026-01
# [VERIFY]: exact month unknown — brief gives year only; month approximated for schema
summary: RSA key exchange + AES-GCM, terminal P2P — build the crypto layer yourself, no framework.
tags:
  - crypto
  - rsa
  - aes-gcm
  - p2p
  - terminal
repoLink: https://github.com/fh1m/secure-terminal-p2p-chat
stack:
  - name: Python
    weight: 100
draft: false
---

## Problem

Most chat applications hand their security to a framework and never look inside. The question behind secure-terminal-p2p-chat is the one I usually end up asking: what is actually happening underneath the abstraction? Can two terminals talk to each other securely when the crypto layer is built by hand?

## Difficulty

The difficulty is that cryptography punishes the confident. Key exchange, encryption, and the protocol that ties them together all have to be right — and "right" in crypto means there is no partial credit. RSA key exchange plus AES-GCM sounds simple until you have to implement the handshake yourself.

## Built

secure-terminal-p2p-chat — a terminal P2P chat where the security layer is built from the primitives: RSA key exchange and AES-GCM encryption, no framework doing the work. The session starts plaintext and upgrades to encrypted (PLAIN_CHAT → SEC_CHAT) via /share, with /rekey rotating session keys; RSA-2048 (RSA-OAEP/RSA-PSS) plus AES-256-GCM, verified with Wireshark packet captures.

## Owned

The crypto layer — the key exchange, the encryption, and the protocol. The part of the system that is supposed to be trusted, built by hand so it can be understood.

## Failed

The prototype is a prototype because building crypto by hand is exactly as dangerous as it sounds. The failures were the ones that crypto is designed to punish — and they were the best lessons in the project.

## Changed

It changed what I trust. Building the crypto layer yourself makes you permanently suspicious of the frameworks that hide it — and permanently respectful of the people who get it right.

## Machine-now

A prototype — the terminal P2P chat runs with its hand-built RSA + AES-GCM layer, standing as the record of the instinct to rebuild the part I was told not to worry about.

## Lesson

Build the crypto layer yourself, no framework — not because the result is production-grade, but because it is the only way to actually understand what the abstraction is doing.