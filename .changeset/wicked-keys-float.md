---
"@axelarjs/maestro": patch
"@axelarjs/api": patch
---

apps/maestro:

- optimize searchGMP calls
- fix token details line height
- fix search results to center lookup token to origin token
- move direct calls to searchGMP to trpc queries
- upgrade dependencies

packages/api:

- update searchGMP params to support array of contract methods
