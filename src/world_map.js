//Define height and width of the Canvas which hold the worldmaps
const canvHeight = 380, canvWidth = 580;

//Create svgs for each worldmap of each religion
const svgRoman = d3.select("#worldmap").append("svg")
    .attr("width", canvWidth)
    .attr("height", canvHeight)
    .attr("class", "svgRoman");

const svgProtestant = d3.select("#worldmap").append("svg")
    .attr("width", canvWidth)
    .attr("height", canvHeight)
    .attr("class", "svgProtestant");

const svgJudaism = d3.select("#worldmap").append("svg")
    .attr("width", canvWidth)
    .attr("height", canvHeight)
    .attr("class", "svgJudaism");

const svgIslam = d3.select("#worldmap").append("svg")
    .attr("width", canvWidth)
    .attr("height", canvHeight)
    .attr("class", "svgIslam");

const svgBuddhism = d3.select("#worldmap").append("svg")
    .attr("width", canvWidth)
    .attr("height", canvHeight)
    .attr("class", "svgBuddhism");

const svgHinduism = d3.select("#worldmap").append("svg")
    .attr("width", canvWidth)
    .attr("height", canvHeight)
    .attr("class", "svgHinduism");

//data of each religion of each country will be loaded in this array
//is used to fill the color of each coutry in every map when slider input is changed
let allCountries = [];

//holds the data of each country and each religion for a each year
let holdedData = [];

//holds the data for each country and the given religion
//romancatholicByID for example is holding every country code with the prozentage of romancatholic
//--> CAN, 50%
let romancatholicByID = {};
let protestantByID = {};
let judaismByID = {};
let islamByID = {};
let buddhismByID = {};
let hinduismByID = {};

//Text of tooltip
const moreInfos = "Klicke für eine Gesamtübersicht " + "<br />" + "des Landes zu dieser Religion";

//Farben der verschiedenen Religionen
//Inspiration: https://imbstudent.donau-uni.ac.at/1mmd2016/index.php/2016/03/05/farbe-und-religion/
const colorChrist = d3.scaleLinear().domain([0,1])
    .range([d3.rgb("#fcfbfd"), d3.rgb("#3f007d")]);

const colorProtestant = d3.scaleLinear().domain([0,1])
    .range([d3.rgb("#fff5f0"), d3.rgb("#67000d")]);

const colorJudaism = d3.scaleLinear().domain([0,1])
    .range([d3.rgb("#f7fbff"), d3.rgb("#08306b")]);

const colorIslam = d3.scaleLinear().domain([0,1])
    .range([d3.rgb("#f7fcfd"), d3.rgb("#00441b")]);

const colorBudd = d3.scaleLinear().domain([0,1])
    .range([d3.rgb("#fff5eb"), d3.rgb("#7f2704")]);

const colorHind = d3.scaleLinear().domain([0,1])
    .range([d3.rgb("#FFFFE0"), d3.rgb("#666600")]);

//Default color, when color of Religion returns rgb(0,0,0)
const defaultColor = "#ccc";

// calc the width and height depending on margins
const margin = {top: 50, right: 80, bottom: 50, left: 30};
const width = canvWidth - margin.left - margin.right;
const heigth = canvHeight - margin.top - margin.bottom;

//Load the religion data for each country
loadData();
function loadData() {
    d3.csv("data/national-clean.csv", function (data) {

        const time = ["1945", "1950", "1955", "1960", "1965", "1970", "1975" , "1980", "1985", "1990", "1995", "2000", "2005", "2010"];

        //fill the holdedData Variable
        time.forEach(function (d) {
            let temp = [];
            data.forEach(function (c) {
                if(c.year === d){
                    temp.push(c);
                }
            });
            holdedData.push(temp);
        });

        //Fill allcountries
        data.forEach(d => allCountries.push(d));

    });

    draw(0);
}

//---------------------Draw WORLD MAP-------------------------

