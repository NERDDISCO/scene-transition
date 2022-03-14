import './style.css'
import * as THREE from 'three'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const textureLoader = new THREE.TextureLoader()
const canvas = document.querySelector('canvas.webgl')
const cameraZ = 5

const texture1 = new THREE.WebGLRenderTarget(sizes.width, sizes.height)
const texture2 = new THREE.WebGLRenderTarget(sizes.width, sizes.height)

/**
 * Main Scene
 */
const mainScene = new THREE.Scene()

const mainCamera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 3000);
mainCamera.position.z = cameraZ;

/**
 * Main Screen
 */
 let mainScreenUniforms = {
    'time': {
        value: 1.5
    },
    'uvScale': {
        value: new THREE.Vector2(1., 1.)
    },
    'texture1': {
        value: texture1.texture
    },
    'texture2': {
        value: texture2.texture
    },
    'progress': {
        value: 0
    }
};

mainScreenUniforms['texture1'].value.wrapS = mainScreenUniforms['texture1'].value.wrapT = THREE.RepeatWrapping;
mainScreenUniforms['texture2'].value.wrapS = mainScreenUniforms['texture2'].value.wrapT = THREE.RepeatWrapping;

const mainScreenGeometry = new THREE.PlaneBufferGeometry(10, 10)
//  const mainScreenMaterial = new THREE.MeshBasicMaterial({
//      map: texture2.texture,
//      color: '#ffffff',
//      side: THREE.DoubleSide
//  })
const mainScreenMaterial = new THREE.ShaderMaterial({
    uniforms: mainScreenUniforms,
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent
});
const mainScreen = new THREE.Mesh(mainScreenGeometry, mainScreenMaterial)
mainScreen.rotation.set(Math.PI * 1, Math.PI * 1, 0)
mainScene.add(mainScreen)


/**
 * Scene 1
 */
const scene1 = new THREE.Scene()
scene1.background = new THREE.Color( 0xffffff );
const camera1 = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 3000);
camera1.position.z = cameraZ;
const cubeGeometry = new THREE.BoxBufferGeometry(2.5, 2.5, 2.5)
const cubeMaterial = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    roughness: 0.5,
    metalness: 0.5,
})
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
cube.rotation.set(Math.PI * 1.25, Math.PI * 1.25, 0)
scene1.add(cube)

const ambientLight1 = new THREE.AmbientLight(0xffffff, 1.0)
scene1.add(ambientLight1)



/**
 * Scene 2
 */
const scene2 = new THREE.Scene()
const camera2 = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 3000);
camera2.position.z = cameraZ;
const icosahedronGeometry = new THREE.IcosahedronBufferGeometry(1, 2)
const icosahedronMaterial = new THREE.MeshStandardMaterial({
    color: 0x0000ff,
    roughness: 0.5,
    metalness: 0.5,
})
const icosahedron = new THREE.Mesh(icosahedronGeometry, icosahedronMaterial)
icosahedron.rotation.set(Math.PI * 1.25, Math.PI * 1.25, 0)
scene2.add(icosahedron)

const ambientLight2 = new THREE.AmbientLight(0xffffff, 1.0)
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = -7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = -7
directionalLight.position.set(5, 5, 5)

scene2.add(directionalLight)
scene2.add(ambientLight2)




window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    mainCamera.aspect = sizes.width / sizes.height
    mainCamera.updateProjectionMatrix()
    camera1.aspect = sizes.width / sizes.height
    camera1.updateProjectionMatrix()
    camera2.aspect = sizes.width / sizes.height
    camera2.updateProjectionMatrix()

    // Update renderTarget
    texture1.setSize(sizes.width, sizes.height)
    texture2.setSize(sizes.width, sizes.height)

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Controls
 */
const controls = new OrbitControls(mainCamera, canvas)
controls.target.set(0, 0, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = (elapsedTime - previousTime) * .5
    previousTime = elapsedTime

    // Update controls 
    controls.update()

    scene1.rotation.set(Math.PI * 1 + elapsedTime, Math.PI * 1, 0)
    scene2.rotation.set(Math.PI * 1 + elapsedTime, Math.PI * 1 + elapsedTime, 0)


    // Render into background render targets that will
    // not be shown on mainScreen
    renderer.setRenderTarget(texture1)
    renderer.render(scene1, camera1)

    renderer.setRenderTarget(texture2)
    renderer.render(scene2, camera2)

    // Don't set any target to actually 
    // render to the mainScreen
    renderer.setRenderTarget(null)
    renderer.render(mainScene, mainCamera)

    // Transition between scene1 and scene2
    if (mainScreenUniforms.toggle === false) {
        mainScreenUniforms.progress.value += deltaTime
    } else {
        mainScreenUniforms.progress.value -= deltaTime
    }

    if (mainScreenUniforms.progress.value > 1) {
        mainScreenUniforms.toggle = true
    }


    if (mainScreenUniforms.progress.value < 0) {
        mainScreenUniforms.toggle = false
    }

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()