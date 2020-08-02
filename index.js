//default color is black
var currentColor = '#000000';

//red  C70039 
//orange FF6600
//yellow #FFFF00
//light green #33CC33
//dark green #006600
//light blue #00FFFF
//darkblue #3333FF
//violet #CC99FF
//indigo #9900FF
//brown #996633
//gray #808080
//black #000000
//white #FFFFFF

//eraser is just white with heavier stroke

$(document).ready(function() {
   var isDrawing = false;

   $('#canvas').on('mousedown', function(e) {
       isDrawing = true;

       var ctx = $(this)[0].getContext('2d');

       var x = e.clientX;
       var y = e.clientY;
   
       ctx.beginPath();
       ctx.moveTo(x,y);
   });

   $('#canvas').on('mousemove', function(e) {
       if (isDrawing) {
           var ctx = $(this)[0].getContext('2d');

           var x = e.clientX;
           var y = e.clientY;

           ctx.lineTo(x,y);
           ctx.stroke();
       }
   });

   $('#canvas').on('mouseup', function() {
       isDrawing = false;
   });
})
