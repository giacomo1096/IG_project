if (BABYLON.Engine.isSupported()) {
    var canvas = document.getElementById("gl-canvas"); // Get the canvas element
    var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
}

var sceneToRender = null;
var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };

//Scenes
var game;
var menu;
var final_scene;
var instruction_scene;

//Variables for the menu scene
var boolimageday = true;  // false -> day mode
var boolimagenight = true;
var difficulty = 0; //default easy

var bool_win = 0;
var change_scene = 0;
var from_menu = 0;
var from_final = 0;
var from_instruction = 0;

var jump = 0;
var feet_opening = 0;
var change_rabbit = false;

//Variables for checking carrots
var rabbit_carrots_taken = 0;
var carrots_taken = 0;
var num_carrots = 5;

var take_carrot1 = 0;
var take_carrot2 = 0;
var take_carrot3 = 0;
var take_carrot4 = 0;
var take_carrot5 = 0;
var take_carrot6 = 0;
var take_carrot7 = 0;
var take_carrot8 = 0;
var take_carrot9 = 0;

var carrot_motion = 0;
var carrot_change = false;
var carrot_sound;
var carrot_sound_dummy;


//Game Scene
var gameScene = function () {
    var scene = new BABYLON.Scene(engine);
    engine.displayLoadingUI();

    //if difficulty = medium or hard the carrots number is increased
    if(difficulty == 1 || difficulty == 2){
        num_carrots = 9;
    }
    //console.log(num_carrots);

    scene.useGeometryIdsMap = true;
    scene.useMaterialMeshMap = true;
    scene.useClonedMeshMap = true;

    //music
    carrot_sound = new BABYLON.Sound("Carrot_sound", "sounds/carrot_sound.wav", scene, null, {volume: 0.4});
    carrot_sound_dummy = new BABYLON.Sound("Dummy_sound", "sounds/carrot_sound_dummy.wav", scene, null, {volume: 0.4});
    // Load the sound and play it automatically once ready
    var music = new BABYLON.Sound("Game", "sounds/smasbonus.wav", scene, null, {
        loop: true,
        volume: 0.3,
        autoplay: true
    });

    //Enable physic for the scene
    var gravityVector = new BABYLON.Vector3(0,-150, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    scene.enablePhysics(gravityVector, physicsPlugin);

    scene.collisionsEnabled = true;
    scene.clearColor = new BABYLON.Color3(0.5, 0.8, 0.5);
    scene.ambientColor = new BABYLON.Color3(0.3, 0.3, 0.3);

    //Optimization
	var optimizer_options = new BABYLON.SceneOptimizerOptions(60, 2000);
    optimizer_options.addOptimization(new BABYLON.ShadowsOptimization(0));
    optimizer_options.addOptimization(new BABYLON.LensFlaresOptimization(0));
    optimizer_options.addOptimization(new BABYLON.PostProcessesOptimization(1));
    optimizer_options.addOptimization(new BABYLON.ParticlesOptimization(1));
    optimizer_options.addOptimization(new BABYLON.TextureOptimization(2, 512));
    optimizer_options.addOptimization(new BABYLON.RenderTargetsOptimization(0));

    var sceneOptimizer = new BABYLON.SceneOptimizer(scene, optimizer_options, true, true);
    //sceneOptimizer.start();

    //Gui game
    const guiGame = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("guiGame",true,scene);

    var score_panel = new BABYLON.GUI.Rectangle();
    score_panel.width = "200px";
    score_panel.height = "110px";
    score_panel.paddingLeft = "-32px";
    score_panel.paddingRight = "2px";
    score_panel.paddingTop = "5px";
    score_panel.paddingBottom = "-5px";
    score_panel.background = "grey";
    score_panel.alpha = 0.8;
    score_panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    score_panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;

    var numberCarrots = new BABYLON.GUI.TextBlock("numberCarrots", ); 
    numberCarrots.color = "white";
    numberCarrots.fontFamily = "My Font";
    numberCarrots.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    numberCarrots.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    numberCarrots.paddingLeft = "-32px";
    numberCarrots.paddingRight = "32px";
    numberCarrots.paddingTop = "5px";
    numberCarrots.paddingBottom = "-5px";
    numberCarrots.fontSize = 40;

    var numberCarrotsRabbit = new BABYLON.GUI.TextBlock("numberCarrotsRabbit", ); 
    numberCarrotsRabbit.color = "white";
    numberCarrotsRabbit.fontFamily = "My Font";
    numberCarrotsRabbit.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    numberCarrotsRabbit.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    numberCarrotsRabbit.paddingLeft = "-32px";
    numberCarrotsRabbit.paddingRight = "12px";
    numberCarrotsRabbit.paddingTop = "50px";
    numberCarrotsRabbit.paddingBottom = "0px";
    numberCarrotsRabbit.fontSize = 40;

    var ComputeCarrots = function(){
        if(difficulty == 0){
            if(carrots_taken == 0){ numberCarrots.text = "You: 0 / 5";}
            else if(carrots_taken == 1){ numberCarrots.text = "You: 1 / 5";}
            else if(carrots_taken == 2){ numberCarrots.text = "You: 2 / 5";}
            else if(carrots_taken == 3){ numberCarrots.text = "You: 3 / 5";}
            else if(carrots_taken == 4){ numberCarrots.text = "You: 4 / 5";}
            else if(carrots_taken == 5){ numberCarrots.text = "You: 5 / 5";}

            if(rabbit_carrots_taken == 0){ numberCarrotsRabbit.text = "Rabbit: 0 / 5";}
            else if(rabbit_carrots_taken == 1){ numberCarrotsRabbit.text = "Rabbit: 1 / 5";}
            else if(rabbit_carrots_taken == 2){ numberCarrotsRabbit.text = "Rabbit: 2 / 5";}
            else if(rabbit_carrots_taken == 3){ numberCarrotsRabbit.text = "Rabbit: 3 / 5";}
            else if(rabbit_carrots_taken == 4){ numberCarrotsRabbit.text = "Rabbit: 4 / 5";}
            else if(rabbit_carrots_taken == 5){ numberCarrotsRabbit.text = "Rabbit: 5 / 5";}

        }else{
            if(carrots_taken == 0){ numberCarrots.text = "You: 0 / 9";}
            else if(carrots_taken == 1){ numberCarrots.text = "You: 1 / 9";}
            else if(carrots_taken == 2){ numberCarrots.text = "You: 2 / 9";}
            else if(carrots_taken == 3){ numberCarrots.text = "You: 3 / 9";}
            else if(carrots_taken == 4){ numberCarrots.text = "You: 4 / 9";}
            else if(carrots_taken == 5){ numberCarrots.text = "You: 5 / 9";}
            else if(carrots_taken == 6){ numberCarrots.text = "You: 6 / 9";}
            else if(carrots_taken == 7){ numberCarrots.text = "You: 7 / 9";}
            else if(carrots_taken == 8){ numberCarrots.text = "You: 8 / 9";}
            else if(carrots_taken == 9){ numberCarrots.text = "You: 9 / 9";}

            if(rabbit_carrots_taken == 0){ numberCarrotsRabbit.text = "Rabbit: 0 / 9";}
            else if(rabbit_carrots_taken == 1){ numberCarrotsRabbit.text = "Rabbit: 1 / 9";}
            else if(rabbit_carrots_taken == 2){ numberCarrotsRabbit.text = "Rabbit: 2 / 9";}
            else if(rabbit_carrots_taken == 3){ numberCarrotsRabbit.text = "Rabbit: 3 / 9";}
            else if(rabbit_carrots_taken == 4){ numberCarrotsRabbit.text = "Rabbit: 4 / 9";}
            else if(rabbit_carrots_taken == 5){ numberCarrotsRabbit.text = "Rabbit: 5 / 9";}
            else if(rabbit_carrots_taken == 6){ numberCarrotsRabbit.text = "Rabbit: 6 / 9";}
            else if(rabbit_carrots_taken == 7){ numberCarrotsRabbit.text = "Rabbit: 7 / 9";}
            else if(rabbit_carrots_taken == 8){ numberCarrotsRabbit.text = "Rabbit: 8 / 9";}
            else if(rabbit_carrots_taken == 9){ numberCarrotsRabbit.text = "Rabbit: 9 / 9";}
        }
    }

    ComputeCarrots();
    guiGame.addControl(score_panel);
    score_panel.addControl(numberCarrots);
    score_panel.addControl(numberCarrotsRabbit);

        
    //SkyBox
	var skybox = BABYLON.MeshBuilder.CreateBox("skybox", {size:1000}, scene);
	var skybox_mat = new BABYLON.StandardMaterial("skybox_mat", scene);
    
    if(!boolimageday){
	    skybox_mat.reflectionTexture = new BABYLON.CubeTexture("textures/skybox_day/country", scene); //day mode
    }else{
        skybox_mat.reflectionTexture = new BABYLON.CubeTexture("textures/skybox_night/country", scene); //night mode
    }

	skybox_mat.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skybox_mat.disableLighting = true;
    skybox_mat.backFaceCulling = false;
	skybox.material = skybox_mat;	

    //Camera
	var camera = new BABYLON.ArcRotateCamera("camera", Math.PI/3.5, Math.PI/2.5, 35, new BABYLON.Vector3(0, 0, 60), scene);
    camera.lowerBetaLimit = Math.PI/8;
    camera.upperBetaLimit = Math.PI/2.15;
    camera.lowerRadiusLimit = 10;
    camera.upperRadiusLimit = 260;
    camera.wheelDeltaPercentage = 0.003;

    scene.activeCamera = camera;
    scene.activeCamera.attachControl(canvas, true);

    //Lights
	var dir_light =  new BABYLON.DirectionalLight("dir_light", new BABYLON.Vector3(10, -200, 0), scene);
    dir_light.excludedMeshes.push(skybox);
    dir_light.diffuse = new BABYLON.Color3(1, 1, 1);
    dir_light.specular = new BABYLON.Color3(1, 1, 1);
        
    var hemisph_light = new BABYLON.HemisphericLight("hemisph_light", new BABYLON.Vector3(0, 0, 1), scene);

    if(!boolimageday){
        dir_light.intensity = 0.9; //sun
        hemisph_light.intensity = 1.0;
    }else{
        dir_light.intensity = 0.3; //moon 
        hemisph_light.intensity = 0.2;
    }

    //Shadow
    var shadowGenerator = new BABYLON.ShadowGenerator(1000, dir_light);
    shadowGenerator.useExponenetialShadowMap = true;

    //Ground
    var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 1000, height: 1000, subdivisions: 4}, scene);
    var ground_mat = new BABYLON.StandardMaterial("ground_mat", scene);

    ground_mat.diffuseTexture = new BABYLON.Texture("textures/ground.jpg", scene);
    ground_mat.specularTexture = new BABYLON.Texture("textures/ground.jpg", scene);

    ground.material = ground_mat;
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, restitution: 0.9}, scene);
    ground.checkCollisions = true;
    ground.receiveShadows = true;

    //Rocks
    var rock;
    var rock_mat = new BABYLON.StandardMaterial("rock_mat", scene);
    rock_mat.diffuseTexture = new BABYLON.Texture("meshes/rock/rock_texture.jpg", scene);
    rock_mat.specularTexture = new BABYLON.Texture("meshes/rock/rock_texture.jpg", scene);

    scene.blockfreeActiveMeshesAndRenderingGroups = true;

    //Rock 1
    BABYLON.SceneLoader.ImportMesh("", "meshes/rock/", "rock.obj", scene, function(meshes) {

        rock = meshes[0];

        rock.position.x = -360;
        rock.position.z = 460;
        rock.scaling.scaleInPlace(7);
        
        rock.material = rock_mat;

        shadowGenerator.addShadowCaster(rock);

        rock.physicsImpostor = new BABYLON.PhysicsImpostor(rock, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        rock.physicsImpostor.physicsBody.inertia.setZero();
        rock.physicsImpostor.physicsBody.invInertia.setZero();
        rock.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        rock.freezeWorldMatrix();
        //rock.convertToUnIndexedMesh();
        rock.setEnabled(true);
        //rock.showBoundingBox = true;
        rock.visibility = 1;
        rock.checkCollisions = true;
        
    });

    //Rock 2
    BABYLON.SceneLoader.ImportMesh("", "meshes/rock/", "rock.obj", scene, function(meshes) {

        rock = meshes[0];

        rock.position.x = -300;
        rock.position.z = 440;
        rock.scaling.scaleInPlace(4.5);
        
        rock.material = rock_mat;

        shadowGenerator.addShadowCaster(rock);

        rock.physicsImpostor = new BABYLON.PhysicsImpostor(rock, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        rock.physicsImpostor.physicsBody.inertia.setZero();
        rock.physicsImpostor.physicsBody.invInertia.setZero();
        rock.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        rock.freezeWorldMatrix();
        //rock.convertToUnIndexedMesh();
        rock.setEnabled(true);
        //rock.showBoundingBox = true;
        rock.visibility = 1;
        rock.checkCollisions = true;
        
    });

    //Rock 3
    BABYLON.SceneLoader.ImportMesh("", "meshes/rock/", "rock.obj", scene, function(meshes) {

        rock = meshes[0];

        rock.position.x = -450;
        rock.position.z = 410;
        rock.scaling.scaleInPlace(7);

        rock.material = rock_mat;

        shadowGenerator.addShadowCaster(rock);

        rock.physicsImpostor = new BABYLON.PhysicsImpostor(rock, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        rock.physicsImpostor.physicsBody.inertia.setZero();
        rock.physicsImpostor.physicsBody.invInertia.setZero();
        rock.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        rock.freezeWorldMatrix();
        //rock.convertToUnIndexedMesh();
        rock.setEnabled(true);
        //rock.showBoundingBox = true;
        rock.visibility = 1;
        rock.checkCollisions = true;
        
    });

    //Rock 4
    BABYLON.SceneLoader.ImportMesh("", "meshes/rock/", "rock.obj", scene, function(meshes) {

        rock = meshes[0];

        rock.position.x = -370;
        rock.position.z = 400;
        rock.scaling.scaleInPlace(4);

        rock.material = rock_mat;

        shadowGenerator.addShadowCaster(rock);

        rock.physicsImpostor = new BABYLON.PhysicsImpostor(rock, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        rock.physicsImpostor.physicsBody.inertia.setZero();
        rock.physicsImpostor.physicsBody.invInertia.setZero();
        rock.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        rock.freezeWorldMatrix();
        //rock.convertToUnIndexedMesh();
        rock.setEnabled(true);
        //rock.showBoundingBox = true;
        rock.visibility = 1;
        rock.checkCollisions = true;
        
    });

    //Rock 5
    BABYLON.SceneLoader.ImportMesh("", "meshes/rock/", "rock.obj", scene, function(meshes) {

        rock = meshes[0];

        rock.position.x = -330;
        rock.position.z = 420;
        rock.scaling.scaleInPlace(2.5);

        rock.material = rock_mat;

        shadowGenerator.addShadowCaster(rock);

        rock.physicsImpostor = new BABYLON.PhysicsImpostor(rock, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        rock.physicsImpostor.physicsBody.inertia.setZero();
        rock.physicsImpostor.physicsBody.invInertia.setZero();
        rock.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        rock.freezeWorldMatrix();
        //rock.convertToUnIndexedMesh();
        rock.setEnabled(true);
        //rock.showBoundingBox = true;
        rock.visibility = 1;
        rock.checkCollisions = true;
        
    });

    //Rock 6
    BABYLON.SceneLoader.ImportMesh("", "meshes/rock/", "rock.obj", scene, function(meshes) {

        rock = meshes[0];

        rock.position.x = -165;
        rock.position.z = 360;
        rock.scaling.scaleInPlace(6);

        rock.material = rock_mat;

        shadowGenerator.addShadowCaster(rock);

        rock.physicsImpostor = new BABYLON.PhysicsImpostor(rock, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        rock.physicsImpostor.physicsBody.inertia.setZero();
        rock.physicsImpostor.physicsBody.invInertia.setZero();
        rock.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        rock.freezeWorldMatrix();
        //rock.convertToUnIndexedMesh();
        rock.setEnabled(true);
        //rock.showBoundingBox = true;
        rock.visibility = 1;
        rock.checkCollisions = true;
        
    });

    //Rock 7
    BABYLON.SceneLoader.ImportMesh("", "meshes/rock/", "rock.obj", scene, function(meshes) {

        rock = meshes[0];

        rock.position.x = -370;
        rock.position.z = 180;
        rock.scaling.scaleInPlace(3);
        
        rock.material = rock_mat;

        shadowGenerator.addShadowCaster(rock);

        rock.physicsImpostor = new BABYLON.PhysicsImpostor(rock, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        rock.physicsImpostor.physicsBody.inertia.setZero();
        rock.physicsImpostor.physicsBody.invInertia.setZero();
        rock.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        rock.freezeWorldMatrix();
        //rock.convertToUnIndexedMesh();
        rock.setEnabled(true);
        //rock.showBoundingBox = true;
        rock.visibility = 1;
        rock.checkCollisions = true;
        
    });

    //Rock 8
    BABYLON.SceneLoader.ImportMesh("", "meshes/rock/", "rock.obj", scene, function(meshes) {

        rock = meshes[0];

        rock.position.x = 450;
        rock.position.z = 450;
        rock.scaling.scaleInPlace(7);
        
        rock.material = rock_mat;

        shadowGenerator.addShadowCaster(rock);

        rock.physicsImpostor = new BABYLON.PhysicsImpostor(rock, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        rock.physicsImpostor.physicsBody.inertia.setZero();
        rock.physicsImpostor.physicsBody.invInertia.setZero();
        rock.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        rock.freezeWorldMatrix();
        //rock.convertToUnIndexedMesh();
        rock.setEnabled(true);
        //rock.showBoundingBox = true;
        rock.visibility = 1;
        rock.checkCollisions = true;
        
    });

    //Rock 9
    BABYLON.SceneLoader.ImportMesh("", "meshes/rock/", "rock.obj", scene, function(meshes) {

        rock = meshes[0];

        rock.position.x = 100;
        rock.position.z = -380;
        rock.scaling.scaleInPlace(3);
        
        rock.material = rock_mat;

        shadowGenerator.addShadowCaster(rock);

        rock.physicsImpostor = new BABYLON.PhysicsImpostor(rock, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        rock.physicsImpostor.physicsBody.inertia.setZero();
        rock.physicsImpostor.physicsBody.invInertia.setZero();
        rock.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        rock.freezeWorldMatrix();
        //rock.convertToUnIndexedMesh();
        rock.setEnabled(true);
        //rock.showBoundingBox = true;
        rock.visibility = 1;
        rock.checkCollisions = true;
        
    });

    //Rock 10
    BABYLON.SceneLoader.ImportMesh("", "meshes/rock/", "rock.obj", scene, function(meshes) {

        rock = meshes[0];

        rock.position.y = 20;
        rock.position.x = 230;
        rock.position.z = -180;
        rock.scaling.scaleInPlace(1.2);

        rock.material = rock_mat;

        shadowGenerator.addShadowCaster(rock);

        rock.physicsImpostor = new BABYLON.PhysicsImpostor(rock, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        rock.physicsImpostor.physicsBody.inertia.setZero();
        rock.physicsImpostor.physicsBody.invInertia.setZero();
        rock.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        rock.freezeWorldMatrix();
        //rock.convertToUnIndexedMesh();
        rock.setEnabled(true);
        //rock.showBoundingBox = true;
        rock.visibility = 1;
        rock.checkCollisions = true;
        
    });


    //Flowers

    //Flower 1
    BABYLON.SceneLoader.ImportMesh("", "meshes/flower/", "flowers.obj", scene, function(meshes) {

        for (var i = 0; i<12; i ++){

            meshes[i].position.x = -70;
            meshes[i].position.z = 380;
            meshes[i].scaling.scaleInPlace(15);

            meshes[i].freezeWorldMatrix();
        }
    });
    

    //Flower 2
    BABYLON.SceneLoader.ImportMesh("", "meshes/flower/", "flowers.obj", scene, function(meshes) {

        for (var i = 0; i<12; i ++){
 
            meshes[i].position.x = -100;
            meshes[i].position.z = -350;
            meshes[i].scaling.scaleInPlace(15);

            meshes[i].freezeWorldMatrix();
        }
    });


    //Fountain
    const fountainProfile = [
		new BABYLON.Vector3(0, 0, 0),
		new BABYLON.Vector3(10, 0, 0),
        new BABYLON.Vector3(10, 4, 0),
		new BABYLON.Vector3(8, 4, 0),
        new BABYLON.Vector3(8, 1, 0),
        new BABYLON.Vector3(1, 2, 0),
		new BABYLON.Vector3(1, 15, 0),
		new BABYLON.Vector3(3, 17, 0)
	];

	//Create lathe
	const fountain = BABYLON.MeshBuilder.CreateLathe("fountain", {shape: fountainProfile, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);
	fountain.position.y = -20;
    fountain.position.x = 180;
    fountain.position.z = 130;
    fountain.scaling = new BABYLON.Vector3(2.7, 2.2, 2.7);

    //fountain.showBoundingBox = true;
    fountain.physicsImpostor = new BABYLON.PhysicsImpostor(fountain, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, restitution: 0}, scene);
    shadowGenerator.addShadowCaster(fountain);

    var fountain_mat = new BABYLON.StandardMaterial("fountain_mat", scene);
	fountain_mat.diffuseTexture = new BABYLON.Texture("textures/fountain/fountain_texture.jpeg", scene);
    fountain_mat.specularTexture = new BABYLON.Texture("textures/fountain/fountain_texture.jpeg", scene);
	fountain_mat.bumpTexture = new BABYLON.Texture("textures/fountain/fountain_normals.jpeg", scene);
    fountain.material = fountain_mat;

    // Create a particle system
    var particleSystem = new BABYLON.ParticleSystem("particles", 5000, scene);

    //Texture of each particle
    particleSystem.particleTexture = new BABYLON.Texture("textures/fountain/particle.png", scene);

    // Where the particles come from
    particleSystem.emitter = new BABYLON.Vector3(180, 35, 130); // the starting object, the emitter
    particleSystem.minEmitBox = new BABYLON.Vector3(-1, 0, 0); // Starting all from
    particleSystem.maxEmitBox = new BABYLON.Vector3(1, 0, 0); // To...

    // Colors of all particles
    particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
    particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
    particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

    // Size of each particle (random between...
    particleSystem.minSize = 0.5;
    particleSystem.maxSize = 1.0;

    // Life time of each particle (random between...
    particleSystem.minLifeTime = 2;
    particleSystem.maxLifeTime = 3.5;

    // Emission rate
    particleSystem.emitRate = 1500;

    // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
    
    // Set the gravity of all particles
    particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

    // Direction of each particle after it has been emitted
    particleSystem.direction1 = new BABYLON.Vector3(-2, 8, 2);
    particleSystem.direction2 = new BABYLON.Vector3(2, 8, -2);

    // Angular speed, in radians
    particleSystem.minAngularSpeed = 0;
    particleSystem.maxAngularSpeed = Math.PI;

    // Speed
    particleSystem.minEmitPower = 1;
    particleSystem.maxEmitPower = 3;
    particleSystem.updateSpeed = 0.025;

    // Start the particle system
    particleSystem.start();


    //Logs
    var log0, log1;
    var log_mat = new BABYLON.StandardMaterial("log_mat", scene);
    log_mat.diffuseTexture = new BABYLON.Texture("meshes/log/log_texture_diffuse.png", scene);
    log_mat.specularTexture = new BABYLON.Texture("meshes/log/log_texture_glossiness.png", scene);
    log_mat.bumpTexture = new BABYLON.Texture("meshes/log/log_texture_normals.png", scene);

    //Log 1
    BABYLON.SceneLoader.ImportMesh("", "meshes/log/", "log.obj", scene, function(meshes){

        log0 = meshes[0];
        log1 = meshes[1];

        log0.rotation = new BABYLON.Vector3(Math.PI/2, 0, -Math.PI/6);
        log1.rotation = new BABYLON.Vector3(Math.PI/2, 0, -Math.PI/6);

        log0.position.y = 13;
        log1.position.y = 13;
        log0.position.x = 140;
        log1.position.x = 140;
        log0.position.z = 360;
        log1.position.z = 360;

        log0.material = log_mat;
        log1.material = log_mat;

        log0.freezeWorldMatrix();
        log1.freezeWorldMatrix();

        shadowGenerator.addShadowCaster(meshes[0]);
        shadowGenerator.addShadowCaster(meshes[1]);
    });

    //Log 2
    BABYLON.SceneLoader.ImportMesh("", "meshes/log/", "log.obj", scene, function(meshes){

        log0 = meshes[0];
        log1 = meshes[1];

        log0.rotation = new BABYLON.Vector3(-Math.PI/2, 0, -Math.PI/4);
        log1.rotation = new BABYLON.Vector3(-Math.PI/2, 0, -Math.PI/4);

        log0.scaling.scaleInPlace(0.7);
        log1.scaling.scaleInPlace(0.7);

        log0.position.y = 10;
        log1.position.y = 10;
        log0.position.x = 400;
        log1.position.x = 400;
        log0.position.z = 150;
        log1.position.z = 150;

        log0.material = log_mat;
        log1.material = log_mat;

        log0.freezeWorldMatrix();
        log1.freezeWorldMatrix();

        shadowGenerator.addShadowCaster(meshes[0]);
        shadowGenerator.addShadowCaster(meshes[1]);
    });

    //Log 3
    BABYLON.SceneLoader.ImportMesh("", "meshes/log/", "log.obj", scene, function(meshes){

        log0 = meshes[0];
        log1 = meshes[1];

        log0.rotation = new BABYLON.Vector3(-Math.PI/2, 0, -Math.PI/4);
        log1.rotation = new BABYLON.Vector3(-Math.PI/2, 0, -Math.PI/4);

        log0.scaling.scaleInPlace(0.7);
        log1.scaling.scaleInPlace(0.7);

        log0.position.y = 10;
        log1.position.y = 10;
        log0.position.x = 400;
        log1.position.x = 400;
        log0.position.z = 150;
        log1.position.z = 150;

        log0.material = log_mat;
        log1.material = log_mat;

        log0.freezeWorldMatrix();
        log1.freezeWorldMatrix();

        shadowGenerator.addShadowCaster(meshes[0]);
        shadowGenerator.addShadowCaster(meshes[1]);
    });

    //Log 4
    BABYLON.SceneLoader.ImportMesh("", "meshes/log/", "log.obj", scene, function(meshes){

        log0 = meshes[0];
        log1 = meshes[1];

        log0.rotation = new BABYLON.Vector3(-Math.PI/2, 0, Math.PI/4);
        log1.rotation = new BABYLON.Vector3(-Math.PI/2, 0, Math.PI/4);

        log0.scaling.scaleInPlace(0.6);
        log1.scaling.scaleInPlace(0.6);

        log0.position.y = 8;
        log1.position.y = 8;
        log0.position.x = -260;
        log1.position.x = -260;
        log0.position.z = -180;
        log1.position.z = -180;

        log0.material = log_mat;
        log1.material = log_mat;

        log0.freezeWorldMatrix();
        log1.freezeWorldMatrix();

        shadowGenerator.addShadowCaster(meshes[0]);
        shadowGenerator.addShadowCaster(meshes[1]);
    });

    //Log 5
    BABYLON.SceneLoader.ImportMesh("", "meshes/log/", "log.obj", scene, function(meshes){

        log0 = meshes[0];
        log1 = meshes[1];

        log0.rotation = new BABYLON.Vector3(-Math.PI/2, 0, -Math.PI/3);
        log1.rotation = new BABYLON.Vector3(-Math.PI/2, 0, -Math.PI/3);

        log0.scaling.scaleInPlace(0.9);
        log1.scaling.scaleInPlace(0.9);

        log0.position.y = 13;
        log1.position.y = 13;
        log0.position.x = -430;
        log1.position.x = -430;
        log0.position.z = -420;
        log1.position.z = -420;

        log0.material = log_mat;
        log1.material = log_mat;

        log0.freezeWorldMatrix();
        log1.freezeWorldMatrix();

        shadowGenerator.addShadowCaster(meshes[0]);
        shadowGenerator.addShadowCaster(meshes[1]);
    });

    //Log 6
    BABYLON.SceneLoader.ImportMesh("", "meshes/log/", "log.obj", scene, function(meshes){

        log0 = meshes[0];
        log1 = meshes[1];

        log0.rotation = new BABYLON.Vector3(-Math.PI/2, 0, 0);
        log1.rotation = new BABYLON.Vector3(-Math.PI/2, 0, 0);

        log0.scaling.scaleInPlace(1.1);
        log1.scaling.scaleInPlace(1.1);

        log0.position.y = 16;
        log1.position.y = 16;
        log0.position.x = -430;
        log1.position.x = -430;
        log0.position.z = -200;
        log1.position.z = -200;

        log0.material = log_mat;
        log1.material = log_mat;

        log0.freezeWorldMatrix();
        log1.freezeWorldMatrix();

        shadowGenerator.addShadowCaster(meshes[0]);
        shadowGenerator.addShadowCaster(meshes[1]);
    });

    //Log 7
    BABYLON.SceneLoader.ImportMesh("", "meshes/log/", "log.obj", scene, function(meshes){

        log0 = meshes[0];
        log1 = meshes[1];

        log0.rotation = new BABYLON.Vector3(0, 0, 0);
        log1.rotation = new BABYLON.Vector3(0, 0, 0);

        log0.scaling.scaleInPlace(0.2);
        log1.scaling.scaleInPlace(0.2);

        log0.position.y = 0;
        log1.position.y = 0;
        log0.position.x = -300;
        log1.position.x = -300;
        log0.position.z = 90;
        log1.position.z = 90;

        log0.material = log_mat;
        log1.material = log_mat;

        shadowGenerator.addShadowCaster(meshes[0]);
        shadowGenerator.addShadowCaster(meshes[1]);        
    });

    //Log 8
    BABYLON.SceneLoader.ImportMesh("", "meshes/log/", "log.obj", scene, function(meshes){

        log0 = meshes[0];
        log1 = meshes[1];

        log0.rotation = new BABYLON.Vector3(-Math.PI/2, 0, -Math.PI/4);
        log1.rotation = new BABYLON.Vector3(-Math.PI/2, 0, -Math.PI/4);

        log0.scaling.scaleInPlace(0.2);
        log1.scaling.scaleInPlace(0.2);

        log0.position.y = 3;
        log1.position.y = 3;
        log0.position.x = -300;
        log1.position.x = -300;
        log0.position.z = 80;
        log1.position.z = 80;

        log0.material = log_mat;
        log1.material = log_mat;

        shadowGenerator.addShadowCaster(meshes[0]);
        shadowGenerator.addShadowCaster(meshes[1]);        
    });

    //Log 9 (inside the perimeter)
    BABYLON.SceneLoader.ImportMesh("", "meshes/log/", "log.obj", scene, function(meshes){

        log0 = meshes[0];
        log1 = meshes[1];

        log0.rotation = new BABYLON.Vector3(0, 0, 0);
        log1.rotation = new BABYLON.Vector3(0, 0, 0);

        log0.scaling.scaleInPlace(0.2);
        log1.scaling.scaleInPlace(0.2);

        log0.position.y = 0;
        log1.position.y = 0;
        log0.position.x = -40;
        log1.position.x = -40;
        log0.position.z = -110;
        log1.position.z = -110;


        log0.material = log_mat;
        log1.material = log_mat;

        shadowGenerator.addShadowCaster(log0);
        shadowGenerator.addShadowCaster(log1);

        log0.physicsImpostor = new BABYLON.PhysicsImpostor(log0, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 80, restitution: 0});
        log0.physicsImpostor.physicsBody.inertia.setZero();
        log0.physicsImpostor.physicsBody.invInertia.setZero();
        log0.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        log0.freezeWorldMatrix();
        //log0.convertToUnIndexedMesh();
        log0.setEnabled(true);
        //log0.showBoundingBox = true;
        log0.visibility = 1;
        log0.checkCollisions = true;

        log1.physicsImpostor = new BABYLON.PhysicsImpostor(log1, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 80, restitution: 0});
        log1.physicsImpostor.physicsBody.inertia.setZero();
        log1.physicsImpostor.physicsBody.invInertia.setZero();
        log1.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        log1.freezeWorldMatrix();
        //log1.convertToUnIndexedMesh();
        log1.setEnabled(true);
        //log1.showBoundingBox = true;
        log1.visibility = 1;
        log1.checkCollisions = true;
   
    });

    //Log 10 (inside the perimeter)
    BABYLON.SceneLoader.ImportMesh("", "meshes/log/", "log.obj", scene, function(meshes){

        log0 = meshes[0];
        log1 = meshes[1];

        log0.rotation = new BABYLON.Vector3(0, 0, 0);
        log1.rotation = new BABYLON.Vector3(0, 0, 0);

        log0.scaling.scaleInPlace(0.2);
        log1.scaling.scaleInPlace(0.2);

        log0.position.y = 0;
        log1.position.y = 0;
        log0.position.x = 290;
        log1.position.x = 290;
        log0.position.z = 30;
        log1.position.z = 30;

        log0.material = log_mat;
        log1.material = log_mat;

        shadowGenerator.addShadowCaster(log0);
        shadowGenerator.addShadowCaster(log1);

        log0.physicsImpostor = new BABYLON.PhysicsImpostor(log0, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 80, restitution: 0});
        log0.physicsImpostor.physicsBody.inertia.setZero();
        log0.physicsImpostor.physicsBody.invInertia.setZero();
        log0.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        log0.freezeWorldMatrix();
        //log0.convertToUnIndexedMesh();
        log0.setEnabled(true);
        //log0.showBoundingBox = true;
        log0.visibility = 1;
        log0.checkCollisions = true;

        log1.physicsImpostor = new BABYLON.PhysicsImpostor(log1, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 80, restitution: 0});
        log1.physicsImpostor.physicsBody.inertia.setZero();
        log1.physicsImpostor.physicsBody.invInertia.setZero();
        log1.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        log1.freezeWorldMatrix();
        //log1.convertToUnIndexedMesh();
        log1.setEnabled(true);
        //log1.showBoundingBox = true;
        log1.visibility = 1;
        log1.checkCollisions = true;
        
    });

    //Log 11 (inside the perimeter)
    BABYLON.SceneLoader.ImportMesh("", "meshes/log/", "log.obj", scene, function(meshes){

        log0 = meshes[0];
        log1 = meshes[1];

        log0.rotation = new BABYLON.Vector3(0, 0, 0);
        log1.rotation = new BABYLON.Vector3(0, 0, 0);

        log0.scaling.scaleInPlace(0.2);
        log1.scaling.scaleInPlace(0.2);

        log0.position.y = 0;
        log1.position.y = 0;
        log0.position.x = 285;
        log1.position.x = 285;
        log0.position.z = 20;
        log1.position.z = 20;

        log0.material = log_mat;
        log1.material = log_mat;

        shadowGenerator.addShadowCaster(log0);
        shadowGenerator.addShadowCaster(log1);

        log0.physicsImpostor = new BABYLON.PhysicsImpostor(log0, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 80, restitution: 0});
        log0.physicsImpostor.physicsBody.inertia.setZero();
        log0.physicsImpostor.physicsBody.invInertia.setZero();
        log0.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        log0.freezeWorldMatrix();
        //log0.convertToUnIndexedMesh();
        log0.setEnabled(true);
        //log0.showBoundingBox = true;
        log0.visibility = 1;
        log0.checkCollisions = true;

        log1.physicsImpostor = new BABYLON.PhysicsImpostor(log1, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 80, restitution: 0});
        log1.physicsImpostor.physicsBody.inertia.setZero();
        log1.physicsImpostor.physicsBody.invInertia.setZero();
        log1.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        log1.freezeWorldMatrix();
        //log1.convertToUnIndexedMesh();
        log1.setEnabled(true);
        //log1.showBoundingBox = true;
        log1.visibility = 1;
        log1.checkCollisions = true;

    });

    //Log 12 (inside the perimeter)
    BABYLON.SceneLoader.ImportMesh("", "meshes/log/", "log.obj", scene, function(meshes){

        log0 = meshes[0];
        log1 = meshes[1];

        log0.rotation = new BABYLON.Vector3(0, 0, 0);
        log1.rotation = new BABYLON.Vector3(0, 0, 0);

        log0.scaling.scaleInPlace(0.2);
        log1.scaling.scaleInPlace(0.2);

        log0.position.y = 13;
        log1.position.y = 13;
        log0.position.x = 260;
        log1.position.x = 260;
        log0.position.z = 0;
        log1.position.z = 0;

        log0.material = log_mat;
        log1.material = log_mat;

        shadowGenerator.addShadowCaster(log0);
        shadowGenerator.addShadowCaster(log1);

        log0.physicsImpostor = new BABYLON.PhysicsImpostor(log0, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 80, restitution: 0});
        log0.physicsImpostor.physicsBody.inertia.setZero();
        log0.physicsImpostor.physicsBody.invInertia.setZero();
        log0.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        log0.freezeWorldMatrix();
        //log0.convertToUnIndexedMesh();
        log0.setEnabled(true);
        //log0.showBoundingBox = true;
        log0.visibility = 1;
        log0.checkCollisions = true;

        log1.physicsImpostor = new BABYLON.PhysicsImpostor(log1, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 80, restitution: 0});
        log1.physicsImpostor.physicsBody.inertia.setZero();
        log1.physicsImpostor.physicsBody.invInertia.setZero();
        log1.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        log1.freezeWorldMatrix();
        //log1.convertToUnIndexedMesh();
        log1.setEnabled(true);
        //log1.showBoundingBox = true;
        log1.visibility = 1;
        log1.checkCollisions = true;

    });


    //Bushes
    BABYLON.SceneLoader.ImportMesh("", "meshes/bush/", "bush.obj", scene, function(meshes){
        
        //bush type
        var bush = meshes[0];
        var leaves = meshes[1];

        bush.position.z = -200;
        bush.scaling.scaleInPlace(10);
        bush.freezeWorldMatrix();

        leaves.position.z = -200;
        leaves.scaling.scaleInPlace(10);
        leaves.freezeWorldMatrix();

        //materials
        var wood_mat = new BABYLON.StandardMaterial("wood_mat", scene);
        wood_mat.diffuseTexture = new BABYLON.Texture("meshes/bush/wood.jpeg", scene);
        wood_mat.specularTexture = new BABYLON.Texture("meshes/bush/wood.jpeg", scene);
        bush.material = wood_mat;

        var leaves_mat = new BABYLON.StandardMaterial("leaves_mat", scene);
        leaves_mat.diffuseColor = new BABYLON.Vector3(0, 0.3, 0.1);
        leaves.material = leaves_mat;

        //copy 1
        var bush1 = bush.createInstance("");
            bush1.position.x = -100;
            bush1.position.z = -100;
            bush1.scaling.scaleInPlace(1.7);
            shadowGenerator.addShadowCaster(bush1);
            bush1.freezeWorldMatrix();

        var leaves1 = leaves.createInstance("");
            leaves1.position.x = -100;
            leaves1.position.z = -100;
            leaves1.scaling.scaleInPlace(1.7);
            shadowGenerator.addShadowCaster(leaves1);
            leaves1.freezeWorldMatrix();

        //copy 2
        var bush2 = bush.createInstance("");
            bush2.position.x = -300;
            bush2.position.z = -100;
            bush2.scaling.scaleInPlace(2);
            shadowGenerator.addShadowCaster(bush2);
            bush2.freezeWorldMatrix();

        var leaves2 = leaves.createInstance("");
            leaves2.position.x = -300;
            leaves2.position.z = -100;
            leaves2.scaling.scaleInPlace(2);
            shadowGenerator.addShadowCaster(leaves2);
            leaves2.freezeWorldMatrix();

        //copy 3
        var bush3 = bush.createInstance("");
            bush3.position.x = -280;
            bush3.position.z = -280;
            bush3.scaling.scaleInPlace(1.7);
            shadowGenerator.addShadowCaster(bush3);
            bush3.freezeWorldMatrix();

        var leaves3 = leaves.createInstance("");
            leaves3.position.x = -280;
            leaves3.position.z = -280;
            leaves3.scaling.scaleInPlace(1.7);
            shadowGenerator.addShadowCaster(leaves3);
            leaves3.freezeWorldMatrix();

        //copy 4
        var bush4 = bush.createInstance("");
            bush4.position.x = 350;
            bush4.position.z = 350;
            bush4.scaling.scaleInPlace(1.7);
            shadowGenerator.addShadowCaster(bush4);
            bush4.freezeWorldMatrix();

        var leaves4 = leaves.createInstance("");
            leaves4.position.x = 350;
            leaves4.position.z = 350;
            leaves4.scaling.scaleInPlace(1.7);
            shadowGenerator.addShadowCaster(leaves4);
            leaves4.freezeWorldMatrix();

        //copy 5
        var bush5 = bush.createInstance("");
            bush5.position.x = 400;
            bush5.position.z = 200;
            bush5.scaling.scaleInPlace(2.1);
            shadowGenerator.addShadowCaster(bush5);
            bush5.freezeWorldMatrix();

        var leaves5 = leaves.createInstance("");
            leaves5.position.x = 400;
            leaves5.position.z = 200;
            leaves5.scaling.scaleInPlace(2.1);
            shadowGenerator.addShadowCaster(leaves5);
            leaves5.freezeWorldMatrix();

        //copy 6
        var bush6 = bush.createInstance("");
            bush6.position.x = 350;
            bush6.position.z = -350;
            bush6.scaling.scaleInPlace(1.7);
            shadowGenerator.addShadowCaster(bush6);
            bush6.freezeWorldMatrix();

        var leaves6 = leaves.createInstance("");
            leaves6.position.x = 350;
            leaves6.position.z = -350;
            leaves6.scaling.scaleInPlace(1.7);
            shadowGenerator.addShadowCaster(leaves6);
            leaves6.freezeWorldMatrix();

        //copy 7
        var bush7 = bush.createInstance("");
            bush7.position.x = 400;
            bush7.position.z = -200;
            bush7.scaling.scaleInPlace(2.1);
            shadowGenerator.addShadowCaster(bush7);
            bush7.freezeWorldMatrix();

        var leaves7 = leaves.createInstance("");
            leaves7.position.x = 400;
            leaves7.position.z = -200;
            leaves7.scaling.scaleInPlace(2.1);
            shadowGenerator.addShadowCaster(leaves7);
            leaves7.freezeWorldMatrix();

        //copy 8
        var bush8 = bush.createInstance("");
            bush8.position.x = 230;
            bush8.position.z = -250;
            bush8.scaling.scaleInPlace(2.2);
            shadowGenerator.addShadowCaster(bush8);
            bush8.freezeWorldMatrix();

        var leaves8 = leaves.createInstance("");
            leaves8.position.x = 230;
            leaves8.position.z = -250;
            leaves8.scaling.scaleInPlace(2.2);
            shadowGenerator.addShadowCaster(leaves8);
            leaves8.freezeWorldMatrix();

        //copy 9
        var bush9 = bush.createInstance("");
            bush9.position.x = -410;
            bush9.position.z = 410;
            bush9.scaling.scaleInPlace(2.2);
            shadowGenerator.addShadowCaster(bush9);
            bush9.freezeWorldMatrix();

        var leaves9 = leaves.createInstance("");
            leaves9.position.x = -410;
            leaves9.position.z = 410;
            leaves9.scaling.scaleInPlace(2.2);
            shadowGenerator.addShadowCaster(leaves9);
            leaves9.freezeWorldMatrix();

        //copy 10
        var bush10 = bush.createInstance("");
            bush10.position.x = -430;
            bush10.position.z = 315;
            bush10.scaling.scaleInPlace(2.5);
            shadowGenerator.addShadowCaster(bush10);
            bush10.freezeWorldMatrix();

        var leaves10 = leaves.createInstance("");
            leaves10.position.x = -430;
            leaves10.position.z = 315;
            leaves10.scaling.scaleInPlace(2.5);
            shadowGenerator.addShadowCaster(leaves10);
            leaves10.freezeWorldMatrix();

        //copy 11
        var bush11 = bush.createInstance("");
            bush11.position.x = -240;
            bush11.position.z = 480;
            bush11.scaling.scaleInPlace(2.8);
            shadowGenerator.addShadowCaster(bush11);
            bush11.freezeWorldMatrix();

        var leaves11 = leaves.createInstance("");
            leaves11.position.x = -240;
            leaves11.position.z = 480;
            leaves11.scaling.scaleInPlace(2.8);
            shadowGenerator.addShadowCaster(leaves11);
            leaves11.freezeWorldMatrix();

        //copy 12
        var bush12 = bush.createInstance("");
            bush12.position.x = -110;
            bush12.position.z = 440;
            bush12.scaling.scaleInPlace(2.4);
            shadowGenerator.addShadowCaster(bush12);
            bush12.freezeWorldMatrix();

        var leaves12 = leaves.createInstance("");
            leaves12.position.x = -110;
            leaves12.position.z = 440;
            leaves12.scaling.scaleInPlace(2.4);
            shadowGenerator.addShadowCaster(leaves12);
            leaves12.freezeWorldMatrix();

        //copy 13
        var bush13 = bush.createInstance("");
            bush13.position.x = 200;
            bush13.position.z = 360;
            bush13.scaling.scaleInPlace(1.8);
            shadowGenerator.addShadowCaster(bush13);
            bush13.freezeWorldMatrix();

        var leaves13 = leaves.createInstance("");
            leaves13.position.x = 200;
            leaves13.position.z = 360;
            leaves13.scaling.scaleInPlace(1.8);
            shadowGenerator.addShadowCaster(leaves13);
            leaves13.freezeWorldMatrix();

        //copy 14
        var bush14 = bush.createInstance("");
            bush14.position.x = 450;
            bush14.position.z = 360;
            bush14.scaling.scaleInPlace(1.5);
            shadowGenerator.addShadowCaster(bush14);
            bush14.freezeWorldMatrix();

        var leaves14 = leaves.createInstance("");
            leaves14.position.x = 450;
            leaves14.position.z = 360;
            leaves14.scaling.scaleInPlace(1.5);
            shadowGenerator.addShadowCaster(leaves14);
            leaves14.freezeWorldMatrix();

        //copy 15
        var bush15 = bush.createInstance("");
            bush15.position.x = 470;
            bush15.position.z = 400;
            bush15.scaling.scaleInPlace(1.5);
            shadowGenerator.addShadowCaster(bush15);
            bush15.freezeWorldMatrix();

        var leaves15 = leaves.createInstance("");
            leaves15.position.x = 470;
            leaves15.position.z = 400;
            leaves15.scaling.scaleInPlace(1.5);
            shadowGenerator.addShadowCaster(leaves15);
            leaves15.freezeWorldMatrix();

        //copy 16
        var bush16 = bush.createInstance("");
            bush16.position.x = -450;
            bush16.position.z = -450;
            bush16.scaling.scaleInPlace(2.5);
            shadowGenerator.addShadowCaster(bush16);
            bush16.freezeWorldMatrix();

        var leaves16 = leaves.createInstance("");
            leaves16.position.x = -450;
            leaves16.position.z = -450;
            leaves16.scaling.scaleInPlace(2.5);
            shadowGenerator.addShadowCaster(leaves16);
            leaves16.freezeWorldMatrix();
        
        //copy 17
        var bush17 = bush.createInstance("");
            bush17.position.x = -430;
            bush17.position.z = -80;
            bush17.scaling.scaleInPlace(2.8);
            shadowGenerator.addShadowCaster(bush17);
            bush17.freezeWorldMatrix();

        var leaves17 = leaves.createInstance("");
            leaves17.position.x = -430;
            leaves17.position.z = -80;
            leaves17.scaling.scaleInPlace(2.8);
            shadowGenerator.addShadowCaster(leaves17);
            leaves17.freezeWorldMatrix();

        //copy 18
        var bush18 = bush.createInstance("");
            bush18.position.x = -450;
            bush18.position.z = 100;
            shadowGenerator.addShadowCaster(bush18);
            bush18.freezeWorldMatrix();

        var leaves18 = leaves.createInstance("");
            leaves18.position.x = -450;
            leaves18.position.z = 100;
            shadowGenerator.addShadowCaster(leaves18);
            leaves18.freezeWorldMatrix();

    });

    //Fences
    var fence1, fence2, fence3, fence4, fence5, fence6, fence6, fence7, fence8, fence9, fence10;
    var fence11, fence12, fence13, fence14, fence15, fence16, fence17;
    var fence_mat = new BABYLON.StandardMaterial("fence_mat",scene);
    fence_mat.bumpTexture = new BABYLON.Texture("meshes/fence/fence_normals.png",scene);
    fence_mat.diffuseTexture = new BABYLON.Texture("meshes/fence/fence_texture.png",scene);
    fence_mat.specularTexture = new BABYLON.Texture("meshes/fence/fence_texture.png",scene);

    BABYLON.SceneLoader.ImportMesh("", "meshes/fence/", "fence.obj", scene, function(meshes){

        fence1 = meshes[1];

        meshes[1].position.x = 270;
        meshes[0].position.x = 270;
        meshes[1].position.z = 285;
        meshes[0].position.z = 285;
        meshes[1].scaling.scaleInPlace(7);
        meshes[0].scaling.scaleInPlace(7);
        meshes[0].rotation = new BABYLON.Vector3(0, 1.6, 0);
        meshes[1].rotation = new BABYLON.Vector3(0, 1.6, 0);

        meshes[0].material= fence_mat;
        meshes[1].material= fence_mat;

        shadowGenerator.addShadowCaster(meshes[0]);
        shadowGenerator.addShadowCaster(meshes[1]);

        meshes[1].physicsImpostor = new BABYLON.PhysicsImpostor(meshes[1], BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        meshes[1].physicsImpostor.physicsBody.inertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertiaWorld.setZero();
        meshes[1].freezeWorldMatrix();
        meshes[1].convertToUnIndexedMesh();
        meshes[1].setEnabled(true);
        //meshes[1].showBoundingBox = true;
        meshes[1].visibility = 1;
        meshes[1].checkCollisions = true;

    });

    BABYLON.SceneLoader.ImportMesh("", "meshes/fence/", "fence.obj", scene, function(meshes){

        fence2 = meshes[1];

        meshes[1].position.x = 212;
        meshes[0].position.x = 212;
        meshes[1].position.z = 285;
        meshes[0].position.z = 285;
        meshes[1].scaling.scaleInPlace(7);
        meshes[0].scaling.scaleInPlace(7);
        meshes[0].rotation = new BABYLON.Vector3(0, 1.6, 0);
        meshes[1].rotation = new BABYLON.Vector3(0, 1.6, 0);

        meshes[0].material= fence_mat;
        meshes[1].material= fence_mat;

        shadowGenerator.addShadowCaster(meshes[0]);
        shadowGenerator.addShadowCaster(meshes[1]);

        meshes[1].physicsImpostor = new BABYLON.PhysicsImpostor(meshes[1], BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        meshes[1].physicsImpostor.physicsBody.inertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertiaWorld.setZero();
        meshes[1].freezeWorldMatrix();
        meshes[1].convertToUnIndexedMesh();
        meshes[1].setEnabled(true);
        //meshes[1].showBoundingBox = true;
        meshes[1].visibility = 1;
        meshes[1].checkCollisions = true;

    });
    
    BABYLON.SceneLoader.ImportMesh("", "meshes/fence/", "fence.obj", scene, function(meshes){

        fence3 = meshes[1];

        meshes[1].position.x = 153;
        meshes[0].position.x = 153;
        meshes[1].position.z = 285;
        meshes[0].position.z = 285;
        meshes[1].scaling.scaleInPlace(7);
        meshes[0].scaling.scaleInPlace(7);
        meshes[0].rotation = new BABYLON.Vector3(0, 1.6, 0);
        meshes[1].rotation = new BABYLON.Vector3(0, 1.6, 0);

        meshes[0].material= fence_mat;
        meshes[1].material= fence_mat;

        shadowGenerator.addShadowCaster(meshes[0]);
        shadowGenerator.addShadowCaster(meshes[1]);

        meshes[1].physicsImpostor = new BABYLON.PhysicsImpostor(meshes[1], BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        meshes[1].physicsImpostor.physicsBody.inertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertiaWorld.setZero();
        meshes[1].freezeWorldMatrix();
        meshes[1].convertToUnIndexedMesh();
        meshes[1].setEnabled(true);
        //meshes[1].showBoundingBox = true;
        meshes[1].visibility = 1;
        meshes[1].checkCollisions = true;

    });

    BABYLON.SceneLoader.ImportMesh("", "meshes/fence/", "fence.obj", scene, function(meshes){

        fence4 = meshes[1];

        meshes[1].position.x = 95;
        meshes[0].position.x = 95;
        meshes[1].position.z = 285;
        meshes[0].position.z = 285;
        meshes[1].scaling.scaleInPlace(7);
        meshes[0].scaling.scaleInPlace(7);
        meshes[0].rotation = new BABYLON.Vector3(0, 1.6, 0);
        meshes[1].rotation = new BABYLON.Vector3(0, 1.6, 0);

        meshes[0].material= fence_mat;
        meshes[1].material= fence_mat;

        shadowGenerator.addShadowCaster(meshes[0]);
        shadowGenerator.addShadowCaster(meshes[1]);

        meshes[1].physicsImpostor = new BABYLON.PhysicsImpostor(meshes[1], BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        meshes[1].physicsImpostor.physicsBody.inertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertiaWorld.setZero();
        meshes[1].freezeWorldMatrix();
        meshes[1].convertToUnIndexedMesh();
        meshes[1].setEnabled(true);
        //meshes[1].showBoundingBox = true;
        meshes[1].visibility = 1;
        meshes[1].checkCollisions = true;

    });

    BABYLON.SceneLoader.ImportMesh("", "meshes/fence/", "fence.obj", scene, function(meshes){

        fence5 = meshes[1];

        meshes[1].position.x = 55;
        meshes[0].position.x = 55;
        meshes[1].position.z = 255;
        meshes[0].position.z = 255;
        meshes[1].scaling.scaleInPlace(7);
        meshes[0].scaling.scaleInPlace(7);

        meshes[0].material= fence_mat;
        meshes[1].material= fence_mat;

        shadowGenerator.addShadowCaster(meshes[0]);
        shadowGenerator.addShadowCaster(meshes[1]);

        meshes[1].physicsImpostor = new BABYLON.PhysicsImpostor(meshes[1], BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        meshes[1].physicsImpostor.physicsBody.inertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertiaWorld.setZero();
        meshes[1].freezeWorldMatrix();
        meshes[1].convertToUnIndexedMesh();
        meshes[1].setEnabled(true);
        //meshes[1].showBoundingBox = true;
        meshes[1].visibility = 1;
        meshes[1].checkCollisions = true;

    });

    BABYLON.SceneLoader.ImportMesh("", "meshes/fence/", "fence.obj", scene, function(meshes){

        fence6 = meshes[1];

        meshes[1].position.x = 55;
        meshes[0].position.x = 55;
        meshes[1].position.z = 197;
        meshes[0].position.z = 197;
        meshes[1].scaling.scaleInPlace(7);
        meshes[0].scaling.scaleInPlace(7);
        meshes[0].material= fence_mat;
        meshes[1].material= fence_mat;

        shadowGenerator.addShadowCaster(meshes[0]);
        shadowGenerator.addShadowCaster(meshes[1]);
        
        meshes[1].physicsImpostor = new BABYLON.PhysicsImpostor(meshes[1], BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        meshes[1].physicsImpostor.physicsBody.inertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertiaWorld.setZero();
        meshes[1].freezeWorldMatrix();
        meshes[1].convertToUnIndexedMesh();
        meshes[1].setEnabled(true);
        //meshes[1].showBoundingBox = true;
        meshes[1].visibility = 1;
        meshes[1].checkCollisions = true;

    });

    BABYLON.SceneLoader.ImportMesh("", "meshes/fence/", "fence.obj", scene, function(meshes){

        fence7 = meshes[1];

        meshes[1].position.x = 55;
        meshes[0].position.x = 55;
        meshes[1].position.z = 139;
        meshes[0].position.z = 139;
        meshes[1].scaling.scaleInPlace(7);
        meshes[0].scaling.scaleInPlace(7);

        meshes[0].material= fence_mat;
        meshes[1].material= fence_mat;

        shadowGenerator.addShadowCaster(meshes[0]);
        shadowGenerator.addShadowCaster(meshes[1]);

        meshes[1].physicsImpostor = new BABYLON.PhysicsImpostor(meshes[1], BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        meshes[1].physicsImpostor.physicsBody.inertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertiaWorld.setZero();
        meshes[1].freezeWorldMatrix();
        meshes[1].convertToUnIndexedMesh();
        meshes[1].setEnabled(true);
        //meshes[1].showBoundingBox = true;
        meshes[1].visibility = 1;
        meshes[1].checkCollisions = true;

    });

    BABYLON.SceneLoader.ImportMesh("", "meshes/fence/", "fence.obj", scene, function(meshes){

        fence8 = meshes[1];

        meshes[1].position.x = 55;
        meshes[0].position.x = 55;
        meshes[1].position.z = 80;
        meshes[0].position.z = 80;
        meshes[1].scaling.scaleInPlace(7);
        meshes[0].scaling.scaleInPlace(7);

        meshes[0].material= fence_mat;
        meshes[1].material= fence_mat;

        shadowGenerator.addShadowCaster(meshes[0]);
        shadowGenerator.addShadowCaster(meshes[1]);

        meshes[1].physicsImpostor = new BABYLON.PhysicsImpostor(meshes[1], BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        meshes[1].physicsImpostor.physicsBody.inertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertiaWorld.setZero();
        meshes[1].freezeWorldMatrix();
        meshes[1].convertToUnIndexedMesh();
        meshes[1].setEnabled(true);
        //meshes[1].showBoundingBox = true;
        meshes[1].visibility = 1;
        meshes[1].checkCollisions = true;

    });

    BABYLON.SceneLoader.ImportMesh("", "meshes/fence/", "fence.obj", scene, function(meshes){

        fence9 = meshes[1];

        meshes[1].position.x = 120;
        meshes[0].position.x = 120;
        meshes[1].position.z = -15;
        meshes[0].position.z = -15;
        meshes[1].scaling.scaleInPlace(7);
        meshes[0].scaling.scaleInPlace(7);
        meshes[0].rotation = new BABYLON.Vector3(0, 1.6, 0);
        meshes[1].rotation = new BABYLON.Vector3(0, 1.6, 0);

        meshes[0].material= fence_mat;
        meshes[1].material= fence_mat;

        shadowGenerator.addShadowCaster(meshes[0]);
        shadowGenerator.addShadowCaster(meshes[1]);

        meshes[1].physicsImpostor = new BABYLON.PhysicsImpostor(meshes[1], BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        meshes[1].physicsImpostor.physicsBody.inertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertiaWorld.setZero();
        meshes[1].freezeWorldMatrix();
        meshes[1].convertToUnIndexedMesh();
        meshes[1].setEnabled(true);
        //meshes[1].showBoundingBox = true;
        meshes[1].visibility = 1;
        meshes[1].checkCollisions = true;

    });

    BABYLON.SceneLoader.ImportMesh("", "meshes/fence/", "fence.obj", scene, function(meshes){

        fence10 = meshes[1];

        meshes[1].position.x = 180;
        meshes[0].position.x = 180;
        meshes[1].position.z = -15;
        meshes[0].position.z = -15;
        meshes[1].scaling.scaleInPlace(7);
        meshes[0].scaling.scaleInPlace(7);
        meshes[0].rotation = new BABYLON.Vector3(0, 1.6, 0);
        meshes[1].rotation = new BABYLON.Vector3(0, 1.6, 0);

        meshes[0].material= fence_mat;
        meshes[1].material= fence_mat;

        shadowGenerator.addShadowCaster(meshes[0]);
        shadowGenerator.addShadowCaster(meshes[1]);

        meshes[1].physicsImpostor = new BABYLON.PhysicsImpostor(meshes[1], BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        meshes[1].physicsImpostor.physicsBody.inertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertiaWorld.setZero();
        meshes[1].freezeWorldMatrix();
        meshes[1].convertToUnIndexedMesh();
        meshes[1].setEnabled(true);
        //meshes[1].showBoundingBox = true;
        meshes[1].visibility = 1;
        meshes[1].checkCollisions = true;

    });

    BABYLON.SceneLoader.ImportMesh("", "meshes/fence/", "fence.obj", scene, function(meshes){

        fence11 = meshes[1];

        meshes[1].position.x = 237;
        meshes[0].position.x = 237;
        meshes[1].position.z = -15;
        meshes[0].position.z = -15;
        meshes[1].scaling.scaleInPlace(7);
        meshes[0].scaling.scaleInPlace(7);
        meshes[0].rotation = new BABYLON.Vector3(0, 1.6, 0);
        meshes[1].rotation = new BABYLON.Vector3(0, 1.6, 0);

        meshes[0].material= fence_mat;
        meshes[1].material= fence_mat;

        shadowGenerator.addShadowCaster(meshes[0]);
        shadowGenerator.addShadowCaster(meshes[1]);

        meshes[1].physicsImpostor = new BABYLON.PhysicsImpostor(meshes[1], BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        meshes[1].physicsImpostor.physicsBody.inertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertiaWorld.setZero();
        meshes[1].freezeWorldMatrix();
        meshes[1].convertToUnIndexedMesh();
        meshes[1].setEnabled(true);
        //meshes[1].showBoundingBox = true;
        meshes[1].visibility = 1;
        meshes[1].checkCollisions = true;

    });

    BABYLON.SceneLoader.ImportMesh("", "meshes/fence/", "fence.obj", scene, function(meshes){

        fence12 = meshes[1];

        meshes[1].position.x = 295;
        meshes[0].position.x = 295;
        meshes[1].position.z = -15;
        meshes[0].position.z = -15;
        meshes[1].scaling.scaleInPlace(7);
        meshes[0].scaling.scaleInPlace(7);
        meshes[0].rotation = new BABYLON.Vector3(0, 1.6, 0);
        meshes[1].rotation = new BABYLON.Vector3(0, 1.6, 0);

        meshes[0].material= fence_mat;
        meshes[1].material= fence_mat;

        shadowGenerator.addShadowCaster(meshes[0]);
        shadowGenerator.addShadowCaster(meshes[1]);

        meshes[1].physicsImpostor = new BABYLON.PhysicsImpostor(meshes[1], BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        meshes[1].physicsImpostor.physicsBody.inertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertiaWorld.setZero();
        meshes[1].freezeWorldMatrix();
        meshes[1].convertToUnIndexedMesh();
        meshes[1].setEnabled(true);
        //meshes[1].showBoundingBox = true;
        meshes[1].visibility = 1;
        meshes[1].checkCollisions = true;

    });

    BABYLON.SceneLoader.ImportMesh("", "meshes/fence/", "fence.obj", scene, function(meshes){

        fence13 = meshes[1];
        
        meshes[1].position.x = 293;
        meshes[0].position.x = 293;
        meshes[1].position.z = 245;
        meshes[0].position.z = 245;
        meshes[1].scaling.scaleInPlace(7);
        meshes[0].scaling.scaleInPlace(7);
        meshes[0].rotation = new BABYLON.Vector3(0, -0.1, 0);
        meshes[1].rotation = new BABYLON.Vector3(0, -0.1, 0);

        meshes[0].material= fence_mat;
        meshes[1].material= fence_mat;

        shadowGenerator.addShadowCaster(meshes[0]);
        shadowGenerator.addShadowCaster(meshes[1]);

        meshes[1].physicsImpostor = new BABYLON.PhysicsImpostor(meshes[1], BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        meshes[1].physicsImpostor.physicsBody.inertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertiaWorld.setZero();
        meshes[1].freezeWorldMatrix();
        meshes[1].convertToUnIndexedMesh();
        meshes[1].setEnabled(true);
        //meshes[1].showBoundingBox = true;
        meshes[1].visibility = 1;
        meshes[1].checkCollisions = true;

    });

    BABYLON.SceneLoader.ImportMesh("", "meshes/fence/", "fence.obj", scene, function(meshes){

        fence14 = meshes[1];

        meshes[1].position.x = 300;
        meshes[0].position.x = 300;
        meshes[1].position.z = 187;
        meshes[0].position.z = 187;
        meshes[1].scaling.scaleInPlace(7);
        meshes[0].scaling.scaleInPlace(7);
        meshes[0].rotation = new BABYLON.Vector3(0, -0.1, 0);
        meshes[1].rotation = new BABYLON.Vector3(0, -0.1, 0);

        meshes[0].material= fence_mat;
        meshes[1].material= fence_mat;
        
        shadowGenerator.addShadowCaster(meshes[0]);
        shadowGenerator.addShadowCaster(meshes[1]);
        
        meshes[1].physicsImpostor = new BABYLON.PhysicsImpostor(meshes[1], BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        meshes[1].physicsImpostor.physicsBody.inertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertiaWorld.setZero();
        meshes[1].freezeWorldMatrix();
        meshes[1].convertToUnIndexedMesh();
        meshes[1].setEnabled(true);
        //meshes[1].showBoundingBox = true;
        meshes[1].visibility = 1;
        meshes[1].checkCollisions = true;

    });

    BABYLON.SceneLoader.ImportMesh("", "meshes/fence/", "fence.obj", scene, function(meshes){

        fence15 = meshes[1];

        meshes[1].position.x = 305;
        meshes[0].position.x = 305;
        meshes[1].position.z = 130;
        meshes[0].position.z = 130;
        meshes[1].scaling.scaleInPlace(7);
        meshes[0].scaling.scaleInPlace(7);
        meshes[0].rotation = new BABYLON.Vector3(0, -0.1, 0);
        meshes[1].rotation = new BABYLON.Vector3(0, -0.1, 0);

        meshes[0].material= fence_mat;
        meshes[1].material= fence_mat;

        shadowGenerator.addShadowCaster(meshes[0]);
        shadowGenerator.addShadowCaster(meshes[1]);

        meshes[1].physicsImpostor = new BABYLON.PhysicsImpostor(meshes[1], BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        meshes[1].physicsImpostor.physicsBody.inertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertiaWorld.setZero();
        meshes[1].freezeWorldMatrix();
        meshes[1].convertToUnIndexedMesh();
        meshes[1].setEnabled(true);
        //meshes[1].showBoundingBox = true;
        meshes[1].visibility = 1;
        meshes[1].checkCollisions = true;

    });

    BABYLON.SceneLoader.ImportMesh("", "meshes/fence/", "fence.obj", scene, function(meshes){

        fence16 = meshes[1];

        meshes[1].position.x = 310;
        meshes[0].position.x = 310;
        meshes[1].position.z = 72;
        meshes[0].position.z = 72;
        meshes[1].scaling.scaleInPlace(7);
        meshes[0].scaling.scaleInPlace(7);
        meshes[0].rotation = new BABYLON.Vector3(0, -0.1, 0);
        meshes[1].rotation = new BABYLON.Vector3(0, -0.1, 0);

        meshes[0].material= fence_mat;
        meshes[1].material= fence_mat;

        shadowGenerator.addShadowCaster(meshes[0]);
        shadowGenerator.addShadowCaster(meshes[1]);

        meshes[1].physicsImpostor = new BABYLON.PhysicsImpostor(meshes[1], BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        meshes[1].physicsImpostor.physicsBody.inertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertiaWorld.setZero();
        meshes[1].freezeWorldMatrix();
        meshes[1].convertToUnIndexedMesh();
        meshes[1].setEnabled(true);
        //meshes[1].showBoundingBox = true;
        meshes[1].visibility = 1;
        meshes[1].checkCollisions = true;

    });

    BABYLON.SceneLoader.ImportMesh("", "meshes/fence/", "fence.obj", scene, function(meshes){

        fence17 = meshes[1];
        meshes[1].position.x = 315;
        meshes[0].position.x = 315;
        meshes[1].position.z = 15;
        meshes[0].position.z = 15;
        meshes[1].scaling.scaleInPlace(7);
        meshes[0].scaling.scaleInPlace(7);
        meshes[0].rotation = new BABYLON.Vector3(0, -0.1, 0);
        meshes[1].rotation = new BABYLON.Vector3(0, -0.1, 0);

        meshes[0].material= fence_mat;
        meshes[1].material= fence_mat;

        shadowGenerator.addShadowCaster(meshes[0]);
        shadowGenerator.addShadowCaster(meshes[1]);

        meshes[1].physicsImpostor = new BABYLON.PhysicsImpostor(meshes[1], BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        meshes[1].physicsImpostor.physicsBody.inertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertiaWorld.setZero();
        meshes[1].freezeWorldMatrix();
        meshes[1].convertToUnIndexedMesh();
        meshes[1].setEnabled(true);
        //meshes[1].showBoundingBox = true;
        meshes[1].visibility = 1;
        meshes[1].checkCollisions = true;

    });
    

    //Game Perimeter
    var perimeter = [];
    var perimeter_mat = new BABYLON.StandardMaterial("perimeter_mat", scene);
    perimeter_mat.alpha = 0;

    //side type
	var side = BABYLON.Mesh.CreateBox("side", 2, scene);

        hemisph_light.excludedMeshes.push(side);
		dir_light.excludedMeshes.push(side);
		side.setEnabled(false);

    var side1 = side.clone();
        side1.position = new BABYLON.Vector3(200, 100, 300);
        side1.scaling = new BABYLON.Vector3(100, 50, 10);
        hemisph_light.excludedMeshes.push(side1);
        dir_light.excludedMeshes.push(side1);

        side1.physicsImpostor = new BABYLON.PhysicsImpostor(side1, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 10000, restitution: 0});
        side1.physicsImpostor.physicsBody.inertia.setZero();
        side1.physicsImpostor.physicsBody.invInertia.setZero();
        side1.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        side1.freezeWorldMatrix();
        side1.convertToUnIndexedMesh();
        side1.setEnabled(true);
        //side1.showBoundingBox = true;
        side1.visibility = 1;
        side1.checkCollisions = true;
        side1.material = perimeter_mat;
        perimeter.push(side1);

    var side2 = side.clone();
        side2.position = new BABYLON.Vector3(0, 100, 300);
        side2.scaling = new BABYLON.Vector3(100, 50, 10);
        hemisph_light.excludedMeshes.push(side2);
        dir_light.excludedMeshes.push(side2);

        side2.physicsImpostor = new BABYLON.PhysicsImpostor(side2, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 10000, restitution: 0});
        side2.physicsImpostor.physicsBody.inertia.setZero();
        side2.physicsImpostor.physicsBody.invInertia.setZero();
        side2.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        side2.freezeWorldMatrix();
        side2.convertToUnIndexedMesh();
        side2.setEnabled(true);
        side2.visibility = 1;
        //side2.showBoundingBox = true;
        side2.checkCollisions = true;
        side2.material = perimeter_mat;
        perimeter.push(side2); 

    var side3 = side.clone();
        side3.position = new BABYLON.Vector3(-200, 100, 300);
        side3.scaling = new BABYLON.Vector3(100, 50, 10);
        hemisph_light.excludedMeshes.push(side3);
        dir_light.excludedMeshes.push(side3);

        side3.physicsImpostor = new BABYLON.PhysicsImpostor(side3, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 10000, restitution: 0});
        side3.physicsImpostor.physicsBody.inertia.setZero();
        side3.physicsImpostor.physicsBody.invInertia.setZero();
        side3.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        side3.freezeWorldMatrix();
        side3.convertToUnIndexedMesh();
        side3.setEnabled(true);
        //side3.showBoundingBox = true;
        side3.visibility = 1;
        side3.checkCollisions = true;
        side3.material = perimeter_mat;
        perimeter.push(side3);

    var side4 = side.clone();
        side4.position = new BABYLON.Vector3(320, 100, 190);
        side4.scaling = new BABYLON.Vector3(100, 50, 10);
        side4.rotation = new BABYLON.Vector3(0, 80, 0);
        hemisph_light.excludedMeshes.push(side4);
        dir_light.excludedMeshes.push(side4);

        side4.physicsImpostor = new BABYLON.PhysicsImpostor(side4, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 10000, restitution: 0});
        side4.physicsImpostor.physicsBody.inertia.setZero();
        side4.physicsImpostor.physicsBody.invInertia.setZero();
        side4.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        side4.freezeWorldMatrix();
        side4.convertToUnIndexedMesh();
        side4.setEnabled(true);
        //side4.showBoundingBox = true;
        side4.visibility = 1;
        side4.checkCollisions = true;
        side4.material = perimeter_mat;
        perimeter.push(side4);

    var side5 = side.clone();
        side5.position = new BABYLON.Vector3(340, 100, -10);
        side5.scaling = new BABYLON.Vector3(100, 50, 10);
        side5.rotation = new BABYLON.Vector3(0, 80, 0);
        hemisph_light.excludedMeshes.push(side5);
        dir_light.excludedMeshes.push(side5);

        side5.physicsImpostor = new BABYLON.PhysicsImpostor(side5, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 10000, restitution: 0});
        side5.physicsImpostor.physicsBody.inertia.setZero();
        side5.physicsImpostor.physicsBody.invInertia.setZero();
        side5.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        side5.freezeWorldMatrix();
        side5.convertToUnIndexedMesh();
        side5.setEnabled(true);
        //side5.showBoundingBox = true;
        side5.visibility = 1;
        side5.checkCollisions = true;
        side5.material = perimeter_mat;
        perimeter.push(side5);

    var side6 = side.clone();
        side6.position = new BABYLON.Vector3(360, 100, -210);
        side6.scaling = new BABYLON.Vector3(100, 50, 10);
        side6.rotation = new BABYLON.Vector3(0, 80, 0);
        hemisph_light.excludedMeshes.push(side6);
        dir_light.excludedMeshes.push(side6);

        side6.physicsImpostor = new BABYLON.PhysicsImpostor(side6, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 10000, restitution: 0});
        side6.physicsImpostor.physicsBody.inertia.setZero();
        side6.physicsImpostor.physicsBody.invInertia.setZero();
        side6.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        side6.freezeWorldMatrix();
        side6.convertToUnIndexedMesh();
        side6.setEnabled(true);
        //side6.showBoundingBox = true;
        side6.visibility = 1;
        side6.checkCollisions = true;
        side6.material = perimeter_mat;
        perimeter.push(side6);

    var side7 = side.clone();
        side7.position = new BABYLON.Vector3(260, 100, -320);
        side7.scaling = new BABYLON.Vector3(100, 50, 10);
        hemisph_light.excludedMeshes.push(side7);
        dir_light.excludedMeshes.push(side7);

        side7.physicsImpostor = new BABYLON.PhysicsImpostor(side7, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 10000, restitution: 0});
        side7.physicsImpostor.physicsBody.inertia.setZero();
        side7.physicsImpostor.physicsBody.invInertia.setZero();
        side7.physicsImpostor.physicsBody.invInertiaWorld.setZero(); 
        side7.freezeWorldMatrix();
        side7.convertToUnIndexedMesh();
        side7.setEnabled(true);
        //side7.showBoundingBox = true;
        side7.visibility = 1;
        side7.checkCollisions = true;
        side7.material = perimeter_mat;
        perimeter.push(side7);

    var side8 = side.clone();
        side8.position = new BABYLON.Vector3(60, 100, -320);
        side8.scaling = new BABYLON.Vector3(100, 50, 10);
        hemisph_light.excludedMeshes.push(side8);
        dir_light.excludedMeshes.push(side8);

        side8.physicsImpostor = new BABYLON.PhysicsImpostor(side8, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 10000, restitution: 0});
        side8.physicsImpostor.physicsBody.inertia.setZero();
        side8.physicsImpostor.physicsBody.invInertia.setZero();
        side8.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        side8.freezeWorldMatrix();
        side8.convertToUnIndexedMesh();
        side8.setEnabled(true);
        //side8.showBoundingBox = true;
        side8.visibility = 1;
        side8.checkCollisions = true;
        side8.material = perimeter_mat;
        perimeter.push(side8);

    var side9 = side.clone();
        side9.position = new BABYLON.Vector3(-140, 100, -320);
        side9.scaling = new BABYLON.Vector3(100, 50, 10);
        hemisph_light.excludedMeshes.push(side9);
        dir_light.excludedMeshes.push(side9);

        side9.physicsImpostor = new BABYLON.PhysicsImpostor(side9, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 10000, restitution: 0});
        side9.physicsImpostor.physicsBody.inertia.setZero();
        side9.physicsImpostor.physicsBody.invInertia.setZero();
        side9.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        side9.freezeWorldMatrix();
        side9.convertToUnIndexedMesh();
        side9.setEnabled(true);
        //side9.showBoundingBox = true;
        side9.visibility = 1;
        side9.checkCollisions = true;
        side9.material = perimeter_mat;
        perimeter.push(side9);

    var side10 = side.clone();
        side10.position = new BABYLON.Vector3(-260, 100, -210);
        side10.scaling = new BABYLON.Vector3(100, 50, 10);
        side10.rotation = new BABYLON.Vector3(0, 80, 0);
        hemisph_light.excludedMeshes.push(side10);
        dir_light.excludedMeshes.push(side10);

        side10.physicsImpostor = new BABYLON.PhysicsImpostor(side10, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 10000, restitution: 0});
        side10.physicsImpostor.physicsBody.inertia.setZero();
        side10.physicsImpostor.physicsBody.invInertia.setZero();
        side10.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        side10.freezeWorldMatrix();
        side10.convertToUnIndexedMesh();
        side10.setEnabled(true);
        //side10.showBoundingBox = true;
        side10.visibility = 1;
        side10.checkCollisions = true;
        side10.material = perimeter_mat;
        perimeter.push(side10);

    var side11 = side.clone();
        side11.position = new BABYLON.Vector3(-280, 100, -10);
        side11.scaling = new BABYLON.Vector3(100, 50, 10);
        side11.rotation = new BABYLON.Vector3(0, 80, 0);
        hemisph_light.excludedMeshes.push(side11);
        dir_light.excludedMeshes.push(side11);

        side11.physicsImpostor = new BABYLON.PhysicsImpostor(side11, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 10000, restitution: 0});
        side11.physicsImpostor.physicsBody.inertia.setZero();
        side11.physicsImpostor.physicsBody.invInertia.setZero();
        side11.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        side11.freezeWorldMatrix();
        side11.convertToUnIndexedMesh();
        side11.setEnabled(true);
        //side11.showBoundingBox = true;
        side11.visibility = 1;
        side11.checkCollisions = true;
        side11.material = perimeter_mat;
        perimeter.push(side11);

    var side12 = side.clone();
        side12.position = new BABYLON.Vector3(-300, 100, 190);
        side12.scaling = new BABYLON.Vector3(100, 50, 10);
        side12.rotation = new BABYLON.Vector3(0, 80, 0);
        hemisph_light.excludedMeshes.push(side12);
        dir_light.excludedMeshes.push(side12);

        side12.physicsImpostor = new BABYLON.PhysicsImpostor(side12, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 10000, restitution: 0});
        side12.physicsImpostor.physicsBody.inertia.setZero();
        side12.physicsImpostor.physicsBody.invInertia.setZero();
        side12.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        side12.freezeWorldMatrix();
        side12.convertToUnIndexedMesh();
        side12.setEnabled(true);
        //side12.showBoundingBox = true;
        side12.visibility = 1;
        side12.checkCollisions = true;
        side12.material = perimeter_mat;
        perimeter.push(side12);


    //Trees
    var tree1 = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
        
        meshes[0].position.x = -220;
        meshes[0].position.z = 320;
        meshes[0].scaling = new BABYLON.Vector3(600, 500, 500);
        meshes[0].material.opacityTexture = null;
        meshes[0].material.backFaceCulling = false;
        shadowGenerator.addShadowCaster(meshes[0]);

    });

    var tree2 = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
        
        meshes[0].position.x = -400;
        meshes[0].position.z = 450;
        meshes[0].scaling = new BABYLON.Vector3(600, 600, 600);
        meshes[0].material.opacityTexture = null;
        meshes[0].material.backFaceCulling = false;
        shadowGenerator.addShadowCaster(meshes[0]);

    });

    var tree3 = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
        
        meshes[0].position.x = -440;
        meshes[0].position.z = 450;
        meshes[0].scaling = new BABYLON.Vector3(600, 700, 450);
        meshes[0].material.opacityTexture = null;
        meshes[0].material.backFaceCulling = false;
        shadowGenerator.addShadowCaster(meshes[0]);

    });

    var tree4 = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
        
        meshes[0].position.x = -25;
        meshes[0].position.z = 350;
        meshes[0].scaling = new BABYLON.Vector3(400, 400, 350);
        meshes[0].material.opacityTexture = null;
        meshes[0].material.backFaceCulling = false;
        shadowGenerator.addShadowCaster(meshes[0]);

    });

    var tree5 = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
        
        meshes[0].position.x = 50;
        meshes[0].position.z = 350;
        meshes[0].scaling = new BABYLON.Vector3(400, 400, 500);
        meshes[0].material.opacityTexture = null;
        meshes[0].material.backFaceCulling = false;
        shadowGenerator.addShadowCaster(meshes[0]);

    });

    var tree6 = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
        
        meshes[0].position.x = -370;
        meshes[0].position.z = 320;
        meshes[0].scaling = new BABYLON.Vector3(700, 700, 700);
        meshes[0].material.opacityTexture = null;
        meshes[0].material.backFaceCulling = false;
        shadowGenerator.addShadowCaster(meshes[0]);

    });

    var tree7 = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
        
        meshes[0].position.x = -430;
        meshes[0].position.z = 400;
        meshes[0].scaling = new BABYLON.Vector3(500, 500, 500);
        meshes[0].material.opacityTexture = null;
        meshes[0].material.backFaceCulling = false;
        shadowGenerator.addShadowCaster(meshes[0]);

    });

    var tree8 = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
        
        meshes[0].position.x = -450;
        meshes[0].position.z = 200;
        meshes[0].scaling = new BABYLON.Vector3(800, 900, 500);
        meshes[0].material.opacityTexture = null;
        meshes[0].material.backFaceCulling = false;
        shadowGenerator.addShadowCaster(meshes[0]);

    });

    var tree9 = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
        
        meshes[0].position.x = -350;
        meshes[0].position.z = 250;
        meshes[0].scaling = new BABYLON.Vector3(500, 500, 500);
        meshes[0].material.opacityTexture = null;
        meshes[0].material.backFaceCulling = false;
        shadowGenerator.addShadowCaster(meshes[0]);

    });

    var tree10 = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
        
        meshes[0].position.x = -330;
        meshes[0].position.z = 40;
        meshes[0].scaling = new BABYLON.Vector3(500, 500, 350);
        meshes[0].material.opacityTexture = null;
        meshes[0].material.backFaceCulling = false;
        shadowGenerator.addShadowCaster(meshes[0]);

    });

    var tree11 = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
        
        meshes[0].position.x = -290;
        meshes[0].position.z = 120;
        meshes[0].scaling = new BABYLON.Vector3(400, 400, 300);
        meshes[0].material.opacityTexture = null;
        meshes[0].material.backFaceCulling = false;
        shadowGenerator.addShadowCaster(meshes[0]);

    });

    var tree12 = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
        
        meshes[0].position.x = -100;
        meshes[0].position.z = 300;
        meshes[0].scaling = new BABYLON.Vector3(800, 800, 550);
        meshes[0].material.opacityTexture = null;
        meshes[0].material.backFaceCulling = false;
        shadowGenerator.addShadowCaster(meshes[0]);

    });

    var tree13 = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
        
        meshes[0].position.x = -55;
        meshes[0].position.z = 460;
        meshes[0].scaling = new BABYLON.Vector3(600, 600, 300);
        meshes[0].material.opacityTexture = null;
        meshes[0].material.backFaceCulling = false;
        shadowGenerator.addShadowCaster(meshes[0]);

    });

    var tree14 = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
        
        meshes[0].position.x = 110;
        meshes[0].position.z = 430;
        meshes[0].scaling = new BABYLON.Vector3(800, 500, 350);
        meshes[0].material.opacityTexture = null;
        meshes[0].material.backFaceCulling = false;
        shadowGenerator.addShadowCaster(meshes[0]);

    });

    var tree15 = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
        
        meshes[0].position.x = 430;
        meshes[0].position.z = 430;
        meshes[0].scaling = new BABYLON.Vector3(800, 500, 650);
        meshes[0].material.opacityTexture = null;
        meshes[0].material.backFaceCulling = false;
        shadowGenerator.addShadowCaster(meshes[0]);

    });

    var tree16 = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
        
        meshes[0].position.x = 430;
        meshes[0].position.z = 350;
        meshes[0].scaling = new BABYLON.Vector3(600, 600, 350);
        meshes[0].material.opacityTexture = null;
        meshes[0].material.backFaceCulling = false;
        shadowGenerator.addShadowCaster(meshes[0]);

    });

    var tree17 = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
        
        meshes[0].position.x = 435;
        meshes[0].position.z = 305;
        meshes[0].scaling = new BABYLON.Vector3(600, 600, 600);
        meshes[0].material.opacityTexture = null;
        meshes[0].material.backFaceCulling = false;
        shadowGenerator.addShadowCaster(meshes[0]);

    });

    var tree18 = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
        
        meshes[0].position.x = 450;
        meshes[0].position.z = 180;
        meshes[0].scaling = new BABYLON.Vector3(600, 650, 500);
        meshes[0].material.opacityTexture = null;
        meshes[0].material.backFaceCulling = false;
        shadowGenerator.addShadowCaster(meshes[0]);

    }); 

    var tree19 = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
        
        meshes[0].position.x = 300;
        meshes[0].position.z = 400;
        meshes[0].scaling = new BABYLON.Vector3(600, 600, 600);
        meshes[0].material.opacityTexture = null;
        meshes[0].material.backFaceCulling = false;
        shadowGenerator.addShadowCaster(meshes[0]);
    
    });

    var tree20 = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
        
        meshes[0].position.x = 400;
        meshes[0].position.z = 0;
        meshes[0].scaling = new BABYLON.Vector3(800, 800, 550);
        meshes[0].material.opacityTexture = null;
        meshes[0].material.backFaceCulling = false;
        shadowGenerator.addShadowCaster(meshes[0]);

    });

    var tree21 = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
        
        meshes[0].position.x = -350;
        meshes[0].position.z = -400;
        meshes[0].scaling = new BABYLON.Vector3(800, 800, 800);
        meshes[0].material.opacityTexture = null;
        meshes[0].material.backFaceCulling = false;
        shadowGenerator.addShadowCaster(meshes[0]);

    });

    var tree22 = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
        
        meshes[0].position.x = 180;
        meshes[0].position.z = -380;
        meshes[0].scaling = new BABYLON.Vector3(600, 600, 600);
        meshes[0].material.opacityTexture = null;
        meshes[0].material.backFaceCulling = false;
        shadowGenerator.addShadowCaster(meshes[0]);
    
    });

    var tree23 = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
    
        meshes[0].position.x = 450;
        meshes[0].position.z = -400;
        meshes[0].scaling = new BABYLON.Vector3(600, 600, 600);
        meshes[0].material.opacityTexture = null;
        meshes[0].material.backFaceCulling = false;
        shadowGenerator.addShadowCaster(meshes[0]);
    
    });

    //Inside the perimeter

    //Bounding box for tree inside the perimeter
    var bounding24;
    var boundingBox_tree24 = BABYLON.MeshBuilder.CreateBox("boundingBox_tree24", {height: 20.0, width: 22, depth: 100}, scene);
        boundingBox_tree24.rotation = new BABYLON.Vector3(Math.PI/2, 0, 0);
        boundingBox_tree24.position.y = 0;
        boundingBox_tree24.position.x = -155;
        boundingBox_tree24.position.z = 130;
    var boundingBox_tree24_mat = new BABYLON.StandardMaterial("boundingBox_tree24_mat", scene);
        boundingBox_tree24_mat.alpha = 0;
        boundingBox_tree24_mat.material = boundingBox_tree24_mat;
        boundingBox_tree24.visibility = 0;


    var tree24 = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
        
        meshes[0].position.x = -150;
        meshes[0].position.z = 130;
        meshes[0].scaling = new BABYLON.Vector3(600, 650, 700);
        meshes[0].material.opacityTexture = null;
        meshes[0].material.backFaceCulling = false;
        shadowGenerator.addShadowCaster(meshes[0]);
    
        boundingBox_tree24.physicsImpostor = new BABYLON.PhysicsImpostor(boundingBox_tree24, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 10000, restitution: 0});
        boundingBox_tree24.physicsImpostor.physicsBody.inertia.setZero();
        boundingBox_tree24.physicsImpostor.physicsBody.invInertia.setZero();
        boundingBox_tree24.physicsImpostor.physicsBody.invInertiaWorld.setZero();

        meshes[0].freezeWorldMatrix();
        
    });

    //Bounding box for tree inside the perimeter
    var bounding25;
    var boundingBox_tree25 = BABYLON.MeshBuilder.CreateBox("boundingBox_tree25", {height: 20.0, width: 22, depth: 100}, scene);
        boundingBox_tree25.rotation = new BABYLON.Vector3(Math.PI/2, 0, 0);
        boundingBox_tree25.position.y = 0;
        boundingBox_tree25.position.x = 145;
        boundingBox_tree25.position.z = -80;
    var boundingBox_tree25_mat = new BABYLON.StandardMaterial("boundingBox_tree25_mat", scene);
        boundingBox_tree25_mat.alpha = 0;
        boundingBox_tree25_mat.material = boundingBox_tree25_mat;
        boundingBox_tree25.visibility = 0;

    var tree25 = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
        
        meshes[0].position.x = 150;
        meshes[0].position.z = -80;
        meshes[0].scaling = new BABYLON.Vector3(600, 600, 400);
        meshes[0].material.opacityTexture = null;
        meshes[0].material.backFaceCulling = false;
        shadowGenerator.addShadowCaster(meshes[0]);

        boundingBox_tree25.physicsImpostor = new BABYLON.PhysicsImpostor(boundingBox_tree25, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 10000, restitution: 0});
        boundingBox_tree25.physicsImpostor.physicsBody.inertia.setZero();
        boundingBox_tree25.physicsImpostor.physicsBody.invInertia.setZero();
        boundingBox_tree25.physicsImpostor.physicsBody.invInertiaWorld.setZero();

        meshes[0].freezeWorldMatrix();
        
    });

    //Bounding box for tree inside the perimeter
    var bounding26;
    var boundingBox_tree26 = BABYLON.MeshBuilder.CreateBox("boundingBox_tree26", {height: 30.0, width: 30, depth: 100}, scene);
        boundingBox_tree26.rotation = new BABYLON.Vector3(Math.PI/2, 0, 0);
        boundingBox_tree26.position.y = 0;
        boundingBox_tree26.position.x = 10;
        boundingBox_tree26.position.z = 260;
    var boundingBox_tree26_mat = new BABYLON.StandardMaterial("boundingBox_tree26_mat", scene);
        boundingBox_tree26_mat.alpha = 0;
        boundingBox_tree26_mat.material = boundingBox_tree26_mat;
        boundingBox_tree26.visibility = 0;

    var tree13 = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
        
        meshes[0].position.x = 15;
        meshes[0].position.z = 260;
        meshes[0].scaling = new BABYLON.Vector3(800, 1000, 400);
        meshes[0].material.opacityTexture = null;
        meshes[0].material.backFaceCulling = false;
        shadowGenerator.addShadowCaster(meshes[0]);

        boundingBox_tree26.physicsImpostor = new BABYLON.PhysicsImpostor(boundingBox_tree26, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 10000, restitution: 0});
        boundingBox_tree26.physicsImpostor.physicsBody.inertia.setZero();
        boundingBox_tree26.physicsImpostor.physicsBody.invInertia.setZero();
        boundingBox_tree26.physicsImpostor.physicsBody.invInertiaWorld.setZero();

        meshes[0].freezeWorldMatrix();

    });

    scene.blockfreeActiveMeshesAndRenderingGroups = false;


    // KEYBOARD INPUT
    var map = {};
	scene.actionManager = new BABYLON.ActionManager(scene);

	scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
		map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
	}));
	scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
		map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
	}));


    //Carrot  
    var carrot;
    var carrot1, carrot2, carrot3, carrot4, carrot5, carrot6, carrot7, carrot8, carrot9;
    BABYLON.SceneLoader.ImportMesh("", "meshes/carrot/", "carrot.obj", scene, function (meshes) {
        
        carrot = meshes[0];
        carrot.position.y = -500;
        carrot.position.x = 320;
        carrot.scaling.scaleInPlace(0.06);
        carrot.isVisible = false;
        //carrot.showBoundingBox = true;

        carrot1 = carrot.createInstance("");
        carrot1.position.x = 280;
        carrot1.position.z = 55;
        carrot1.position.y = 1;

        carrot2 = carrot.createInstance("");
        carrot2.position.x = 50;
        carrot2.position.z = 10;
        carrot2.position.y = 1;

        carrot3 = carrot.createInstance("");
        carrot3.position.x = -150;
        carrot3.position.z = -40;
        carrot3.position.y = 1;

        carrot4 = carrot.createInstance("");
        carrot4.position.x = -50;
        carrot4.position.z = 190;
        carrot4.position.y = 1;

        carrot5 = carrot.createInstance("");
        carrot5.position.x = +50;
        carrot5.position.z = -190;
        carrot5.position.y = 1;

        if(difficulty == 1 || difficulty == 2){
            carrot6 = carrot.createInstance("");
            carrot6.position.x = 180;
            carrot6.position.z = -80;
            carrot6.position.y = 1;

            carrot7 = carrot.createInstance("");
            carrot7.position.x = -100;
            carrot7.position.z =-100;
            carrot7.position.y = 1;

            carrot8 = carrot.createInstance("");
            carrot8.position.x = -100;
            carrot8.position.z = 60;
            carrot8.position.y = 1;

            carrot9 = carrot.createInstance("");
            carrot9.position.x = 150;
            carrot9.position.z = 70;
            carrot9.position.y = 1;
        }

        // Carrot motion
        scene.registerBeforeRender(function () {

            if(carrot_motion > 30){
                carrot_change = true;
            }else if(carrot_motion < 10){
                carrot_change = false;
            }

            if(!carrot_change){
                carrot1.position.y += 0.07;
                carrot2.position.y += 0.07;
                carrot3.position.y += 0.07;
                carrot4.position.y += 0.07;
                carrot5.position.y += 0.07;
                if(difficulty == 1 || difficulty == 2){
                    carrot6.position.y += 0.07;
                    carrot7.position.y += 0.07;
                    carrot8.position.y += 0.07;
                    carrot9.position.y += 0.07;
                }
                carrot_motion++;
            }
            
            else{
                carrot1.position.y -= 0.07;
                carrot2.position.y -= 0.07;
                carrot3.position.y -= 0.07;
                carrot4.position.y -= 0.07;
                carrot5.position.y -= 0.07;
                if(difficulty == 1 || difficulty == 2){
                    carrot6.position.y -= 0.07;
                    carrot7.position.y -= 0.07;
                    carrot8.position.y -= 0.07;
                    carrot9.position.y -= 0.07;
                }
                carrot_motion--;
            }
            
        });

        shadowGenerator.addShadowCaster(carrot);
        shadowGenerator.addShadowCaster(carrot2);
        shadowGenerator.addShadowCaster(carrot3);
        shadowGenerator.addShadowCaster(carrot4);
        shadowGenerator.addShadowCaster(carrot5);

    });
    
    //Dummy
    var dummy, dummy_skeleton;
    var d_box;

    var dummyBox = BABYLON.MeshBuilder.CreateBox("dummyBox", {height: 30, width: 10, depth: 20}, scene);
    dummyBox.position.y = 15;
    dummyBox.position.x = -40;
    dummyBox.position.z = 40;

    var dummyBox_mat = new BABYLON.StandardMaterial("dummyBox_mat", scene);
    dummyBox_mat.alpha = 0;
    dummyBox.material = dummyBox_mat;

    BABYLON.SceneLoader.ImportMesh("", "meshes/dummy/", "dummy2.babylon", scene, function (meshes, particleSystems, skeletons){ 
        
        //console.log("dummy mesh:", meshes);

        dummy = meshes[0];
        dummy.scaling.scaleInPlace(18);
        dummy.position.y = -15;
        
        // DUMMY COLOR
        /*
        var dummy_mat = new BABYLON.StandardMaterial("dummy_mat", scene);
	    //dummy_mat.ambientColor = new BABYLON.Color3(1, 0, 0);
        //dummy_mat.specularColor = new BABYLON.Color3(1, 0, 0);
        //dummy_mat.emissiveColor = new BABYLON.Color3(1, 0, 0);
        dummy_mat.diffuseColor = new BABYLON.Color3(1, 0, 0);

        dummy.material = dummy_mat;
        */
        //dummy.scaling = new BABYLON.Vector3(5.0, 5.0, 5.0);
        //dummy.position = new BABYLON.Vector3(0, -3.5, 0.1);

        shadowGenerator.addShadowCaster(dummy);

        dummy_skeleton = skeletons[0];
        dummy.parent = dummyBox;
        //dummyBox.showBoundingBox = true;
        d_box = meshes[1];

        dummyBox.physicsImpostor = new BABYLON.PhysicsImpostor(dummyBox, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 60, restitution: 0});
		dummyBox.physicsImpostor.physicsBody.inertia.setZero();
		dummyBox.physicsImpostor.physicsBody.invInertia.setZero();
		dummyBox.physicsImpostor.physicsBody.invInertiaWorld.setZero();

        //Lock camera on the character 
        camera.target = dummyBox;

        //dummy_skeleton -> 66 bones

/*
        // skeletonViewer
		var skeletonViewer = new BABYLON.Debug.SkeletonViewer(dummy_skeleton, dummy, scene);
		skeletonViewer.isEnabled = true; // Enable it
		skeletonViewer.color = BABYLON.Color3.Black(); // Change default color from white to red

         //inspector
        scene.debugLayer.show({
            embedMode:true
        });
*/

        for(i=0; i<67; i++){
           // if (dummy_skeleton.bones[i]) console.log(i);
            dummy_skeleton.bones[i].linkTransformNode(null); 
        }


/*
        dummy_skeleton.bones[1].rotate(BABYLON.Axis.Z, -0.5, BABYLON.Space.LOCAL);  //torace
        //dummy_skeleton.bones[2].rotate(BABYLON.Axis.Z, -0.5, BABYLON.Space.LOCAL);  //torace
        //dummy_skeleton.bones[3].rotate(BABYLON.Axis.Z, -0.5, BABYLON.Space.LOCAL);  //torace

        dummy_skeleton.bones[4].rotate(BABYLON.Axis.Z, -0.5, BABYLON.Space.LOCAL);  //testa
        dummy_skeleton.bones[5].rotate(BABYLON.Axis.Z, 1, BABYLON.Space.LOCAL);  //collo
        dummy_skeleton.bones[6].rotate(BABYLON.Axis.Z, 1, BABYLON.Space.LOCAL);  //collo
        dummy_skeleton.bones[7].rotate(BABYLON.Axis.Z, 1, BABYLON.Space.LOCAL);  //collo
        dummy_skeleton.bones[8].rotate(BABYLON.Axis.Z, 1, BABYLON.Space.LOCAL);  //collo

        //braccio sx
        dummy_skeleton.bones[9].rotate(BABYLON.Axis.Z, 1, BABYLON.Space.LOCAL);  //spalla sx
        dummy_skeleton.bones[10].rotate(BABYLON.Axis.Z, 1.3, BABYLON.Space.LOCAL);  //braccio sx
        dummy_skeleton.bones[11].rotate(BABYLON.Axis.Z, 0.5, BABYLON.Space.LOCAL);  //avambraccio sx
        dummy_skeleton.bones[11].rotate(BABYLON.Axis.X, -1, BABYLON.Space.LOCAL);  //avambraccio sx
        dummy_skeleton.bones[12].rotate(BABYLON.Axis.X, 1, BABYLON.Space.LOCAL);  //mano sx
        //13, 14, 15, 16, 17, 18
        //dummy_skeleton.bones[19].rotate(BABYLON.Axis.Z, 1, BABYLON.Space.LOCAL);  //apertura mano
        //20,21,22,... dita

        //braccio dx
        dummy_skeleton.bones[33].rotate(BABYLON.Axis.Z, 1, BABYLON.Space.LOCAL);  //spalla dx
        dummy_skeleton.bones[34].rotate(BABYLON.Axis.Z, -1.3, BABYLON.Space.LOCAL);  //braccio sx
        dummy_skeleton.bones[35].rotate(BABYLON.Axis.Z, -0.5, BABYLON.Space.LOCAL);  //avambraccio sx
        dummy_skeleton.bones[35].rotate(BABYLON.Axis.X, -1, BABYLON.Space.LOCAL);  //avambraccio sx
        dummy_skeleton.bones[36].rotate(BABYLON.Axis.X, 1, BABYLON.Space.LOCAL);  //mano sx

        //gamba & piede dx
        dummy_skeleton.bones[57].rotate(BABYLON.Axis.X, 0.5, BABYLON.Space.LOCAL);  //coscia dx
        dummy_skeleton.bones[58].rotate(BABYLON.Axis.X, 0.5, BABYLON.Space.LOCAL);  //polpaccio dx
        dummy_skeleton.bones[59].rotate(BABYLON.Axis.Z, 0.5, BABYLON.Space.LOCAL);  //piede/caviglia dx
        dummy_skeleton.bones[60].rotate(BABYLON.Axis.Z, 0.5, BABYLON.Space.LOCAL);  //punta piede dx

        //gamba & piede sx 
        dummy_skeleton.bones[62].rotate(BABYLON.Axis.X, 0.5, BABYLON.Space.LOCAL);  //coscia sx
        dummy_skeleton.bones[63].rotate(BABYLON.Axis.X, 0.5, BABYLON.Space.LOCAL);  //polpaccio sx
        dummy_skeleton.bones[64].rotate(BABYLON.Axis.Z, -0.5, BABYLON.Space.LOCAL); //piede/caviglia sx
        dummy_skeleton.bones[65].rotate(BABYLON.Axis.Z, 1, BABYLON.Space.LOCAL);    //caviglia sx
*/

        //dummy initial position

        //braccio sx
        dummy_skeleton.bones[10].rotate(BABYLON.Axis.X, -0.8, BABYLON.Space.LOCAL); //braccio sx
        dummy_skeleton.bones[10].rotate(BABYLON.Axis.Z, 1.4, BABYLON.Space.LOCAL);  //braccio sx
        dummy_skeleton.bones[11].rotate(BABYLON.Axis.Y, -0.4, BABYLON.Space.LOCAL); //avambraccio sx
        dummy_skeleton.bones[11].rotate(BABYLON.Axis.Z, 1.3, BABYLON.Space.LOCAL);  //avambraccio sx
        dummy_skeleton.bones[11].rotate(BABYLON.Axis.X, -1, BABYLON.Space.LOCAL);   //avambraccio sx
        dummy_skeleton.bones[12].rotate(BABYLON.Axis.X, 1, BABYLON.Space.LOCAL);    //mano sx

        //braccio dx
        dummy_skeleton.bones[34].rotate(BABYLON.Axis.X, -0.8, BABYLON.Space.LOCAL); //braccio dx
        dummy_skeleton.bones[34].rotate(BABYLON.Axis.Z, -1.4, BABYLON.Space.LOCAL); //braccio dx
        dummy_skeleton.bones[35].rotate(BABYLON.Axis.Y, 0.4, BABYLON.Space.LOCAL);  //avambraccio sx
        dummy_skeleton.bones[35].rotate(BABYLON.Axis.Z, -1.3, BABYLON.Space.LOCAL); //avambraccio dx
        dummy_skeleton.bones[35].rotate(BABYLON.Axis.X, -1, BABYLON.Space.LOCAL);   //avambraccio dx
        dummy_skeleton.bones[36].rotate(BABYLON.Axis.X, 1, BABYLON.Space.LOCAL);    //mano dx


        scene.registerBeforeRender(function () {
			var dir = camera.getTarget().subtract(camera.position);
                dir.x = dir.x;
				dir.y = -dummyBox.getDirection(new BABYLON.Vector3(0, 0, 1)).y;
				dir.z = dir.z;

            dummyBox.setDirection(dir);
            dummyBox.physicsImpostor.registerOnPhysicsCollide(ground.physicsImpostor, function() {
                jump = 0;
            });
            dummyBox.physicsImpostor.registerOnPhysicsCollide(rock.physicsImpostor, function() {
                jump = 0;
            });
        });

    }); 

    //dummy animation
    var change_dir = false;
    var leg_opening = 0;

    /*  idea: prendo come punto di riferimento una gamba e uso un contatore
        per gestire quanto si allunga durante la corsa */
    var dummy_walkForward = function(){

        if(leg_opening > 3.0) change_dir = true; //cambio verso

        else if(leg_opening < -2.0 ) change_dir = false;
        
        //gamba dx avanti, gamba sx indietro
        if(!change_dir){

            //head
            dummy_skeleton.bones[5].rotate(BABYLON.Axis.Y, 0.015, BABYLON.Space.LOCAL); //head

            //legs
            dummy_skeleton.bones[62].rotate(BABYLON.Axis.X, 0.05, BABYLON.Space.LOCAL); //left upper leg
            dummy_skeleton.bones[63].rotate(BABYLON.Axis.X, 0.02, BABYLON.Space.LOCAL); //left lower leg

            dummy_skeleton.bones[57].rotate(BABYLON.Axis.X, -0.05, BABYLON.Space.LOCAL); //right upper leg
            dummy_skeleton.bones[58].rotate(BABYLON.Axis.X, -0.02, BABYLON.Space.LOCAL); //right lower leg

            //arms
            dummy_skeleton.bones[10].rotate(BABYLON.Axis.X, -0.02, BABYLON.Space.LOCAL); //left arm
            dummy_skeleton.bones[34].rotate(BABYLON.Axis.X, 0.02, BABYLON.Space.LOCAL);  //right arm

            //feet
            dummy_skeleton.bones[59].rotate(BABYLON.Axis.X, 0.001, BABYLON.Space.LOCAL);  //right foot
            dummy_skeleton.bones[64].rotate(BABYLON.Axis.X, -0.001, BABYLON.Space.LOCAL); //left foot

            leg_opening = leg_opening + 0.4;

        }

        //gamba sx avanti, gamba dx indietro
        else{

            //head
            dummy_skeleton.bones[5].rotate(BABYLON.Axis.Y, -0.015, BABYLON.Space.LOCAL); //head

            //legs
            dummy_skeleton.bones[62].rotate(BABYLON.Axis.X, -0.05, BABYLON.Space.LOCAL); //left upper leg
            dummy_skeleton.bones[63].rotate(BABYLON.Axis.X, -0.02, BABYLON.Space.LOCAL); //left lower leg

            dummy_skeleton.bones[57].rotate(BABYLON.Axis.X, 0.05, BABYLON.Space.LOCAL); //right upper leg
            dummy_skeleton.bones[58].rotate(BABYLON.Axis.X, 0.02, BABYLON.Space.LOCAL); //right lower leg

            //arms
            dummy_skeleton.bones[10].rotate(BABYLON.Axis.X, 0.02, BABYLON.Space.LOCAL);  //left arm
            dummy_skeleton.bones[34].rotate(BABYLON.Axis.X, -0.02, BABYLON.Space.LOCAL); //right arm

            //feet
            dummy_skeleton.bones[59].rotate(BABYLON.Axis.X, -0.001, BABYLON.Space.LOCAL); //right foot         
            dummy_skeleton.bones[64].rotate(BABYLON.Axis.X, 0.001, BABYLON.Space.LOCAL);  //left foot
            
            leg_opening = leg_opening - 0.4;

        }

    };

    var dummy_walkBack = function(){

        if(leg_opening > 1.5) change_dir = true; //cambio verso

        else if(leg_opening < -1.5) change_dir = false;

        //gamba dx avanti, gamba sx indietro
        if(!change_dir){

            //head
            dummy_skeleton.bones[5].rotate(BABYLON.Axis.Y, 0.015, BABYLON.Space.LOCAL); //head

            //legs
            dummy_skeleton.bones[62].rotate(BABYLON.Axis.X, 0.05, BABYLON.Space.LOCAL); //left upper leg
            dummy_skeleton.bones[63].rotate(BABYLON.Axis.X, 0.02, BABYLON.Space.LOCAL); //left lower leg

            dummy_skeleton.bones[57].rotate(BABYLON.Axis.X, -0.05, BABYLON.Space.LOCAL); //right upper leg
            dummy_skeleton.bones[58].rotate(BABYLON.Axis.X, -0.02, BABYLON.Space.LOCAL); //left lower leg

            //arms
            dummy_skeleton.bones[10].rotate(BABYLON.Axis.X, -0.02, BABYLON.Space.LOCAL); //left arm
            dummy_skeleton.bones[34].rotate(BABYLON.Axis.X, 0.02, BABYLON.Space.LOCAL);  //right arm

            //feet
            dummy_skeleton.bones[59].rotate(BABYLON.Axis.X, 0.001, BABYLON.Space.LOCAL);  //right foot
            dummy_skeleton.bones[64].rotate(BABYLON.Axis.X, -0.001, BABYLON.Space.LOCAL); //left foot

            leg_opening = leg_opening + 0.4;

        }

        //gamba sx avanti, gamba dx indietro
        else{

            //head
            dummy_skeleton.bones[5].rotate(BABYLON.Axis.Y, -0.015, BABYLON.Space.LOCAL); //head

            //legs
            dummy_skeleton.bones[62].rotate(BABYLON.Axis.X, -0.05, BABYLON.Space.LOCAL); //left upper leg
            dummy_skeleton.bones[63].rotate(BABYLON.Axis.X, -0.02, BABYLON.Space.LOCAL); //left lower leg

            dummy_skeleton.bones[57].rotate(BABYLON.Axis.X, 0.05, BABYLON.Space.LOCAL); //right upper leg
            dummy_skeleton.bones[58].rotate(BABYLON.Axis.X, 0.02, BABYLON.Space.LOCAL); //right upper leg

            //arms
            dummy_skeleton.bones[10].rotate(BABYLON.Axis.X, 0.02, BABYLON.Space.LOCAL);  //left arm
            dummy_skeleton.bones[34].rotate(BABYLON.Axis.X, -0.02, BABYLON.Space.LOCAL); //right arm

            //feet
            dummy_skeleton.bones[59].rotate(BABYLON.Axis.X, -0.001, BABYLON.Space.LOCAL); //right foot         
            dummy_skeleton.bones[64].rotate(BABYLON.Axis.X, 0.001, BABYLON.Space.LOCAL);  //left foot
            
            leg_opening = leg_opening - 0.4;

        }

	};


    //RABBIT
    var rabbit, rabbit_skeleton;
    var r_box;
    var rabbitBox = BABYLON.MeshBuilder.CreateBox("rabbitBox",{ height: 8, width: 7, depth: 7 }, scene);
    rabbitBox.position.y = 5;
    rabbitBox.position.z = -30;

    var rabbitBox_mat = new BABYLON.StandardMaterial("rabbitBox_mat", scene);
    rabbitBox_mat.alpha = 0;
    rabbitBox.material = rabbitBox_mat;

    BABYLON.SceneLoader.ImportMesh("", "meshes/rabbit/", "Rabbit.babylon", scene, function (meshes, particleSystems, skeletons) {

        rabbit = meshes[0];
        rabbit.scaling.scaleInPlace(0.2);
        rabbit.position.y = -3.5;
    
        shadowGenerator.addShadowCaster(rabbit);
    
        rabbit_skeleton = skeletons[0];
    
        rabbit.parent = rabbitBox;
        rabbitBox.showBoundingBox = true;
    
        r_box = meshes[1];
        //r_box.showBoundingBox = true
    
        rabbitBox.physicsImpostor = new BABYLON.PhysicsImpostor(rabbitBox, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 40, restitution: 0});
        rabbitBox.physicsImpostor.physicsBody.inertia.setZero();
        rabbitBox.physicsImpostor.physicsBody.invInertia.setZero();
        rabbitBox.physicsImpostor.physicsBody.invInertiaWorld.setZero();
    
        //rabbit --> 3 bones
        for(i=0; i<4; i++){
            rabbit_skeleton.bones[i].linkTransformNode(null); 
        }
        
        //rabbit_skeleton.bones[1].rotate(BABYLON.Axis.Y, 0.5, BABYLON.Space.LOCAL);  //head
        //rabbit_skeleton.bones[2].rotate(BABYLON.Axis.Y, 0.5, BABYLON.Space.LOCAL);  //right foot
        //rabbit_skeleton.bones[3].rotate(BABYLON.Axis.Y, -0.5, BABYLON.Space.LOCAL); //left foot

    });

    //rabbit animation
    var followCarrot = function(rabbit_mesh, speed, carrot){
        rabbit_mesh.translate(BABYLON.Axis.Z, speed, BABYLON.Space.LOCAL); //translate
        //console.log('rabbit speed Z: '+ speed);
        //rabbit_mesh.translate(BABYLON.Axis.Y, speed, BABYLON.Space.LOCAL); //jump
        //console.log('rabbit speed Y: '+ speed);
        
        var rabbitDir = rabbit_mesh.getAbsolutePosition().subtract(carrot.getAbsolutePosition());
        rabbitDir.y = carrot.getDirection(new BABYLON.Vector3(0, 0, 1)).y;
        rabbitDir.z = -rabbitDir.z;
        rabbitDir.x = -rabbitDir.x;
        rabbit_mesh.setDirection(rabbitDir);
    };

    var animationRabbit = function(rabbit_mesh, speed){

        if(rabbitBox.intersectsMesh(fence5, true, false)){
            rabbit_mesh.translate(BABYLON.Axis.Y, +6.0, BABYLON.Space.LOCAL);
        }
        if(rabbitBox.intersectsMesh(fence6, true, false)){
            rabbit_mesh.translate(BABYLON.Axis.Y, +6.0, BABYLON.Space.LOCAL);

        }
        if(rabbitBox.intersectsMesh(fence7, true, false)){
            rabbit_mesh.translate(BABYLON.Axis.Y, +6.0, BABYLON.Space.LOCAL);

        }
        if(rabbitBox.intersectsMesh(fence8, true, false)){
            rabbit_mesh.translate(BABYLON.Axis.Y, +6.0, BABYLON.Space.LOCAL);

        }
        if(rabbitBox.intersectsMesh(fence9, true, false)){
            rabbit_mesh.translate(BABYLON.Axis.Y, +6.0, BABYLON.Space.LOCAL);

        }
        if(rabbitBox.intersectsMesh(fence10, true, false)){
            rabbit_mesh.translate(BABYLON.Axis.Y, +6.0, BABYLON.Space.LOCAL);

        }
        if(rabbitBox.intersectsMesh(fence11, true, false)){
            rabbit_mesh.translate(BABYLON.Axis.Y, +6.0, BABYLON.Space.LOCAL);

        }
        if(rabbitBox.intersectsMesh(fence12, true, false)){
            rabbit_mesh.translate(BABYLON.Axis.Y, +6.0, BABYLON.Space.LOCAL);

        }

        //default difficulty = easy

        if (take_carrot2 == 0){
            followCarrot(rabbit_mesh, speed, carrot2);   
        }

        else if(take_carrot1 == 0){
            followCarrot(rabbit_mesh, speed, carrot1);
        }

        else if (take_carrot3 == 0){
            followCarrot(rabbit_mesh, speed, carrot3);   
        }

        else if (take_carrot4 == 0){
            followCarrot(rabbit_mesh, speed, carrot4);   
        }

        else if (take_carrot5 == 0){
            followCarrot(rabbit_mesh, speed, carrot5);   
        }

        //if difficulty = medium or hard add other carrots
        else if(difficulty == 1 || difficulty == 2){

            if(take_carrot6 == 0){
                followCarrot(rabbit_mesh, speed, carrot6);
            }

            else if (take_carrot7 == 0){
                followCarrot(rabbit_mesh, speed, carrot7);   
            }

            else if (take_carrot8 == 0){
                followCarrot(rabbit_mesh, speed, carrot8);   
            }

            else if (take_carrot9 == 0){
                followCarrot(rabbit_mesh, speed, carrot9);   
            }

            else{
                //do nothing
            }
        }

        else {
            //do nothing
        }

    };
    

    var rabbit_walkForward = function(){

        if(feet_opening > 3) change_rabbit = true; //cambio verso

        else if(feet_opening < -5) change_rabbit = false;

        if(!change_rabbit){
            
            rabbit_skeleton.bones[2].rotate(BABYLON.Axis.Y, 0.05, BABYLON.Space.LOCAL); //right foot
            rabbit_skeleton.bones[3].rotate(BABYLON.Axis.Y, -0.05, BABYLON.Space.LOCAL); //left foot
            
            feet_opening+=2;

        }else{

            rabbit_skeleton.bones[2].rotate(BABYLON.Axis.Y, -0.05, BABYLON.Space.LOCAL); //right foot
            rabbit_skeleton.bones[3].rotate(BABYLON.Axis.Y, 0.05, BABYLON.Space.LOCAL); //left foot

            feet_opening-=2;
        }
    };

    var dummy_speed = 1.5;
    var rabbit_speed = 0.5; //default easy
    if(difficulty == 1) rabbit_speed2 = 1.0; //medium
    if(difficulty == 2) rabbit_speed2 = 1.5; //hard

    //Rendering loop
    scene.registerAfterRender(function () {    
        sceneOptimizer.start();

        if(num_carrots == 0){
            if(carrots_taken > rabbit_carrots_taken) {bool_win = 1}
            music.stop();
            final_scene = finalScene();
            change_scene = 2;
        }
        
        animationRabbit(rabbitBox, rabbit_speed); //translate and jump

        rabbit_walkForward(); //feet movement

		if((map["w"] || map["W"])) {
			dummyBox.translate(BABYLON.Axis.Z, dummy_speed, BABYLON.Space.LOCAL);
			dummy_walkForward();
		}
		if((map["s"] || map["S"])) {
			dummyBox.translate(BABYLON.Axis.Z, -dummy_speed, BABYLON.Space.LOCAL);
			dummy_walkBack();
		}
        if(map[" "] && jump == 0){
            dummyBox.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, 5000, 0), dummyBox.getAbsolutePosition());
            jump=1;
        }

       if(dummyBox.intersectsMesh(carrot1, true, false) ){
            if(take_carrot1 == 0){
                carrot_sound_dummy.play();
                carrot1.dispose();
                carrots_taken++;
                num_carrots--;
            }
            take_carrot1++;
            ComputeCarrots(); 
        }

        if(dummyBox.intersectsMesh(carrot2, true, false) ){
            if(take_carrot2 == 0){
                carrot_sound_dummy.play();
                carrot2.dispose();
                carrots_taken++;
                num_carrots--;
            }
            take_carrot2++;
            ComputeCarrots(); 
        }

        if( dummyBox.intersectsMesh(carrot3, true, false) ){
            if(take_carrot3 == 0){
                carrot_sound_dummy.play();
                carrot3.dispose();
                carrots_taken++;
                num_carrots--;
            }
            take_carrot3++;
            ComputeCarrots(); 
        }

        if( dummyBox.intersectsMesh(carrot4, true, false) ){
            if(take_carrot4 == 0){
                carrot_sound_dummy.play();
                carrot4.dispose();
                carrots_taken++;
                num_carrots--;
            }
            take_carrot4++;
            ComputeCarrots(); 
        }

        if( dummyBox.intersectsMesh(carrot5, true, false) ){
            if(take_carrot5 == 0){
                carrot_sound_dummy.play();
                carrot5.dispose();
                carrots_taken++;
                num_carrots--;
            }
            take_carrot5++;
            ComputeCarrots();  
        }

        if(difficulty == 1 || difficulty == 2){
            if( dummyBox.intersectsMesh(carrot6, true, false) ){
                if(take_carrot6 == 0){
                    carrot_sound_dummy.play();
                    carrot6.dispose();
                    carrots_taken++;
                    num_carrots--;
                }
                take_carrot6++;
                ComputeCarrots(); 
            }

            if( dummyBox.intersectsMesh(carrot7, true, false) ){
                if(take_carrot7 == 0){
                    carrot_sound_dummy.play();
                    carrot7.dispose();
                    carrots_taken++;
                    num_carrots--;
                }
                take_carrot7++;
                ComputeCarrots(); 
            }

            if( dummyBox.intersectsMesh(carrot8, true, false) ){
                if(take_carrot8 == 0){
                    carrot_sound_dummy.play();
                    carrot8.dispose();
                    carrots_taken++;
                    num_carrots--;
                }
                take_carrot8++;
                ComputeCarrots(); 
            }

            if( dummyBox.intersectsMesh(carrot9, true, false) ){
                if(take_carrot9 == 0){
                    carrot_sound_dummy.play();
                    carrot9.dispose();
                    carrots_taken++;
                    num_carrots--;
                }
                take_carrot9++;
                ComputeCarrots(); 
            }
        }

        if( rabbitBox.intersectsMesh(carrot1, true, false) ){
            if(take_carrot1 == 0){
                carrot_sound.play();
                carrot1.dispose();
                rabbit_carrots_taken++;
                num_carrots--;
            }
            take_carrot1++;
            ComputeCarrots(); 
            //animationRabbit(rabbitBox, rabbit_speed);
        }

        if( rabbitBox.intersectsMesh(carrot2, true, false) ){
            if(take_carrot2 == 0){
                carrot_sound.play();
                carrot2.dispose();
                rabbit_carrots_taken++;
                num_carrots--;
            }
            take_carrot2++;
            ComputeCarrots(); 
            //animationRabbit(rabbitBox, rabbit_speed);
        }

        if( rabbitBox.intersectsMesh(carrot3, true, false) ){
            if(take_carrot3 == 0){
                carrot_sound.play();
                carrot3.dispose();
                rabbit_carrots_taken++;
                num_carrots--;
            }
            take_carrot3++;
            ComputeCarrots(); 
            //animationRabbit(rabbitBox, rabbit_speed);
        }

        if( rabbitBox.intersectsMesh(carrot4, true, false) ){
            if(take_carrot4 == 0){
                carrot_sound.play();
                carrot4.dispose();
                rabbit_carrots_taken++;
                num_carrots--;
            }
            take_carrot4++;
            ComputeCarrots(); 
            //animationRabbit(rabbitBox, rabbit_speed);
        }

        if( rabbitBox.intersectsMesh(carrot5, true, false) ){
            if(take_carrot5 == 0){
                carrot_sound.play();
                carrot5.dispose();
                rabbit_carrots_taken++;
                num_carrots--;
            }
            take_carrot5++;
            ComputeCarrots(); 
            //animationRabbit(rabbitBox, rabbit_speed);
        }

        if(difficulty == 1 || difficulty == 2){

            if( rabbitBox.intersectsMesh(carrot6, true, false) ){
                if(take_carrot6 == 0){
                    carrot_sound.play();
                    carrot6.dispose();
                    rabbit_carrots_taken++;
                    num_carrots--;
                }
                take_carrot6++;
                ComputeCarrots(); 
                //animationRabbit(rabbitBox, rabbit_speed);
            }
    
            if( rabbitBox.intersectsMesh(carrot7, true, false) ){
                if(take_carrot7 == 0){
                    carrot_sound.play();
                    carrot7.dispose();
                    rabbit_carrots_taken++;
                    num_carrots--;
                }
                take_carrot7++;
                ComputeCarrots(); 
                //animationRabbit(rabbitBox, rabbit_speed);
            }
    
            if( rabbitBox.intersectsMesh(carrot8, true, false) ){
                if(take_carrot8 == 0){
                    carrot_sound.play();
                    carrot8.dispose();
                    rabbit_carrots_taken++;
                    num_carrots--;
                }
                take_carrot8++;
                ComputeCarrots(); 
               // animationRabbit(rabbitBox, rabbit_speed);
            }

            if( rabbitBox.intersectsMesh(carrot9, true, false) ){
                if(take_carrot9 == 0){
                    carrot_sound.play();
                    carrot9.dispose();
                    rabbit_carrots_taken++;
                    num_carrots--;
            }
            take_carrot9++;
            ComputeCarrots(); 
            //animationRabbit(rabbitBox, rabbit_speed);
            }

        }

    });
        
    engine.hideLoadingUI();
    return scene;
};


