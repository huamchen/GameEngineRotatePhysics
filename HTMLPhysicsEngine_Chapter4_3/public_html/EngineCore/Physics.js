/*
 The following is not free software. You may use it for educational purposes, but you may not redistribute or use it commercially.
 (C) Burak Kanber 2012
 */
/* global objectNum, context, mRelaxationCount, mAllObject, mPosCorrectionRate */

var gEngine = gEngine || {};
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
                    if (gEngine.Core.mAllObject[i].boundTest(gEngine.Core.mAllObject[j])) {
                        var collisionInfo = new CollisionInfo();
                        if (gEngine.Core.mAllObject[i].collisionTest(gEngine.Core.mAllObject[j], collisionInfo))
                        {
                            //make sure the normal is always from object[i] to object[j]
                            if (collisionInfo.getNormal().dot(gEngine.Core.mAllObject[j].mCenter.subtract(gEngine.Core.mAllObject[i].mCenter)) < 0)
                                collisionInfo.changeDir();

                            //draw collision info (a black line that shows normal)
                            drawCollisionInfo(collisionInfo, gEngine.Core.mContext);

                            resolveCollision(gEngine.Core.mAllObject[i], gEngine.Core.mAllObject[j], collisionInfo);
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
        positionalCorrection(s1, s2, collisionInfo);

        var n = collisionInfo.getNormal();

        var v1 = s1.mVelocity;
        var v2 = s2.mVelocity;
        var relativeVelocity = v2.subtract(v1);

        // Relative velocity in normal direction
        var rVelocityInNormal = relativeVelocity.dot(n);

        //if objects moving apart ignore
        if (rVelocityInNormal > 0) {
            return;
        }

        // compute and apply response impulses for each object    
        var newRestituion = Math.min(s1.mRestitution, s2.mRestitution);
        var newFriction = Math.min(s1.mFriction, s2.mFriction);

        // Calc impulse scalar
        // the formula of j can be found in http://www.myphysicslab.com/collision.html
        var j = -(1 + newRestituion) * rVelocityInNormal;
        j = j / (s1.mInvMass + s2.mInvMass);

        //impulse is in direction of normal ( from s1 to s2)
        var impulse = n.scale(j);

        //impulse = F dt = m * △v
        // △v = impulse / m
        s1.mVelocity = s1.mVelocity.subtract(impulse.scale(s1.mInvMass));
        s2.mVelocity = s2.mVelocity.add(impulse.scale(s2.mInvMass));

    };

    var drawCollisionInfo = function (collisionInfo, context) {
        context.beginPath();
        context.moveTo(collisionInfo.mStart.x, collisionInfo.mStart.y);
        context.lineTo(collisionInfo.mEnd.x, collisionInfo.mEnd.y);
        context.closePath();
        context.strokeStyle = "black";
        context.stroke();
    };

    var mPublic = {
        collision: collision
    };

    return mPublic;
}());

