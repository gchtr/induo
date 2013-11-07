var datasets = [
  "altersheim",
  "alterswohnung",
  "amtshaus",
  "anlauf_und_beratungsstelle",
  "anlaufstelle_kinderbetreuung",
  "aussichtspunkt",
  "baumkataster",
  "beachvolleyball",
  "behindertenparkplatz",
  "betreibungsamt",
  "bikepark",
  "cargotram",
  "eisbahn",
  "finnenbahn", // line string
  "freibad",
  "friedensrichteramt",
  "friedhof",
  "fussballplatz",
  "gartendenkmalinventar",
  "gastwirtschaftsbetrieb",
  "gemeinschaftszentrum",
  "gericht",
  "hallenbad",
  "jugendtreff",
  "kernbohrung",
  "kindergarten",
  "kinderhaus",
  "kinderhort",
  "kinderkrippe",
  "kirche",
  "kirchgemeinde_ev",
  "kirchgemeinde_rk",
  "krematorium",
  "kreisbuero",
  "laengenprofil", // line string
  "landschaftsschutzobjekt",
  "mobility",
  "moschee",
  "muetter_vaeterberatungsstelle",
  "musikschule",
  "nachbarschaftshilfe",
  "naturschutzobjekt",
  "notariatskreis",
  "park",
  "parkhaus",
  "pflegezentrum",
  "picknickplatz",
  "quartiertreff_quartierhaus",
  "sammelstelle",
  "schlittelweg", // line string
  "schulkreis",
  "schulschwimmanlage",
  "skateranlage",
  "sozialzentrum",
  "spielplatz",
  "spitex",
  "sportgarderobe",
  "sporthalle",
  "stadion",
  "stadtpolizei",
  "statistische_quartiere",
  "stimmlokal",
  "suchtbehandlung",
  "synagoge",
  "tennisplatz",
  "tiefbaustelle", // polygon
  "velopumpstation",
  "veloverleih",
  "vitaparcours", // line string
  "volksschule",
  "zueri_wc_nicht_rollstuhlgaengig",
  "zueri_wc_rollstuhlgaengig",
  "zweiradabstellplatz"
];

var maxLng = 8.62544982499102;
var minLng = 8.44801379462696;
var maxLat = 47.434666835715;
var minLat = 47.3202200675953;

var ratio = 12.7/13.4;

var canvasWidth = 800;
var canvasHeight = canvasWidth*ratio;

var viewBoxWidth = 1200;
var xInitial = viewBoxWidth - canvasWidth;

