/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var objectNum = 0;
function control(event)
{
    var keycode

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
        objectNum = keycode - 48;
    }
    if (keycode == 38) {
        //up arrow
        objectNum--;
    }
    if (keycode == 40) {
        // down arrow
        objectNum++;
    }
    if (keycode == 87) {
        //W
        mAllObject[objectNum].move(new Vec2(0, -10));
    }
    if (keycode == 83) {
        // S
        mAllObject[objectNum].move(new Vec2(0, +10));
    }
    if (keycode == 65) {
        //A
        mAllObject[objectNum].move(new Vec2(-10, 0));
    }
    if (keycode == 68) {
        //D
        mAllObject[objectNum].move(new Vec2(10, 0));
    }
    if (keycode == 81) {
        //Q

        mAllObject[objectNum].rotate(-0.01);
    }
    if (keycode == 69) {
        //E

        mAllObject[objectNum].rotate(0.01);
    }
    if (keycode == 70) {
        //f
        var r1 = new Rectangle(new Vec2(mAllObject[objectNum].mCenter.x, mAllObject[objectNum].mCenter.y), Math.random() * 30, Math.random() * 30, Math.random() * 30,Math.random(),Math.random());
        r1.v=new Vec2(Math.random()*300-150,Math.random()*300-150);
    }
    if (keycode == 71) {
        //g
        var r1 = new Circle(new Vec2(mAllObject[objectNum].mCenter.x, mAllObject[objectNum].mCenter.y), Math.random() * 10 + 20, Math.random() * 30,Math.random(),Math.random());
        r1.v=new Vec2(Math.random()*300-150,Math.random()*300-150);
    }
    if (keycode == 72) {
        //h
        mAllObject[objectNum].omega += 0.01;
    }
}