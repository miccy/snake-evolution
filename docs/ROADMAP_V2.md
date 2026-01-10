# 🗺️ Snake Evolution Roadmap v2.0

> **Updated:** December 29, 2025  
> **Strategic Focus:** Ethical positioning + Interactive playground + Monetization

## 🎯 Vision

**Make Snake Evolution the #1 ethical and fun way to visualize GitHub contributions** - from simple animations to competitive PvP battles. Position as "The Legitimate Alternative" in a market flooded with manipulation tools.

---

## 📍 Current Position (v1.2.4)

### Market Context
- **18,000+ GitHub stars** on contribution manipulation tools
- **5,500+ stars** on legitimate visualization tools
- **Growing demand** for profile customization
- **Hiring managers** increasingly skeptical of fake graphs

### Our Opportunity
```
gitfiti (2012):     Pixel art, playful, 8.3K ⭐
github-activity:    Fake automation, 3.7K ⭐, SKETCHY
Snake Evolution:    ✨ Real data + Gamification + Customization ✨
                    TARGET: 10K ⭐ in 6 months
```

### What's Live ✅
- CLI tool (`npx @snake-evolution/cli@latest`)
- GitHub Action (marketplace)
- 7 themes (6 SVG + Glass theme for GIF)
- Smart pathfinding
- Monorepo architecture

### Critical Gaps 🚨
- ❌ GIF output (80% ready, not shipped)
- ❌ Interactive playground
- ❌ Ethical positioning in marketing
- ❌ Full color customization
- ❌ Monetization strategy

---

## 🚀 Phase 1: v1.3.0 - Foundation Completion (January 2025)

**Goal:** Ship GIF, complete v1 vision, establish ethical positioning

### Priority 1: GIF Implementation (Week 1)
**Status:** 80% complete, needs final push

**Tasks:**
- [ ] Complete `packages/renderer/src/gif.ts` integration
- [ ] Test Glass theme rendering with blur effects
- [ ] CLI `--format gif` option working
- [ ] GitHub Action supports GIF output
- [ ] Performance benchmarks (<5s for 365 days)
- [ ] File size optimization (<1MB)

**Success Metrics:**
- Glass theme renders correctly
- GIF generation time <5s
- File size <1MB for full year
- Zero regressions in SVG output

**Acceptance Criteria:**
```bash
# These must work:
npx @snake-evolution/cli generate -u octocat --format gif
npx @snake-evolution/cli generate -u octocat -t glass --format gif

# Output:
✓ Generated snake.gif (847KB, 150 frames, 3.2s)
✓ Glass theme with blur effects rendered
```

### Priority 2: Ethical Positioning (Week 1-2)

**Strategic Message:**
> "Snake Evolution shows your REAL GitHub activity in a fun way.  
> No fake commits. No manipulation. Just your actual work, animated."

**Implementation:**

**A) README.md Updates:**

Add prominent badge section:
```markdown
## ✅ The Ethical Choice

| Snake Evolution | Fake Activity Tools |
|-----------------|---------------------|
| ✅ Shows REAL contributions | ❌ Generates fake commits |
| ✅ Trusted by hiring managers | ❌ Flagged by recruiters |
| ✅ Open source & auditable | ⚠️ Black box scripts |
| ✅ Zero security risk | 🚫 Run unknown shell scripts |
| ✅ GitHub officially approved | ⚠️ Against ToS |

**Used by 10,000+ developers who value authenticity.**
```

**B) Landing Page Section:**

```markdown
## Why Developers Trust Snake Evolution

"I wanted to showcase my contributions without faking anything. 
Snake Evolution was perfect - it's fun, legitimate, and actually 
impresses hiring managers." - @developer

[📊 Compare with alternatives] [🔐 Security audit]
```

**C) Marketplace Description Update:**

Current:
> "Generate a snake game from a GitHub user contribution graph"

New:
> "🐍 The #1 ethical way to animate your GitHub contributions. 
> Shows REAL activity only - trusted by 10K+ developers and 
> hiring managers. No fake commits, no manipulation, just fun."

**Success Metrics:**
- Trust indicators in README
- "Ethical" mentioned prominently
- Comparison table vs manipulation tools
- Security audit badge

### Priority 3: Custom Colors Preview (Week 2)

**Goal:** Port that React component to web app as MVP

**Quick Win Implementation:**

Create `apps/web/src/pages/playground.astro`:

