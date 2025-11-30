# Blog Posts

This directory contains markdown files for blog posts. Each blog post should be a `.md` file with frontmatter.

## Frontmatter Format

Each blog post must start with frontmatter in YAML format:

```yaml
---
title: "Your Blog Post Title"
description: "A brief description of the post"
date: "2025-01-27"
author: "Author Name"
tags: ["Tag1", "Tag2", "Tag3"]
readTime: "5 min read"
---
```

## Required Fields

- `title`: The title of the blog post
- `description`: A brief description for SEO and previews
- `date`: Publication date in YAML date format (YYYY-MM-DD)
- `author`: Author name
- `tags`: Array of tags (optional but recommended)
- `readTime`: Estimated reading time (optional)

## File Naming

Name your markdown files using the slug format (lowercase, hyphens for spaces). For example:
- `api-testing-with-quickrest.md`
- `getting-started-guide.md`
- `advanced-features.md`

The filename (without `.md`) will be used as the URL slug: `/blog/{filename}`

## Markdown Support

You can use standard Markdown syntax:
- Headers (# ## ###)
- Bold and italic text
- Lists (ordered and unordered)
- Links
- Code blocks
- And more!

## Example

```markdown
---
title: "My First Blog Post"
description: "This is an example blog post"
date: "2025-01-27"
author: "KreativeKorna Concepts"
tags: ["Tutorial", "Guide"]
readTime: "3 min read"
---

# Introduction

This is the content of my blog post...

## Section 1

More content here...
```

