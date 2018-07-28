[![Build Status](https://travis-ci.org/ZacharyCalvert/picture-script-js.svg?branch=master)](https://travis-ci.org/ZacharyCalvert/picture-script-js)

 _*This package is a pre-release and is still under heavy development*_

# Media Command-Line-Interface (med-cli)  Overview

This is a utility for managing local photos and movies for organizing home media.  It is targeted towards those of us that do not want to publish all of our photos and home video up to the web.

# Target User/Consumer

An engineer (npm user) interested in managing their local family photos and video.  

# Installation

```
npm install -g media-cli
```

# Usage

Help is found via ```med-cli -h``` but typically you will init a managed folder (where all of the pictures and video will be stored), then import various folders, then review the media for tagging and deletion, then you can use tha managed folder in the future to export organized content by tags or folder names.

For example:
```
med-cli init /my/big/USB
med-cli import ~/Desktop/photos
med-cli import ~/my/other/USB
med-cli import ~/Desktop/family
med-cli review /my/big/USB
```

# Remaining Todo 
- Check at end of import
- Recover if file not at expected location on import
- Export functionality via tags, include, exclude, --all
- Wire tag search for folder management
- Test and use on Windows
- export supports the -a flag or exclude flag
- slideshow
- docs
- retag support (change tag a to tag b)
- youtube videos (howto)

# Contributors

Zach Calvert - That's me.  Just a little warning, this is a pet project and fairly hack and slash.  If you're a recruiter/hiring manager, this is not my best work and I'm quite cabable of better tested, cleaner, well documented code.  This is not enterprise.

# Technologies Applied

- Express
- ReactJS
- ES6
- Webpack + babel
- Mocha

# Goals
- Support folder and file processing of images and video
- Maintain an "earliest known date" so that you can find duplicate files but track what is the earliest record of that image/file
- Support tagging through a localized browser interface
- Export of tagged people, places, vacations, etc
- Automated tagging when inputting a folder
- Potentially facial recognition (depending on availability of non-cloud upload recognition)
- Eventually attempt to automate picture duplication detection including image rotations and format changes

# Local Development

```
git clone git@github.com:ZacharyCalvert/picture-script-js.git
cd ./picture-script-js
npm run build
npm install -g
npm link
med-man -h
```

# Release Execution

Travis CLI will execute npm publish on repository tags.  To run a patch release, run 
```
npm run rel
```
which will build, test, patch bump, tag git repo, and push the tag to github.

# Links/References

List of reference documentation consulted for preparing this utility suite:
- <https://developer.atlassian.com/blog/2015/11/scripting-with-node/>

