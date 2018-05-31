// create svg canvas
const canvHeight = 380, canvWidth = 580;

const svgRoman = d3.select("#worldmap").append("svg")
    .attr("width", canvWidth)
    .attr("height", canvHeight)
    .style("background", "rgba(169,234,254,0.7)")
    .attr("class", "svgRoman");

const svgProtestant = d3.select("#worldmap").append("svg")
    .attr("width", canvWidth)
    .attr("height", canvHeight)
    .style("background", "rgba(169,234,254,0.7)")
    .attr("class", "svgProtestant");

const svgJudaism = d3.select("#worldmap").append("svg")
    .attr("width", canvWidth)
    .attr("height", canvHeight)
    .style("background", "rgba(169,234,254,0.7)")
    .attr("class", "svgJudaism");

const svgIslam = d3.select("#worldmap").append("svg")
    .attr("width", canvWidth)
    .attr("height", canvHeight)
    .style("background", "rgba(169,234,254,0.7)")
    .attr("class", "svgIslam");

const svgBuddhism = d3.select("#worldmap").append("svg")
    .attr("width", canvWidth)
    .attr("height", canvHeight)
    .style("background", "rgba(169,234,254,0.7)")
    .attr("class", "svgBuddhism");

const svgHinduism = d3.select("#worldmap").append("svg")
    .attr("width", canvWidth)
    .attr("height", canvHeight)
    .style("background", "rgba(169,234,254,0.7)")
    .attr("class", "svgHinduism");

var tooltipRoman = d3.select("svg.svgRoman").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


var holdedData = [];

var romancatholicByID = {};
var protestantByID = {};
var judaismByID = {};
var islamByID = {};
var buddhismByID = {};
var hinduismByID = {};


//Farben der verschiedenen Religionen
//Inspiration: https://imbstudent.donau-uni.ac.at/1mmd2016/index.php/2016/03/05/farbe-und-religion/

var colorChrist = d3.scaleLinear().domain([0,1])
    .range([d3.rgb("#fcfbfd"), d3.rgb("#3f007d")]);

var colorProtestant = d3.scaleLinear().domain([0,1])
    .range([d3.rgb("#fff5f0"), d3.rgb("#67000d")]);

var colorJudaism = d3.scaleLinear().domain([0,1])
    .range([d3.rgb("#f7fbff"), d3.rgb("#08306b")]);

var colorIslam = d3.scaleLinear().domain([0,1])
    .range([d3.rgb("#f7fcfd"), d3.rgb("#00441b")]);

var colorBudd = d3.scaleLinear().domain([0,1])
    .range([d3.rgb("#fff5eb"), d3.rgb("#7f2704")]);

var colorHind = d3.scaleLinear().domain([0,1])
    .range([d3.rgb("#FFFFE0"), d3.rgb("#666600")]);


var defaultColor = "#ccc";

// calc the width and height depending on margins
const margin = {top: 50, right: 80, bottom: 50, left: 30};
const width = canvWidth - margin.left - margin.right;
const heigth = canvHeight - margin.top - margin.bottom;

loadData();

var allCountries = [];

