var width = 0;
var height = 0;

var rayLength = 0.25;

var animatedAngle = 45;
var animationSpeed = 0.5;
var arrayID = 4;

var n1 = 1.00027653;
var n2 = 1.3317;

$( document ).ready(function() {
  width = $(document).width();
  height = $(document).height();

  //menu config
  $('#n1').find('[data-bind="bs-drp-sel-label"]').text('Air (under STP)');
  $('#n2').find('[data-bind="bs-drp-sel-label"]').text('Water');
  $('#n1text').val(1.00027653);
  $('#n2text').val(1.3317);

  $( document ).on( 'click', '.bs-dropdown-to-select-group .dropdown-menu li', function( event ) {
    	var $target = $( event.currentTarget );
      var num = 0;
      var indizes = [1,1.00027653,1.3317,1.3604,1.4707,1.4887,1.514,1.5875,2.409,3.8771];
      if($target.attr('data-value').substring(0,1) == 's'){
        num = parseInt($target.attr('data-value').substring(1,$target.attr('data-value').length))-1;
        if(num != 10){
          n2 = indizes[num];
          $('#n2text').val(n2.toString());
          updateAngle(animatedAngle);
        } else{
          $('#n2text').val(''); //not quite good, since it implies old value is already overwritten..
        }
      } else{
        num = parseInt($target.attr('data-value'))-1;
        if(num != 10){
          n1 = indizes[num];
          $('#n1text').val(n1.toString());
          updateAngle(animatedAngle);
        } else{
          $('#n1text').val('');
        }
      }
		$target.closest('.bs-dropdown-to-select-group')
			.find('[data-bind="bs-drp-sel-value"]').val($target.attr('data-value'))
			.end()
			.children('.dropdown-toggle').dropdown('toggle');
		$target.closest('.bs-dropdown-to-select-group')
    		.find('[data-bind="bs-drp-sel-label"]').text($target.context.textContent);
		return false;
	});

  $("#n1text").on("input",function(e){
   if($(this).data("lastval")!= $(this).val()){
       $(this).data("lastval",$(this).val());
       //change action
       if($("#n1text").val() == '1'){ //I don't really care about the other materials..
         $('#n1').find('[data-bind="bs-drp-sel-label"]').text('Vacuum');
       }  else{
        $('#n1').find('[data-bind="bs-drp-sel-label"]').text('Other');
       }
       if(isNaN(parseFloat($("#n1text").val()))){
          $('#n1').find('[data-bind="bs-drp-sel-label"]').text('Vacuum');
          n1 = 1;
       } else{
         n1 = parseFloat($("#n1text").val());
       }
       updateAngle(animatedAngle);
   };
  });

  $("#n2text").on("input",function(e){
   if($(this).data("lastval")!= $(this).val()){
       $(this).data("lastval",$(this).val());
       //change action
       if($("#n2text").val() == '1'){ //I don't really care about the other materials..
         $('#n2').find('[data-bind="bs-drp-sel-label"]').text('Vacuum');
       }  else{
        $('#n2').find('[data-bind="bs-drp-sel-label"]').text('Other');
       }
       if(isNaN(parseFloat($("#n2text").val()))){
          $('#n2').find('[data-bind="bs-drp-sel-label"]').text('Vacuum');
          n2 = 1;
       } else{
         n2 = parseFloat($("#n2text").val());
       }
       updateAngle(animatedAngle);
   };
  });

  $('#setAngle').on('keydown', function(event) {
    if (event.keyCode == 13) {
      event.preventDefault();
      updateAngle(parseFloat($('#setAngle').val()))
    }
  });

  $('#play').on('click', function(event) {
    interval = d3.interval(animation, 1);
  });

  $('#pause').on('click', function(event) {
    interval.stop();
  });

  $('#stop').on('click', function(event) {
    interval.stop();
    animatedAngle = 0;
    updateAngle(animatedAngle);
  });

  $('#slower').on('click', function(event) {
    animationSpeedControl(-1);
  });

  $('#faster').on('click', function(event) {
    animationSpeedControl(1);
  });

  var svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .call(d3.zoom().on("zoom", function () {
              svg.attr("transform", d3.event.transform);
            }))
        .append("g");

  var viewport = svg.append('g');

  var x = d3.scaleLinear().range([width/2-5000*width/height,width/2+5000*width/height]).domain([-50, 50]); //not very elegant...
  var y = d3.scaleLinear().range([height/2-5000*width/height,height/2+5000*width/height]).domain([50,  -50]);

  // Add the x Axis
  svg.append("g")
      .attr("transform", "translate(" + 0 + "," + height/2 + ")")
      .call(d3.axisBottom(x).ticks(100));

  // Add the y Axis
  svg.append("g")
      .attr("transform", "translate(" + width/2 + "," + 0 + ")")
      .call(d3.axisLeft(y).ticks(100));

      var rayIn = viewport.append('line')
                        .attr('x1', width/2)
                        .attr('y1', height/2)
                        .attr('x2', width*rayLength+width/2)
                        .attr('y2', height/2)
                        .attr("stroke-width", 2)
                        .attr("stroke", "red")
                        .attr('id', 'rayIn');

      var rayReflected = viewport.append('line')
                        .attr('x1', width/2)
                        .attr('y1', height/2)
                        .attr('x2', width/2)
                        .attr('y2', height/2)
                        .attr("stroke-width", 2)
                        .attr("stroke", "red")
                        .attr('id', 'rayReflected');

      var rayRefracted = viewport.append('line')
                        .attr('x1', width/2)
                        .attr('y1', height/2)
                        .attr('x2', width/2)
                        .attr('y2', height/2)
                        .attr("stroke-width", 2)
                        .attr("stroke", "red")
                        .attr('id', 'rayRefracted');

  var laser = viewport.append("rect").attr("x", width*rayLength+width/2)
                        .attr("y", height/2-10)
                        .attr("width", 100)
                        .attr("height", 20)
                        .style('fill', 'black')
                        .attr('id', 'laser');

  viewport.append('text').attr('x', width*rayLength+width/2+30)
                      .attr('y', height/2+5)
                      .text('LASER')
                      .style('fill', 'blue')
                      .attr('id', 'laserText');

   var dragPoint = viewport.append('circle')
                        .attr('cx', height/2.5+width/2)
                        .attr('cy', height/2)
                        .attr('r', 5)
                        .attr('id', 'dragPoint')
                        .style('fill', 'blue')
                       .datum({
                         x: height/2.5+width/2,
                         y: height/2
                       })
                       .call(d3.drag()
                       .on("start", dragstarted)
                       .on("drag", dragged)
                       .on("end", dragended));
// theta 1
  var angleIndicatorOuter = d3.arc()
    .innerRadius(50)
    .outerRadius(52)
    .startAngle(0)
    .endAngle(0);

    viewport.append('path')
      .attr('d', angleIndicatorOuter)
      .attr('transform', 'translate(' + width/2 + ',' + height/2 + ')')
      .attr('id', 'anglePath')
      .style('fill', 'green');

      var angleIndicatorInner = d3.arc()
        .innerRadius(0)
        .outerRadius(50)
        .startAngle(0)
        .endAngle(0);

   viewport.append('path')
     .attr('d', angleIndicatorInner)
     .attr('transform', 'translate(' + width/2 + ',' + height/2 + ')')
     .attr('id', 'anglePath2')
     .style('fill', 'green')
     .style('opacity', 0.25);

    // theta 1'
      var angleIndicatorOuter = d3.arc()
        .innerRadius(50)
        .outerRadius(52)
        .startAngle(0)
        .endAngle(0);

        viewport.append('path')
          .attr('d', angleIndicatorOuter)
          .attr('transform', 'translate(' + width/2 + ',' + height/2 + ')')
          .attr('id', 'anglePathS')
          .style('fill', 'orange');

          var angleIndicatorInner = d3.arc()
            .innerRadius(0)
            .outerRadius(50)
            .startAngle(0)
            .endAngle(0);

       viewport.append('path')
         .attr('d', angleIndicatorInner)
         .attr('transform', 'translate(' + width/2 + ',' + height/2 + ')')
         .attr('id', 'anglePath2S')
         .style('fill', 'orange')
         .style('opacity', 0.25);

        // theta 2
          var angleIndicatorOuter = d3.arc()
            .innerRadius(50)
            .outerRadius(52)
            .startAngle(0)
            .endAngle(0);

            viewport.append('path')
              .attr('d', angleIndicatorOuter)
              .attr('transform', 'translate(' + width/2 + ',' + height/2 + ')')
              .attr('id', 'anglePathS2')
              .style('fill', 'blue');

              var angleIndicatorInner = d3.arc()
                .innerRadius(0)
                .outerRadius(50)
                .startAngle(0)
                .endAngle(0);

           viewport.append('path')
             .attr('d', angleIndicatorInner)
             .attr('transform', 'translate(' + width/2 + ',' + height/2 + ')')
             .attr('id', 'anglePath2S2')
             .style('fill', 'blue')
             .style('opacity', 0.25);

    updateAngle(45);
});

