/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var objectNum=0;
function control(event)
{
    var keycode

    if(window.event) // IE 
    {
        //alert('ie');
        keycode = event.keyCode;
    }
    else if(event.which) // Netscape/Firefox/Opera浏
    {
        //alert('firefox ');
        keycode = event.which;
    }
    if(keycode>=48&&keycode<=57) 
    {
        objectNum=keycode-48;
    }
    if (keycode==87) {
        //W
        mAllObject[objectNum].move(new Vec2(0,-1));
    }
    if (keycode==83) {
       // S
       mAllObject[objectNum].move(new Vec2(0,+1));
    }
    if (keycode==65) {
        //A
        mAllObject[objectNum].move(new Vec2(-1,0));
    }
    if (keycode==68) {
        //D
         mAllObject[objectNum].move(new Vec2(1,0));
    }
    if (keycode==81) {
        //Q
        
        mAllObject[objectNum].rotate(-0.01);
    }
    if (keycode==69) {
        //E
       
        mAllObject[objectNum].rotate(0.01);
    }
    if(keycode==70){
        //f
        var r1 = new Rectangle (new Vec2(mAllObject[objectNum].mCenter.x,mAllObject[objectNum].mCenter.y),Math.random()*100,Math.random()*100);
    }
}