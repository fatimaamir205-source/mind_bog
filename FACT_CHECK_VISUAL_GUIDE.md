# 🎨 Fact-Check Feature - Visual Guide

## 📱 UI Location

The Fact-Check section appears in the **right sidebar** of the Create Blog page, below the AI Content Review section.

```
┌─────────────────────────────────────────────────────────────┐
│                    CREATE BLOG PAGE                          │
├──────────────────────────────┬──────────────────────────────┤
│  EDITOR (Left)               │  SIDEBAR (Right)             │
│                              │                              │
│  [Cover Image]               │  [Publishing Options]        │
│  [Title Input]               │  [Writing Tips]              │
│  [Excerpt Input]             │  [Stats]                     │
│  [Content Editor]            │                              │
│  [Tags Input]                │  ┌────────────────────────┐ │
│                              │  │ ✨ AI Content Review   │ │
│                              │  │ (Purple Section)       │ │
│                              │  └────────────────────────┘ │
│                              │                              │
│                              │  ┌────────────────────────┐ │
│                              │  │ 🛡️ Fact-Check         │ │
│                              │  │ (Green/Red Section)    │ │
│                              │  │ ← NEW FEATURE          │ │
│                              │  └────────────────────────┘ │
└──────────────────────────────┴──────────────────────────────┘
```

## 🎨 Visual States

### State 1: Initial (Before Checking)
```
╔═══════════════════════════════════════════════════════╗
║  🛡️ Fact-Check                           [Check]     ║
║                                                        ║
║  Click "Check" to verify content credibility and      ║
║  detect fake news                                     ║
╚═══════════════════════════════════════════════════════╝
```
- Color: Green gradient
- Icon: ShieldCheck (green)
- Button: Enabled if title and content exist

### State 2: Checking (Loading)
```
╔═══════════════════════════════════════════════════════╗
║  🛡️ Fact-Check                        [Checking...]  ║
║                                                        ║
║  🔄 Analyzing content for credibility...              ║
╚═══════════════════════════════════════════════════════╝
```
- Button: Disabled with "Checking..." text
- Shows loading indicator

### State 3: High Credibility (80-100) ✅
```
╔═══════════════════════════════════════════════════════╗
║  🛡️ Fact-Check                           [Check]     ║
║                                                        ║
║  Credibility Score                          85/100    ║
║  [████████████████████░░░░░░░░░░░░░░░░░░░]           ║
║                                                        ║
║  Analysis                                              ║
║  ✓ Content appears credible with no major concerns    ║
║                                                        ║
║  ┌──────────────┐  ┌──────────────┐                  ║
║  │ Red Flags    │  │ Warnings     │                  ║
║  │      0       │  │      0       │                  ║
║  └──────────────┘  └──────────────┘                  ║
╚═══════════════════════════════════════════════════════╝
```
- Color: Green gradient
- Progress bar: Green (85% filled)
- Icon: ShieldCheck (green)
- Status: ✅ Can publish

### State 4: Medium Credibility (60-79) ⚠️
```
╔═══════════════════════════════════════════════════════╗
║  🛡️ Fact-Check                           [Check]     ║
║                                                        ║
║  Credibility Score                          65/100    ║
║  [█████████████░░░░░░░░░░░░░░░░░░░░░░░░░░]           ║
║                                                        ║
║  Analysis                                              ║
║  ⚠️ MEDIUM RISK: Content contains suspicious elements ║
║                                                        ║
║  WARNINGS:                                             ║
║  • No sources or references cited                     ║
║  • Multiple absolute claims without evidence          ║
║                                                        ║
║  ┌──────────────┐  ┌──────────────┐                  ║
║  │ Red Flags    │  │ Warnings     │                  ║
║  │      0       │  │      2       │                  ║
║  └──────────────┘  └──────────────┘                  ║
╚═══════════════════════════════════════════════════════╝
```
- Color: Yellow gradient
- Progress bar: Yellow (65% filled)
- Icon: ShieldCheck (yellow)
- Status: ⚠️ Can publish with warning

### State 5: Fake News Detected (<40) ❌
```
╔═══════════════════════════════════════════════════════╗
║  🛡️ Fact-Check                           [Check]     ║
║                                                        ║
║  Credibility Score                          25/100    ║
║  [█████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░]           ║
║                                                        ║
║  ┌─────────────────────────────────────────────────┐ ║
║  │ ⚠️ FAKE NEWS DETECTED - CANNOT PUBLISH          │ ║
║  └─────────────────────────────────────────────────┘ ║
║                                                        ║
║  Analysis                                              ║
║  RED FLAGS:                                            ║
║  • Suspicious keywords detected: miracle cure,        ║
║    doctors hate, one weird trick                      ║
║  • Sensational language detected (3 instances)        ║
║  • Excessive exclamation marks (8 found)              ║
║                                                        ║
║  WARNINGS:                                             ║
║  • No sources or references cited                     ║
║  • Multiple absolute claims without evidence          ║
║                                                        ║
║  ┌──────────────┐  ┌──────────────┐                  ║
║  │ Red Flags    │  │ Warnings     │                  ║
║  │      3       │  │      2       │                  ║
║  └──────────────┘  └──────────────┘                  ║
╚═══════════════════════════════════════════════════════╝
```
- Color: Red gradient
- Progress bar: Red (25% filled)
- Icon: ShieldAlert (red)
- Banner: "⚠️ FAKE NEWS DETECTED - CANNOT PUBLISH"
- Status: ❌ BLOCKED from publishing

## 🎬 User Interaction Flow

### Scenario 1: Publishing Credible Content ✅

