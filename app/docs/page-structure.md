# 前端页面结构参考

> 三个核心页面的 ASCII 结构图，供前端开发参考。

---

## 1. Entity Search — Scholar Table

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Page Header                                                            │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  Entity Search                              [+ New Entity]       │  │
│  │  Search and manage scholars and institutions                      │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  Entity Type Switch                                                      │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  [Landmark] Institution   ◉ Scholar  [GraduationCap]            │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  Search & Filters                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  ┌─────────────────────────┐  [Filters]  [☰ List] [⊞ Grid]     │  │
│  │  │ 🔍 Search by name...    │                                   │  │
│  │  └─────────────────────────┘                                   │  │
│  │                                                                  │  │
│  │  Active: [Quantum Computing ×] [China ×]        [Clear all]    │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  Results: Showing 5 results                                             │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ ☐ │ Code      │ Name    │ Native │ Email          │ Inst │ ... │  │
│  │ ☐ │ GSC-0001  │ Vance   │ —      │ e@harvard.edu  │ MIT  │ ... │  │
│  │ ☐ │ GSC-0002  │ Zhang   │ 张伟   │ z@cas.cn       │ CAS  │ ... │  │
│  │ ☐ │ GSC-0003  │ Schen   │ —      │ s@stanford.edu │ Stan │ ... │  │
│  │ ☐ │ GSC-0004  │ Wilson  │ —      │ j@ox.ac.uk     │ Oxf  │ ... │  │
│  │ ☐ │ GSC-0005  │ Li      │ 李明   │ l@tsinghua.cn  │ THU  │ ... │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  Columns: ☐ | Code | Name | Native Name | Email | Institution | Tags  │
│           | Status | Actions                                           │
└──────────────────────────────────────────────────────────────────────────┘

Legend:
  ☐  = Checkbox (multi-select)
  ◉  = Toggle switch (Scholar/Institution)
  [x] = Button