function draw(year){
    //adapt from http://bl.ocks.org/micahstubbs/8e15870eb432a21f0bc4d3d527b2d14f
    //const canvHeight = 390, canvWidth = 530;

    //create parent group and add left and top margin
    const gRoman = svgRoman.append("g")
        .attr("id", "chart-area")
        .attr("transform", `translate(10, 10)`);

    const gProtestant = svgProtestant.append("g")
        .attr("id", "chart-area")
        .attr("transform", `translate(10, 10)`);

    const gJudaism = svgJudaism.append("g")
        .attr("id", "chart-area")
        .attr("transform", `translate(10, 10)`);

    const gIslam = svgIslam.append("g")
        .attr("id", "chart-area")
        .attr("transform", `translate(10, 10)`);

    const gBuddhism = svgBuddhism.append("g")
        .attr("id", "chart-area")
        .attr("transform", `translate(10, 10)`);

    const gHinduism = svgHinduism.append("g")
        .attr("id", "chart-area")
        .attr("transform", `translate(10, 10)`);

    // create title
    gRoman.append("text")
        .attr("id", "chart-title")
        .attr("y", 0)
        .attr("x",0)
        .attr("dy", "1em")
        .text("Christentum");

    gProtestant.append("text")
        .attr("id", "chart-title")
        .attr("y", 0)
        .attr("x",0)
        .attr("dy", "1em")
        .text("Protestantismus");

    gJudaism.append("text")
        .attr("id", "chart-title")
        .attr("y", 0)
        .attr("x", 0)
        .attr("dy", "1em")
        .text("Judentum");

    gIslam.append("text")
        .attr("id", "chart-title")
        .attr("y", 0)
        .attr("x", margin.left)
        .attr("dy", "1em")
        .text("Islam");

    gBuddhism.append("text")
        .attr("id", "chart-title")
        .attr("y", 0)
        .attr("x", margin.left)
        .attr("dy", "1em")
        .text("Buddhismus");

    gHinduism.append("text")
        .attr("id", "chart-title")
        .attr("y", 0)
        .attr("x", margin.left)
        .attr("dy", "1em")
        .text("Hinduismus");

    //create Projection for worldmaps
    const projection = d3.geoMercator()
        .scale(90)
        .center([6, 10])
        .translate( [canvWidth / 2, canvHeight / 1.5]);

    const pathGenerator = d3.geoPath().projection(projection);

    //load World-countries Data and Draw the maps
    d3.json("data/world-countries.json", function (data) {

        //get the right data for the selected year for each country
        fillReligionsByID(year);

        //create a map for each Religion
        gRoman.selectAll('path.country')
            .data(data.features)
            .enter()
            .append("path")
            .attr("class", "country")
            //when clicked on the country a bar chart over the whole time is showed
            .on('click', d => drawBarchart(d, "christanity"))
            //Fill each country with the right color due his prozentage of the religion
            .style("fill", d => {
                const color = colorChrist(romancatholicByID[d.id]);
                if(color !== "rgb(0, 0, 0)") {return color;}
                return defaultColor;
            })
            //call the tooltip helper Method defined in /src/tooltip.js
            .call(d3.helper.tooltip(
                function(d){
                    return "<b>"+d.properties.name + "</b>" + "<br />" +  moreInfos;
                }
            ))
            .attr("d", pathGenerator);

        gProtestant.selectAll('path.country')
            .data(data.features)
            .enter()
            .append("path")
            .attr("class", "country")
            .on('click', d => drawBarchart(d, "protestant"))
            .style("fill", d =>{
                const color = colorProtestant(protestantByID[d.id]);
                if(color !== "rgb(0, 0, 0)") {return color;}
                return defaultColor;
            })
            .call(d3.helper.tooltip(
                function(d){
                    return "<b>"+d.properties.name + "</b>" + "<br />" +  moreInfos;
                }
            ))
            .attr("d", pathGenerator);

        gJudaism.selectAll('path.country')
            .data(data.features)
            .enter()
            .append("path")
            .attr("class", "country")
            .on('click', d => drawBarchart(d, "judaism"))
            .style("fill", d =>{
                const color = colorJudaism(judaismByID[d.id]);
                if(color !== "rgb(0, 0, 0)") {return color;}
                return defaultColor;
            })
            .call(d3.helper.tooltip(
                function(d){
                    return "<b>"+d.properties.name + "</b>" + "<br />" +  moreInfos;
                }
            ))
            .attr("d", pathGenerator);

        gIslam.selectAll('path.country')
            .data(data.features)
            .enter()
            .append("path")
            .attr("class", "country")
            .on('click', d => drawBarchart(d, "islam"))
            .style("fill", d =>{
                const color = colorIslam(islamByID[d.id]);
                if(color !== "rgb(0, 0, 0)") {return color;}
                return defaultColor;
            })
            .call(d3.helper.tooltip(
                function(d){
                    return "<b>"+d.properties.name + "</b>" + "<br />" +  moreInfos;
                }
            ))
            .attr("d", pathGenerator);

        gBuddhism.selectAll('path.country')
            .data(data.features)
            .enter()
            .append("path")
            .attr("class", "country")
            .on('click', d => drawBarchart(d, "buddhism"))
            .style("fill", d =>{
                const color = colorBudd(buddhismByID[d.id]);
                if(color !== "rgb(0, 0, 0)") {return color;}
                return defaultColor;
            })
            .call(d3.helper.tooltip(
                function(d){
                    return "<b>"+d.properties.name + "</b>" + "<br />" +  moreInfos;
                }
            ))
            .attr("d", pathGenerator);

        gHinduism.selectAll('path.country')
            .data(data.features)
            .enter()
            .append("path")
            .attr("class", "country")
            .on('click', d => drawBarchart(d, "hinduism"))
            .style("fill", d =>{
                const color = colorHind(hinduismByID[d.id]);
                if(color !== "rgb(0, 0, 0)") {return color;}
                return defaultColor;
            })
            .call(d3.helper.tooltip(
                function(d){
                    return "<b>"+d.properties.name + "</b>" + "<br />" +  moreInfos;
                }
            ))
            .attr("d", pathGenerator);

    });
}

