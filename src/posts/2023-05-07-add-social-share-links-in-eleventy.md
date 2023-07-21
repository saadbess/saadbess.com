---
title: 'Add social share links in Eleventy'
description: 'Learn how to add social share links to your Eleventy blog posts using minimal configuration and Nunjucks templating.'
date: 2023-05-07
draft: true
tags:
  - eleventy
  - 11ty
  - nunjucks
  - social media
---

In this tutorial, you’re going to learn how to add social share links (like the ones at the bottom of this post) to your Eleventy blog posts. This feature is a simple touch, but robust for easily sharing blog posts to reach more potential readers.

I didn’t want to use a bloated plugin or widget for this feature and rather went with a much simpler, vanilla approach.

There are endless amounts of social platforms that provide URLs for sharing capabilities. This example will only focus on some of the more common options: Facebook, LinkedIn, and Twitter.

## Setup and configuration

Leveraging [Eleventy’s configuration API](https://www.11ty.dev/docs/config/), we need to use the `addGlobalData` method in order to grab our site’s root URL.

In your `.eleventy.js` config file add the line of code below with your own URL.

```javascript
eleventyConfig.addGlobalData('rootURL', 'https://www.saadbess.com');
```

The first value in `addGlobalData` is the key that will be available inside our template files. The second value is the value of our key— in this case our site’s URL.

This is all we need for our configuration.

## Adding the links to our templates

For all my blog posts I’m leveraging a common `_layouts/post.njk` [layout](https://www.11ty.dev/docs/layouts/) file. This Nunjucks template holds common data that is shared across all blog posts. This seems like a good place to include our new social links.
