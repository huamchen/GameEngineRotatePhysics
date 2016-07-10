/*
 The following is not free software. You may use it for educational purposes, but you may not redistribute or use it commercially.
 (C) Burak Kanber 2012
 */
/* global objectNum, context, mRelaxationCount, mAllObject, mPosCorrectionRate */



var collision = function () {
    var i, j, k;
    for (k = 0; k < mRelaxationCount; k++) {
        for (i = 0; i < mAllObject.length; i++) {
            for (j = i + 1; j < mAllObject.length; j++)
            {
                var collisionInfo = new CollisionInfo();
                if (mAllObject[i].collisionTest(mAllObject[j], collisionInfo))
                {
                    //make sure the normal is always from object[i] to object[j]
                    if (collisionInfo.getNormal().dot(mAllObject[j].mCenter.subtract(mAllObject[i].mCenter)) < 0)
                        collisionInfo.changeDir();

                    //draw collision info (a black line that shows normal)
                    drawCollisionInfo(collisionInfo);

                    resolveCollision(mAllObject[i], mAllObject[j], collisionInfo);
                }
            }
        }
    }
};

var positionalCorrection = function (s1, s2, collisionInfo) {
    var s1InvMass = s1.mMass;
    var s2InvMass = s2.mMass;

    var num = collisionInfo.getDepth() / (s1InvMass + s2InvMass) * mPosCorrectionRate;
    var correctionAmount = collisionInfo.getNormal().scale(num);

    s1.move(correctionAmount.scale(-s1InvMass));
    s2.move(correctionAmount.scale(s2InvMass));
};

var resolveCollision = function (s1, s2, collisionInfo) {

    if ((s1.mMass + s2.mMass) === 0)
        return;

    //  correct positions
    positionalCorrection(s1, s2, collisionInfo);



    var n = collisionInfo.getNormal();
    //r is vector from center of object to collision point
    var r1 = collisionInfo.mStart.subtract(s1.mCenter);
    var r2 = collisionInfo.mStart.subtract(s2.mCenter);

    //newV = V + mAngluarVelocity cross R
    var v1 = s1.mVelocity.add(new Vec2(-1 * s1.mAngluarVelocity * r1.y, s1.mAngluarVelocity * r1.x));
    var v2 = s2.mVelocity.add(new Vec2(-1 * s2.mAngluarVelocity * r2.y, s2.mAngluarVelocity * r2.x));
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

    //R cross N
    var RcrossN1 = r1.cross(n);
    var RcrossN2 = r2.cross(n);

    // Calc impulse scalar
    // the formula of j can be found in http://www.myphysicslab.com/collision.html
    var j = -(1 + newRestituion) * rVelocityInNormal;
    j = j / (s1.mMass + s2.mMass + RcrossN1 * RcrossN1 * s1.mInertia + RcrossN2 * RcrossN2 * s2.mInertia);

    //impulse is in direction of normal ( from s1 to s2)
    var impulse = n.scale(j);

    //impulse = F dt = m * △v
    // △v = impulse / m
    s1.mVelocity = s1.mVelocity.subtract(impulse.scale(s1.mMass));
    s2.mVelocity = s2.mVelocity.add(impulse.scale(s2.mMass));

    //torque = R cross F = mAngluarAcceleration * Inertia
    // (R cross F) dt = (mAngluarAcceleration * Inertia) dt
    // R cross Inpulse = △mAngluarVelocity * Inertia
    // Inpulse = j * N
    // △mAngluarVelocity=R cross N * j / Inertia;
    s1.mAngluarVelocity -= RcrossN1 * j * s1.mInertia;
    s2.mAngluarVelocity += RcrossN2 * j * s2.mInertia;


    var tangent = relativeVelocity.subtract(n.scale(relativeVelocity.dot(n)));

    //relativeVelocity.dot(tangent) should less than 0
    tangent = tangent.normalize().scale(-1);

    RcrossN1 = r1.cross(tangent);
    RcrossN2 = r2.cross(tangent);

    var j2 = -(1 + newRestituion) * relativeVelocity.dot(tangent) * newFriction;
    j2 = j2 / (s1.mMass + s2.mMass + RcrossN1 * RcrossN1 * s1.mInertia + RcrossN2 * RcrossN2 * s2.mInertia);

    //friction should less than force in normal direction
    if (j2 > j)
        j2 = j;

    //impulse is from s1 to s2 (in opposite direction of velocity)
    impulse = tangent.scale(j2);

    s1.mVelocity = s1.mVelocity.subtract(impulse.scale(s1.mMass));
    s2.mVelocity = s2.mVelocity.add(impulse.scale(s2.mMass));
    s1.mAngluarVelocity -= RcrossN1 * j2 * s1.mInertia;
    s2.mAngluarVelocity += RcrossN2 * j2 * s2.mInertia;


};

var drawCollisionInfo = function (collisionInfo) {
    context.beginPath();
    context.moveTo(collisionInfo.mStart.x, collisionInfo.mStart.y);
    context.lineTo(collisionInfo.mEnd.x, collisionInfo.mEnd.y);
    context.closePath();
    context.lineWidth = 2.0;
    context.strokeStyle = "black";
    context.stroke();
};



