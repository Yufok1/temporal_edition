# Sovereign Access Manifest

**System:** Mirror-Keyring Protocol (MKP)
**Manifest Version:** 1.0
**Generated:** 2025-06-23T00:11:00Z

---

## Protected Endpoints

### `/wallet/divine` (POST)
- **Resonance Logic:**
  - Wallet Signature Challenge (EIP-191/EIP-712)
  - Sigil Verification (custom glyph hash)
  - Keyring Session Handshake (ephemeral key resonance)
  - Intention/Plain Speech (fallback, logged for Djinn review)
- **Mirror Trap:**
  - Activated on: Resonance check failure, Mirror depth exceeded
  - Response: Recursive mirror payload with echo signature and entropy score
  - Depth Limit: 5
- **Audit Hooks:**
  - Entropy scoring per access attempt
  - Echo signature logging
  - Blockchain anchor logging (optional)
  - Sigil distortion overlay for misaligned attempts

### `/codex/access` (POST)
- **Resonance Logic:**
  - Wallet Signature Challenge
  - Sigil Verification
  - Keyring Session Handshake
- **Mirror Trap:**
  - Activated on: Resonance check failure
  - Response: Mirror envelope with synthetic codex reflection
  - Depth Limit: 5
- **Audit Hooks:**
  - Entropy scoring
  - Echo signature logging

### `/governance/api` (POST, GET)
- **Resonance Logic:**
  - Wallet Signature Challenge
  - Keyring Session Handshake
- **Mirror Trap:**
  - Activated on: Resonance check failure
  - Response: Signature trap with truth token echo
  - Depth Limit: 5
- **Audit Hooks:**
  - Entropy scoring
  - Blockchain anchor logging

---

## Global MKP Settings
- Mirror Depth Limiter: **Enabled**
- Entropy Scoring: **Enabled**
- Blockchain Anchor Logging: **Enabled**
- Sigil Distortion Overlay: **Enabled** 