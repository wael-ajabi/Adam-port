import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import nipplejs from "nipplejs";
import { gsap } from 'gsap'
import './style.css'
import './mazurick.webflow.css'
import './normalize.css'
import './webflow.css'
import './webflow.js'

var open = true

document.addEventListener("touchstart", function(e){

  if(e.touches.length>1){
  e.preventDefault();
  }
},{passive: false});
document.getElementsByClassName("hamburger-lines")[0].onclick=()=>{
  if(open===true){
    console.log(open);
  for(let i=0;i<4;i++){
  document.getElementsByClassName('label')[i].style.display='none'
}
document.getElementById('zone').style.display='none'
open=false  
} 
else if (!open){
  for(let i=0;i<4;i++){
    document.getElementsByClassName('label')[i].style.display=''
  }
  document.getElementById('zone').style.display=''
  open=true

}
}



// Loaders 

const loadingBarElement = document.querySelector('.loading-bar')
console.log(loadingBarElement)

//menu icon
// var changeview=false
//     //    const play = document.getElementsByClassName[0]('svg')
//     const svgcontainer = document.getElementById('svg')
//     const animItemopen = bodymovin.loadAnimation({
//         wrapper: svgcontainer,
//         animType:'svg',
//         loop:false,
//         autoplay:false,
//         path:'https://assets5.lottiefiles.com/packages/lf20_cwjG6q.json'
//     });

//     svgcontainer.addEventListener('click',()=>{
//       if(!changeview) {animItemopen.playSegments([0,30], true);changeview=true;
//     }
//       else if(changeview) {animItemopen.playSegments([37,75],true);changeview=false;
//     }

//     });

    // document.getElementById("menu").style.display='block'


const loadingManager = new THREE.LoadingManager(

  // Loaded
  () =>
  {
    gsap.delayedCall(0.5,()=>
    {
      gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0})
      loadingBarElement.classList.add('ended')
      loadingBarElement.style.transform = ''
    })
  },

  // Progress

  (itemUrl, itemsLoaded, itemsTotal) =>
  {
    const progressRatio = itemsLoaded / itemsTotal
    loadingBarElement.style.transform = `scaleX(${progressRatio})`
   
  }


)
const gltfLoader = new GLTFLoader(loadingManager);


/**
 * Base
 */



// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Overlay

const overlayGeometry = new THREE.PlaneBufferGeometry(2, 2, 1, 1)

const overlayMaterial = new THREE.ShaderMaterial({
  transparent: true,
  uniforms:
  {
    uAlpha: { value: 1}
  },

  vertexShader: `
      void main()
      {
          gl_Position = vec4(position, 1.0);
      }
  `,
  fragmentShader: `
  uniform float uAlpha;

      void main()
      {
          gl_FragColor = vec4(255, 255, 255, uAlpha);
      } 
  `
})

const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)
scene.add(overlay)



/**
 * Models
 */

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

// const gltfLoader = new GLTFLoader(loadingManager);
gltfLoader.setDRACOLoader(dracoLoader);

let mixer = null;
var sizee=0


if(screen.width>700){
  
sizee=150;
}
if(screen.width < 700){
    sizee=100
    
    }

   
// document.querySelector('html').classList.add('is-ios');
//joystick

var options = {
  zone: document.getElementById("zone"),
  mode: "static",
  position: { left: "50%", top: "80%" },
  color: "white",
  size: sizee,
};

var ala=null
var joyManager = nipplejs.create(options);
var up = false;
var down = false;
var left = false;
var right = false;

joyManager.on("move", function (evt, data) {
    ala=data
  var forward = data.vector.y;
  var turn = data.vector.x;
  if (forward !== 0 ) {up=true }})
  
 

joyManager.on("end", function (evt) {
  up = false;
  down = false;
  left = false;
  right = false;
  action.stop();
  action2.stop();

});

var action = null;

var dog=null

