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
  <iframe class="w-full" height="378px" src="https://www.youtube.com/embed/V02lqEpbk2Y" title="The Lake House (2006) | Movie Trailer | Sandra Bullock, Keanu Reeves" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
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
Second, you have to learn
<Tooltip>
  <span slot="main">yet <i>another</i> achronym.</span>
  <span slot="hover">Oh god no, not another achronym!</span>
</Tooltip>
</p>

<NerdAlert />

<p>
Achronyms are just like scoops of ice cream, 
<Tooltip>
  <span slot="main">one more wont hurt!</span>
  <span slot="hover">Why?! No more, I'm gonna vommit!</span>
</Tooltip>
The new way technology that my blog uses is called SSR, but before we try and 
understand that we'll have to understand a bit about how websites work.
</p>

## ¿what.is.a.website?

<p>
You ever hear of a little something called 
<Tooltip>
  <span slot="main">"the internet"?</span>
  <span slot="hover">
    Gah! No more quotes, not even for sarcasm. Give the reader some credit!
  </span>
</Tooltip>
Well the internet in simplest terms is a way to access files on computers that 
aren't yours. If you want to see watch
<Link to="https://www.youtube.com/c/unboxtherapy">a person open boxes,</Link> 
<Link to="https://bookriot.com/harry-potter-erotica/">
  read some Harry Potter fanfiction erotica,
 </Link>
<Link to="https://cats.pangalos.dev">or look at some cat pictures from some weirdo</Link>
the internet has it all. And what these all are in reality are a way for you to
get files from computers somewhere out there in the world, be it text, pictures
or videos.
</p>

<p>
But not every computer can be accessed by the internet, you have to open the
<Tooltip>
  <span slot="main">door to the internet.</span>
  <span slot="hover">
    It's like the door to hell, if hell was filled with annoying jerks who do
    things like harass women on Twitter, and Instagram, and Facebook, and Reddit
    and... oh my god, the internet sucks.
  </span>
</Tooltip>
This is not something that happens with normal computers, instead programmers
use special computers called <i>servers</i>. A <i>server</i> is just sort of
waits around for someone on the internet to request a file and then 
<Tooltip>
  <span slot="main"><i>"serves"</i></span>
  <span slot="hover">
    Why did I do that? You had to have understood the connection there, right?
    RIGHT?!... I think I have a problem.
  </span>
</Tooltip>
the file to the person who requested the file.
</p>

<p>
But you don't just look at files on the websites, websites can be look cool 
and extremly interactive. That's where you're web browser comes in. Your web
browser downloads some files, interprets them and then displays a website.
</p>

## okay.so.what's.the.achronym

<p>
Okay now that we understand the internet and browsers, let's try a hypothetical. Let's say
you're an
<Tooltip>
  <span slot="main">intrepid young-ish blogger</span>
  <span slot="hover">Somewhere between 30 and 80 years old.</span>
</Tooltip>
and you wanted to make a blog from scratch, what are your options. The main options you'd have to choose from are these:
</p>

<ul>
  <li>
    <b>Client side rendering:</b> This is where your web browser takes code from
    a server the internet and generates a website before your very eyes.
  </li>
  <li>
    <b>Server side rendering:</b> SSR for those of you that like achronyms,
    this is where your website is generated on server and then sent to your
    browser.
  </li>
  <li>
    <b>Static site generation:</b>
    <Link to="/blog/the-making-of">
      Which I wrote another blog entry about,
    </Link>
    is where all the pages on a website are pre-generated and just sent from a 
    server to your web browser.
  </li>
  <li>
    <Tooltip>
      <span slot="main">Ask someone younger for help</span>
      <span slot="hover">
        While you're at it, might as well ask them how to log into your email. 
        Don't forget to forget your password!
      </span>
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
when a user asks for it. It is in fact how I originally made my blog, but there
was only one issue with that... dark mode.
</p>

## drink.8.glasses.of.water.a.day

So what was the issue with my beloved dark mode on my old website? Well if you
were to go to my old website and turn on dark mode and reloaded the page what
would you see?

<video height="403.52px" src="/see.mp4" controls>
  <track kind="captions">
  Your browser does not support the video tag.
</video>

Did you see it? Dear god, the horror! What was happening there to cause that
aweful flicker? Well for this we're going to need some arrows.

The order of how the website appears in dark mode in my old website happens
like this:

<div class="flex flex-col font-bold font-mono text-center">
  <div>
  Broswer asks for file from server
  </div>
  <div>
  &darr;
  </div>
  <div>
  Server sends file Browser 
  </div>
  <div>
  &darr; 
  </div>
  <div>
  Website appears in light mode
  </div>
  <div>
  &darr; 
  </div>
  <div>
  Website appears in dark mode 
  </div>
</div>

<p>
So what's the issue here? The issue is that the website is showing up before
we have the neccessary to show the page in dark mode. So instead of going
directly to dark mode, we end up having to use this 
<Tooltip>
  <span slot="main">in-between state.</span>
  <span slot="hover">
    It's like whatever is between the Pokémon Squirtle and Blastoise, I don't
    know and I don't want to know... Seriously don't tell me, I will be
    physically and purposefully ill.
  </span>
</Tooltip>
</p>

How do we fix this egregious error? One way is to know what mode your in before
you send the files from the server to the browser, like some sort of computer
Nostradamus. And how do we know this?

## c.is.for."tracking".cookie

<p>
What I use to make dark mode work in this website is the  
<Link to="https://truthinadvertising.org/articles/facebooks-tracking-cookies/">
  same technology that Facebook uses to track all of your internet browsing,
</Link>
and it's called a cookie. What is a cookie you might ask? It's just a bit of
text that is saved in you browser and is mostly used to communicate with servers
to let them know you're logged in, and in this website's case it's used to save
if you're using dark mode. Our new arrow diagram looks like this:
</p>

<div class="flex flex-col font-bold font-mono text-center">
  <div>
  Broswer asks for file from server with cookie
  </div>
  <div>
  &darr;
  </div>
  <div>
  Server reads cookie 
  </div>
  <div>
  &darr; 
  </div>
  <div>
  Server sends file Browser 
  </div>
  <div>
  &darr; 
  </div>
  <div>
  Website appears in dark mode 
  </div>
</div>

<p>
And voila, we our problem with having light mode show up on refresh is gone, and
it only took over a year to make! Well
<Tooltip>
  <span slot="main">at least we learned something.</span>
  <span slot="hover">
    Oh my god, a Squirtle evolves into a Wartortle? Why not Warturtle? It sounds like
    the way a walrus walks into battle. What a terrible name! If you'll excuse me
    I need to be purposefully sick now...
  </span>
</Tooltip>
</p>
