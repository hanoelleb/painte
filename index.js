//default color is black
var currentColor = '#000000';

var colors = [
  '#C70039',
  '#FF6600',
  '#FFFF00',
  '#33CC33',
  '#006600',
  '#00FFFF',
  '#3333FF',
  '#CC99FF',
  '#9900FF',
  '#996633',
  '#808080',
  '#000000',
  '#000000',
];

function createPallete() {
    var pallete = document.getElementById('pallete');
    for (var i = 0; i < colors.length; i++) {
        var box = document.createElement('div');
	box.style.cssText = 'width: 50px; height: 50px; background-color: ' 
	    + colors[i] + ';';
	pallete.appendChild(box);
    }
};
//eraser is just white with heavier stroke

$(document).ready(function() {
   var isDrawing = false;

   createPallete();

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
