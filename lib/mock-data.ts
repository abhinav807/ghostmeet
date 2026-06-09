import type { ActionItem, KeyDecision, GenerationResponse } from "@/types/meeting";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface MockDataset {
  transcript: string;
  duration: number;
  insights: GenerationResponse;
}

const datasets: MockDataset[] = [
  {
    transcript: `Speaker 1: Good morning everyone. Let's get started with the Q4 planning session. I want to go over our revenue targets, pipeline status, and hiring needs.

Speaker 2: Sounds good. I have the pipeline report ready. We're currently at 1.2M ARR with 400K in committed deals.

Speaker 1: That's solid. What's the breakdown on the committed deals?

Speaker 2: We have three enterprise deals: Meridian Corp at 150K, TechVault at 120K, and Apex Solutions at 130K. All three are in final contract review.

Speaker 3: On the product side, we're planning to launch the new analytics dashboard by mid-October. That should help with conversion rates for our mid-market segment.

Speaker 1: Great. Sarah, can you make sure the enterprise deals close by end of October? I don't want these slipping into Q1.

Speaker 2: Will do. I'm scheduling final calls with each account this week. Meridian's CTO seems ready to sign.

Speaker 3: I'll need two more engineers to hit the October launch date. The current team is stretched thin with the API refactor.

Speaker 1: Approved. Post the job listings by Friday. We can't afford to delay the launch.

Speaker 2: One more thing — the marketing team wants to run a webinar series in November to support Q4 demand generation. Budget request is 25K.

Speaker 1: Let's approve that. The ROI on the last webinar series was strong. Make sure the content aligns with the analytics launch.

Speaker 3: I'll coordinate with marketing on the technical content. We can demo the new dashboard features.

Speaker 1: Perfect. Let's recap: Sarah closes enterprise by October, James hires two engineers by Friday, and we approve the 25K webinar budget. Anything else?

Speaker 2: I'll send out the updated pipeline report by end of day.

Speaker 3: And I'll have the job descriptions ready for review tomorrow morning.

Speaker 1: Great. Meeting adjourned. Let's crush Q4.`,
    duration: 312,
    insights: {
      summary: `The Q4 planning session focused on three key areas: pipeline health, product launch readiness, and demand generation. The team currently stands at 1.2M ARR with 400K in committed enterprise deals across Meridian Corp, TechVault, and Apex Solutions, all in final contract review.

On the product front, the analytics dashboard is on track for a mid-October launch, though the engineering team needs additional headcount to meet the deadline. Two new engineer positions were approved to support this effort.

The team also approved a 25K budget for a November webinar series, building on the strong ROI from the previous series. The webinars will align with the analytics dashboard launch to maximize impact.

Overall, Q4 targets appear achievable but depend on closing the three enterprise deals and executing the product launch on schedule. The team is aligned on priorities and next steps.`,
      keyDecisions: [
        {
          decision: "Approve hiring two additional engineers for the analytics dashboard launch",
          context: "The current engineering team is stretched thin with the API refactor and cannot hit the mid-October launch date without additional resources",
          decidedBy: "Speaker 1 (VP/Executive)",
        },
        {
          decision: "Approve 25K budget for November webinar series",
          context: "Previous webinar series showed strong ROI and the marketing team wants to support Q4 demand generation",
          decidedBy: "Speaker 1 (VP/Executive)",
        },
        {
          decision: "Prioritize closing enterprise deals by end of October",
          context: "Three enterprise deals worth 400K total are in final contract review and cannot be allowed to slip into Q1",
          decidedBy: "Speaker 1 (VP/Executive)",
        },
      ],
      actionItems: [
        {
          task: "Close three enterprise deals (Meridian Corp, TechVault, Apex Solutions) by end of October",
          assignee: "Sarah",
          deadline: "End of October",
          priority: "high",
        },
        {
          task: "Schedule final calls with each enterprise account this week",
          assignee: "Sarah",
          deadline: "This week",
          priority: "high",
        },
        {
          task: "Post two engineer job listings",
          assignee: "James",
          deadline: "Friday",
          priority: "high",
        },
        {
          task: "Prepare engineer job descriptions for review",
          assignee: "James",
          deadline: "Tomorrow morning",
          priority: "medium",
        },
        {
          task: "Coordinate webinar technical content with marketing team",
          assignee: "James",
          deadline: "Not specified",
          priority: "medium",
        },
        {
          task: "Send updated pipeline report to team",
          assignee: "Sarah",
          deadline: "End of day",
          priority: "low",
        },
      ],
      followUpEmail: `Subject: Q4 Planning Session — Action Items & Next Steps

Hi team,

Thank you for the productive Q4 planning session today. Here's a summary of the key decisions and action items we agreed on:

Key Decisions:
- Approved hiring two additional engineers to support the analytics dashboard launch
- Approved 25K budget for the November webinar series
- Enterprise deals must close by end of October — no Q1 slippage

Action Items:
- Sarah: Close the three enterprise deals (Meridian Corp, TechVault, Apex Solutions) by end of October. Schedule final calls this week.
- James: Post two engineer job listings by Friday. Have job descriptions ready for review tomorrow morning.
- James: Coordinate webinar technical content with marketing, aligning with the analytics dashboard launch.
- Sarah: Send the updated pipeline report by end of day today.

The next check-in will be scheduled for two weeks from today. Please update your project trackers accordingly.

Let's make Q4 a strong finish.

Best regards,
Leadership Team`,
      meetingMinutes: `## Q4 Planning Session
**Date:** October 3, 2024
**Attendees:** Speaker 1 (VP), Speaker 2/Sarah (Sales), Speaker 3/James (Product/Engineering)

### Agenda Item 1: Revenue & Pipeline Review
- Current ARR: 1.2M
- Committed pipeline: 400K across three enterprise deals
  - Meridian Corp: 150K (final contract review)
  - TechVault: 120K (final contract review)
  - Apex Solutions: 130K (final contract review)

### Agenda Item 2: Product Launch
- Analytics dashboard on track for mid-October launch
- Two additional engineers approved to meet deadline
- Job listings to be posted by Friday

### Agenda Item 3: Demand Generation
- 25K budget approved for November webinar series
- Content to align with analytics dashboard launch
- James to coordinate technical content with marketing

### Decisions Made
1. Approve two additional engineering hires
2. Approve 25K webinar budget
3. Enterprise deals must close by end of October

### Action Items
| Task | Assignee | Deadline | Priority |
|------|----------|----------|----------|
| Close enterprise deals | Sarah | End of October | High |
| Schedule final account calls | Sarah | This week | High |
| Post engineer job listings | James | Friday | High |
| Prepare job descriptions | James | Tomorrow AM | Medium |
| Coordinate webinar content | James | TBD | Medium |
| Send pipeline report | Sarah | End of day | Low |`,
    },
  },
  {
    transcript: `Speaker 1: Thanks for joining on short notice. We need to discuss the security incident from yesterday and our response plan.

Speaker 2: I've prepared a preliminary report. At approximately 2:15 AM on Tuesday, our monitoring system detected unauthorized access to the staging database. The attacker exploited a misconfigured API endpoint that was exposed without authentication.

Speaker 1: What data was exposed?

Speaker 2: The staging database contained synthetic test data only. No production customer data was accessed. We've confirmed this through access logs and database query analysis.

Speaker 3: I've already patched the exposed endpoint and rotated all staging credentials. The fix was deployed by 6 AM yesterday. I'm also running a full audit of all API endpoints across our infrastructure.

Speaker 1: Good. How did this slip through our review process?

Speaker 3: The endpoint was added during the sprint two weeks ago as a quick integration test hook. It bypassed our security review because it was tagged as internal-only, but the network configuration allowed external access.

Speaker 2: We need to tighten the deployment pipeline. Any new endpoint should go through automated security scanning before it reaches any environment.

Speaker 1: Agreed. I want three things: first, a full infrastructure audit completed by end of week. Second, automated security scanning integrated into CI/CD by next Friday. Third, a post-incident report shared with the leadership team by Thursday.

Speaker 3: I can handle the infrastructure audit and the CI/CD integration. The audit will take about three days with the team I have.

Speaker 2: I'll write the post-incident report. I'll have a draft ready for review by Wednesday evening.

Speaker 1: Also, we should notify our customers proactively even though no production data was affected. Transparency builds trust.

Speaker 2: I'll draft a customer communication. It should emphasize that no customer data was compromised and detail the steps we've taken.

Speaker 1: Good. Let's make sure this never happens again. Security is non-negotiable.

Speaker 3: Understood. I'm also proposing mandatory security training for all engineers starting next month.

Speaker 1: Approved. Make it happen.`,
    duration: 285,
    insights: {
      summary: `An emergency meeting was convened to address a security incident involving unauthorized access to the staging database. The breach occurred at approximately 2:15 AM on Tuesday via a misconfigured API endpoint that was exposed without authentication. Critically, no production customer data was accessed — only synthetic test data in the staging environment.

The engineering team responded quickly, patching the exposed endpoint and rotating all staging credentials by 6 AM the same day. The root cause was identified as an integration test hook added during a recent sprint that bypassed security review due to an incorrect internal-only tag.

Three remediation actions were mandated: a full infrastructure audit by end of week, automated security scanning in the CI/CD pipeline by next Friday, and a post-incident report by Thursday. The team will also proactively communicate with customers to maintain trust, and mandatory security training for all engineers was approved.`,
      keyDecisions: [
        {
          decision: "Conduct full infrastructure audit of all API endpoints",
          context: "The incident revealed a gap in the security review process where endpoints could bypass security scanning",
          decidedBy: "Speaker 1 (Leadership)",
        },
        {
          decision: "Integrate automated security scanning into CI/CD pipeline",
          context: "New endpoints must go through automated security checks before deployment to any environment",
          decidedBy: "Speaker 1 (Leadership)",
        },
        {
          decision: "Proactively notify customers about the incident",
          context: "Even though no customer data was compromised, transparency builds trust and demonstrates accountability",
          decidedBy: "Speaker 1 (Leadership)",
        },
        {
          decision: "Implement mandatory security training for all engineers",
          context: "The root cause was a process gap that proper training could help prevent in the future",
          decidedBy: "Speaker 1 (Leadership)",
        },
      ],
      actionItems: [
        {
          task: "Complete full infrastructure audit of all API endpoints",
          assignee: "Speaker 3 (Engineering Lead)",
          deadline: "End of week",
          priority: "high",
        },
        {
          task: "Integrate automated security scanning into CI/CD pipeline",
          assignee: "Speaker 3 (Engineering Lead)",
          deadline: "Next Friday",
          priority: "high",
        },
        {
          task: "Write and deliver post-incident report to leadership",
          assignee: "Speaker 2 (Security)",
          deadline: "Thursday",
          priority: "high",
        },
        {
          task: "Draft customer communication about the incident",
          assignee: "Speaker 2 (Security)",
          deadline: "Wednesday evening (draft for review)",
          priority: "high",
        },
        {
          task: "Implement mandatory security training program for engineers",
          assignee: "Speaker 3 (Engineering Lead)",
          deadline: "Next month",
          priority: "medium",
        },
      ],
      followUpEmail: `Subject: Security Incident Response — Action Items & Remediation Plan

Hi team,

Following our emergency meeting regarding the staging database security incident, here is a summary of our response and next steps:

Incident Summary:
- Unauthorized access detected at 2:15 AM Tuesday via a misconfigured API endpoint
- Only synthetic test data was exposed — no production customer data was affected
- The endpoint was patched and credentials rotated by 6 AM the same day

Remediation Actions:
1. Full infrastructure audit — due end of week (Engineering Lead)
2. Automated security scanning in CI/CD — due next Friday (Engineering Lead)
3. Post-incident report for leadership — due Thursday (Security Team)
4. Customer communication draft — due Wednesday evening for review (Security Team)
5. Mandatory security training rollout — starting next month (Engineering Lead)

Please prioritize these items accordingly. Our goal is zero repeat incidents and a stronger security posture going forward.

Regards,
Leadership Team`,
      meetingMinutes: `## Security Incident Response Meeting
**Date:** Wednesday, following Tuesday 2:15 AM incident
**Attendees:** Speaker 1 (Leadership), Speaker 2 (Security), Speaker 3 (Engineering Lead)

### Incident Overview
- Unauthorized access to staging database detected at 2:15 AM Tuesday
- Attack vector: Misconfigured API endpoint exposed without authentication
- Data exposure: Synthetic test data only — no production customer data affected
- Response: Endpoint patched and credentials rotated by 6 AM same day

### Root Cause Analysis
- API endpoint added as integration test hook during sprint two weeks ago
- Tagged as internal-only but network config allowed external access
- Bypassed security review process due to incorrect classification

### Remediation Plan
1. Full infrastructure audit of all API endpoints (due: end of week)
2. Automated security scanning integrated into CI/CD (due: next Friday)
3. Post-incident report for leadership (due: Thursday)
4. Proactive customer notification (draft due: Wednesday evening)
5. Mandatory security training for all engineers (starts: next month)

### Decisions Made
1. Approve full infrastructure audit
2. Require automated security scanning in CI/CD
3. Proactively notify customers despite no data impact
4. Mandate security training for engineering team`,
    },
  },
  {
    transcript: `Speaker 1: Let's kick off the product roadmap review for next quarter. I want to make sure we're aligned on priorities before we go into sprint planning.

Speaker 2: We've gathered feedback from 47 customer interviews and the data is pretty clear. The top three requests are: real-time collaboration, improved export options, and mobile app support.

Speaker 3: On the technical side, real-time collaboration is the most complex. We'd need to implement WebSocket infrastructure, conflict resolution, and presence indicators. I'd estimate 8-10 weeks with the current team.

Speaker 1: That's a big investment. What's the business case?

Speaker 2: Customers with collaboration features have 3x higher retention rates based on our competitor analysis. And 62% of churned users cited lack of collaboration as a primary reason.

Speaker 1: Those numbers are compelling. Let's make it our flagship feature for Q1.

Speaker 3: If we prioritize collaboration, we'll need to push the mobile app to Q2. We don't have the bandwidth for both.

Speaker 1: Understood. Mobile moves to Q2. What about the export improvements?

Speaker 3: That's a 3-week effort. We can fit it into the first sprint alongside collaboration groundwork.

Speaker 2: I'd also like to propose a beta program for collaboration. We can invite our top 20 accounts to get early feedback before the general release.

Speaker 1: Good idea. Run the beta for 4 weeks before GA. Now, on the design side — we need a cohesive UX that doesn't feel bolted on.

Speaker 4: I've been working on the design system updates. I'll have collaboration mockups ready by next Wednesday for review. We're going with a sidebar approach for presence and cursors.

Speaker 1: Perfect. Let me summarize: collaboration is the Q1 flagship, exports in sprint one, mobile pushed to Q2, and a beta program with top accounts. Everyone aligned?

Speaker 2: Aligned. I'll prepare the customer communication plan for the beta.

Speaker 3: Aligned. I'll start the WebSocket infrastructure design this week.

Speaker 4: Aligned. Mockups by next Wednesday.

Speaker 1: Great work team. Let's build something our customers love.`,
    duration: 348,
    insights: {
      summary: `The product roadmap review centered on prioritizing features for Q1 based on extensive customer feedback from 47 interviews. The three most requested features were real-time collaboration, improved exports, and mobile app support.

Real-time collaboration emerged as the Q1 flagship feature after strong business case data showed 3x higher retention rates for products with collaboration and 62% of churned users citing its absence. The engineering estimate is 8-10 weeks, requiring WebSocket infrastructure, conflict resolution, and presence indicators.

Due to bandwidth constraints, the mobile app has been pushed to Q2. The smaller export improvement project (3 weeks) will be included in the first sprint alongside collaboration groundwork. A beta program with the top 20 accounts will run for 4 weeks before general availability.

Design mockups for the collaboration feature are expected by next Wednesday, using a sidebar approach for presence and cursor indicators.`,
      keyDecisions: [
        {
          decision: "Prioritize real-time collaboration as Q1 flagship feature",
          context: "Customer data shows 3x retention improvement and 62% of churned users cited lack of collaboration",
          decidedBy: "Speaker 1 (Product Lead)",
        },
        {
          decision: "Push mobile app development to Q2",
          context: "Current team bandwidth cannot support both collaboration and mobile app simultaneously",
          decidedBy: "Speaker 1 (Product Lead)",
        },
        {
          decision: "Run 4-week beta program with top 20 accounts before general availability",
          context: "Early customer feedback will validate the implementation before broader release",
          decidedBy: "Speaker 1 (Product Lead)",
        },
      ],
      actionItems: [
        {
          task: "Begin WebSocket infrastructure design for real-time collaboration",
          assignee: "Speaker 3 (Engineering)",
          deadline: "This week",
          priority: "high",
        },
        {
          task: "Create collaboration feature design mockups",
          assignee: "Speaker 4 (Design)",
          deadline: "Next Wednesday",
          priority: "high",
        },
        {
          task: "Prepare customer communication plan for beta program",
          assignee: "Speaker 2 (Product/Customer Success)",
          deadline: "Not specified",
          priority: "medium",
        },
        {
          task: "Implement improved export options",
          assignee: "Engineering Team",
          deadline: "First sprint of Q1",
          priority: "medium",
        },
        {
          task: "Set up beta program infrastructure for top 20 accounts",
          assignee: "Speaker 2 (Product/Customer Success)",
          deadline: "Before collaboration GA release",
          priority: "medium",
        },
      ],
      followUpEmail: `Subject: Q1 Product Roadmap — Decisions & Next Steps

Hi team,

Following our roadmap review session, here are the key decisions and action items for Q1:

Q1 Flagship: Real-Time Collaboration
- Engineering estimate: 8-10 weeks
- WebSocket infrastructure, conflict resolution, and presence indicators
- Beta program with top 20 accounts (4 weeks before GA)

Deferred to Q2:
- Mobile app development

Included in Sprint 1:
- Improved export options (3-week effort)

Action Items:
- Engineering: Begin WebSocket infrastructure design this week
- Design: Collaboration mockups ready by next Wednesday
- Customer Success: Prepare beta communication plan
- Engineering: Export improvements in first sprint

The business case for collaboration is strong — 3x retention improvement and direct feedback from 62% of churned users. Let's deliver something exceptional.

Best,
Product Team`,
      meetingMinutes: `## Product Roadmap Review — Q1 Planning
**Attendees:** Speaker 1 (Product Lead), Speaker 2 (Customer Success), Speaker 3 (Engineering), Speaker 4 (Design)

### Customer Research Findings
- 47 customer interviews conducted
- Top 3 requests: real-time collaboration, improved exports, mobile app
- Collaboration features correlate with 3x higher retention
- 62% of churned users cited lack of collaboration

### Q1 Prioritization
**Flagship: Real-Time Collaboration**
- Technical scope: WebSocket infrastructure, conflict resolution, presence indicators
- Engineering estimate: 8-10 weeks
- Beta program: 4 weeks with top 20 accounts before GA

**Sprint 1 Addition: Export Improvements**
- Estimated effort: 3 weeks
- Fits alongside collaboration groundwork

**Deferred to Q2: Mobile App**
- Insufficient bandwidth to execute both simultaneously

### Design Approach
- Sidebar-based UX for presence and cursor indicators
- Mockups due next Wednesday

### Decisions Made
1. Collaboration is Q1 flagship
2. Mobile app pushed to Q2
3. 4-week beta program before GA
4. Exports included in sprint 1

### Action Items
| Task | Owner | Deadline |
|------|-------|----------|
| WebSocket infrastructure design | Engineering | This week |
| Collaboration mockups | Design | Next Wednesday |
| Beta communication plan | Customer Success | TBD |
| Export improvements | Engineering | Sprint 1 |`,
    },
  },
  {
    transcript: `Speaker 1: Welcome everyone to the quarterly budget review. We need to finalize our spending plan for the next quarter and address some cost concerns.

Speaker 2: Our cloud infrastructure costs have increased 34% quarter-over-quarter. The main drivers are compute scaling for AI workloads and storage growth from user uploads.

Speaker 1: 34% is significant. What are our options for optimization?

Speaker 2: I've identified three areas: first, we can migrate batch processing jobs to spot instances which would save approximately 40% on compute. Second, we should implement lifecycle policies to move cold data to cheaper storage tiers. Third, we can right-size our development environments — they're currently over-provisioned.

Speaker 3: On the spot instances, we'd need to make our batch jobs fault-tolerant. That's about 2 weeks of engineering work. But the savings would be meaningful — around 12K per month.

Speaker 1: What's the risk with spot instances?

Speaker 3: Jobs could be interrupted when the spot price exceeds our bid. We'd need checkpoint mechanisms so we can resume from the last saved state. It's doable but requires careful implementation.

Speaker 2: The storage tiering is lower risk. We can set policies to move files older than 90 days to infrequent access storage. Estimated savings are 8K per month with minimal performance impact.

Speaker 1: Let's approve both. Spot instances for batch jobs and storage tiering. What's the timeline?

Speaker 3: Spot instance migration: 2 weeks of development, then gradual rollout over 2 more weeks. Total 4 weeks.

Speaker 2: Storage tiering can be implemented in 1 week by the DevOps team.

Speaker 1: Good. What about the development environment right-sizing?

Speaker 2: That's a quick win. We can reduce dev environment compute by 60% with no impact on developer productivity. Savings of about 5K per month.

Speaker 1: Do it this week. Now, on the revenue side — how are we tracking against plan?

Speaker 2: We're at 92% of Q3 revenue target. If we close the pending deals, we'll exceed plan by 8%. I'm cautiously optimistic.

Speaker 1: Let's keep the pressure on sales. Any additional headcount requests?

Speaker 3: I'd like to request one more DevOps engineer. The infrastructure is getting complex and we need dedicated capacity.

Speaker 1: Approved, but make sure we optimize first before adding headcount. Let's review in 30 days.

Speaker 2: I'll prepare the updated budget forecast incorporating all these changes by Friday.

Speaker 1: Good meeting. Let's execute.`,
    duration: 330,
    insights: {
      summary: `The quarterly budget review focused on addressing a 34% increase in cloud infrastructure costs driven by AI compute scaling and storage growth. Three optimization strategies were evaluated and two were approved for immediate implementation.

Spot instance migration for batch processing jobs was approved, with an estimated savings of 12K per month after 4 weeks of implementation. This requires making batch jobs fault-tolerant with checkpoint mechanisms. Storage tiering policies for data older than 90 days were also approved, saving approximately 8K per month with a 1-week implementation timeline.

Development environment right-sizing was approved as a quick win, reducing compute by 60% for 5K in monthly savings, to be completed this week. The combined savings total approximately 25K per month.

On the revenue side, the team is at 92% of Q3 target with potential to exceed plan by 8% if pending deals close. One additional DevOps engineer was approved with a 30-day review checkpoint.`,
      keyDecisions: [
        {
          decision: "Migrate batch processing jobs to spot instances",
          context: "Compute costs for AI workloads are a major cost driver; spot instances save ~40% on compute with acceptable risk when paired with checkpoint mechanisms",
          decidedBy: "Speaker 1 (Finance/Leadership)",
        },
        {
          decision: "Implement storage lifecycle policies with 90-day tiering",
          context: "Cold data can move to cheaper storage tiers with minimal performance impact, saving 8K/month",
          decidedBy: "Speaker 1 (Finance/Leadership)",
        },
        {
          decision: "Right-size development environments immediately",
          context: "Dev environments are over-provisioned by 60% with no productivity impact, a quick win saving 5K/month",
          decidedBy: "Speaker 1 (Finance/Leadership)",
        },
        {
          decision: "Approve one additional DevOps engineer hire",
          context: "Infrastructure complexity is growing and needs dedicated capacity, but with a 30-day review checkpoint to ensure optimization happens first",
          decidedBy: "Speaker 1 (Finance/Leadership)",
        },
      ],
      actionItems: [
        {
          task: "Implement fault-tolerance and checkpoint mechanisms for batch jobs, then migrate to spot instances",
          assignee: "Speaker 3 (Engineering)",
          deadline: "4 weeks (2 weeks dev + 2 weeks rollout)",
          priority: "high",
        },
        {
          task: "Implement storage lifecycle policies to tier data older than 90 days",
          assignee: "DevOps Team",
          deadline: "1 week",
          priority: "high",
        },
        {
          task: "Right-size development environments (reduce compute by 60%)",
          assignee: "DevOps Team",
          deadline: "This week",
          priority: "high",
        },
        {
          task: "Prepare updated budget forecast incorporating all optimization changes",
          assignee: "Speaker 2 (Finance)",
          deadline: "Friday",
          priority: "medium",
        },
        {
          task: "Review DevOps headcount need after 30 days of optimization",
          assignee: "Speaker 1 (Leadership)",
          deadline: "30 days",
          priority: "low",
        },
      ],
      followUpEmail: `Subject: Q3 Budget Review — Cost Optimization Actions & Updated Forecast

Hi team,

Following our quarterly budget review, here are the approved cost optimization initiatives:

Cloud Cost Reduction (Target: ~25K/month savings):
1. Spot Instance Migration — Engineering to implement fault-tolerant batch processing (4-week timeline, ~12K/month savings)
2. Storage Tiering — DevOps to implement 90-day lifecycle policies (1-week timeline, ~8K/month savings)
3. Dev Environment Right-Sizing — DevOps to reduce compute by 60% (this week, ~5K/month savings)

Revenue Update:
- Currently at 92% of Q3 target
- Projected to exceed plan by 8% if pending deals close

Hiring:
- One DevOps engineer approved, with 30-day review checkpoint

Updated budget forecast will be circulated by Friday.

Regards,
Finance Team`,
      meetingMinutes: `## Quarterly Budget Review
**Attendees:** Speaker 1 (Leadership), Speaker 2 (Finance), Speaker 3 (Engineering)

### Cost Overview
- Cloud infrastructure costs up 34% QoQ
- Primary drivers: AI compute scaling, storage growth
- Three optimization opportunities identified

### Approved Optimizations
| Initiative | Savings | Timeline | Owner |
|-----------|---------|----------|-------|
| Spot instance migration | 12K/month | 4 weeks | Engineering |
| Storage tiering (90-day) | 8K/month | 1 week | DevOps |
| Dev environment right-sizing | 5K/month | This week | DevOps |
| **Total** | **25K/month** | | |

### Revenue Status
- 92% of Q3 target achieved
- Projected to exceed plan by 8% with pending deals

### Hiring Decisions
- 1 DevOps engineer approved (30-day review checkpoint)

### Decisions Made
1. Approve spot instance migration with fault-tolerance
2. Approve storage lifecycle tiering
3. Approve dev environment right-sizing (immediate)
4. Approve DevOps hire with review clause

### Action Items
- Engineering: Batch job fault-tolerance + spot migration (4 weeks)
- DevOps: Storage tiering (1 week), dev right-sizing (this week)
- Finance: Updated forecast by Friday`,
    },
  },
  {
    transcript: `Speaker 1: Thanks for joining. We need to discuss the rebranding project timeline. The board wants the new brand identity launched before the annual conference in March.

Speaker 2: We've completed the brand audit and stakeholder interviews. The key findings are that our current brand perception is fragmented — customers see us as reliable but outdated. We need to modernize without losing trust.

Speaker 3: The design team has three directions ready for review. Direction A is evolution — keeping our core identity but refreshing typography and color palette. Direction B is a bolder shift with a completely new visual system. Direction C is a middle ground.

Speaker 1: I'm leaning toward Direction C. Our customers trust us and I don't want to alienate them with a radical change. But we also can't look like we're stuck in 2019.

Speaker 2: The customer research supports that. 73% of respondents preferred an evolutionary approach rather than a revolution.

Speaker 3: Direction C it is. I'll refine the designs with that direction and have final brand guidelines ready in 3 weeks.

Speaker 1: What about the name? Are we keeping it?

Speaker 2: The research says yes. Name recognition is our strongest asset. We keep the name, update the logo and visual system, and refresh the voice and messaging.

Speaker 1: Good. What's the full rollout plan?

Speaker 2: Phase 1 is internal — train the team on the new brand voice and guidelines by end of January. Phase 2 is digital — website, app, and social media refresh in February. Phase 3 is the conference reveal in March with all marketing collateral updated.

Speaker 3: We'll need engineering support for the website and app updates. I'd estimate 2 weeks of dev time.

Speaker 1: I'll allocate the engineering resources. Make sure the website migration doesn't break any existing URLs.

Speaker 2: We'll do a full redirect map and QA pass. I'm also planning a brand launch video — 90 seconds, hero narrative. Budget request is 15K for production.

Speaker 1: Approved. This is our moment to reintroduce ourselves. Let's make it count.

Speaker 3: I'll coordinate with engineering on the digital assets timeline. We should have everything production-ready by mid-February for a soft launch internally.

Speaker 1: Perfect. Weekly check-ins starting next Monday. Let's bring this home.`,
    duration: 295,
    insights: {
      summary: `The rebranding project meeting established Direction C (a middle-ground evolutionary approach) as the chosen brand direction, supported by customer research showing 73% preference for evolution over revolution. The company name will be retained given its strong recognition, while the logo, visual system, and brand voice will be refreshed.

The rollout follows a three-phase plan: internal training by end of January, digital refresh (website, app, social) in February, and the full reveal at the annual conference in March. Engineering support for 2 weeks of website and app updates was allocated, with strict requirements to preserve existing URLs through redirect mapping.

A 15K budget for a 90-second brand launch video was approved. Weekly check-ins will begin next Monday to track progress, with all digital assets production-ready by mid-February for internal soft launch.`,
      keyDecisions: [
        {
          decision: "Select Direction C (evolutionary middle-ground) for brand refresh",
          context: "73% of customer research respondents preferred an evolutionary approach; the goal is to modernize without alienating existing customers",
          decidedBy: "Speaker 1 (Executive)",
        },
        {
          decision: "Retain company name in rebrand",
          context: "Name recognition is the company's strongest brand asset according to research findings",
          decidedBy: "Speaker 1 (Executive)",
        },
        {
          decision: "Approve 15K budget for brand launch video production",
          context: "A 90-second hero narrative video for the conference reveal is critical for the launch impact",
          decidedBy: "Speaker 1 (Executive)",
        },
        {
          decision: "Allocate engineering resources for website and app updates",
          context: "Digital refresh requires approximately 2 weeks of dev time with URL preservation requirements",
          decidedBy: "Speaker 1 (Executive)",
        },
      ],
      actionItems: [
        {
          task: "Refine Direction C designs and prepare final brand guidelines",
          assignee: "Speaker 3 (Design Lead)",
          deadline: "3 weeks",
          priority: "high",
        },
        {
          task: "Develop brand training materials and train internal team",
          assignee: "Speaker 2 (Brand/Marketing)",
          deadline: "End of January",
          priority: "high",
        },
        {
          task: "Coordinate engineering timeline for website and app updates",
          assignee: "Speaker 3 (Design Lead)",
          deadline: "Mid-February (production-ready)",
          priority: "high",
        },
        {
          task: "Create full redirect map and QA pass for website migration",
          assignee: "Speaker 2 (Brand/Marketing)",
          deadline: "Before February digital launch",
          priority: "medium",
        },
        {
          task: "Produce 90-second brand launch video",
          assignee: "Speaker 2 (Brand/Marketing)",
          deadline: "Before March conference",
          priority: "medium",
        },
        {
          task: "Begin weekly project check-ins",
          assignee: "All",
          deadline: "Next Monday",
          priority: "low",
        },
      ],
      followUpEmail: `Subject: Rebranding Project — Direction Selected & Rollout Plan

Hi team,

Great session today. Here's where we landed on the rebranding project:

Brand Direction: Direction C — Evolutionary Refresh
- Keep company name (strongest recognition asset)
- Update logo, visual system, typography, and color palette
- Refresh brand voice and messaging
- Final brand guidelines in 3 weeks

Rollout Timeline:
- Phase 1 (Jan): Internal brand training and team alignment
- Phase 2 (Feb): Digital refresh — website, app, social media
- Phase 3 (Mar): Conference reveal with full marketing collateral

Key Approvals:
- 15K for brand launch video (90-second hero narrative)
- Engineering resources for 2 weeks of website/app updates
- URL redirect mapping required for website migration

Weekly check-ins start next Monday. Let's deliver a brand our customers are proud of.

Best,
Leadership Team`,
      meetingMinutes: `## Rebranding Project Planning Meeting
**Attendees:** Speaker 1 (Executive), Speaker 2 (Brand/Marketing), Speaker 3 (Design Lead)

### Brand Audit Findings
- Current perception: reliable but outdated
- Customer preference: 73% favor evolutionary approach
- Name recognition: strongest brand asset — name to be retained

### Direction Selection
- Direction A: Evolution (conservative refresh)
- Direction B: Revolution (bold new visual system)
- Direction C: Middle ground (SELECTED)
  - Keeps core identity, modernizes visual system
  - Aligns with customer research preferences

### Rollout Plan
| Phase | Timeline | Scope |
|-------|----------|-------|
| 1 — Internal | By end of January | Brand training, guidelines rollout |
| 2 — Digital | February | Website, app, social media refresh |
| 3 — Conference | March | Full reveal with marketing collateral |

### Budget Approvals
- Brand launch video: 15K (90 seconds, hero narrative)

### Technical Requirements
- 2 weeks engineering for website and app updates
- Full URL redirect map required
- QA pass before digital launch
- Assets production-ready by mid-February

### Decisions Made
1. Select Direction C for brand refresh
2. Retain company name
3. Approve 15K video budget
4. Allocate engineering for digital updates
5. Weekly check-ins starting next Monday`,
    },
  },
];

let datasetIndex = 0;

function getNextDataset(): MockDataset {
  const dataset = datasets[datasetIndex % datasets.length];
  datasetIndex++;
  return dataset;
}

export function isDemoMode(): boolean {
  return process.env.DEMO_MODE === "true";
}

export async function mockTranscribeAudio(
  _audioBuffer: Buffer,
  _mimeType: string
): Promise<{ transcript: string; duration: number }> {
  await sleep(3000);
  const dataset = getNextDataset();
  return { transcript: dataset.transcript, duration: dataset.duration };
}

export async function mockGenerateMeetingInsights(
  _transcript: string
): Promise<GenerationResponse> {
  await sleep(4000);
  const dataset = datasets[(datasetIndex - 1) % datasets.length];
  return dataset.insights;
}
