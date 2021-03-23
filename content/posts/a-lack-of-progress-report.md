+++
author = "John Pangalos"
title = "a.lack.of.progress.report"
date = "2021-03-21"
summary = "Some news is better than no news. Ten tutorials down, 40 to go. Covers Rust, sdl and the slow goings of rewriting lazy foo's excellent sdl game development tutorials."
tags = [ "lazy-foo", "rust", "sdl" ]
categories = [ "game-development" ]
+++

Hobbies, side hustles, pastimes everybody's got them and about 95% are
abandoned[<sup>1</sup>](#1). Many of mine can be found on my
<a href="https://github.com/JohnPangalos" target="_blank">Github account.</a> I
am doing my best to make sure that my game (a.k.a. Totally Not Abandoned Video
Game™) is not one of them. Although, if I were to abandon my upcoming very hyped
video game it would be in good company.

## top.ten.abandoned.side.projects

1. Kitchen Remodel
2. Fix my overflowing toilet
3. Tinder for ducks
4. A really cool video game I promised myself I would make (not this one)
5. Learn to play the fiddle
6. Tinder for bears
7. A top ten list of abandoned projects

My major problem seems to have been that I have no idea what I am
doing[<sup>2</sup>](#2). So I've asked for help, and received the answer of Lazy
foo and their wonderful
<a href="https://lazyfoo.net/tutorials/SDL/index.php" target="_blank">SDL2
Tutorials</a>. Why SDL2? Mostly because I really like understanding material
from as low a level as I can, plus masochism. But I am _not_ masochistic enough
to actually try and use C++. Not that C++ is a bad language, it just feels
dated[<sup>3</sup>](#3). Which is why I decided to take these tutorials and
<a href="https://github.com/JohnPangalos/sdl_learning" target="_blank">rewrite
them in Rust.</a>

## make.it.rust

I really like Rust, I mean like really like it, I've started putting in on my
sandwiches! Well until I got tetanus.
(<a href="https://www.mcgill.ca/oss/article/did-you-know/rust-doesnt-cause-tetanus" target="_blank">Well
Actually</a> 🤓) Anyway, in the context of game development there are three
reasons I like Rust. The first is having to handle pointers. First of all
they're pointy and secondly they're everywhere and seem to be easy to miss. With
Rust you don't have to worry about releasing pointers. When a piece of memory is
out of scope it's gone[<sup>4</sup>](#4).

The second thing I really like about Rust compared to C++, and not just related
to game development, is the error handling. Take a look at these examples:

### c++.error.example

```c++
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

Way more succinct! Your future non carpal tunnel hands will thank me.

Lastly due to the previous reasons the same C++ code can be written in Rust in
significantly less lines. One of the more complicated examples that I copied
over from Lazy Foo went from almost 300 lines of code to 80.

## everything.is.great.forever

Blog post over, we did it! We won game development. Roll credits... You still
here? Okay so not everything about Rust is perfect, it has a notorious learning
curve and I found myself fighting the borrow checker like it stole my lunch and
then killed my entire family (not cool borrow checker).

One of the things I found the most confusing was the concept of
<a href="https://doc.rust-lang.org/rust-by-example/scope/lifetime.html" target="_blank">lifetimes</a>.
No not the TV channel that airs such great films as _The Santa Squad_:

<div class="flex justify-center">
<iframe width="560" height="315" src="https://www.youtube.com/embed/xcn1yJOu23k" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

Are you done watching? Did you watch the whole thing? Good stuff
right?<a id="5"><sup>5</sup></a> Anyway Lifetimes are essentially just a way to
make sure memory stays around when you need it. Do you remember how we don't
have to manage memory in Rust, well we sometimes have to. The link I linked
earlier does a better job of explaining it so I would just read that. What I
learned was that in these situations it's good to have someone to help you go
through your code. I even made a visual example, I hope you like highly
derivative comics!<a id="7"><sup>7</sup></a>

![Rust lifetimes comic](/rust-lifetimes.png)

## conclusion

What have we learned? Well I learned that "C++ &gt; Rust" and that while coding
Rust make sure you have a someone you can talk to and ask questions. Don't have
someone to go to for Rust help? Rust has quite a large
<a href="https://www.rust-lang.org/community" target="_blank">community</a> of
people that are sure to help you. We also learn that lifetime movies are great
and that I should steal, I mean pay homage to more comics in this blog in the
future. I hope you like
<a href="https://www.gocomics.com/garfield/2018/04/04" target="_blank">Garfield!</a>

## footnotes

<a id="1"><sup>1</sup></a> Uhhh... I'll just fill this footnote in later.</br>
<a id="2"><sup>2</sup></a> When has that ever stopped the white man before, am I
right?</br> <a id="3"><sup>3</sup></a> And not the good kind of dated like when
I dated that duck or that bear.</br> <a id="4"><sup>4</sup></a> Kind of like
alzheimer's but in a good way.</br> <a id="5"><sup>5</sup></a> My record if 15
seconds before I stop watching. Also is that the guy from
<a href="https://www.remedygames.com/games/quantumbreak/" target="_blank">Quantum
Break?</a><a id="6"><sup>6</sup></a></br> <a id="6"><sup>6</sup></a> No wait
that is
<a href="https://en.wikipedia.org/wiki/Aaron_Ashmore" target="_blank">his</a>
<a href="https://en.wikipedia.org/wiki/Shawn_Ashmore" target="_blank">brother</a>.</br>
<a id="7"><sup>7</sup></a> [xkcd](https://xkcd.com/) and
[Cyanide and Happiness](https://explosm.net/comics/latest).
