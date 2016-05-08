/* File: Minion.js 
 *
 * Creates and initializes a Minion object
 * overrides the update function of GameObject to define
 * simple sprite animation behavior behavior
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, GameObject, SpriteAnimateRenderable, RigidCircle, vec2 */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Minion(spriteTexture, atX, atY,id) {
    this.kSpeed = 5;
    this.mMinion = new SpriteAnimateRenderable(spriteTexture);
    this.kXDelta = 1;
    this.kYDelta = 2.0;
    this.kXDeltaPos = 0.2;
    this.kYDeltaPos = 0.2;
    this.Id=id;
    this.mMinion.setColor([1, 1, 1, 0]);
    this.mMinion.getXform().setPosition(atX, atY);
    this.mMinion.getXform().setSize(18, 14.4);
    this.mMinion.setSpriteSequence(512, 0,      // first element pixel position: top-left 512 is top of image, 0 is left of image
                                   204, 164,    // widthxheight in pixels
                                   5,           // number of elements in this sequence
                                   0);          // horizontal padding in between
    this.mMinion.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
    this.mMinion.setAnimationSpeed(30);
                                // show each element for mAnimSpeed updates
    GameObject.call(this, this.mMinion);

    var r = new RigidCircle(this.getXform(), 6.5);
    r.setMass(2);
    r.setAcceleration([0, 0]);
    r.setFriction(0);
    r.setColor([0, 1, 0, 1]);
    r.setDrawBounds(true);
   
    this.setPhysicsComponent(r);

    this.mHasCollision = false;
}
gEngine.Core.inheritPrototype(Minion, GameObject);

Minion.prototype.update = function () {
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
        this.mMinion.getXform().incYPosBy(this.kYDeltaPos);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.S)) {
       // v[1] -= this.kYDelta;
       this.mMinion.getXform().incYPosBy(-this.kYDeltaPos);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.A)) {
        //v[0] -= this.kXDelta;
        this.mMinion.getXform().incXPosBy(-this.kXDeltaPos);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
        //v[0] += this.kXDelta;
        this.mMinion.getXform().incXPosBy(this.kXDeltaPos);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Q)) {
        //v[0] += this.kXDelta;
        
        this.mMinion.getXform().incRotationByRad(-0.01);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.E)) {
        //v[0] += this.kXDelta;
       
        this.mMinion.getXform().incRotationByRad(0.01);
    }
    }
};

Minion.prototype.flipVelocity = function () {
    var v = this.getPhysicsComponent().getVelocity();
    vec2.scale(v, v, -1);
};

Minion.prototype.hasCollision = function () {
    this.mHasCollision = true;
};