/// thhis is a cube i made , the cube will be the one moving and the model will be following it ps: notice that it's invisible
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);

//threejs mesh
cube.scale.set(0.4, 1, 0.4);
cube.position.set(0, 0, 0);

scene.add(cube);
cube.visible = false;
const dudeWrapper=new THREE.Mesh(geometry, material);


const cube2 = new THREE.Mesh(geometry, material);

//threejs mesh
cube2.scale.set(0.4, 1, 0.4);
cube2.position.set(1, 0, -0.8)
cube2.visible=false
// const cubeFolder2 = gui.addFolder('position');
// cubeFolder2.add( cube2.position, 'x');
// cubeFolder2.add( cube2.position, 'y');
// cubeFolder2.add( cube2.position, 'z');
// cubeFolder2.add( cube2.rotation, 'x');
// cubeFolder2.add( cube2.rotation, 'y');
// cubeFolder2.add( cube2.rotation, 'z');

// cubeFolder2.open();

scene.add(cube2);

//threejs mesh
dudeWrapper.scale.set(0.3, 1.5, 0.3);
dudeWrapper.visible = false;
scene.add(dudeWrapper);
var dude = null; //this variable so i can take the model outisde of the scope to use it later
var action2=null
var action3=null




gltfLoader.load(
  "/models/Adam/Adam.gltf",

  (gltf1) => {
    dude = gltf1.scene; // give it the gltf1 scene
    gltf1.scene.traverse(function (object) {
      if (object.isMesh) object.castShadow = true;
    });
    gltf1.scene.scale.set(2, 2, 2);
    gltf1.scene.position.copy(cube.position); //now the model will be following the cube's position using the copy method
    scene.add(gltf1.scene);
    // Animation
    mixer = new THREE.AnimationMixer(gltf1.scene);
    action = mixer.clipAction(gltf1.animations[0]);


    const dracoLoaderThree = new DRACOLoader();
 dracoLoaderThree.setDecoderPath("/draco/");
 
 const gltfLoaderThree = new GLTFLoader();
 gltfLoaderThree.setDRACOLoader(dracoLoaderThree);
 
 gltfLoaderThree.load(
  '/models/Winston/scene.gltf',
    
     (gltf) =>
     {
         gltf.scene.traverse( function ( object ) {
 
             if ( object.isMesh ) object.castShadow = true;
          
            
         } );
         gltf.scene.scale.set(.025, .025, .025)
         dude.add(gltf.scene)
       dog=gltf.scene
         
         gltf.scene.position.set(0.2, 0, -.3)
        //  gltf.scene.rotation.y = 0
   
 
         // Animation
          mixerThree = new THREE.AnimationMixer(gltf.scene)
          action2 = mixerThree.clipAction(gltf.animations[10])
          action3 = mixerThree.clipAction(gltf.animations[0])
         
     }
 )
  }
);






/**
 * Models
 */
const dracoLoaderTwo = new DRACOLoader();
dracoLoaderTwo.setDecoderPath("/draco/");

const gltfLoaderTwo = new GLTFLoader();
gltfLoaderTwo.setDRACOLoader(dracoLoaderTwo);

gltfLoaderTwo.load(
  "/models/title_one/Title_One.gltf",

  (gltf) => {
    gltf.scene.traverse(function (object) {
      if (object.isMesh) object.castShadow = false;
    });
    gltf.scene.scale.set(.3, .3, .3);
    gltf.scene.rotation.y = .788;

    gltf.scene.position.set(0.4, 0.01, 0.4);
    scene.add(gltf.scene);
  }
);


const dracoLoaderSix = new DRACOLoader();
dracoLoaderSix.setDecoderPath("/draco/");

const gltfLoaderSix = new GLTFLoader();
gltfLoaderSix.setDRACOLoader(dracoLoaderSix);

