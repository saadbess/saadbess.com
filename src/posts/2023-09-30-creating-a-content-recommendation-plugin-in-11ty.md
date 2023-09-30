---
title: 'Creating a Content Recommendation Plugin in 11ty'
description: "This article offers insights into the relationship between binary and complex decisions, drawing on cognitive science, history, and religious perspectives to improve decision-making capabilities."
date: 2023-10-01
toc: true
draft: true
postId: 10
tags:
  - javascript
  - 11ty
  - technical
  - plugins
---

In this post, we're going to create a plugin in Eleventy (11ty) that intelligently analyses blog post tags to suggest related articles to readers. This type of recommendation engine enhances user engagement, increases page views, and offers a tailored reading experience by presenting relevant content suggestions.

## Organise your posts with tags

For your content pieces (like blog posts), organise your tags within your frontmatter with associated keywords.

```javascript
---
title: "My Blog Post"
tags:
  - blog post
  - tech
  - javascript
  - technical
---
```

## Create the Plugin

Create a seperate file `contentRecommendation.js` for the implmentation of the plugin. It's good practice to house plugins seperately as opposed to directly implement them within your `.eleventy.js` file. Personally, I have my plugins stored `./config/plugins`.

```javascript
module.exports = function (eleventyConfig) {
  eleventyConfig.addCollection("relatedPosts", function (collection) {
    return collection
      .getAll()
      .filter((item) => !item.data.draft)
      .map((post) => {
        let related = [];

        if (post.data.tags) {
          post.data.tags.forEach((tag) => {
            collection.getFilteredByTag(tag).forEach((item) => {
              if (
                item.url !== post.url &&
                !related.includes(item) &&
                !item.data.draft
              ) {
                related.push(item);
              }
            });
          });
        }

        // Remove duplicates and limit to a specific number of related posts, for instance, 3
        related = [...new Set(related)].slice(0, 3);

        post.data.related = related;

        return post;
      });
  });
};
```

Let's break down what's going on here.

### Export the module

```javascript
module.exports = function(eleventyConfig) {
    ...
};
```

Here, we're defining a module that exports a function. This function takes in a single argument, `eleventyConfig`, which is the configuration object for Eleventy. You use this object to tap into various Eleventy APIs, like adding collections, filters, and more.

### Add a collection

```javascript
eleventyConfig.addCollection("relatedPosts", function(collection) {
    ...
});
```

We're using `addCollection` to define a new collection named "relatedPosts". Collections in Eleventy allow you to create groups of content. The callback function for `addCollection` provides a `collection` object, which contains various methods to access your content.

### Filter out draft posts

```javascript
return collection
  .getAll()
  .filter((item) => !item.data.draft)
  .map((post) => {
		...
});
```

Here, two primary operations are being performed on the collection:

1. `collection.getAll()`: This fetches all items in the collection. Each item represents a piece of content, like a blog post.
2. `filter(item => !item.data.draft)`: We're using the filter method to exclude items (or posts) that have the frontmatter property `draft` set to `true`. This ensures that drafts are not considered for recommendations.

```javascript
---
title: 'My Post'
draft: true
---
```

Using `map`, we're iterating over each post (excluding drafts). For each post, we'll find related content and return a modified post with the related content attached.

### Define an empty array for related posts

```javascript
let related = [];
```

This array will store the related posts for the current `post` being processed.

### Check for tags and find related posts

```javascript
if (post.data.tags) {
  post.data.tags.forEach((tag) => {
    collection.getFilteredByTag(tag).forEach((item) => {
      if (
        item.url !== post.url &&
        !related.includes(item) &&
        !item.data.draft
      ) {
        related.push(item);
      }
    });
  });
}
```

1. If the current post has tags (`post.data.tags`), we iterate over each tag.
2. For each tag, we find all items associated with that tag using collection.`getFilteredByTag(tag)`.
3. For each item found, we perform some checks:
   - Ensure the item's URL is not the same as the current post's URL. This ensures we don't recommend the post to itself.
   - Check that this item is not already in the `related` array (avoid duplicates).
   - Ensure this item is not a draft (`!item.data.draft`).
4. If all conditions are met, the item is pushed to the `related` array.

### Limiting and removing duplicate posts

```javascript
related = [...new Set(related)].slice(0, 2);
```

1. `[...new Set(related)]`: This is a trick to remove duplicates from the array. By converting the array to a `Set` and then back to an array, any duplicates are automatically removed.
2. `slice(0, 2)`: Limits the related posts array to the first 3 items. You can adjust the number as desired.

### Attach related posts to the current post

```javascript
post.data.related = related;
```

We're adding the related posts to the `data` object of the current post under a new property named `related`.

### Return the modified post

```javascript
return post;
```

Finally, we return the modified post (with its related content) from the `map` function. This becomes part of the new "relatedPosts" collection.

## Integrate plugin

Now that we have our plugin implemented, we want to integrate it within our 11ty site. Head over to your `.eleventy.js` config and add the plugin.

```javascript
const contentRecommendation = require("./config/plugins/contentRecommendation");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(contentRecommendation);
};
```

## Display related posts in template files

Now that we have our plugin integrated, we can render our related posts within our template files. In this example I'm using Nunjucks.

Within my `_layouts/post.njk` template, at the end of all posts is where I want to render my related posts. 

```javascript
{% raw %}
{% if related %}
   <aside>
      <h2>You might also like:</h2>
      <ul>
       {% for relatedPost in related %}
         <li>
           <a href="{{ relatedPost.url }}">{{ relatedPost.data.title }}</a>
         </li>
       {% endfor %}
      </ul>
   </aside>
{% endif %}
{% endraw %}
```

