import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js'
import { OrbitControls } from 'https://cdn.skypack.dev/@three-ts/orbit-controls'
// import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";

//loader
const loader = new THREE.TextureLoader()
const cross = loader.load('texture/cross.png')
const texture = loader.load('texture/facetexture.jpg')
const height = loader.load('texture/faceheight1.png')
const alpha = loader.load('texture/alpha.png')
// const gltfLoader = new GLTFLoader();

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
// const geometry = new THREE.TorusGeometry( .7, .2, 16, 100 );
const geometry = new THREE.PlaneBufferGeometry(3,3,64,64)
const particlesGeometry = new THREE.BufferGeometry;
const particlescount = 5000;

const posArray = new Float32Array(particlescount * 3)

for(let i=0; i < particlescount*3 ; i++){
    // posArray[i] = (Math.random() - .5) *5
    posArray[i] = (Math.random() - .5) * (Math.random() * 5)
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray,3))

// Materials

// const material = new THREE.PointsMaterial({
//     size: .005
// })

const material = new THREE.MeshStandardMaterial({
    color: 'gray',
    map: texture,
    displacementMap: height,
    displacementScale: .2,
    alphaMap: alpha,
    transparent: true,
    depthTest: false
})

const particlesMaterial = new THREE.PointsMaterial({
    map: cross,
    size: .005,
    transparent: true,
    color: 'red',
    blending: THREE.AdditiveBlending
})

//gltf 3D model
// gltfLoader.load('texture/wood_bridge/scene.gltf', function(gltf){
//     console.log('gltf loaded')
//     // const bridge = gltf.scene
//     // bridge.scale.set(0.5,0.5,0.5)
//     // scene.add(bridge)
// },function(xhr){
//     console.log((xhr.loaded/xhr.total * 100) + "% loaded")
// }, function(error){
//     console.log('Error loadeing gltf')
// })

// Mesh
// const sphere = new THREE.Points(geometry,material)
const plane = new THREE.Mesh(geometry,material)
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(plane, particlesMesh)
// scene.add(particlesMesh)

// Lights

const pointLight = new THREE.PointLight(0xffffff, 3)
pointLight.position.x = 2
pointLight.position.y = 10
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(new THREE.Color('#000000'), 1)
// renderer.shadowMap.enabled = true
// renderer.gammaOutput = true

/**
 * Animate
 */

 document.addEventListener('mousemove', particleAnimate)
 let mouseX = 0
 let mouseY = 0
 
 function particleAnimate(event){
     mouseX = event.clientX
     mouseY = event.clientY
 }

const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    // sphere.rotation.y = .5 * elapsedTime
    // sphere.rotation.x = .3 * elapsedTime
    plane.rotation.y = .5 * elapsedTime
    plane.material.displacementScale = .2 + mouseY * .003
    plane.rotation.y = mouseY * -.0001

    // particlesMesh.rotation.z = elapsedTime * -.1
    particlesMesh.position.z = -1
    // particlesMesh.position.z = elapsedTime * .01
    
    if(mouseX > 0){
        particlesMesh.rotation.x = -mouseY * elapsedTime *.0001
        particlesMesh.rotation.y = -mouseX * elapsedTime *.0001
        // particlesMesh.rotation.z = -mouseX * elapsedTime *.0001
        // particlesMesh.position.z =  mouseX * elapsedTime *.00005
    }

    // Update Orbital Controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()