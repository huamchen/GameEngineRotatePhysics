/* 
 * File: RigidShape_Collision.js
 * Detects RigidPoint collisions
 */

/*jslint node: true, vars:true , white: true*/
/*global RigidShape, vec2, LineRenderable, gEngine, gEngine.Particle */
/* find out more about jslint: http://www.jslint.com/help.html */
"use strict";

/**
 * Clamp value to min and max
 * @param {Number} value to clamp
 * @param {Number} min Minimum value to clamp too
 * @param {Number} max Maximum value to clamp too
 * @returns {Number} clamped number of value
 * @memberOf RigidShape
 */
RigidShape.prototype.clamp = function (value, min, max) {
    return Math.min(Math.max(value, min), max);
};

/**
 * Check for collision between RigidRectangle and RigidCircle
 * @param {RigidRectangle} rect1Shape Rectangle object to check for collision status
 * @param {RigidCircle} circ2Shape Circle object to check for collision status against
 * @param {CollisionInfo} collisionInfo Collision info of collision
 * @returns {Boolean} true if collision occurs
 * @memberOf RigidShape
 */
/*RigidShape.prototype.collidedRectCirc = function(rect1Shape, circ2Shape, collisionInfo) {
    var rect1Pos = rect1Shape.getXform().getPosition();
    var circ2Pos = circ2Shape.getXform().getPosition();
    var vFrom1to2 = [0, 0];
    vec2.subtract(vFrom1to2, circ2Pos, rect1Pos);

    var vec = vec2.clone(vFrom1to2);

    var alongX = rect1Shape.getWidth() / 2;
    var alongY = rect1Shape.getHeight() / 2;

    vec[0] = this.clamp(vec[0], -alongX, alongX);
    vec[1] = this.clamp(vec[1], -alongY, alongY);

    var isInside = false;
    if (rect1Shape.containsPos(circ2Pos))  {
        isInside = true;
        // Find closest axis
        if (Math.abs(vFrom1to2[0] - alongX) < Math.abs(vFrom1to2[1] - alongY)) {
            // Clamp to closest side
            if (vec[0] > 0) {
                vec[0] = alongX;
            } else {
                vec[0] = -alongX;
            }
        } else { // y axis is shorter
            // Clamp to closest side
            if (vec[1] > 0) {
                vec[1] = alongY;
            } else {
                vec[1] = -alongY;
            }
        }
    }

    var normal = [0, 0];
    vec2.subtract(normal, vFrom1to2, vec);

    var distSqr = vec2.squaredLength(normal);
    var rSqr = circ2Shape.getRadius() * circ2Shape.getRadius();

    if (distSqr > rSqr && !isInside) {
        return false; //no collision exit before costly square root
    }

    var len = Math.sqrt(distSqr);
    var depth;        
        
    vec2.scale(normal, normal, 1/len); // normalize normal
    if (isInside) { //flip normal if inside the rect
        vec2.scale(normal, normal, -1);
        depth = circ2Shape.getRadius() + len;
    } else {
        depth = circ2Shape.getRadius() - len;
    }
    
    collisionInfo.setNormal(normal);
    collisionInfo.setDepth(depth);
    return true;
};*/

