/* 
 * File:Circle.js
 *      define a circle
 *     
 */




var Circle = function (center, radius, mass, friction, restitution) {
    this.mType = 1;//0---Rectangle;1---circle

    this.mRadius = radius;
    this.mCenter = center;
    //The start point of line in circle
    this.mStartpoint = new Vec2(center.x, center.y - radius);

    if (mass == null)
        this.mMass = 1;
    else
        this.mMass = mass;

    //Inertia=mass * radius^2
    //12 is a constant value that can be changed
    this.mInertia = this.mMass * (this.mRadius * this.mRadius) / 12;

    //change mass into 1/mass
    if (this.mMass != 0)
    {
        this.mMass = 1 / this.mMass;
        this.mInertia = 1 / this.mInertia;
    }

    if (friction == null)
        this.mFriction = 0.8;
    else
        this.mFriction = friction;

    if (restitution == null)
        this.mRestitution = 0.2;
    else
        this.mRestitution = restitution;

    //velocity
    this.v = new Vec2(0, 0);
    //acceleration
    this.a = new Vec2(0, 0);

    //angle
    this.theta = 0;
    //angle velocity   
    //negetive-- clockwise
    //postive-- counterclockwise
    this.omega = 0;
    //angle acceleration
    this.alpha = 0;

    mAllObject.push(this);
};

//rotate angle in counterclockwise
Circle.prototype.rotate = function (angle) {
    this.theta += angle;
    this.mStartpoint = this.mStartpoint.rotate(this.mCenter, angle);
    return this;
};


Circle.prototype.move = function (s) {
    this.mStartpoint = this.mStartpoint.add(s);
    this.mCenter = this.mCenter.add(s);
    return this;
};

Circle.prototype.draw = function (context) {
    
    context.beginPath();

    //draw a circle
    context.arc(this.mCenter.x, this.mCenter.y, this.mRadius, 0, Math.PI * 2, true);

    //draw a line from start point toward center
    context.moveTo(this.mStartpoint.x, this.mStartpoint.y);
    context.lineTo(this.mCenter.x, this.mCenter.y);

    context.closePath();
    context.lineWidth = 2.0;
    context.stroke();
};

Circle.prototype.update = function () {
    //s = v*t + 0.5*a*t^2
    this.move(this.v.scale(dt).add(this.a.scale(dt * dt / 2)));
    //v += a*t
    this.v = this.v.add(this.a.scale(dt));

    this.rotate(this.omega * dt + this.alpha * dt * dt / 2);

    this.omega += this.alpha * dt;
};
