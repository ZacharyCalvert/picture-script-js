

# Overview

This utility is for locally managing pictures and videos, with services planned to assist in detecting and removing duplicates.

 _Why?_
Non-cloud storage and management of photos and videos.  Really for those of us that don't want FaceBook to have every single photo we'll ever take.  Also for photos that you just don't want to go into the cloud.  

_Goals?_
- Support folder and file processing of images and video
- Maintain an "earliest known date" so that you can find duplicate files but track what is the earliest record of that image/file
- Support tagging through a localized browser interface
- Export of tagged people, places, vacations, etc
- Automated tagging when inputting a folder
- Potentially facial recognition (depending on availability of non-cloud upload recognition)
- Eventually attempt to automate picture duplication detection including image rotations and format changes

# Links/References

List of reference documentation consulted for preparing this utility suite:
- <https://developer.atlassian.com/blog/2015/11/scripting-with-node/>

# How to Use

```
npm install -g
med-man -h
```

Start with ```med-man init <path to folder>``` where the path to folder is the folder you want to use to store all of your media files.  

# What it does

The managed directory you provide will become a directory storing all of the processed photos and videos and a metadata database in the top level directory.  Files will be renamed for fast lookup and indexing of ```<managed>/<first 3 digits of sha 256 sum>/<sha 256 sum>```.