gltfLoaderSix.load(
  "/models/textsix/TitleSix.gltf",

  (gltf) => {
    gltf.scene.traverse(function (object) {
      if (object.isMesh) object.castShadow = false;
    });
    gltf.scene.scale.set(1.5, 1.5, 2.5);
    gltf.scene.rotation.y = .780;
  

    gltf.scene.position.set(-2.85, 0.01, -2.8);
    scene.add(gltf.scene);
  }
);




// Experiment Start

let mixerEight = null;

const dracoLoaderEight = new DRACOLoader();
dracoLoaderEight.setDecoderPath("/draco/");
 
const gltfLoaderEight = new GLTFLoader();
gltfLoaderEight.setDRACOLoader(dracoLoaderEight);
 
gltfLoaderEight.load(
   "/models/tesla_bot/scene.gltf",
 
   (gltf) => {
     gltf.scene.traverse(function (object) {
       if (object.isMesh) object.castShadow = true;
     });
     gltf.scene.scale.set(.8, .8, .8);
     gltf.scene.rotation.y = .788;
     

     gltf.scene.position.set(-2.87, 0, 2.99);
     scene.add(gltf.scene);

//  // Animation
    mixerEight = new THREE.AnimationMixer(gltf.scene)
    const action8 = mixerEight.clipAction(gltf.animations[0])
    action8.play()
  
   }

);

let mixerNine = null;

const dracoLoaderTen = new DRACOLoader();
dracoLoaderTen.setDecoderPath("/draco/");
 
const gltfLoaderTen = new GLTFLoader();
gltfLoaderTen.setDRACOLoader(dracoLoaderTen);
 
gltfLoaderTen.load(
   "/models/titlefive/TitleFIVE.gltf",
 
   (gltf) => {
     gltf.scene.traverse(function (object) {
       if (object.isMesh) object.castShadow = false;
     });
     gltf.scene.scale.set(.3,.3,.3);
     gltf.scene.rotation.y = .788;
     gltf.scene.rotation.x = 0;
 
     gltf.scene.position.set(3.15, 0.01, -2.40);
     scene.add(gltf.scene);

   }

 );


const dracoLoaderTwelve = new DRACOLoader();
dracoLoaderTwelve.setDecoderPath("/draco/");
 
const gltfLoaderTwelve = new GLTFLoader();
gltfLoaderTwelve.setDRACOLoader(dracoLoaderTwelve);
 
gltfLoaderTwelve.load(
   "/models/titlefour/TitleFour.gltf",
 
   (gltf) => {
     gltf.scene.traverse(function (object) {
       if (object.isMesh) object.castShadow = false;
     });
     gltf.scene.scale.set(.3, .3, .3);
     gltf.scene.rotation.y = .788;
     gltf.scene.rotation.x = 0;
 
     gltf.scene.position.set(-2.55, 0.01, 3.30);
     scene.add(gltf.scene);

   }

 );

 const dracoLoaderThirteen = new DRACOLoader();
 dracoLoaderThirteen.setDecoderPath("/draco/");
  
 const gltfLoaderThirteen = new GLTFLoader();
 gltfLoaderThirteen.setDRACOLoader(dracoLoaderThirteen);
  
 gltfLoaderThirteen.load(
    "/models/DotsLeft/Dots.gltf",
  
    (gltf) => {
      gltf.scene.traverse(function (object) {
        if (object.isMesh) object.castShadow = true;
      });
      gltf.scene.scale.set(.3, .3, .3);
      gltf.scene.rotation.y = .789;
      gltf.scene.rotation.x = 0;
  
      gltf.scene.position.set(-1.04, 0.01, 1.9);
      scene.add(gltf.scene);
 
    }
 
  );


 const dracoLoaderFourteen = new DRACOLoader();
 dracoLoaderFourteen.setDecoderPath("/draco/");
  
 const gltfLoaderFourteen = new GLTFLoader();
 gltfLoaderFourteen.setDRACOLoader(dracoLoaderFourteen);
  
 gltfLoaderFourteen.load(
    "/models/DotsRight/Dots.gltf",
  
    (gltf) => {
      gltf.scene.traverse(function (object) {
        if (object.isMesh) object.castShadow = true;
      });
      gltf.scene.scale.set(.3, .3, .3);
      gltf.scene.rotation.y = .789;
      gltf.scene.rotation.x = 0;
  
      gltf.scene.position.set(1.82, 0.01, -1.00);
      scene.add(gltf.scene);
 
    }
 
  );
 
 
  const dracoLoaderFifteen = new DRACOLoader();
  dracoLoaderFifteen.setDecoderPath("/draco/");
   
  const gltfLoaderFifteen = new GLTFLoader();
  gltfLoaderFifteen.setDRACOLoader(dracoLoaderFourteen);
   
  gltfLoaderFifteen.load(
     "/models/quest_2/Oculus.gltf",
   
     (gltf) => {
       gltf.scene.traverse(function (object) {
         if (object.isMesh) object.castShadow = true;
       });
       gltf.scene.scale.set(2.5, 2.5, 2.5);
       gltf.scene.rotation.y = -0.62;
       gltf.scene.rotation.x = -0.65;
   
       gltf.scene.position.set(2.69, 0.4, -2.7);
       scene.add(gltf.scene);
  
     }
  
   );



