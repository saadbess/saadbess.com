---
title: 'Native CSS Nesting'
description: "CSS nesting bestows the elegance of embedding one style directive within another, where the child selector is inherently relative to its parent's selector. Such sophisticated functionality was once the exclusive domain of CSS pre-processors."
date: 2023-07-23
toc: true
postId: 3
tags:
  - technical
  - css
  - css nesting
  - native css
  - front-end
---

CSS nesting bestows the elegance of embedding one style directive within another, where the child selector is inherently relative to its parent's selector. Such sophisticated functionality was once the exclusive domain of CSS pre-processors like Sass or LESS.

Let's dive deeper with some examples:

## Basic Nesting

```css
.container {
  background-color: salmon;

  .item {
    color: black;
  }
}
```

In this example, the child `.item` is nested inside the parent `.container`. This would be compiled down to:

```css
.container {
  background-color: salmon;
}
.container .item {
  color: black;
}
```

## Nesting with Ampersand "&"

The `&` character represents the parent selector when nesting, which can be particularly helpful when dealing with pseudo-classes or modifiers.

```css
.button {
  padding: 10px 20px;
  background-color: steelblue;

  &:hover {
    background-color: coral;
  }

  &--primary {
    background-color: cyan;
  }
}
```

Compiled to:

```css
.button {
  padding: 10px 20px;
  background-color: steelblue;
}
.button:hover {
  background-color: coral;
}
.button--primary {
  background-color: cyan;
}
```

## Deep Nesting

CSS styles may be nestled multiple levels deep too.

```css
.container {
  .header {
    color: steelblue;

    .logo {
      width: 80px;

      &:hover {
        opacity: 0.5;
      }
    }
  }
}
```

This compiles to:

```css
.container .header {
  color: steelblue;
}
.container .header .logo {
  width: 80px;
}
.container .header .logo:hover {
  opacity: 0.5;
}
```

## Nesting Media Queries

Nest media queries within selectors to create more contextualised breakpoints.

```css
.banner {
  width: 100%;

  @media (min-width: 768px) {
    width: 50%;
  }
}
```

This compiles to:

```css
.banner {
  width: 100%;
}
@media (min-width: 768px) {
  .banner {
    width: 50%;
  }
}
```

## Pseudo-elements

```css
div {
  position: relative;

  &::before {
    content: "";
    width: 100%;
    height: 2px;
    position: absolute;
    top: 0;
    left: 0;
    background-color: cyan;
  }
}
```

This compiles to:

```css
div {
  position: relative;
}

div::before {
  content: "";
  width: 100%;
  height: 2px;
  position: absolute;
  top: 0;
  left: 0;
  background-color: cyan;
}
```

<hr>

## Why should you use CSS nesting over preprocessors?

CSS nesting when natively supported by browsers provides a natural way of expressing styles that mirror the DOM hierarchy without using external tools or preprocessors like Sass or Less. Although preprocessors offer many powerful features, native CSS nesting provides several distinct advantages:

### No Compilation Needed

Unlike Sass and Less, which require you to compile styles into CSS before deploying, native CSS nesting does not necessitate an additional step before deployment.

### Simplify Development Toolchain

By employing native CSS features, you can streamline your development toolchain. This could involve fewer dependencies, less build steps and potentially faster build times.

### Uniformity

With native CSS nesting, all browsers supporting it interpret it consistently while with preprocessors there may be slight variations or updates needed in how nesting is handled.

### Performance

Though this might not make a substantial difference, skipping compilation could remove one potential bottleneck in your development workflow.

### Learning Curve

For those just getting into front-end development, native CSS may be easier to grasp than preprocessors with all their additional features.

### Future-Proof

As CSS evolves, more features once exclusive to preprocessors may find their way into the standard. By opting for native implementations instead, you're positioning yourself to stay current with future CSS developments.

### Preprocessors offer several advantages over native CSS nesting

Preprocessors offer mixins, functions and variables (though CSS now provides native variables). Furthermore, preprocessors often include more advanced nesting features like parent selectors, interpolation and more.

## Things to consider when nesting

### Native nesting differs slightly from preprocessors

Front-end artisans typically rely on preprocessors like Sass or LESS to meet their nesting requirements; however, with native nesting becoming the standard approach it's imperative that any styles applied post-nesting will not be considered relevant. For example:

```css
header {
  & article {
    background-color: cyan;
  }
  font-size: 1.2rem;
}
```

In this instance, the `font-size` property will be overlooked due to its placement after nesting. While such an arrangement might be permissible in Sass or LESS, within the realm of native CSS nesting, it's advisable to apply non-nested styles prior to the nesting directive.

### Specificity

Specificity in CSS represents an intricate set of rules governing the application of styles to elements. When multiple selectors compete for one element, the one with superior specificity usually prevails; an example can be seen below:

```css
#level-1-heading {
 color: crimson;
}

.level-1-heading {
 color: steelblue;
}

h1 {
 color: cyan;
}
```

CSS styles cascade elegantly, suggesting that typically, the final selector listed in a stylesheet (`h1`) would take precedence. But instead, due to the weight carried by its ID selector (`#level-1-heading`), `h1` element appears as `crimson` due to specificity hierarchy.

Attention to specificity must be paid during nesting; failing to do so could quickly turn into an endless series of styles colliding and eventually overriding each other.

### Avoid over-nesting

Nesting is great and has made it easy for developers to write more elequent, easily readiable and reusable CSS. However, due to this luxery, one might feel tempted to get carried away. Let's take a look at a very bad nesting example:

```css
header {
 & article {
  font-size: 1.2rem;

  & h3 {
   background-color: cyan;
   & .spanned-word {
    font-size: 1rem;
    & .link {
     color: steelblue;
      & :hover {
       color: salmon;
      }
    }
   }
  }
 }
}
```

This ridiculous CSS block complies to:

```css
header article {
  font-size: 1.2rem;
}

header article h3 {
  background-color: cyan;
}

header article h3 .spanned-word {
  font-size: 1rem;
}

header article h3 .spanned-word .link {
  color: steelblue;
}

header article h3 .spanned-word .link:hover {
  color: salmon;
}
```

Evidently, this selector poses challenges when trying to reconcile styles. For the sake of elegance and functionality, it would be prudent to limit nested styles to three levels deep and thus protect yourself from potential specificity dilemmas.

### Support

CSS nesting has seen widespread adoption and modern browsers handle it seamlessly; for more details please see [Support for CSS nesting on caniuse.com](https://caniuse.com/css-nesting).

## Conclusion

As previously discussed, choosing between native CSS nesting and preprocessors depends on both project requirements and team preferences. If nesting is your sole concern and keeping toolchain simple is your top priority, native CSS nesting could be an ideal option; but for advanced styling features like drop shadows a preprocessor is likely still the superior choice. Choose the tool for the need, not the tool for the want.
