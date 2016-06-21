/* 
 * File: CollisionInfo.js
 *      normal: vector upon which collision interpenetrates
 *      depth: how much penetration
 */

/*jslint node: true, vars: true, white: true */
/*global vec2 */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict"; 

/**
 * Default Constructor
 * @memberOf CollisionInfo
 * @returns {CollisionInfo} New instance of CollisionInfo
 */
function CollisionInfo() {
    this.mDepth = 0;
    this.mNormal=new Vec2(0,0);
    this.mStart=new Vec2(0,0);
    this.mEnd=new Vec2(0,0);  
}

/**
 * Set the depth of the CollisionInfo
 * @memberOf CollisionInfo
 * @param {Number} s how much penetration
 * @returns {void}
 */
CollisionInfo.prototype.setDepth = function (s) { this.mDepth = s; };

/**
 * Set the normal of the CollisionInfo
 * @memberOf CollisionInfo
 * @param {vec2} s vector upon which collision interpenetrates
 * @returns {void}
 */
CollisionInfo.prototype.setNormal = function (s) { this.mNormal = s; };

/**
 * Return the depth of the CollisionInfo
 * @memberOf CollisionInfo
 * @returns {Number} how much penetration
 */
CollisionInfo.prototype.getDepth = function () { return this.mDepth; };

/**
 * Return the depth of the CollisionInfo
 * @memberOf CollisionInfo
 * @returns {vec2} vector upon which collision interpenetrates
 */
CollisionInfo.prototype.getNormal = function () { return this.mNormal; };


CollisionInfo.prototype.setInfo = function (d,n,s) { 
    this.mDepth = d; 
    this.mNormal=n;
    this.mStart=s;
    this.mEnd=s.add(n.scale(d));
};
CollisionInfo.prototype.changeDir = function () { 

    this.mNormal=this.mNormal.scale(-1);
    var n=this.mStart;
    this.mStart=this.mEnd;
    this.mEnd=n;

};