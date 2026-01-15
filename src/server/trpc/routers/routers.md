Core Forum Features

Category and tags

Threads and replies

Rich text/Markdown editor

Upvotes/likes

Moderation tools (ban, delete, edit)

User profiles

Notifications (email and/or in-app)

Search

Embedding / Inriestegration Features

Script tag embed (like Disqus or Intercom)

API for full control (REST/GraphQL)

Web components or iframe embed

Login integration via OAuth / SSO

Dark/light theme switching

Optional Add-ons

Polls

Reputation system

Private messaging

AI-powered moderation or summarization

# 📚 API Documentation – tRPC Routers

This document provides an overview of the tRPC routers and their available procedures.  
All procedures are strongly typed, validated with **Zod**, and follow access conventions:

- `publicProcedure`: accessible to anyone
- `protectedProcedure`: requires authentication
- Admin-only procedures are explicitly noted

---

## 🏷️ `bookmarksRouter`

Manage user bookmarks on threads.

- **getAll** → List user’s bookmarks with pagination (`limit`, `cursor`)
- **add** → Bookmark a thread (`threadId`)
- **remove** → Remove a bookmark (`threadId`)

---

## 📂 `categoryRouter`

Manage forum categories.

- **list** → Fetch all categories with thread counts
- **bySlug** → Get category details and thread count by `slug`
- **create** (Admin only) → Create a new category (unique `slug`)

---

## 🛡️ `moderationRouter`

Tools for moderators and admins.

- **createReport** → Report a thread or reply (`type`, `reason`, `threadId?`, `replyId?`)
- **listReports** (Admin only) → List reports, filter by `type` and `resolved` status
- **resolveReport** (Admin only) → Mark a report as resolved
- **getStats** (Admin only) → Get counts of pending and total reports

---

## 🔔 `notificationsRouter`

Manage in-app notifications.

- **getAll** → Fetch user notifications with pagination (`limit`, `cursor`)
- **markAsRead** → Mark a specific notification as read (`id`)
- **markAllAsRead** → Mark all notifications for current user as read
- **create** → Create a notification (`userId`, `type`, `title`, `message`, `link`)

---

## 💬 `replyRouter`

Handle replies to threads.

- **list** → List replies for a thread (`threadId`, pagination, sort by oldest/newest)
- **create** → Post a reply (checks locked threads & permissions)
- **update** → Edit a reply (author/admin only)
- **delete** → Delete a reply (author/admin only)

---

## ⚙️ `settingsRouter`

User settings management.

- **getAll** → Fetch all settings (privacy, theme, notifications)
- **updatePrivacy** → Update visibility & data sharing
- **updateTheme** → Update theme mode (`light`, `dark`, `system`) & custom CSS
- **updateNotification** → Enable/disable notification types

---

## 🏷️ `tagRouter`

Manage and query tags.

- **list** → List all tags with thread counts
- **bySlug** → Get tag details + thread count by `slug`
- **popular** → Fetch popular tags (by thread usage, with limit)

---

## 🧵 `threadRouter`

Core forum thread management.

- **list** → Browse threads with filters (`search`, `category`, `tagId`, `sortBy`)
- **byId** → Get thread details by ID
- **create** → Create a new thread (with optional tags)
- **update** → Update thread (author/admin only)
- **delete** → Delete thread (author/admin only)
- **togglePin** (Admin only) → Pin/unpin a thread
- **toggleLock** (Admin only) → Lock/unlock a thread
- **recent** → Get recently created threads

---

## 👤 `userRouter`

User profiles and accounts.

- **byUsername** → Fetch user details by `username`
- **updateProfile** → Update profile (name, username, bio, etc.)
- **list** → List users (basic info)
- **updateSettings** → Update email notification & privacy preferences
- **getSettings** → Fetch current user’s settings
- **topContributors** → Get top contributors (limit optional)

---

# 🔧 Automation Notes

Documentation can be auto-generated or enhanced with:

