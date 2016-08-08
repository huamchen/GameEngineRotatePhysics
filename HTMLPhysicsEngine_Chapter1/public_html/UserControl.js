/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global mAllObject, gEngine */


function userControl(event)
{
    var keycode;
    var width = gEngine.Core.mWidth;
    var height = gEngine.Core.mHeight;
    var context = gEngine.Core.mContext;
    if (window.event) // IE 
    {
        //alert('ie');
        keycode = event.keyCode;
    }
    else if (event.which) // Netscape/Firefox/Opera
    {
        //alert('firefox ');
        keycode = event.which;
    }
    if (keycode === 70) {
        //f
        //create new Rectangle in random position
        context.strokeRect(Math.random()*width*0.8, Math.random()*height*0.8, Math.random() * 30 + 10, Math.random() * 30 + 10);
    }
    if (keycode === 71) {
        //g
        //create new Circle in random position
        context.beginPath();
        //draw a circle
        context.arc(Math.random()*width*0.8, Math.random()*height*0.8, Math.random() * 30 + 10, 0, Math.PI * 2, true);
        context.closePath(); 
        context.stroke();
    }
}