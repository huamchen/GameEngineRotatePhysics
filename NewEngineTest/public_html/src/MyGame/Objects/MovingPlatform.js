/* File: Platform.js 
 *
 * Creates and initializes a ploatform object
 */

/*jslint node: true, vars: true */
/*global gEngine, GameObject, TextureRenderable, RigidRectangle */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MovingPlatform(texture, atX, atY,id) {
    this.mPlatform = new TextureRenderable(texture);
    this.kXDelta = 1;
    this.kYDelta = 2.0;
    this.kXDeltaPos = 0.2;
    this.kYDeltaPos = 0.2;
    this.Id=id;
    this.mPlatform.setColor([1, 1, 1, 0]);
    this.mPlatform.getXform().setPosition(atX, atY);
    this.mPlatform.getXform().setSize(20, 20);
    
                                // show each element for mAnimSpeed updates
    GameObject.call(this, this.mPlatform);

    var rigidShape = new RigidRectangle(this.getXform(), 10, 10);
    rigidShape.setMass(1);  // ensures no movements!
    rigidShape.setRestitution(0.5);
    rigidShape.setDrawBounds(true);
    rigidShape.setColor([1, 0.2, 0.2, 1]);
    this.setPhysicsComponent(rigidShape);
}
gEngine.Core.inheritPrototype(MovingPlatform, GameObject);

MovingPlatform.prototype.update = function () {
    // must call super class update
    GameObject.prototype.update.call(this);
 
    // control by WASD
    var v = this.getPhysicsComponent().getVelocity();
    
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.One)) {
        whichObject=1;
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Two)) {
        whichObject=2;
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Three)) {
        whichObject=3;
    }
    if(this.Id==whichObject)
    {
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.W)) {
        //v[1] += this.kYDelta;
        this.mPlatform.getXform().incYPosBy(this.kYDeltaPos);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.S)) {
       // v[1] -= this.kYDelta;
       this.mPlatform.getXform().incYPosBy(-this.kYDeltaPos);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.A)) {
        //v[0] -= this.kXDelta;
        this.mPlatform.getXform().incXPosBy(-this.kXDeltaPos);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
        //v[0] += this.kXDelta;
        this.mPlatform.getXform().incXPosBy(this.kXDeltaPos);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Q)) {
        //v[0] += this.kXDelta;
        this.getPhysicsComponent().mTheta-=0.01;
        this.mPlatform.getXform().incRotationByRad(-0.01);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.E)) {
        //v[0] += this.kXDelta;
        this.getPhysicsComponent().mTheta+=0.01;
        this.mPlatform.getXform().incRotationByRad(0.01);
    }
    }
};