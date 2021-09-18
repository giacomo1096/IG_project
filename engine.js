if (BABYLON.Engine.isSupported()) {
    var canvas = document.getElementById("gl-canvas"); // Get the canvas element
    var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
}

var sceneToRender = null;
var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };

//Scenes
var game;
var menu;
var win;
var instruction_scene;


//Variables for the menu scene
var boolimageday = true;  // false--> selezionato giorno
var boolimagenight = true;
var difficulty = 0; //default easy

var bool_win = 0;
var changescene = 0;
var from_menu = 0;
var from_win = 0;
var from_instruction = 0;

var jump=0;
var walkStepsCounter = 0;
var change = false;
var change_roar = false;
var RoarCounter = 0;
var roar_anim = 0;
var walkBackStepsCounter = 0;
var change_back = false;
var feet_opening = 0;
var change_rabbit = false;

var call_main = 0;
var counterId;


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

//GAME SCENE
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

    // musica TODO
     carrot_sound = new BABYLON.Sound("Carrot_sound", "sounds/carrot_sound.wav", scene, null, {volume: 0.4});
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

        }
        else{
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
	var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
	var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    if(!boolimageday){
	    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/day/country", scene); //day mode
    }else{
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/night/country", scene); //night mode
    }
	skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.disableLighting = true;
    skyboxMaterial.backFaceCulling = false;
	skybox.material = skyboxMaterial;	

    //Camera
	var camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 3.5, Math.PI / 2.5, 35, new BABYLON.Vector3(0, 0, 60), scene);
    camera.lowerBetaLimit = Math.PI / 8;
    camera.upperBetaLimit = Math.PI / 2.15;
    camera.lowerRadiusLimit = 10;
    camera.upperRadiusLimit = 260;
    camera.wheelDeltaPercentage = 0.003;

    scene.activeCamera = camera;
    scene.activeCamera.attachControl(canvas, true);

    //Lights
	var dirLight =  new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(10, -200, 0), scene);
    dirLight.excludedMeshes.push(skybox);
    dirLight.diffuse = new BABYLON.Color3(1, 1, 1);
    dirLight.specular = new BABYLON.Color3(1, 1, 1);
    
    
    var hemiLight = new BABYLON.HemisphericLight("HemisphericLight", new BABYLON.Vector3(0, 0, 1), scene);

    if(!boolimageday){
        dirLight.intensity = 0.9;
        hemiLight.intensity = 1.0;
    }else{
        dirLight.intensity = 0.3;
        hemiLight.intensity = 0.2;
    }

    //Shadow
    var shadowGenerator = new BABYLON.ShadowGenerator(1000, dirLight);
    shadowGenerator.useExponenetialShadowMap = true;

    //Grounds
    var ground = BABYLON.MeshBuilder.CreateGround("Ground", {width: 1000, height: 1000, subdivisions: 4}, scene);
    var ground_material = new BABYLON.StandardMaterial("GroundMat", scene);

    ground_material.diffuseTexture = new BABYLON.Texture("textures/ground.jpg", scene);
    ground_material.specularTexture = new BABYLON.Texture("textures/ground.jpg", scene);

    ground.material = ground_material;
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);
    ground.checkCollisions = true;
    ground.receiveShadows = true;

    //ROCK
    var rockTask;
    scene.blockfreeActiveMeshesAndRenderingGroups = true;

    var rockMaterial = new BABYLON.StandardMaterial("rock_mat", scene);
    rockMaterial.diffuseTexture = new BABYLON.Texture("meshes/roccia.jpg", scene);
    rockMaterial.specularTexture = new BABYLON.Texture("meshes/roccia.jpg", scene);

    BABYLON.SceneLoader.ImportMesh("", "meshes/", "rock.obj", scene, function (meshes) {
        // Only one mesh here
        rockTask = meshes[0];

        rockTask.freezeWorldMatrix();

        rockTask.position.x = -360;
        rockTask.position.z = 460;

        rockTask.scaling.scaleInPlace(7);
        
        rockTask.material=rockMaterial;

        rockTask.showBoundingBox = true;

        rockTask.physicsImpostor = new BABYLON.PhysicsImpostor(rockTask, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        rockTask.physicsImpostor.physicsBody.inertia.setZero();
        rockTask.physicsImpostor.physicsBody.invInertia.setZero();
        rockTask.physicsImpostor.physicsBody.invInertiaWorld.setZero();

        shadowGenerator.addShadowCaster(rockTask);
        
    });

    BABYLON.SceneLoader.ImportMesh("", "meshes/", "rock.obj", scene, function (meshes) {
        // Only one mesh here
        rockTask = meshes[0];

        rockTask.freezeWorldMatrix();

        rockTask.position.x = -300;
        rockTask.position.z = 440;

        rockTask.scaling.scaleInPlace(4.5);
        
        rockTask.material=rockMaterial;

        rockTask.showBoundingBox = true;

        rockTask.physicsImpostor = new BABYLON.PhysicsImpostor(rockTask, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        rockTask.physicsImpostor.physicsBody.inertia.setZero();
        rockTask.physicsImpostor.physicsBody.invInertia.setZero();
        rockTask.physicsImpostor.physicsBody.invInertiaWorld.setZero();

        shadowGenerator.addShadowCaster(rockTask);
        
    });

    BABYLON.SceneLoader.ImportMesh("", "meshes/", "rock.obj", scene, function (meshes) {
        // Only one mesh here
        rockTask = meshes[0];

        rockTask.freezeWorldMatrix();

        rockTask.position.x = -450;
        rockTask.position.z = 410;

        rockTask.scaling.scaleInPlace(7);

        rockTask.material=rockMaterial;

        rockTask.showBoundingBox = true;

        rockTask.physicsImpostor = new BABYLON.PhysicsImpostor(rockTask, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        rockTask.physicsImpostor.physicsBody.inertia.setZero();
        rockTask.physicsImpostor.physicsBody.invInertia.setZero();
        rockTask.physicsImpostor.physicsBody.invInertiaWorld.setZero();

        shadowGenerator.addShadowCaster(rockTask);
        
    });

    BABYLON.SceneLoader.ImportMesh("", "meshes/", "rock.obj", scene, function (meshes) {
        // Only one mesh here
        rockTask = meshes[0];

        rockTask.freezeWorldMatrix();

        rockTask.position.x = -370;
        rockTask.position.z = 400;

        rockTask.scaling.scaleInPlace(4);

        rockTask.material=rockMaterial;

        rockTask.showBoundingBox = true;

        rockTask.physicsImpostor = new BABYLON.PhysicsImpostor(rockTask, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        rockTask.physicsImpostor.physicsBody.inertia.setZero();
        rockTask.physicsImpostor.physicsBody.invInertia.setZero();
        rockTask.physicsImpostor.physicsBody.invInertiaWorld.setZero();

        shadowGenerator.addShadowCaster(rockTask);
        
    });

    BABYLON.SceneLoader.ImportMesh("", "meshes/", "rock.obj", scene, function (meshes) {
        // Only one mesh here
        rockTask = meshes[0];

        rockTask.freezeWorldMatrix();

        rockTask.position.x = -330;
        rockTask.position.z = 420;

        rockTask.scaling.scaleInPlace(2.5);

        rockTask.material=rockMaterial;

        rockTask.showBoundingBox = true;

        rockTask.physicsImpostor = new BABYLON.PhysicsImpostor(rockTask, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        rockTask.physicsImpostor.physicsBody.inertia.setZero();
        rockTask.physicsImpostor.physicsBody.invInertia.setZero();
        rockTask.physicsImpostor.physicsBody.invInertiaWorld.setZero();

        shadowGenerator.addShadowCaster(rockTask);
        
    });

    BABYLON.SceneLoader.ImportMesh("", "meshes/", "rock.obj", scene, function (meshes) {
        // Only one mesh here
        rockTask = meshes[0];

        rockTask.freezeWorldMatrix();

        rockTask.position.x = -165;
        rockTask.position.z = 360;

        rockTask.scaling.scaleInPlace(6);

        rockTask.material=rockMaterial;

        rockTask.showBoundingBox = true;

        rockTask.physicsImpostor = new BABYLON.PhysicsImpostor(rockTask, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        rockTask.physicsImpostor.physicsBody.inertia.setZero();
        rockTask.physicsImpostor.physicsBody.invInertia.setZero();
        rockTask.physicsImpostor.physicsBody.invInertiaWorld.setZero();

        shadowGenerator.addShadowCaster(rockTask);
        
    });

    BABYLON.SceneLoader.ImportMesh("", "meshes/", "rock.obj", scene, function (meshes) {
        // Only one mesh here
        rockTask = meshes[0];

        rockTask.freezeWorldMatrix();

        rockTask.position.x = -370;
        rockTask.position.z = 180;

        rockTask.scaling.scaleInPlace(3);
        
        rockTask.material=rockMaterial;

        rockTask.showBoundingBox = true;

        rockTask.physicsImpostor = new BABYLON.PhysicsImpostor(rockTask, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        rockTask.physicsImpostor.physicsBody.inertia.setZero();
        rockTask.physicsImpostor.physicsBody.invInertia.setZero();
        rockTask.physicsImpostor.physicsBody.invInertiaWorld.setZero();

        shadowGenerator.addShadowCaster(rockTask);
        
    });

    BABYLON.SceneLoader.ImportMesh("", "meshes/", "rock.obj", scene, function (meshes) {
        // Only one mesh here
        rockTask = meshes[0];

        rockTask.freezeWorldMatrix();

        rockTask.position.x = 450;
        rockTask.position.z = 450;

        rockTask.scaling.scaleInPlace(7);
        
        rockTask.material=rockMaterial;

        rockTask.showBoundingBox = true;

        rockTask.physicsImpostor = new BABYLON.PhysicsImpostor(rockTask, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        rockTask.physicsImpostor.physicsBody.inertia.setZero();
        rockTask.physicsImpostor.physicsBody.invInertia.setZero();
        rockTask.physicsImpostor.physicsBody.invInertiaWorld.setZero();

        shadowGenerator.addShadowCaster(rockTask);
        
    });

    BABYLON.SceneLoader.ImportMesh("", "meshes/", "rock.obj", scene, function (meshes) {
        // Only one mesh here
        rockTask = meshes[0];

        rockTask.freezeWorldMatrix();

        rockTask.position.x = 100;
        rockTask.position.z = -380;

        rockTask.scaling.scaleInPlace(3);
        
        rockTask.material=rockMaterial;

        rockTask.showBoundingBox = true;

        rockTask.physicsImpostor = new BABYLON.PhysicsImpostor(rockTask, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        rockTask.physicsImpostor.physicsBody.inertia.setZero();
        rockTask.physicsImpostor.physicsBody.invInertia.setZero();
        rockTask.physicsImpostor.physicsBody.invInertiaWorld.setZero();

        shadowGenerator.addShadowCaster(rockTask);
        
    });

    BABYLON.SceneLoader.ImportMesh("", "meshes/", "rock.obj", scene, function (meshes) {
        // Only one mesh here
        rockTask = meshes[0];

        rockTask.freezeWorldMatrix();

        rockTask.position.x = 130;
        rockTask.position.z = -180;

        rockTask.scaling.scaleInPlace(1.2);

        rockTask.material=rockMaterial;

        rockTask.showBoundingBox = true;

        rockTask.physicsImpostor = new BABYLON.PhysicsImpostor(rockTask, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 500, restitution: 0});
        rockTask.physicsImpostor.physicsBody.inertia.setZero();
        rockTask.physicsImpostor.physicsBody.invInertia.setZero();
        rockTask.physicsImpostor.physicsBody.invInertiaWorld.setZero();

        shadowGenerator.addShadowCaster(rockTask);
        
    });

    BABYLON.SceneLoader.ImportMesh("", "meshes/", "rock.obj", scene, function (meshes) {
        // Only one mesh here
        rockTask = meshes[0];

        rockTask.freezeWorldMatrix();

        rockTask.position.x = 115;
        rockTask.position.z = -170;

        rockTask.scaling.scaleInPlace(0.4);

        rockTask.material=rockMaterial;

        rockTask.showBoundingBox = true;

        rockTask.physicsImpostor = new BABYLON.PhysicsImpostor(rockTask, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 20, restitution: 0});
        rockTask.physicsImpostor.physicsBody.inertia.setZero();
        rockTask.physicsImpostor.physicsBody.invInertia.setZero();
        rockTask.physicsImpostor.physicsBody.invInertiaWorld.setZero();

        shadowGenerator.addShadowCaster(rockTask);
        
    });

    BABYLON.SceneLoader.ImportMesh("", "meshes/", "rock.obj", scene, function (meshes) {
        // Only one mesh here
        rockTask = meshes[0];

        rockTask.freezeWorldMatrix();

        rockTask.position.x = 125;
        rockTask.position.z = -150;

        rockTask.scaling.scaleInPlace(0.5);

        rockTask.material=rockMaterial;

        rockTask.showBoundingBox = true;

        rockTask.physicsImpostor = new BABYLON.PhysicsImpostor(rockTask, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 20, restitution: 0});
        rockTask.physicsImpostor.physicsBody.inertia.setZero();
        rockTask.physicsImpostor.physicsBody.invInertia.setZero();
        rockTask.physicsImpostor.physicsBody.invInertiaWorld.setZero();

        shadowGenerator.addShadowCaster(rockTask);
        
    });
    

    //FLOWERS
    BABYLON.SceneLoader.ImportMesh("", "models/", "flowers.obj", scene, function (newMeshes) {
        //console.log("Tulips");
        //console.log(newMeshes);
        for (var i = 0; i<12; i ++){
            newMeshes[i].scaling.scaleInPlace(15);
            newMeshes[i].position.x = -70;
            newMeshes[i].position.z = 380;
            newMeshes[i].freezeWorldMatrix();

        }
    });

    /*
    //FLOWERS
    BABYLON.SceneLoader.ImportMesh("", "models/", "flowers.obj", scene, function (newMeshes) {
        //console.log("Tulips");
        //console.log(newMeshes);
        for (var i = 0; i<12; i ++){
            newMeshes[i].scaling.scaleInPlace(10);
            newMeshes[i].position.x = -275;
            newMeshes[i].position.z = 230;
            newMeshes[i].freezeWorldMatrix();
        }
    });
    */

    /*
    //FLOWERS
    BABYLON.SceneLoader.ImportMesh("", "models/", "flowers.obj", scene, function (newMeshes) {
        //console.log("Tulips");
        //console.log(newMeshes);
        for (var i = 0; i<12; i ++){
            newMeshes[i].scaling.scaleInPlace(20);
            newMeshes[i].position.x = 105;
            newMeshes[i].position.z = 70;
            newMeshes[i].freezeWorldMatrix();
        }
    });


    //FLOWERS
    BABYLON.SceneLoader.ImportMesh("", "models/", "flowers.obj", scene, function (newMeshes) {
        //console.log("Tulips");
        //console.log(newMeshes);
        for (var i = 0; i<12; i ++){
            newMeshes[i].scaling.scaleInPlace(15);
            newMeshes[i].position.x = -100;
            newMeshes[i].position.z = 75;
            newMeshes[i].freezeWorldMatrix();
        }
    });

    //FLOWERS
    BABYLON.SceneLoader.ImportMesh("", "models/", "flowers.obj", scene, function (newMeshes) {
        //console.log("Tulips");
        //console.log(newMeshes);
        for (var i = 0; i<12; i ++){
            newMeshes[i].scaling.scaleInPlace(15);
            newMeshes[i].position.x = 50;
            newMeshes[i].position.z = 35;
            newMeshes[i].freezeWorldMatrix();
        }
    });

    //FLOWERS
    BABYLON.SceneLoader.ImportMesh("", "models/", "flowers.obj", scene, function (newMeshes) {
        //console.log("Tulips");
        //console.log(newMeshes);
        for (var i = 0; i<12; i ++){
            newMeshes[i].scaling.scaleInPlace(10);
            newMeshes[i].position.x = 70;
            newMeshes[i].position.z = 105;
            newMeshes[i].freezeWorldMatrix();
        }
    });
    */

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
    fountain.physicsImpostor = new BABYLON.PhysicsImpostor(fountain, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0 }, scene);
    shadowGenerator.addShadowCaster(fountain);

    var mat1 = new BABYLON.StandardMaterial("mat1", scene);
	mat1.diffuseTexture = new BABYLON.Texture("textures/wall1.jpeg", scene);
    mat1.specularTexture = new BABYLON.Texture("textures/wall1.jpeg", scene);
	mat1.bumpTexture = new BABYLON.Texture("textures/wall.jpeg", scene);
    fountain.material = mat1;

    // Create a particle system
    var particleSystem = new BABYLON.ParticleSystem("particles", 5000, scene);

    //Texture of each particle
    particleSystem.particleTexture = new BABYLON.Texture("textures/flare.png", scene);

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

    /*
    //tronco
    BABYLON.SceneLoader.ImportMesh("", "models/", "tronco.obj", scene, function (newMeshes) {
        // Only one mesh here
        tronco = newMeshes[0];
        tronco.position.x = 0;
        tronco.position.z = 0;
        tronco.position.y = 100;

        tronco.scaling.scaleInPlace(8);
        tronco.showBoundingBox = true;

        tronco.physicsImpostor = new BABYLON.PhysicsImpostor(tronco, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 100, restitution: 0});
		tronco.physicsImpostor.physicsBody.inertia.setZero();
		tronco.physicsImpostor.physicsBody.invInertia.setZero();
		tronco.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        tronco.freezeWorldMatrix();
        tronco.convertToUnIndexedMesh();
        tronco.setEnabled(true);
        tronco.showBoundingBox = true;
        tronco.visibility = 1;
        tronco.checkCollisions = true;

        var TroncoMaterial = new BABYLON.StandardMaterial("tronco_mat",scene);
        TroncoMaterial.diffuseTexture = new BABYLON.Texture("models/wood_tex.jpg",scene);
        TroncoMaterial.specularTexture = new BABYLON.Texture("models/wood_tex.jpg",scene);
        tronco.material = TroncoMaterial;

        shadowGenerator.addShadowCaster(tronco);

    });
    */

    //log
    var logMaterial = new BABYLON.StandardMaterial("log", scene);
    logMaterial.diffuseTexture = new BABYLON.Texture("models/Log_Material_Diffuse.png", scene);
    logMaterial.specularTexture = new BABYLON.Texture("models/Log_Material_Glossiness.png", scene);
    logMaterial.bumpTexture = new BABYLON.Texture("models/Log_Material_Normal.png", scene);

    BABYLON.SceneLoader.ImportMesh("", "models/", "wood_2.obj", scene, function (newMeshes) {

        log1 = newMeshes[1];
        log0 = newMeshes[0];
        //newMeshes[1].showBoundingBox = true;
        log1.rotation = new BABYLON.Vector3(Math.PI/2, 0, -Math.PI/6);
        log0.rotation = new BABYLON.Vector3(Math.PI/2, 0, -Math.PI/6);

        log0.position.y = 13;
        log1.position.y = 13;
        log0.position.x = 140;
        log1.position.x = 140;
        log0.position.z = 360;
        log1.position.z = 360;

        log0.material = logMaterial;
        log1.material = logMaterial;

        log0.freezeWorldMatrix();
        log1.freezeWorldMatrix();

        shadowGenerator.addShadowCaster(newMeshes[1]);
        shadowGenerator.addShadowCaster(newMeshes[0]);
    });

    BABYLON.SceneLoader.ImportMesh("", "models/", "wood_2.obj", scene, function (newMeshes) {

        log1 = newMeshes[1];
        log0 = newMeshes[0];
        //newMeshes[1].showBoundingBox = true;
        log1.rotation = new BABYLON.Vector3(-Math.PI/2, 0, -Math.PI/4);
        log0.rotation = new BABYLON.Vector3(-Math.PI/2, 0, -Math.PI/4);

        log0.scaling.scaleInPlace(0.7);
        log1.scaling.scaleInPlace(0.7);

        log0.position.y = 10;
        log1.position.y = 10;
        log0.position.x = 400;
        log1.position.x = 400;
        log0.position.z = 150;
        log1.position.z = 150;

        log0.material = logMaterial;
        log1.material = logMaterial;

        log0.freezeWorldMatrix();
        log1.freezeWorldMatrix();

        shadowGenerator.addShadowCaster(newMeshes[1]);
        shadowGenerator.addShadowCaster(newMeshes[0]);
    });

    BABYLON.SceneLoader.ImportMesh("", "models/", "wood_2.obj", scene, function (newMeshes) {

        log1 = newMeshes[1];
        log0 = newMeshes[0];
        //newMeshes[1].showBoundingBox = true;
        log1.rotation = new BABYLON.Vector3(-Math.PI/2, 0, -Math.PI/4);
        log0.rotation = new BABYLON.Vector3(-Math.PI/2, 0, -Math.PI/4);

        log0.scaling.scaleInPlace(0.7);
        log1.scaling.scaleInPlace(0.7);

        log0.position.y = 10;
        log1.position.y = 10;
        log0.position.x = 400;
        log1.position.x = 400;
        log0.position.z = 150;
        log1.position.z = 150;

        log0.material = logMaterial;
        log1.material = logMaterial;

        log0.freezeWorldMatrix();
        log1.freezeWorldMatrix();

        shadowGenerator.addShadowCaster(newMeshes[1]);
        shadowGenerator.addShadowCaster(newMeshes[0]);
    });

    BABYLON.SceneLoader.ImportMesh("", "models/", "wood_2.obj", scene, function (newMeshes) {

        log1 = newMeshes[1];
        log0 = newMeshes[0];
        //newMeshes[1].showBoundingBox = true;
        log1.rotation = new BABYLON.Vector3(-Math.PI/2, 0, Math.PI/4);
        log0.rotation = new BABYLON.Vector3(-Math.PI/2, 0, Math.PI/4);

        log0.scaling.scaleInPlace(0.6);
        log1.scaling.scaleInPlace(0.6);

        log0.position.y = 8;
        log1.position.y = 8;
        log0.position.x = -260;
        log1.position.x = -260;
        log0.position.z = -180;
        log1.position.z = -180;

        log0.material = logMaterial;
        log1.material = logMaterial;

        log0.freezeWorldMatrix();
        log1.freezeWorldMatrix();

        shadowGenerator.addShadowCaster(newMeshes[1]);
        shadowGenerator.addShadowCaster(newMeshes[0]);
    });

    BABYLON.SceneLoader.ImportMesh("", "models/", "wood_2.obj", scene, function (newMeshes) {

        log1 = newMeshes[1];
        log0 = newMeshes[0];
        //newMeshes[1].showBoundingBox = true;
        log1.rotation = new BABYLON.Vector3(-Math.PI/2, 0, -Math.PI/3);
        log0.rotation = new BABYLON.Vector3(-Math.PI/2, 0, -Math.PI/3);

        log0.scaling.scaleInPlace(0.9);
        log1.scaling.scaleInPlace(0.9);

        log0.position.y = 13;
        log1.position.y = 13;
        log0.position.x = -430;
        log1.position.x = -430;
        log0.position.z = -420;
        log1.position.z = -420;

        log0.material = logMaterial;
        log1.material = logMaterial;

        log0.freezeWorldMatrix();
        log1.freezeWorldMatrix();

        shadowGenerator.addShadowCaster(newMeshes[1]);
        shadowGenerator.addShadowCaster(newMeshes[0]);
    });

    BABYLON.SceneLoader.ImportMesh("", "models/", "wood_2.obj", scene, function (newMeshes) {

        log1 = newMeshes[1];
        log0 = newMeshes[0];
        //newMeshes[1].showBoundingBox = true;
        log1.rotation = new BABYLON.Vector3(-Math.PI/2, 0, 0);
        log0.rotation = new BABYLON.Vector3(-Math.PI/2, 0, 0);

        log0.scaling.scaleInPlace(1.1);
        log1.scaling.scaleInPlace(1.1);

        log0.position.y = 16;
        log1.position.y = 16;
        log0.position.x = -430;
        log1.position.x = -430;
        log0.position.z = -200;
        log1.position.z = -200;

        log0.material = logMaterial;
        log1.material = logMaterial;

        log0.freezeWorldMatrix();
        log1.freezeWorldMatrix();

        shadowGenerator.addShadowCaster(newMeshes[1]);
        shadowGenerator.addShadowCaster(newMeshes[0]);
    });

    BABYLON.SceneLoader.ImportMesh("", "models/", "wood_2.obj", scene, function (meshes) {

        log1 = meshes[1];
        log0 = meshes[0];
        //newMeshes[1].showBoundingBox = true;
        log1.rotation = new BABYLON.Vector3(0, 0, 0);
        log0.rotation = new BABYLON.Vector3(0, 0, 0);

        log0.scaling.scaleInPlace(0.2);
        log1.scaling.scaleInPlace(0.2);

        log0.position.y = 0;
        log1.position.y = 0;
        log0.position.x = -300;
        log1.position.x = -300;
        log0.position.z = 90;
        log1.position.z = 90;

        log0.material = logMaterial;
        log1.material = logMaterial;

        shadowGenerator.addShadowCaster(meshes[1]);
        shadowGenerator.addShadowCaster(meshes[0]);        
    });

    BABYLON.SceneLoader.ImportMesh("", "models/", "wood_2.obj", scene, function (meshes) {

        log1 = meshes[1];
        log0 = meshes[0];
        //newMeshes[1].showBoundingBox = true;
        log1.rotation = new BABYLON.Vector3(-Math.PI/2, 0, -Math.PI/4);
        log0.rotation = new BABYLON.Vector3(-Math.PI/2, 0, -Math.PI/4);

        log0.scaling.scaleInPlace(0.2);
        log1.scaling.scaleInPlace(0.2);

        log0.position.y = 3;
        log1.position.y = 3;
        log0.position.x = -300;
        log1.position.x = -300;
        log0.position.z = 80;
        log1.position.z = 80;

        log0.material = logMaterial;
        log1.material = logMaterial;

        shadowGenerator.addShadowCaster(meshes[1]);
        shadowGenerator.addShadowCaster(meshes[0]);        
    });

    //dentro wall
    BABYLON.SceneLoader.ImportMesh("", "models/", "wood_2.obj", scene, function (meshes) {

        log1 = meshes[1];
        log0 = meshes[0];
        //newMeshes[1].showBoundingBox = true;
        log1.rotation = new BABYLON.Vector3(0, 0, 0);
        log0.rotation = new BABYLON.Vector3(0, 0, 0);

        log0.scaling.scaleInPlace(0.2);
        log1.scaling.scaleInPlace(0.2);

        log0.position.y = 0;
        log1.position.y = 0;
        log0.position.x = -40;
        log1.position.x = -40;
        log0.position.z = -110;
        log1.position.z = -110;


        log0.material = logMaterial;
        log1.material = logMaterial;

        shadowGenerator.addShadowCaster(meshes[1]);
        shadowGenerator.addShadowCaster(meshes[0]);

        meshes[1].physicsImpostor = new BABYLON.PhysicsImpostor(meshes[1], BABYLON.PhysicsImpostor.BoxImpostor, {mass: 80, restitution: 0});
        meshes[1].physicsImpostor.physicsBody.inertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertiaWorld.setZero();
        meshes[1].freezeWorldMatrix();
        //meshes[1].convertToUnIndexedMesh();
        meshes[1].setEnabled(true);
        meshes[1].showBoundingBox = true;
        meshes[1].visibility = 1;
        meshes[1].checkCollisions = true;

        meshes[0].physicsImpostor = new BABYLON.PhysicsImpostor(meshes[0], BABYLON.PhysicsImpostor.BoxImpostor, {mass: 80, restitution: 0});
        meshes[0].physicsImpostor.physicsBody.inertia.setZero();
        meshes[0].physicsImpostor.physicsBody.invInertia.setZero();
        meshes[0].physicsImpostor.physicsBody.invInertiaWorld.setZero();
        meshes[0].freezeWorldMatrix();
        //meshes[0].convertToUnIndexedMesh();
        meshes[0].setEnabled(true);
        meshes[0].showBoundingBox = true;
        meshes[0].visibility = 1;
        meshes[0].checkCollisions = true;     
    });

    //recinto fontana
    BABYLON.SceneLoader.ImportMesh("", "models/", "wood_2.obj", scene, function (meshes) {

        log1 = meshes[1];
        log0 = meshes[0];
        //newMeshes[1].showBoundingBox = true;
        log1.rotation = new BABYLON.Vector3(0, 0, 0);
        log0.rotation = new BABYLON.Vector3(0, 0, 0);

        log0.scaling.scaleInPlace(0.2);
        log1.scaling.scaleInPlace(0.2);

        log0.position.y = 0;
        log1.position.y = 0;
        log0.position.x = 290;
        log1.position.x = 290;
        log0.position.z = 30;
        log1.position.z = 30;

        log0.material = logMaterial;
        log1.material = logMaterial;

        shadowGenerator.addShadowCaster(meshes[1]);
        shadowGenerator.addShadowCaster(meshes[0]);

        meshes[1].physicsImpostor = new BABYLON.PhysicsImpostor(meshes[1], BABYLON.PhysicsImpostor.BoxImpostor, {mass: 80, restitution: 0});
        meshes[1].physicsImpostor.physicsBody.inertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertiaWorld.setZero();
        meshes[1].freezeWorldMatrix();
        //meshes[1].convertToUnIndexedMesh();
        meshes[1].setEnabled(true);
        meshes[1].showBoundingBox = true;
        meshes[1].visibility = 1;
        meshes[1].checkCollisions = true;

        meshes[0].physicsImpostor = new BABYLON.PhysicsImpostor(meshes[0], BABYLON.PhysicsImpostor.BoxImpostor, {mass: 80, restitution: 0});
        meshes[0].physicsImpostor.physicsBody.inertia.setZero();
        meshes[0].physicsImpostor.physicsBody.invInertia.setZero();
        meshes[0].physicsImpostor.physicsBody.invInertiaWorld.setZero();
        meshes[0].freezeWorldMatrix();
        //meshes[0].convertToUnIndexedMesh();
        meshes[0].setEnabled(true);
        meshes[0].showBoundingBox = true;
        meshes[0].visibility = 1;
        meshes[0].checkCollisions = true;
        
    });

    BABYLON.SceneLoader.ImportMesh("", "models/", "wood_2.obj", scene, function (meshes) {

        log1 = meshes[1];
        log0 = meshes[0];
        //newMeshes[1].showBoundingBox = true;
        log1.rotation = new BABYLON.Vector3(0, 0, 0);
        log0.rotation = new BABYLON.Vector3(0, 0, 0);

        log0.scaling.scaleInPlace(0.2);
        log1.scaling.scaleInPlace(0.2);

        log0.position.y = 0;
        log1.position.y = 0;
        log0.position.x = 285;
        log1.position.x = 285;
        log0.position.z = 20;
        log1.position.z = 20;

        log0.material = logMaterial;
        log1.material = logMaterial;

        shadowGenerator.addShadowCaster(meshes[1]);
        shadowGenerator.addShadowCaster(meshes[0]);

        meshes[1].physicsImpostor = new BABYLON.PhysicsImpostor(meshes[1], BABYLON.PhysicsImpostor.BoxImpostor, {mass: 80, restitution: 0});
        meshes[1].physicsImpostor.physicsBody.inertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertiaWorld.setZero();
        meshes[1].freezeWorldMatrix();
        //meshes[1].convertToUnIndexedMesh();
        meshes[1].setEnabled(true);
        meshes[1].showBoundingBox = true;
        meshes[1].visibility = 1;
        meshes[1].checkCollisions = true;

        meshes[0].physicsImpostor = new BABYLON.PhysicsImpostor(meshes[0], BABYLON.PhysicsImpostor.BoxImpostor, {mass: 80, restitution: 0});
        meshes[0].physicsImpostor.physicsBody.inertia.setZero();
        meshes[0].physicsImpostor.physicsBody.invInertia.setZero();
        meshes[0].physicsImpostor.physicsBody.invInertiaWorld.setZero();
        meshes[0].freezeWorldMatrix();
        //meshes[0].convertToUnIndexedMesh();
        meshes[0].setEnabled(true);
        meshes[0].showBoundingBox = true;
        meshes[0].visibility = 1;
        meshes[0].checkCollisions = true;
    });

    BABYLON.SceneLoader.ImportMesh("", "models/", "wood_2.obj", scene, function (meshes) {

        log1 = meshes[1];
        log0 = meshes[0];
        //newMeshes[1].showBoundingBox = true;
        log1.rotation = new BABYLON.Vector3(0, 0, 0);
        log0.rotation = new BABYLON.Vector3(0, 0, 0);

        log0.scaling.scaleInPlace(0.2);
        log1.scaling.scaleInPlace(0.2);

        log0.position.y = 0;
        log1.position.y = 0;
        log0.position.x = 278;
        log1.position.x = 278;
        log0.position.z = 25;
        log1.position.z = 25;

        log0.material = logMaterial;
        log1.material = logMaterial;

        shadowGenerator.addShadowCaster(meshes[1]);
        shadowGenerator.addShadowCaster(meshes[0]);

        meshes[1].physicsImpostor = new BABYLON.PhysicsImpostor(meshes[1], BABYLON.PhysicsImpostor.BoxImpostor, {mass: 80, restitution: 0});
        meshes[1].physicsImpostor.physicsBody.inertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertiaWorld.setZero();
        meshes[1].freezeWorldMatrix();
        //meshes[1].convertToUnIndexedMesh();
        meshes[1].setEnabled(true);
        meshes[1].showBoundingBox = true;
        meshes[1].visibility = 1;
        meshes[1].checkCollisions = true;

        meshes[0].physicsImpostor = new BABYLON.PhysicsImpostor(meshes[0], BABYLON.PhysicsImpostor.BoxImpostor, {mass: 80, restitution: 0});
        meshes[0].physicsImpostor.physicsBody.inertia.setZero();
        meshes[0].physicsImpostor.physicsBody.invInertia.setZero();
        meshes[0].physicsImpostor.physicsBody.invInertiaWorld.setZero();
        meshes[0].freezeWorldMatrix();
        //meshes[0].convertToUnIndexedMesh();
        meshes[0].setEnabled(true);
        meshes[0].showBoundingBox = true;
        meshes[0].visibility = 1;
        meshes[0].checkCollisions = true;
    });

    BABYLON.SceneLoader.ImportMesh("", "models/", "wood_2.obj", scene, function (meshes) {

        log1 = meshes[1];
        log0 = meshes[0];
        //newMeshes[1].showBoundingBox = true;
        log1.rotation = new BABYLON.Vector3(0, 0, 0);
        log0.rotation = new BABYLON.Vector3(0, 0, 0);

        log0.scaling.scaleInPlace(0.2);
        log1.scaling.scaleInPlace(0.2);

        log0.position.y = 13;
        log1.position.y = 13;
        log0.position.x = 260;
        log1.position.x = 260;
        log0.position.z = 0;
        log1.position.z = 0;

        log0.material = logMaterial;
        log1.material = logMaterial;

        shadowGenerator.addShadowCaster(meshes[1]);
        shadowGenerator.addShadowCaster(meshes[0]);

        meshes[1].physicsImpostor = new BABYLON.PhysicsImpostor(meshes[1], BABYLON.PhysicsImpostor.BoxImpostor, {mass: 80, restitution: 0});
        meshes[1].physicsImpostor.physicsBody.inertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertiaWorld.setZero();
        meshes[1].freezeWorldMatrix();
        //meshes[1].convertToUnIndexedMesh();
        meshes[1].setEnabled(true);
        meshes[1].showBoundingBox = true;
        meshes[1].visibility = 1;
        meshes[1].checkCollisions = true;

        meshes[0].physicsImpostor = new BABYLON.PhysicsImpostor(meshes[0], BABYLON.PhysicsImpostor.BoxImpostor, {mass: 80, restitution: 0});
        meshes[0].physicsImpostor.physicsBody.inertia.setZero();
        meshes[0].physicsImpostor.physicsBody.invInertia.setZero();
        meshes[0].physicsImpostor.physicsBody.invInertiaWorld.setZero();
        meshes[0].freezeWorldMatrix();
        //meshes[0].convertToUnIndexedMesh();
        meshes[0].setEnabled(true);
        meshes[0].showBoundingBox = true;
        meshes[0].visibility = 1;
        meshes[0].checkCollisions = true;
    });

    //BUSH
    BABYLON.SceneLoader.ImportMesh("", "meshes/", "bush1.obj", scene, function (meshes) {
        
        //bush type
        var bush = meshes[0];
        var leaves = meshes[1];

        bush.scaling.scaleInPlace(10);
        leaves.scaling.scaleInPlace(10);
        bush.position.z = -200;
        leaves.position.z = -200; 

        //materials
        var wood_mat = new BABYLON.StandardMaterial("wood_mat", scene);
        wood_mat.diffuseTexture = new BABYLON.Texture("meshes/wood.jpeg", scene);
        wood_mat.specularTexture = new BABYLON.Texture("meshes/wood.jpeg", scene);
        bush.material =  wood_mat;

        var leaves_mat = new BABYLON.StandardMaterial("leaves_mat", scene);
        leaves_mat.diffuseColor = new BABYLON.Vector3(0,0.3,0.1);
        leaves.material = leaves_mat;

        //copy 1
        var bush1 = bush.createInstance("");
        bush1.scaling.scaleInPlace(1.7);
        bush1.position.x = -100;
        bush1.position.z = -100;
        shadowGenerator.addShadowCaster(bush1);

        var leaves1 = leaves.createInstance("");
        leaves1.scaling.scaleInPlace(1.7);
        leaves1.position.x = -100;
        leaves1.position.z = -100;
        shadowGenerator.addShadowCaster(leaves1);

        //copy 2
        var bush2 = bush.createInstance("");
        bush2.scaling.scaleInPlace(2);
        bush2.position.x = -300;
        bush2.position.z = -100;
        shadowGenerator.addShadowCaster(bush2);

        var leaves2 = leaves.createInstance("");
        leaves2.scaling.scaleInPlace(2);
        leaves2.position.x = -300;
        leaves2.position.z = -100;
        shadowGenerator.addShadowCaster(leaves2);

        //copy 3
        var bush3 = bush.createInstance("");
        bush3.scaling.scaleInPlace(1.7);
        bush3.position.x = -280;
        bush3.position.z = -280;
        shadowGenerator.addShadowCaster(bush3);

        var leaves3 = leaves.createInstance("");
        leaves3.scaling.scaleInPlace(1.7);
        leaves3.position.x = -280;
        leaves3.position.z = -280;
        shadowGenerator.addShadowCaster(leaves3);

        //copy 4
        var bush4 = bush.createInstance("");
        bush4.scaling.scaleInPlace(1.7);
        bush4.position.x = 350;
        bush4.position.z = 350;
        shadowGenerator.addShadowCaster(bush4);

        var leaves4 = leaves.createInstance("");
        leaves4.scaling.scaleInPlace(1.7);
        leaves4.position.x = 350;
        leaves4.position.z = 350;
        shadowGenerator.addShadowCaster(leaves4);

        //copy 5
        var bush5 = bush.createInstance("");
        bush5.scaling.scaleInPlace(2.1);
        bush5.position.x = 400;
        bush5.position.z = 200;
        shadowGenerator.addShadowCaster(bush5);

        var leaves5 = leaves.createInstance("");
        leaves5.scaling.scaleInPlace(2.1);
        leaves5.position.x = 400;
        leaves5.position.z = 200;
        shadowGenerator.addShadowCaster(leaves5);

        //copy 6
        var bush6 = bush.createInstance("");
        bush6.scaling.scaleInPlace(1.7);
        bush6.position.x = 350;
        bush6.position.z = -350;
        shadowGenerator.addShadowCaster(bush6);

        var leaves6 = leaves.createInstance("");
        leaves6.scaling.scaleInPlace(1.7);
        leaves6.position.x = 350;
        leaves6.position.z = -350;
        shadowGenerator.addShadowCaster(leaves6);

        //copy 7
        var bush7 = bush.createInstance("");
        bush7.scaling.scaleInPlace(2.1);
        bush7.position.x = 400;
        bush7.position.z = -200;
        shadowGenerator.addShadowCaster(bush7);

        var leaves7 = leaves.createInstance("");
        leaves7.scaling.scaleInPlace(2.1);
        leaves7.position.x = 400;
        leaves7.position.z = -200;
        shadowGenerator.addShadowCaster(leaves7);

        //copy 8
        var bush8 = bush.createInstance("");
        bush8.scaling.scaleInPlace(2.2);
        bush8.position.x = 230;
        bush8.position.z = -250;
        shadowGenerator.addShadowCaster(bush8);

        var leaves8 = leaves.createInstance("");
        leaves8.scaling.scaleInPlace(2.2);
        leaves8.position.x = 230;
        leaves8.position.z = -250;
        shadowGenerator.addShadowCaster(leaves8);

        //copy 9
        var bush9 = bush.createInstance("");
        bush9.scaling.scaleInPlace(2.2);
        bush9.position.x = -410;
        bush9.position.z = 410;
        shadowGenerator.addShadowCaster(bush9);

        var leaves9 = leaves.createInstance("");
        leaves9.scaling.scaleInPlace(2.2);
        leaves9.position.x = -410;
        leaves9.position.z = 410;
        shadowGenerator.addShadowCaster(leaves9);

        //copy 10
        var bush10 = bush.createInstance("");
        bush10.scaling.scaleInPlace(2.5);
        bush10.position.x = -430;
        bush10.position.z = 315;
        shadowGenerator.addShadowCaster(bush10);

        var leaves10 = leaves.createInstance("");
        leaves10.scaling.scaleInPlace(2.5);
        leaves10.position.x = -430;
        leaves10.position.z = 315;
        shadowGenerator.addShadowCaster(leaves10);

        //copy 11
        var bush11 = bush.createInstance("");
        bush11.scaling.scaleInPlace(2.8);
        bush11.position.x = -240;
        bush11.position.z = 480;
        shadowGenerator.addShadowCaster(bush11);

        var leaves11 = leaves.createInstance("");
        leaves11.scaling.scaleInPlace(2.8);
        leaves11.position.x = -240;
        leaves11.position.z = 480;
        shadowGenerator.addShadowCaster(leaves11);

        //copy 12
        var bush12 = bush.createInstance("");
        bush12.scaling.scaleInPlace(2.4);
        bush12.position.x = -110;
        bush12.position.z = 440;
        shadowGenerator.addShadowCaster(bush12);

        var leaves12 = leaves.createInstance("");
        leaves12.scaling.scaleInPlace(2.4);
        leaves12.position.x = -110;
        leaves12.position.z = 440;
        shadowGenerator.addShadowCaster(leaves12);

        //copy 13
        var bush13 = bush.createInstance("");
        bush13.scaling.scaleInPlace(1.8);
        bush13.position.x = 200;
        bush13.position.z = 360;
        shadowGenerator.addShadowCaster(bush13);

        var leaves13 = leaves.createInstance("");
        leaves13.scaling.scaleInPlace(1.8);
        leaves13.position.x = 200;
        leaves13.position.z = 360;
        shadowGenerator.addShadowCaster(leaves13);

        //copy 14
        var bush14 = bush.createInstance("");
        bush14.scaling.scaleInPlace(1.5);
        bush14.position.x = 450;
        bush14.position.z = 360;
        shadowGenerator.addShadowCaster(bush14);

        var leaves14 = leaves.createInstance("");
        leaves14.scaling.scaleInPlace(1.5);
        leaves14.position.x = 450;
        leaves14.position.z = 360;
        shadowGenerator.addShadowCaster(leaves14);

        //copy 15
        var bush15 = bush.createInstance("");
        bush15.scaling.scaleInPlace(1.5);
        bush15.position.x = 470;
        bush15.position.z = 400;
        shadowGenerator.addShadowCaster(bush15);

        var leaves15 = leaves.createInstance("");
        leaves15.scaling.scaleInPlace(1.5);
        leaves15.position.x = 470;
        leaves15.position.z = 400;
        shadowGenerator.addShadowCaster(leaves15);

        //copy 16
        var bush16 = bush.createInstance("");
        bush16.scaling.scaleInPlace(2.5);
        bush16.position.x = -450;
        bush16.position.z = -450;
        shadowGenerator.addShadowCaster(bush16);

        var leaves16 = leaves.createInstance("");
        leaves16.scaling.scaleInPlace(2.5);
        leaves16.position.x = -450;
        leaves16.position.z = -450;
        shadowGenerator.addShadowCaster(leaves16);
        
        //copy 17
        var bush17 = bush.createInstance("");
        bush17.scaling.scaleInPlace(2.8);
        bush17.position.x = -430;
        bush17.position.z = -80;
        shadowGenerator.addShadowCaster(bush17);

        var leaves17 = leaves.createInstance("");
        leaves17.scaling.scaleInPlace(2.8);
        leaves17.position.x = -430;
        leaves17.position.z = -80;
        shadowGenerator.addShadowCaster(leaves17);

        //copy 18
        var bush18 = bush.createInstance("");
        //bush18.scaling.scaleInPlace(0.9);
        bush18.position.x = -450;
        bush18.position.z = 100;
        shadowGenerator.addShadowCaster(bush18);

        var leaves18 = leaves.createInstance("");
        //leaves18.scaling.scaleInPlace(0.8);
        leaves18.position.x = -450;
        leaves18.position.z = 100;
        shadowGenerator.addShadowCaster(leaves18);
/*
                //copy 19
                var bush19 = bush.createInstance("");
                bush19.scaling.scaleInPlace(1.1);
                bush19.position.x = -430;
                bush19.position.z = 500;
                shadowGenerator.addShadowCaster(bush19);
        
                var leaves19 = leaves.createInstance("");
                leaves19.scaling.scaleInPlace(1.1);
                leaves19.position.x = -430;
                leaves19.position.z = 500;
                shadowGenerator.addShadowCaster(leaves19);*/

    });

    //FENCE
    var fence1, fence2, fence3, fence4, fence5, fence6, fence6, fence7, fence8, fence9, fence10;
    var fence11, fence12, fence13, fence14, fence15, fence16, fence17;
    var fence_mat = new BABYLON.StandardMaterial("fence_mat",scene);
    fence_mat.bumpTexture = new BABYLON.Texture("meshes/fence_normals.png",scene);
    fence_mat.diffuseTexture = new BABYLON.Texture("meshes/fence_occlusion.png",scene);
    fence_mat.specularTexture = new BABYLON.Texture("meshes/fence_occlusion.png",scene);

    BABYLON.SceneLoader.ImportMesh("", "meshes/", "fence_2.obj", scene, function(meshes) {
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
        shadowGenerator.addShadowCaster(meshes[1]);
        shadowGenerator.addShadowCaster(meshes[0]);

        meshes[1].physicsImpostor = new BABYLON.PhysicsImpostor(meshes[1], BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        meshes[1].physicsImpostor.physicsBody.inertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertiaWorld.setZero();
        meshes[1].freezeWorldMatrix();
        meshes[1].convertToUnIndexedMesh();
        meshes[1].setEnabled(true);
        meshes[1].showBoundingBox = true;
        meshes[1].visibility = 1;
        meshes[1].checkCollisions = true;
    });

    BABYLON.SceneLoader.ImportMesh("", "meshes/", "fence_2.obj", scene, function (meshes) {
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
        shadowGenerator.addShadowCaster(meshes[1]);
        shadowGenerator.addShadowCaster(meshes[0]);

        meshes[1].physicsImpostor = new BABYLON.PhysicsImpostor(meshes[1], BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        meshes[1].physicsImpostor.physicsBody.inertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertiaWorld.setZero();
        meshes[1].freezeWorldMatrix();
        meshes[1].convertToUnIndexedMesh();
        meshes[1].setEnabled(true);
        meshes[1].showBoundingBox = true;
        meshes[1].visibility = 1;
        meshes[1].checkCollisions = true;

    });
    
    BABYLON.SceneLoader.ImportMesh("", "meshes/", "fence_2.obj", scene, function (meshes) {
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
        shadowGenerator.addShadowCaster(meshes[1]);
        shadowGenerator.addShadowCaster(meshes[0]);

        meshes[1].physicsImpostor = new BABYLON.PhysicsImpostor(meshes[1], BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        meshes[1].physicsImpostor.physicsBody.inertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertiaWorld.setZero();
        meshes[1].freezeWorldMatrix();
        meshes[1].convertToUnIndexedMesh();
        meshes[1].setEnabled(true);
        meshes[1].showBoundingBox = true;
        meshes[1].visibility = 1;
        meshes[1].checkCollisions = true;

    });

    BABYLON.SceneLoader.ImportMesh("", "meshes/", "fence_2.obj", scene, function (meshes) {
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
        shadowGenerator.addShadowCaster(meshes[1]);
        shadowGenerator.addShadowCaster(meshes[0]);

        meshes[1].physicsImpostor = new BABYLON.PhysicsImpostor(meshes[1], BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        meshes[1].physicsImpostor.physicsBody.inertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertiaWorld.setZero();
        meshes[1].freezeWorldMatrix();
        meshes[1].convertToUnIndexedMesh();
        meshes[1].setEnabled(true);
        meshes[1].showBoundingBox = true;
        meshes[1].visibility = 1;
        meshes[1].checkCollisions = true;

    });

    //da fence5 a fence12

    BABYLON.SceneLoader.ImportMesh("", "meshes/", "fence_2.obj", scene, function (meshes) {
        fence5 = meshes[1];
        meshes[1].position.x = 55;
        meshes[0].position.x = 55;
        meshes[1].position.z = 255;
        meshes[0].position.z = 255;
        meshes[1].scaling.scaleInPlace(7);
        meshes[0].scaling.scaleInPlace(7);
        meshes[0].material= fence_mat;
        meshes[1].material= fence_mat;
        shadowGenerator.addShadowCaster(meshes[1]);
        shadowGenerator.addShadowCaster(meshes[0]);

        meshes[1].physicsImpostor = new BABYLON.PhysicsImpostor(meshes[1], BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        meshes[1].physicsImpostor.physicsBody.inertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertiaWorld.setZero();
        meshes[1].freezeWorldMatrix();
        meshes[1].convertToUnIndexedMesh();
        meshes[1].setEnabled(true);
        meshes[1].showBoundingBox = true;
        meshes[1].visibility = 1;
        meshes[1].checkCollisions = true;

    });

    BABYLON.SceneLoader.ImportMesh("", "meshes/", "fence_2.obj", scene, function (meshes) {
        fence6 = meshes[1];
        meshes[1].position.x = 55;
        meshes[0].position.x = 55;
        meshes[1].position.z = 197;
        meshes[0].position.z = 197;
        meshes[1].scaling.scaleInPlace(7);
        meshes[0].scaling.scaleInPlace(7);
        meshes[0].material= fence_mat;
        meshes[1].material= fence_mat;
        shadowGenerator.addShadowCaster(meshes[1]);
        shadowGenerator.addShadowCaster(meshes[0]);
        
        meshes[1].physicsImpostor = new BABYLON.PhysicsImpostor(meshes[1], BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        meshes[1].physicsImpostor.physicsBody.inertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertiaWorld.setZero();
        meshes[1].freezeWorldMatrix();
        meshes[1].convertToUnIndexedMesh();
        meshes[1].setEnabled(true);
        meshes[1].showBoundingBox = true;
        meshes[1].visibility = 1;
        meshes[1].checkCollisions = true;

    });

    BABYLON.SceneLoader.ImportMesh("", "meshes/", "fence_2.obj", scene, function (meshes) {
        fence7 = meshes[1];
        meshes[1].position.x = 55;
        meshes[0].position.x = 55;
        meshes[1].position.z = 139;
        meshes[0].position.z = 139;
        meshes[1].scaling.scaleInPlace(7);
        meshes[0].scaling.scaleInPlace(7);
        meshes[0].material= fence_mat;
        meshes[1].material= fence_mat;
        shadowGenerator.addShadowCaster(meshes[1]);
        shadowGenerator.addShadowCaster(meshes[0]);

        meshes[1].physicsImpostor = new BABYLON.PhysicsImpostor(meshes[1], BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        meshes[1].physicsImpostor.physicsBody.inertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertiaWorld.setZero();
        meshes[1].freezeWorldMatrix();
        meshes[1].convertToUnIndexedMesh();
        meshes[1].setEnabled(true);
        meshes[1].showBoundingBox = true;
        meshes[1].visibility = 1;
        meshes[1].checkCollisions = true;
    });

    BABYLON.SceneLoader.ImportMesh("", "meshes/", "fence_2.obj", scene, function (meshes) {
        fence8 = meshes[1];
        meshes[1].position.x = 55;
        meshes[0].position.x = 55;
        meshes[1].position.z = 80;
        meshes[0].position.z = 80;
        meshes[1].scaling.scaleInPlace(7);
        meshes[0].scaling.scaleInPlace(7);
        meshes[0].material= fence_mat;
        meshes[1].material= fence_mat;
        shadowGenerator.addShadowCaster(meshes[1]);
        shadowGenerator.addShadowCaster(meshes[0]);

        meshes[1].physicsImpostor = new BABYLON.PhysicsImpostor(meshes[1], BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        meshes[1].physicsImpostor.physicsBody.inertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertiaWorld.setZero();
        meshes[1].freezeWorldMatrix();
        meshes[1].convertToUnIndexedMesh();
        meshes[1].setEnabled(true);
        meshes[1].showBoundingBox = true;
        meshes[1].visibility = 1;
        meshes[1].checkCollisions = true;
    });

    BABYLON.SceneLoader.ImportMesh("", "meshes/", "fence_2.obj", scene, function (meshes) {
        fence9 = meshes[1];
        meshes[1].position.x = 122;
        meshes[0].position.x = 122;
        meshes[1].position.z = -15;
        meshes[0].position.z = -15;
        meshes[1].scaling.scaleInPlace(7);
        meshes[0].scaling.scaleInPlace(7);
        meshes[0].rotation = new BABYLON.Vector3(0, 1.6, 0);
        meshes[1].rotation = new BABYLON.Vector3(0, 1.6, 0);
        meshes[0].material= fence_mat;
        meshes[1].material= fence_mat;
        shadowGenerator.addShadowCaster(meshes[1]);
        shadowGenerator.addShadowCaster(meshes[0]);

        meshes[1].physicsImpostor = new BABYLON.PhysicsImpostor(meshes[1], BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        meshes[1].physicsImpostor.physicsBody.inertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertiaWorld.setZero();
        meshes[1].freezeWorldMatrix();
        meshes[1].convertToUnIndexedMesh();
        meshes[1].setEnabled(true);
        meshes[1].showBoundingBox = true;
        meshes[1].visibility = 1;
        meshes[1].checkCollisions = true;
    });

    BABYLON.SceneLoader.ImportMesh("", "meshes/", "fence_2.obj", scene, function (meshes) {
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
        shadowGenerator.addShadowCaster(meshes[1]);
        shadowGenerator.addShadowCaster(meshes[0]);

        meshes[1].physicsImpostor = new BABYLON.PhysicsImpostor(meshes[1], BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        meshes[1].physicsImpostor.physicsBody.inertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertiaWorld.setZero();
        meshes[1].freezeWorldMatrix();
        meshes[1].convertToUnIndexedMesh();
        meshes[1].setEnabled(true);
        meshes[1].showBoundingBox = true;
        meshes[1].visibility = 1;
        meshes[1].checkCollisions = true;
    });

    BABYLON.SceneLoader.ImportMesh("", "meshes/", "fence_2.obj", scene, function (meshes) {
        fence11 = meshes[1];
        meshes[1].position.x = 235;
        meshes[0].position.x = 235;
        meshes[1].position.z = -15;
        meshes[0].position.z = -15;
        meshes[1].scaling.scaleInPlace(7);
        meshes[0].scaling.scaleInPlace(7);
        meshes[0].rotation = new BABYLON.Vector3(0, 1.6, 0);
        meshes[1].rotation = new BABYLON.Vector3(0, 1.6, 0);
        meshes[0].material= fence_mat;
        meshes[1].material= fence_mat;
        shadowGenerator.addShadowCaster(meshes[1]);
        shadowGenerator.addShadowCaster(meshes[0]);

        meshes[1].physicsImpostor = new BABYLON.PhysicsImpostor(meshes[1], BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        meshes[1].physicsImpostor.physicsBody.inertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertiaWorld.setZero();
        meshes[1].freezeWorldMatrix();
        meshes[1].convertToUnIndexedMesh();
        meshes[1].setEnabled(true);
        meshes[1].showBoundingBox = true;
        meshes[1].visibility = 1;
        meshes[1].checkCollisions = true;
    });

    BABYLON.SceneLoader.ImportMesh("", "meshes/", "fence_2.obj", scene, function (meshes) {
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
        shadowGenerator.addShadowCaster(meshes[1]);
        shadowGenerator.addShadowCaster(meshes[0]);

        meshes[1].physicsImpostor = new BABYLON.PhysicsImpostor(meshes[1], BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        meshes[1].physicsImpostor.physicsBody.inertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertiaWorld.setZero();
        meshes[1].freezeWorldMatrix();
        meshes[1].convertToUnIndexedMesh();
        meshes[1].setEnabled(true);
        meshes[1].showBoundingBox = true;
        meshes[1].visibility = 1;
        meshes[1].checkCollisions = true;
    });

    
    
    BABYLON.SceneLoader.ImportMesh("", "meshes/", "fence_2.obj", scene, function (meshes) {
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
        shadowGenerator.addShadowCaster(meshes[1]);
        shadowGenerator.addShadowCaster(meshes[0]);

        meshes[1].physicsImpostor = new BABYLON.PhysicsImpostor(meshes[1], BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        meshes[1].physicsImpostor.physicsBody.inertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertiaWorld.setZero();
        meshes[1].freezeWorldMatrix();
        meshes[1].convertToUnIndexedMesh();
        meshes[1].setEnabled(true);
        meshes[1].showBoundingBox = true;
        meshes[1].visibility = 1;
        meshes[1].checkCollisions = true;

    });

    BABYLON.SceneLoader.ImportMesh("", "meshes/", "fence_2.obj", scene, function (meshes) {
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
        shadowGenerator.addShadowCaster(meshes[1]);
        shadowGenerator.addShadowCaster(meshes[0]);
        
        meshes[1].physicsImpostor = new BABYLON.PhysicsImpostor(meshes[1], BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        meshes[1].physicsImpostor.physicsBody.inertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertiaWorld.setZero();
        meshes[1].freezeWorldMatrix();
        meshes[1].convertToUnIndexedMesh();
        meshes[1].setEnabled(true);
        meshes[1].showBoundingBox = true;
        meshes[1].visibility = 1;
        meshes[1].checkCollisions = true;

    });

    BABYLON.SceneLoader.ImportMesh("", "meshes/", "fence_2.obj", scene, function (meshes) {
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
        shadowGenerator.addShadowCaster(meshes[1]);
        shadowGenerator.addShadowCaster(meshes[0]);

        meshes[1].physicsImpostor = new BABYLON.PhysicsImpostor(meshes[1], BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        meshes[1].physicsImpostor.physicsBody.inertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertiaWorld.setZero();
        meshes[1].freezeWorldMatrix();
        meshes[1].convertToUnIndexedMesh();
        meshes[1].setEnabled(true);
        meshes[1].showBoundingBox = true;
        meshes[1].visibility = 1;
        meshes[1].checkCollisions = true;

    });

    BABYLON.SceneLoader.ImportMesh("", "meshes/", "fence_2.obj", scene, function (meshes) {
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
        shadowGenerator.addShadowCaster(meshes[1]);
        shadowGenerator.addShadowCaster(meshes[0]);

        meshes[1].physicsImpostor = new BABYLON.PhysicsImpostor(meshes[1], BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        meshes[1].physicsImpostor.physicsBody.inertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertiaWorld.setZero();
        meshes[1].freezeWorldMatrix();
        meshes[1].convertToUnIndexedMesh();
        meshes[1].setEnabled(true);
        meshes[1].showBoundingBox = true;
        meshes[1].visibility = 1;
        meshes[1].checkCollisions = true;

    });

    BABYLON.SceneLoader.ImportMesh("", "meshes/", "fence_2.obj", scene, function (meshes) {
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
        shadowGenerator.addShadowCaster(meshes[1]);
        shadowGenerator.addShadowCaster(meshes[0]);

        meshes[1].physicsImpostor = new BABYLON.PhysicsImpostor(meshes[1], BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, restitution: 0});
        meshes[1].physicsImpostor.physicsBody.inertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertia.setZero();
        meshes[1].physicsImpostor.physicsBody.invInertiaWorld.setZero();
        meshes[1].freezeWorldMatrix();
        meshes[1].convertToUnIndexedMesh();
        meshes[1].setEnabled(true);
        meshes[1].showBoundingBox = true;
        meshes[1].visibility = 1;
        meshes[1].checkCollisions = true;

    });

    //Perimeter
    var perimeter = [];

    var perimeter_mat = new BABYLON.StandardMaterial("perimeter_mat",scene);
    perimeter_mat.alpha = 0;

	var wall = BABYLON.Mesh.CreateBox("wall", 2, scene);

		hemiLight.excludedMeshes.push(wall);
		dirLight.excludedMeshes.push(wall);
		wall.setEnabled(false);

    var wall1 = wall.clone();
        wall1.position = new BABYLON.Vector3(200, 100, 300);
        wall1.scaling = new BABYLON.Vector3(100, 50, 10);
        hemiLight.excludedMeshes.push(wall1);
        dirLight.excludedMeshes.push(wall1);

        wall1.physicsImpostor = new BABYLON.PhysicsImpostor(wall1, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 10000, restitution: 0});
        wall1.physicsImpostor.physicsBody.inertia.setZero();
        wall1.physicsImpostor.physicsBody.invInertia.setZero();
        wall1.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        wall1.freezeWorldMatrix();
        wall1.convertToUnIndexedMesh();
        wall1.setEnabled(true);
        wall1.showBoundingBox = true;
        wall1.visibility = 1;
        wall1.checkCollisions = true;
        wall1.material = perimeter_mat;
        perimeter.push(wall1);

    var wall2 = wall.clone();
        wall2.position = new BABYLON.Vector3(0, 100, 300);
        wall2.scaling = new BABYLON.Vector3(100, 50, 10);
        hemiLight.excludedMeshes.push(wall2);
        dirLight.excludedMeshes.push(wall2);

        wall2.physicsImpostor = new BABYLON.PhysicsImpostor(wall2, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 10000, restitution: 0});
        wall2.physicsImpostor.physicsBody.inertia.setZero();
        wall2.physicsImpostor.physicsBody.invInertia.setZero();
        wall2.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        wall2.freezeWorldMatrix();
        wall2.convertToUnIndexedMesh();
        wall2.setEnabled(true);
        wall2.visibility = 1;
        wall2.showBoundingBox = true;
        wall2.checkCollisions = true;
        wall2.material = perimeter_mat;
        perimeter.push(wall2); 

    var wall3 = wall.clone();
        wall3.position = new BABYLON.Vector3(-200, 100, 300);
        wall3.scaling = new BABYLON.Vector3(100, 50, 10);
        hemiLight.excludedMeshes.push(wall3);
        dirLight.excludedMeshes.push(wall3);

        wall3.physicsImpostor = new BABYLON.PhysicsImpostor(wall3, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 10000, restitution: 0});
        wall3.physicsImpostor.physicsBody.inertia.setZero();
        wall3.physicsImpostor.physicsBody.invInertia.setZero();
        wall3.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        wall3.freezeWorldMatrix();
        wall3.convertToUnIndexedMesh();
        wall3.setEnabled(true);
        wall3.showBoundingBox = true;
        wall3.visibility = 1;
        wall3.checkCollisions = true;
        wall3.material = perimeter_mat;
        perimeter.push(wall3);

    var wall4 = wall.clone();
        wall4.position = new BABYLON.Vector3(320, 100, 190);
        wall4.scaling = new BABYLON.Vector3(100, 50, 10);
        wall4.rotation = new BABYLON.Vector3(0, 80, 0);
        hemiLight.excludedMeshes.push(wall4);
        dirLight.excludedMeshes.push(wall4);

        wall4.physicsImpostor = new BABYLON.PhysicsImpostor(wall4, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 10000, restitution: 0});
        wall4.physicsImpostor.physicsBody.inertia.setZero();
        wall4.physicsImpostor.physicsBody.invInertia.setZero();
        wall4.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        wall4.freezeWorldMatrix();
        wall4.convertToUnIndexedMesh();
        wall4.setEnabled(true);
        wall4.showBoundingBox = true;
        wall4.visibility = 1;
        wall4.checkCollisions = true;
        wall4.material = perimeter_mat;
        perimeter.push(wall4);

    var wall5 = wall.clone();
        wall5.position = new BABYLON.Vector3(340, 100, -10);
        wall5.scaling = new BABYLON.Vector3(100, 50, 10);
        wall5.rotation = new BABYLON.Vector3(0, 80, 0);
        hemiLight.excludedMeshes.push(wall5);
        dirLight.excludedMeshes.push(wall5);

        wall5.physicsImpostor = new BABYLON.PhysicsImpostor(wall5, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 10000, restitution: 0});
        wall5.physicsImpostor.physicsBody.inertia.setZero();
        wall5.physicsImpostor.physicsBody.invInertia.setZero();
        wall5.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        wall5.freezeWorldMatrix();
        wall5.convertToUnIndexedMesh();
        wall5.setEnabled(true);
        wall5.showBoundingBox = true;
        wall5.visibility = 1;
        wall5.checkCollisions = true;
        wall5.material = perimeter_mat;
        perimeter.push(wall5);

    var wall6 = wall.clone();
        wall6.position = new BABYLON.Vector3(360, 100, -210);
        wall6.scaling = new BABYLON.Vector3(100, 50, 10);
        wall6.rotation = new BABYLON.Vector3(0, 80, 0);
        hemiLight.excludedMeshes.push(wall6);
        dirLight.excludedMeshes.push(wall6);

        wall6.physicsImpostor = new BABYLON.PhysicsImpostor(wall6, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 10000, restitution: 0});
        wall6.physicsImpostor.physicsBody.inertia.setZero();
        wall6.physicsImpostor.physicsBody.invInertia.setZero();
        wall6.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        wall6.freezeWorldMatrix();
        wall6.convertToUnIndexedMesh();
        wall6.setEnabled(true);
        wall6.showBoundingBox = true;
        wall6.visibility = 1;
        wall6.checkCollisions = true;
        wall6.material = perimeter_mat;
        perimeter.push(wall6);

    var wall7 = wall.clone();
        wall7.position = new BABYLON.Vector3(260, 100, -320);
        wall7.scaling = new BABYLON.Vector3(100, 50, 10);
        hemiLight.excludedMeshes.push(wall7);
        dirLight.excludedMeshes.push(wall7);

        wall7.physicsImpostor = new BABYLON.PhysicsImpostor(wall7, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 10000, restitution: 0});
        wall7.physicsImpostor.physicsBody.inertia.setZero();
        wall7.physicsImpostor.physicsBody.invInertia.setZero();
        wall7.physicsImpostor.physicsBody.invInertiaWorld.setZero(); 
        wall7.freezeWorldMatrix();
        wall7.convertToUnIndexedMesh();
        wall7.setEnabled(true);
        wall7.showBoundingBox = true;
        wall7.visibility = 1;
        wall7.checkCollisions = true;
        wall7.material = perimeter_mat;
        perimeter.push(wall7);

    var wall8 = wall.clone();
        wall8.position = new BABYLON.Vector3(60, 100, -320);
        wall8.scaling = new BABYLON.Vector3(100, 50, 10);
        hemiLight.excludedMeshes.push(wall8);
        dirLight.excludedMeshes.push(wall8);

        wall8.physicsImpostor = new BABYLON.PhysicsImpostor(wall8, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 10000, restitution: 0});
        wall8.physicsImpostor.physicsBody.inertia.setZero();
        wall8.physicsImpostor.physicsBody.invInertia.setZero();
        wall8.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        wall8.freezeWorldMatrix();
        wall8.convertToUnIndexedMesh();
        wall8.setEnabled(true);
        wall8.showBoundingBox = true;
        wall8.visibility = 1;
        wall8.checkCollisions = true;
        wall8.material = perimeter_mat;
        perimeter.push(wall8);

    var wall9 = wall.clone();
        wall9.position = new BABYLON.Vector3(-140, 100, -320);
        wall9.scaling = new BABYLON.Vector3(100, 50, 10);
        hemiLight.excludedMeshes.push(wall9);
        dirLight.excludedMeshes.push(wall9);

        wall9.physicsImpostor = new BABYLON.PhysicsImpostor(wall9, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 10000, restitution: 0});
        wall9.physicsImpostor.physicsBody.inertia.setZero();
        wall9.physicsImpostor.physicsBody.invInertia.setZero();
        wall9.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        wall9.freezeWorldMatrix();
        wall9.convertToUnIndexedMesh();
        wall9.setEnabled(true);
        wall9.showBoundingBox = true;
        wall9.visibility = 1;
        wall9.checkCollisions = true;
        wall9.material = perimeter_mat;
        perimeter.push(wall9);

    var wall10 = wall.clone();
        wall10.position = new BABYLON.Vector3(-260, 100, -210);
        wall10.scaling = new BABYLON.Vector3(100, 50, 10);
        wall10.rotation = new BABYLON.Vector3(0, 80, 0);
        hemiLight.excludedMeshes.push(wall10);
        dirLight.excludedMeshes.push(wall10);

        wall10.physicsImpostor = new BABYLON.PhysicsImpostor(wall10, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 10000, restitution: 0});
        wall10.physicsImpostor.physicsBody.inertia.setZero();
        wall10.physicsImpostor.physicsBody.invInertia.setZero();
        wall10.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        wall10.freezeWorldMatrix();
        wall10.convertToUnIndexedMesh();
        wall10.setEnabled(true);
        wall10.showBoundingBox = true;
        wall10.visibility = 1;
        wall10.checkCollisions = true;
        wall10.material = perimeter_mat;
        perimeter.push(wall10);

    var wall11 = wall.clone();
        wall11.position = new BABYLON.Vector3(-280, 100, -10);
        wall11.scaling = new BABYLON.Vector3(100, 50, 10);
        wall11.rotation = new BABYLON.Vector3(0, 80, 0);
        hemiLight.excludedMeshes.push(wall11);
        dirLight.excludedMeshes.push(wall11);

        wall11.physicsImpostor = new BABYLON.PhysicsImpostor(wall11, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 10000, restitution: 0});
        wall11.physicsImpostor.physicsBody.inertia.setZero();
        wall11.physicsImpostor.physicsBody.invInertia.setZero();
        wall11.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        wall11.freezeWorldMatrix();
        wall11.convertToUnIndexedMesh();
        wall11.setEnabled(true);
        wall11.showBoundingBox = true;
        wall11.visibility = 1;
        wall11.checkCollisions = true;
        wall11.material = perimeter_mat;
        perimeter.push(wall11);

    var wall12 = wall.clone();
        wall12.position = new BABYLON.Vector3(-300, 100, 190);
        wall12.scaling = new BABYLON.Vector3(100, 50, 10);
        wall12.rotation = new BABYLON.Vector3(0, 80, 0);
        hemiLight.excludedMeshes.push(wall12);
        dirLight.excludedMeshes.push(wall12);

        wall12.physicsImpostor = new BABYLON.PhysicsImpostor(wall12, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 10000, restitution: 0});
        wall12.physicsImpostor.physicsBody.inertia.setZero();
        wall12.physicsImpostor.physicsBody.invInertia.setZero();
        wall12.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        wall12.freezeWorldMatrix();
        wall12.convertToUnIndexedMesh();
        wall12.setEnabled(true);
        wall12.showBoundingBox = true;
        wall12.visibility = 1;
        wall12.checkCollisions = true;
        wall12.material = perimeter_mat;
        perimeter.push(wall12);

    //TREE
    var tree1 = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
        
        meshes[0].position.x = -220;
        meshes[0].position.z = 320;
        meshes[0].scaling = new BABYLON.Vector3(600, 500, 500);
        meshes[0].material.opacityTexture = null;
        meshes[0].material.backFaceCulling = false;
        shadowGenerator.addShadowCaster(meshes[0]);

    });

    var tree111 = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
        
        meshes[0].position.x = -400;
        meshes[0].position.z = 450;
        meshes[0].scaling = new BABYLON.Vector3(600, 600, 600);
        meshes[0].material.opacityTexture = null;
        meshes[0].material.backFaceCulling = false;
        shadowGenerator.addShadowCaster(meshes[0]);

    });

    var tree112 = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
        
        meshes[0].position.x = -440;
        meshes[0].position.z = 450;
        meshes[0].scaling = new BABYLON.Vector3(600, 700, 450);
        meshes[0].material.opacityTexture = null;
        meshes[0].material.backFaceCulling = false;
        shadowGenerator.addShadowCaster(meshes[0]);

    });

    var tree2 = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
        
        meshes[0].position.x = -25;
        meshes[0].position.z = 350;
        meshes[0].scaling = new BABYLON.Vector3(400, 400, 350);
        meshes[0].material.opacityTexture = null;
        meshes[0].material.backFaceCulling = false;
        shadowGenerator.addShadowCaster(meshes[0]);

    });

    var tree222 = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
        
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

    var tree66 = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
        
        meshes[0].position.x = -430;
        meshes[0].position.z = 400;
        meshes[0].scaling = new BABYLON.Vector3(500, 500, 500);
        meshes[0].material.opacityTexture = null;
        meshes[0].material.backFaceCulling = false;
        shadowGenerator.addShadowCaster(meshes[0]);

    });

    var tree15 = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
        
        meshes[0].position.x = -450;
        meshes[0].position.z = 200;
        meshes[0].scaling = new BABYLON.Vector3(800, 900, 500);
        meshes[0].material.opacityTexture = null;
        meshes[0].material.backFaceCulling = false;
        shadowGenerator.addShadowCaster(meshes[0]);

    });

    var tree7 = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
        
        meshes[0].position.x = -350;
        meshes[0].position.z = 250;
        meshes[0].scaling = new BABYLON.Vector3(500, 500, 500);
        meshes[0].material.opacityTexture = null;
        meshes[0].material.backFaceCulling = false;
        shadowGenerator.addShadowCaster(meshes[0]);

    });

    var tree77 = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
        
        meshes[0].position.x = -330;
        meshes[0].position.z = 40;
        meshes[0].scaling = new BABYLON.Vector3(500, 500, 350);
        meshes[0].material.opacityTexture = null;
        meshes[0].material.backFaceCulling = false;
        shadowGenerator.addShadowCaster(meshes[0]);

    });

    var tree10 = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
        
        meshes[0].position.x = -290;
        meshes[0].position.z = 120;
        meshes[0].scaling = new BABYLON.Vector3(400, 400, 300);
        meshes[0].material.opacityTexture = null;
        meshes[0].material.backFaceCulling = false;
        shadowGenerator.addShadowCaster(meshes[0]);

    });

    var tree11 = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
        
        meshes[0].position.x = -100;
        meshes[0].position.z = 300;
        meshes[0].scaling = new BABYLON.Vector3(800, 800, 550);
        meshes[0].material.opacityTexture = null;
        meshes[0].material.backFaceCulling = false;
        shadowGenerator.addShadowCaster(meshes[0]);

    });

    var tree12 = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
        
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

    var tree144 = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
        
        meshes[0].position.x = 430;
        meshes[0].position.z = 430;
        meshes[0].scaling = new BABYLON.Vector3(800, 500, 650);
        meshes[0].material.opacityTexture = null;
        meshes[0].material.backFaceCulling = false;
        shadowGenerator.addShadowCaster(meshes[0]);

    });

    var tree134 = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
        
        meshes[0].position.x = 430;
        meshes[0].position.z = 350;
        meshes[0].scaling = new BABYLON.Vector3(600, 600, 350);
        meshes[0].material.opacityTexture = null;
        meshes[0].material.backFaceCulling = false;
        shadowGenerator.addShadowCaster(meshes[0]);

    });

    var tree135 = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
        
        meshes[0].position.x = 435;
        meshes[0].position.z = 305;
        meshes[0].scaling = new BABYLON.Vector3(600, 600, 600);
        meshes[0].material.opacityTexture = null;
        meshes[0].material.backFaceCulling = false;
        shadowGenerator.addShadowCaster(meshes[0]);

    });

    var tree136 = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
        
        meshes[0].position.x = 450;
        meshes[0].position.z = 180;
        meshes[0].scaling = new BABYLON.Vector3(600, 650, 500);
        meshes[0].material.opacityTexture = null;
        meshes[0].material.backFaceCulling = false;
        shadowGenerator.addShadowCaster(meshes[0]);

    }); 

    //altro lato
    var tree3 = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
        
        meshes[0].position.x = 300;
        meshes[0].position.z = 400;
        meshes[0].scaling = new BABYLON.Vector3(600, 600, 600);
        meshes[0].material.opacityTexture = null;
        meshes[0].material.backFaceCulling = false;
        shadowGenerator.addShadowCaster(meshes[0]);
    
    });

    //altro lato
    var tree4 = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
        
        meshes[0].position.x = 400;
        meshes[0].position.z = 0;
        meshes[0].scaling = new BABYLON.Vector3(800, 800, 550);
        meshes[0].material.opacityTexture = null;
        meshes[0].material.backFaceCulling = false;
        shadowGenerator.addShadowCaster(meshes[0]);

    });

    //altro lato
    var tree5 = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
        
        meshes[0].position.x = -350;
        meshes[0].position.z = -400;
        meshes[0].scaling = new BABYLON.Vector3(800, 800, 800);
        meshes[0].material.opacityTexture = null;
        meshes[0].material.backFaceCulling = false;
        shadowGenerator.addShadowCaster(meshes[0]);

    });

    //altro lato
    var tree8 = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
        
        meshes[0].position.x = 180;
        meshes[0].position.z = -380;
        meshes[0].scaling = new BABYLON.Vector3(600, 600, 600);
        meshes[0].material.opacityTexture = null;
        meshes[0].material.backFaceCulling = false;
        shadowGenerator.addShadowCaster(meshes[0]);
    
    });

    //altro lato
    var tree888 = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
    
        meshes[0].position.x = 450;
        meshes[0].position.z = -400;
        meshes[0].scaling = new BABYLON.Vector3(600, 600, 600);
        meshes[0].material.opacityTexture = null;
        meshes[0].material.backFaceCulling = false;
        shadowGenerator.addShadowCaster(meshes[0]);
    
    });

    //dentro le mura

    //Bounding box for trees inside the perimeter
    var bounding9, bounding10, bounding13;

    var boundingBox_tree9 = BABYLON.MeshBuilder.CreateBox("boundingBox_tree9", {height: 20.0, width: 22, depth: 100}, scene);
        boundingBox_tree9.rotation = new BABYLON.Vector3(Math.PI/2, 0, 0);
        boundingBox_tree9.position.y = 0;
        boundingBox_tree9.position.x = -155;
        boundingBox_tree9.position.z = 130;
    var boundingBox_tree9_mat = new BABYLON.StandardMaterial("boundingBox_tree9_mat", scene);
        boundingBox_tree9_mat.alpha = 0;
        boundingBox_tree9_mat.material = boundingBox_tree9_mat;


    var tree9 = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
        
        meshes[0].position.x = -150;
        meshes[0].position.z = 130;
        meshes[0].scaling = new BABYLON.Vector3(600, 650, 700);
        meshes[0].material.opacityTexture = null;
        meshes[0].material.backFaceCulling = false;
        shadowGenerator.addShadowCaster(meshes[0]);
    
        boundingBox_tree9.physicsImpostor = new BABYLON.PhysicsImpostor(boundingBox_tree9, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 10000, restitution: 0});
        boundingBox_tree9.physicsImpostor.physicsBody.inertia.setZero();
        boundingBox_tree9.physicsImpostor.physicsBody.invInertia.setZero();
        boundingBox_tree9.physicsImpostor.physicsBody.invInertiaWorld.setZero();

        meshes[0].freezeWorldMatrix();
        
    });

    var boundingBox_tree10 = BABYLON.MeshBuilder.CreateBox("boundingBox_tree10", {height: 20.0, width: 22, depth: 100}, scene);
        boundingBox_tree10.rotation = new BABYLON.Vector3(Math.PI/2, 0, 0);
        boundingBox_tree10.position.y = 0;
        boundingBox_tree10.position.x = 145;
        boundingBox_tree10.position.z = -80;
    var boundingBox_tree10_mat = new BABYLON.StandardMaterial("boundingBox_tree10_mat", scene);
        boundingBox_tree10_mat.alpha = 0;
        boundingBox_tree10_mat.material = boundingBox_tree10_mat;

    var tree10 = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
        
        meshes[0].position.x = 150;
        meshes[0].position.z = -80;
        meshes[0].scaling = new BABYLON.Vector3(600, 600, 400);
        meshes[0].material.opacityTexture = null;
        meshes[0].material.backFaceCulling = false;
        shadowGenerator.addShadowCaster(meshes[0]);

        boundingBox_tree10.physicsImpostor = new BABYLON.PhysicsImpostor(boundingBox_tree10, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 10000, restitution: 0});
        boundingBox_tree10.physicsImpostor.physicsBody.inertia.setZero();
        boundingBox_tree10.physicsImpostor.physicsBody.invInertia.setZero();
        boundingBox_tree10.physicsImpostor.physicsBody.invInertiaWorld.setZero();

        meshes[0].freezeWorldMatrix();
        
    });

    var boundingBox_tree13 = BABYLON.MeshBuilder.CreateBox("boundingBox_tree13", {height: 30.0, width: 30, depth: 100}, scene);
        boundingBox_tree13.rotation = new BABYLON.Vector3(Math.PI/2, 0, 0);
        boundingBox_tree13.position.y = 0;
        boundingBox_tree13.position.x = 10;
        boundingBox_tree13.position.z = 260;
    var boundingBox_tree13_mat = new BABYLON.StandardMaterial("boundingBox_tree13_mat", scene);
        boundingBox_tree13_mat.alpha = 0;
        boundingBox_tree13_mat.material = boundingBox_tree13_mat;

    var tree13 = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
        
        meshes[0].position.x = 15;
        meshes[0].position.z = 260;
        meshes[0].scaling = new BABYLON.Vector3(800, 1000, 400);
        meshes[0].material.opacityTexture = null;
        meshes[0].material.backFaceCulling = false;
        shadowGenerator.addShadowCaster(meshes[0]);

        boundingBox_tree13.physicsImpostor = new BABYLON.PhysicsImpostor(boundingBox_tree13, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 10000, restitution: 0});
        boundingBox_tree13.physicsImpostor.physicsBody.inertia.setZero();
        boundingBox_tree13.physicsImpostor.physicsBody.invInertia.setZero();
        boundingBox_tree13.physicsImpostor.physicsBody.invInertiaWorld.setZero();

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
        carrot1.position.y = 1; //1

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

    var dummyBoxMaterial = new BABYLON.StandardMaterial("dummyBoxMaterial", scene);
    dummyBoxMaterial.alpha = 0;
    dummyBox.material = dummyBoxMaterial;

    BABYLON.SceneLoader.ImportMesh("", "meshes/", "dummy2.babylon", scene, function (meshes, particleSystems, skeletons){ 
        
        dummyBox.showBoundingBox = true;

        //console.log("dummy mesh:", meshes);

        dummy = meshes[0];
        dummy.scaling.scaleInPlace(18);
        dummy.position.y = -15;

        //dummy.scaling = new BABYLON.Vector3(5.0, 5.0, 5.0);
        //dummy.position = new BABYLON.Vector3(0, -3.5, 0.1);

        shadowGenerator.addShadowCaster(dummy);

        dummy_skeleton = skeletons[0];
        dummy.parent = dummyBox;
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
            dummyBox.physicsImpostor.registerOnPhysicsCollide(rockTask.physicsImpostor, function() {
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
    var rabbitBox = BABYLON.MeshBuilder.CreateBox("rabbitBox",{ height: 7.5, width: 10, depth: 10 }, scene);
    rabbitBox.position.y = 3.5;
    rabbitBox.position.z = -30;

    var rabbitBoxMaterial = new BABYLON.StandardMaterial("rabbitBoxMaterial", scene);
    rabbitBoxMaterial.alpha = 0;
    rabbitBox.material = rabbitBoxMaterial;

    BABYLON.SceneLoader.ImportMesh("", "meshes/", "Rabbit.babylon", scene, function (meshes, particleSystems, skeletons) {

        rabbitBox.showBoundingBox = true;

        

        rabbit = meshes[0];
        rabbit.scaling.scaleInPlace(0.2);
        rabbit.position.y = -3.5;
    
        shadowGenerator.addShadowCaster(rabbit);
    
        rabbit_skeleton = skeletons[0];
    
        rabbit.parent = rabbitBox;
        rabbitBox.showBoundingBox = true;
    
        r_box = meshes[1];
    
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
            rabbit_mesh.translate(BABYLON.Axis.Y, +3.5, BABYLON.Space.LOCAL);
        }
        if(rabbitBox.intersectsMesh(fence6, true, false)){
            rabbit_mesh.translate(BABYLON.Axis.Y, +3.5, BABYLON.Space.LOCAL);
        }
        if(rabbitBox.intersectsMesh(fence7, true, false)){
            rabbit_mesh.translate(BABYLON.Axis.Y, +3.5, BABYLON.Space.LOCAL);
        }
        if(rabbitBox.intersectsMesh(fence8, true, false)){
            rabbit_mesh.translate(BABYLON.Axis.Y, +3.5, BABYLON.Space.LOCAL);
        }
        if(rabbitBox.intersectsMesh(fence9, true, false)){
            rabbit_mesh.translate(BABYLON.Axis.Y, +3.5, BABYLON.Space.LOCAL);
        }
        if(rabbitBox.intersectsMesh(fence10, true, false)){
            rabbit_mesh.translate(BABYLON.Axis.Y, +3.5, BABYLON.Space.LOCAL);
        }
        if(rabbitBox.intersectsMesh(fence11, true, false)){
            rabbit_mesh.translate(BABYLON.Axis.Y, +3.5, BABYLON.Space.LOCAL);
        }
        if(rabbitBox.intersectsMesh(fence12, true, false)){
            rabbit_mesh.translate(BABYLON.Axis.Y, +3.5, BABYLON.Space.LOCAL);
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
            rabbit_skeleton.bones[3].rotate(BABYLON.Axis.Y, 0.05, BABYLON.Space.LOCAL); //left foot
            
            feet_opening+=2;

        }else{

            rabbit_skeleton.bones[2].rotate(BABYLON.Axis.Y, -0.05, BABYLON.Space.LOCAL); //right foot
            rabbit_skeleton.bones[3].rotate(BABYLON.Axis.Y, -0.05, BABYLON.Space.LOCAL); //left foot

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
            win = winScene();
            changescene = 2;
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
                carrot_sound.play();
                carrot1.dispose();
                carrots_taken++;
                num_carrots--;
            }
            take_carrot1++;
            ComputeCarrots(); 
        }

        if(dummyBox.intersectsMesh(carrot2, true, false) ){
            if(take_carrot2 == 0){
                carrot2.dispose();
                carrots_taken++;
                num_carrots--;
            }
            take_carrot2++;
            ComputeCarrots(); 
        }

        if( dummyBox.intersectsMesh(carrot3, true, false) ){
            if(take_carrot3 == 0){
                carrot3.dispose();
                carrots_taken++;
                num_carrots--;
            }
            take_carrot3++;
            ComputeCarrots(); 
        }

        if( dummyBox.intersectsMesh(carrot4, true, false) ){
            if(take_carrot4 == 0){
                carrot4.dispose();
                carrots_taken++;
                num_carrots--;
            }
            take_carrot4++;
            ComputeCarrots(); 
        }

        if( dummyBox.intersectsMesh(carrot5, true, false) ){
            if(take_carrot5 == 0){
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
                    carrot6.dispose();
                    carrots_taken++;
                    num_carrots--;
                }
                take_carrot6++;
                ComputeCarrots(); 
            }

            if( dummyBox.intersectsMesh(carrot7, true, false) ){
                if(take_carrot7 == 0){
                    carrot7.dispose();
                    carrots_taken++;
                    num_carrots--;
                }
                take_carrot7++;
                ComputeCarrots(); 
            }

            if( dummyBox.intersectsMesh(carrot8, true, false) ){
                if(take_carrot8 == 0){
                    carrot8.dispose();
                    carrots_taken++;
                    num_carrots--;
                }
                take_carrot8++;
                ComputeCarrots(); 
            }

            if( dummyBox.intersectsMesh(carrot9, true, false) ){
                if(take_carrot9 == 0){
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


//MENU SCENE
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
    var light = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 0, 0), menu_scene);
        light.parent=camera;
        light.intensity = 1;
        light.groundColor = new BABYLON.Color3(1,1,1);
        light.specular = BABYLON.Color3.Black();

    //GUI Menu
    const guiMenu = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("GUI",true,menu_scene);

    var textureMenu = new BABYLON.GUI.Image("textureMenu", "textures/menu1.jpg");
	guiMenu.addControl(textureMenu);

    /*
    //title
    var title = new BABYLON.GUI.TextBlock();
        title.text = "CARROTS HUNT";
        title.fontFamily = "My Font";
        title.color = "orange";
        title.fontSize = 70;
        title.paddingTop = 20;
        title.resizeToFit = true;
        title.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        guiMenu.addControl(title);
    */

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

    imageday = new BABYLON.GUI.Image("imageday", "textures/giorno.jpg");
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

    imagenight = new BABYLON.GUI.Image("imagenight", "textures/notte.jpg");
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
/*
    var textday = new BABYLON.GUI.TextBlock();
        textday.text = "Day";
        textday.color = "white";
        textday.fontFamily = "My Font";
        textday.fontSize =40;
        textday.width = "10%";
        textday.height = "10%";
        textday.top = "5%";
        textday.bottom = "-5%";
        textday.right = "3%";
        textday.left = "-3%";
        textday.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
            
    var textnight = new BABYLON.GUI.TextBlock();
            textnight.text = "Night";
            textnight.color = "white";
            textnight.fontFamily = "My Font";
            textnight.fontSize =40;
            textnight.width = "10%";
            textnight.height = "10%";
            textnight.top = "5%";
            textnight.bottom = "-5%";
            textnight.right = "-30%";
            textnight.left = "30%";
            textnight.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;

    guiMenu.addControl(textday);
    guiMenu.addControl(textnight);
*/
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
        panel.width = "50%";
        panel.paddingTop = "33%";
        panel.paddingBottom = "-25.5%";
        panel.paddingRight = "38%";
        panel.paddingLeft = "-38%";
        guiMenu.addControl(panel);
        

    var addButton = function(text, parent) {

            var button = new BABYLON.GUI.RadioButton();
            button.width = "30px";
            button.height = "30px";
            button.color = "white";
            button.alpha = 0.8;
            button.background = "black";
    
            
            if(difficulty == 0){
                if (text == "EASY")
                button.isChecked = true;
            }
            if(difficulty == 1){
                if (text == "MEDIUM")
                button.isChecked = true;
            }
            if(difficulty == 2){
                if (text == "HARD")
                button.isChecked = true;
            }
    
            button.onIsCheckedChangedObservable.add(function(state) {
                if (state) {
                    if (text == "EASY"){
                        difficulty = 0;
                    } 
                    if (text == "MEDIUM"){
                        difficulty = 1
                    }
                    if (text == "HARD"){ 
                        difficulty = 2
                    }
                }
            });
            
        var header = BABYLON.GUI.Control.AddHeader(button, text, "150px", { isHorizontal: true, controlFirst: true });
        header.height = "70px";
        header.children[1].fontSize = 25;
        header.children[1].fontFamily = "My Font";
        header.children[1].color = "black";
        header.children[1].alpha = 0.8;
        header.children[1].width ="180px";

        parent.addControl(header);   
    }
        
    addButton("EASY", panel);
    addButton("MEDIUM", panel);
    addButton("HARD", panel);

    /*
    var text_instructions = new BABYLON.GUI.TextBlock();
    text_instructions.text = "Instructions:";
    text_instructions.color = "black";
    text_instructions.fontFamily = "My Font";
    text_instructions.fontSize = 30; //30
    text_instructions.width = "50%";
    text_instructions.height = "10%";
    text_instructions.paddingTop = "70%"; //25
    text_instructions.paddingBottom = "-70%"; //-25
    text_instructions.paddingRight = "40%"; //38
    text_instructions.paddingLeft = "-40%";
    text_instructions.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    guiMenu.addControl(text_instructions);
    
    
    var instructions = new BABYLON.GUI.Image("instructions", "textures/tastiera_mouse.png");
    instructions.width = "20%";
    instructions.height = "30%";
    instructions.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    instructions.paddingTop = "35%";
    instructions.paddingBottom = "-35%";
    instructions.paddingRight = "75%";
    instructions.paddingLeft = "-75%";
    guiMenu.addControl(instructions);
    */

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
                changescene = 1    
            }

            else if(boolimagenight == false){
                game = gameScene();
                from_menu = 1;
                changescene = 1    
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
				changescene = 3;
                boolimageday = true;
                boolimagenight = true;
			});


    engine.hideLoadingUI();

    return menu_scene;
}

//INSTRUCTIONS SCENE
var instructionScene = function(){
    var scene = new BABYLON.Scene(engine);

    var camera = new BABYLON.ArcRotateCamera("camera1", -Math.PI/4, Math.PI/4, 3, new BABYLON.Vector3(0, 0, 0), scene);
    camera.lowerRadiusLimit = camera.upperRadiusLimit = camera.radius = 3;
    camera.lowerAlphaLimit = camera.upperAlphaLimit = camera.alpha = null;
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);


    var guiInstruction = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("InstructionUI");

    var imageInstruction = new BABYLON.GUI.Image("imageinstruction", "textures/menu1.jpg");
    imageInstruction.height = "100%";
	guiInstruction.addControl(imageInstruction);

     
    var instruction = new BABYLON.GUI.TextBlock("Instruction",); 
    instruction.color = "Black";
    instruction.fontFamily = "My Font";
    instruction.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    instruction.fontSize = 45;
    instruction.top = "-10%";
    //instruction.paddingLeft = "-32px";
    //instruction.paddingRight = "32px";
    instruction.paddingTop = "-55px";
    instruction.paddingBottom = "55px";
    instruction.resizeToFit = true;
    instruction.text = "Are you the fastest? \n Catch more carrots than the rabbit!";

    var instruction_image = new BABYLON.GUI.Image("instruction_image", "textures/tastiera_mouse.png");
    instruction_image.width = "30%";
    instruction_image.height = "40%";
    instruction_image.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    instruction_image.paddingTop = "5%";
    instruction_image.paddingBottom = "-5%";
    //instruction_image.paddingRight = "35%";
    //instruction_image.paddingLeft = "-35%";

  //  guiInstruction.addControl(instruction_image);


    var rect1 = new BABYLON.GUI.Rectangle();
    rect1.width = "70%";
    rect1.height = "70%";
    //rect1.paddingLeft = "-32px";
    //rect1.paddingRight = "2px";
    rect1.paddingTop = "5px";
    rect1.paddingBottom = "-5px";
    rect1.background = "white";
    rect1.alpha = 0.5;


    const MenuBtn = BABYLON.GUI.Button.CreateSimpleButton("Menu", "Menu");
    MenuBtn.width = 0.1;
    MenuBtn.height = 0.07;
    MenuBtn.fontFamily = "My Font";
    //MenuBtn.height = "40px";
    MenuBtn.color = "white";
    MenuBtn.alpha = 0.8;
    MenuBtn.fontSize = 30;
    //MenuBtn.thickness = 1;
    MenuBtn.background = "grey";

    MenuBtn.top = "-120px";
    MenuBtn.bottom = "120px"
   // MenuBtn.right = "-13%";
   // MenuBtn.left = "13%";
    MenuBtn.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    //rect1.addControl(MenuBtn);
    


    guiInstruction.addControl(rect1);
    guiInstruction.addControl(instruction);
    guiInstruction.addControl(instruction_image);
    guiInstruction.addControl(MenuBtn);

    MenuBtn.onPointerMoveObservable.add(function(){
        MenuBtn.background = "orange";
        MenuBtn.alpha = 0.8;
    });

	MenuBtn.onPointerOutObservable.add(function () {
        MenuBtn.background = "grey";
        MenuBtn.alpha = 0.8;
        });

    MenuBtn.onPointerUpObservable.add(function () {
 
        menu = menuScene(); 
        changescene = 0;  
        from_instruction = 1; 
    });

    return scene;
}