//static/

let mixerThree = null;

/**
 * Models
 */
 

//raycaster
const raycaster = new THREE.Raycaster(); // create once
const clickMouse = new THREE.Vector2();  // create once

//


function intersect(pos) {
  raycaster.setFromCamera(pos, camera);
  return raycaster.intersectObject(dudeWrapper);
}
// function intersection(pos) {
//   raycaster.setFromCamera(pos, camera);
//   return raycaster.intersectObject(titleWrapper);
// }


window.addEventListener('mousedown', event => {


// THREE RAYCASTER
clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;


const found = intersect(clickMouse);
const titleFound=intersection(clickMouse);

if(titleFound.length>0){
  window.open("https://www.linkedin.com/in/mazurick");
}
if(found.length>0){
  
  const listener = new THREE.AudioListener();

    const audio = new THREE.Audio( listener );
    const file = './Intro.m4a';

    if ( /(iPad|iPhone|iPod)/g.test( navigator.userAgent ) ) {
      
        const loader = new THREE.AudioLoader();
        loader.load( file, function ( buffer ) {

            audio.setBuffer( buffer );
            audio.play();

        } );

    } 
    else {

        const mediaElement = new Audio( file );
        mediaElement.play();

        audio.setMediaElementSource( mediaElement );

    }


	}
});

//ios eventlistner
window.addEventListener('touchstart', event => {



  // THREE RAYCASTER
  clickMouse.x = (event.pageX / window.innerWidth) * 2 - 1;
  clickMouse.y = -(event.pageY / window.innerHeight) * 2 + 1;
  
  
  const found = intersect(clickMouse);
  const titleFound=intersection(clickMouse)
  if(titleFound.length>0){
    window.location.href = "https://www.linkedin.com/in/mazurick";
    
  }
  if(found.length>0){
    
    const listener = new THREE.AudioListener();
  
      const audio = new THREE.Audio( listener );
      const file = './Intro.m4a';
  
    
  
          const mediaElement = new Audio( file );
          mediaElement.play();
  
          audio.setMediaElementSource( mediaElement );
  
  
  
  
    }
  });





/**
 * Camera
 */

var camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.5,
  100000
);
camera.position.set(2, 3, 2);

/**
 * Lights
 */

// Ambient light
const ambientLight = new THREE.AmbientLight();
ambientLight.color = new THREE.Color(0xffffff);
ambientLight.intensity = 0.5;
scene.add(ambientLight);

// Hemisphere light
const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.2)
scene.add(hemisphereLight)

