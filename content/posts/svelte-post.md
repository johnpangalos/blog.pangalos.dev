+++
author = "John Pangalos"
title = "looking.svelte"
date = "2021-05-02"
description = ""
tags = [ "web-dev", "svelte" ]
categories = [ "game-development" ]
+++

So when I started this blog I promised myself that I would write at least one
blog entry a month, and I have already failed. I blame the month of April, did
you know it only has 30 days? I was planning on writing the article on April
31st, but there was no April 31st... Why didn't this article come out on May 1st
you might ask? I was busy okay, I haven't replied to my Whatsapp messages in
weeks because I've been busy working on this:

<div class="flex items-center justify-center">
    <span data-tippy-content="Wow cool!" class="tooltip">Hover/Touch me!</span>
</div>

Pretty good <span class="tooltip" data-tippy-content="Right???">right?</span>
Anyway, I am writing this article to talk about
<span class="tooltip" data-tippy-content="Svelte in Swedish means starving, isn't language is neat!">Svelte.</span>
No not the thing you call an older man with salt and pepper chest hair who right
before he is about to dive into an infinity pool has a heart attack making you
realize you could die at any second and that you've wasted your life writing a
stupid blog that no one reads and that you never finished that video game you
planned to make...

But I digress.

<a href="https://svelte.dev" target="_blank">Svelte</a> is a web frontend
framework made by this guy that works at <span class="tooltip"
data-tippy-content="<i>The</i> The New York Times">The&nbsp;New&nbsp;York&nbsp;Times</span>
that revolutionized websites as we know it. Well not really, but it is pretty
cool. And in order to understand why Svelte is cool we need to understand a
little bit of the history of frontend web development.

<div class="flex items-center w-full justify-center">
<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-700 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
</svg>
<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-700 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
</svg>
<div class="px-2 text-xl font-medium">NERD ALERT</div>
<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-700 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
</svg>
<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-700 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
</svg>
</div>

## a.brief.history.of.web.development

A long time ago in the year 1995, the JavaScript language was born. It was
quickly
<a href="https://dev.to/theoutlander/oracle-owns-the-trademark-to-javascript-1fil" target="_blank">bought
by some company</a> and they trademarked the name so no one can use it without
paying. JavaScript was then renamed to
<a href="https://en.wikipedia.org/wiki/ECMAScript" target="_blank">ECMAScript</a>,
but no one could remember that so people just kept calling it JavaScript.

Fast forward a few years, it's 2006. The world has just been introduced to
<span data-tippy-content="Facebook, FACEBOOK! Don't get me started on Facebook. You got ten hours. Good. Wait how long should these tooltips be? Doesn't matter it's tirade time! Come all and listen to this incredible build up that I'm creating. You ready? Okay, here goes. Facebook sucks! Nailed it." class="tooltip">Facebook.</span>
<a href="https://jquery.com" target="_blank">jQuery</a> has just hit the scene
and web developers rejoiced because they could now do what they only dreamed.
They could now easily select any part of a web page. And thusly started making
overcomplicated websites to show off pictures of their cats.

It's a few years later, it's 2010 and
<span data-tippy-content="INSTAGRAM IS FACEBOOK! Wake up people! Facebook bought Instagram and now they own your soul! Also Facebook is faked the moon landing and shot JFK from the grassy knoll. Mark Zuckerberg is Luke Skywalkers' real father and mother. Don't be fooled!" class="tooltip">Instagram</span>
is released onto the world. Also a little JavaScript library named <a
href="https://backbonejs.org/" target="_blank">Backbone JS</a> was released and
web developers rejoiced because they could now do what they only dreamed. They
could have their data stored in the browser and reference it in an easy way.
This, in turn, allowed them to make and maintain more complex websites more
easily. And thusly allowed them to make super overcomplicated poorly performing
websites that were as buggy as they were useful and filled with cats.

And before you could
<span data-tippy-content="Don't close your eyes for three years!" class="tooltip">blink&nbsp;it's&nbsp;2013,</span>
Edward Snowden reveals that Facebook is not the only people watching your every
move. And a little JavaScript library called
<a href="https://reactjs.org/" target="_blank">React</a>, made by a little
company called
<span data-tippy-content="Holy Mother of God! We can't get away from them, they're god damn everywhere. Noooooo!!!" class="tooltip">Facebook,</span>
was released onto the world and web developers rejoiced because they could now
do what they only dreamed. This library had reimplemented how the browser
manages parts of a web page and called it the Virtual DOM so that developers
could have better control over what shows up and when. This allowed developers
to create gigantic websites filled with cats, that worked pretty well until
there were too many cats on the web page.

## back.to.basics

This history leaves _a lot_ of things out. There are a so many more JavaScript
Libraries out there that if I were go through them all it would take me until
<span class="tooltip" data-tippy-content="Thankfully climate change will cut that short.">the&nbsp;end&nbsp;of&nbsp;time.</span>
But the one I will talk about for a bit is Svelte. What is special about Svelte
you may ask? Well nothing really. What it does is create a framework on top of
JavaScript that helps developers manage what elements show up on a web page. In
that way it's a lot like React. Where it differs from React is the Virtual DOM.
Svelte doesn't use one, so you can display you gigantic
<a href="https://cats.pangalos.dev" target="_blank">list of cats</a> without
fear.

If you're thinking
<span class="tooltip" data-tippy-content="Thanks! I like your attitude.">that&nbsp;sounds&nbsp;good&nbsp;John,</span>
that sounds pretty different. Well there are already a number of other similar
libraries out there that do exactly the same thing. And some would argue that
you don't need any JavaScript Libraries at all.

## conclusion

What have we learned. We learned that web development, has gone through a lot of
changes over the years. Also that web developers seem to have a lot of time on
their hands to write a bunch of
<span class="tooltip" data-tippy-content="This blog for example.">stuff&nbsp;nobody&nbsp;needs</span>.
And that Facebook is an
<span class="tooltip" data-tippy-content="Facebook locked people out of devices they already owned if they didn't have a Facebook account."><a href="https://www.oculus.com/blog/a-single-way-to-log-into-oculus-and-unlock-social-features/" target="_blank">evil</a></span>
company full of
<span class="tooltip" data-tippy-content="Facebook helps pharamceutical companies track and show ads to sick people."><a href='https://themarkup.org/citizen-browser/2021/05/06/how-big-pharma-finds-sick-users-on-facebook' target="_blank">evil</a></span>
people doing
<span class="tooltip" data-tippy-content="Facebook paid people to install spyware on their phones."><a href="https://techcrunch.com/2019/01/29/facebook-project-atlas" target="_blank">evil</a></span>
things. Now if you'll excuse me, I've got some
<span class="tooltip" data-tippy-content="Nooooooooo! Facebook owns Whatsapp too!"><a href="https://arstechnica.com/tech-policy/2021/01/whatsapp-users-must-share-their-data-with-facebook-or-stop-using-the-app/" target="_blank">Whatsapp</a></span>
messages to reply to.