RigidShape.prototype.collidedRectCirc = function(rect1Shape, circ2Shape, collisionInfo) {
  var faceNormal=[];
  var i;  
  for(i = 0; i < 4; ++i)
       faceNormal[i]= vec2.fromValues(0, 0);
  vec2.subtract(faceNormal[0],rect1Shape.mVertex[1],rect1Shape.mVertex[2]);
  vec2.normalize(faceNormal[0],faceNormal[0]);
  vec2.subtract(faceNormal[1],rect1Shape.mVertex[2],rect1Shape.mVertex[3]);
  vec2.normalize(faceNormal[1],faceNormal[1]);
  vec2.subtract(faceNormal[2],rect1Shape.mVertex[3],rect1Shape.mVertex[0]);
  vec2.normalize(faceNormal[2],faceNormal[2]);
  vec2.subtract(faceNormal[3],rect1Shape.mVertex[0],rect1Shape.mVertex[1]);
  vec2.normalize(faceNormal[3],faceNormal[3]);
  var inside=true;
  var bestDistance=-99999;
  var nearestEdge=0;
  for(i = 0; i < 4; ++i)
  {
      var circ2Pos = circ2Shape.getXform().getPosition();
      var v= vec2.fromValues(0, 0);
      vec2.subtract(v,circ2Pos,rect1Shape.mVertex[i]);
      var projection = vec2.dot( v, faceNormal[i] );
      if(projection>0)
      {
          bestDistance=projection;
          nearestEdge=i;
          inside=false;
          break;
      } 
      if(projection>bestDistance)
      {
         bestDistance=projection;
         nearestEdge=i;
      }
  }
  var normal= vec2.fromValues(0, 0);
  var depth=0;
  if(!inside)  
  {
      var v1= vec2.fromValues(0, 0);
      var v2= vec2.fromValues(0, 0);
      vec2.subtract(v1,circ2Pos,rect1Shape.mVertex[nearestEdge]);
      vec2.subtract(v2,rect1Shape.mVertex[(nearestEdge+1)%4],rect1Shape.mVertex[nearestEdge]);
      var dot = vec2.dot( v1, v2 );
      if(dot<0){
          var dis=vec2.distance(circ2Pos,rect1Shape.mVertex[nearestEdge])
          if(dis>circ2Shape.mRadius)
              return false;
          //outside&&in_region_of_mVertex[nearestEdge]
          rect1Shape.mNormal[0]=rect1Shape.mVertex[nearestEdge];
          vec2.subtract(normal,rect1Shape.mNormal[0],circ2Pos);
          vec2.normalize(normal,normal);
          depth=circ2Shape.mRadius-dis;
          vec2.scale(normal,normal,depth);
          vec2.add(rect1Shape.mNormal[1],rect1Shape.mNormal[0],normal)      
      }
      else{
        var v1= vec2.fromValues(0, 0);
        var v2= vec2.fromValues(0, 0);
        vec2.subtract(v1,circ2Pos,rect1Shape.mVertex[(nearestEdge+1)%4]);
        vec2.subtract(v2,rect1Shape.mVertex[nearestEdge],rect1Shape.mVertex[(nearestEdge+1)%4]);
        var dot = vec2.dot( v1, v2 );
        if(dot<0){
          var dis=vec2.distance(circ2Pos,rect1Shape.mVertex[(nearestEdge+1)%4])
          if(dis>circ2Shape.mRadius)
              return false;
          //outside&&in_region_of_mVertex[nearestEdge]
          rect1Shape.mNormal[0]=rect1Shape.mVertex[(nearestEdge+1)%4];
          vec2.subtract(normal,rect1Shape.mNormal[0],circ2Pos);
          vec2.normalize(normal,normal);
          depth=circ2Shape.mRadius-dis;
          vec2.scale(normal,normal,depth);
          vec2.add(rect1Shape.mNormal[1],rect1Shape.mNormal[0],normal)      
         }
        else if(bestDistance<circ2Shape.mRadius){
            //outside&&in_region_of_face[nearestEdge]
            vec2.scale(normal,faceNormal[nearestEdge],circ2Shape.mRadius);
            vec2.subtract(rect1Shape.mNormal[0],circ2Pos,normal);
            vec2.normalize(normal,normal);
            depth=circ2Shape.mRadius-bestDistance;
            vec2.scale(normal,normal,depth);
            vec2.add(rect1Shape.mNormal[1],rect1Shape.mNormal[0],normal)      
        }
      }
  }
  else{
      //inside
    vec2.scale(normal,faceNormal[nearestEdge],circ2Shape.mRadius);
    vec2.subtract(rect1Shape.mNormal[0],circ2Pos,normal);
    vec2.normalize(normal,normal);
    depth=circ2Shape.mRadius-bestDistance;
    vec2.scale(normal,normal,depth);
    vec2.add(rect1Shape.mNormal[1],rect1Shape.mNormal[0],normal);     
  }
  if(depth===0){
      return false;
  }
  collisionInfo.setNormal(normal);
  collisionInfo.setDepth(depth);
  return true;
};
/**
 * pushes a Particle out of a RigidCircle or a RigidRectangle.
 * @param {Particle} aParticle
 * @returns {Boolean}
 * @memberOf RigidShape
 */
RigidShape.prototype.resolveParticleCollision = function(aParticle) {
    var status = false;
    switch (this.rigidType()) {
        case RigidShape.eRigidType.eRigidCircle:
            status = gEngine.Particle.resolveCirclePos(this, aParticle);
            break;
        case RigidShape.eRigidType.eRigidRectangle:
            status = gEngine.Particle.resolveRectPos(this, aParticle);
            break;
    }
    return status;
};