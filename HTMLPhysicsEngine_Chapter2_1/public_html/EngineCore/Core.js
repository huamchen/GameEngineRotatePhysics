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

    var mAllObject = [];



    var runGameLoop = function () {
        requestAnimationFrame(function () {
            runGameLoop();
        });

        updateUIEcho();
        draw();
    };


    var updateUIEcho = function () {

        document.getElementById("uiEchoString").innerHTML = 
                "<p><b>Selected Object:</b>:</p>" +
                "<ul style=\"margin:-10px\">" +
                    "<li>Id: " + gObjectNum + "</li>" +
                    "<li>Center: " + mAllObject[gObjectNum].mCenter.x.toPrecision(3) + "," + mAllObject[gObjectNum].mCenter.y.toPrecision(3) + "</li>"  + 
                  "</ul> <hr>" +
                "<p><b>Control</b>: of selected object</p>" +
                "<ul style=\"margin:-10px\">" +
                    "<li><b>Num</b> or <b>Up/Down Arrow</b>: Select Object</li>" +
                "</ul> <hr>" +
                "<b>F/G</b>: Spawn [Rectangle/Circle] at selected object" +
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