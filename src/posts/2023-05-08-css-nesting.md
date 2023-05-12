---
title: 'CSS Nesting'
description: 'For a while now, nesting in CSS required a preprocessor like Sass. Now it is built into the language natively.'
date: 2023-05-08
tags:
  - css
  - css nesting
  - chrome
---

As an avid [Sass](https://sass-lang.com/) user, I came to realise that it was mostly the nesting feature that drove me towards the preprocessor by default. You can now do CSS nesting natively with Chrome's latest stable version.

[Can i use - CSS Nesting](https://caniuse.com/css-nesting)

## Before nesting

```css
.not-nesting {
  color: crimson;
}

.not-nesting p {
  color: salmon;
}

.not-nesting span {
  color: steelblue;
}
```

### Heading

### Heading

#### Heading

## After nesting

```css
.nesting {
  color: crimson;

  p {
    color: salmon;
  }

  span {
    color: steelblue;
  }
}
```
