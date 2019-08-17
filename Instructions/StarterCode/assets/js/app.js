// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500; 

var margin = {
    top: 30,
    rigth: 50, 
    bottom: 80, 
    left: 100
}

var width = svgWidth - margin.left - margin.rigth 
var height = svgHeight - margin.top - margin.bottom

var svg = d3
    .select("#scatter")
    .append("svg")
    .attr(width, svgWidth)
    .attr(height, svgHeight)

var chartGroup = svg.append("g")
    .attr("transfrom", `translate(${margin.left}, ${margin.top})`);

var defaultXaxis = "poverty";
var defautlYaxis = "healthcare";

// functions used for updating x-scale var and y-scale var upon click on axis label

function XScaleForAxis(determinatData, defaultXaxis) {
    var XLinearScale = d3.scaleLinear()
        .domain([d3.min(determinatData, d => d[defaultXaxis]) * 0.8,
            d3.max(data, d => d[defautlXaxis]) * 1.1])
            .range([0, width]);
    
    return XLinearScale;
}

function YScaleForAxis(determinantData, defaultYaxis) {
    var YLinearScale = d3.scaleLinear()
        .domain([d3.min(determinantData, d => d[defaultYaxis]) * 0.8,
            d3.max(determinantData, d => d[defautlYaxis]) * 1.1])
            .range([height, 0]);
    
    return YLinearScale;
}

// function used for updating xAxis var upon click on axis label

function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);

    return xAxis;
}

function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.AxisLeft(newYScale)
    yAxis.transition()
        .duration(1000)
        .call(leftAxis); 
    
  return yAxis;
}

//After calling the data using d3.json I noticed that I needed a new function
  //to update the text in the axis 

function renderTexts(textsGroup, newXScale, defaultXAxis) {
    textsGroup.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[defaultXAxis]));

  return textsGroup;
}

  function renderYTexts(textsGroup, newYScale, defaultYAxis) {
    textsGroup.transition()
      .duration(1000)
      .attr("y", d => newYScale(d[defaultYAxis]));

    return textsGroup;
  }

// function used for updating circles group with a transition to
// new circles

function renderCircles(circlesGroup, newXScale, defaultXaxis) {
    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[defaultXaxis]));

  return circlesGroup;
}

function renderCircles(circlesGroup, newYScale, defaultYaxis) {
      circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newYScale(d[defaultYaxis]));
    
  return circlesGroup;
}
 
// function used for updating circles group with new tooltip

function updateToolTip(defaultXAxis, circlesGroup) {

    if (defaultXAxis === "poverty") {
      var label = "In Poverty (%):";
    }
    else if (defaultXAxis === "income") {
      var label = "Income: ";
    }
    else if (defaultXAxis === "age") {
      var label = "Age:";
    }

    var defaultYAxis = d3.select(".yLabel").select(".active").attr("value");

    
    if (defaultYAxis === "healthcare") {
      var yLabel = "Lacks Healthcare (%):";
    }
    else if (defaultYAxis === "obesity") {
      var yLabel = "Obese (%):";
    }
    else if (defaultYAxis === "smokes") {
      var yLabel = "Smoking (%):";
    }

    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.abbr}<br>${label} ${d[defaultXAxis]}<br>${yLabel} ${d[defultYAxis]}`);
    });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", toolTip.show)
    .on("mouseout", toolTip.hide);

    return circlesGroup;
  
  }

  // function used for updating circles group with new tooltip
  // Assuming that there is going to be changing Y axes then 
  // there must also be a change in the tooltip each axes 

function updateYToolTip(defaultYAxis, circlesGroup) {

    if (defaultYAxis === "healthcare") {
      var yLabel = "Lacks Healthcare (%):";
    }
    else if (defaultYAxis === "obesity") {
      var yLabel = "Obesity (%):";
    }
    else if (defaultYAxis === "smokes") {
      var yLabel = "Smokes (%):";
    }

    //got this from d3 visualization youtube video
    //https://www.youtube.com/watch?v=_8V5o2UHG0E

    var defaultXAxis = d3.select(".xLabel").select(".active").attr("value");

    if (defaultXAxis === "poverty") {
      var label = "Poverty (%):";
    }
    else if (defaultXAxis === "age") {
      var label = "Age: ";
    }
    else if (defaultXAxis === "income") {
      var label = "Household Income:";
    }

    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.abbr}<br>${label} ${d[defaultXAxis]}<br>${yLabel} ${d[defaultYAxis]}`);
      });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", toolTip.show)
      .on("mouseout", toolTip.hide);

    return circlesGroup;
  }

  // calling the data using d3.json and excecuting functions below
