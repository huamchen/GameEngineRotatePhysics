/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



/* global mAllObject, dt, gEngine */

function RigidShape(center) {
    this.mCenter = center;
    
    //angle
    this.mAngle = 0;
    gEngine.Core.mAllObject.push(this);
}
