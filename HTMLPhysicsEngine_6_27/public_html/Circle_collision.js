/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Circle.prototype.collisionTest = function (otherShape, collisionInfo) {
    var status = false;
    switch (otherShape.mType) {
        //switch depends on type of otherShape
        case 1:
            status = this.collidedCircCirc(this, otherShape, collisionInfo);
            break;
        case 0:
            status = otherShape.collidedRectCirc(this, collisionInfo);
            break;
    }
    return status;
};

Circle.prototype.collidedCircCirc = function (c1, c2, collisionInfo) {
    var vFrom1to2 = c2.mCenter.subtract(c1.mCenter);
    var rSum = c1.mRadius + c2.mRadius;
    var dist = vFrom1to2.length();
    if (dist > Math.sqrt(rSum * rSum)) {
        //not overlapping
        return false;
    }
    if (dist !== 0) {
        // overlapping bu not same position
        collisionInfo.setInfo(rSum - dist, vFrom1to2.normalize(), c2.mCenter.add(vFrom1to2.scale(-1).normalize().scale(c2.mRadius)));
    }
    else
    {
        //same position
        collisionInfo.setInfo(rSum, new Vec2(0, -1), c1.mCenter.add(new Vec2(0, c1.mRadius)));
    }
    return true;
};

