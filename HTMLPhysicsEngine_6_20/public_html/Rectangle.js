/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



var Rectangle = function(center, width, height, mass,friction,restitution) {
    this.mType=0;//0---Rectangle;1---circle
    
    
    this.mWidth = width;
    this.mHeight = height;
    this.mCenter=center;
    
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
    
    
    
    this.mVertex=[];//0--TopLeft;1--TopRight;2--BottomRight;3--BottomLeft
    this.faceNormal=[];
    //this.mTopRight=null;
    //this.mBottomRight=null;
    //this.mBottomLeft=null;
    


    this.mVertex[0] = new Vec2(center.x-width/2, center.y-height/2);
    this.mVertex[1] = new Vec2(center.x+width/2, center.y-height/2);
    this.mVertex[2] = new Vec2(center.x+width/2, center.y+height/2);
    this.mVertex[3] = new Vec2(center.x-width/2, center.y+height/2);


    this.faceNormal[0]= this.mVertex[1].subtract(this.mVertex[2]);
    this.faceNormal[0]=this.faceNormal[0].normalize();
    this.faceNormal[1]= this.mVertex[2].subtract(this.mVertex[3]);
    this.faceNormal[1]=this.faceNormal[1].normalize();
    this.faceNormal[2]= this.mVertex[3].subtract(this.mVertex[0]);
    this.faceNormal[2]=this.faceNormal[2].normalize();
    this.faceNormal[3]= this.mVertex[0].subtract(this.mVertex[1]);
    this.faceNormal[3]=this.faceNormal[3].normalize();

    this.v = new Vec2(0, 0);
    this.a = new Vec2(0, 0);
    this.theta = 0;//anlge
    this.omega = 0;//speed
    this.alpha = 0;//acc
    mAllObject.push(this);
};

Rectangle.prototype.rotate = function(angle) {
    this.theta += angle;
    var i;
    for(i=0;i<this.mVertex.length;i++)
    {
        this.mVertex[i] = this.mVertex[i].rotate(this.mCenter,angle);
    }
    this.faceNormal[0]= this.mVertex[1].subtract(this.mVertex[2]);
    this.faceNormal[0]=this.faceNormal[0].normalize();
    this.faceNormal[1]= this.mVertex[2].subtract(this.mVertex[3]);
    this.faceNormal[1]=this.faceNormal[1].normalize();
    this.faceNormal[2]= this.mVertex[3].subtract(this.mVertex[0]);
    this.faceNormal[2]=this.faceNormal[2].normalize();
    this.faceNormal[3]= this.mVertex[0].subtract(this.mVertex[1]);
    this.faceNormal[3]=this.faceNormal[3].normalize();
    return this;   
};

Rectangle.prototype.move = function(v) {
    var i;
    for(i=0;i<this.mVertex.length;i++)
    {
        this.mVertex[i] = this.mVertex[i].add(v);
    }
    this.mCenter=this.mCenter.add(v);
    return this;
};

Rectangle.prototype.draw = function(context) {
    context.strokeStyle = 'blue';
    context.save();
    context.translate(this.mVertex[0].x, this.mVertex[0].y);
    context.rotate(this.theta);
    context.strokeRect(0, 0, this.mWidth, this.mHeight);
    context.restore();
};

Rectangle.prototype.update = function() {
       
    this.v =this.v.add(this.a.scale(dt));
    this.omega += this.alpha * dt;
    this.move(this.v.scale(dt));
    this.rotate(this.omega * dt);
    
};
