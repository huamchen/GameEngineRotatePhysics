/*
 The following is not free software. You may use it for educational purposes, but you may not redistribute or use it commercially.
 (C) Burak Kanber 2012
 */
/* global objectNum, context, mRelaxationCount, mAllObject, mPosCorrectionRate */

var gEngine = gEngine || { };
    // initialize the variable while ensuring it is not redefined

gEngine.Physics = (function () {

    var mRelaxationCount = 15;                  // number of relaxation iteration
    var mRelaxationOffset = 1 / mRelaxationCount; // porportion to apply when scaling friction
    var mPosCorrectionRate = 0.8;               // percentage of separation to project objects
    var collision = function () {
        var i, j, k;
        for (k = 0; k < mRelaxationCount; k++) {
            //specifically, i start from 5
            for (i = 5; i < gEngine.Core.mAllObject.length; i++) {
                for (j = i + 1; j < gEngine.Core.mAllObject.length; j++)
                {
                    if (gEngine.Core.mAllObject[i].boundTest(gEngine.Core.mAllObject[j])) {
                            gEngine.Core.mContext.strokeStyle = 'green';
                            gEngine.Core.mAllObject[i].draw(gEngine.Core.mContext);
                            gEngine.Core.mAllObject[j].draw(gEngine.Core.mContext);
                    }
                }
            }
        }
    };


    var mPublic = {
        collision:collision
    };
    
    

    return mPublic;
}());

