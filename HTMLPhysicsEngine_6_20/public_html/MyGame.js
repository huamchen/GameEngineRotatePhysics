/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var r1 = new Rectangle (new Vec2(100,50),10,10,0);
var r2 = new Rectangle (new Vec2(125, 200), 100, 50);
var c1=new Circle(new Vec2(100, 100), 30);
var c2=new Circle(new Vec2(200, 100), 30);

//
var w1=new Rectangle (new Vec2(200,0),400,1,0);
var w2=new Rectangle (new Vec2(200,400),400,1,0);
var w3=new Rectangle (new Vec2(0,200),1,400,0);
var w4=new Rectangle (new Vec2(400,200),1,400,0);
r2.rotate(3.14/4);
r2.v=new Vec2(-100,-100);
