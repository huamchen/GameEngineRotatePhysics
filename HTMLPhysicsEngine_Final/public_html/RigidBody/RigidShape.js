/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



/* global mAllObject, dt, gEngine */

function RigidShape(center,mass,friction,restitution) {

    this.mCenter = center;

    if (mass !== undefined)
        this.mMass = mass;
    else
        this.mMass = 1;


    if (friction !== undefined)
       this.mFriction = friction; 
    else
        this.mFriction = 0.8;

    if (restitution !== undefined)
        this.mRestitution = restitution;
    else
        this.mRestitution = 0.2;


    this.mVelocity = new Vec2(0, 0);

    this.mAcceleration = new Vec2(0, 0);

    //angle
    this.mAngle = 0;
    

    //negetive-- clockwise
    //postive-- counterclockwise
    this.mAngluarVelocity = 0;
    

    this.mAngluarAcceleration = 0;

    gEngine.Core.mAllObject.push(this);
}






RigidShape.prototype.update = function () {
    var dt=gEngine.Core.dt;
    //s = v*t + 0.5*a*t^2
    this.move(this.mVelocity.scale(dt).add(this.mAcceleration.scale(dt * dt / 2)));
    //v += a*t
    this.mVelocity = this.mVelocity.add(this.mAcceleration.scale(dt));

    this.rotate(this.mAngluarVelocity * dt + this.mAngluarAcceleration * dt * dt / 2);

    this.mAngluarVelocity += this.mAngluarAcceleration * dt;
};
