/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/*global Rectangle, Vec2 */

Rectangle.prototype.collisionTest = function (otherShape, collisionInfo) {
    var status = false;
    if (otherShape.mType === "Circle")
        status = false;
    else
        status = this.collidedRectRect(this, otherShape, collisionInfo);
    return status;
};

/**
 * Get support point from a rectangle
 * Support point is the vertex that is the farthest along a given direction
 * @memberOf Rectangle
 * @param {Vec2} dir  a given direction
 * @returns {Vec2} bestVertex the support point
 * the code is convert from http://gamedevelopment.tutsplus.com/tutorials/how-to-create-a-custom-2d-physics-engine-oriented-rigid-bodies--gamedev-8032
 */
Rectangle.prototype.getSupport = function (dir) {
    //the longest project length
    var bestProjection = this.mVertex[0].dot(dir);

    //the vertex that has the longest project length
    var bestVertex = this.mVertex[0];

    var projection;
    for (var i = 1; i < this.mVertex.length; i++)
    {
        var v = this.mVertex[i];
        projection = v.dot(dir);
        if (projection > bestProjection)
        {
            bestVertex = v;
            bestProjection = projection;
        }
    }
    return bestVertex;
};

SupportStruct = function() {
  this.mSupportPoint = null;
  this.mSupportPointDist = 0;
};
var tmpSupport = new SupportStruct();

Rectangle.prototype.findSupportPoint = function (dir, ptOnEdge) {
    //the longest project length
    var vToEdge;
    var projection;
    
    tmpSupport.mSupportPointDist = 9999999;
    tmpSupport.mSupportPoint = null;
    
    for (var i = 0; i<this.mVertex.length; i++) {
        vToEdge = this.mVertex[i].subtract(ptOnEdge);
        projection = vToEdge.dot(dir);
        
        if ((projection > 0) && (projection < tmpSupport.mSupportPointDist)) {
            tmpSupport.mSupportPoint = this.mVertex[i];
            tmpSupport.mSupportPointDist = projection;
        }
    }
};

/**
 * Find the shortest axis that overlapping
 * @memberOf Rectangle
 * @param {Rectangle} otherRect  another rectangle that being tested
 * @param {CollisionInfo} collisionInfo  record the collision information
 * @returns {Boolean} true if has overlap part in all four directions.
 * the code is convert from http://gamedevelopment.tutsplus.com/tutorials/how-to-create-a-custom-2d-physics-engine-oriented-rigid-bodies--gamedev-8032
 */
Rectangle.prototype.findAxisLeastPenetration = function (otherRect, collisionInfo) {
    
    var n;
    var supportPoint;

    var bestDistance = -99999;
    var bestIndex = null;
    
    var hasSupport = true;
    var i = 0;
    
    while ((hasSupport)  && (i < this.mFaceNormal.length)) {
        // Retrieve a face normal from A
        n = this.mFaceNormal[i];

        // Retrieve support point from B along -n
        var dir = n.scale(-1);
        
        var ptOnEdge = this.mVertex[i];
        // otherRect.findSupportPoint(dir, dir);
        otherRect.findSupportPoint(dir, ptOnEdge);
        hasSupport = (tmpSupport.mSupportPoint !== null);
        if ((hasSupport) && (tmpSupport.mSupportPointDist > bestDistance)){
            bestDistance = tmpSupport.mSupportPointDist;
            bestIndex = i;
            supportPoint = tmpSupport.mSupportPoint;
        }
        i = i + 1;
    }
    if (hasSupport) {
        var bestVec = this.mFaceNormal[bestIndex].scale(-bestDistance);
        collisionInfo.setInfo(bestDistance, this.mFaceNormal[bestIndex], supportPoint.add(bestVec));
    }
    return hasSupport;
};
/**
 * Check for collision between RigidRectangle and RigidRectangle
 * @param {Rectangle} r1 Rectangle object to check for collision status
 * @param {Rectangle} r2 Rectangle object to check for collision status against
 * @param {CollisionInfo} collisionInfo Collision info of collision
 * @returns {Boolean} true if collision occurs
 * @memberOf Rectangle
 */
Rectangle.prototype.collidedRectRect = function (r1, r2, collisionInfo) {

    var status1 = false;
    var status2 = false;
    var collisionInfoR1 = new CollisionInfo();
    var collisionInfoR2 = new CollisionInfo();

    //find Axis of Separation for both rectangle
    status1 = r1.findAxisLeastPenetration(r2, collisionInfoR1);
    status2 = r2.findAxisLeastPenetration(r1, collisionInfoR2);

gEngine.Physics.drawCollisionInfo(collisionInfoR1, gEngine.Core.mContext, "red");
gEngine.Physics.drawCollisionInfo(collisionInfoR2, gEngine.Core.mContext, "green");

    if (status1 && status2)
    {
        //if both of rectangles are overlapping, choose the shorter normal as the normal       
        if (collisionInfoR1.getDepth() < collisionInfoR2.getDepth())
        {
            var depthVec = collisionInfoR1.getNormal().scale(collisionInfoR1.getDepth());
            collisionInfo.setInfo(collisionInfoR1.getDepth(), 
                        collisionInfoR1.getNormal(), 
                        collisionInfoR1.mStart.subtract(depthVec));
        }
        else {
            collisionInfo.setInfo(collisionInfoR2.getDepth(), collisionInfoR2.getNormal().scale(-1), collisionInfoR2.mStart);
        }
    }
    else {
        collisionInfo = new CollisionInfo();
    }
    return status1 && status2;
};
