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



    var loop = function () {
        requestAnimationFrame(function () {
            loop();
        });

        uiProperties();
        draw();
    };


    var uiProperties = function () {

        document.getElementById("objectId").innerHTML = "ObjectId: " + gObjectNum;
        document.getElementById("center").innerHTML = "Center: " + mAllObject[gObjectNum].mCenter.x + "," + mAllObject[gObjectNum].mCenter.y;
        document.getElementById("angle").innerHTML = "Angle: " + mAllObject[gObjectNum].mAngle;
 
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
        loop();
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