var app = (function() {

  var initApp = function() {

    UI.init();
    Visualization.init();

    // load map and points
    DataLoader.loadData(Files.mapFile, Map.parseJsonData);

  };

  var Files =  {
    nationsFile: 'bevoelkerung.csv',
    confessionFile: 'konfession.csv',
    ageFile: 'alter.csv',
    mapFile: 'statistische_quartiere.json',
    publicFiles: ["amtshaus", "betreibungsamt", "friedensrichteramt", "gericht", "friedhof", "krematorium", "kreisbuero", "sozialzentrum", "stadtpolizei", "stimmlokal", "suchtbehandlung"],
    educationFiles: ["kindergarten","volksschule", "musikschule", "schulschwimmanlage", "kinderhort"],
    religionFiles: ["kirche","moschee", "synagoge"],
    sportFiles: ["tennisplatz", "hallenbad", "stadion", "skateranlage", "fussballplatz", "beachvolleyball", "eisbahn"],
    freedomFiles: ["picknickplatz","spielplatz", "friedhof", "jugendtreff", "hallenbad", "freibad", "park"]
  };

  var See = [
    [8.54414, 47.36681],
    [8.54751, 47.36166],
    [8.54747, 47.35823],
    [8.55238, 47.35298],
    [8.55878, 47.35205],
    [8.56116, 47.34999],
    [8.56341, 47.34630],
    [8.56483, 47.34622],
    [8.56672, 47.34282],
    [8.56740, 47.33959],
    [8.56923, 47.33626],
    [8.57080, 47.33437],
    [8.57266, 47.33055],
    [8.57356, 47.32716],
    [8.57674, 47.32347],
    [8.57828, 47.32034],
    //grenze unten
    [8.55277, 47.31922],
    [8.54393, 47.33353],
    [8.53994, 47.33685],
    [8.53663, 47.34217],
    [8.53487, 47.34865],
    [8.53655, 47.35702],
    [8.53573, 47.35813],
    [8.53603, 47.36127],
    [8.53706, 47.36310],
    [8.53672, 47.36380],
    [8.53972, 47.36575],
    [8.54414, 47.36681]
  ];

  var Colors = {
    colors: [
      "ff0092",   // pink
      "ffca1b",   // orange
      "b6ff00",   // grün
      "228dff",   // blau
      "ba01ff"    // violett
    ],
    usedColors: {},
    colorInactive: '#ddd'
  };

  var UI = {

    el: {
      uiLeftContainer: $('.js-ui-left'),
      uiRightContainer: $('.js-ui-right'),
      uiGraphContainer: $('<div></div>').addClass('graph'),
      uiLocationContainer: $('<div></div>').addClass('locations'),
      uiHelpContainer: $('.js-help'),
      uiHelpLink:      $('.js-toggle-help'),
      uiInfoContainer: $('.js-info'),
      uiInfoLink:      $('.js-toggle-info')
    },

    init: function() {
      this.graphs = {};
      this.bindHeaderLinks();

      var peopleCategories = [
        ['Heimatland',      this.loadNations,     Files.nationsFile],
        ['Heimatkontinent', this.loadContinents,  Files.nationsFile],
        ['Alter',           this.loadAge,         Files.ageFile],
        ['Konfession',      this.loadConfessions, Files.confessionFile]
      ];

      var geoCategories = [
        ['Öffentliche Einrichtungen',   Files.publicFiles],
        ['Bildungseinrichtungen',Files.educationFiles],
        ['Religiöse Einrichtungen', Files.religionFiles],
        ['Sport', Files.sportFiles],
        ['Freizeit', Files.freedomFiles]
      ];

      $.each(geoCategories, function(i, el) {
        var title = $('<div></div>').addClass('category-title').html(el[0]);
        var category = $('<div></div>').addClass('category category-left').append(title);

        UI.el.uiLeftContainer.append(category.append(title));

        title.on('click', function(evt) {

          var target = $(evt.currentTarget).parent();

          if (target.hasClass('active-left')) {
            UI.moveBackLeft(target);
          }
          else {
            target.append(UI.el.uiLocationContainer).addClass('category-element');
            DataLoader.loadBulkData(el[1], UI.loadLocations);
            UI.moveOutLeft(target);
          }

        });
      });


      $.each(peopleCategories, function(i, el) {
        var title = $('<div></div>').addClass('category-title').html(el[0]);
        var category = $('<div></div>').addClass('category category-right').append(title);

        UI.el.uiRightContainer.append(category.append(title));

        title.on('click', function(evt) {

          var target = $(evt.currentTarget).parent();

          if (target.hasClass('active-right')) {
            UI.moveBackRight(target);
          }
          else {
            target.append(UI.el.uiGraphContainer);
            DataLoader.loadData(el[2], el[1]);
            UI.moveOutRight(target);
          }

        });
      });

    },

    bindHeaderLinks: function() {
      UI.el.uiInfoLink.on('click', function(evt) {
        if (UI.el.uiHelpContainer.hasClass('open')) {
          UI.el.uiHelpContainer.removeClass('open');
        }
        UI.el.uiInfoContainer.toggleClass('open');
      });

      UI.el.uiHelpLink.on('click', function(evt) {
        if (UI.el.uiInfoContainer.hasClass('open')) {
          UI.el.uiInfoContainer.removeClass('open');
        }
        UI.el.uiHelpContainer.toggleClass('open');
      });
    },

    loadLocations: function() {
      UI.drawLocations();
    },

    loadNations: function(data) {
      People.parseCsvData(data);
      People.filterData('LandHeimataktuellName', 'sortedCountry');
      UI.drawGraph('sortedCountry', 1800);
    },

    loadContinents: function(data) {
      People.parseCsvData(data);
      People.filterData('KontinetBfS', 'sortedContinent', new Array('LandHeimataktuellName', 'Schweiz'));
      UI.drawGraph('sortedContinent', 200);
    },

    loadConfessions: function(data) {
      People.parseCsvData(data, true);
      People.filterData('Konfessiongruppiert2lang', 'sortedConfession', null, 'AnzahlPersonen');
      UI.drawGraph('sortedConfession', 200);
    },

    loadAge: function(data) {
      People.parseCsvData(data);
      People.filterData('5JahresAltersgruppe', 'sortedAge');
      UI.drawGraph('sortedAge', 1800);
    },

    drawGraph: function(sortKey, height) {

      var hook = UI.el.uiGraphContainer;
      hook.empty();

      var maxValue = Helper.getMaxValue(Data.people[sortKey], 1);

      $.each(Data.people[sortKey], $.proxy( function(i, el) {

        var graphContainer = $('<div></div>').addClass('category-bargraph');
        var graph = Raphael(graphContainer[0], 190, 4);
        var barWidth = el[1]/maxValue * 190;

        var xStart = 0,
          yStart = 0,
          yOffset = 0,
          xOffset = 0,
          barHeight = 5;

        var g = graph.rect( xStart + xOffset, yStart + i * yOffset, barWidth, barHeight, 2);
        g.attr({
          'fill': Colors.colorInactive,
          'stroke-width': 0,
          'r': 0
        });

        var checkbox = $('<input type="checkbox" id="' + el[0] + '">');
        var line = $('<div></div>').addClass('graph-element')
        .append($('<label for="' + el[0] + '"></label>')
          .append(checkbox)
          .append($('<div></div>').addClass('pseudo-checkbox'))
          .append($('<span></span>').addClass('location-name').html(el[0]))
          .append($('<span></span>').addClass('location-amount').html(el[1]))
        .append(graphContainer)
        );

        var functionName = 'handle' + sortKey;
        this.bindChangeEvent(checkbox, this[functionName], el[0]);

        hook.append(line);
      }, this));

    },

    drawLocations: function() {

      var hook = UI.el.uiLocationContainer;
      hook.empty();

      $.each(Data.locations, $.proxy(function(i, el) {
        var checkbox = $('<input type="checkbox" id="' + i + '">');
        var line = $('<div></div>')
        .append($('<label for="' + i + '"></label>')
          .append(checkbox)
          .append($('<div></div>').addClass('pseudo-checkbox'))
          .append($('<span></span>').addClass('location-name').html(i))
          .append($('<span></span>').addClass('location-amount').html(el)
        ));

        this.bindChangeEvent(checkbox, this.handleLocations, el);

        hook.append(line);

      }, this));

    },

    bindClickEvent: function(element, handleFunction, parameter) {
      parameter = typeof parameter !== 'undefined' ? parameter : 0;
      $(element).on('click', {param: parameter}, handleFunction);
    },

    bindChangeEvent: function(element, handleFunction, parameter) {
      parameter = typeof parameter !== 'undefined' ? parameter : 0;
      $(element).on('change', {param: parameter}, handleFunction);
    },

    bindHoverEvent: function(element, handleFunction, parameter, position) {
      $(element).on('mouseover', {param: parameter, pos: position}, handleFunction);
      $(element).on('mouseout', Visualization.hideTooltip);
    },

    moveOutLeft: function(target) {
      if ($('.active-right')[0]) {
        $('.active-left').removeClass('active-left');
      }
      target.addClass('active-left');
      $('.active-left .locations').delay(1000).fadeIn();
    },

    moveBackLeft: function(target) {
      $('.locations').fadeOut();
      target.delay(1000).removeClass('active-left');
    },

    moveOutRight: function(target) {
      if ($('.active-right')[0]) {
        $('.active-right').removeClass('active-right')
      }
      target.addClass('active-right');
      $('.active-right .graph').delay(1000).fadeIn();
    },

    moveBackRight: function(target) {
      $('.graph').fadeOut();
      target.delay(1000).removeClass('active-right');
    },

    handlesortedContinent: function(evt) {
      var continent = evt.data.param;

      if (evt.currentTarget.checked == true) {
        var color = UI.setColor();
        Colors.usedColors[continent] = color;
        People.filterContinents(continent);

        UI.changeColor(evt.currentTarget, color);
      }
      else {
        UI.resetColor(evt.currentTarget);
        Visualization.killPeopleShamelessly(continent);
      }
    },

    handlesortedCountry: function(evt) {
      var country = evt.data.param;
      if (evt.currentTarget.checked == true) {
        var color = UI.setColor();
        Colors.usedColors[country] = color;
        People.filterCountries(country);

        UI.changeColor(evt.currentTarget, color);
      }
      else {
        Visualization.killPeopleShamelessly(country);
      }
    },

    handlesortedAge: function(evt) {
      var age = evt.data.param;
      if (evt.currentTarget.checked == true) {
        var color = UI.setColor();
        Colors.usedColors[age] = color;
        People.filterAge(age);

        UI.changeColor(evt.currentTarget, color);
      }
      else {
        Visualization.killPeopleShamelessly(age);
      }
    },

    handlesortedConfession: function(evt) {
      var confession = evt.data.param;
      if (evt.currentTarget.checked == true) {
        People.filterConfessions(confession);
        var color = UI.setColor();
        Colors.usedColors[confession] = color;

        UI.changeColor(evt.currentTarget, color);
      }
      else {
        Visualization.killPeopleShamelessly(confession);
      }
    },

    handleLocations: function(evt) {
      var locations = evt.data.param[1];
      var name = evt.data.param[1].name;

      if (evt.currentTarget.checked == true) {
        $.each(locations.features, function(i, el) {
          Visualization.drawPoint(el, name);
        });

        Animation.animatePeople();
      }
      else {
        Visualization.killPointsShamelessly(name);
      }

    },

    changeColor: function(target, color) {
      $(target).siblings('.pseudo-checkbox').css({
        'background-color': "#" + color
      });

      var svg = $(target).siblings('.category-bargraph').find('rect')[0];
      $(svg).attr('fill', '#' + color);
    },

    resetColor: function(target) {
      $(target).siblings('.pseudo-checkbox').css({
        'background-color': 'transparent'
      });

      var svg = $(target).siblings('.category-bargraph').find('rect')[0];
      $(svg).attr('fill', Colors.colorInactive);
    },

    setColor: function() {
      // daaaamn you dirty thing
      var notUsed = Colors.colors.filter(function(col, i) {
        var found = true;
        $.each(Colors.usedColors, function(j, el) {
          if (el == col) {
            found = false;
          }
        });
        return found;

      });

      return notUsed[0];
    }

  }

  var DataLoader = {

    /**
     * Load data with jQuery’s get function
     *
     * @param  {function} parseDataFunction   The function that should be called to parse the data that was loaded
     */
    loadData: function(dataFile, callbackFunction) {
      /**
       * We use jQuery’s proxy function to set the object to the object we need.
       * Otherwise it would be on the jQuery object, but we don’t need that.
       */
      $.get('js/data/' + dataFile, callbackFunction);
    },

    loadBulkData: function(dataFiles, callbackFunction) {
      this.loadCount = 0;
      this.loadTarget = dataFiles.length;
      this.loadCallback = callbackFunction;

      Data.locations = {};

      $.each(dataFiles,function(i, el) {
        DataLoader.loadData(el + '.json', DataLoader.loadCounter)
      });
    },

    loadCounter: function(data, textStatus, jqxhr) {
      DataLoader.loadCount++;

      var name = data.name;
      Data.locations[name] = [data.features.length, data];

      if (DataLoader.loadCount == DataLoader.loadTarget) {
        DataLoader.loadCallback();
      }
    }

  };

  var Map = {
    parseJsonData: function(data) {
      Map.districts = data.features;
      Visualization.drawBorders(Map.districts);
    }
  };

  var People = {

    /**
     * Convert the loaded csv data into an array (rows) containing the single objects (cols)
     *
     * @param  {String} data comma separated string
     */
    parseCsvData: function(data, isSpecialCase) {

      isSpecialCase = typeof isSpecialCase !== undefined ? isSpecialCase : false;

      this.lines = data.split(/\r\n|\n/);
      this.propertyNames = this.lines[0].split(',');

      this.parsedData = [];

      // remove all the unneeded characters in the property names (no spaces, no "(" or ")", no double quotes)
      for (var a = 0; a < this.propertyNames.length; a++) {
        this.propertyNames[a] = this.propertyNames[a].replace(/[^a-z0-9]/gi, "");
      }

      for (var i = 0; i < this.lines.length; i++) {
        var line = this.lines[i];
        var cells = '';

        if (isSpecialCase) {
          cells = line.split(",");
        }
        else {
          cells = line.split("\",");
        }

        var lineObj = {};

        // we don’t need the first line, because these are just the table headers
        if (i > 0) {

          $.each(cells, $.proxy(function(j, cell) {
            var propertyName = this.propertyNames[j];
            lineObj[propertyName] = cell.replace(/"/g, "");
          },this));

          this.parsedData.push(lineObj);
        }
      }

      Data.parsedData = this.parsedData;

    },

    /**
     * Refine data to contain only the objects we really need for the graphics
     */
    filterData: function(filterBy, sortKey, exclude, amountsColumnName) {

      amountsColumnName = typeof amountsColumnName !== 'undefined' ? amountsColumnName : 'wirtschaftlicheBevlkerung';

      var filteredData =  Data.parsedData;

      if (exclude != undefined) {
        filteredData = Data.parsedData.filter( function(el, i) {
          return el[exclude[0]] != exclude[1];
        });
      }

      // group data by key
      var groupedData = Helper.group(filteredData, filterBy);

      var formattedData = groupedData.map( function(el, i) {
        return new Array(
          el[0][filterBy],
          Helper.countAmounts(el, amountsColumnName)
        );
      }, this);

      // sort the array
      var sortedData = Helper.customSort(
        formattedData, // array to sort
        1, // key
        false // true = ascending; false = descending
      );

      Data.people[sortKey] = sortedData;

    },

    filterContinents: function(continent) {
      var continentsOnly = Data.parsedData.filter( function(el, i) {
        return el['KontinetBfS'] == continent && el['LandHeimataktuellName'] != 'Schweiz';
      });
      this.sortByDistrict(continentsOnly, 'KontinetBfS');
    },

    filterCountries: function(country) {
      var countriesOnly = Data.parsedData.filter( function(el, i) {
        return el['LandHeimataktuellName'] == country;
      });
      this.sortByDistrict(countriesOnly, 'LandHeimataktuellName');
    },

    filterAge: function(age) {
      var ageGroupsOnly = Data.parsedData.filter( function(el, i) {
        return el['5JahresAltersgruppe'] == age;
      });
      this.sortByDistrict(ageGroupsOnly, '5JahresAltersgruppe');
    },

    filterConfessions: function(confession) {
      var confessionsOnly = Data.parsedData.filter( function(el, i) {
        return el['Konfessiongruppiert2lang'] == confession;
      });
      this.sortByDistrict(confessionsOnly, 'Konfessiongruppiert2lang', 'AnzahlPersonen');
    },

    sortByDistrict: function(array, column, amountsColumnName) {

      amountsColumnName = typeof amountsColumnName !== 'undefined' ? amountsColumnName : 'wirtschaftlicheBevlkerung';

      var groupByDistrict = Helper.group(array, 'StadtquartierhistorischName');

      var amountInDistricts = groupByDistrict.map( function(el, i) {
        return new Array(
          el[0]['StadtquartierhistorischName'],
          Helper.countAmounts(el, amountsColumnName),
          el[0][column]
        );
      });

      Visualization.preparePeople(amountInDistricts);
    }

  };

  var Data = {
    // contains all the loaded data
    people: {},
    locations: {},
    parsedData: [],
    loadedLocations: {},
    loadedPeople: {},
    peopleOnMap: {}
  };

  var Visualization = {

    init: function() {
      this.mapPaper = Raphael("map", viewBoxWidth, canvasHeight);
      this.mapPaper.setViewBox(-200, 0, canvasWidth, canvasHeight, false);

      //map see to map
      this.lake = [];
      $.each(See, $.proxy(function(i, el) {
        var mapped = this.mapToCanvas(el[1], el[0]);
        this.lake.push(mapped);
      }, this));

    },

    drawBorders: function(districts) {
      $.each(districts, $.proxy(function(i, el) {
        this.drawBorder(el, i);
      }, this));
    },

    drawBorder: function(feature, index) {
      var boundaries = [];
      var pathString = "";

      // loop through all points in boundary
      $.each(feature.geometry.coordinates[0], $.proxy(function(index, point) {
        var lng = point[0];
        var lat = point[1];

        var mapped = this.mapToCanvas(lat, lng);
        boundaries[index] = mapped[0] + " " + mapped[1];

      }, this));

      $.each(boundaries, function(index, bnd) {
        if (index == 0) {
          pathString = "M" + bnd;
        }
        else {
          pathString += "L" + bnd;
        }

      });

      var b = this.mapPaper.path(pathString);
      b.attr({
        "stroke-width": 1,
        "stroke": "#111",
        "opacity": 0
      });

    },

    drawPoint: function(feature, name) {
      var lng = feature.geometry.coordinates[0];
      var lat = feature.geometry.coordinates[1];

      if (lng > minLng && lng < maxLng && lat > minLat && lat < maxLat) {
        var mapped = this.mapToCanvas(lat, lng);

        /*var c = this.mapPaper.path(UI.svgs.location);
        var xVal = mapped[0] - 8;
        var yVal = mapped[1] - 2;
        c.transform("t" + xVal + "," + yVal);
        c.attr({
          'fill': '#fff',
          'stroke-width': 0
        });*/

        var b = this.mapPaper.circle(mapped[0], mapped[1], 5);
        b.attr({
          "fill": '#efefef',
          "stroke-width": 2,
          "stroke": '#111',
          "opacity": 0.8
        });

        UI.bindHoverEvent(b.node, this.showTooltip, feature.properties, {x: mapped[0], y: mapped[1]});
      }

      if (Data.loadedLocations[name] == undefined) {
        Data.loadedLocations[name] = [];
      }

      Data.loadedLocations[name].push(b);
    },

    showTooltip: function(evt) {

      var content = evt.data.param;
      var position = evt.data.pos;

      var boxXOffset = 20;
      var boxYOffset = -65;

      var box = Visualization.mapPaper.rect(position.x + boxXOffset, position.y + boxYOffset, 150, 30);
      box.attr({
        'fill': '#111',
        'stroke-width': 0,
        'opacity': 0.8,
      });

      var textXOffset = boxXOffset + 8;
      var textYOffset = boxYOffset + 15;

      var textcontent = content['Name'] + "\n" + content['Adresse'];

      var text = Visualization.mapPaper.text(position.x + textXOffset, position.y + textYOffset, textcontent);
      text.attr({
        'fill': '#f9f9f9',
        'stroke-width': 0,
        'text-anchor': 'start'
      });

      var tooltip = Visualization.mapPaper.set();
      tooltip.push(box, text);

      Visualization.tooltip = tooltip;
    },

    hideTooltip: function(evt) {
      Visualization.tooltip.remove();
    },

    killPointsShamelessly: function(name) {

      $.each(Data.loadedLocations[name], function(i, el) {
        el.remove();
      });

      delete Data.loadedLocations[name];

      if (Object.getOwnPropertyNames(Data.loadedLocations).length === 0){
        Animation.goHome();
      }
      else {
        Animation.animatePeople();
      }
    },

    preparePeople: function(dataArray) {

      $.each(Map.districts, $.proxy(function(i, el) {
        var amount = 0,
            dataSetName = '',
            name = el.properties['Qname'],
            boundariesPx = [];

        $.each(el.geometry.coordinates[0], $.proxy(function(index, point) {
          var lng = point[0];
          var lat = point[1];

          var mapped = this.mapToCanvas(lat, lng);
          boundariesPx[index] = new Array(mapped[0],mapped[1]);

        }, this));

        for (var i = 0; i < dataArray.length; i++) {
          if (name == dataArray[i][0]) {
            amount = dataArray[i][1];
            dataSetName = dataArray[i][2];
            break;
          }
        }

        if (i == 1) {
          //console.log(boundariesPx);
        }

        this.drawPeople(boundariesPx, amount/8, dataSetName);

      }, this));

    },

    drawPeople: function(boundaries, amount, dataSetName) {
      var bbox = this.getBoundingBox(boundaries);

      if (Data.loadedPeople[dataSetName] == undefined) {
        Data.loadedPeople[dataSetName] = [];
      }

      if (Data.peopleOnMap[dataSetName] == undefined) {
        Data.peopleOnMap[dataSetName] = [];
      }

      for (var i = 0; i < amount; i++) {
        var inPolygon = false;
        var kaka = 0;
        while (inPolygon == false && kaka < 10) {
          inPolygon = this.getRandomPointInPolygon(bbox, boundaries, dataSetName);
          kaka++;
        }
      }
    },

    killPeopleShamelessly: function(name) {

      $.each(Data.loadedPeople[name], function(i, el) {
        el.remove();
      });

      delete Colors.usedColors[name];
      delete Data.loadedPeople[name];
    },

    getRandomPointInPolygon: function(bbox, boundariesPx, dataSetName) {

      var randomX = this.getRandomPointFromRange(bbox.x, bbox.x2);
      var randomY = this.getRandomPointFromRange(bbox.y, bbox.y2);

      var isInPolygon = this.isInPolygon(boundariesPx, randomX, randomY);
      // check if its not in the sea

      if (isInPolygon) {
        var inLake = this.isInPolygon(this.lake, randomX, randomY);

        if (!inLake) {

          var c = this.mapPaper.circle(randomX, randomY, 2);

          c.attr({
            "stroke-width": 0,
            "fill": "#" + Colors.usedColors[dataSetName],
            "opacity": 0.7
          });

          var point = {
            x: c.attr('cx'),
            y: c.attr('cy')
          }

          Data.loadedPeople[dataSetName].push(c);
          Data.peopleOnMap[dataSetName].push(point);
        }
      }

      else {
        //console.log('noooot, Bitch!');
      }

      return isInPolygon;

    },

    getRandomPointFromRange: function(min, max) {
      return Math.random() * (max - min) + min;
    },

    isInPolygon: function(poly, pointx, pointy) {
      var i, j;
      var inside = false;
      if (pointy > 5) { // dirty hack, because somewhere there are broken boundaries
        for (i = 0, j = poly.length - 1; i < poly.length; j = i++) {
            if(((poly[i][1] > pointy) != (poly[j][1] > pointy)) && (pointx < (poly[j][0]-poly[i][0]) * (pointy-poly[i][1]) / (poly[j][1]-poly[i][1]) + poly[i][0]) ) inside = !inside;
        }
      }
      return inside;
    },

    getBoundingBox: function(boundaries) {
      var maxX = Helper.getMaxValue(boundaries, 0);
      var maxY = Helper.getMaxValue(boundaries, 1);
      var minX = Helper.getMinValue(boundaries, 0);
      var minY = Helper.getMinValue(boundaries, 1);

      return {
        x: minX,
        x2: maxX,
        y: minY,
        y2: maxY
      };

    },

    mapToCanvas: function(lat, lng) {
      var mappedLng = this.convertToRange(lng, [minLng, maxLng], [0, canvasWidth]);
      var mappedLat = this.convertToRange(lat, [minLat, maxLat], [canvasHeight, 0]);

      return [mappedLng, mappedLat];
    },

    convertToRange: function(value, srcRange, dstRange){
      // value is outside source range return
      if (value < srcRange[0] || value > srcRange[1]){
        return NaN;
      }

      var srcMax = srcRange[1] - srcRange[0],
          dstMax = dstRange[1] - dstRange[0],
          adjValue = value - srcRange[0];

      return (adjValue * dstMax / srcMax) + dstRange[0];
    }

  };

  var Animation =  {

    animatePeople: function() {

      var array = [];

      $.each(Data.loadedPeople, function(i, el) {
        $.each(el, function(j, person) {

          var personPoint = Data.peopleOnMap[i][j];

          $.each(Data.loadedLocations, function(k, el3) {
            $.each(el3, function(l, location) {

              var locationPoint = {
                x: location.attr('cx'),
                y: location.attr('cy')
              }

              var distance = Helper.lineDistance(personPoint, locationPoint);
              var n = [person,location, distance, personPoint];
              array.push(n);

            });
          });
        });
      });

      var newArray = Helper.group(array, 0);
      var minDistances = newArray.map(function(array, i) {
        var sortedArray = Helper.customSort(array, 2, true);
        return sortedArray[0];
      });

      $.each(minDistances, function(i, el) {

        var pointEnd = {
          x: el[1].attr('cx'),
          y: el[1].attr('cy')
        };

        var pointStart = el[3];

        var angle = Helper.getAngle(pointEnd,pointStart);
        var finalPoint = Helper.getPointFromAngleDist(pointStart, angle*Math.PI/180, el[2] * 0.3333);

        var finalAttributes = {
          cx: finalPoint.x,
          cy: finalPoint.y
        }

        el[0].animate(finalAttributes, 1000, 'ease-in');

      });
    },

    goHome: function() {
      $.each(Data.loadedPeople, function(i, sets) {
        $.each(sets, function(j, person) {
          var finalPoint = {
            cx: Data.peopleOnMap[i][j].x,
            cy: Data.peopleOnMap[i][j].y,
          }
          person.animate(finalPoint, 1000, 'ease-in');
        });
      });
    }

  };

  var Helper = {
    /**
     * Finds the maximum in an array by a key in a subarray
     * @param  {array} array  the array which to loop over
     * @param  {int} key      the key that contains the value to compare
     * @return {int}          the max value
     */
    getMaxValue: function(array, key) {
      return array.reduce( function(sum, el) {
        if (el[key] > sum) {
          return el[key];
        }
        return sum;
      }, 0);

    },

    getMinValue: function(array, key) {
      return array.reduce( function(sum, el) {
        if (el[key] < sum) {
          return el[key];
        }
        return sum;
      }, 0);
    },

    getAngle: function(point1, point2) {
      return Raphael.angle(point1.x, point1.y, point2.x, point2.y);
    },

    getPointFromAngleDist: function(point, angle, distance) {
      newX = distance * Math.cos(angle) + point.x;
      newY = distance * Math.sin(angle) + point.y;

      return { x: newX, y: newY }
    },

    /**
     * Regroup an array to contain elements grouped by a defined key
     * @param  {array} array          array to be regrouped
     * @param  {string} groupByKey    key, by which should be regrouped
     * @return {array}                regrouped array
     */
    group: function(array, groupByKey) {
      var groupedArray = new Array();

      for (var i = 0; i < array.length; i++) {
        var element = array[i],
            keyValue = element[groupByKey],
            match = false;

        for (var j = 0; j < groupedArray.length; j++) {

          // if we have a match
          if (groupedArray[j][0][groupByKey] == keyValue) {
            match = true;
            groupedArray[j].push(element);
          }

        }

        if (match == false) {
          groupedArray.push(new Array(element));
        }

      }

      return groupedArray;

    },

    /**
     * Takes an array and returns the sum of every value in a certain key
     * @param  {array} array          array to loop over
     * @param  {string} keyToCount    key on which to do the addition
     * @return {int}                  the final sum
     */
    countAmounts: function(array, keyToCount) {
      return array.reduce( function(sum, el) {
        return sum + parseInt(el[keyToCount]);
      }, 0);
    },

    /**
     * Sort an array by key and order
     * @param  {array} array  the array to be sorted
     * @param  {key} key      the key on which to sort
     * @param  {boolean}      ascending ascending order = true; descending order = false
     * @return {array}        sorted array
     */
    customSort: function(array, key, ascending) {
      return array.sort( function(a, b) {
        // 7, 4, 6, 2
        if (a[key] > b[key] && ascending) {
          return 1;
        }
        else if (a[key] > b[key] && !ascending) {
          return -1;
        }
        else if (a[key] < b[key] && ascending) {
          return -1;
        }
        return 1;
      });
    },

    lineDistance: function (point1, point2) {
      var xs = 0;
      var ys = 0;

      xs = point2.x - point1.x;
      xs = xs * xs;

      ys = point2.y - point1.y;
      ys = ys * ys;

      return Math.sqrt( xs + ys );
    }
  };

  $(document).ready(function() {
    initApp();
  });

})();