```
Step 1: Write Content
┌─────────────────────────┐
│ Title: "Web Dev Guide"  │
│ Content: "According to  │
│ industry standards..."  │
└─────────────────────────┘
           ↓
Step 2: Click "Check"
┌─────────────────────────┐
│ [Checking...]           │
└─────────────────────────┘
           ↓
Step 3: View Results
┌─────────────────────────┐
│ Score: 85/100           │
│ ✓ Content credible      │
└─────────────────────────┘
           ↓
Step 4: Publish
┌─────────────────────────┐
│ [Publish] ← Enabled ✅  │
│ Success! Published      │
└─────────────────────────┘
```

### Scenario 2: Blocked Fake News ❌

```
Step 1: Write Suspicious Content
┌─────────────────────────┐
│ Title: "SHOCKING!!!"    │
│ Content: "Miracle cure  │
│ doctors hate!!!"        │
└─────────────────────────┘
           ↓
Step 2: Click "Check"
┌─────────────────────────┐
│ [Checking...]           │
└─────────────────────────┘
           ↓
Step 3: View Results
┌─────────────────────────┐
│ Score: 25/100           │
│ ❌ FAKE NEWS DETECTED   │
│ Red Flags: 3            │
└─────────────────────────┘
           ↓
Step 4: Try to Publish
┌─────────────────────────┐
│ [Publish] ← Clicked     │
│ ❌ Error: Cannot publish│
│ Content flagged as fake │
└─────────────────────────┘
           ↓
Step 5: Edit Content
┌─────────────────────────┐
│ Remove sensational text │
│ Add credible sources    │
└─────────────────────────┘
           ↓
Step 6: Re-check
┌─────────────────────────┐
│ Score: 75/100           │
│ ✓ Content improved      │
└─────────────────────────┘
           ↓
Step 7: Publish Successfully
┌─────────────────────────┐
│ [Publish] ← Enabled ✅  │
│ Success! Published      │
└─────────────────────────┘
```

## 🎨 Color Coding System

### Green (High Credibility)
```
Background: from-green-50 to-emerald-50
Border: border-green-200
Text: text-green-900
Icon: ShieldCheck (green)
Progress Bar: bg-green-600
```

### Yellow (Medium Credibility)
```
Background: from-yellow-50 to-orange-50
Border: border-yellow-300
Text: text-yellow-900
Icon: ShieldCheck (yellow)
Progress Bar: bg-yellow-600
```

### Red (Fake News)
```
Background: from-red-50 to-orange-50
Border: border-red-300
Text: text-red-900
Icon: ShieldAlert (red)
Progress Bar: bg-red-600
```

## 📊 Progress Bar Examples

### 85/100 (High)
```
[████████████████████░░░░░░░░░░░░░░░░░░░░] 85%
```

### 65/100 (Medium)
```
[█████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░] 65%
```

### 25/100 (Fake News)
```
[█████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 25%
```

## 🔔 Toast Notifications

### Success (High Credibility)
```
┌────────────────────────────────┐
│ ✓ Content appears credible     │
└────────────────────────────────┘
```

### Warning (Medium Credibility)
```
┌────────────────────────────────┐
│ ⚠️ Content has credibility     │
│    concerns                    │
└────────────────────────────────┘
```

### Error (Fake News)
```
┌────────────────────────────────┐
│ ⚠️ Content flagged as potential│
│    fake news!                  │
└────────────────────────────────┘
```

### Blocked Publication
```
┌────────────────────────────────┐
│ ❌ Cannot publish: Content     │
│    flagged as fake news.       │
│    Please review and edit.     │
└────────────────────────────────┘
```

## 🎯 Button States

### Enabled (Ready to Check)
```
┌──────────┐
│ [Check]  │ ← Green border, clickable
└──────────┘
```

### Disabled (No Content)
```
┌──────────┐
│ [Check]  │ ← Gray, not clickable
└──────────┘
```

### Loading (Checking)
```
┌──────────────┐
│ [Checking...]│ ← Disabled with spinner
└──────────────┘
```

## 📱 Responsive Design

### Desktop (lg+)
- Sidebar on right (1/3 width)
- Full feature visibility
- Side-by-side layout

### Tablet (md)
- Sidebar below editor
- Full width sections
- Stacked layout

### Mobile (sm)
- Single column
- Compact cards
- Touch-friendly buttons

## 🎨 Dark Mode Support

All colors automatically adapt:
- Light backgrounds → Dark backgrounds
- Dark text → Light text
- Maintains contrast ratios
- Preserves color meanings (red=danger, green=safe)

## 🔍 Accessibility

- ✅ ARIA labels on all interactive elements
- ✅ Keyboard navigation support
- ✅ Screen reader friendly
- ✅ Color contrast meets WCAG AA
- ✅ Focus indicators visible
- ✅ Semantic HTML structure

## 📐 Spacing & Layout

```
Fact-Check Card:
├─ Padding: 16px (p-4)
├─ Border Radius: 8px (rounded-lg)
├─ Border Width: 1px
└─ Gap between elements: 16px (space-y-4)

Score Card:
├─ Padding: 12px (p-3)
├─ Border Radius: 8px (rounded-lg)
└─ Background: white/50 opacity

Stats Grid:
├─ Columns: 2
├─ Gap: 8px (gap-2)
└─ Equal width columns
```

## 🎭 Animation States

### Fade In (Results appear)
```
opacity: 0 → 1
duration: 300ms
```

### Progress Bar Fill
```
width: 0% → credibility_score%
duration: 500ms
easing: ease-out
```

### Color Transition
```
background: green → yellow → red
duration: 300ms
based on score
```

---

**The fact-check feature provides clear, visual feedback to help users create credible content! 🛡️✨**
