---
description: Read this file to understand how to fetch data in this project.
---
# Data Fetching Instructions
This document outlines the best practices and guidelines for fetching data in our Next.js project. Please follow these instructions to ensure consistency and maintainability across the codebase.

## 1. Use Server Components for Data Fetching
In Next.js, ALWAYS use Server Components to fetch data. NEVER user client components for data fetching.

## 2. Data Fetching Methods
ALWAYS use helper functions in the /data directory to fetch data. NEVER fetch data directly in the components.

ALL helper functions in the /data directory should use Drizzle ORM for database interactions.