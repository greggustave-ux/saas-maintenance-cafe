# MCP Stability Report

This report outlines the current status, configuration, and verification of the Model Context Protocol (MCP) servers for the Welo Platform.

## ⚙️ Current Stable Configuration

The stable configuration has been saved to the global `mcp_config.json` file:
📂 **Path:** `C:\Users\Dylan\.gemini\antigravity-ide\mcp_config.json`

```json
{
  "mcpServers": {
    "figma": {
      "serverUrl": "https://mcp.figma.com/mcp"
    },
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ]
    }
  }
}
```

* **GitHub MCP**: **Enabled** (via `npx @modelcontextprotocol/server-github`)
* **Figma MCP (Remote)**: **Enabled** (via official server URL `https://mcp.figma.com/mcp`)
* **Supabase MCP**: **Disabled** (pending OAuth credentials initialization)

---

## 🔍 Verification & Status Summary

### 1. GitHub MCP
* **Status:** Enabled but Lacks Authentication
* **Details:** The GitHub MCP server is configured in `mcp_config.json`. However, the environment variable `GITHUB_PERSONAL_ACCESS_TOKEN` is currently **not set** in the operating system environment. 
* **Action Required:** Generate a classic GitHub Personal Access Token with the `repo` scope and configure it as `GITHUB_PERSONAL_ACCESS_TOKEN` in the environment variables, then restart the IDE.

### 2. Figma MCP (Remote)
* **Status:** Enabled but Pending OAuth
* **Details:** The remote Figma server is enabled. However, the global OAuth credentials file `mcp_oauth_tokens.json` is currently empty (`2 bytes`), indicating that Figma OAuth/authentication has not been completed.
* **Action Required:** Complete the browser OAuth login sequence when prompted by the IDE to authorize the Figma MCP connection.

### 3. Supabase MCP
* **Status:** Disabled
* **Details:** Disabled to prevent connection/loading issues until database OAuth credentials can be securely configured.

---

*Report generated on 2026-06-06*