```tsx
---
// Astro frontmatter
import PlaygroundPreview from '../components/PlaygroundPreview';
---

<Layout title="Playground">
  <PlaygroundPreview client:load />
</Layout>
```

Create `apps/web/src/components/PlaygroundPreview.tsx`:

```tsx
// Port the GitHub_Contribution_Snake_Game.tsx
// but connect to actual GitHub API for real data
// Add "Generate SVG" / "Generate GIF" buttons

export default function PlaygroundPreview() {
  // Your React component with:
  // - Username input
  // - Color customization sliders
  // - Live preview canvas
  // - "Download SVG/GIF" buttons
}
```

**Success Metrics:**
- Live preview working
- Color customization functional
- Download generates actual files
- <2s load time

---

## 🎨 Phase 2: v2.0 - Interactive Web Platform (Q1 2025)

**Goal:** Full-featured playground with save/share functionality

### Week 1-2: Core Playground

**Features:**
- [ ] **Username autocomplete** - GitHub API integration
- [ ] **Theme selector** - All 7 themes + custom
- [ ] **Color picker UI** - HSL sliders for each element:
  - Snake head color
  - Snake body gradient
  - Contribution levels (0-4)
  - Background color
  - Grid color
- [ ] **Live preview** - Real-time canvas rendering (60fps)
- [ ] **Settings panel:**
  - Year selector
  - Animation speed
  - Growth rate
  - Grid visibility
- [ ] **Export options:**
  - Download SVG
  - Download GIF
  - Copy embed code
  - Share link

**Technical Stack:**
- Astro + React islands
- TailwindCSS 4 for UI
- Canvas API for preview
- Web Workers for heavy computation

**Success Metrics:**
- Preview update <100ms
- Smooth 60fps animations
- Mobile responsive
- Lighthouse 95+

### Week 3: Evolu Integration

**Local-First Storage:**

```typescript
// Schema
const schema = {
  theme: table({
    id: id(),
    name: text().notNull(),
    colors: jsonb<ThemeColors>(),
    isPublic: boolean(),
    createdAt: timestamp(),
  }),
  settings: table({
    id: id(),
    userId: text(),
    preferences: jsonb<UserPreferences>(),
  }),
};
```

**Features:**
- [ ] Save custom themes locally
- [ ] Theme history (last 10)
- [ ] Export/import themes
- [ ] Offline-capable playground

**Why Evolu:**
- Privacy-first (data stays local)
- Works offline
- No auth required for basic usage
- Optional P2P sync later

### Week 4: Gallery & Social

**Community Showcase:**

**Features:**
- [ ] Submit snake to public gallery
- [ ] Browse community snakes
- [ ] Upvote/favorite system
- [ ] Filter by theme, date, popularity
- [ ] GitHub OAuth for submissions

**Backend: Appwrite**

Collections:
```
snakes:
  - id
  - userId
  - username
  - theme (string or JSON for custom)
  - settings (JSON)
  - imageUrl (CDN)
  - votes (relation)
  - createdAt

votes:
  - id
  - snakeId (relation)
  - userId
  - value (+1 / -1)
```

**Social Features:**
- [ ] "Snake of the Week" badge
- [ ] Share to Twitter with OG image
- [ ] Embed code for blogs
- [ ] Pinterest-style grid layout

---

## 💰 Phase 2.5: Monetization Strategy (Q1 2025)

**Goal:** Sustainable income to fund development

### Free Tier
✅ All current features
✅ 7 pre-built themes
✅ Basic color customization
✅ SVG/GIF export
✅ GitHub Action

### Sponsor Tier ($5/month)

**Exclusive Features:**
- 🎨 **Unlimited custom themes** - Save unlimited themes
- 🌈 **Advanced color editor** - HSL/gradient controls
- ⚡ **Priority rendering** - Skip queue (when web service)
- 🎮 **Early access to PvP** - Beta testing
- 📊 **Analytics dashboard** - Views, downloads stats
- 💎 **Sponsor badge** - In gallery and profile
- 🎁 **Exclusive themes** - Monthly premium theme pack

**Value Proposition:**
> "Support ethical open-source development while unlocking 
> advanced customization. Used by 500+ sponsors worldwide."

### Implementation

**A) GitHub Sponsors Setup**

Tiers:
```yaml
$5/month - Supporter:
  - Sponsor badge
  - Priority support
  - Early access

$15/month - Power User:
  - All Supporter benefits
  - Custom theme builder
  - Analytics dashboard
  - Remove watermark

$50/month - Company:
  - All Power User benefits
  - Team licenses (10 users)
  - Private gallery
  - Custom branding
```

