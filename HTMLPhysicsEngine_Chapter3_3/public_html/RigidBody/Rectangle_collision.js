/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/*global Rectangle, Vec2 */

Rectangle.prototype.collisionTest = function (otherShape, collisionInfo) {
    var status = false;
    if (this.boundTest(otherShape)) {
        if (otherShape.mType === "Circle")
            status = false;
        else
            status = this.collidedRectRect(this, otherShape, collisionInfo);
    }
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

/**
 * Find the shortest axis that overlapping
 * @memberOf Rectangle
 * @param {Rectangle} otherRect  another rectangle that being tested
 * @param {CollisionInfo} collisionInfo  record the collision information
 * @returns {Boolean} true if has overlap part in all four directions.
 * the code is convert from http://gamedevelopment.tutsplus.com/tutorials/how-to-create-a-custom-2d-physics-engine-oriented-rigid-bodies--gamedev-8032
 */
Rectangle.prototype.findAxisLeastPenetration = function (otherRect, collisionInfo) {

    var i;
    var n;
    var supportPoint;

    var bestDistance = -99999;
    var bestIndex = null;

    for (i = 0; i < 4; ++i)
    {
        // Retrieve a face normal from A
        n = this.mFaceNormal[i];

        // Retrieve support point from B along -n
        var dir = n.scale(-1);
        var s = otherRect.getSupport(dir);

        // Retrieve vertex on face from A, transform into B's model space
        var v = s.subtract(this.mVertex[i]);

        // Compute penetration distance (in B's model space)
        var d = n.dot(v);

        // Store greatest distance
        if (d > bestDistance)
        {
            bestDistance = d;
            bestIndex = i;
            supportPoint = s;
        }
    }
    if (bestDistance >= 0)
    {
        return false;
    }
    else
    {
        var bestVec = this.mFaceNormal[bestIndex].scale(-bestDistance);
        collisionInfo.setInfo(-bestDistance, this.mFaceNormal[bestIndex], supportPoint.add(bestVec));
    }
    return true;
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

    if (status1 && status2)
    {
        //if both of rectangles are overlapping, choose the shorter normal as the normal       
        if (collisionInfoR1.getDepth() < collisionInfoR2.getDepth())
        {
            var depthVec = collisionInfoR1.getNormal().scale(collisionInfoR1.getDepth());
            collisionInfo.setInfo(collisionInfoR1.getDepth(), collisionInfoR1.getNormal(), collisionInfoR1.mStart.subtract(depthVec));
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