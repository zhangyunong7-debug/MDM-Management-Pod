# Scholar Entity Detail — 页面结构 & 字段释义

> 基于 `EntityDrawer.tsx` 实际渲染代码绘制

---

## 页面整体布局

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ TopBar (fixed, h-16, z-40)                                                   │
│  [G ARC logo]  [🔍 Search scholars, institutions, or IDs...]  [🌐EN] [🔔3] [👤admin] │
├────────┬─────────────────────────────────────────────────────────────────────┤
│ Sidebar│  Main Content (Entity Search page)                                  │
│ (w-64) │  [Entity Search]                    [+ New Entity]                  │
│        │  [Landmark] Institution  ◉ Scholar  [GraduationCap]               │
│        │  [🔍 Search by name...]  [Filters]  [☰ List] [⊞ Grid]            │
│        │  ┌── Table ──────────────────────────────────────────────────┐   │
│        │  │ ☐ │ Code      │ Name    │ ...                              │   │
│        │  │ ☐ │ SCH-2024-001 │ Dr. Elena Vance │ ...   [👁]          │   │
│        │  └───────────────────────────────────────────────────────────┘   │
│  📊    │                                                                   │
│  🔍    │  ← 点击行 → EntityDrawer 从右侧滑入                                │
│  ➕    │                                                                   │
│  ⚠️    │                                                                   │
│  ✅    │                                                                   │
│  🏷    │                                                                   │
│  📜    │                                                                   │
│  ⚙️    │                                                                   │
│        │                                                                   │
├────────┴─────────────────────────────────────────────────────────────────────┤
│                                                                              │
│         ╔══════════════════════════════════════════════════════╗             │
│         ║          EntityDrawer (right slide-in, max-w-2xl)   ║             │
│         ║          fixed right-0, z-50, bg-white              ║             │
│         ╚══════════════════════════════════════════════════════╝             │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## EntityDrawer 详细结构

