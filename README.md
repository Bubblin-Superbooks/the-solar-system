# The-Solar-System
A quick and immersive journey through our Solar System with a soft primer on Gravitational Physics. A must read for aspiring astronomers, star-gazers and people from all walks of life. I mean you know we're gonna get out there soon! 

Learn how our planetary system works, what it's like to be in space and how astronomy started it all.


# Superbook

The book is deployed here: [The Solar System](https://bubbl.in/cover/the-solar-system-by-marvin-danig)

# Project
This book was rewritten using [Bookiza Framework](http://bookiza.io). 

# Development

Merely install dependencies and run the application using `bookiza server`. The server command will compile and build all pages, set up watchers and serve over `localhost:4567` via browser-sync so that you're able to write/edit continuously and "develop" the book.

```
$ git clone https://github.com/marvindanig/The-Solar-System.git
$ cd The-Solar-System && npm install
$ bookiza server

```
You're all set!


# Structure

The manuscript is structured like so:

```

The-Solar-System/
├── README.md
├── assets
│   ├── css
│   │   └── lazyYT.css
│   ├── images
│   │   ├── 2_no_clouds_1k.jpg
│   │   ├── CartoBackground.png
│   │   ├── galaxy_starfield.jpg
│   │   ├── jupiter-texture.jpg
│   │   ├── moon_trans.png
│   │   ├── moon_trans_light.png
│   │   ├── motif.png
│   │   ├── polar-earth-antarctic.png
│   │   ├── polar-earth-arctic.png
│   │   ├── rotating_earth.jpg
│   │   ├── sun-layers.jpg
│   │   ├── water_1k.png
│   │   └── water_4k.png
│   └── javascript
│       ├── detector.js
│       ├── lazyYT.js
│       └── trackBallControls.js
├── cover
│   ├── back_image.jpg
│   ├── front_image.jpg
│   └── spine_image.jpg
├── license.txt
├── manuscript
│   ├── page-1
│   │   ├── body.html
│   │   └── style.css
│   ├── page-10
│   ├── page-11
│   │   ├── body.html
│   │   └── style.css
│   ├── page-12
│   │   ├── body.html
│   │   └── style.css
│   ├── page-13
│   │   ├── body.html
│   │   └── style.css
│   ├── page-14
│   │   ├── body.html
│   │   └── style.css
│   ├── page-15
│   │   ├── body.html
│   │   ├── head.html
│   │   ├── script.js
│   │   └── style.css
│   ├── page-16
│   │   ├── body.html
│   │   └── style.css
│   │   └── style.css
│   └── page-9
│       ├── body.html
│       └── style.css
├── templates
│   ├── head.html
│   ├── template.css
│   ├── template.html
│   └── template.js
└── trash
    ├── page-81-17:10:20
    │   ├── body.html
    │   └── style.css
    ├── page-81-17:11:12
    │   ├── body.html
    │   └── style.css
    ├── page-82-17:10:23
    │   ├── body.html
    │   └── style.css
    └── page-82-17:11:17
        ├── body.html
        └── style.css

98 directories, 228 files


```
## TODOs:
List of things to do/bugfixes:

1. Add an ellipical orbit depicting equal areas covered by an orbiting planet around the Sun. 
2. Add tilt to Earth's rotational axis to depict seasons. 
3. Add an experiment to show differential flow on Sun. 
4. Gravity slingshot
5. Chapter on galaxies and a 3D experiment for that. 
6. Do a visual experiment to explain projectile motion under gravity. Trajectory turning from parabolic to circular to hyperbolic as one nears the escape velocity.

## Contributing

Contributions are more than welcome. 

1. Fork it ( https://github.com/bubblin/The-Solar-System/fork )
2. Create your feature branch (`git checkout -b my-new-page`)
3. Commit your changes (`git commit -am 'Added a page on (/topic)'`)
4. Push to the branch (`git push origin my-new-page`)
5. Create a new Pull Request
6. [Contact me](mailto:marvin@bubbl.in) if I don't respond within 24 hours.

## Co-authoring
Astronomy is a vast field and no single person is in the know of all the knowledge of space out there. If you wish to join me as a co-author and contribute a chapter, feel free to [write to me](mailto:marvin@bubbl.in).

## License
The content of this project itself is licensed under the [Creative Commons Attribution 3.0](http://creativecommons.org/licenses/by/3.0/us/deed.en_US) license, and the underlying source code used to format and display that content is licensed under the [MIT license](http://opensource.org/licenses/mit-license.php)</a>.