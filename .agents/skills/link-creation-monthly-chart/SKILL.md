---
name: link-creation-monthly-chart
description: Query this link-shortener project's PostgreSQL database and export a PNG bar chart of links created in each of the previous 12 calendar months. Use this skill whenever the user asks for link-creation trends, monthly link counts, a links analytics chart, or a database-backed PNG visualization of links.
compatibility: Requires Python 3.10+ with psycopg[binary], matplotlib, and python-dotenv installed; requires DATABASE_URL in the project's .env file.
---

# Link creation monthly chart

Generate a 12-month bar chart from the project's `links` table. The chart shows every calendar month in the rolling 12-month window, including months with no links.

## Workflow

1. Work from the repository root so the script can locate `.env`.
2. Confirm `.env` exists and contains `DATABASE_URL`; never print, log, commit, or include that value in the response.
3. Ensure the required packages are available:

   ```powershell
   python -m pip install "psycopg[binary]" matplotlib python-dotenv
   ```

4. Run the bundled script. By default it writes `link-creations-last-12-months.png` in the current directory.

   ```powershell
   python .agents/skills/link-creation-monthly-chart/scripts/plot_link_creations.py
   ```

   To choose a location, pass `--output`:

   ```powershell
   python .agents/skills/link-creation-monthly-chart/scripts/plot_link_creations.py --output reports/link-creations.png
   ```

5. Verify that the output file exists and report its path. If access to the database fails, report the error without exposing credentials and do not substitute fabricated data.

## Data definition

- Source table: `links`
- Timestamp: `created_at` (`timestamp with time zone`)
- Range: from the first day of the month 11 months ago through the first day of next month, in UTC.
- Aggregation: `COUNT(*)`, grouped by UTC calendar month.
- Chart: x-axis = 12 abbreviated month labels (`Mon YYYY`); y-axis = total links created; output = PNG.

The script only performs a `SELECT` query. Do not alter application data or database schema for this task.
