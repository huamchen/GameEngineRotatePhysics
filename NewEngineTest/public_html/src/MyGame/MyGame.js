/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, Scene, GameObjectSet, TextureObject, Camera, vec2,
  FontRenderable, ParticleGameObjectSet, ParticleEmitter
  GameObject, Hero, Minion, Dye, Platform, Wall, DyePack, Particle */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

gEngine.Core.inheritPrototype(MyGame, Scene);
var whichObject=0;
function MyGame() {
    this.kMinionSprite = "assets/minion_sprite.png";
    this.kPlatformTexture = "assets/platform.png";
    this.kWallTexture = "assets/wall.png";
    this.kParticleTexture = "assets/particle.png";
    this.kPrompt = "RigidBody Physics!";

    // The camera to view the scene
    this.mCamera = null;

    // the hero and the support objects
    this.mHero = null;
    
    this.mCollidedObj = null;
    this.mAllPlatforms = new GameObjectSet();
    this.mAllMinions = new GameObjectSet();
    this.mAllDyePacks = new GameObjectSet();
    gCurrentScene=this;

}


MyGame.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kMinionSprite);
    gEngine.Textures.loadTexture(this.kPlatformTexture);
    gEngine.Textures.loadTexture(this.kWallTexture);
    gEngine.Textures.loadTexture(this.kParticleTexture);
};

MyGame.prototype.unloadScene = function () {    
    gEngine.LayerManager.cleanUp();
    gEngine.Textures.unloadTexture(this.kMinionSprite);
    gEngine.Textures.unloadTexture(this.kPlatformTexture);
    gEngine.Textures.unloadTexture(this.kWallTexture);
    gEngine.Textures.unloadTexture(this.kParticleTexture);
};

MyGame.prototype.initialize = function () {
    Scene.prototype.initialize.call(this);
    this.mCamera = new Camera(
        vec2.fromValues(100, 56.25), // position of the camera
        200,                         // width of camera
        [0, 0, 1280, 720]            // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.7, 0.7, 0.7, 1]);
            // sets the background to gray
    
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);
    
    // create a few objects ...
    var i, j, rx, ry, obj, dy, dx;
    dx = 80;
    ry = Math.random() * 5 + 20;
  
   
    obj = new MovingPlatform(this.kPlatformTexture, 120, 50,1);
    obj.mVisible=false;
    this.mAllPlatforms.addToSet(obj);
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eActors, obj);
    obj = new MovingPlatform(this.kPlatformTexture, 20, 20,2);
    obj.mVisible=false;
    this.mAllPlatforms.addToSet(obj);
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eActors, obj);
    obj = new Minion(this.kMinionSprite, 100, 100,3);
    obj.mVisible=false;
    this.mAllMinions.addToSet(obj);
    gEngine.LayerManager.addToLayer(gEngine.eLayer.eActors, obj);
  
    // 
    // the important objects
    //this.mHero = new Hero(this.kMinionSprite, 20, 30);   
    
};
