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

    if (keycode === 73) {
        //I
        gEngine.Core.mAllObject[gObjectNum].mVelocity.y -= 1;
    }
    if (keycode === 75) {
        // k
        gEngine.Core.mAllObject[gObjectNum].mVelocity.y += 1;
    }
    if (keycode === 74) {
        //j
        gEngine.Core.mAllObject[gObjectNum].mVelocity.x -= 1;
    }
    if (keycode === 76) {
        //l
        gEngine.Core.mAllObject[gObjectNum].mVelocity.x += 1;
    }
    if (keycode === 85) {
        //U

        gEngine.Core.mAllObject[gObjectNum].mAngularVelocity -= 0.1;
    }
    if (keycode === 79) {
        //O

        gEngine.Core.mAllObject[gObjectNum].mAngularVelocity += 0.1;
    }

    if (keycode === 90) {
        //Z
        gEngine.Core.mAllObject[gObjectNum].updateMass(-1);
    }
    if (keycode === 88) {
        //X
        gEngine.Core.mAllObject[gObjectNum].updateMass(1);
    }
    if (keycode === 67) {
        //C

        gEngine.Core.mAllObject[gObjectNum].mFriction -= 0.01;
    }
    if (keycode === 86) {
        //V
        
        gEngine.Core.mAllObject[gObjectNum].mFriction += 0.01;
    }
    if (keycode === 66) {
        //B

        gEngine.Core.mAllObject[gObjectNum].mRestitution -= 0.01;
    }
    if (keycode === 78) {
        //N

        gEngine.Core.mAllObject[gObjectNum].mRestitution += 0.01;
    }
    if (keycode === 188) {
        //，

        gEngine.Core.mGravity.y -= 1;
    }
    if (keycode === 190) {
        //.

        gEngine.Core.mGravity.y += 1;
    }
    if (keycode === 70) {
        //f
        var r1 = new Rectangle(new Vec2(gEngine.Core.mAllObject[gObjectNum].mCenter.x, gEngine.Core.mAllObject[gObjectNum].mCenter.y), Math.random() * 30 + 10, Math.random() * 30 + 10, Math.random() * 30, Math.random(), Math.random());
     //   r1.mVelocity = new Vec2(Math.random() * 300 - 150, Math.random() * 300 - 150);
    }
    if (keycode === 71) {
        //g
        var r1 = new Circle(new Vec2(gEngine.Core.mAllObject[gObjectNum].mCenter.x, gEngine.Core.mAllObject[gObjectNum].mCenter.y), Math.random() * 10 + 20, Math.random() * 30, Math.random(), Math.random());
     //   r1.mVelocity = new Vec2(Math.random() * 300 - 150, Math.random() * 300 - 150);
    }

    if (keycode === 72) {
        //H
        var i;
        for (i = 0; i < gEngine.Core.mAllObject.length; i++) {
            if (gEngine.Core.mAllObject[i].mInvMass !== 0)
                gEngine.Core.mAllObject[i].mVelocity = new Vec2(Math.random() * 20 - 10, Math.random() * 20 - 10);
        }
    }
    if (keycode === 82) {
        //R
        gEngine.Core.mAllObject.splice(5,gEngine.Core.mAllObject.length);
        gObjectNum = 0;
    }
}