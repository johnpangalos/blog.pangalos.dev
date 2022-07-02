---
author: "John Pangalos"
title: "looking.svelte"
date: "2021-05-02"
description: "I am a lazy and distracted person... Speaking of, this is another post about the history of web-dev and why the JavaScript framework Svelte is interesting."
tags: ["web-dev", "svelte"]
categories: ["game-development"]
---

<script context="module">
  import Tooltip from "../../components/Tooltip.svelte";
  import Link from "../../components/Link.svelte";
  import NerdAlert from "../../components/NerdAlert.svelte";
  let facebookRant1 = `
Facebook, FACEBOOK! Don't get me started on Facebook.
You got ten hours. Good. Wait how long should these tooltips be?
Doesn't matter it's tirade time! Come all and listen to this incredible
build up that I'm creating. You ready? Okay, here goes. Facebook sucks!
Nailed it.`
  let facebookRant2=`
INSTAGRAM IS FACEBOOK! Wake up people! Facebook bought Instagram and
now they own your soul! Also Facebook is faked the moon landing and
shot JFK from the grassy knoll. Mark Zuckerberg is Luke Skywalkers'
real father and mother. Don't be fooled!`
  let facebookRant3 = `Holy Mother of God! We can't get away from them, they're god damn everywhere. Noooooo!!!`
</script>

# looking.svelte

So when I started this blog I promised myself that I would write at least one
blog entry a month, and I have already failed. I blame the month of April, did
you know it only has 30 days? I was planning on writing the article on April
31st, but there was no April 31st... Why didn't this article come out on May 1st
you might ask? I was busy okay, I haven't replied to my Whatsapp messages in
weeks because I've been busy working on this:

<div class="text-center">
  <Tooltip>
    <span slot="main">Hover/Touch me!</span>
    <span slot="hover">Wow cool!</span>
  </Tooltip>
</div>

<p>
Pretty good 
<Tooltip>
<span slot="main">right?</span>
<span slot="hover">Right???</span>
</Tooltip>
Anyway, I am writing this article to talk about
<Tooltip>
<span slot="main">Svelte.</span>
<span slot="hover">Svelte in Swedish means starving, isn't language is neat!</span>
</Tooltip>
No not the thing you call an older man with salt and pepper chest hair who right
before he is about to dive into an infinity pool has a heart attack making you
realize you could die at any second and that you've wasted your life writing a
stupid blog that no one reads and that you never finished that video game you
planned to make...
</p>

But I digress.

<Link to="https://svelte.dev">Svelte</Link> is a web frontend
framework made by this guy that works at
<Tooltip><span slot="main"><i>The New York Times</i></span><span slot="hover"><i><b>The</b> The New York Times</i></span></Tooltip>
that revolutionized websites as we know it. Well not really, but it is pretty
cool. And in order to understand why Svelte is cool we need to understand a
little bit of the history of frontend web development.

<NerdAlert />

## a.<wbr>brief.<wbr>history.<wbr>of.<wbr>web.<wbr>development

A long time ago in the year 1995, the JavaScript language was born. It was
quickly <Link to="https://dev.to/theoutlander/oracle-owns-the-trademark-to-javascript-1fil">bought by some company</Link>
and they trademarked the name so no one can use it without
paying. JavaScript was then renamed to <Link to="https://en.wikipedia.org/wiki/ECMAScript">ECMAScript</Link>,
but no one could remember that so people just kept calling it JavaScript.

<p>
Fast forward a few years, it's 2006. The world has just been introduced to
<Tooltip>
<span slot="hover">{facebookRant1}</span>
<span slot="main">Facebook.</span>
</Tooltip>
<Link to="https://jquery.com">jQuery</Link> has just hit the scene
and web developers rejoiced because they could now do what they only dreamed.
They could now easily select any part of a web page. And thusly started making
overcomplicated websites to show off pictures of their cats.
</p>

