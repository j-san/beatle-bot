
```
______              _    _       ______         _   
| ___ \            | |  | |      | ___ \       | |  
| |_/ /  ___   ___ | |_ | |  ___ | |_/ /  ___  | |_ 
| ___ \ / _ \ / _ \| __|| | / _ \| ___ \ / _ \ | __|
| |_/ /|  __/|  __/| |_ | ||  __/| |_/ /| (_) || |_ 
\____/  \___| \___| \__||_| \___|\____/  \___/  \__|
```

Code your bots AI and lets them build your game.


Documentation
=============


Program
-------

A program is a generator function that yield bot actions. It runs one per bot infinitly in round.
Click on the "Program" button and write some code, if your are new in development, this is an opportunity to learn ;)


Process Unit
------------

A global instance that contains a reference to your bots and to your buildings, 
it is also in charge of runs programs on bots


Bots
----

A mouving robot that can do some tasks.


### Attributes

x, y
    The position of bot in map

position
    An object containing x and y as attribute


### Actions

goto(destination)
    Move to destination

bootBuilding()
    Mark the bot location as a construction site for a new building

loadMaterial(building)
    Take some material in the given building and put it in the cargo

unloadMaterial(building)
    Put the material in the cargo in the given building

smelt(building)
    Transform mineral in metal

buildBot(building)
    Build a new bot, it will remove 100 metal from given building


### functions

reboot([program])
    Reboot program from the beginin, given program could replace current program.


Buildings
---------

A place with engins that allow bots to works on specific tasks.



Development
===========

test
----

```
npm test
```

Notes
-----

- rebootBot(bot, program), UI change program, reboot bot
- Tests
- Readme, description & screenshot
- improve materials transformations and consumtion
- improve bot queuing
- action for evolve building
- action for evolve bots
- improve bot runtime
- encapsulation
- edit / show robot data
- filtering and helpers
- docs
- don't render bots outside of map area
- bot make some smart stuff
- drag map
- Combat / life
- Client / servrer for multiplayer
- Electron
- Save / load Gist


materials
---------

- iron mineral
- copper mineral
- iron metal
- copper metal
- coal
- petrol
- plastic
- fuel
- beams
- stone
- Energy
- electronic components
- uranium