//WIN SCENE
var winScene = function (){
    var scene = new BABYLON.Scene(engine);

    var camera = new BABYLON.ArcRotateCamera("camera1", -Math.PI/4, Math.PI/4, 3, new BABYLON.Vector3(0, 0, 0), scene);
    camera.lowerRadiusLimit = camera.upperRadiusLimit = camera.radius = 3;
    camera.lowerAlphaLimit = camera.upperAlphaLimit = camera.alpha = null;
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);

    var music;

    var guiWin = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("WinningUI");

    var imageWin = new BABYLON.GUI.Image("imagewin", "textures/menu1.jpg");
    imageWin.height = "100%";
	guiWin.addControl(imageWin);

    var win = new BABYLON.GUI.TextBlock("Win",); 
    win.color = "Black";
    win.fontFamily = "My Font";
    win.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    win.textVerticalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    win.fontSize = "100px";
    //win.paddingLeft = "-32px";
    //win.paddingRight = "32px";
    win.paddingTop = "5px";
    win.paddingBottom = "-5px";
    win.resizeToFit = true;

    if(bool_win){ 
        music = new BABYLON.Sound("Win", "sounds/congratulation.wav", scene, null, {
            autoplay: true,
            volume: 0.3
        });
        win.text = "Congratulations! \n You're the fastest!"
    }
    else{
        music = new BABYLON.Sound("Win", "sounds/gameover.wav", scene, null, {
            autoplay: true,
            volume: 0.3
        });
        win.text = "Ops... too slow!"}

    var rect1 = new BABYLON.GUI.Rectangle();
    rect1.width = "70%";
    rect1.height = "70%";
    //rect1.paddingLeft = "-32px";
    //rect1.paddingRight = "2px";
    rect1.paddingTop = "30px";
    rect1.paddingBottom = "-30px";
    rect1.background = "white";
    rect1.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    rect1.alpha = 0.5;

    const restartBtn = BABYLON.GUI.Button.CreateSimpleButton("restart_win", "Play Again");
    restartBtn.width = "15%";
    restartBtn.height = "10%";
    restartBtn.fontFamily = "My Font";
    //restartBtn.height = "40px";
    restartBtn.color = "white";
    restartBtn.top = "-110px";
    restartBtn.fontSize = 30;
    restartBtn.background = "grey";
    restartBtn.alpha = 0.8;
    restartBtn.right = "10%";
	restartBtn.left = "-10%";
    restartBtn.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    restartBtn.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    //rect1.addControl(restartBtn);
    

    const MenuBtn = BABYLON.GUI.Button.CreateSimpleButton("Menu", "Menu");
    MenuBtn.width = "15%";
    MenuBtn.height = "10%";
    MenuBtn.fontFamily = "My Font";
    //MenuBtn.height = "40px";
    MenuBtn.color = "white";
    MenuBtn.top = "-110px";
    MenuBtn.fontSize = 30;
    MenuBtn.background = "grey";
    MenuBtn.alpha = 0.8;
    MenuBtn.right = "-10%";
	MenuBtn.left = "10%";
    MenuBtn.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    MenuBtn.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    //rect1.addControl(MenuBtn);


    guiWin.addControl(rect1);
    guiWin.addControl(restartBtn);
    guiWin.addControl(MenuBtn);
    guiWin.addControl(win);

    restartBtn.onPointerUpObservable.addOnce(function () {
        jump=0;
        walkStepsCounter = 0;
        walkBackStepsCounter = 0;
        change = false;
        change_back = false;
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
        changescene = 1;   
        from_win = 1;
    });

    restartBtn.onPointerMoveObservable.add(function(){
        restartBtn.background = "orange";
        restartBtn.alpha = 0.8;
    });

    restartBtn.onPointerOutObservable.add(function () {
        restartBtn.background = "grey";
        restartBtn.alpha = 0.8;
    });

    MenuBtn.onPointerUpObservable.addOnce(function () {
        jump=0;
        walkStepsCounter = 0;
        walkBackStepsCounter = 0;
        change = false;
        change_back = false;
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
        //console.log("clickedMenu");

        carrot_motion = 0;
        carrot_change = false;

         boolimageday = true;
         boolimagenight = true;


        // Check if the first time call the function FOREST_Scene
        menu = menuScene(); 
        changescene = 0;  
        from_win = 1; 
    });

    MenuBtn.onPointerMoveObservable.add(function(){
        MenuBtn.background = "orange";
        MenuBtn.alpha = 0.8;
    });

    MenuBtn.onPointerOutObservable.add(function () {
        MenuBtn.background = "grey";
        MenuBtn.alpha = 0.8;
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
    var light = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 0, 0), scene);
    light.intensity = 1;
    light.groundColor = new BABYLON.Color3(1,1,1);
    light.specular = BABYLON.Color3.Black();
    light.parent=camera;


    var loadGui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    var Loading = new BABYLON.GUI.TextBlock("Loading","Loading... "); 
    Loading.color = "white";
    Loading.fontFamily = "My Font";
    //Lose.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    Loading.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    Loading.fontSize = "74px";
    Loading.paddingLeft = "-32px";
    LoadingpaddingRight = "32px";
    Loading.paddingTop = "5px";
    Loading.paddingBottom = "-5px";
    Loading.resizeToFit = true;

    //loadGui.addControl(rect1);
    loadGui.addControl(Loading);

  
    /*
    scene.registerAfterRender( function () {
        earth.rotation = new BABYLON.Vector3(0, Math.PI/6, 0);
    });
    */

    return scene;
}

load = LOADING_Scene();
menu = menuScene();

//var win2 = winScene();


// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
    //win2.render();

    
   if (changescene == 0){
        if (menu.getWaitingItemsCount() == 0 && load.getWaitingItemsCount() == 0){
            engine.hideLoadingUI();
            menu.render();

            if(from_win == 1){
                win.dispose();
                from_win = 0;
            }
            if(from_instruction == 1){
                instruction_scene.dispose();
                from_instruction = 0;
            }
        } else{
            engine.displayLoadingUI();
        }
   }
   else if (changescene == 1) {
        if(game.getWaitingItemsCount() == 0) {
            engine.hideLoadingUI();
            load.dispose();
            game.render();

            if (from_menu == 1){
                menu.dispose();
                from_menu = 0;
            }
            if (from_win == 1){
                win.dispose();
                from_win = 0;
            }
        } else{
            load = LOADING_Scene();
            load.render();
            engine.displayLoadingUI();
        }
   }
   else if (changescene == 2){
       if(win.getWaitingItemsCount() == 0){
           engine.hideLoadingUI();
           win.render();
           game.dispose();
       } else {
           engine.displayLoadingUI();
       }
   }
   else if (changescene == 3){
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