<p>
It's a few years later, it's 2010 and 
<Tooltip>
<span slot="hover">{facebookRant2}</span>
<span slot="main">Instagram</span>
</Tooltip>
is released onto the world. Also a little JavaScript library named
<Link to="https://backbonejs.org/" >Backbone JS</Link> was released and
web developers rejoiced because they could now do what they only dreamed. They
could have their data stored in the browser and reference it in an easy way.
This, in turn, allowed them to make and maintain more complex websites more
easily. And thusly allowed them to make super overcomplicated poorly performing
websites that were as buggy as they were useful and filled with cats.
</p>

<p>
And before you could
<Tooltip>
<span slot="hover">Don't close your eyes for three years!</span>
<span slot="main">blink it's 2013</span>
</Tooltip>,
Edward Snowden reveals that Facebook is not the only people watching your every
move. And a little JavaScript library called <Link to="https://reactjs.org/">React</Link>, made by a little
company called
<Tooltip>
<span slot="hover">{facebookRant3}</span>
<span slot="main">Facebook</span>
</Tooltip>,
was released onto the world and web developers rejoiced because they could now
do what they only dreamed. This library had reimplemented how the browser
manages parts of a web page and called it the Virtual DOM so that developers
could have better control over what shows up and when. This allowed developers
to create gigantic websites filled with cats, that worked pretty well until
there were too many cats on the web page.
</p>

## back.to.basics

<p>
This history leaves _a lot_ of things out. There are a so many more JavaScript
Libraries out there that if I were go through them all it would take me
until
<Tooltip>
<span slot="hover">Thankfully climate change will cut that short.</span>
<span slot="main">the end of time.</span>
</Tooltip>
But the one I will talk about for a bit is Svelte. What is special about Svelte
you may ask? Well nothing really. What it does is create a framework on top of
JavaScript that helps developers manage what elements show up on a web page. In
that way it's a lot like React. Where it differs from React is the Virtual DOM.
Svelte doesn't use one, so you can display you gigantic <Link to="https://cats.pangalos.dev">list of cats</Link> without
fear.
</p>

<p>
If you're thinking
<Tooltip>
<span slot="hover">Thanks! I like your attitude.</span>
<span slot="main">that sounds good John,</span>
</Tooltip>
that sounds pretty different. Well there are already a number of other similar
libraries out there that do exactly the same thing. And some would argue that
you don't need any JavaScript Libraries at all.
</p>

## conclusion

<p>
What have we learned. We learned that web development, has gone through a lot of
changes over the years. Also that web developers seem to have a lot of time on
their hands to write a bunch of
<Tooltip>
<span slot="hover">This blog for example.</span>
<span slot="main">stuff nobody needs</span>
</Tooltip>. And that Facebook is an<Tooltip>
<span slot="hover">Facebook locked people out of devices they already owned if they didn't have a Facebook account.</span>
<span slot="main">

<Link to="https://www.oculus.com/blog/a-single-way-to-log-into-oculus-and-unlock-social-features/">evil</Link>
</span>
</Tooltip>
company full of
<Tooltip>
<span slot="hover">Facebook helps pharamceutical companies track and show ads to sick people.</span>
<span slot="main">
<Link to="https://themarkup.org/citizen-browser/2021/05/06/how-big-pharma-finds-sick-users-on-facebook">evil</Link>
</span>
</Tooltip>
people doing
<Tooltip>
<span slot="hover">Facebook paid people to install spyware on their phones.</span>
<span slot="main">
<Link to="https://techcrunch.com/2019/01/29/facebook-project-atlas">evil</Link>
</span>
</Tooltip>
things. Now if you'll excuse me, I've got some
<Tooltip>
<span slot="hover">Nooooooooo! Facebook owns Whatsapp too!</span>
<span slot="main">
<Link to="https://arstechnica.com/tech-policy/2021/01/whatsapp-users-must-share-their-data-with-facebook-or-stop-using-the-app/">Whatsapp</Link>
</span>
</Tooltip>
messages to reply to.
</p>