**B) Feature Gating**

```typescript
// Check sponsor status
async function checkSponsorStatus(username: string): Promise<SponsorTier> {
  // GitHub GraphQL API
  // Return: 'free' | 'supporter' | 'power' | 'company'
}

// UI based on tier
if (tier === 'free') {
  showUpgradePrompt("Unlock unlimited themes for $5/month");
} else {
  enablePremiumFeatures();
}
```

**C) Marketing Page**

`/pricing`:
- Compare tiers
- Testimonials from sponsors
- "Support open source" messaging
- Clear value proposition

**Success Metrics:**
- 20 sponsors by end of Q1
- $100 MRR (Monthly Recurring Revenue)
- 5% conversion rate (free → sponsor)

---

## 🎮 Phase 3: v3.0 - PvP Mode (Q2-Q3 2025)

**Status:** Future planning, low priority until v2.0 ships

### Game Mechanics (Refined)

**Core Concept:**
> Two players compete on the same contribution graph.  
> First to eat all contributions (or highest score) wins.

**Rounds System:**
```
Round 1: Normal speed, 3 min limit
Round 2: 1.5x speed, 2 min limit
Round 3: 2x speed, 1 min limit
Finals: 3x speed, 30 sec limit
```

**Power-ups with Cooldowns:**
- 🔄 **Shrink** (10s cooldown) - Lose 3 body segments
- ⚡ **Speed Boost** (20s cooldown) - 2x speed for 5s
- 🌀 **Teleport** (30s cooldown) - Random safe position
- 🛡️ **Shield** (60s cooldown) - Pass through yourself once
- 🎯 **Vision** (15s cooldown) - Highlight highest value squares

**Scoring:**
```javascript
base_points = contribution_level (1-5)
round_multiplier = [1, 1.5, 2, 3, 5][current_round]
combo_bonus = consecutive_eats * 0.5
final_score = base_points * round_multiplier + combo_bonus
```

**Game Modes:**

1. **Quick Match** (3 rounds, 6 min total)
2. **Ranked** (5 rounds, 10 min, ELO rating)
3. **Team Battle** (2v2, shared graph)
4. **Company vs Company** (5v5, tournament style)

### Technical Implementation

**Real-time Engine:**

Use Appwrite Realtime (WebSocket):

```typescript
// Game state sync
interface GameState {
  gameId: string;
  players: [Player, Player];
  grid: ContributionGrid;
  round: number;
  timeRemaining: number;
  powerUps: PowerUp[];
}

// Broadcast updates at 60fps
setInterval(() => {
  broadcastGameState(gameState);
}, 16); // 60fps
```

**Latency Optimization:**
- Client-side prediction
- Server reconciliation
- Rollback on desync

**AI Opponent:**

For practice mode:

```typescript
// Difficulty levels
enum Difficulty {
  Easy = 500,    // 500ms reaction time
  Medium = 250,
  Hard = 100,
  Insane = 50,
}

// AI uses same pathfinding but with delay
async function aiMove(difficulty: Difficulty) {
  await sleep(difficulty);
  return calculateBestMove(grid, snake);
}
```

**Anti-Cheat:**
- Server-authoritative movement
- Input validation
- Rate limiting
- Replay detection

### Leaderboards

**Categories:**
- Global (all time)
- Weekly
- Monthly
- By country
- By company

**Rewards:**
- Top 10: Special badge
- Top 100: Custom title
- Monthly winner: Featured on homepage

---

## 📅 Revised Timeline

```
v1.2.4  ✅  Current     - Basic functionality
v1.3.0  🚧  Jan 2025   - GIF + Ethical positioning + Color preview
v1.4.0  📋  Feb 2025   - Performance optimization + bug fixes
v2.0.0  📋  Mar 2025   - Full playground launch
v2.1.0  📋  Apr 2025   - Gallery + social features
v2.2.0  📋  May 2025   - Monetization (Sponsor tiers)
v3.0.0  📋  Q3 2025    - PvP Mode beta
v3.1.0  📋  Q4 2025    - PvP full release + tournaments
```

### Revised Milestones

**Q1 2025 Goals:**
- ✅ Ship v1.3.0 with GIF (Jan 15)
- ✅ Launch interactive playground (Feb 1)
- ✅ Ethical positioning complete (Feb 1)
- ✅ Gallery + voting system (Mar 1)
- 🎯 **5,000 GitHub stars**
- 🎯 **10,000 npm downloads/month**
- 🎯 **20 GitHub Sponsors**

