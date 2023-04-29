---
permalink: /blog/tag/{{ tag | slugify }}/index.html
layout: page
pagination:
  data: collections
  size: 1
  alias: tag
  addAllPagesToCollections: true
eleventyComputed:
  title: Posts Tagged with {{ tag }}
---

{% for post in collections[tag] %}

  <li>
    <a href="{{ post.url }}">{{ post.data.title }}</a>
  </li>
{% endfor %}
