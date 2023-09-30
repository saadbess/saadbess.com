---
title: 'Creating a Content Recommendation Plugin in 11ty'
description: "In this tutorial we will create a plugin in 11ty that intelligently analyses the tags of your blog posts to suggest related articles to your readers."
date: 2023-09-30
toc: true
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

Create a separate file, `contentRecommendation.js`, for the implementation of the plugin. It's good practice to house plugins separately, rather than implementing them directly within your `.eleventy.js` file. Personally, I store my plugins in `./config/plugins`.

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

Here, we're defining a module that exports a function. This function accepts a single argument, `eleventyConfig`, representing Eleventy's configuration object. You can use this object to access various Eleventy APIs, such as adding collections, filters, and more.

### Add a collection

```javascript
eleventyConfig.addCollection("relatedPosts", function(collection) {
    ...
});
```

We're using `addCollection` to define a new collection named "relatedPosts". In Eleventy, collections let you group pieces of content together. The callback function for `addCollection` supplies a `collection` object, which offers various methods to access your content.

### Filter out draft posts

```javascript
return collection
  .getAll()
  .filter((item) => !item.data.draft)
  .map((post) => {
		...
});
```

Here, two main operations are carried out on the collection:

1. `collection.getAll()`: This retrieves all items from the collection, with each item representing a piece of content, such as a blog post.
2. `filter(item => !item.data.draft)`: We utilise the `filter` method to exclude items (or posts) that have the frontmatter property `draft` set to `true`, ensuring that drafts aren't considered for recommendations.

```javascript
---
title: 'My Post'
draft: true
---
```

Using `map`, we iterate over each post (excluding drafts). For each post, we identify related content and return an amended post with the associated content attached.

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

1. `[...new Set(related)]`: To remove duplicates from an array, convert the array to a `Set` and back to an array. Any duplicates are automatically eliminated this way.
2. `slice(0, 2)`: This limits related posts array to only 3 items at any one time - adjust as necessary!

### Attach related posts to the current post

```javascript
post.data.related = related;
```

We're adding the related posts to the `data` object of the current post under a new property named `related`.

### Return the modified post

```javascript
return post;
```

Finally, we employ the `map` function to return our amended post (with its associated content) and incorporate it into the new "relatedPosts" collection.

## Integrate plugin

Now that we've implemented our plugin, we aim to integrate it into our 11ty site. Navigate to your `.eleventy.js` configuration and incorporate the plugin.

```javascript
const contentRecommendation = require("./config/plugins/contentRecommendation");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(contentRecommendation);
};
```

## Display related posts in template files

Now that we've integrated our plugin, we can display the related posts within our template files. For this example, I'm utilising Nunjucks.

Within my `_layouts/post.njk` template, I wish to present the related posts at the conclusion of all posts.

```javascript
{% raw %}
{% if related %}
   <aside>
      <h2>You might also like:</h2>
      <ul class="grid mt-l-xl" role="list">
       {% for relatedPost in related %}
         <li class="card flow overflow-hidden">
           <a href="{{ relatedPost.url }}">{{ relatedPost.data.title }}</a>
         </li>
       {% endfor %}
      </ul>
   </aside>
{% endif %}
{% endraw %}
```

Now if you scroll to the end of this post, you'll observe a section titled **"You might also like:"**. This allows readers to explore additional posts.

Essentially, this plugin creates a collection named "relatedPosts", where each post includes an additional `related` property in its `data` object that holds an array of posts which share tags with its current post but do not overlap, thus eliminating duplicate posts and drafts.