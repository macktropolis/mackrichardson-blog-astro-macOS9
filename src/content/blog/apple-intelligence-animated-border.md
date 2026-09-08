---
title: "Recreating Siri’s Animated Gradient Border Effect with CSS"
date: 2024-12-17
author: "Mack Richardson"
image:
  {
    src: "../../assets/blog/apple-intelligence-animated-border.jpg",
    alt: "Code",
  }
description: "Add an animated, colorful border to your UI for a futuristic touch!"
draft: false
category: "Coding"
tags: ["apple","apple intelligence","css","siri"]  # Add tags here
---

Apple’s release of Apple Intelligence brought some sleek and futuristic design elements. One standout visual is the animated gradient border effect seen in Siri’s interface. This effect creates a vibrant, colorful animation that draws the eye and provides a futuristic feel. In this post, we will replicate the effect using CSS with minimal HTML.

## What We're Building:

<p class="codepen" data-height="400" data-theme-id="light" data-default-tab="result" data-slug-hash="bNbgzPB" data-pen-title="Responsive Grid" data-user="macktropolis" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/macktropolis/pen/bNbgzPB">
  Responsive Grid</a> by Mack Richardson (<a href="https://codepen.io/macktropolis">@macktropolis</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

## 1. HTML Setup

To begin, here’s a clean and simple HTML structure for the card element. It will act as the container for our animated gradient border.

```html
<div class="grid-container">
  <div class="card">
    <h2>Lorem Ipsum</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod quis leo vitae condimentum. Vivamus malesuada dignissim dui sed suscipit.</p>
  </div>
</div>
```

### Key Notes:

- The card  `(.card)` will have the animated border effect applied.
- The `grid-container` centers the content horizontally and vertically using CSS `flex`.

## 2. Base CSS Setup

Before adding the magic gradient effect, we need a clean foundation with a dark background to make the animation pop. Here’s the basic styling for the `body`, `grid-container`, and `card`.

```css
body {
  background-color: #111111;
  color: #ffffff;
  font-family: sans-serif;
  font-size: 100%;
  margin: 0;
  padding: 0;
  text-align: center;
}

.grid-container {
  align-items: center;
  height: 100dvh;
  display: flex;
  justify-content: center;
  width: 100dvw;
}

.card {
  background-color: #222429;
  border-radius: 10px;
  box-shadow: 5px 5px 10px #000000;
  padding: 1rem;
  position: relative;
  max-width: 25ch;
}
```

## 3. The Animated Gradient Border Effect

Now for the fun part! We’ll use the following features to create the animated gradient border:

**Key Concepts:**

1. CSS conic-gradient: A gradient that spins around a central point.
2.	`::before` and `::after` pseudo-elements: Create two gradient layers, one for the glow and one for the sharp border.
3.	CSS Custom Properties `(--angle)`: Animate the gradient’s angle.
4.	`@property`: Enables smooth animation for custom properties.

Add the Animated Gradient

```css
/* Custom Property Declaration for Smooth Animation */
@property --angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

.card::after,
.card::before {
  --angle: 0deg; /* Custom Property for the conic-gradient's angle */
  content: '';
  position: absolute;
  height: 100%;
  width: 100%;
  background-image: conic-gradient(from var(--angle), #ff4545, #00ff99, #006aff, #ff0095, #ff4545);
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  border-radius: 10px;
  padding: 5px;
  z-index: -1;
  animation: 3s spin linear infinite;
}

/* Blurry Glow Effect */
.card::before {
  filter: blur(1.5rem);
  opacity: 0.5;
}

/* Gradient Spin Animation */
@keyframes spin {
  from {
    --angle: 0deg;
  }
  to {
    --angle: 360deg;
  }
}
```

## 4. How It Works

1.	`::before` and `::after` Pseudo-Elements:
	- These act as two gradient layers behind the `.card` element.
	- `::before` is the blurry glow layer (created with a blur filter).
	- `::after` is the sharp border layer.
2.	conic-gradient:
	- The gradient starts at `--angle` and spins in a circular motion.
	- Using colors like #ff4545, #00ff99, and #006aff, we achieve a multi-colored look similar to Siri’s animation.
3.	CSS `@property`:
	- The `@property` rule allows us to animate the `--angle` variable smoothly.
4.	Animation:
	- The spin animation increases `--angle` from 0deg to 360deg, creating the spinning effect.

## 5. Result

After applying all the styles, your card will display an animated gradient border effect similar to Siri’s glowing animation:

- A clean dark card sits in the center of the page.
- A vibrant gradient border spins continuously.
- A soft glow effect around the border enhances the visuals.

## Final Code

Here’s the full code for easy reference:

#### HTML:
```html
<div class="grid-container">
  <div class="card">
    <h2>Lorem Ipsum</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod quis leo vitae condimentum. Vivamus malesuada dignissim dui sed suscipit.</p>
  </div>
</div>
```
#### CSS:

```css
.grid-container {
  align-items: center;
  height: 100dvh;
  display: flex;
  justify-content: center;
  width: 100dvw;
}

.card {
  background-color: #222429;
  border-radius: 10px;
  box-shadow: 5px 5px 10px #000000;
  padding: 1rem;
  position: relative;
  max-width: 25ch;
}

@property --angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

.card::after,
.card::before {
  --angle: 0deg;
  content: '';
  position: absolute;
  height: 100%;
  width: 100%;
  background-image: conic-gradient(from var(--angle), #ff4545, #00ff99, #006aff, #ff0095, #ff4545);
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  border-radius: 10px;
  padding: 5px;
  z-index: -1;
  animation: 3s spin linear infinite;
}

.card::before {
  filter: blur(1.5rem);
  opacity: 0.5;
}

@keyframes spin {
  from {
    --angle: 0deg;
  }
  to {
    --angle: 360deg;
  }
}
```

## Conclusion

With just HTML and CSS, you can replicate Siri’s colorful, futuristic animated gradient border effect. This design technique uses modern CSS features like `conic-gradient` and `@property` to achieve smooth, visually stunning animations.

Add this effect to cards, buttons, or other UI components for a futuristic touch! 🚀

<style>
    :not(pre) code {
        display: inline !important;
    }
</style>