**Q2 2025 Goals:**
- Premium tier launched
- 50+ sponsors
- 1,000+ community themes
- Featured on GitHub Explore

**Q3-Q4 2025 Goals:**
- PvP beta → full release
- 10,000+ stars
- 500+ sponsors
- 100,000+ npm downloads/month

---

## 🎯 Success Metrics Dashboard

### Product Metrics

| Metric | Current | Q1 Target | Q2 Target | Q4 Target |
|--------|---------|-----------|-----------|-----------|
| GitHub Stars | ~500 | 5,000 | 7,500 | 10,000 |
| npm Downloads/mo | ~1,000 | 10,000 | 25,000 | 100,000 |
| GitHub Action Uses | ~100 | 5,000 | 10,000 | 25,000 |
| Gallery Themes | 0 | 100 | 500 | 1,000 |
| Active Users/mo | ~500 | 50,000 | 100,000 | 250,000 |

### Revenue Metrics

| Metric | Q1 | Q2 | Q3 | Q4 |
|--------|----|----|----|----|
| Sponsors | 20 | 50 | 150 | 300 |
| MRR | $100 | $500 | $2,000 | $5,000 |
| ARR | $1,200 | $6,000 | $24,000 | $60,000 |

### Performance Metrics

| Metric | Target |
|--------|--------|
| GIF Generation | <5s for 365 days |
| Playground Load | <2s |
| Preview Update | <100ms |
| Lighthouse Score | 95+ |
| Memory Usage | <512MB |
| Bundle Size | <300KB |

---

## 📊 Competitive Analysis

### Direct Competitors

**Platane/snk (Original):**
- ✅ 7K+ stars, established
- ✅ Simple, works well
- ❌ No customization
- ❌ No interactive playground
- ❌ No community features

**Our Advantages:**
- ✅ Full color customization
- ✅ Growing snake mechanic
- ✅ Interactive playground
- ✅ Ethical positioning
- ✅ Premium features

**github-contributions-chart (5.5K stars):**
- ✅ Shows full history
- ❌ Static image only
- ❌ No animation
- ❌ No customization

**Our Advantages:**
- ✅ Animated (way cooler)
- ✅ Interactive
- ✅ Gamification

### Manipulation Tools (TO AVOID)

**gitfiti (8.3K stars):**
- Category: Playful pixel art
- Ethics: Gray area, but clearly art

**github-activity-generator (3.7K stars):**
- Category: Fake activity
- Ethics: Sketchy, against ToS

**Our Differentiation:**
> "We're on the opposite end of the spectrum.  
> Snake Evolution = Fun + Authentic + Trusted by hiring managers."

---

## 🚨 Risk Mitigation

### Technical Risks

**Risk:** GIF rendering too slow
**Mitigation:** 
- Benchmark early
- Frame sampling
- Web Workers
- Caching

**Risk:** Playground performance on mobile
**Mitigation:**
- Progressive enhancement
- Reduced quality mode
- Service Worker caching

**Risk:** Appwrite cost at scale
**Mitigation:**
- Self-hosted option
- Cloudflare CDN
- Aggressive caching

### Business Risks

**Risk:** Low sponsor conversion
**Mitigation:**
- Clear value proposition
- Social proof (testimonials)
- Trial period (7 days)
- "Support open source" angle

**Risk:** Comparison to "fake activity" tools
**Mitigation:**
- Aggressive ethical positioning
- Clear differentiation
- Trust indicators
- Hiring manager testimonials

**Risk:** Competition from forks
**Mitigation:**
- Keep innovating (playground, PvP)
- Build community moat
- Premium features
- Brand recognition

---

## 🎨 Marketing Strategy

### Content Marketing

**Blog Posts:**
1. "Why I Built Snake Evolution (And Why It's Ethical)"
2. "Behind the Scenes: How Snake Pathfinding Works"
3. "The Problem with GitHub Contribution Manipulation"
4. "5 Creative Ways to Use Snake Evolution"
5. "Building a Local-First App with Evolu"

**Videos:**
1. Product demo (60s)
2. Playground tutorial (5 min)
3. "Ethical vs Fake" comparison (3 min)
4. Theme creation tutorial (10 min)

**Social Media:**
- Twitter: Daily snake showcases
- Dev.to: Technical deep dives
- Reddit: r/github, r/programming
- HackerNews: Launch announcement