//change the color of countries when the year is switched
function drawNew(year){
    //fill the Variable with the right values for the given year
    fillReligionsByID(year);
    //i don't draw the worldmap again, i just give it a new color
    svgRoman.selectAll('path.country')
        .style("fill", d => {
            const color = colorChrist(romancatholicByID[d.id]);
            if(color !== "rgb(0, 0, 0)") {return color;}
            return defaultColor;
        });

    svgProtestant.selectAll('path.country')
        .style("fill", d =>{
            const color = colorProtestant(protestantByID[d.id]);
            if(color !== "rgb(0, 0, 0)") {return color;}
            return defaultColor;
        });

    svgJudaism.selectAll('path.country')
        .style("fill", d =>{
            const color = colorJudaism(judaismByID[d.id]);
            if(color !== "rgb(0, 0, 0)") {return color;}
            return defaultColor;
        });

    svgIslam.selectAll('path.country')
        .style("fill", d =>{
            const color = colorIslam(islamByID[d.id]);
            if(color !== "rgb(0, 0, 0)") {return color;}
            return defaultColor;
        });

    svgBuddhism.selectAll('path.country')
        .style("fill", d =>{
            const color = colorBudd(buddhismByID[d.id]);
            if(color !== "rgb(0, 0, 0)") {return color;}
            return defaultColor;
        });

    svgHinduism.selectAll('path.country')
        .style("fill", d =>{
            const color = colorHind(hinduismByID[d.id]);
            if ("rgb(0, 0, 0)" !== color) {return color;}
            return defaultColor;
        });
}

//prepare slider input to draw the given year
const slider = d3.select('#year');
slider.on('change', function() {
    //Switch statement to define what year should be drawn
    //slider gives input from 1945 - 2010
    //To draw years i need input from 0-13
    switch (this.value){
        case "2010":
            drawNew(13);
            break;
        case "2005":
            drawNew(12);
            break;
        case "2000":
            drawNew(11);
            break;
        case "1995":
            drawNew(10);
            break;
        case "1990":
            drawNew(9);
            break;
        case "1985":
            drawNew(8);
            break;
        case "1980":
            drawNew(7);
            break;
        case "1975":
            drawNew(6);
            break;
        case "1970":
            drawNew(5);
            break;
        case "1965":
            drawNew(4);
            break;
        case "1960":
            drawNew(3);
            break;
        case "1955":
            drawNew(2);
            break;
        case "1950":
            drawNew(1);
            break;
        case "1945":
            drawNew(0);
            break;
    }
});


function fillReligionsByID(year){
    romancatholicByID = {};
    protestantByID = {};
    judaismByID = {};
    islamByID = {};
    buddhismByID = {};
    hinduismByID = {};

    holdedData[year].forEach(function (d) {
        romancatholicByID[d.code] = +d.romancatholic_percent;
        protestantByID[d.code] = +d.protestant_percent;
        judaismByID[d.code] = +d.judaism_percent;
        islamByID[d.code] = +d.islam_percent;
        buddhismByID[d.code] = +d.buddhism_percent;
        hinduismByID[d.code] = +d.hinduism_percent;
    });
}

