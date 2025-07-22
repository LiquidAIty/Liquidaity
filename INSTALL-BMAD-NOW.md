# INSTALL BMAD PROPERLY - CRITICAL STEPS

## Step 1: Install BMAD in your project directory

Open terminal in `c:\Projects\LiquidAIty\Liquidaity\` and run:

```bash
npx bmad-method install
```

When prompted:
- Choose "Complete installation"
- Select "Windsurf" as your IDE
- Confirm installation location

## Step 2: Verify Installation

After installation, you should see:
- `.bmad-core/` folder created
- `.bmad-core/agents/` with all agent files
- Windsurf-specific integration files

## Step 3: Test BMAD Agents

In a NEW Windsurf chat, type:
```
@bmad-master
```

You should see the BMAD orchestrator activate, NOT Cascade/Claude.

## Step 4: If Installation Fails

If `npx bmad-method install` doesn't work:

1. Try global install first:
```bash
npm install -g bmad-method
bmad-method install
```

2. Or manual setup - create `.bmad-core` folder and copy agent files

## Step 5: Use the Startup Prompt

For every new chat, copy the content from `BMAD-STARTUP-PROMPT.md` to ensure BMAD context loads properly.

## CRITICAL SUCCESS INDICATORS

✅ `.bmad-core/` folder exists in your project
✅ `@bmad-master` activates BMAD orchestrator (not Cascade)
✅ Agents stay in character and don't revert to Cascade
✅ Master plan in `docs/bmad-master-plan.md` is preserved

If any of these fail, BMAD is not properly installed.