### Community Building

**Discord Server:**
- #showcase - User snakes
- #themes - Theme sharing
- #support - Help channel
- #feedback - Feature requests
- #dev - Development updates

**GitHub Discussions:**
- Ideas & Feature Requests
- Show & Tell
- Q&A
- Announcements

**Events:**
- Weekly "Snake of the Week"
- Monthly theme contest
- Quarterly PvP tournament (when ready)

---

## 🔧 Technical Debt to Address

### Before v2.0

**High Priority:**
- [ ] Reduce bundle size (400KB → <300KB)
- [ ] Add error boundaries in React
- [ ] Implement proper logging
- [ ] Add performance monitoring
- [ ] Write integration tests

**Medium Priority:**
- [ ] Refactor engine to use Web Workers
- [ ] Implement caching layer
- [ ] Optimize SVG output
- [ ] Add analytics (privacy-friendly)

**Low Priority:**
- [ ] Migrate to Biome 2.0 when stable
- [ ] Update to latest Astro
- [ ] Consolidate types package

---

## 📚 Documentation Needs

### Before v2.0 Launch

**User Docs:**
- [ ] Getting started guide
- [ ] Playground tutorial
- [ ] Theme creation guide
- [ ] API reference (for CLI)
- [ ] FAQ
- [ ] Video tutorials

**Developer Docs:**
- [ ] Architecture overview
- [ ] Contributing guide
- [ ] Theme development
- [ ] Plugin system (future)

**Marketing:**
- [ ] Press kit
- [ ] Brand guidelines
- [ ] Screenshots library
- [ ] Testimonials page

---

## 🎯 Key Decisions to Make

### Before Starting v1.3

**Decision 1: GIF vs SVG Default**
- Option A: Keep SVG as default (backward compatible)
- Option B: Make GIF default (better compatibility)
- **Recommendation:** Keep SVG, add clear GIF benefits messaging

**Decision 2: Color Customization Scope**
- Option A: Full HSL control (complex UI)
- Option B: Preset palettes + limited tweaking
- **Recommendation:** Start with B, add A for sponsors

**Decision 3: Monetization Timing**
- Option A: Launch with v2.0 (February)
- Option B: Wait until v2.1 (March/April)
- **Recommendation:** Launch with v2.0, gives time to iterate

**Decision 4: Evolu vs Traditional DB**
- Option A: Full Evolu (learning curve, offline-first)
- Option B: Hybrid (Appwrite for public, Evolu for local)
- **Recommendation:** Hybrid approach

---

## 🔄 Feedback Loops

### Weekly Check-ins

**Metrics to Track:**
- npm downloads (weekly)
- GitHub stars (daily)
- Action usage (weekly)
- Website traffic (daily)
- User feedback (continuous)

### Monthly Reviews

**Questions:**
1. Are we hitting milestones?
2. What's working / not working?
3. Should we pivot anything?
4. What's user feedback saying?
5. How's revenue tracking?

### Quarterly Planning

**Focus:**
- Review Q roadmap
- Adjust based on learnings
- Plan next Q priorities
- Community check-in

---

## 💡 Future Ideas (Post v3.0)

**Parking Lot:**
- Email signature mode (animated GIF)
- Custom text mode ("your-name.dev" eaten by snake)
- Mobile app (React Native)
- API for third-party integrations
- Plugin system for custom renderers
- AI-generated themes
- NFT badges (controversial, research first)
- Corporate team dashboards
- Contribution forecasting
- Gamification achievements

---

## 📌 Appendix

### Key Resources

- [Market Research Article](https://medium.com/data-science-collective/developers-are-gaming-their-github-profiles-3f58f1f00c2a)
- [React Component Reference](GitHub_Contribution_Snake_Game.tsx)
- [Platane/snk Original](https://github.com/Platane/snk)

### Tech Stack Summary

**Current:**
- Runtime: Bun 1.3.5
- Monorepo: Turborepo
- Language: TypeScript 5.9
- Linting: Biome
- Testing: Vitest

**Planned (v2.0+):**
- Frontend: Astro + React 19
- Styling: TailwindCSS 4
- Database: Evolu (local) + Appwrite (cloud)
- Payments: GitHub Sponsors API
- Analytics: Plausible (privacy-friendly)

---

**Last Updated:** December 29, 2025  
**Next Review:** January 15, 2025 (post v1.3.0 launch)  
**Maintainer:** [@miccy](https://github.com/miccy)