d3.csv("asssets/data/data.csv", function(err, data) {
    if (err) throw err;
    data.forEach(function(data) {
        data.poverty = +data.poverty
        data.healthcare = +data.healthcare
        data.poverty = +data.poverty
        data.income = +data.income
        data.healthcare = +data.healthcare
        data.age = +data.age
    })

    var xLinearScale = xScale(data, defaultXaxis)

    var yLinearScale = yScale(data, defautlYaxis)

    // xLinearScale function above csv import
    var xLinearScale = xScale(determinantData, defaultXAxis);
    
    // yLinearScale function above csv import
    var yLinearScale = yScale(determinantData, defaultYAxis);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);

    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    // append y axis
    var yAxis = chartGroup.append("g")
      .classed("y-axis", true)
      .call(leftAxis);

    //https://books.google.com/books?id=DVQoDwAAQBAJ&printsec=frontcover&dq=d3.js+data+visualization
    // To make 
    
    var textsGroup = chartGroup.append('g').selectAll('text')
      .data(determinantData)
      .enter()
      .append('text')
      .classed('Text',true)
      .attr('x', d => xScale(d[defaultXAxis]))
      .attr('y', d => yScale(d[defaultYAxis]))
      .attr('transform','translate(0,4.5)')
      .text(d => d.abbr)

    var circlesGroup = chartGroup.append("g")
      .selectAll("circle")
      .data(determinantData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[defaultXAxis]))
      .attr("cy", d => yLinearScale(d[defaultYAxis]))
      .attr("r", 12)
      .attr("fill", "lightblue")
      .attr("opacity", ".8");

    // making a group of labels for the x axis 
    var labelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`)
      .classed("xLabel", true);

    var povertyLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty") // value to grab for event listener
      .classed("active", true)
      .text("In Poverty (%)");

    var ageLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age") // value to grab for event listener
      .classed("inactive", true)
      .text("Age");

    var incomeLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "income") // value to grab for event listener
      .classed("inactive", true)
      .text("Income");
    
    // Assuming that to make labels for the y axis is the same process 
    //Creating group for 3 labels on the y axis

    var ylabelsGroup = chartGroup.append("g")
      .attr("transform", "rotate(-90)") // rotating 90 degrees so that my axis is vertical
      .classed("yLabel", true);

    var healthcareLabel = ylabelsGroup.append("text")
      .attr("y", 0 - 50)
      .attr("x", 0 - (height / 2))
      .attr("value", "healthcare")
      .attr("dy", "1em")
      // .classed("axis-text", true)
      .classed("active", true)
      .text("Lacks Healthcare (%)");

    var smokesLabel = ylabelsGroup.append("text")
      .attr("y", 0 - 70)
      .attr("x", 0 - (height / 2))
      .attr("value", "obesity")
      .attr("dy", "1em")
      // .classed("axis-text", true)
      .classed("inactive", true)
      .text("Smokes (%)");

    var obesityLabel = ylabelsGroup.append("text")
      .attr("y", 0 - 90)
      .attr("x", 0 - (height / 2))
      .attr("value", "smokes")
      .attr("dy", "1em")
      // .classed("axis-text", true)
      .classed("inactive", true)
      .text("Obese (%)");

    var circlesGroup = updateToolTip(defaultXAxis, circlesGroup, textsGroup);
    var circlesGroup = updateYToolTip(defaultYAxis, circlesGroup, textsGroup);

    var textsGroup = updateToolTip(defaultYAxis, circlesGroup, textsGroup);
    var textsGroup = updateToolTip(defaultYAxis, circlesGroup, textsGroup);
    

    labelsGroup.selectAll("text").on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== defaultXAxis) {
        // replaces chosenXAxis with value

        defualtXAxis = value;
        // console.log(chosenXAxis)

        xLinearScale = xScale(determinantData, defaultXAxis);

        xAxis = renderAxes(xLinearScale, xAxis);

        textsGroup = renderTexts(textsGroup, xLinearScale, defaultXAxis);

          // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, defaultXAxis);

          // update texts with new x values
        textsGroup = renderTexts(textsGroup, xLinearScale, defaultXAxis);

          // updates tooltips with new info
        circlesGroup = updateToolTip(defaultXAxis, circlesGroup);

        if (defaultXAxis === "age") {
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (defaultXAxis === "poverty") {
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (defaultXAxis === "income") {
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });

    ylabelsGroup.selectAll("text")
      .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== defaultYAxis) {

          // replaces chosenYaxis with value

          defaultYAxis = value;
          // functions here found above csv import
          // updates y scale for new data

          yLinearScale = yScale(determinantData, defaultYAxis);
          // updates x axis with transition

          yAxis = renderYAxes(yLinearScale, yAxis);

          // updates circles with new y values
          circlesGroup = renderYCircles(circlesGroup, yLinearScale, defaultYAxis);

          // update texts with new y values
          textsGroup = renderYTexts(textsGroup, yLinearScale, defaultYAxis);

          // updates tooltips with new info
          circlesGroup = updateYToolTip(defaultYAxis, circlesGroup);

          // changes classes to change bold text
          if (defaultYAxis === "healthcare") {
            healthcareLabel
              .classed("active", true)
              .classed("inactive", false);
            obesityLabel
              .classed("active", false)
              .classed("inactive", true);
            smokesLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (defaultYAxis === "obesity") {
            healthcareLabel
              .classed("active", false)
              .classed("inactive", true);
            obesityLabel
              .classed("active", true)
              .classed("inactive", false);
            smokesLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (defaultYAxis === "smokes") {
            healthcareLabel
              .classed("active", false)
              .classed("inactive", true);
            obesityLabel
              .classed("active", false)
              .classed("inactive", true);
            smokesLabel
              .classed("active", true)
              .classed("inactive", false);
          }
        }
      });

});



