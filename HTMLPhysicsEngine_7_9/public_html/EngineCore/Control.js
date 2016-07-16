/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global mAllObject */

var objectNum = 0;
function control(event)
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
        objectNum = keycode - 48;
    }
    if (keycode === 38) {
        //up arrow
        objectNum--;
    }
    if (keycode === 40) {
        // down arrow
        objectNum++;
    }
    if (keycode === 87) {
        //W
        mAllObject[objectNum].move(new Vec2(0, -10));
    }
    if (keycode === 83) {
        // S
        mAllObject[objectNum].move(new Vec2(0, +10));
    }
    if (keycode === 65) {
        //A
        mAllObject[objectNum].move(new Vec2(-10, 0));
    }
    if (keycode === 68) {
        //D
        mAllObject[objectNum].move(new Vec2(10, 0));
    }
    if (keycode === 81) {
        //Q

        mAllObject[objectNum].rotate(-0.1);
    }
    if (keycode === 69) {
        //E

        mAllObject[objectNum].rotate(0.1);
    }

    if (keycode === 73) {
        //I
        mAllObject[objectNum].mVelocity.y -= 1;
    }
    if (keycode === 75) {
        // k
        mAllObject[objectNum].mVelocity.y += 1;
    }
    if (keycode === 74) {
        //j
        mAllObject[objectNum].mVelocity.x -= 1;
    }
    if (keycode === 76) {
        //l
        mAllObject[objectNum].mVelocity.x += 1;
    }
    if (keycode === 85) {
        //U

        mAllObject[objectNum].mAngluarVelocity-=0.1;
    }
    if (keycode === 79) {
        //O

        mAllObject[objectNum].mAngluarVelocity+=0.1;
    }



    if (keycode === 90) {
        //Z
        var mass=1/mAllObject[objectNum].mMass;
        mass-=1;
        mAllObject[objectNum].mMass=1/mass;
    }
    if (keycode === 88) {
        //X
        var mass=1/mAllObject[objectNum].mMass;
        mass+=1;
        mAllObject[objectNum].mMass=1/mass;
    }
    if (keycode === 67) {
        //C

        mAllObject[objectNum].mFriction-=0.01;
    }
    if (keycode === 86) {
        //V

        mAllObject[objectNum].mFriction+=0.01;
    }
    if (keycode === 66) {
        //B

        mAllObject[objectNum].mRestitution-=0.01;
    }
    if (keycode === 78) {
        //N

        mAllObject[objectNum].mRestitution+=0.01;
    }


    if (keycode === 70) {
        //f
        var r1 = new Rectangle(new Vec2(mAllObject[objectNum].mCenter.x, mAllObject[objectNum].mCenter.y), Math.random() * 30+10, Math.random() * 30+10, Math.random() * 30, Math.random(), Math.random());
        r1.mVelocity = new Vec2(Math.random() * 300 - 150, Math.random() * 300 - 150);
    }
    if (keycode === 71) {
        //g
        var r1 = new Circle(new Vec2(mAllObject[objectNum].mCenter.x, mAllObject[objectNum].mCenter.y), Math.random() * 10 + 20, Math.random() * 30, Math.random(), Math.random());
        r1.mVelocity = new Vec2(Math.random() * 300 - 150, Math.random() * 300 - 150);
    }



}