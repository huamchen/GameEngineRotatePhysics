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
var mGravity=new Vec2(0,9.8);


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
var applyFriction = function (n,s) {
    var tangent = new Vec2(n.y, n.x*(-1)); // perpendicular to n
    var tComponent = s.v.dot(tangent);
    if (Math.abs(tComponent) < 0.01)
        return;

    s.mFriction *= s.mMass * mRelaxationOffset;
    if (tComponent < 0) {
        tangent=tangent.scale(-s.mFriction);
    } else {
        tangent=tangent.scale(s.mFriction);
    }
    s.v=s.v.subtract(tangent);
};
var resolveCollision = function (s1, s2, collisionInfo) {
    
     if((s1.mMass+s2.mMass)===0)
        return ;

    // Step B: correct positions
    positionalCorrection(s1, s2, collisionInfo);

    // collision normal direction is _against_ s2
    // Step C: apply friction

    var n = collisionInfo.getNormal();
    var r1=collisionInfo.mStart.subtract(s1.mCenter);
    var r2=collisionInfo.mStart.subtract(s2.mCenter);
    //applyFriction(n, s1);
    //applyFriction(n, s2);

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
    var newFriction = Math.min(s1.mFriction, s2.mFriction);
    // Calc impulse scalar
    
    var torque1=r1.cross(n);
    var torque2=r2.cross(n);
    var j = -(1 + newRestituion) * rVelocityInNormal;
    //j = j / (s1.mMass + s2.mMass);
    j = j / (s1.mMass + s2.mMass+torque1*torque1*s1.mInertia+torque2*torque2*s2.mInertia);

    var impulse = n.scale(j);

    s1.v=s1.v.subtract(impulse.scale(s1.mMass));
    s2.v=s2.v.add(impulse.scale(s2.mMass));
    
    s1.omega-=torque1*j*s1.mInertia;
    s2.omega+=torque2*j*s2.mInertia;
        
    var tangent = relativeVelocity.subtract(n.scale(relativeVelocity.dot(n)));
    tangent=tangent.normalize().scale(-1);
    
    torque1=r1.cross(tangent);
    torque2=r2.cross(tangent);
     

    var j2 = -(1 + newRestituion) * relativeVelocity.dot(tangent);
    j2 = j2 / (s1.mMass + s2.mMass+torque1*torque1*s1.mInertia+torque2*torque2*s2.mInertia);
    if(j2>j)
        j2=j;
    impulse = tangent.scale(j2);
    
  /*  s1.v=s1.v.subtract(impulse.scale(s1.mMass));
    s2.v=s2.v.add(impulse.scale(s2.mMass));
    if(s1.mType==1) 
    s1.omega-=torque1*j2*s1.mInertia;
    if(s2.mType==1) 
   s2.omega+=torque2*j2*s2.mInertia; 
   
   
   var relativeOmega=0;
    if(s1.mType==1)  relativeOmega+=s1.omega;
    if(s2.mType==1)  relativeOmega-=s2.omega;
    
    j2 = -(1 + newRestituion) * Math.abs(relativeOmega);
    j2 = j2 / (s1.mMass + s2.mMass+torque1*torque1*s1.mInertia+torque2*torque2*s2.mInertia);
    
    impulse = tangent.scale(j2);
       if(s1.mType==1) 
      s1.omega-=torque1*j2*s1.mInertia;
    if(s2.mType==1) 
      s2.omega+=torque2*j2*s2.mInertia; */
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
        if(mAllObject[i].mMass!=0)
            mAllObject[i].a=mGravity;
    }
};
canvas = document.getElementById('canvas'),
        context = canvas.getContext('2d'),
        loop();

