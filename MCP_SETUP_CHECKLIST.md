# MCP Setup Checklist - Welo Platform SaaS

This document guides you through configuring, authorizing, and testing the Model Context Protocol (MCP) servers in Antigravity for the Welo Platform project.

---

## 📋 Configuration File Location

The MCP configuration for Antigravity is stored globally in your user profile:
📂 **Path:** `C:\Users\Dylan\.gemini\antigravity-ide\mcp_config.json`

---

## 🛠️ MCP Servers Setup

### 1. GitHub MCP Server
Runs locally using `npx` and connects securely to GitHub's API. It is configured to inherit your system's environment variables to keep tokens out of the configuration file.

#### 🔑 Token Creation & Permissions
1. Go to **GitHub** -> **Settings** -> **Developer Settings** -> **Personal Access Tokens** -> **Tokens (classic)**.
2. Click **Generate new token (classic)**.
3. Set the Note to `Antigravity MCP Server`.
4. **Required Scopes:**
   - `repo` (Full control of private repositories - required to write code, create branches, PRs, etc.)
   - `gist` (Allows creating and updating gists)
   - `read:org` (Allows reading organization details if accessing repo under an org)
5. Copy the generated token immediately.

#### ⚙️ Environment Configuration (Windows)
To avoid storing the token in plain text inside `mcp_config.json`, store it as an OS-level environment variable:
1. Open the **Start Menu**, search for **"Edit the system environment variables"**, and open it.
2. Click the **Environment Variables...** button.
3. Under **User variables for <your-username>**, click **New...**.
4. Set **Variable name** to `GITHUB_PERSONAL_ACCESS_TOKEN`.
5. Set **Variable value** to your copied GitHub Personal Access Token.
6. Click **OK** on all dialogs to save.
7. **Restart Antigravity/IDE** for the new environment variables to take effect.

#### ⚙️ Configuration in `mcp_config.json`
```json
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ]
    }
```

---

### 2. Supabase MCP Server
Connects to the official hosted Supabase MCP service to securely inspect schemas, run safe queries, and coordinate with database instances.

#### 🔑 Authentication Process
1. Configured to point to the remote server URL: `https://mcp.supabase.com/mcp`.
2. No token is stored in the JSON file. 
3. When the server starts, Antigravity will prompt you to authenticate via OAuth in your default browser.
4. Log into your Supabase account and authorize the connection.

#### ⚙️ Configuration in `mcp_config.json`
```json
    "supabase": {
      "serverUrl": "https://mcp.supabase.com/mcp"
    }
```

---

### 3. Figma MCP Server
Allows inspecting Figma design files, components, and styles directly from Antigravity.

#### 🔑 Authentication Process
1. Configured to point to the official Figma remote server: `https://mcp.figma.com/mcp`.
2. When the server launches, it will trigger an OAuth flow in your default browser.
3. Log into Figma and authorize Antigravity to access your design files.

#### ⚙️ Configuration in `mcp_config.json`
```json
    "figma": {
      "serverUrl": "https://mcp.figma.com/mcp"
    }
```

---

## 🧪 Testing & Verification Checklist

Always test each MCP connection separately before using it in project workflows.

- [ ] **GitHub Connection**
  - Verify that tools like `github_list_repositories`, `github_get_issue`, or `github_search_code` are loaded and available.
  - Test by running a read-only command (e.g., search or list files).
- [ ] **Supabase Connection**
  - Verify that database exploration tools are loaded.
  - Authenticate the OAuth popup if prompted.
- [ ] **Figma Connection**
  - Verify that Figma tools (e.g., get file, get nodes) are loaded.
  - Complete the browser OAuth login.
  - Verify that the connection is strictly **Read-Only** (e.g. no comments, no node modifications).
- [ ] **Local Sandbox Mode**
  - Confirm that no production or staging secrets/credentials exist in `mcp_config.json`.
  - Confirm that write capabilities are blocked and only passive read/audit queries run.

---

## ⚠️ Mandatory Safety Rules & Boundaries

- **Never** perform automatic database migrations or execute `.sql` migration files on production without explicit human approval.
- **Never** modify Row Level Security (RLS) policies without explicit human approval.
- **Never** delete production database records or drop tables.
- **Never** trigger Vercel production deployment triggers or push directly to main/production branches without explicit human approval.
- **Never** store API keys, tokens, or credentials in any file within the workspace repository.
- **Always** document MCP configuration changes.
- **Always** test each MCP connection separately before relying on it for automated tasks.

---

## 📂 Reference Integration Guidelines

Refer to these architectural documents for specific implementation details:
- **Figma Integration Strategy:** [docs/MCP_FIGMA_SETUP.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/MCP_FIGMA_SETUP.md)
- **Security Rules & Boundaries:** [docs/MCP_SECURITY_RULES.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/MCP_SECURITY_RULES.md)
- **Staging Environment Strategy:** [docs/STAGING_ENVIRONMENT_STRATEGY.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/STAGING_ENVIRONMENT_STRATEGY.md)
- **Design Token Strategy:** [docs/DESIGN_TOKEN_STRATEGY.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/DESIGN_TOKEN_STRATEGY.md)
- **Mobile Component Guidelines:** [docs/MOBILE_COMPONENT_GUIDELINES.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/MOBILE_COMPONENT_GUIDELINES.md)
- **UI Synchronization Rules:** [docs/UI_SYNCHRONIZATION_RULES.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/UI_SYNCHRONIZATION_RULES.md)
- **Component Registry:** [docs/COMPONENT_REGISTRY.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/COMPONENT_REGISTRY.md)
- **Component Versioning Rules:** [docs/COMPONENT_VERSIONING_RULES.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/COMPONENT_VERSIONING_RULES.md)
- **Operational UI Patterns:** [docs/OPERATIONAL_UI_PATTERNS.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/OPERATIONAL_UI_PATTERNS.md)
- **Technical Design System Implementation:** [docs/TECHNICAL_DESIGN_SYSTEM_IMPLEMENTATION.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/TECHNICAL_DESIGN_SYSTEM_IMPLEMENTATION.md)
- **Legacy UI Migration Plan:** [docs/LEGACY_UI_MIGRATION_PLAN.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/LEGACY_UI_MIGRATION_PLAN.md)
- **Component Migration Priority:** [docs/COMPONENT_MIGRATION_PRIORITY.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/COMPONENT_MIGRATION_PRIORITY.md)
- **Operational Regression Prevention:** [docs/OPERATIONAL_REGRESSION_PREVENTION.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/OPERATIONAL_REGRESSION_PREVENTION.md)
- **Figma Discovery Layer:** [docs/MCP_FIGMA_DISCOVERY_LAYER.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/MCP_FIGMA_DISCOVERY_LAYER.md)
- **Figma Node Mapping Strategy:** [docs/FIGMA_NODE_MAPPING_STRATEGY.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/FIGMA_NODE_MAPPING_STRATEGY.md)
- **Figma Permission Boundaries:** [docs/MCP_FIGMA_PERMISSION_BOUNDARIES.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/MCP_FIGMA_PERMISSION_BOUNDARIES.md)
- **Local Sandbox Setup:** [docs/MCP_LOCAL_SANDBOX_SETUP.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/MCP_LOCAL_SANDBOX_SETUP.md)
- **Local Testing Rules:** [docs/MCP_LOCAL_TESTING_RULES.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/MCP_LOCAL_TESTING_RULES.md)
- **Audit Output Spec:** [docs/MCP_AUDIT_OUTPUT_SPEC.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/MCP_AUDIT_OUTPUT_SPEC.md)



