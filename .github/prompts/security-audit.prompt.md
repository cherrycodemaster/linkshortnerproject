---
<!-- agent: ask -->
agent: agent
---

<!-- Tip: Use /create-prompt in chat to generate content with agent assistance -->

Perform a security audit of the codebase. Identify potential vulnerabilities, insecure coding practices, and areas that may require additional security measures. Provide recommendations for improving the security posture of the application.

Output your findings as a markdown formatted table with the following columns (ID should start at 1 and auto increment, File Path should be an actual link to the file): ID, Severity (Low/Medium/High), Vulnerability, Description / Issue, File Path, Line Number(s) and Recommendation.

Next, ask the user which issues they want to fix by either replying "all", a comma separated list of IDs. After they reply, run a separate sub agent (#runSubagent) to fix each issue that the user has specified. Each sub agent should report back with a simple `subAgentSuccess: true | false`.