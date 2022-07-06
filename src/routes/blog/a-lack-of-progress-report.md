---
author: "John Pangalos"
title: "a.lack.of.progress.report"
date: "March 21, 2021"
description: "Some news is better than no news. Ten tutorials down, 40 to go. Covers Rust, sdl and the slow goings of rewriting lazy foo's excellent sdl game development tutorials."
tags: ["lazy-foo", "rust", "sdl"]
categories: ["game-development"]
---

<script context="module">
  import FootnoteLink from "../../components/FootnoteLink.svelte"
  import FootnoteAnchor from "../../components/FootnoteAnchor.svelte"
  import Link from "../../components/Link.svelte";
</script>

# a.<wbr>lack.<wbr>of.<wbr>progress.<wbr>report

<p>
Hobbies, side hustles, pastimes everybody's got them and about 95% are
abandoned<FootnoteLink number={1}/>. Many of mine can be found on my
<Link to="https://github.com/JohnPangalos">Github account.</Link> I
am doing my best to make sure that my game (a.k.a. Totally Not Abandoned Video
Game�) is not one of them. Although, if I were to abandon my upcoming very hyped
video game it would be in good company.
</p>

<!--more-->

## top.<wbr>ten.<wbr>abandoned.<wbr>side.<wbr>projects

1. Kitchen Remodel
2. Fix my overflowing toilet
3. Tinder for ducks
4. A really cool video game I promised myself I would make (not this one)
5. Learn to play the fiddle
6. Tinder for bears
7. A top ten list of abandoned projects

<p>
My major problem seems to have been that I have no idea what I am
doing<FootnoteLink number={2} />. So I've asked for help, and received the answer of Lazy
foo and their wonderful
<Link to="https://lazyfoo.net/tutorials/SDL/index.php">SDL2 Tutorials.</Link> Why SDL2? Mostly because I really like understanding material
from as low a level as I can, plus masochism. But I am _not_ masochistic enough
to actually try and use C++. Not that C++ is a bad language, it just feels
dated<FootnoteLink number={3} />. Which is why I decided to take these tutorials and
<Link to="https://github.com/JohnPangalos/sdl_learning">rewrite them in Rust.</Link>
</p>

## make.it.rust

<p>
I really like Rust, I mean like really like it, I've started putting it on my
sandwiches! Well until I got tetanus.
(<Link to="https://www.mcgill.ca/oss/article/did-you-know/rust-doesnt-cause-tetanus">Well Actually??</Link>) Anyway, in the context of game development there are three
reasons I like Rust. The first is having to handle pointers. First of all
they're pointy and secondly they're everywhere and seem to be easy to miss. With
Rust you don't have to worry about releasing pointers. When a piece of memory is
out of scope it's gone<FootnoteLink number={4} />.
</p>

<p>
The second thing I really like about Rust compared to C++, and not just related
to game development, is the error handling. Take a look at these examples:
</p>

### c++.error.example

```cpp
const result = func();
if( someErrorCheckFunction(result) ) // Even more hidden code
{
 printf( "Oh noes! An error" );
 return 0;
}
else {
   // Do some cool programmer type things
}
```

### rust.error.example

```rust
let result = func()?;
// Do some even cooler Rust programmer type things
```

<p>
Way more succinct! Your future non carpal tunnel hands will thank me.
</p>

<p>
Lastly due to the previous reasons the same C++ code can be written in Rust in
significantly less lines. One of the more complicated examples that I copied
over from Lazy Foo went from almost 300 lines of code to 80.
</p>

## everything.is.great.forever

<p>
Blog post over, we did it! We won game development. Roll credits... You still
here? Okay so not everything about Rust is perfect, it has a notorious learning
curve and I found myself fighting the borrow checker like it stole my lunch and
then killed my entire family (not cool borrow checker).
</p>

<p>
One of the things I found the most confusing was the concept of
<Link to="https://doc.rust-lang.org/rust-by-example/scope/lifetime.html">lifetimes.</Link>
No not the TV channel that airs such great films as <i>The Santa Squad:</i>
</p>

<div class="flex justify-center">
<iframe width="560" height="315" src="https://www.youtube.com/embed/xcn1yJOu23k" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

<p>
Are you done watching? Did you watch the whole thing? Good stuff
right?<FootnoteLink number={5} /> Anyway Lifetimes are essentially just a way to make
sure memory stays around when you need it. Do you remember how we don't have to
manage memory in Rust, well we sometimes have to. The link I linked earlier does
a better job of explaining it so I would just read that. What I learned was that
in these situations it's good to have someone to help you go through your code.
I even made a visual example, I hope you like highly derivative
comics&excl;<FootnoteLink number={7} />
</p>

![Rust lifetimes comic](/rust-lifetimes.png)

## conclusion

<p>
What have we learned? Well I learned that "C++ &amp;lt; Rust" and that while coding
Rust make sure you have a someone you can talk to and ask questions. Don't have
someone to go to for Rust help? Rust has quite a large
<Link to="https://www.rust-lang.org/community">community</Link> of
people that are sure to help you. We also learn that lifetime movies are great
and that I should steal, I mean pay homage to more comics in this blog in the
future. I hope you like
<Link to="https://www.gocomics.com/garfield/2018/04/04">Garfield!</Link>
</p>

## footnotes

<div>
<FootnoteAnchor number={1} /> Uhhh... I'll just fill this footnote in later.
</div>

<div>
<FootnoteAnchor number={2} /> When has that ever stopped the white man before, am I
right?
</div>

<div>
<FootnoteAnchor number={3} /> And not the good kind of dated like when
I dated that duck or that bear.
</div>

<div>
<FootnoteAnchor number={4} /> Kind of like
alzheimer's but in a good way.
</div>

<div>
<FootnoteAnchor number={5} /> My record if 15
seconds before I stop watching. Also is that the guy from
<a href="https://www.remedygames.com/games/quantumbreak/" target="_blank">Quantum
Break?</a>... <FootnoteLink number={6} />
</div>

<div>
<FootnoteAnchor number={6} /> No wait that is
<Link to="https://en.wikipedia.org/wiki/Aaron_Ashmore">his</Link> <Link to="https://en.wikipedia.org/wiki/Shawn_Ashmore">brother</Link>.
</div>

<div>
<FootnoteAnchor number={7} /> <Link to="https://xkcd.com/">xkcd</Link> and
<Link to="https://explosm.net/comics/latest">Cyanide and Happiness</Link>.
</div>
