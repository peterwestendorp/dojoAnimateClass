dojo.animateAddClass
====================
This script adds the functions "animateAddClass", "animateRemoveClass" and
"animateToggleClass" to the Dojo namespace (dojo.animateAddClass).

These functions enable you to animate to the style that is defined in a CSS class.

It's more lightweight than the [dojox.fx.style version](http://dojotoolkit.org/reference-guide/dojox/fx/style.html "dojox.fx.style")  (9KB vs. 2KB)

How to use it
-------------
A brief example; if we have an HTML node:

`<div id="foo">`<br>
&nbsp;&nbsp;`Lorum ipsum`<br>
`</div>`

And a piece of CSS:

`.bar {`<br>
&nbsp;&nbsp;`background: red;`<br>
`}`

We can use this function to animate the transistion between #foo and #foo.bar:

`dojo.animateAddClass({`<br>
&nbsp;&nbsp;`node:"foo",`<br>
&nbsp;&nbsp;`className:"bar"`<br>
`}).play();`

Just like dojo.animateProperty
------------------------------
This script is based on dojo.animateProperty so more custom configurations are
possible as well. The only extra property you have to provide is "className", the rest is basically all just dojo.animateproperty().

`dojo.animateAddClass({`<br>
&nbsp;&nbsp;`node:"foo",`<br>
&nbsp;&nbsp;`className:"bar",`<br>
&nbsp;&nbsp;`duration: 1500,`<br>
&nbsp;&nbsp;`easing:dojo.fx.easing.bounceIn,`<br>
&nbsp;&nbsp;`onEnd: function(){`<br>
&nbsp;&nbsp;&nbsp;&nbsp;`console.log("ended");`<br>
&nbsp;&nbsp;`}`<br>
`}).play();`