```
╔══════════════════════════════════════════════════════════════════════════╗
║  Backdrop (fixed inset-0, bg-black/40, z-40)                            ║
║  点击空白区域 → 关闭 drawer                                              ║
╠══════════════════════════════════════════════════════════════════════════╣
║                                                                          ║
║  ┌─ Header (px-6 py-4, border-b, bg-muted/20) ──────────────────────┐   ║
║  │                                                                   │   ║
║  │  ┌────┐                                                           │   ║
║  │  │ 🎓 │  Dr. Elena Vance                         [Edit] [✕]     │   ║
║  │  │    │  SCH-2024-001                        ← w-10 h-10        │   ║
║  │  └────┘  [Active]                             bg-blue-500        │   ║
║  │                                                      rounded-full  │   ║
║  └───────────────────────────────────────────────────────────────────┘   ║
║                                                                          ║
║  ┌─ Content (ScrollArea, flex-1, p-6) ─────────────────────────────┐   ║
║  │                                                                    │   ║
║  │  ┌─ Basic Info ────────────────────────────────────────────────┐ │   ║
║  │  │ [Header bar: title + border-b, bg-muted/30]                 │ │   ║
║  │  │                                                              │ │   ║
║  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐                     │ │   ║
║  │  │  │ Last Name │ │First Name│ │Native Name│                     │ │   ║
║  │  │  │  Vance    │ │  Elena   │ │    —     │                     │ │   ║
║  │  │  │(xs gray) │ │(xs gray) │ │(xs gray)  │                     │ │   ║
║  │  │  └──────────┘ └──────────┘ └──────────┘                     │ │   ║
║  │  │                                                              │ │   ║
║  │  │  ┌────────────────┐ ┌──────────┐ ┌──────────┐             │ │   ║
║  │  │  │ ORCID (link)   │ │  Title   │ │ Category │             │ │   ║
║  │  │  │🔗 ExternalLink │ │Dist.Prof │ │Full Prof │             │ │   ║
║  │  │  └────────────────┘ └──────────┘ └──────────┘             │ │   ║
║  │  │                                                              │ │   ║
║  │  │  Homepage (xs gray label)                                    │ │   ║
║  │  │   🔗 https://physics.harvard.edu/~vance                     │ │   ║
║  │  │   🔗 https://elenavance.com                                  │ │   ║
║  │  │                                                              │ │   ║
║  │  │  SciProfile URL                                              │ │   ║
║  │  │   📖 https://sciprofile.org/evance                           │ │   ║
║  │  └──────────────────────────────────────────────────────────────┘ │   ║
║  │                                                                    │   ║
║  │  ┌─ Contacts (2 emails) [+Add] ───────────────────────────────┐ │   ║
║  │  │ [Header bar: title + action button]                          │ │   ║
║  │  │                                                              │ │   ║
║  │  │  ● evance@harvard.edu                           [Primary]   │ │   ║
║  │  │  ○ elena.vance@gmail.com                                     │ │   ║
║  │  │                                                              │ │   ║
║  │  └──────────────────────────────────────────────────────────────┘ │   ║
║  │                                                                    │   ║
║  │  ┌─ Affiliations (2 institutions) ────────────────────────────┐ │   ║
║  │  │ [Header bar]                                               │ │   ║
║  │  │                                                             │ │   ║
║  │  │  ● Harvard University                           [Primary]  │ │   ║
║  │  │    GIC-0002-HARV  (font-mono, clickable → 跳转机构搜索)     │ │   ║
║  │  │    Cambridge / United States (xs, muted)                    │ │   ║
║  │  │                                                             │ │   ║
║  │  │  ○ CERN                                               [Primary]│ │   ║
║  │  │    GIC-0099-CERN                                           │ │   ║
║  │  │    Geneva / Switzerland (xs, muted)                         │ │   ║
║  │  │                                                             │ │   ║
║  │  └─────────────────────────────────────────────────────────────┘ │   ║
║  │                                                                    │   ║
║  │  ┌─ H-Index ──────────────────────────────────────────────────┐ │   ║
║  │  │ [Header bar]                                               │ │   ║
║  │  │                                                             │ │   ║
║  │  │   SciProfile (xs gray)     Google Scholar (xs gray)         │ │   ║
║  │  │      67 ═══════════         72 ═══════════                  │ │   ║
║  │  │   (text-2xl font-bold)     (text-2xl font-bold)             │ │   ║
║  │  │   · updated 2026-05-01    · updated 2026-04-28             │ │   ║
║  │  │   (xs muted, if exists)    (xs muted, if exists)            │ │   ║
║  │  │                                                             │ │   ║
║  │  └─────────────────────────────────────────────────────────────┘ │   ║
║  │                                                                    │   ║
║  │  ┌─ Research ────────────────────────────────────────────────┐  │   ║
║  │  │ [Header bar]                                              │  │   ║
║  │  │                                                           │  │   ║
║  │  │  [Physics] [Quantum Computing]  (Badge, gap-1.5, wrap)   │  │   ║
║  │  │   悬浮 → Tooltip: "Quantum mechanics, particle physics..."│  │   ║
║  │  │                                                           │  │   ║
║  │  └───────────────────────────────────────────────────────────┘  │   ║
║  │                                                                    │   ║
║  │  ┌─ Tags ────────────────────────────────────────────────────┐  │   ║
║  │  │ [Header bar]                                              │  │   ║
║  │  │                                                           │  │   ║
║  │  │  🛡 Nobel Laureate    🛡 National Academician              │  │   ║
║  │  │  (dimension icon + classDisplayName, colored badge)        │  │   ║
║  │  │                                                           │  │   ║
║  │  └───────────────────────────────────────────────────────────┘  │   ║
║  │                                                                    │   ║
║  │  ┌─ VIP Profile [Data Studio →] ────────────────────────────┐  │   ║
║  │  │ [Header bar: title + Data Studio action link]             │  │   ║
║  │  │                                                           │  │   ║
║  │  │  Awards (xs gray label):                                  │  │   ║
║  │  │   🏆 Nobel Prize in Physics (2025)                        │  │   ║
║  │  │   🏆 Breakthrough Prize in Fundamental Physics (2023)     │  │   ║
║  │  │   🏆 Wolf Prize in Physics (2021)                         │  │   ║
║  │  │                                                           │  │   ║
║  │  └───────────────────────────────────────────────────────────┘  │   ║
║  │                                                                    │   ║
║  │  Metadata (no card, just text-xs text-muted-foreground):           │   ║
║  │    Created: 1/10/2024            Updated: 3/15/2024              │   ║
║  │    By: admin                                                     │   ║
║  │                                                                    │   ║
║  └────────────────────────────────────────────────────────────────────┘   ║
║                                                                          ║
║  ┌─ Footer (px-6 py-4, border-t, bg-muted/20) ─────────────────────┐   ║
║  │  [🕐 View History]  [📁 Add to Governance Pool]                   │   ║
║  │  (各占 flex-1, variant="outline")                                 │   ║
║  └──────────────────────────────────────────────────────────────────┘   ║
║                                                                          ║
╚══════════════════════════════════════════════════════════════════════════╝
```

