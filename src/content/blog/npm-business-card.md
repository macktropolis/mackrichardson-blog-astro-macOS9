---
title: "Making a Terminal Business Card with NPM 💼"
date: 2024-12-20
author: "Mack Richardson"
image:
  {
    src: "../../assets/blog/npm-business-card.jpg",
    alt: "A NPM business card in the terminal",
  }
description: "A super cool terminal business card to impress your friends and colleagues."
draft: false
category: "Coding"
tags: ["npm","terminal"]  # Add tags here
---

Let's build a business card for the *terminal*! Because, who doesn’t love faffin' around in the terminal? 😅 

The concept isn’t new. I came across the trend on [Chris Bonger's Daily Dev Tips](https://daily-dev-tips.com/posts/creating-a-business-card-for-the-terminal/), but the original concept goes back to [bitandbang](https://github.com/bnb/bitandbang). However, the idea is so cool that it’s worth sharing again.

Today, we’re going to take that idea and make it our own.

## What Are We Doing?  

We’re creating our very own **NPM business card** — a little command-line snippet that’s all about *you*. Let’s get started!

Here's what the business card will look like:

<img src="/assets/images/blog/npm-business-card.png" alt="A NPM business card in the terminal" class="no-fill" style="width: 100%;margin: 0 auto;">

## Step 1: Fork & Clone the Magic 🪄

First things first, head over to the [@bitandbang](https://github.com/bnb/bitandbang) repo and fork it. This is the base we’re working with, so no need to reinvent the wheel.

Once you’ve forked it:

1. Clone your fork to your local machine.
2. Crack it open in your favorite code editor.


## Step 2: Make It *Yours*

The magic happens in the `build.js` file. This is where you’ll customize the details to make the card all about you.  

Here’s what to do:

- Replace all the placeholder info (like name, socials, etc.) with your own details.  
- Add or remove lines or elements to share your relevent information.

Once you’re done, test it out locally:  

```
npm run dev
```

This will show you a preview of your custom card right in your terminal. How cool is that?

## Step 3: Publish Your Card 🚀

Happy with how it looks? Awesome! Time to share it with the world via NPM.  

### Update Your Package Info

Before publishing, open up the `package.json` file and tweak these fields:  

- **name**: Pick something unique—this will be your command.  
- **version**: Start with `1.0.0`.  
- **description**: A short blurb about your card.  
- **bin**: Update this with your chosen command.  
- **repo**: Add your repo URL.  
- **homepage**: Your site or project page.  
- **author**: That’s you!

### Publish It!

Run this command to push it to the NPM registry:  

```
npm publish
```

## Step 4: Show It Off 🎉
Now comes the fun part. 

Open a fresh terminal and run your new card command. In my case, it looks like this:  

```
npx macktropolis
```

**Boom!** Your super cool terminal business card is live and ready to impress. Share it with your friends, colleagues, or anyone who loves tech-y awesomeness.  

So, what are you waiting for? Go fork, customize, and show off your creativity! 🌟

<style>
    :not(pre) code {
        display: inline !important;
    }
</style>