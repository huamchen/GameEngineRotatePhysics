/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */




var Circle = function(center, radius, mass, friction,restitution) {
    this.mType=1;//0---Rectangle;1---circle
       
    
    
    this.mRadius=radius;
    this.mCenter=center;
    this.mStartpoint=new Vec2(center.x,center.y-radius);
    
    if(mass==null)
        this.mMass=1;
    else this.mMass=mass;
    this.mInertia=this.mMass;
    
    if(friction==null)
        this.mFriction=0.3
    else this.mFriction=friction;
    
    if(restitution==null)
        this.mRestitution=0.8;
    else this.mRestitution=restitution;
    
    this.v = new Vec2(0, 0);
    this.a = new Vec2(0, 0);
    this.theta = 0;//anlge
    this.omega = 0;//speed
    this.alpha = 0;//acc
    mAllObject.push(this);
};

Circle.prototype.rotate = function(angle) {
    this.theta += angle;
    this.mStartpoint = this.mStartpoint.rotate(this.mCenter,angle);
    return this;   
};

Circle.prototype.move = function(v) {
    this.mStartpoint = this.mStartpoint.add(v);
    this.mCenter=this.mCenter.add(v);
    return this;
};

Circle.prototype.draw = function(context) {
    context.strokeStyle = 'blue';
     context.beginPath();      
     context.arc(this.mCenter.x, this.mCenter.y,this.mRadius,0,Math.PI * 2, true);   
     context.moveTo(this.mStartpoint.x, this.mStartpoint.y);
     context.lineTo(this.mCenter.x, this.mCenter.y);
     context.closePath();
     context.lineWidth = 2.0; 
     context.stroke();
};

Circle.prototype.update = function() {
    this.v =this.v.add(this.a.scale(dt));
    this.omega += this.alpha * dt;
    this.move(this.v.scale(dt));
    this.rotate(this.omega * dt);
};
