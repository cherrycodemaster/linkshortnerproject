#!/usr/bin/env python3
"""Create a PNG bar chart of monthly link creations from the project's database."""

from __future__ import annotations

import argparse
import os
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import psycopg
from dotenv import load_dotenv


QUERY = """
WITH months AS (
  SELECT generate_series(
    date_trunc('month', timezone('UTC', now())) - interval '11 months',
    date_trunc('month', timezone('UTC', now())),
    interval '1 month'
  ) AS month_start
), counts AS (
  SELECT
    date_trunc('month', created_at AT TIME ZONE 'UTC') AS month_start,
    COUNT(*)::integer AS link_count
  FROM links
  WHERE created_at >= date_trunc('month', timezone('UTC', now())) - interval '11 months'
    AND created_at < date_trunc('month', timezone('UTC', now())) + interval '1 month'
  GROUP BY 1
)
SELECT months.month_start, COALESCE(counts.link_count, 0) AS link_count
FROM months
LEFT JOIN counts USING (month_start)
ORDER BY months.month_start;
"""


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Export a 12-month link-creation bar chart as PNG."
    )
    parser.add_argument(
        "--env-file",
        type=Path,
        default=Path(".env"),
        help="Path to the environment file containing DATABASE_URL (default: .env).",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("link-creations-last-12-months.png"),
        help="Destination PNG path (default: link-creations-last-12-months.png).",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    if not args.env_file.is_file():
        raise SystemExit(f"Environment file not found: {args.env_file}")

    load_dotenv(args.env_file)
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise SystemExit("DATABASE_URL is not set in the environment file.")

    try:
        with psycopg.connect(database_url) as connection:
            with connection.cursor() as cursor:
                cursor.execute(QUERY)
                rows = cursor.fetchall()
    except psycopg.Error as error:
        raise SystemExit(f"Database query failed: {error.__class__.__name__}") from error

    months = [row[0] for row in rows]
    counts = [row[1] for row in rows]
    labels = [month.strftime("%b %Y") for month in months]

    figure, axis = plt.subplots(figsize=(12, 6), layout="constrained")
    bars = axis.bar(labels, counts, color="#2563eb", width=0.7)
    axis.set_title("Links Created by Month")
    axis.set_xlabel("Month")
    axis.set_ylabel("Total links created")
    axis.set_ylim(bottom=0)
    axis.grid(axis="y", alpha=0.25)
    axis.tick_params(axis="x", rotation=45)

    for bar, count in zip(bars, counts):
        axis.annotate(
            str(count),
            (bar.get_x() + bar.get_width() / 2, bar.get_height()),
            xytext=(0, 3),
            textcoords="offset points",
            ha="center",
            va="bottom",
            fontsize=9,
        )

    args.output.parent.mkdir(parents=True, exist_ok=True)
    figure.savefig(args.output, dpi=150, format="png")
    plt.close(figure)
    print(f"Chart saved to {args.output.resolve()}")


if __name__ == "__main__":
    main()
