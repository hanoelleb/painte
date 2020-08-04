var loaded = false;

var words = [];
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var text = xmlhttp.responseText;
        words = text.split('\n');
	loaded = true;
    }
}

xmlhttp.open("GET", "words.txt", true);
xmlhttp.send();

//default color is black

var socket = io();

var currentColor = '#000000';
var lineWidth = 5;

var startX = 0;
var startY = 0;

var colors = [
  '#FF9999',
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
	box.style.cssText = 'width: 25px; height: 25px; background-color: ' 
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
   socket.on('message', function(msg){
      $('#log').append($('<p>').text(msg));
    });

   socket.on('player', function(nickname){
      $('#players').append($('<label>').text(nickname));
   });

   socket.on('draw', function(data) {
       //startX, startY, x, y
       var ctx = $('#canvas')[0].getContext('2d');
       ctx.beginPath();
       ctx.moveTo(data[0], data[1]);

       ctx.strokeStyle = data[4];
       ctx.lineWidth = data[5];

       ctx.lineTo(data[2],data[3]);
       ctx.stroke();
   });

   var hasStarted = false;
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

       startX = x;
       startY = y;
   
       ctx.beginPath();
       ctx.moveTo(x,y);
   });

   $('#player-form').on('submit', function(event) {
       event.preventDefault();
       hasStarted = true;
       var nickname = $('#nickname').val();
       socket.emit('player', nickname);
       $(this).hide();
       return false;
   });

   $('#canvas').on('mousemove', function(e) {
       if (isDrawing && hasStarted) {
           var ctx = $(this)[0].getContext('2d');

	   ctx.strokeStyle = currentColor;
           ctx.lineWidth = lineWidth;

           var x = e.offsetX;
           var y = e.offsetY;

           ctx.lineTo(x,y);
           ctx.stroke();

	   socket.emit('draw', 
	       [startX, startY, x, y, currentColor, lineWidth]);

	   startX = x;
	   startY = y;
       }
   });

   $('#holder').on('mouseup', function() {
       isDrawing = false;
   });

   $('#send').on('submit', function(event) {
       event.preventDefault();
       var message = $('#message').val();
       socket.emit('message', message);
       $('#message').val('');
       return false;
   });
})
