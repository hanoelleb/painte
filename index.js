$(document).ready(function() {
   var isDrawing = false;

   $('#canvas').on('mouseover', function() {
       console.log('in canvas');
   });

   $('#canvas').on('mousedown', function(e) {
       isDrawing = true;

       var ctx = $(this)[0].getContext('2d');

       var x = e.clientX;
       var y = e.clientY;
   
       ctx.beginPath();
       ctx.moveTo(x,y);

       console.log('holding');
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
