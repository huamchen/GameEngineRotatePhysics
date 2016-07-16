/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



/* global RigidShape */

var Rectangle = function (center, width, height, mass, friction, restitution) {

    RigidShape.call(this, center, mass, friction, restitution);
    this.mType = "Rectangle";


    this.mWidth = width;
    this.mHeight = height;



    //inertia=mass*width^2+height^2
    this.mInertia = this.mMass * (this.mWidth * this.mWidth + this.mHeight * this.mHeight);

    //change mass into 1/mass
    if (this.mMass !== 0)
    {
        this.mMass = 1 / this.mMass;
        this.mInertia = 1 / this.mInertia;
    }


    this.mVertex = [];
    this.faceNormal = [];

    //0--TopLeft;1--TopRight;2--BottomRight;3--BottomLeft
    this.mVertex[0] = new Vec2(center.x - width / 2, center.y - height / 2);
    this.mVertex[1] = new Vec2(center.x + width / 2, center.y - height / 2);
    this.mVertex[2] = new Vec2(center.x + width / 2, center.y + height / 2);
    this.mVertex[3] = new Vec2(center.x - width / 2, center.y + height / 2);

    //0--Top;1--Right;2--Bottom;3--Left
    //faceNormal is normal of face toward outside of rectangle
    this.faceNormal[0] = this.mVertex[1].subtract(this.mVertex[2]);
    this.faceNormal[0] = this.faceNormal[0].normalize();
    this.faceNormal[1] = this.mVertex[2].subtract(this.mVertex[3]);
    this.faceNormal[1] = this.faceNormal[1].normalize();
    this.faceNormal[2] = this.mVertex[3].subtract(this.mVertex[0]);
    this.faceNormal[2] = this.faceNormal[2].normalize();
    this.faceNormal[3] = this.mVertex[0].subtract(this.mVertex[1]);
    this.faceNormal[3] = this.faceNormal[3].normalize();



};

var prototype = Object.create(RigidShape.prototype);
prototype.constructor = Rectangle;
Rectangle.prototype = prototype;

Rectangle.prototype.rotate = function (angle) {
    this.mAngle += angle;
    var i;
    for (i = 0; i < this.mVertex.length; i++)
    {
        this.mVertex[i] = this.mVertex[i].rotate(this.mCenter, angle);
    }
    this.faceNormal[0] = this.mVertex[1].subtract(this.mVertex[2]);
    this.faceNormal[0] = this.faceNormal[0].normalize();
    this.faceNormal[1] = this.mVertex[2].subtract(this.mVertex[3]);
    this.faceNormal[1] = this.faceNormal[1].normalize();
    this.faceNormal[2] = this.mVertex[3].subtract(this.mVertex[0]);
    this.faceNormal[2] = this.faceNormal[2].normalize();
    this.faceNormal[3] = this.mVertex[0].subtract(this.mVertex[1]);
    this.faceNormal[3] = this.faceNormal[3].normalize();
    return this;
};

Rectangle.prototype.move = function (v) {
    var i;
    for (i = 0; i < this.mVertex.length; i++)
    {
        this.mVertex[i] = this.mVertex[i].add(v);
    }
    this.mCenter = this.mCenter.add(v);
    return this;
};

Rectangle.prototype.draw = function (context) {

    context.save();

    context.translate(this.mVertex[0].x, this.mVertex[0].y);
    context.rotate(this.mAngle);
    context.strokeRect(0, 0, this.mWidth, this.mHeight);

    context.restore();
};
