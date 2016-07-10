/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global objectNum */

var canvas,
        context,
        width = 800,
        height = 450;





var mCurrentTime,
        mElapsedTime,
        mPreviousTime = Date.now(),
        mLagTime = 0;
var kFPS = 60;          // Frames per second
var kFrameTime = 1 / kFPS;
var kMPF = 1000 * kFrameTime; // Milliseconds per frame.
var mAllObject = [];



var loop = function () {
    requestAnimationFrame(function () {
        loop();
    });

    //      compute how much time has elapsed since we last RunLoop was executed
    mCurrentTime = Date.now();
    mElapsedTime = mCurrentTime - mPreviousTime;
    mPreviousTime = mCurrentTime;
    mLagTime += mElapsedTime;

    //      Make sure we update the game the appropriate number of times.
    //      Update only every Milliseconds per frame.
    //      If lag larger then update frames, update until caught up.
    while (mLagTime >= kMPF) {
        mLagTime -= kMPF;
        fillInfo();
    }
    draw();
};


var fillInfo = function () {

    document.getElementById("objectId").innerHTML = "ObjectId: " + objectNum;
    document.getElementById("center").innerHTML = "Center: " + mAllObject[objectNum].mCenter.x + "," + mAllObject[objectNum].mCenter.y;
    document.getElementById("angle").innerHTML = "Angle: " + mAllObject[objectNum].mAngle;

};
var draw = function () {
    context.clearRect(0, 0, width, height);
    var i;
    for (i = 0; i < mAllObject.length; i++) {
        context.strokeStyle = 'blue';
        if (i === objectNum)
            context.strokeStyle = 'red';
        mAllObject[i].draw(context);
    }
};

canvas = document.getElementById('canvas');
context = canvas.getContext('2d');
canvas.height = height;
canvas.width = width;
loop();
