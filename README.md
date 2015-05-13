# wut.link extension for chrome [![Build status](https://travis-ci.org/natedsaint/chromewut.svg?branch=master)](https://travis-ci.org/natedsaint/chromewut) [![Coverage Status](https://coveralls.io/repos/natedsaint/chromewut/badge.svg?branch=master)](https://coveralls.io/r/natedsaint/chromewut?branch=master)

Requires developer mode: just choose "developer mode" from the extension menu, then choose "load unpacked extension" and point it to the root folder. Done.

##Building Stuff##

This isn't registered in the npm registry, but it uses a package.json file to allow quick installation. Simply run 

`npm install`

This will allow you to build and test. In order to build, you'll edit the various files in lib/, then use gulp to build them. You can also use the npm alias, which is

`npm start`

If you'd like to run unit tests, you can do so with 

`npm test`

##Viewing Stuff##

You can see the current results of the unit tests and this readme by right clicking the extension icon and then going to "options" to see links to them.