// Point light
const pointLight = new THREE.PointLight(0xffffff, 0.5, 10, 2);
pointLight.position.set(1, -0.5, 1);
scene.add(pointLight);


// Spot light
const spotLight = new THREE.SpotLight(0xffff00, 2, 10, Math.PI * 0.2, 0.25, 1)
spotLight.position.set(-4, 6.5, 7)
scene.add(spotLight)

spotLight.target.position.x = -2
spotLight.castShadow = true

scene.add(spotLight.target)


// const spotLightHelper = new THREE.SpotLightHelper(spotLight)
// scene.add(spotLightHelper)



// Spot light
const spotLight2 = new THREE.SpotLight(0xfffff0, 5, 10, Math.PI * .095, 0.25, 1)
spotLight2.position.set(3, 6.5, -9)
scene.add(spotLight2)

spotLight2.target.position.x = 3
spotLight2.castShadow = true

scene.add(spotLight2.target)


// const spotLightHelper2 = new THREE.SpotLightHelper(spotLight2)
// scene.add(spotLightHelper2)



// Spot light

const spotLightTwo1 = new THREE.SpotLight(
  0xffffff,
  0.2,
  10,
  Math.PI * 0.2,
  0.25
);
spotLightTwo1.position.set(2, 3, 1);
spotLightTwo1.lookAt(new THREE.Vector3((-0.5, 0, 1)));

scene.add(spotLightTwo1);
// spotLightTwo.lookAt(new THREE.Vector3((-0.5,0,1)))

const spotLightTwo = new THREE.PointLight(
  0xffffff,
  0.2,
  10,
  Math.PI * 0.2,
  0.25
);
spotLightTwo.position.set(2, 3, 1);
//here i added the light as a child for the camera so it will follow the camera's movment
camera.add(spotLightTwo);
scene.add(camera);
// spotLightTwo.lookAt(new THREE.Vector3((-0.5,0,1)))
spotLightTwo.castShadow = true;


// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
// scene.add(directionalLightHelper)

// // Helpers
// const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
// scene.add(hemisphereLightHelper)

// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
// scene.add(directionalLightHelper)

// const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
// scene.add(pointLightHelper)

// const spotLightHelper = new THREE.SpotLightHelper(spotLight)
// scene.add(spotLightHelper)



/**
 * Floor
//  */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(1600, 1600),
  new THREE.MeshStandardMaterial({
    color: 0x829191,
  })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.background = new THREE.Color(0xffffff);
scene.add(floor);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

//////labels
const openModalButtons = document.querySelectorAll('[data-modal-target]')
const closeModalButtons = document.querySelectorAll('[data-close-button]')
const overlay1 = document.getElementById('overlay')

openModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = document.querySelector(button.dataset.modalTarget)
    openModal(modal)
  })
})

overlay.addEventListener('click', () => {
  const modals = document.querySelectorAll('.modal.active')
  modals.forEach(modal => {
    closeModal(modal)
  })
})

closeModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = button.closest('.modal')
    closeModal(modal)
  })
})

function openModal(modal) {
  if (modal == null) return
  modal.classList.add('active')
  overlay1.classList.add('active')
}

function closeModal(modal) {
  if (modal == null) return
  modal.classList.remove('active')
  overlay1.classList.remove('active')
}
/// for  the tesla
const openModalButtons1 = document.querySelectorAll('[data-modal-target]')
const closeModalButtons1 = document.querySelectorAll('[data-close-button]')
const overlay2 = document.getElementById('overlay')

openModalButtons1.forEach(button => {
  button.addEventListener('click', () => {
    const modal = document.querySelector(button.dataset.modalTarget)
    openModal(modal)
  })
})

overlay.addEventListener('click', () => {
  const modals = document.querySelectorAll('.modal.active')
  modals.forEach(modal => {
    closeModal(modal)
  })
})

