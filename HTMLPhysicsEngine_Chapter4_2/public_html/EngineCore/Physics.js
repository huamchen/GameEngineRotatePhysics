/*
 The following is not free software. You may use it for educational purposes, but you may not redistribute or use it commercially.
 (C) Burak Kanber 2012
 */
/* global objectNum, context, mRelaxationCount, mAllObjects, mPosCorrectionRate */

var gEngine = gEngine || {};
// initialize the variable while ensuring it is not redefined

gEngine.Physics = (function () {

    var mPositionalCorrectionFlag=true;
    var mRelaxationCount = 15;                  // number of relaxation iteration
    var mRelaxationOffset = 1 / mRelaxationCount; // porportion to apply when scaling friction
    var mPosCorrectionRate = 0.8;               // percentage of separation to project objects
    var collision = function () {
        var i, j, k;
        for (k = 0; k < mRelaxationCount; k++) {
            for (i = 0; i < gEngine.Core.mAllObjects.length; i++) {
                for (j = i + 1; j < gEngine.Core.mAllObjects.length; j++)
                {
                    if (gEngine.Core.mAllObjects[i].boundTest(gEngine.Core.mAllObjects[j])) {
                        var collisionInfo = new CollisionInfo();
                        if (gEngine.Core.mAllObjects[i].collisionTest(gEngine.Core.mAllObjects[j], collisionInfo))
                        {
                            //make sure the normal is always from object[i] to object[j]
                            if (collisionInfo.getNormal().dot(gEngine.Core.mAllObjects[j].mCenter.subtract(gEngine.Core.mAllObjects[i].mCenter)) < 0)
                                collisionInfo.changeDir();

                            //draw collision info (a black line that shows normal)
                            drawCollisionInfo(collisionInfo, gEngine.Core.mContext);

                            resolveCollision(gEngine.Core.mAllObjects[i], gEngine.Core.mAllObjects[j], collisionInfo);
                        }
                    }
                }
            }
        }
    };

    var positionalCorrection = function (s1, s2, collisionInfo) {
        var s1InvMass = s1.mInvMass;
        var s2InvMass = s2.mInvMass;

        var num = collisionInfo.getDepth() / (s1InvMass + s2InvMass) * mPosCorrectionRate;
        var correctionAmount = collisionInfo.getNormal().scale(num);

        s1.move(correctionAmount.scale(-s1InvMass));
        s2.move(correctionAmount.scale(s2InvMass));
    };

    var resolveCollision = function (s1, s2, collisionInfo) {

        if ((s1.mInvMass === 0) && (s2.mInvMass === 0))
            return;

        //  correct positions
        if(gEngine.Physics.mPositionalCorrectionFlag)
            positionalCorrection(s1, s2, collisionInfo);

    };

    var drawCollisionInfo = function (collisionInfo, context) {
        context.beginPath();
        context.moveTo(collisionInfo.mStart.x, collisionInfo.mStart.y);
        context.lineTo(collisionInfo.mEnd.x, collisionInfo.mEnd.y);
        context.closePath();
        context.strokeStyle = "orange";
        context.stroke();
    };

    var mPublic = {
        collision: collision,
        mPositionalCorrectionFlag:mPositionalCorrectionFlag
    };

    return mPublic;
}());

