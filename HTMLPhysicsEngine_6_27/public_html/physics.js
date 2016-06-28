/*
 The following is not free software. You may use it for educational purposes, but you may not redistribute or use it commercially.
 (C) Burak Kanber 2012
 */
var canvas,
        context,
        width = 800,
        height = 800,
        dt = 0.02;

var mRelaxationCount = 15;                  // number of relaxation iteration
var mRelaxationOffset = 1 / mRelaxationCount; // porportion to apply when scaling friction
var mPosCorrectionRate = 0.8;               // percentage of separation to project objects
var mGravity = new Vec2(0, 150);


var mAllObject = [];

var loop = function () {
    requestAnimationFrame(function () {
        loop();
    });
    draw();
    collision();
    update();
    fillInfo()
};


var fillInfo = function () {
    
    document.getElementById("objectId").innerHTML ="ObjectId: "+ objectNum;
    document.getElementById("center").innerHTML ="Center: "+ mAllObject[objectNum].mCenter.x +","+ mAllObject[objectNum].mCenter.y;
    document.getElementById("velocity").innerHTML ="Velocity: "+ mAllObject[objectNum].v.x +","+ mAllObject[objectNum].v.y;
    document.getElementById("omega").innerHTML ="Omega: "+ mAllObject[objectNum].omega;
    document.getElementById("mass").innerHTML ="Mass: "+ 1/mAllObject[objectNum].mMass;
    document.getElementById("friction").innerHTML ="Friction: "+ mAllObject[objectNum].mFriction;
    document.getElementById("restitution").innerHTML ="Restitution: "+ mAllObject[objectNum].mRestitution;

}
var draw = function () {
    context.clearRect(0, 0, width, height);
    var i;
    for (i = 0; i < mAllObject.length; i++) {
        context.strokeStyle = 'blue';
        if(i==objectNum)
            context.strokeStyle = 'red';
        mAllObject[i].draw(context);
    }
};

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

    //newV = V + omega cross R
    var v1 = s1.v.add(new Vec2(-1 * s1.omega * r1.y, s1.omega * r1.x));
    var v2 = s2.v.add(new Vec2(-1 * s2.omega * r2.y, s2.omega * r2.x));
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
    s1.v = s1.v.subtract(impulse.scale(s1.mMass));
    s2.v = s2.v.add(impulse.scale(s2.mMass));
    
    //torque = R cross F = alpha * Inertia
    // (R cross F) dt = (alpha * Inertia) dt
    // R cross Inpulse = △omega * Inertia
    // Inpulse = j * N
    // △omega=R cross N * j / Inertia;
    s1.omega -= RcrossN1 * j * s1.mInertia;
    s2.omega += RcrossN2 * j * s2.mInertia;


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

    s1.v = s1.v.subtract(impulse.scale(s1.mMass));
    s2.v = s2.v.add(impulse.scale(s2.mMass));
    s1.omega -= RcrossN1 * j2 * s1.mInertia;
    s2.omega += RcrossN2 * j2 * s2.mInertia;


}

var drawCollisionInfo = function (collisionInfo) {
    context.beginPath();
    context.moveTo(collisionInfo.mStart.x, collisionInfo.mStart.y);
    context.lineTo(collisionInfo.mEnd.x, collisionInfo.mEnd.y);
    context.closePath();
    context.lineWidth = 2.0;
    context.strokeStyle = "black";
    context.stroke();
}
var update = function () {
    var i;
    for (i = 0; i < mAllObject.length; i++) {
        mAllObject[i].update(context);
        
        //add gravity
        if (mAllObject[i].mMass != 0)
            mAllObject[i].a = mGravity;
    }
};
canvas = document.getElementById('canvas'),
        context = canvas.getContext('2d'),
        loop();

