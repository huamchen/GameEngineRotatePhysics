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
            for (i = 0; i < gEngine.Core.mAllObject.length; i++) {
                for (j = i + 1; j < gEngine.Core.mAllObject.length; j++)
                {
                    var collisionInfo = new CollisionInfo();
                    if (gEngine.Core.mAllObject[i].collisionTest(gEngine.Core.mAllObject[j], collisionInfo))
                    {
                        //make sure the normal is always from object[i] to object[j]
                        if (collisionInfo.getNormal().dot(gEngine.Core.mAllObject[j].mCenter.subtract(gEngine.Core.mAllObject[i].mCenter)) < 0)
                            collisionInfo.changeDir();

                        //draw collision info (a black line that shows normal)
                        drawCollisionInfo(collisionInfo,gEngine.Core.mContext);
                    }
                }
            }
        }
    };

    var drawCollisionInfo = function (collisionInfo,context) {
        context.beginPath();
        context.moveTo(collisionInfo.mStart.x, collisionInfo.mStart.y);
        context.lineTo(collisionInfo.mEnd.x, collisionInfo.mEnd.y);
        context.closePath();
        context.strokeStyle = "black";
        context.stroke();
    };

    var mPublic = {
        collision:collision
    };

    return mPublic;
}());