//Menu Scene
var menuScene = function () {
    engine.displayLoadingUI();
    var menu_scene = new BABYLON.Scene(engine);

    //camera
    var camera = new BABYLON.ArcRotateCamera("camera", -Math.PI/4, Math.PI/4, 3, new BABYLON.Vector3(0, 0, 0), menu_scene);
        camera.lowerRadiusLimit = camera.upperRadiusLimit = camera.radius = 3;
        camera.lowerAlphaLimit = camera.upperAlphaLimit = camera.alpha = null;
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(canvas, true);

    //light
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 0, 0), menu_scene);
        light.parent=camera;
        light.intensity = 1;
        light.groundColor = new BABYLON.Color3(1,1,1);
        light.specular = BABYLON.Color3.Black();

    //GUI Menu
    const guiMenu = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("GUI",true,menu_scene);

    var textureMenu = new BABYLON.GUI.Image("textureMenu", "textures/menu/background.jpg");
	guiMenu.addControl(textureMenu);

    var textmode = new BABYLON.GUI.TextBlock();
        textmode.text = "Choose your mode:";
        textmode.color = "black";
        textmode.alpha = 0.8;
        textmode.fontFamily = "My Font";
        textmode.fontSize =30;
        textmode.width = "50%";
        textmode.height = "10%";
        textmode.paddingTop = "25%";
        textmode.paddingBottom = "-25%";
        textmode.paddingRight = "-10%";
        textmode.paddingLeft = "10%";
        textmode.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        guiMenu.addControl(textmode);

    imageday = new BABYLON.GUI.Image("imageday", "textures/menu/day.jpg");
        imageday.position = new BABYLON.Vector3(0, 4, 0);
        imageday.scaling = new BABYLON.Vector3(0.01,0.01,0.01);
        imageday.width = "30%";
        imageday.height = "40%";
        imageday.top = "5%";
        imageday.bottom = "-5%";
        imageday.right = "3%";
        imageday.left = "-3%";
        imageday.populateNinePatchSlicesFromImage = true;
        guiMenu.addControl(imageday);

    imagenight = new BABYLON.GUI.Image("imagenight", "textures/menu/night.jpg");
        imagenight.position = new BABYLON.Vector3(0, 4, 0);
        imagenight.scaling = new BABYLON.Vector3(0.01,0.01,0.01);
        imagenight.width = "30%";
        imagenight.height = "40%";
        imagenight.top = "5%";
        imagenight.bottom = "-5%";
        imagenight.right = "-30%";
        imagenight.left = "30%";
        imagenight.populateNinePatchSlicesFromImage = true;
        guiMenu.addControl(imagenight);

    var buttonimagenight = BABYLON.GUI.Button.CreateSimpleButton("buttonnight", "");
            buttonimagenight.background = "Black";
            buttonimagenight.hoverCursor = "pointer";
            buttonimagenight.alpha = 0.5;
            buttonimagenight.width = "30%";
            buttonimagenight.height = "40%";
            buttonimagenight.top = "5%";
            buttonimagenight.bottom = "-5%";
            buttonimagenight.right = "-30%";
            buttonimagenight.left = "30%";
            buttonimagenight.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
            guiMenu.addControl(buttonimagenight);

    var buttonimageday = BABYLON.GUI.Button.CreateSimpleButton("buttonday", "");
        buttonimageday.background = "Black";
        buttonimageday.hoverCursor = "pointer";
        buttonimageday.alpha = 0.5;
        buttonimageday.width = "30%";
        buttonimageday.height = "40%";
        buttonimageday.top = "5%";
        buttonimageday.bottom = "-5%";
        buttonimageday.right = "3%";
        buttonimageday.left = "-3%";
        buttonimageday.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        guiMenu.addControl(buttonimageday);


        buttonimageday.onPointerMoveObservable.add(function () {
            buttonimageday.alpha = 0;
        });

        buttonimagenight.onPointerMoveObservable.add(function () {
            buttonimagenight.alpha = 0;
                            
        });

        buttonimageday.onPointerOutObservable.add(function () {
            if(boolimageday){
                buttonimageday.alpha = 0.5;
            }
        });

        buttonimagenight.onPointerOutObservable.add(function () {
            if(boolimagenight){
                buttonimagenight.alpha = 0.5;
            }
        });

        buttonimageday.onPointerClickObservable.add(function () {
            boolimageday = false;
            buttonimageday.alpha = 0;

            boolimagenight = true;
            buttonimagenight.alpha = 0.5;

        });


        buttonimagenight.onPointerClickObservable.add(function () {
            boolimageday = true;
            buttonimageday.alpha = 0.5;

            boolimagenight = false;							
            buttonimagenight.alpha = 0;   
        });


    var textdifficulty = new BABYLON.GUI.TextBlock();
        textdifficulty.text = "Select difficulty:";
        textdifficulty.color = "black";
        textdifficulty.alpha = 0.8;
        textdifficulty.fontFamily = "My Font";
        textdifficulty.fontSize = 30; //30
        textdifficulty.width = "50%";
        textdifficulty.height = "10%";
        textdifficulty.paddingTop = "25%"; //25
        textdifficulty.paddingBottom = "-25%"; //-25
        textdifficulty.paddingRight = "38%"; //38
        textdifficulty.paddingLeft = "-38%";
        textdifficulty.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        guiMenu.addControl(textdifficulty);

    var panel = new BABYLON.GUI.StackPanel();
        panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        panel.width = "20%";
        panel.paddingTop = "33%";
        panel.paddingBottom = "-25.5%";
        panel.paddingRight = "38%";
        panel.paddingLeft = "-38%";
        guiMenu.addControl(panel);
         

    var addButton = function(mode, parent) {

            var button = new BABYLON.GUI.RadioButton();
            button.width = "30px";
            button.height = "30px";
            button.color = "white";
            button.alpha = 0.8;
            button.background = "black";
    
            
            if(difficulty == 0){
                if (mode == "EASY")
                button.isChecked = true;
            }
            if(difficulty == 1){
                if (mode == "MEDIUM")
                button.isChecked = true;
            }
            if(difficulty == 2){
                if (mode == "HARD")
                button.isChecked = true;
            }
    
            button.onIsCheckedChangedObservable.add(function(state) {
                if (state) {
                    if (mode == "EASY"){
                        difficulty = 0;
                    } 
                    if (mode == "MEDIUM"){
                        difficulty = 1
                    }
                    if (mode == "HARD"){ 
                        difficulty = 2
                    }
                }
            });
            
        var header = BABYLON.GUI.Control.AddHeader(button, mode, "150px", { isHorizontal: true, controlFirst: true });
        header.height = "70px";
        header.children[1].width ="180px";
        header.children[1].color = "black";
        header.children[1].fontFamily = "My Font";
        header.children[1].fontSize = 25;
        header.children[1].alpha = 0.8;
        

        parent.addControl(header);   
    }
        
    addButton("EASY", panel);
    addButton("MEDIUM", panel);
    addButton("HARD", panel);

    //start
    var play_button = BABYLON.GUI.Button.CreateSimpleButton("play_button", "Play");
    play_button.top = "35%";
    play_button.width = "14%";
    play_button.height = "9%";
    play_button.right = "13.5%";
    play_button.left = "13.5%";
    // play_button.paddingRight = "13%";
    // play_button.paddingLeft = "-13%";
    play_button.fontFamily = "My Font";
    play_button.textBlock.fontSize = 40;
    play_button.textBlock.color = "white";
    play_button.textBlock.fontFamily = "My Font";
    play_button.background = "grey";
    play_button.hoverCursor = "pointer";
    play_button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    play_button.alpha = 0.8;
    
    guiMenu.addControl(play_button);

    play_button.onPointerMoveObservable.add(function(){
        play_button.background = "orange";
        canvas.style.cursor = "pointer";
    });

    play_button.onPointerOutObservable.add(function () {
        play_button.background = "grey";
        play_button.alpha = 0.8;
    });

    play_button.onPointerUpObservable.add(function () {

            if(boolimageday == false){
                game = gameScene();
                from_menu = 1;
                change_scene = 1    
            }

            else if(boolimagenight == false){
                game = gameScene();
                from_menu = 1;
                change_scene = 1    
            }
   
   
    });

    var instruction = BABYLON.GUI.Button.CreateSimpleButton("instructionbutton", "Instructions");
				instruction.width = "13%";
				instruction.height = "7%";
                instruction.top = "35%";
                instruction.right = "-5%";
				instruction.left = "-5%";
                instruction.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;

                //instruction.paddingTop = "85%";
                //instruction.paddingBottom = "-85%";
                //instruction.paddingRight = "40%";
                //instruction.paddingLeft = "-40%";
				
				instruction.fontFamily = "My Font";
				instruction.textBlock.color = "white";
                instruction.textBlock.fontSize = 30;
				instruction.textBlock.fontFamily = "My Font";
				instruction.background = "grey";
				instruction.hoverCursor = "pointer";
                instruction.alpha = 0.8;
				guiMenu.addControl(instruction);

    instruction.onPointerMoveObservable.add(function () {
				instruction.background = "orange";});

	instruction.onPointerOutObservable.add(function () {
            instruction.background = "grey";
            instruction.alpha = 0.8;
            });

    
    instruction.onPointerUpObservable.add(function () {
				instruction_scene = instructionScene();
				change_scene = 3;
                boolimageday = true;
                boolimagenight = true;
			});


    engine.hideLoadingUI();

    return menu_scene;
}