---

## DetailSection 组件模板（实际代码）

```
DetailSection (rounded-lg border, space-y-4)
├── Section Header (flex items-center justify-between, px-4 py-2.5)
│   ├── h3: "Basic Info" (text-sm font-semibold)
│   └── action?: Button (如 +Add, Data Studio 链接)
├── Section Body (px-4 py-3)
│   └── children (grid / list / badges)
└── ─ border-b between header and body
```

---

## Scholar 字段对照表

### 1. Basic Info

| 页面位置 | 字段名 | 类型 | 说明 |
|---------|--------|------|------|
| Header | `name` | string | 显示名称，如 "Dr. Elena Vance" |
| Header | `id` | string | 实体编码，font-mono，如 `SCH-2024-001` |
| Header | `status` | WorkflowStatus | 显示为 "Active" 或 "Pending Review" |
| 3-col grid | `lastName` | string | 姓 |
| 3-col grid | `firstName` | string | 名 |
| 3-col grid | `nativeName` | string | 本地姓名，空则显示 "—" |
| 3-col grid | `orcid` | string | 外链 orcid.org，带 ExternalLink 图标 |
| 3-col grid | `title` | string | 学术头衔 |
| 3-col grid | `category` | string | 分类标签 |
| Body | `personHomepages[]` | `{label?, url}` | Globe 图标 + 链接 |
| Body | `sciProfileUrl` | string | BookOpen 图标 + 链接 |

### 2. Contacts

| 页面位置 | 字段名 | 类型 | 说明 |
|---------|--------|------|------|
| Section title | `emails.length` | number | 动态计数 "N emails" |
| Section header | — | Button | `+Add` 按钮 (ghost, sm) |
| List | `emails[].email` | string | mailto 链接 |
| List | `emails[].isPrimary` | boolean | Primary badge (border-primary/30) |
| Dot | — | span | Primary=bg-primary, 其他=bg-muted-foreground/30 |

> 注：若无 `emails` 数组，fallback 到 `email` 字段作为唯一主邮箱

### 3. Affiliations

| 页面位置 | 字段名 | 类型 | 说明 |
|---------|--------|------|------|
| Section title | `affiliations.length` | number | 动态计数 "N institutions" |
| Row | `institutionName` | string | font-medium |
| Row | `isPrimary` | boolean | Primary badge |
| Row | `globalInstCode` | string | font-mono, text-primary, clickable → 跳转机构搜索页 |
| Row | `city / country` | string | text-xs, text-muted-foreground |
| Dot | — | span | w-1.5 h-1.5 rounded-full bg-purple-500 |

> 点击机构名 → `setEntityDrawerOpen(false)` → `setCurrentPage('search')` → 自动填充搜索

### 4. H-Index

| 页面位置 | 字段名 | 类型 | 说明 |
|---------|--------|------|------|
| SciProfile 列 | `hIndex` | number | text-2xl font-bold, 有 sciProfileUrl 则外链 |
| SciProfile 列 | `hIndexUpdated` | string | "· updated YYYY-MM-DD" (xs muted) |
| Google Scholar 列 | `hIndexGoogle` | number | text-2xl font-bold, 有 googleScholarId 则外链 |
| Google Scholar 列 | `hIndexGoogleUpdated` | string | "· updated YYYY-MM-DD" (xs muted) |
| Condition | `hIndex != null \|\| hIndexGoogle != null` | — | 无数据则不渲染整个 Section |

外链地址：
- SciProfile: `scholar.sciProfileUrl`
- Google Scholar: `https://scholar.google.com/citations?user=${googleScholarId}`

### 5. Research

| 页面位置 | 字段名 | 类型 | 说明 |
|---------|--------|------|------|
| Badge | `researchAreas[i]` | string | Badge variant="secondary", text-xs |
| Tooltip | `researchAreaDetails[area]` | string | 悬浮显示描述 (max-w-xs) |
| Condition | `researchAreas.length > 0` | — | 无数据不渲染 |

