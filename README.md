# Snell's Law

This is a little web project with Javascript and D3.js where I have animated the refelection and refractrion of a ray of light when passing through two different materials.

## How it works
Reflexion is very easy. If you measure the angle of incident relative to the lot the angle of reflexion is the same, but on the other side of the lot.


By using Snell's Law it is possible to compute the angle of refraction:
![alt text](https://frankenapps.github.io/SnellsLaw/res/SnellsLaw.png "Snell's Law")
Sometimes total Reflexion can occur, in order to calculate the angle of total reflexion, one can utilize Snell's Law once again. If n1>n2, then the equation can not be fulfilled (at least not with *Real Numbers*) for a big enough angle of incident:
![alt text](https://frankenapps.github.io/SnellsLaw/res/TotalReflexion.png "Total Reflexion")

## Screenshot

![alt text](https://frankenapps.github.io/SnellsLaw/res/Screenshot.png "Screenshot")

What I wanted to explain here is, that I defined n1 as the *refractive Index* of the material above the Y-Axis and n2 vice versa.
