# CIW Probe Flow Diagnostic Guide

## Objective
Determine where the probe flow breaks when investigating 8.8.8.8 using browser DevTools console.

## Setup

1. **Navigate to CIW**: http://localhost:5174/cyber-awareness
2. **Open DevTools**: Press `F12` → go to **Console** tab
3. **Clear console**: Type `clear()` and press Enter
4. **Enable all logs**: All logs are `console.log` and `console.debug` (visible in console)

---

## Test Execution

### Step 1: Input Query
1. Find the **"Probe"** input field at top of Investigation Workspace
2. Type: `8.8.8.8`
3. Click **"Probe"** button
4. **Watch console for logs** (do NOT close console)

---

## Expected Console Logs (in order)

### 1️⃣ Orchestrator Receives Query
```
[Orchestrator] called with {id: "...", source: "ip", payload: "8.8.8.8", timestamp: "..."}
```
**If you DON'T see this**: Probe button click didn't reach orchestrator (UI issue)

---

### 2️⃣ Orchestrator Routes to Service
You should NOT see explicit routing logs, but you may see:
```
geoIntel.lookup: AbuseIPDB unavailable or timed out, falling back to public geo lookup
```
(This is normal if AbuseIPDB key is missing)

---

### 3️⃣ Orchestrator Returns Results
```
[Orchestrator] results {count: X, ids: ["geo-xxxxxxx"]}
```
Where:
- `count: 1` = **SUCCESS** (1 result from geoIntel)
- `count: 0` = **FAILURE** (no results, likely ipapi.co timeout or network error)

**If you DON'T see this**: Orchestrator crashed or timed out

---

### 4️⃣ CIW Store Receives Response
```
[CIW] orchestrator response {queryId: "...", resultsCount: 1, warnings: [...]}
```

**If you DON'T see this**: runQuery didn't await orchestrator response

---

### 5️⃣ CIW Store Updates Case
```
[CIW] case updated {targetCaseId: "...", addedResults: ["geo-xxxxxxx"]}
```

**If you DON'T see this**: Case update logic failed

---

### 6️⃣ RelationshipGraph Receives Data
```
[RelationshipGraph] buildGraph input: [
  {id: "geo-xxxxxxx", source: "ip", title: "IP Geolocation: 8.8.8.8", summary: "ISP: Google LLC • Country: United States", ...}
]
```

**If you DON'T see this**: lastResponse not updating OR graph component not rendering

**If you see**: `[RelationshipGraph] no data {query: false, results: false}`
→ **DIAGNOSIS**: lastResponse is null/undefined → Store update failed

---

### 7️⃣ Graph Build Output
```
[RelationshipGraph] graph output {nodes: 3, edges: 2, nodeIds: ["query-8.8.8.8", "geo-...", "org-..."]}
```

**If you DON'T see this**: buildGraph crashed or didn't produce output

**If you see fewer nodes/edges than expected**: Graph building logic issue

---

### 8️⃣ SVG Renders
Visual: You should see a **graph with nodes connected by lines** on the canvas.

**If you DON'T see any graph**: Graph render failed (CSS/SVG issue)

---

## Diagnostic Decision Tree

### Scenario A: `count: 0` at step 3
```
[Orchestrator] results {count: 0, ids: []}
```
**ROOT CAUSE**: geoIntel service returned no results
**Why**: 
- AbuseIPDB API key missing (expected fallback)
- ipapi.co request timed out or failed (network/CORS)
- Both services unavailable

**FIX**: Check network tab for failed requests; verify ipapi.co is reachable

---

### Scenario B: `count: 1` but no logs after step 4
**ROOT CAUSE**: CIW store not updating OR RelationshipGraph not subscribing

**Why**:
- Store state mutation issue
- Zustand selector not triggering re-render
- Component unmounted

**FIX**: Check React DevTools → Profiler to verify component re-renders

---

### Scenario C: Step 6 shows no data, step 3 shows `count: 1`
**ROOT CAUSE**: lastResponse in store is not being read by RelationshipGraph

**Why**:
- Zustand selector broken
- Store state structure different than expected
- Component using stale closure

**FIX**: Add log in ciwStore.ts `set()` call to verify state is saved

---

### Scenario D: Step 7 shows graph output but nothing renders
**ROOT CAUSE**: SVG render or CSS issue

**Why**:
- Graph nodes outside viewport
- Z-index issue
- SVG elements hidden

**FIX**: Inspect SVG in DevTools HTML → verify elements are present and visible

---

## Log Collection Instructions

**Once you see the issue, collect**:

1. **Copy all console logs** (Ctrl+A, Ctrl+C)
2. **Screenshot**: Showing browser console with all logs
3. **Screenshot**: Showing probe input state (is button loading? error shown?)
4. **Screenshot**: Showing graph area (is anything rendering?)

**Paste logs and screenshots into the response.**

---

## Network Tab Diagnostics

If you suspect network issues:

1. Open **Network** tab in DevTools
2. Click Probe again
3. Look for requests to:
   - `ipapi.co/8.8.8.8/json/` (should return 200 with geolocation data)
   - Any `abuseipdb` requests (optional, may 401 if no key)

**If ipapi.co request fails**: Network/CORS issue

---

## Console Filter Tips

To focus on CIW logs:

1. In **Console Filter** box, type: `[Orchestrator] OR [CIW] OR [RelationshipGraph]`
2. Logs will auto-filter

This isolates CIW-specific logs from other app noise.

---

## Manual Reset (if needed)

If state gets corrupted, run in console:
```javascript
// Clear all CIW localStorage
localStorage.removeItem('ciw-v1');
localStorage.removeItem('ciw-workspaces-v1');
localStorage.removeItem('ciw-cases-v1');
localStorage.removeItem('ciw-workspace-snap-v1');

// Reload page
location.reload();
```

---

## Success Indicators

✅ You should see all 8 log groups in order
✅ Graph should render with 3+ nodes
✅ Nodes should have labels (IP, location, org)
✅ Edges should connect nodes

---

## Next Steps After Diagnostics

Once you identify which scenario (A/B/C/D), I will:

1. Fix the root cause
2. Re-test with new logs
3. Declare Phase 10F validation complete

**Provide evidence and I'll fix it.**