function dragstarted(d) {
  d3.select(this).classed("active", true);
}

function dragged(d) {
  d.x += d3.event.dx;
  d.y += d3.event.dy;

  var x1 = width/2 - d.x;
  var y1 = height/2 - d.y;

  if(y1<0){
    var phi = 2*Math.PI + 2*Math.acos((x1)/(Math.sqrt(x1*x1+y1*y1)*(1)));
  } else{
    var phi = 2*Math.acos((x1)/(Math.sqrt(x1*x1+y1*y1)*(-1)));
  }

  updateAngle(round(phi*180/(2*Math.PI),2));
}

function dragended(d) {
  d3.select(this).classed("active", false);
}

function round(number, precision) {
    var pair = (number + 'e').split('e')
    var value = Math.round(pair[0] + 'e' + (+pair[1] + precision))
    pair = (value + 'e').split('e')
    return +(pair[0] + 'e' + (+pair[1] - precision))
}

function updateAngle(deg){
  animatedAngle=deg;
  var totalReflectionAngle = Math.asin(n2/n1);
  var phi = deg*2*Math.PI/180;

  if(deg>180 && deg<270){
    updateAngle(180);
  } else if (deg>=270) {
    updateAngle(0);
  } else if (Math.abs((Math.PI-phi)*180/(2*Math.PI)) > totalReflectionAngle*180/Math.PI) {
    $('#theta_1').html("&#x03B8;&#x2081; &#x2248; " + round(Math.abs((Math.PI-phi)*180/(2*Math.PI)),2) + "°");

    var angleIndicatorOuter = d3.arc()
      .innerRadius(50)
      .outerRadius(52)
      .startAngle(0)
      .endAngle(-phi/2+Math.PI/2);

    d3.select('#anglePath').attr('d', angleIndicatorOuter);

    var angleIndicatorInner = d3.arc()
      .innerRadius(0)
      .outerRadius(50)
      .startAngle(0)
      .endAngle(-phi/2+Math.PI/2);

    d3.select('#anglePath2').attr('d', angleIndicatorInner);

    $('#theta_1_2').html("&#x03B8;&#x2081;' &#x2248; " + round(Math.abs((Math.PI-phi)*180/(2*Math.PI)),2) + "°");

    var angleIndicatorOuter2 = d3.arc()
      .innerRadius(50)
      .outerRadius(52)
      .startAngle(0)
      .endAngle(phi/2-Math.PI/2);

    d3.select('#anglePathS').attr('d', angleIndicatorOuter2);

    var angleIndicatorInner2 = d3.arc()
      .innerRadius(0)
      .outerRadius(50)
      .startAngle(0)
      .endAngle(phi/2-Math.PI/2);

    d3.select('#anglePath2S').attr('d', angleIndicatorInner2);

    //change ray path
    d3.select('#rayIn').attr('x2', width/2+Math.cos(phi/2)*width*rayLength)
    .attr('y2', height/2-Math.sin(phi/2)*width*rayLength);

    d3.select('#rayReflected').attr('x2', width/2+Math.sin(phi/2-Math.PI/2)*10*width)
    .attr('y2', height/2-Math.cos(phi/2-Math.PI/2)*10*width);

    d3.select('#laser').attr('transform', `rotate(${-deg} ${width/2} ${height/2})`);



  if(deg>90){
    d3.select('#laserText').attr('transform', `rotate(${-deg} ${width/2} ${height/2}) rotate(${180} ${d3.select('#laserText').node().getBBox().x+25}  ${d3.select('#laserText').node().getBBox().y+8})`);
  } else{
    d3.select('#laserText').attr('transform', `rotate(${-deg} ${width/2} ${height/2})`);
  }

    d3.select('#dragPoint').attr('cx', width/2+Math.cos(phi/2)*height/2.5)
                   .attr('cy', height/2-Math.sin(phi/2)*height/2.5)
                   .datum({
                     x: width/2+Math.cos(phi/2)*height/2.5,
                     y: height/2-Math.sin(phi/2)*height/2.5
                   }).raise();


    //get rid of refracted ray since we have total reflection
    d3.select('#anglePath2S2').style('opacity', 0);
    d3.select('#anglePathS2').style('opacity', 0);
    d3.select('#rayRefracted').style('opacity', 0);
    //apply this to the sign too
    $('#theta_2').html('');
  }
  else{
    d3.select('#anglePath2S2').style('opacity', 0.25);
    d3.select('#rayRefracted').style('opacity', 1);
    d3.select('#anglePathS2').style('opacity', 1);

    $('#theta_1').html("&#x03B8;&#x2081; &#x2248; " + round(Math.abs((Math.PI-phi)*180/(2*Math.PI)),2) + "°");

  var angleIndicatorOuter = d3.arc()
    .innerRadius(50)
    .outerRadius(52)
    .startAngle(0)
    .endAngle(-phi/2+Math.PI/2);

  d3.select('#anglePath').attr('d', angleIndicatorOuter);

  var angleIndicatorInner = d3.arc()
    .innerRadius(0)
    .outerRadius(50)
    .startAngle(0)
    .endAngle(-phi/2+Math.PI/2);

  d3.select('#anglePath2').attr('d', angleIndicatorInner);

    $('#theta_1_2').html("&#x03B8;&#x2081;' &#x2248; " + round(Math.abs((Math.PI-phi)*180/(2*Math.PI)),2) + "°");

  var angleIndicatorOuter2 = d3.arc()
    .innerRadius(50)
    .outerRadius(52)
    .startAngle(0)
    .endAngle(phi/2-Math.PI/2);

  d3.select('#anglePathS').attr('d', angleIndicatorOuter2);

  var angleIndicatorInner2 = d3.arc()
    .innerRadius(0)
    .outerRadius(50)
    .startAngle(0)
    .endAngle(phi/2-Math.PI/2);

  d3.select('#anglePath2S').attr('d', angleIndicatorInner2);

  var phi2 = (Math.asin(n1/n2*Math.sin(phi/2-Math.PI/2))+Math.PI)*(-1);

  var angleIndicatorOuter3 = d3.arc()
    .innerRadius(50)
    .outerRadius(52)
    .startAngle(-Math.PI)
    .endAngle(phi2);

  d3.select('#anglePathS2').attr('d', angleIndicatorOuter3);

  var angleIndicatorInner3 = d3.arc()
    .innerRadius(0)
    .outerRadius(50)
    .startAngle(-Math.PI)
    .endAngle(phi2);

  d3.select('#anglePath2S2').attr('d', angleIndicatorInner3);

  $('#theta_2').html("&#x03B8;&#x2082; &#x2248; " + round(Math.abs(phi2*(-1)*180/(Math.PI)-180),2) + "°")

  //change ray path
  d3.select('#rayIn').attr('x2', width/2+Math.cos(phi/2)*width*rayLength)
  .attr('y2', height/2-Math.sin(phi/2)*width*rayLength);

  d3.select('#rayReflected').attr('x2', width/2+Math.sin(phi/2-Math.PI/2)*10*width)
  .attr('y2', height/2-Math.cos(phi/2-Math.PI/2)*10*width);

  d3.select('#rayRefracted').attr('x2', width/2+Math.sin(phi2)*10*width)
  .attr('y2', height/2-Math.cos(phi2)*10*width);

  d3.select('#laser').attr('transform', `rotate(${-deg} ${width/2} ${height/2})`);



if(deg>90){
  d3.select('#laserText').attr('transform', `rotate(${-deg} ${width/2} ${height/2}) rotate(${180} ${d3.select('#laserText').node().getBBox().x+25}  ${d3.select('#laserText').node().getBBox().y+8})`);
} else{
  d3.select('#laserText').attr('transform', `rotate(${-deg} ${width/2} ${height/2})`);
}

  d3.select('#dragPoint').attr('cx', width/2+Math.cos(phi/2)*height/2.5)
                 .attr('cy', height/2-Math.sin(phi/2)*height/2.5)
                 .datum({
                   x: width/2+Math.cos(phi/2)*height/2.5,
                   y: height/2-Math.sin(phi/2)*height/2.5
                 }).raise();


}
}

function animation(){
  animatedAngle += animationSpeed;
  if(animatedAngle>180 || animatedAngle<0){
    animationSpeed = -animationSpeed;
  }
  updateAngle(animatedAngle);
}

function animationSpeedControl(direction){
  var speeds = [0.01,0.05,0.1,0.5,1,5,10];
  if(arrayID + direction > -1 && arrayID + direction < 7){
  arrayID = arrayID + direction;
  console.log(speeds[arrayID]);
  if(animationSpeed>0){
    animationSpeed = speeds[arrayID];
  } else{
    animationSpeed = speeds[arrayID]*(-1);
  }
} else{
  console.log("Maximum (or minimum) speed is exceeded.");
}
}