//Instruction Scene
var instructionScene = function(){
    var scene = new BABYLON.Scene(engine);

    var camera = new BABYLON.ArcRotateCamera("camera1", -Math.PI/4, Math.PI/4, 3, new BABYLON.Vector3(0, 0, 0), scene);
    camera.lowerRadiusLimit = camera.upperRadiusLimit = camera.radius = 3;
    camera.lowerAlphaLimit = camera.upperAlphaLimit = camera.alpha = null;
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);

    var guiInstruction = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("InstructionUI");

    var imageInstruction = new BABYLON.GUI.Image("imageinstruction", "textures/menu/background.jpg");
    imageInstruction.height = "100%";
	guiInstruction.addControl(imageInstruction);
     
    var instruction = new BABYLON.GUI.TextBlock("Instruction",); 
    instruction.color = "Black";
    instruction.top = "-10%";
    instruction.paddingTop = "-55px";
    instruction.paddingBottom = "55px";
    instruction.fontFamily = "My Font";
    instruction.fontSize = 45;
    instruction.resizeToFit = true;
    instruction.text = "Are you the fastest? \n Catch more carrots than the rabbit!";
    instruction.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;

    var instruction_image = new BABYLON.GUI.Image("instruction_image", "textures/menu/instructions.png");
    instruction_image.width = "30%";
    instruction_image.height = "40%";
    instruction_image.paddingTop = "5%";
    instruction_image.paddingBottom = "-5%";
    instruction_image.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;


    var rectangle_instruction = new BABYLON.GUI.Rectangle();
    rectangle_instruction.width = "70%";
    rectangle_instruction.height = "70%";
    rectangle_instruction.paddingTop = "30px";
    rectangle_instruction.paddingBottom = "-30px";
    rectangle_instruction.background = "white";
    rectangle_instruction.alpha = 0.5;


    const menu_button = BABYLON.GUI.Button.CreateSimpleButton("Menu", "Menu");
    menu_button.top = "-120px";
    menu_button.bottom = "120px"
    menu_button.width = 0.1;
    menu_button.height = 0.07;
    menu_button.fontFamily = "My Font";
    menu_button.fontSize = 30;
    menu_button.color = "white";
    menu_button.background = "grey";
    menu_button.alpha = 0.8;
    menu_button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    


    guiInstruction.addControl(rectangle_instruction);
    guiInstruction.addControl(instruction);
    guiInstruction.addControl(instruction_image);
    guiInstruction.addControl(menu_button);

    menu_button.onPointerMoveObservable.add(function(){
        menu_button.background = "orange";
        menu_button.alpha = 0.8;
    });

	menu_button.onPointerOutObservable.add(function () {
        menu_button.background = "grey";
        menu_button.alpha = 0.8;
        });

    menu_button.onPointerUpObservable.add(function () {
 
        menu = menuScene(); 
        change_scene = 0;  
        from_instruction = 1; 
    });

    return scene;
}