```

---

## 2. Entity Detail — Scholar Drawer

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Backdrop (点击关闭)                                                      │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─ Header ──────────────────────────────────────────────────────────┐  │
│  │                                                                   │  │
│  │  ┌────┐                                          [Edit] [✕]        │  │
│  │  │ 🎓 │  Dr. Elena Vance                                          │  │
│  │  │    │  SCH-2024-001                                             │  │
│  │  └────┘  [Active]                                                 │  │
│  │                                                                   │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌─ Basic Info ─────────────────────────────────────────────────────┐  │
│  │  Last Name     │ First Name    │ Native Name                       │  │
│  │  Vance         │ Elena         │ —                                  │  │
│  │                                                                  │  │
│  │  ORCID              │ Title       │ Category                        │  │
│  │  0000-0001-...      │ Prof.       │ —                                │  │
│  │                                                                  │  │
│  │  Homepage                                                         │  │
│  │  🔗 https://physics.harvard.edu/~vance                            │  │
│  │  🔗 https://elenavance.com                                         │  │
│  │                                                                  │  │
│  │  SciProfile URL                                                   │  │
│  │  📖 https://sciprofile.org/evance                                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌─ Contacts (2 emails) ────────────────────────────────────────────┐  │
│  │                                                                  │  │
│  │  ● elena.vance@harvard.edu                          [Primary]   │  │
│  │  ○ evance@physics.org                                        │  │
│  │                                                                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌─ Affiliations (2 institutions) ──────────────────────────────────┐  │
│  │                                                                  │  │
│  │  ● Harvard University                               Primary     │  │
│  │    Cambridge, MA / USA                                            │  │
│  │    GIC-0001-HARV ← (点击跳转机构搜索)                               │  │
│  │                                                                  │  │
│  │  ○ Massachusetts Institute of Technology                         │  │
│  │    Cambridge, MA / USA                                            │  │
│  │                                                                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌─ H-Index ───────────────────────────────────────────────────────┐  │
│  │                                                                  │  │
│  │    SciProfile           Google Scholar                           │  │
│  │      67                      72                                  │  │
│  │    (linkable)             (linkable)                             │  │
│  │                                                                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌─ Research ──────────────────────────────────────────────────────┐  │
│  │                                                                  │  │
│  │  [Physics] [Quantum Computing]                                   │  │
│  │  (悬浮 Badge 显示研究领域描述)                                    │  │
│  │                                                                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌─ Tags ──────────────────────────────────────────────────────────┐  │
│  │                                                                  │  │
│  │  [🛡 Compliance] [💼 Quality] [🛡 Integrity]                    │  │
│  │                                                                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌─ VIP Profile ──────────────────────────────────────────────────┐  │
│  │                                                                  │  │
│  │  Awards:                                                         │  │
│  │   🏆 Nobel Prize in Physics (2025)                               │  │
│  │   🏆 Breakthrough Prize in Fundamental Physics (2023)            │  │
│  │                                                                  │  │
│  │  [Data Studio →]                                                 │  │
│  │                                                                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌─ Metadata ──────────────────────────────────────────────────────┐  │
│  │                                                                  │  │
│  │  Created: 2024-01-10          Updated: 2024-03-15               │  │
│  │  By: admin                                                       │  │
│  │                                                                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│  Footer                                                                  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  [View History]                        [Add to Governance Pool]  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Create New Entity — Scholar Form

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Page Header                                                            │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  Create New Entity                                              │  │
│  │  Add a new scholar or institution to the system                  │  │
│  │                                                                  │  │
│  │  Auto-saved: 14:30  [Save Draft] [Cancel] [Submit for Approval] │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌─ Entity Type Selector ──────────────────────────────────────────┐   │
│  │                                                                  │   │
│  │   ┌────────────┐              ┌────────────┐                    │   │
│  │   │   🎓       │              │   🏛       │                    │   │
│  │   │  Scholar   │   SELECTED   │Institution │   NOT SELECTED     │   │
│  │   │ Individual │  border-blue  │University  │  border-gray       │   │
│  │   │ researcher │  bg-blue/5    │or research │                    │   │
│  │   └────────────┘              └────────────┘                    │   │
│  │                                                                  │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─ Scholar Form ─────────────────────────────────────────────────┐    │
│  │                                                                  │    │
│  │  ═══ Basic Information ═══                                      │    │
│  │                                                                  │    │
│  │  Full Name *            Official Email *                         │    │
│  │  ┌─────────────────┐    ┌─────────────────────┐                 │    │
│  │  │ Dr. Elena Vance │    │ evance@harvard.edu  │                 │    │
│  │  └─────────────────┘    └─────────────────────┘                 │    │
│  │                                                                  │    │
│  │  ORCID iD               Nationality                             │    │
│  │  ┌─────────────────┐    ┌─────────────────────┐                 │    │
│  │  │ 0000-0001-...   │    │ United States        │                 │    │
│  │  └─────────────────┘    └─────────────────────┘                 │    │
│  │                                                                  │    │
│  │  Current Affiliation                                             │    │
│  │  ┌─────────────────────────────────────────────────────────┐    │    │
│  │  │ 🔍 Harvard University                                   │    │    │
│  │  └─────────────────────────────────────────────────────────┘    │    │
│  │                                                                  │    │
│  │  ═══ Academic Profile ═══                                        │    │
│  │                                                                  │    │
│  │  Primary Research Area *    Highest Degree                       │    │
│  │  ┌────────────────────┐    ┌───────────────────┐                │    │
│  │  │ Quantum Computing  │    │ PhD                │                │    │
│  │  └────────────────────┘    └───────────────────┘                │    │
│  │                                                                  │    │
│  │  Year of PhD Completion                                          │    │
│  │  ┌─────────────────────────────────────────────────────────┐    │    │
│  │  │ 2005                                                     │    │    │
│  │  └─────────────────────────────────────────────────────────┘    │    │
│  │                                                                  │    │
│  │  ═══ Assign Tags ═══                                             │    │
│  │                                                                  │    │
│  │  Assign classification tags to this scholar...                   │    │
│  │                                                                  │    │
│  │  ┌─ Risk Tags ──────────────────────────────────────────────┐  │    │
│  │  │ 🛡 COMPLIANCE  │ 🔒 INTEGRITY  │ 🔒 SECURITY             │  │    │
│  │  │ [✓] Quality   │ [ ] Value     │ [ ] Preference            │  │    │
│  │  └──────────────────────────────────────────────────────────┘  │    │
│  │                                                                  │    │
│  │  ┌─ Business Tags ──────────────────────────────────────────┐  │    │
│  │  │ [✓] Quality   │ [ ] Value     │ [ ] Preference            │  │    │
│  │  └──────────────────────────────────────────────────────────┘  │    │
│  │                                                                  │    │
│  │  [Assign Tags] 按钮 → 打开标签选择 Dialog                          │    │
│  │                                                                  │    │
│  │  ═══ Biography ═══                                               │    │
│  │                                                                  │    │
│  │  ┌─────────────────────────────────────────────────────────┐   │    │
│  │  │ Leading researcher in quantum error correction...         │   │    │
│  │  │                                                         │   │    │
│  │  │                                                         │   │    │
│  │  └─────────────────────────────────────────────────────────┘   │    │
│  │                                        0/500                    │    │
│  │                                                                  │    │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─ Bulk Tag Import (Optional) ──────────────────────────────────┐    │
│  │                                                                  │    │
│  │         Drag and drop your Excel file here                       │    │
│  │              or click to browse files                            │    │
│  │         [Download Template]                                      │    │
│  │                                                                  │    │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 组件说明

### Scholar Table 组件结构

```
ScholarTableView
├── Table (rounded border overflow-hidden)
│   ├── TableHeader (bg-muted/50)
│   │   ├── Checkbox (全选, indeterminate 状态)
│   │   ├── Entity Code (mono font)
│   │   ├── Name (bold)
│   │   ├── Native Name
│   │   ├── Primary Email (link)
│   │   ├── Institution
│   │   ├── Tags (TagBadge[], max 2 + +N)
│   │   ├── Status (Active / PENDING_REVIEW)
│   │   └── Actions (DropdownMenu)
│   └── TableBody (divide-y, zebra stripe)
│       └── TableRow × N (hover highlight, selected bg)
│           ├── Checkbox
│           ├── Entity Code
│           ├── Name
│           ├── Native Name / "—"
│           ├── Email (mailto link)
│           ├── Affiliation
│           ├── TagBadge[] + "+N"
│           ├── StatusBadge
│           └── Actions (View Details / Edit / Add to Pool)
└── CardView (备选视图, grid layout)
    └── EntityCard × N
        ├── Icon (GraduationCap / Landmark)
        ├── Name + Code
        ├── Checkbox
        ├── EntityTypeBadge
        ├── TagBadge[]
        ├── Updated time
        └── Action Buttons (View / Edit)
