import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.TorusGeometry( .7, .2, 16, 100 );
const particlesGeometry = new THREE.BufferGeometry;
const particlescount = 5000;

const posArray = new Float32Array(particlescount * 3)

for(let i=0; i < particlescount*3 ; i++){
    // posArray[i] = (Math.random() - .5) *5
    posArray[i] = (Math.random() - .5) * (Math.random() * 5)
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray,3))

// Materials

const material = new THREE.PointsMaterial({
    size: .005
})

const particlesMaterial = new THREE.PointsMaterial({
    size: .005,
    transparent: true,
    color: 'red',
    blending: THREE.AdditiveBlending
})

// Mesh
const sphere = new THREE.Points(geometry,material)
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(sphere, particlesMesh)


// Lights

const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.position.x = 2
pointLight.position.y = 3
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
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(new THREE.Color('#212aff'), 1)


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
    sphere.rotation.y = .5 * elapsedTime
    sphere.rotation.x = .3 * elapsedTime
    particlesMesh.rotation.z = elapsedTime * -.1
    // particlesMesh.position.z = elapsedTime * .01
    
    if(mouseX > 0){
        particlesMesh.rotation.x = -mouseY * elapsedTime *.0001
        particlesMesh.rotation.y = -mouseX * elapsedTime *.0001
        // particlesMesh.rotation.z = -mouseX * elapsedTime *.0001
        // particlesMesh.position.z =  mouseX * elapsedTime *.00005
    }

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()