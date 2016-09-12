/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global mAllObject, gEngine */

var gObjectNum = 0;
function userControl(event)
{
    var keycode;

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
    if (keycode >= 48 && keycode <= 57)
    {
        if (keycode - 48 < gEngine.Core.mAllObject.length)
            gObjectNum = keycode - 48;
    }
    if (keycode === 38) {
        //up arrow
        if (gObjectNum > 0)
            gObjectNum--;
    }
    if (keycode === 40) {
        // down arrow
        if (gObjectNum < gEngine.Core.mAllObject.length-1)
            gObjectNum++;
    }
    if (keycode === 87) {
        //W
        gEngine.Core.mAllObject[gObjectNum].move(new Vec2(0, -10));
    }
    if (keycode === 83) {
        // S
        gEngine.Core.mAllObject[gObjectNum].move(new Vec2(0, +10));
    }
    if (keycode === 65) {
        //A
        gEngine.Core.mAllObject[gObjectNum].move(new Vec2(-10, 0));
    }
    if (keycode === 68) {
        //D
        gEngine.Core.mAllObject[gObjectNum].move(new Vec2(10, 0));
    }
    if (keycode === 81) {
        //Q

        gEngine.Core.mAllObject[gObjectNum].rotate(-0.1);
    }
    if (keycode === 69) {
        //E

        gEngine.Core.mAllObject[gObjectNum].rotate(0.1);
    }

    if (keycode === 70) {
        //f
        var r1 = new Rectangle(new Vec2(gEngine.Core.mAllObject[gObjectNum].mCenter.x, gEngine.Core.mAllObject[gObjectNum].mCenter.y), Math.random() * 30+10, Math.random() * 30+10);
    }
    if (keycode === 71) {
        //g
        var r1 = new Circle(new Vec2(gEngine.Core.mAllObject[gObjectNum].mCenter.x, gEngine.Core.mAllObject[gObjectNum].mCenter.y), Math.random() * 10 + 20);

    }
    if (keycode === 72) {
        //H
        if(gEngine.Core.mAllObject[gObjectNum].mFix===0)
            gEngine.Core.mAllObject[gObjectNum].mFix=1;
        else gEngine.Core.mAllObject[gObjectNum].mFix=0;
    }
    if (keycode === 82) {
        //R
        gEngine.Core.mAllObject.splice(5,gEngine.Core.mAllObject.length);
        gObjectNum = 0;
    }
}