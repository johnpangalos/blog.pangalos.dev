---
author: "John Pangalos"
title: "the.making.of"
date: "March 3, 2021"
description: "How I made this blog. This goes through the wonders of JAM stack and this blog's choices of technology. Includes info on Hugo, Gastby and the greatest search engine of them all... Bing!"
tags: ["blogging", "ssg", "css"]
categories: ["web"]
---

<script context="module">
  throw new Error("@migration task: Check code was safely removed (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292722)");

  // import Link from "../../../components/Link.svelte";
  // import FootnoteAnchor from "../../../components/FootnoteAnchor.svelte"
  // import FootnoteLink from "../../../components/FootnoteLink.svelte"
</script>

# the.making.of

<p>
Blogs! Everybody loves them! They're filled with top ten lists and rants about
obscure topics. This blog post falls into the category of the latter. I recently
decided to create a video game and was advised to make a blog of my experiences
as to keep me motivated. While I am unsure that having me do more work will keep
me motivated, I am sure that I like distractions so I decided to take on writing
a blog.
</p>

<p>
Speaking of, let's get distracted from this post with a top ten list of the best
distractions.
</p>

## top.ten.best.distractions

1. Shiny things
2. Candy crush
3. Family and friends
4. Something is on fire
5. You're on fire
6. Love
7. Dessert
8. Celebrity prank shows
9. <Link to="https://www.reddit.com/r/Awww/">Awww! Subreddit</Link>
   (SO CUTE!!!)
10. Blogging

## what.was.i.talking.about?

<p>
Oh yeah, creating a blog is easy. I've done it several times with several
different technologies. Making a blog should be a walk in the park. I planned to
be done within a couple hours. So first things first, decide what framework to
use. After Binging 'SSG' or static site generator (THAT'S RIGHT I USE BING) I
found
<Link to="https://www.military-ranks.org/army/staff-sergeant">this.</Link>
</p>

<p>
STUPID BING!
</p>

<p>
I switched search terms to 'static site generators' and found
<Link to="https://jamstack.org/generators/">this.</Link>
</p>

<p>
HOLY CRAP! Three hundred twenty two different SSGs! I can't even decide what to
eat for breakfast. So I decided to go with the devil I know and use
<Link to="https://www.gatsbyjs.com/">Gatsby.</Link> I had already
setup a blog for my sister using Gatsby (it's unreleased so I'm not linking it
here), so I figured why not give it a shot.
</p>

<p>
Full disclosure, there was going to be a rant here about how slow Gatsby was and
I was going to say something witty about that mediocre Baz Luhrmann movie of the
same name<FootnoteLink number={1} /> but yesterday Gatsby came out with an update that
makes it significantly faster so now I have nothing to complain about. Are you
happy now JavaScript? Even still, I went with
<Link to="https://gohugo.io/">Hugo.</Link>
</p>

## hugo.a.go.go

<p>
So once I understood how the templating system works, or rather more accurately
a fair bit of coping from
<Link to="https://github.com/nodejh/hugo-theme-mini">this theme,</Link> I was ready to go. My only problem? I forgot how annoying it is to
actually write CSS. So I decided to add
<Link to="https://tailwindcss.com/">tailwindcss</Link> through the
JavaScript ecosystem (Are you happy _now_ JavaScript?) along with the
tailwindcss
<Link to="https://github.com/tailwindlabs/tailwindcss-typography">typography plugin.</Link> For those of you who aren't familiar with tailwindcss and utility
first CSS frameworks please read
<Link to="https://tailwindcss.com/docs/utility-first">this.</Link>
</p>

## a.dark.wind.cometh

<p>
The most important thing a blog needs is dark mode and luckily for me
tailwindcss, as of version 2, has this. But unfortunately for me the tailwindcss
typography plugin does not. So in dark mode all my blog posts started out having
black text on a black background. While this is extremely
metal<FootnoteLink number={2} /> it's not exactly user friendly.
</p>

<p>
At first I tried just hacking it using a tailwind function called apply.
</p>

<!-- prettier-ignore -->
```css
.prose h1, h2, h3, h4, h5, h6, a {
  @apply dark:text-white
}
```

<p>
Though this worked it felt wrong, and had a few issues. For one, it didn't fix
all the cases that I needed. Some specific cases could not easily be overwritten
due to CSS precedence. Secondly, the whole point of this was to _not_ write CSS.
</p>

<p>
After a quick search in the issues on Github I found
<Link to="https://github.com/tailwindlabs/tailwindcss-typography/issues/69#issuecomment-752946920">this</Link>
from one of the creators of tailwindcss. Following his advice led me to this
<Link to="https://play.tailwindcss.com/LgsL0iVTpL?file=config">tailwindcss config</Link> with a few tweaks.
</p>

<p>
Dark mode achieved, ship it!
</p>

## cyberpunk'd.with.ashton.kutcher

<p>
Oh crap, my site was as buggy as the initial release of
Cyberpunk<FootnoteLink number={3} />. Hold on, did they
<Link to="https://www.imdb.com/title/tt10521204/">remade punk'd with Chance the Rapper?</Link> Anyway, what was I saying? Right, the purge, I
forgot about the purge! When using tailwindcss one of the major benefits is that
you can easily get rid of all the unused CSS classes through a process called
purging. But when I did this, my beautiful dark mode disappears to a eye burning
light mode. What did I forget? So I headed back to Github issues to find
<Link to="https://github.com/tailwindlabs/tailwindcss/issues/3061">this.</Link>
Stupid me, I forgot to add the JavaScript (Damn you JavaScript!) file that adds
the class "dark" to the root element.
</p>

## conclusion

<p>
What have we learned? Well I learned that there are more Static Site Generators
than members of The Wu Tang Clan. That dark mode is the most important part of
any site and should be implemented at any cost. And that there is a new season
of Punk'd out. Now if you'll excuse me, I'm going to enjoy some celebrities
getting pranked.
</p>

## footnotes

<div>
<FootnoteAnchor number={1} /> The joke was going to be: Just like the Baz Luhrman
movie of the same name Gastby is bloated and takes a lot longer than you'd want.
Boom! I said it.
</div>
<div>
<FootnoteAnchor number={2} /> <span class="text-gray-900 bg-black hover:bg-gray-300 hover:text-red-800 p-0.5 -m-0.5">The devil,
woooo, the devil. Slayer rules!</span>
</div>
<div>
<FootnoteAnchor number={3} /> Ouuu,
<Link to="https://twitter.com/GenePark/status/1339662024268247043">cheapshot.</Link>
</div>
