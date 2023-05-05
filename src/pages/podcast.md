---
title: 'Podcast'
description: 'Life in Tech Podcast'
permalink: /podcast/index.html
layout: podcast
---

I'm the Co-Founder and Co-Host of the [Life in Tech with Jay and Saad](https://open.spotify.com/show/5CpnRJqTwRTTa6VDgpgcgk) Podcast.

Spotify placed the Life in Tech Podcast in the top 15% of the most shared podcasts globally in 2022, In the Top 20% most followed podcasts Globally in 2022, Listened to in 21 countries. The Life in Tech Podcast is different to your ordinary tech podcast, bringing genuine conversation and discussions to the forefront. Learning from our experiences and sharing our insights and opinions working in the Tech industry. Stay tuned for more exciting guests and topics.

<ul class="grid mt-l-xl" role="list" data-rows="masonry" data-layout="50-50">
  {% for episode in episodes %}
  <li class="card flow overflow-hidden">
    <h2>#{{ episode.title }}</h2>
    <p>{{ episode.description }}</p>

    {% if episode.link %}
      <a class="episode-link" href="{{ episode.link }}">{{ episode.linkDescription }}</a>
    {% endif %}

    {{episode.url}}

  </li>
  {% endfor %}
</ul>