- **[trpc-openapi](https://github.com/jlalmes/trpc-openapi)** → Convert tRPC routers to OpenAPI spec.
- **[typedoc](https://typedoc.org/)** → Generate docs from TypeScript with JSDoc comments.
- **[tRPC Playground](https://github.com/carlson-technologies/trpc-playground)** → Interactive API explorer.

---

Here are some suggestions that would strengthen the app:

🛠 Core Forum Features You Could Add

Search & Filtering Improvements

Full-text search across threads and replies (using Postgres tsvector or SQLite FTS).

Filter by multiple tags, author, or date range.

Sorting beyond “recent” and “popular” (e.g. “most liked”).

User Engagement

Upvotes/Downvotes or Likes on threads/replies (new schema votes).

Reputation/karma system (aggregate from votes).

“Best Answer” flag for Q&A-style threads.

Thread Organization

Subcategories or nested categories.

Thread subscriptions (follow/unfollow threads for notifications).

“Drafts” for threads and replies (save but not publish).

Moderation Extensions

Ban/mute users for a time period.

Add moderation notes to a report (e.g. why action was taken).

Auto-moderation (basic filters for spam words, links, etc.).

Notifications

Currently you have per-user notifications. You could:

Add “email digest” for daily/weekly updates.

WebSocket or SSE push for real-time notifications.

Settings / Personalization

More theme customization (color schemes).

Privacy controls (e.g. hide profile from search).

Granular notification types (mention vs reply vs system).

🔒 Security & Auth

Rate limiting on sensitive endpoints (createThread, createReply, report).

Role expansion: Moderator role between admin and normal user.

Audit log for admin actions (schema: admin_logs).

📊 Analytics / Community Insights

Thread view counts (simple counter).

Top categories, trending tags.

Contributor leaderboards (you already have topContributors, could extend with score).

💡 Developer Experience

Add an OpenAPI-style docs generator for tRPC (there’s trpc-openapi)

🔑 Core Additions for a Community Hub

1. Real-Time Chat / Messaging

Direct messages (DMs) between users.

Group chats (small communities inside the hub).

Schema: conversations, messages, participants.

Backed by WebSockets (or Supabase Realtime if you want to stay lean).

2. Events & Meetups

Users can create events (online/offline).

RSVP system (going, maybe, not going).

Calendar view integration.

Schema: events, event_attendees.

3. User Groups / Communities

Sub-communities inside the hub (e.g. “React Developers”, “Designers”).

Each group can have:

Its own forum categories.

Chat channels.

Moderators/admins separate from global admins.

Schema: groups, group_members, group_roles.

4. Content Feeds

Personalized feed (threads from followed categories, tags, groups).

Trending feed (based on votes + activity).

Could reuse bookmarks, subscriptions, votes.

5. Reputation & Badges

Gamification to encourage contributions.

Karma points from votes, accepted answers, reports resolved, etc.

Badges (e.g. “Early Contributor”, “Top Moderator”, “Event Organizer”).

6. Resource Sharing

A lightweight “resources” library:

Links to articles, docs, videos.

Searchable + tagged.

Schema: resources, resource_tags.

7. Enhanced Profiles

Already have profile. Expand with:

Social links (GitHub, LinkedIn, Twitter).

Skills/interests (for discovery).

Achievements (badges, top posts, events attended).

📊 Admin & Community Management

Analytics Dashboard:

Active users, top categories, event attendance.

Moderation Tools:

Ban/mute per group.

Escalation system (flag to group mod → global mod if unresolved).

🔌 Integration Ideas

OAuth login (Google, GitHub, Discord) for smoother onboarding.

Calendar export (iCal for events).

Slack/Discord bridge for group chats.

✅ Suggested Roadmap for Transition

Messaging (DMs + group chats) → adds real “community” feel.

Groups & Events → lets people form sub-communities.

Reputation + Badges → gamifies contributions.

Resources library + Feeds → builds long-term stickiness.
