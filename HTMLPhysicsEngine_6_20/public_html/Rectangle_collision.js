/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


Rectangle.prototype.collisionTest = function(otherShape, collisionInfo) {
    var status = false;
    collisionInfo.setDepth(0);
    switch (otherShape.mType) {
        case 1:
            status = this.collidedRectCirc(otherShape, collisionInfo);
            break;
        case 0:
            status = this.collidedRectRect(this, otherShape, collisionInfo);
            //status = this.findAxisLeastPenetration(otherShape, collisionInfo);
            break;
    }
    return status;
};

Rectangle.prototype.getSupport=function(dir){
  var bestProjection=this.mVertex[0].dot(dir);
  var bestVertex=this.mVertex[0];
  var projection;
  for(var i = 1; i <this.mVertex.length; i++)
  {
    var v = this.mVertex[i];
    projection = v.dot(dir );
 
    if(projection > bestProjection)
    {
      bestVertex = v;
      bestProjection = projection;
    }
  }
  return bestVertex;
};

Rectangle.prototype.findAxisLeastPenetration=function(otherRect, collisionInfo){

  var i;
  var n;
  var supportPoint;

  var bestDistance=-99999;
  var bestIndex=null;
  
  for(i = 0; i < 4; ++i)
  {
    // Retrieve a face normal from A
    n = this.faceNormal[i];
    var dir= n.scale(-1);
    // Retrieve support point from B along -n
    var s = otherRect.getSupport( dir );
 
    // Retrieve vertex on face from A, transform into
    // B's model space
    var v = s.subtract(this.mVertex[i]);
    // Compute penetration distance (in B's model space)
    var d = n.dot(v );
 
    // Store greatest distance
    if(d > bestDistance)
    {
      bestDistance = d;
      bestIndex = i;
      supportPoint=s;
    }
  }
  if(bestDistance>=0)
  {
      return false;
  }
  else
  {       
      collisionInfo.setInfo(-bestDistance,this.faceNormal[bestIndex],this.faceNormal[bestIndex].scale(-bestDistance).add(supportPoint));
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
Rectangle.prototype.collidedRectRect = function(r1, r2, collisionInfo) {
    /*var vFrom1to2 = vec2.fromValues(0, 0);
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
    return false;*/
    var status1=false;
    var status2=false;
    var collisionInfoR1=new CollisionInfo();
    var collisionInfoR2=new CollisionInfo();
    status1=r1.findAxisLeastPenetration(r2,collisionInfoR1);
    status2=r2.findAxisLeastPenetration(r1,collisionInfoR2);
    if(status1&&status2)
    {
        if(collisionInfoR1.getDepth()<collisionInfoR2.getDepth())
        {
            collisionInfo.setInfo(collisionInfoR1.getDepth(),collisionInfoR1.getNormal(),collisionInfoR1.mStart.subtract(collisionInfoR1.getNormal().scale(collisionInfoR1.getDepth())));
        }
        else {
            collisionInfo.setInfo(collisionInfoR2.getDepth(),collisionInfoR2.getNormal().scale(-1),collisionInfoR2.mStart);
        }
    }
    else{
        collisionInfo=new CollisionInfo();
    }
    return status1&&status2;
};

Rectangle.prototype.collidedRectCirc = function(otherCir, collisionInfo) {

  var inside=true;
  var BestestNum=-99999;
  var NearEdge=0;
  for(i = 0; i < 4; ++i)
  {
      var circ2Pos = otherCir.mCenter;
      var v= circ2Pos.subtract(this.mVertex[i]);
      var projection = v.dot(this.faceNormal[i]);
      if(projection>0)
      {
          BestestNum=projection;
          NearEdge=i;
          inside=false;
          break;
      } 
      if(projection>BestestNum)
      {
         BestestNum=projection;
         NearEdge=i;
      }
  }
  if(!inside)  
  {
      var v1= circ2Pos.subtract(this.mVertex[NearEdge])
      var v2= this.mVertex[(NearEdge+1)%4].subtract(this.mVertex[NearEdge])
      var dot = v1.dot( v2 );
      if(dot<0){
          var dis=circ2Pos.distance(this.mVertex[NearEdge])
          if(dis>otherCir.mRadius)
              return false;
          //outside&&in_region_of_mVertex[NearEdge]
          var normal=circ2Pos.subtract(this.mVertex[NearEdge]).normalize();
          collisionInfo.setInfo(otherCir.mRadius-dis,normal,circ2Pos.add(normal.scale(-otherCir.mRadius)));
      }
      else{
        var v1=circ2Pos.subtract(this.mVertex[(NearEdge+1)%4]); 
        var v2=this.mVertex[NearEdge].subtract(this.mVertex[(NearEdge+1)%4]);
        var dot = v1.dot( v2 );
        if(dot<0){
          var dis=circ2Pos.distance(this.mVertex[(NearEdge+1)%4])
          if(dis>otherCir.mRadius)
              return false;
          //outside&&in_region_of_mVertex[NearEdge+1]
          var normal=circ2Pos.subtract(this.mVertex[(NearEdge+1)%4]).normalize();
          collisionInfo.setInfo(otherCir.mRadius-dis,normal,circ2Pos.add(normal.scale(-otherCir.mRadius)));
        }
        else 
        {
            if(BestestNum<otherCir.mRadius){
            //outside&&in_region_of_face[NearEdge]
            collisionInfo.setInfo(otherCir.mRadius-BestestNum,this.faceNormal[NearEdge],circ2Pos.subtract(this.faceNormal[NearEdge].scale(otherCir.mRadius)));
            }
            else{
                return false;
            }
        }
      }
  }
  else{
      //inside
      collisionInfo.setInfo(otherCir.mRadius-BestestNum,this.faceNormal[NearEdge],circ2Pos.subtract(this.faceNormal[NearEdge].scale(otherCir.mRadius))); 
  }
  return true;
};