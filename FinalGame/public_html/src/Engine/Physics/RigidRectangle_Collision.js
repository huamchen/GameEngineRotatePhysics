/* 
 * File: RigidRectangle_Collision.js
 * Detects RigidRectangle collisions
 */

/*jslint node: true, vars:true , white: true*/
/*global RigidShape, RigidRectangle, vec2, LineRenderable */
/* find out more about jslint: http://www.jslint.com/help.html */
"use strict";

/**
 * Check if RigidShape contains position
 * @param {vec2} pos Position to check
 * @returns {Boolean} true if position is in RigidShape
 * @memberOf RigidRectangle
 */
RigidRectangle.prototype.containsPos = function (pos) {
    var rPos = this.getPosition();
    var rMinX = rPos[0] - this.getWidth() / 2;
    var rMaxX = rPos[0] + this.getWidth() / 2;
    var rMinY = rPos[1] - this.getHeight() / 2;
    var rMaxY = rPos[1] + this.getHeight() / 2;

    return ((rMinX < pos[0]) && (rMaxX > pos[0]) && 
            (rMinY < pos[1] && rMaxY > pos[1]));
};

RigidRectangle.prototype.getSupport=function(dir){
  var bestProjection=vec2.dot( this.mVertex[0], dir );
  var bestVertex=this.mVertex[0];
  var projection;
  for(var i = 1; i <this.mVertex.length; i++)
  {
    var v = this.mVertex[i];
    projection = vec2.dot( v, dir );
 
    if(projection > bestProjection)
    {
      bestVertex = v;
      bestProjection = projection;
    }
  }
  return bestVertex;
};
RigidRectangle.prototype.findAxisLeastPenetration=function(otherRect, collisionInfo){
  var faceNormal=[];
  var i;
  var n;
  var supportPoint=vec2.fromValues(0, 0);
  for(i = 0; i < 4; ++i)
    faceNormal[i]= vec2.fromValues(0, 0);
  vec2.subtract(faceNormal[0],this.mVertex[1],this.mVertex[2]);
  vec2.normalize(faceNormal[0],faceNormal[0]);
  vec2.subtract(faceNormal[1],this.mVertex[2],this.mVertex[3]);
  vec2.normalize(faceNormal[1],faceNormal[1]);
  vec2.subtract(faceNormal[2],this.mVertex[3],this.mVertex[0]);
  vec2.normalize(faceNormal[2],faceNormal[2]);
  vec2.subtract(faceNormal[3],this.mVertex[0],this.mVertex[1]);
  vec2.normalize(faceNormal[3],faceNormal[3]);

  
  var bestDistance=-99999;
  var bestIndex=null;
  
  for(i = 0; i < 4; ++i)
  {
    // Retrieve a face normal from A
    n = faceNormal[i];
    var dir= vec2.fromValues(0, 0);
    vec2.scale(dir,n,-1);
    // Retrieve support point from B along -n
    var s = otherRect.getSupport( dir );
 
    // Retrieve vertex on face from A, transform into
    // B's model space
    var v = vec2.fromValues(0, 0);
    vec2.subtract(v,s,this.mVertex[i]);
    // Compute penetration distance (in B's model space)
    var d = vec2.dot( n, v );
 
    // Store greatest distance
    if(d > bestDistance)
    {
      bestDistance = d;
      bestIndex = i;
      supportPoint=s;
    }
   

  }
  if(bestDistance>=0)
      return false;
  else
  {       

      vec2.scale(n,faceNormal[bestIndex],-bestDistance);
      vec2.add(n,supportPoint,n);    
      this.mNormal[0]=n;
      this.mNormal[1]=supportPoint;
      vec2.scale(n,faceNormal[bestIndex],-1);
      collisionInfo.setNormal(n);
      collisionInfo.setDepth(-bestDistance);
  } 
  return true;
};
/**
 * Check for collision between RigidRectangle and RigidRectangle
 * @param {RigidRectangle} r1 Rectangle object to check for collision status
 * @param {RigidRectangle} r2 Rectangle object to check for collision status against
 * @param {CollisionInfo} collisionInfo Collision info of collision
 * @returns {Boolean} true if collision occurs
 * @memberOf RigidRectangle
 */
RigidRectangle.prototype.collidedRectRect = function(r1, r2, collisionInfo) {
    var vFrom1to2 = vec2.fromValues(0, 0);
    vec2.sub(vFrom1to2, r2.getPosition(), r1.getPosition());
    var xDepth = (r1.getWidth() / 2) + (r2.getWidth() / 2) - Math.abs(vFrom1to2[0]);
    if (xDepth > 0) {
        var yDepth = (r1.getHeight() / 2) + (r2.getHeight() / 2) - Math.abs(vFrom1to2[1]);
        if (yDepth > 0)  {
            //axis of least penetration
            if (xDepth < yDepth) {
                if (vFrom1to2[0] < 0) {
                    collisionInfo.setNormal([-1, 0]);
                } else {
                    collisionInfo.setNormal([1, 0]);
                }
                collisionInfo.setDepth(xDepth);
            } else {
                if (vFrom1to2[1] < 0) {
                    collisionInfo.setNormal([0, -1]);
                } else {
                    collisionInfo.setNormal([0, 1]);
                }
                collisionInfo.setDepth(yDepth);
            }
            return true;
        }
    }
    return false;
};

/**
 * Check for collision between this and RigidShape
 * @param {RigidShape} otherShape RigidShape object to check for collision status against
 * @param {CollisionInfo} collisionInfo Collision info of collision
 * @returns {Boolean} true if collision occurs
 * @memberOf RigidRectangle
 */
RigidRectangle.prototype.collided = function(otherShape, collisionInfo) {
    var status = false;
    collisionInfo.setDepth(0);
    switch (otherShape.rigidType()) {
        case RigidShape.eRigidType.eRigidCircle:
            status = this.collidedRectCirc(this, otherShape, collisionInfo);
            break;
        case RigidShape.eRigidType.eRigidRectangle:
            //status = this.collidedRectRect(this, otherShape, collisionInfo);
            status = this.findAxisLeastPenetration(otherShape, collisionInfo);
            break;
    }
    return status;
};