//Final Scene
var finalScene = function (){
    var scene = new BABYLON.Scene(engine);

    var camera = new BABYLON.ArcRotateCamera("camera1", -Math.PI/4, Math.PI/4, 3, new BABYLON.Vector3(0, 0, 0), scene);
    camera.lowerRadiusLimit = camera.upperRadiusLimit = camera.radius = 3;
    camera.lowerAlphaLimit = camera.upperAlphaLimit = camera.alpha = null;
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);

    var music;

    var guiFinal = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("WinningUI");

    var imageWin = new BABYLON.GUI.Image("imagewin", "textures/menu/background.jpg");
    imageWin.height = "100%";
	guiFinal.addControl(imageWin);

    var final_text = new BABYLON.GUI.TextBlock("final_text",); 
    final_text.color = "Black";
    final_text.fontFamily = "My Font";
    final_text.fontSize = "80px";
    final_text.paddingTop = "5px";
    final_text.paddingBottom = "-5px";
    final_text.resizeToFit = true;
    final_text.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    final_text.textVerticalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;

    if(bool_win){ 
        music = new BABYLON.Sound("Win", "sounds/congratulation.wav", scene, null, {
            autoplay: true,
            volume: 0.3
        });
        final_text.text = "Congratulations! \n You're the fastest!"
    }
    else{
        music = new BABYLON.Sound("Win", "sounds/gameover.wav", scene, null, {
            autoplay: true,
            volume: 0.3
        });
        final_text.text = "Ops... too slow!"
    }

    var rectangle = new BABYLON.GUI.Rectangle();
    rectangle.width = "70%";
    rectangle.height = "70%";
    rectangle.paddingTop = "30px";
    rectangle.paddingBottom = "-30px";
    rectangle.background = "white";
    rectangle.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    rectangle.alpha = 0.5;

    const restart_button = BABYLON.GUI.Button.CreateSimpleButton("restart", "Play Again");
    restart_button.top = "-110px";
    restart_button.right = "10%";
	restart_button.left = "-10%";
    restart_button.width = "15%";
    restart_button.height = "10%";
    restart_button.fontFamily = "My Font";
    restart_button.fontSize = 30;
    restart_button.color = "white";
    restart_button.background = "grey";
    restart_button.alpha = 0.8;
    restart_button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    restart_button.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    

    const menu_button = BABYLON.GUI.Button.CreateSimpleButton("Menu", "Menu");
    menu_button.top = "-110px";
    menu_button.right = "-10%";
	menu_button.left = "10%";
    menu_button.width = "15%";
    menu_button.height = "10%";
    menu_button.fontFamily = "My Font";
    menu_button.fontSize = 30;
    menu_button.color = "white";
    menu_button.background = "grey";
    menu_button.alpha = 0.8;
    menu_button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    menu_button.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;


    guiFinal.addControl(rectangle);
    guiFinal.addControl(restart_button);
    guiFinal.addControl(menu_button);
    guiFinal.addControl(final_text);

    restart_button.onPointerUpObservable.addOnce(function () {
        jump=0;
        feet_opening = 0;
        change_rabbit = false;

        num_carrots = 5;
        if(difficulty==1 || difficulty==2){
            num_carrots = 9;
        }
        carrots_taken = 0;
        rabbit_carrots_taken = 0;
        bool_win = 0;

        take_carrot1 = 0;
        take_carrot2 = 0;
        take_carrot3 = 0;
        take_carrot4 = 0;
        take_carrot5 = 0;
        take_carrot6 = 0;
        take_carrot7 = 0;
        take_carrot8 = 0;
        take_carrot9 = 0;

        carrot_motion = 0;
        carrot_change = false;

        //load = LOADING_Scene();
        game = gameScene(); 
        change_scene = 1;   
        from_final = 1;
    });

    restart_button.onPointerMoveObservable.add(function(){
        restart_button.background = "orange";
        restart_button.alpha = 0.8;
    });

    restart_button.onPointerOutObservable.add(function () {
        restart_button.background = "grey";
        restart_button.alpha = 0.8;
    });

    menu_button.onPointerUpObservable.addOnce(function () {
        jump=0;
        feet_opening = 0;
        change_rabbit = false;
        num_carrots = 5;
        carrots_taken = 0;
        rabbit_carrots_taken = 0;
        bool_win = 0;

        take_carrot1 = 0;
        take_carrot2 = 0;
        take_carrot3 = 0;
        take_carrot4 = 0;
        take_carrot5 = 0;
        take_carrot6 = 0;
        take_carrot7 = 0;
        take_carrot8 = 0;
        take_carrot9 = 0;

        carrot_motion = 0;
        carrot_change = false;

         boolimageday = true;
         boolimagenight = true;


        
        menu = menuScene(); 
        change_scene = 0;  
        from_final = 1; 
    });

    menu_button.onPointerMoveObservable.add(function(){
        menu_button.background = "orange";
        menu_button.alpha = 0.8;
    });

    menu_button.onPointerOutObservable.add(function () {
        menu_button.background = "grey";
        menu_button.alpha = 0.8;
    });

    return scene;
}

