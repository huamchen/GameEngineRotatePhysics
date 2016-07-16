/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/*global Rectangle, Vec2 */

Rectangle.prototype.collisionTest = function (otherShape, collisionInfo) {
    var status = false;
    if (otherShape.mType === "Circle")
        status = this.collidedRectCirc(otherShape, collisionInfo);
    else
        status = this.collidedRectRect(this, otherShape, collisionInfo);
    return status;
};

/**
 * Get support point from a rectangle
 * Support point is the vertex that is the farthest along a given direction
 * @memberOf Rectangle
 * @param {Vec2}dir  a given direction
 * @returns {Vec2}bestVertex the support point
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
        n = this.faceNormal[i];

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
        var bestVec=this.faceNormal[bestIndex].scale(-bestDistance);
        collisionInfo.setInfo(-bestDistance, this.faceNormal[bestIndex], supportPoint.add(bestVec));
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
            var depthVec=collisionInfoR1.getNormal().scale(collisionInfoR1.getDepth());
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

/**
 * Check for collision between Rectangle and Circle
 * @param {Circle} otherCir circle to check for collision status against
 * @param {CollisionInfo} collisionInfo Collision info of collision
 * @returns {Boolean} true if collision occurs
 * @memberOf Rectangle
 */
Rectangle.prototype.collidedRectCirc = function (otherCir, collisionInfo) {

    var inside = true;
    var BestestNum = -99999;
    var NearEdge = 0;
    for (i = 0; i < 4; ++i)
    {
        //find the nearest face for center of circle        
        var circ2Pos = otherCir.mCenter;
        var v = circ2Pos.subtract(this.mVertex[i]);
        var projection = v.dot(this.faceNormal[i]);
        if (projection > 0)
        {
            //if the center of circle is outside of rectangle
            BestestNum = projection;
            NearEdge = i;
            inside = false;
            break;
        }
        if (projection > BestestNum)
        {
            BestestNum = projection;
            NearEdge = i;
        }
    }
    if (!inside)
    {
        //the center of circle is outside of rectangle

        //v1 is from left vertex of face to center of circle 
        //v2 is from left vertex of face to right vertex of face
        var v1 = circ2Pos.subtract(this.mVertex[NearEdge]);
        var v2 = this.mVertex[(NearEdge + 1) % 4].subtract(this.mVertex[NearEdge]);

        var dot = v1.dot(v2);
        if (dot < 0) {
            //the center of circle is in corner region of mVertex[NearEdge]
            var dis = circ2Pos.distance(this.mVertex[NearEdge]);
            //compare the distance with radium to decide collision
            if (dis > otherCir.mRadius)
                return false;

            var normal = circ2Pos.subtract(this.mVertex[NearEdge]).normalize();
            var radiusVec=normal.scale(-otherCir.mRadius);
            collisionInfo.setInfo(otherCir.mRadius - dis, normal, circ2Pos.add(radiusVec));
        }
        else {
            //the center of circle is in corner region of mVertex[NearEdge+1]

            //v1 is from right vertex of face to center of circle 
            //v2 is from right vertex of face to left vertex of face
            var v1 = circ2Pos.subtract(this.mVertex[(NearEdge + 1) % 4]);
            var v2 = this.mVertex[NearEdge].subtract(this.mVertex[(NearEdge + 1) % 4]);
            var dot = v1.dot(v2);
            if (dot < 0) {
                var dis = circ2Pos.distance(this.mVertex[(NearEdge + 1) % 4]);
                //compare the distance with radium to decide collision
                if (dis > otherCir.mRadius)
                    return false;
                var normal = circ2Pos.subtract(this.mVertex[(NearEdge + 1) % 4]).normalize();
                var radiusVec=normal.scale(-otherCir.mRadius);
                collisionInfo.setInfo(otherCir.mRadius - dis, normal, circ2Pos.add(radiusVec));
            }
            else
            {
                //the center of circle is in face region of face[NearEdge]
                if (BestestNum < otherCir.mRadius) {
                    var radiusVec=this.faceNormal[NearEdge].scale(otherCir.mRadius);
                    collisionInfo.setInfo(otherCir.mRadius - BestestNum, this.faceNormal[NearEdge], circ2Pos.subtract(radiusVec));
                }
                else {
                    return false;
                }
            }
        }
    }
    else {
        //the center of circle is inside of rectangle
        var radiusVec=this.faceNormal[NearEdge].scale(otherCir.mRadius);
        collisionInfo.setInfo(otherCir.mRadius - BestestNum, this.faceNormal[NearEdge], circ2Pos.subtract(radiusVec));
    }
    return true;
};