function loadData() {
    d3.csv("data/national-clean_v2-somethingv2.csv", function (data) {

        var time = ["1945", "1950", "1955", "1960", "1965", "1970", "1975" , "1980", "1985", "1990", "1995", "2000", "2005", "2010"];

        time.forEach(function (d) {
            var temp = [];
            data.forEach(function (c) {
                if(c.year == d){
                    temp.push(c);
                }
            });
            holdedData.push(temp);
        });

        data.forEach(d => allCountries.push(d));

    });

    draw(13);
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

    const projection = d3.geoMercator()
        .scale(90)
        .center([6, 10])
        .translate( [canvWidth / 2, canvHeight / 1.5]);

    const pathGenerator = d3.geoPath().projection(projection);

    d3.json("data/world-countries.json", function (data) {

        fillHoldedData(year);

        var countryRoman =  gRoman.selectAll('path.country')
            .data(data.features)
            .enter()
            .append("path")
            .attr("class", "country")
            .on('click', d => selected(d, "christanity"))
            .style("fill", d => {
                var color = colorChrist(romancatholicByID[d.id]);
                if(color != "rgb(0, 0, 0)") {return color;}
                return defaultColor;
            })
            .on("mouseover", function(d) {
                tooltipRoman.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltipRoman.html(d.properties.name)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                tooltipRoman.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
            .attr("d", pathGenerator);

        var countryProtestant =  gProtestant.selectAll('path.country')
            .data(data.features)
            .enter()
            .append("path")
            .attr("class", "country")
            .on('click', d => selected(d, "protestant"))
            .style("fill", d =>{
                var color = colorProtestant(protestantByID[d.id]);
                if(color != "rgb(0, 0, 0)") {return color;}
                return defaultColor;
            })
            .attr("d", pathGenerator);

        var countryJudaism =  gJudaism.selectAll('path.country')
            .data(data.features)
            .enter()
            .append("path")
            .attr("class", "country")
            .on('click', d => selected(d, "judaism"))
            .style("fill", d =>{
                var color = colorJudaism(judaismByID[d.id]);
                if(color != "rgb(0, 0, 0)") {return color;}
                return defaultColor;
            })
            .attr("d", pathGenerator);

        var countryIslam =  gIslam.selectAll('path.country')
            .data(data.features)
            .enter()
            .append("path")
            .attr("class", "country")
            .on('click', d => selected(d, "islam"))
            .style("fill", d =>{
                var color = colorIslam(islamByID[d.id]);
                if(color != "rgb(0, 0, 0)") {return color;}
                return defaultColor;
            })
            .attr("d", pathGenerator);

        var countryBuddhism =  gBuddhism.selectAll('path.country')
            .data(data.features)
            .enter()
            .append("path")
            .attr("class", "country")
            .on('click', d => selected(d, "buddhism"))
            .style("fill", d =>{
                var color = colorBudd(buddhismByID[d.id]);
                if(color != "rgb(0, 0, 0)") {return color;}
                return defaultColor;
            })
            .attr("d", pathGenerator);

        var countryHinduism =  gHinduism.selectAll('path.country')
            .data(data.features)
            .enter()
            .append("path")
            .attr("class", "country")
            .on('click', d => selected(d, "hinduism"))
            .style("fill", d =>{
                var color = colorHind(hinduismByID[d.id]);
                if(color != "rgb(0, 0, 0)") {return color;}
                return defaultColor;
            })
            .attr("d", pathGenerator);

    });
}


function drawNew(year){
    fillHoldedData(year);

    var country = svgRoman.selectAll('path.country')
        .style("fill", d => {
            var color = colorChrist(romancatholicByID[d.id]);
            if(color != "rgb(0, 0, 0)") {return color;}
            return defaultColor;
        });

    var countryProtestant = svgProtestant.selectAll('path.country')
        .style("fill", d =>{
            var color = colorProtestant(protestantByID[d.id]);
            if(color != "rgb(0, 0, 0)") {return color;}
            return defaultColor;
        });

    var countryJudaism = svgJudaism.selectAll('path.country')
        .style("fill", d =>{
            var color = colorJudaism(judaismByID[d.id]);
            if(color != "rgb(0, 0, 0)") {return color;}
            return defaultColor;
        });

    var countryIslam = svgIslam.selectAll('path.country')
        .style("fill", d =>{
            var color = colorIslam(islamByID[d.id]);
            if(color != "rgb(0, 0, 0)") {return color;}
            return defaultColor;
        });

    var countryBuddhism = svgBuddhism.selectAll('path.country')
        .style("fill", d =>{
            var color = colorBudd(buddhismByID[d.id]);
            if(color != "rgb(0, 0, 0)") {return color;}
            return defaultColor;
        });

    var countryHinduism = svgHinduism.selectAll('path.country')
        .style("fill", d =>{
            var color = colorHind(hinduismByID[d.id]);
            if(color != "rgb(0, 0, 0)") {return color;}
            return defaultColor;
        });

}


var slider = d3.select('#year');

slider.on('change', function() {
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


function fillHoldedData(year){
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


function selected(country, religion) {
    var data = [];

    var textBarchart;
    var colorBars;

    allCountries.forEach(d => {
        if(d.code == country.id){
            if(religion == "christanity"){
                data.push({"value": d.romancatholic_percent, "year": d.year});
                textBarchart = "Anzahl der Katholiken in " + country.id + " von 1945 - 2010";
                colorBars = "#00441b";
            }
            else if(religion == "protestant"){
                data.push({"value": d.protestant_percent, "year": d.year});
                textBarchart = "Anzahl der Reformierten in " + country.id + " von 1945 - 2010";
                colorBars = "#cb181d";
            }
            else if(religion == "judaism"){
                data.push({"value": d.judaism_percent, "year": d.year});
                textBarchart = "Anzahl der Juden in " + country.id + " von 1945 - 2010";
                colorBars = "#08306b";
            }
            else if(religion == "islam"){
                data.push({"value": d.islam_percent, "year": d.year});
                textBarchart = "Anzahl der Islamisten in " + country.id + " von 1945 - 2010";
                colorBars = "#00441b";
            }
            else if(religion == "buddhism"){
                data.push({"value": d.buddhism_percent, "year": d.year});
                textBarchart = "Anzahl der Buddhisten in "  + country.id + " von 1945 - 2010";
                colorBars = "#f16913";
            }
            else{
                data.push({"value": d.hinduism_percent, "year": d.year});
                textBarchart = "Anzahl der Hinduisten in " + country.id + " von 1945 - 2010";
                colorBars = "#666600";
            }
        }
    });
    console.log(data);
    if(data.length == 0) return;

    var margin = {top: 5, right: 5, bottom: 50, left: 100};
    // here, we want the full chart to be 700x200, so we determine
    // the width and height by subtracting the margins from those values
    var fullWidth = 1000;
    var fullHeight = 350;
    // the width and height values will be used in the ranges of our scales
    var width = fullWidth - margin.right - margin.left;
    var height = fullHeight - margin.top - margin.bottom;


    var svgSelection = d3.select("#placeBarchart")
        .selectAll('svg')
        .remove();

    var svg = d3.select("#placeBarchart")
        .append('svg')
        .attr('width', fullWidth)
        .attr('height', fullHeight)
        .style('padding', '40px')
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


    svg.append("g")
        .attr("id", "barchart")
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var years = data.map(function (v) {
        return v.year;
    });

    const yearScale = d3.scaleBand()
        .domain(years)
        .range([0, width])
        .paddingInner(0.5);

    // the width of the bars is determined by the scale
    var bandwidth = yearScale.bandwidth();

    var maxValue = d3.max(data, function (d) {
        return d.value;
    });

    var valueScale = d3.scaleLinear()
        .domain([0, maxValue])
        .range([height, 0])
        .nice();

    var xAxis = d3.axisBottom(yearScale);
    var yAxis = d3.axisLeft(valueScale);

    // draw the axees
    svg.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

    var yAxisEle = svg.append('g')
        .call(yAxis);

    // add a label to the yAxis
    var yText = yAxisEle.append('text')
        .attr('transform', 'rotate(-90)translate(-' + height/2 + ',0)')
        .style('text-anchor', 'middle')
        .style('fill', 'black')
        .attr('dy', '-5em')
        .style('font-size', 14);

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
    var bars = vis.selectAll('rect.bar')
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

    window.scrollTo(0,document.body.scrollHeight);
}
