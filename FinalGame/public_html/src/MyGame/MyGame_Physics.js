/*
 * File: MyGame_Physics.js 
 * Relaxation support for behaviors
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, CollisionInfo, MyGame */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

MyGame.prototype._physicsSimulation = function() {
    
    // Hero platform
    //gEngine.Physics.processObjSet(this.mHero, this.mAllPlatforms);
    
    // Hero Minion
    // wdgEngine.Physics.processObjSet(this.mHero, this.mAllMinions);
    

    // DyePack platform
    gEngine.Physics.processSetSet(this.mAllDyePacks, this.mAllPlatforms);
    gEngine.Physics.processSetSet( this.mAllPlatforms,this.mAllDyePacks);
    
    
    // Particle system collisions
 //   gEngine.Particle.processSetSet(this.mAllMinions, this.mAllParticles);
//    gEngine.Particle.processSetSet(this.mAllPlatforms, this.mAllParticles);
};
