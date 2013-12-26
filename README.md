# INDUO
«zieht Zürich an»

[Interactive Data Visualization](http://alma.zhdk.ch/interactive_visualization/) project with [Open Data from the city of Zurich](http://data.stadt-zuerich.ch)

## Prototype

[Live Demo](http://alma.zhdk.ch/interactive_visualization/IV13_Induo/index.html)

## Project description

Induo, which is latin for «attracting» just wants to be a possibility to visualize data of the city of Zurich. In a series of hacknights, organised by the city of Zurich and members of the Swiss Open Data Association the task was to find out the best location for your undertaking or intention.

Induo takes the idea to connect locations with population statistics of the city of Zurich. Data is provided by the Open Data Portal of the city of Zurich and wants to give the user a new insight, prospect and view of Zurich.

The basic idea is to compare geographical location data with the number of inhabitants. We built a visualizing tool that connects these two types of datasets. For a better overview, both datasets are divided in different categories.

These categories are divided into two UI parts. It is on one side possible to make buildings, facilities, sport venues and other locations visible on a map. On the other side you can display which part of the population lives in which district of the city. The population can be filtered by categories of age, nation, continent and confession.

The visualization, which is built with JavaScript (jQuery and Raphael.js) abstracts the populations as colored dots (8 inhabitants are displayed as one dot). The points representing people are drawn to their nearest location as soon as they are loaded into the map. The locations can be seen as black circles and generate hotspots through gravitation around themselves.

We want to leave the interpretation of the combination of data to the user. There are a lot of possibilities to compare locations and population densities. It’s up to the consumer to decide whether it makes sense for him and to draw a conclusion from it.

## Concept and Design

Students from the 3rd semester of the [Interaction Design Course](http://iad.zhdk.ch) ([@IAD_zhdk](http://www.twitter.com/IAD_zhdk/)) at Zurich University of the Arts:  

* Lukas Gächter ([@lgaechter](http://www.twitter.com/lgaechter/))  
* Giacomo Pedemonte  ([@JakobAmStutz](http://www.twitter.com/JakobAmStutz/))  
* Ramon Marc	([@nilsedison](http://www.twitter.com/nilsedison/))  

<http://www.behance.net/gallery/Induo-zieht-Zuerich-an/12065759>

## Built With

* jQuery
* [Raphael.js](http://www.raphaeljs.com)

If you’d like to contribute or give us some hints on improvements, do a pull request, open an issue or say hello on Twitter. We’d be very happy to hear from you.

## Todo

* Error messages and hints
* Save colors, locations and people on the map, when the same category is opened again
* Fix slideout animations of UI elements
* Range selector for age category
* Color range for age category
* Add limitation of 5 different colors