var LOADING_Scene = function(){
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0,0,0); 

    var camera = new BABYLON.ArcRotateCamera("camera1", -Math.PI/4, Math.PI/4, 3, new BABYLON.Vector3(0, 0, 0), scene);
    camera.lowerRadiusLimit = camera.upperRadiusLimit = camera.radius = 3;
    camera.lowerAlphaLimit = camera.upperAlphaLimit = camera.alpha = null;
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);

    // light
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 0, 0), scene);
    light.intensity = 1;
    light.groundColor = new BABYLON.Color3(1,1,1);
    light.specular = BABYLON.Color3.Black();
    light.parent=camera;


    var loadGui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    var Loading = new BABYLON.GUI.TextBlock("Loading","Loading... "); 
    Loading.paddingLeft = "-32px";
    LoadingpaddingRight = "32px";
    Loading.paddingTop = "5px";
    Loading.paddingBottom = "-5px";
    Loading.color = "white";
    Loading.fontFamily = "My Font";
    Loading.fontSize = "74px";
    Loading.resizeToFit = true;
    Loading.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;

    loadGui.addControl(Loading);

    return scene;
}

load = LOADING_Scene();
menu = menuScene();

//var win2 = finalScene();


// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
    //win2.render();

    
   if (change_scene == 0){
        if (menu.getWaitingItemsCount() == 0 && load.getWaitingItemsCount() == 0){
            engine.hideLoadingUI();
            menu.render();

            if(from_final == 1){
                final_scene.dispose();
                from_final = 0;
            }
            if(from_instruction == 1){
                instruction_scene.dispose();
                from_instruction = 0;
            }
        } else{
            engine.displayLoadingUI();
        }
   }
   else if (change_scene == 1) {
        if(game.getWaitingItemsCount() == 0) {
            engine.hideLoadingUI();
            load.dispose();
            game.render();

            if (from_menu == 1){
                menu.dispose();
                from_menu = 0;
            }
            if (from_final == 1){
                final_scene.dispose();
                from_final = 0;
            }
        } else{
            load = LOADING_Scene();
            load.render();
            engine.displayLoadingUI();
        }
   }
   else if (change_scene == 2){
       if(final_scene.getWaitingItemsCount() == 0){
           engine.hideLoadingUI();
           final_scene.render();
           game.dispose();
       } else {
           engine.displayLoadingUI();
       }
   }
   else if (change_scene == 3){
    if(instruction_scene.getWaitingItemsCount() == 0){
        engine.hideLoadingUI();
        instruction_scene.render();
        menu.dispose();
    } else {
        engine.displayLoadingUI();
    } 
}
   
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
        engine.resize();
});