//drawBarchart of the selected country
//country -> clicked country, religion --> for which religion
function drawBarchart(country, religion) {
    //data of the country
    //value: religion procent year: year
    let data = [];

    //holds the text and the color for the religion
    let textBarchart;
    let colorBars;

    allCountries.forEach(d => {
        //every time the country is correct load it in data
        if(d.code === country.id){
            //if statement to determine which religion is meant
            if(religion === "christanity"){
                data.push({"value": +d.romancatholic_percent*100, "year": d.year});
                textBarchart = "Anzahl der Katholiken in " + country.id;
                colorBars = "#3f007d";
            }
            else if(religion === "protestant"){
                data.push({"value": +d.protestant_percent*100, "year": d.year});
                textBarchart = "Anzahl der Reformierten in " + country.id;
                colorBars = "#cb181d";
            }
            else if(religion === "judaism"){
                data.push({"value": +d.judaism_percent*100, "year": d.year});
                textBarchart = "Anzahl der Juden in " + country.id;
                colorBars = "#08306b";
            }
            else if(religion === "islam"){
                data.push({"value": +d.islam_percent*100, "year": d.year});
                textBarchart = "Anzahl der Islamisten in " + country.id;
                colorBars = "#00441b";
            }
            else if(religion === "buddhism"){
                data.push({"value": +d.buddhism_percent*100, "year": d.year});
                textBarchart = "Anzahl der Buddhisten in "  + country.id;
                colorBars = "#f16913";
            }
            else{
                data.push({"value": +d.hinduism_percent*100, "year": d.year});
                textBarchart = "Anzahl der Hinduisten in " + country.id;
                colorBars = "#666600";
            }
        }
    });
    //if no data for the given country it return
    if(data.length === 0) return;


    //Followed Code is adapted from https://www.pshrmn.com/tutorials/d3/bar-charts/
    const margin = {top: 40, right: 5, bottom: 50, left: 100};

    const fullWidth = 1000;
    const fullHeight = 350;

    const width = fullWidth - margin.right - margin.left;
    const height = fullHeight - margin.top - margin.bottom;

    //remove the hold barchart, so just one barchart is visible
    const svgSelection = d3.select("#placeBarchart")
        .selectAll('svg')
        .remove();

    //Append a new svg for the barchart
    const svg = d3.select("#placeBarchart")
        .append('svg')
        .attr('width', fullWidth)
        .attr('height', fullHeight)
        .style('padding', '40px')
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    //append group element for barchart
    svg.append("g")
        .attr("id", "barchart")
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    //map function to get year
    const years = data.map(function (v) {
        return v.year;
    });

    //scale for years for xaxis
    const yearScale = d3.scaleBand()
        .domain(years)
        .range([0, width])
        .paddingInner(0.5);

    // the width of the bars is determined by the scale
    const bandwidth = yearScale.bandwidth();

    //maxValue to determine the max Height of a bar and the max of the y axis
    const maxValue = d3.max(data, function (d) {
        return d.value;
    });

    //create valueScale for yaxis
    const valueScale = d3.scaleLinear()
        .domain([0, maxValue])
        .range([height, 0])
        .nice();

    //create the axis
    const xAxis = d3.axisBottom(yearScale);
    const yAxis = d3.axisLeft(valueScale);

    // draw the axees
    svg.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

    const yAxisEle = svg.append('g')
        .call(yAxis);

    // add a label to the yAxis
    const yText = yAxisEle.append('text')
        .attr('transform', 'rotate(-90)translate(-' + height/2 + ',0)')
        .style('text-anchor', 'middle')
        .style('fill', 'black')
        .attr('dy', '-3em')
        .style('font-size', 14)
        .text("In Prozent");

    //Titel for Barchart
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text(textBarchart);

    const vis = svg.append('g');

    // draw the bars
    const bars = vis.selectAll('rect.bar')
        .data(data)
        .enter().append('rect')
        .attr('x', function(d, i) {
            return yearScale(d.year);
        })
        .attr('width', bandwidth)
        .attr('y', function(d) {
            return valueScale(d.value);
        })
        .attr('height', function(d) {
            // the bar's height should align it with the base of the chart (y=0)
            return height - valueScale(d.value);
        })
        .attr('fill', colorBars);

    //Scroll to Barchart
    window.scrollTo(0,document.body.scrollHeight);
}
