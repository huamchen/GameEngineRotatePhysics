/* 
 * File: RigidRectangle.js
 * Defines a rigid Rectangle
 */

/*jslint node: true, vars:true , white: true*/
/*global gEngine, RigidShape, vec2, LineRenderable */
/* find out more about jslint: http://www.jslint.com/help.html */
"use strict";

/**
 * 
 * @param {Transform} xform Transform object
 * @param {Number} w Width of rectangle
 * @param {Number} h Height of rectangle
 * @returns {RigidRectangle} New instance of RigidRectangle
 * @class RigidRectangle
 */
function RigidRectangle(xform, w, h) {
    RigidShape.call(this, xform);
    this.mSides = new LineRenderable();
    this.mInertia=this.mInvMass * (h * h + w * w) ;
    this.mWidth = w;
    this.mHeight = h;
    var x = this.getPosition()[0];
    var y = this.getPosition()[1];
    this.mVertex=[];//0--TopLeft;1--TopRight;2--BottomRight;3--BottomLeft
    this.mTopLeft=null;
    this.mTopRight=null;
    this.mBottomRight=null;
    this.mBottomLeft=null;

}
gEngine.Core.inheritPrototype(RigidRectangle, RigidShape);

/**
 * Return the type of Rigidshape
 * @returns {enum|eRigidType}
 * @memberOf RigidRectangle
 */
RigidRectangle.prototype.rigidType = function () {
    return RigidShape.eRigidType.eRigidRectangle;
};
RigidRectangle.prototype.rotate = function(angle) {
    var center = this.getPosition();
    var i;
    for(i=0;i<this.mVertex.length;i++)
    {
        this.mVertex[i] = vec2.rotate(this.mVertex[i], center,angle);
    }
    return this;
};

/**
 * Draw function called by GameLoop
 * @param {Camera} aCamera Camera to draw too
 * @returns {void}
 * @memberOf RigidRectangle
 */
RigidRectangle.prototype.draw = function (aCamera) {
    if (!this.mDrawBounds) {
        return;
    }
    RigidShape.prototype.draw.call(this, aCamera);
    var x = this.getPosition()[0];
    var y = this.getPosition()[1];
    var w = this.mWidth/2;
    var h = this.mHeight/2;
    
    this.mVertex[0] =vec2.fromValues(x-w, y+h);
    this.mVertex[1]=vec2.fromValues(x+w, y+h);    
    this.mVertex[2]=vec2.fromValues(x+w, y-h);
    this.mVertex[3]=vec2.fromValues(x-w, y-h);

    this.rotate(this.mTheta);
    
    this.mSides.setFirstVertex(this.mVertex[0][0],this.mVertex[0][1]);  //TOP LEFT
    this.mSides.setSecondVertex(this.mVertex[1][0],this.mVertex[1][1]); //TOP RIGHT
    this.mSides.draw(aCamera);
    this.mSides.setFirstVertex(this.mVertex[2][0],this.mVertex[2][1]); //BOTTOM RIGHT
    this.mSides.draw(aCamera);
    this.mSides.setSecondVertex(this.mVertex[3][0],this.mVertex[3][1]); //BOTTOM LEFT
    this.mSides.draw(aCamera);
    this.mSides.setFirstVertex(this.mVertex[0][0],this.mVertex[0][1]); //TOP LEFT
    this.mSides.draw(aCamera);
};

/**
 * Return the width of the rectangle
 * @returns {Number} Width of rectangle
 * @memberOf RigidRectangle
 */
RigidRectangle.prototype.getWidth = function () { return this.mWidth; };

/**
 * Return the height of the rectangle
 * @returns {Number} Height of rectangle
 * @memberOf RigidRectangle
 */
RigidRectangle.prototype.getHeight = function () { return this.mHeight; };

/**
 * Set the Color of the position marker and sides
 * @param {Float[]} color new color of marker and sides [R, G, B, A]
 * @returns {void}
 * @memberOf RigidRectangle
 */
RigidRectangle.prototype.setColor = function (color) {
    RigidShape.prototype.setColor.call(this, color);
    this.mSides.setColor(color);
};