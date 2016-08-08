/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global gObjectNum */

/**
 * Static refrence to gEngine
 * @type gEngine
 */
var gEngine = gEngine || {};
// initialize the variable while ensuring it is not redefined
gEngine.Core = (function () {
    var mCanvas,
            mContext,
            mWidth = 800,
            mHeight = 450;
            
    mCanvas = document.getElementById('canvas');
    mContext = mCanvas.getContext('2d');
    mCanvas.height = mHeight;
    mCanvas.width = mWidth;

    var mCurrentTime,
            mElapsedTime,
            mPreviousTime = Date.now(),
            mLagTime = 0;
    var kFPS = 60;          // Frames per second
    var kFrameTime = 1 / kFPS;
    var mUpdateIntervalInSeconds = kFrameTime;
    var kMPF = 1000 * kFrameTime; // Milliseconds per frame.
    var mAllObject = [];

    var runGameLoop = function () {
        requestAnimationFrame(function () {
            runGameLoop();
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
            update();
        }
        updateUIEcho();
        draw();
    };

    var updateUIEcho = function () {
        document.getElementById("uiEchoString").innerHTML = 
                "<p><b>Selected Object:</b>:</p>" +
                "<ul style=\"margin:-10px\">" +
                    "<li>Id: " + gObjectNum + "</li>" +
                    "<li>Center: " + mAllObject[gObjectNum].mCenter.x.toPrecision(3) + "," + mAllObject[gObjectNum].mCenter.y.toPrecision(3) + "</li>"  + 
                    "<li>Angle: " + mAllObject[gObjectNum].mAngle.toPrecision(3) + "</li>"  +
                "</ul> <hr>" +
                "<p><b>Control</b>: of selected object</p>" +
                "<ul style=\"margin:-10px\">" +
                    "<li><b>Num</b> or <b>Up/Down Arrow</b>: Select Object</li>" +
                    "<li><b>WASD</b> + <b>QE</b>: Position [Move + Rotate]</li>" +
                "</ul> <hr>" +
                "<b>F/G</b>: Spawn [Rectangle/Circle] at selected object" +
                "<p><b>H</b>: Fix object</p>" +
                "<p><b>R</b>: Reset System</p>" +
                "<hr>";
    };
    var draw = function () {
        mContext.clearRect(0, 0, mWidth, mHeight);
        var i;
        for (i = 0; i < mAllObject.length; i++) {
            mContext.strokeStyle = 'blue';
            if (i === gObjectNum)
                mContext.strokeStyle = 'red';
            mAllObject[i].draw(mContext);
        }
    };

    var update = function () {
        var i;
        for (i = 0; i < mAllObject.length; i++) {
            mAllObject[i].update(mContext);
        }
    };

    var initializeEngineCore = function () {
        runGameLoop();
    };
    var mPublic = {
        initializeEngineCore: initializeEngineCore,
        mAllObject: mAllObject,
        mWidth: mWidth,
        mHeight: mHeight,
        mContext: mContext
    };

    return mPublic;
}());