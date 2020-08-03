//default color is black
var currentColor = '#000000';
var lineWidth = 5;

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
  '#FFFFFF',
];

brushSizes = [1, 5, 10]

function createPallete() {
    var pallete = document.getElementById('pallete');
    for (var i = 0; i < colors.length; i++) {
        var box = document.createElement('div');
	box.className = 'color';
	box.style.cssText = 'width: 50px; height: 50px; background-color: ' 
	    + colors[i] + '; border: solid 1px gray';
	pallete.appendChild(box);
    }
};

function createBrushes() {
   var brushes = document.getElementById('brushes');

   for (var i = 0; i < brushSizes.length; i++) {
       var brush = document.createElement('canvas');
       brush.id = 'brush'+i;
       brush.width = 50;
       brush.height = 50;
       brush.style.cssText ='background-color: white; border: 1px solid gray;';

       const index = i;
       brush.addEventListener('click', function() {
           lineWidth = brushSizes[index];   
	   console.log(lineWidth);
       });

       brushes.appendChild(brush);

       var ctx = brush.getContext('2d');
       ctx.beginPath();
       ctx.moveTo(0, 25);

       ctx.lineWidth = brushSizes[i];
       ctx.lineTo(50, 25);

       ctx.stroke();
   }

}
//eraser is just white with heavier stroke

$(document).ready(function() {
   var isDrawing = false;

   createPallete();
   createBrushes();

   $('.color').click( function() {
       currentColor = $(this).css('background-color');
       console.log(currentColor);
   });

   $('#canvas').on('mousedown', function(e) {
       isDrawing = true;

       var ctx = $(this)[0].getContext('2d');

       var x = e.offsetX;
       var y = e.offsetY;
   
       ctx.beginPath();
       ctx.moveTo(x,y);
   });

   $('#canvas').on('mousemove', function(e) {
       if (isDrawing) {
           var ctx = $(this)[0].getContext('2d');

	   ctx.strokeStyle = currentColor;
           ctx.lineWidth = lineWidth;
	   console.log(lineWidth);

           var x = e.offsetX;
           var y = e.offsetY;

           ctx.lineTo(x,y);
           ctx.stroke();
       }
   });

   $('#canvas').on('mouseup', function() {
       isDrawing = false;
   });
})
