---
author: "John Pangalos"
title: "the.remaking.of"
date: "July 8, 2022"
description: "Wait how long has it been since I posted? A year?! Better bring out the oldest trick in the book, a remake! How I remade this blog. This post includes a bit of information on SSR frameworks and SvelteKit: An SSR framework that from the maker of svelte."
tags: ["blogging", "ssg", "css"]
categories: ["web"]
---

<script context="module">
  import Link from "../../components/Link.svelte";
  import Tooltip from "../../components/Tooltip.svelte";
  import NerdAlert from "../../components/NerdAlert.svelte";
</script>

# the.remaking.of

<p>
  Wow, it's been a while since I posted, hold on let me just check how long...
  IT'S BEEN OVER A YEAR?! I guess time flies when you're not writing a blog.
  Well I have a very good reason I haven't posted in so long, <Tooltip
    ><span slot="main">I'M OUT OF IDEAS!</span><span slot="hover"
      >Oh and I'm out of toliet paper, I should go get some when I'm out picking
      up some ideas.</span
    ></Tooltip
  > Time to do the oldest trick in the book... REMAKE!
</p>

<p>
  Remakes are all the rage these days.
  <Link to="https://en.wikipedia.org/wiki/The_Lion_King_(2019_film)"
    >The Lion King</Link
  >
  was remade in 2019. GhostBusters was remade in 2016 and then rebooted in 2021.
  Even The Lake House was a remake, yes the movie where Keanu Reeves and Sandra Bullock
  send love letters through time was actually a remake of a Korean movie made in
  2000 called 
  <Tooltip>
  <span slot="main">Il Mare.</span>
  <span slot="hover">
    Why does the Korean movie have an Italian name? Who cares! With a plot this good
    they could have called it Puddle Shack, have it star Nick Cage and Adam Sandler in
    wig and have it be directed by M. Night Shamawhatever and it would still make a million dollars...
    Wait, is that alot? Doesn't matter, they did it for the art.
  </span>
  </Tooltip> Let's watch the trailer for that shall we.
</p>

<div class="flex justify-center aspect-video">
  <iframe class="w-full" src="https://www.youtube.com/embed/V02lqEpbk2Y" title="The Lake House (2006) | Movie Trailer | Sandra Bullock, Keanu Reeves" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

<p>
  <Tooltip>
    <span slot="main">Surely a love story for the ages.</span>
    <span slot="hover">Why did I decide to put on mascara before I watched the trailer...</span>
  </Tooltip>
  Well if the it works for The Lake House, it will work for me too. The only question now is
  what's my gimmick?
</p>

## list.of.gimmicks

1. Replace me with someone younger and better looking.
1. <Tooltip>
     <span slot="main">Rewrite the same articles, but in Korean.</span>
     <span slot="hover">A reverse Lake House!</span>
   </Tooltip>
1. <Tooltip>
     <span slot="main">Replace me with someone who is Female</span>
     <span slot="hover">This would really piss off Reddit, Extra points!</span>
   </Tooltip>
1. Cast people as my children who continue my legacy of writing articles about trivial
   things that no one reads.
1. Replace me with a dog, <Tooltip>
   <span slot="main">people like dogs.</span>
   <span slot="hover">Woof!</span>
   </Tooltip>
1. Start writing in an accent.

## still.starving

<p>
In the end I decided to try using
<Tooltip>
  <span slot="main">Svelte,</span>
  <span slot="hover">Still means starving, still super cool!</span>
</Tooltip>
something I've gushed at length about <Link to="/blog/looking-svelte">before.</Link>
Specifically I decided to use an SSR framework powered by Svelte called SvelteKit.
That statement might leave you with a few questions, like:
</p>

- What's an SSR framework?
- Why does "tech" have so many "achronyms"?
- "WHY" "DON'T" "PEOPLE" "USE" "MORE" "QUOTATION" "MARKS"?

<p>
First off, calm down. We all love quotation marks, but we should do everything in moderation.
You wouldn't eat too much ice cream
<Tooltip>
  <span slot="main">would you?</span>
  <span slot="hover">My stomach hurts.</span>
</Tooltip>
Second, you have to learn yet <i>another</i> achronym.
</p>

<NerdAlert />

## ¡please.no.more.achronyms!

<p>
Achronyms are just like scoops of ice cream, 
<Tooltip>
  <span slot="main">one more wont hurt!</span>
  <span slot="hover">Why?! No more, I'm gonna vommit!</span>
</Tooltip>
The new way technology that my blog uses is called SSR, but before we try and understand that
we'll have to understand a bit about how websites work.
</p>

<p>
Let's say you're an
<Tooltip>
  <span slot="main">intrepid young-ish blogger</span>
  <span slot="hover">Somewhere between 30 and 80 years old.</span>
</Tooltip>
and you wanted to make a blog from scratch, what are your options. The main options you'd have to choose from are these:
</p>

<ul>
  <li>
    <b>Client side rendering:</b> This is where your web browser takes code from 
    a computer on the internet and generates a website before your very eyes.</li>
  <li>
    <b>Server side rendering:</b> SSR for those of you that like achronyms,
    this is where your website is generated on a computer
      <Tooltip>
        <span slot="main">somewhere on the internet</span>
        <span slot="hover">Ahhh! The internet is <i>scary!</i> It's where memes and Elon Musk's twitter account live!</span>
      </Tooltip>
    and then sent to your browser.
  </li>
  <li>
    <b>Static site generation:</b> <Link to="/blog/the-making-of">Which I wrote another blog entry about,</Link>
    is where all the pages on a site are pre-generated and just sent from a computer on the internet to your browser.
  </li>
  <li>
    <Tooltip>
      <span slot="main">Ask someone younger for help</span>
      <span slot="hover">While you're at it, might as well ask them how to log into your email. Don't forget to forget your password!</span>
    </Tooltip>
  </li>
</ul>

<p>
Some of you may be thinking, why would I ever <Tooltip>
<span slot="main"><i>not</i> pre-generate all of my site,</span>
<span slot="hover">And why don't I just wear a bathing suit as underwear?</span>
</Tooltip>
it sounds faster.
Well you're right, it certainly would be faster to not have to generate a page
when a user asks for it.
</p>
