/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



/* global mAllObject, dt, gEngine */

function RigidShape(center,mass,friction,restitution) {
    this.mCenter = center;

    //angle
    this.mAngle = 0;
    
    this.mBoundRadius=0;

    gEngine.Core.mAllObject.push(this);
}


RigidShape.prototype.update = function () {
    var dt=gEngine.Core.mUpdateIntervalInSeconds;
    //s = v*t + 0.5*a*t^2
    this.move(this.mVelocity.scale(dt).add(this.mAcceleration.scale(dt * dt / 2)));
    //v += a*t
    this.mVelocity = this.mVelocity.add(this.mAcceleration.scale(dt));

    this.rotate(this.mAngularVelocity * dt + this.mAngularAcceleration * dt * dt / 2);

    this.mAngularVelocity += this.mAngularAcceleration * dt;
};

RigidShape.prototype.boundTest = function (otherShape) {
    var vFrom1to2 = otherShape.mCenter.subtract(this.mCenter);
    var rSum = this.mBoundRadius + otherShape.mBoundRadius;
    var dist = vFrom1to2.length();
    if (dist > Math.sqrt(rSum * rSum)) {
        //not overlapping
        return false;
    }
    return true;
};