### 6. Tags

| 页面位置 | 字段名 | 类型 | 说明 |
|---------|--------|------|------|
| Badge | `tags[i]` → `ClassificationDef` | number → obj | 通过 tagId 查找 classDef |
| Badge icon | `dimension` | 'RISK' \| 'Business Classification' | RISK=🛡 Shield, Business=💼 Briefcase |
| Badge color | `subDimension` | enum | 每个 subDimension 有独立配色 (见下方) |

**Tag 配色映射（subDimensionConfig）：**

| Sub-Dimension | Dimension | 配色 |
|--------------|-----------|------|
| COMPLIANCE | RISK | red-700 / red-200 / red-50 |
| INTEGRITY | RISK | orange-700 / orange-200 / orange-50 |
| SECURITY | RISK | amber-700 / amber-200 / amber-50 |
| REPUTATION | RISK | yellow-700 / yellow-200 / yellow-50 |
| QUALITY | Business | blue-700 / blue-200 / blue-50 |
| VALUE | Business | green-700 / green-200 / green-50 |
| PREFERENCE | Business | teal-700 / teal-200 / teal-50 |
| RANKING | Business | indigo-700 / indigo-200 / indigo-50 |
| STRATEGIC | Business | violet-700 / violet-200 / violet-50 |
| TYPE | Business | purple-700 / purple-200 / purple-50 |
| OPTOUT | Business | gray-700 / gray-200 / gray-50 |

### 7. VIP Profile

| 页面位置 | 字段名 | 类型 | 说明 |
|---------|--------|------|------|
| Condition | `isVip === true` | boolean | 仅 VIP 学者渲染 |
| Section action | — | `<a>` | "Data Studio" → `https://staging.automation.mdpi.io/#/data-studio` |
| Award row | `awards[i].award_name` | string | Award 图标 (amber-500, h-4) + font-medium 链接 |
| Award row | `awards[i].award_year` | number | text-muted-foreground, 括号包裹 |
| Award row | `awards[i].award_page_url` | string | 点击跳转外链 |

### 8. Metadata

| 字段 | 类型 | 说明 |
|------|------|------|
| `createdAt` | string | `toLocaleDateString()` |
| `updatedAt` | string | `toLocaleDateString()` |
| `createdBy` | string | 纯文本 |

> 注：Metadata 不包裹在 DetailSection 中，直接 `pt-2 text-xs text-muted-foreground`

---

## 条件渲染汇总

```
Section                     Condition
─────────────────────────── ──────────────────────────────────
Basic Info                  Always render (所有字段内部也有条件)
Contacts                    Always render
Affiliations                scholar.affiliations?.length > 0
H-Index                     scholar.hIndex != null || scholar.hIndexGoogle != null
Research                    scholar.researchAreas.length > 0
Tags                        scholar.tags.length > 0
VIP Profile                 scholar.isVip === true
Metadata                    Always render (plain text, no card)
```

---

## Footer 操作

| 按钮 | 图标 | 行为 |
|------|------|------|
| View History | History | `setEntityDrawerOpen(false)` → `setCurrentPage('logs')` |
| Add to Pool | FolderPlus | `setEntityDrawerOpen(false)` → `setCurrentPage('corrections')` |

---

## 样式速查

| 元素 | Tailwind class |
|------|---------------|
| Drawer 面板 | `fixed top-0 right-0 bottom-0 w-full max-w-2xl bg-white shadow-2xl z-50` |
| 滑入动画 | `transition-transform duration-300 ease-drawer` + `translate-x-0` / `translate-x-full` |
| Section 卡片 | `rounded-lg border border-border` |
| Section Header | `px-4 py-2.5 bg-muted/30 border-b border-border` |
| Section Body | `px-4 py-3` |
| Label | `text-xs text-muted-foreground` |
| Value | `text-sm font-medium` |
| Grid | `grid grid-cols-3 gap-3` |
| Scholar Icon | `w-10 h-10 rounded-full bg-blue-500 text-white` |
| Institution Icon | `w-10 h-10 rounded-full bg-purple-500 text-white` |

---

*文档生成日期: 2026-07-02*
*基于: `EntityDrawer.tsx` (ScholarDetails / InstitutionDetails 组件)*
