/*
 The following is not free software. You may use it for educational purposes, but you may not redistribute or use it commercially.
 (C) Burak Kanber 2012
 */
var canvas,
        context,
        width = 400,
        height = 400,
        dt=0.02;

var mRelaxationCount = 15;                  // number of relaxation iteration
var mRelaxationOffset = 1 / mRelaxationCount; // porportion to apply when scaling friction
var mPosCorrectionRate = 0.8;               // percentage of separation to project objects
var mSystemtAcceleration = [0, 0];        // system-wide default acceleration
var mRelaxationLoopCount = 0;               // the current relaxation count


var mAllObject = [];
var loop = function () {
    requestAnimationFrame(function () {
        loop();
    });
    draw();
    collision();
    update();
};
var draw = function () {
    context.clearRect(0, 0, width, height);
    var i;
    for (i = 0; i < mAllObject.length; i++) {
        mAllObject[i].draw(context);
    }
};
var collision = function () {
    var i, j;
    for (i = 0; i < mAllObject.length; i++) {
        for (j = i + 1; j < mAllObject.length; j++)
        {
            var collisionInfo = new CollisionInfo();
            if (mAllObject[i].collisionTest(mAllObject[j], collisionInfo))
            {
                if(collisionInfo.getNormal().dot(mAllObject[j].mCenter.subtract(mAllObject[i].mCenter))<0)
                    collisionInfo.changeDir();
                drawCollisionInfo(mAllObject[i], mAllObject[j], collisionInfo);     
                resolveCollision(mAllObject[i], mAllObject[j], collisionInfo);
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
var applyFriction = function (n, v, f, m) {
    var tangent = new Vec2(n.y, n.x*(-1)); // perpendicular to n
    var tComponent = v.dot(tangent);
    if (Math.abs(tComponent) < 0.01)
        return;

    f *= m * mRelaxationOffset;
    if (tComponent < 0) {
        tangent=tangent.scale(-f);
    } else {
        tangent=tangent.scale(f);
    }
    v=v.subtract(tangent);
};
var resolveCollision = function (s1, s2, collisionInfo) {
    
     if((s1.mMass+s2.mMass)===0)
        return ;

    // Step B: correct positions
    positionalCorrection(s1, s2, collisionInfo);

    // collision normal direction is _against_ s2
    // Step C: apply friction

    var n = collisionInfo.getNormal();
    applyFriction(n, s1.v, s1.mFriction, s1.mMass);
    applyFriction(n, s2.v, -s2.mFriction, s2.mMass);

    // Step D: compute relatively velocity of the colliding objects
    var relativeVelocity = s2.v.subtract(s1.v);

    // Step E: examine the component in the normal direction
    // Relative velocity in normal direction
    var rVelocityInNormal = relativeVelocity.dot(n);
    //if objects moving apart ignore
    if (rVelocityInNormal > 0) {
        return;
    }

    // Step F: compute and apply response impulses for each object
    var newRestituion = Math.min(s1.mRestitution, s2.mRestitution);
    // Calc impulse scalar
    var j = -(1 + newRestituion) * rVelocityInNormal;
    j = j / (s1.mMass + s2.mMass);

    var impulse = collisionInfo.getNormal().scale(j);

    s1.v=s1.v.subtract(impulse.scale(s1.mMass));
    s2.v=s2.v.add(impulse.scale(s2.mMass));
    s1.omega=s1.mCenter.subtract(collisionInfo.mStart).cross(impulse.scale(s1.mInertia))/1000;
    s2.omega=s2.mCenter.subtract(collisionInfo.mStart).cross(impulse.scale(-s2.mInertia))/1000;
}
var drawCollisionInfo = function (s1, s2, collisionInfo) {
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
    }
};
canvas = document.getElementById('canvas'),
        context = canvas.getContext('2d'),
        loop();