closeModalButtons1.forEach(button => {
  button.addEventListener('click', () => {
    const modal = button.closest('.modal')
    closeModal(modal)
  })
})

function openModal1(modal) {
  if (modal == null) return
  modal.classList.add('active')
  overlay2.classList.add('active')
}

function closeModal1(modal) {
  if (modal == null) return
  modal.classList.remove('active')
  overlay2.classList.remove('active')
}


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ logarithmicDepthBuffer: true,
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.autoUpdate = true;
renderer.shadowMap.enabled = true;

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

// Model animation


const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

    

  //here we copy the cube's position and apply it to the model
  if (dude) {dude.position.copy(cube.position);

}



  if (dude) dude.rotation.copy(cube.rotation);
  
  dudeWrapper.position.copy(cube.position);
  dudeWrapper.position.y=0.7
   dudeWrapper.rotation.copy(cube.rotation);
  // Model animation
  if (mixer) {
    //here we put the mouvment for the model with each diraction the joystick take
    mixer.update(deltaTime);
    // if (up === true) {
    
    //   action.play();
    //   action2.play()
    // }
  }
  if (up === true) {

    // cube.rotation.y=Math.PI-ala.angle.radian-0.5
    cube.rotation.y=ala.angle.radian+0.6595+Math.PI/2
        var speedFactor = 0.03;
  
    
        const direction = new THREE.Vector3();
    
        cube.getWorldDirection(direction);
        action.play();
      action2.play()
     

    
        cube.position.add(direction.multiplyScalar(speedFactor));
  }

  if (mixerThree) {
    mixerThree.update(deltaTime);
    action3.play()
  }
  // // Update controls
  // controls.update()
  var v = new THREE.Vector3(0, 0, 0);

  if (dog) {

  

// cube2.position.set(dude.position.x+1,0,dude.position.z-0.8)}
// if(dude)cube2.rotation.copy(dude.rotation)

if (dog) {
  dog.getWorldPosition(v)
  const points = [
    {
        position: new THREE.Vector3(cube.position.x+0.4, cube.position.y+0.3, cube.position.z+0.1),
        element: document.querySelector('.point-0')
    },
    {
        position: new THREE.Vector3(-2.87, 0.2, 2.99),
        element: document.querySelector('.point-1')
    },
    {
        position: new THREE.Vector3(2.9, 0.4, -2.5),
        element: document.querySelector('.point-2')
    },
    {
      position: new THREE.Vector3(v.x+0.4,0.2,v.z),
      element: document.querySelector('.point-3')
  }
]



  for(const point of points)
  {
      // Get 2D screen position
      const screenPosition = point.position.clone()
      screenPosition.project(camera)

      // Set the raycaster
      raycaster.setFromCamera(screenPosition, camera)
      const intersects = raycaster.intersectObjects(scene.children, true)

      // No intersect found
      if(intersects.length === 0)
      {
          // Show
          point.element.classList.add('visible')
      }

      // Intersect found
      else
      {
          // Get the distance of the intersection and the distance of the point
          const intersectionDistance = intersects[0].distance
          const pointDistance = point.position.distanceTo(camera.position)

          // Intersection is close than the point
          if(intersectionDistance < pointDistance)
          {
              // Hide
              point.element.classList.remove('visible')
          }
          // Intersection is further than the point
          else
          {
              // Show
              point.element.classList.add('visible')
          }
      }

      
      const translateX = screenPosition.x * sizes.width * 0.5
      const translateY = - screenPosition.y * sizes.height * 0.5

      point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`
  }}}
  // console.log(cube2.position);
  camera.position.x = cube.position.x + 2;
  camera.position.z = cube.position.z + 2;
  camera.position.y = 3;
  camera.lookAt(cube.position);
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);

  if (mixerEight) {
    mixerEight.update(deltaTime);
  }

  if (mixerNine) {
    mixerNine.update(deltaTime);
  }
  

};

tick();