```

### Entity Detail Drawer 组件结构

```
EntityDrawer (fixed right panel, max-w-2xl)
├── Backdrop (fixed inset-0, bg-black/40)
├── Sliding Panel (translate-x transition)
│   ├── Header (flex, border-b)
│   │   ├── Icon (w-10 h-10 rounded-full)
│   │   │   ├── scholar: bg-blue-500 + GraduationCap
│   │   │   └── institution: bg-purple-500 + Landmark
│   │   ├── Info (flex-1)
│   │   │   ├── Name (text-lg font-semibold, truncate)
│   │   │   ├── Code (font-mono text-xs)
│   │   │   └── StatusBadge
│   │   └── Actions
│   │       ├── Edit Button → setCurrentPage('create')
│   │       └── Close Button (X)
│   │
│   ├── ScrollArea (flex-1)
│   │   └── Content (p-6)
│   │       └── ScholarDetails / InstitutionDetails
│   │           ├── DetailSection: Basic Info
│   │           │   ├── grid-3: Last Name / First Name / Native Name
│   │           │   ├── grid-3: ORCID (link) / Title / Category
│   │           │   └── Homepage links + SciProfile URL
│   │           │
│   │           ├── DetailSection: Contacts
│   │           │   ├── Header: "Contacts (N emails)" + [+Add]
│   │           │   └── Email list (Primary badge + dot indicator)
│   │           │
│   │           ├── DetailSection: Affiliations (conditional)
│   │           │   └── AffiliationRow × N
│   │           │       ├── Dot (purple=primary, gray=other)
│   │           │       ├── Name + [Primary] badge
│   │           │       ├── globalInstCode (link → search)
│   │           │       └── city / country
│   │           │
│   │           ├── DetailSection: H-Index (conditional)
│   │           │   ├── SciProfile (link to sciProfileUrl)
│   │           │   └── Google Scholar (link to googleScholarId)
│   │           │
│   │           ├── DetailSection: Research (conditional)
│   │           │   └── Badge[] with Tooltip
│   │           │
│   │           ├── DetailSection: Tags (conditional)
│   │           │   └── TagBadge[] (RISK/Business colored)
│   │           │
│   │           └── DetailSection: VIP Profile (conditional)
│   │               ├── Awards list
│   │               └── Data Studio link
│   │
│   └── Footer (border-t, p-4)
│       ├── View History → setCurrentPage('logs')
│       └── Add to Pool → setCurrentPage('corrections')
│
└── ToastContainer
```

### Create Entity 组件结构

```
CreateEntity
├── Page Header
│   ├── Title + Description
│   ├── Auto-save indicator
│   ├── Save Draft Button
│   ├── Cancel Button → Dialog if has data
│   └── Submit for Approval Button
│
├── Entity Type Selector Card
│   └── Flex container (Scholar | Institution toggle)
│       ├── Scholar Button
│       │   ├── Icon (w-12 h-12 rounded-full)
│       │   │   └── selected: bg-primary text-white
│       │   │   └── unselected: bg-muted
│       │   ├── Label: "Scholar"
│       │   └── Description: "Individual researcher profile"
│       └── Institution Button (same structure)
│
├── ScholarForm (when entityType === 'scholar')
│   ├── Section: Basic Information
│   │   ├── FormField: Full Name (required, Input)
│   │   ├── FormField: Official Email (required, Input + Mail icon)
│   │   ├── FormField: ORCID iD (Input)
│   │   ├── FormField: Nationality (Select, countries[])
│   │   └── FormField: Current Affiliation (Select + Search icon)
│   │
│   ├── Section: Academic Profile
│   │   ├── FormField: Primary Research Area (required, Select)
│   │   ├── FormField: Highest Degree (Select)
│   │   └── FormField: Year of PhD Completion (Input number)
│   │
│   ├── Section: Assign Tags
│   │   ├── Description text
│   │   ├── Assigned tags display (by dimension)
│   │   │   ├── Risk Tags (red badges, removable)
│   │   │   └── Business Tags (blue badges, removable)
│   │   ├── [Assign Tags] button
│   │   └── AssignTagSelector Dialog
│   │       ├── Search input
│   │       ├── Scrollable tag groups (by sub-dimension)
│   │       │   ├── Group header (icon + label + dimension badge)
│   │       │   ├── Tag toggle pills (selectable)
│   │       │   └── Extension inputs (when tag selected)
│   │       │       ├── boolean → Checkbox
│   │       │       ├── enum → Select
│   │       │       ├── integer → Input number
│   │       │       └── date_period → Date range inputs
│   │       └── DialogFooter: [Cancel] [Assign N Tag(s)]
│   │
│   └── Section: Biography
│       ├── FormField: Textarea (max 500 chars)
│       └── Character counter (0/500)
│
├── Bulk Tag Import Card
│   ├── Drop zone (border-dashed, p-8)
│   ├── Upload icon
│   ├── Text: "Drag and drop your Excel file here"
│   └── [Download Template] button
│
└── Cancel Dialog (conditional)
    ├── Title: "Discard Changes?"
    ├── Description
    └── Footer: [Keep Editing] [Discard Changes]
```

---

*文档生成日期: 2026-07-02*
*对应代码版本: main branch*
