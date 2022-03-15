import './style.css'
import * as THREE from 'three'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { generateScene1, generateScene2 } from './scenes.js'
import halfwayFade from './shaders/halfwayFade.fs'
import crosswarp from './shaders/crosswarp.fs'
import morph from './shaders/morph.fs'
import colordistance from './shaders/colordistance.fs'
import cubeee from './shaders/cube.fs'
import wave from './shaders/wave.fs'

const cameraZ = 15

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
const textureLoader = new THREE.TextureLoader()
const canvas = document.querySelector('canvas.webgl')
const texture1 = new THREE.WebGLRenderTarget(sizes.width, sizes.height)
const texture2 = new THREE.WebGLRenderTarget(sizes.width, sizes.height)

// Debug
const gui = new dat.GUI()
const settings = {
    transition: 'halfwayFade',
    progress: 0.0,
}
gui.add(settings, 'transition', ['halfwayFade', 'crosswarp', 'morph', 'colordistance', 'cube', 'wave'])
    .onChange((option) => {

        switch (option) {
            case 'halfwayFade':
                mainScreen.material.fragmentShader = halfwayFade
                break;
            case 'crosswarp':
                mainScreen.material.fragmentShader = crosswarp
                break;
            case 'morph':
                mainScreen.material.fragmentShader = morph
                break;
            case 'colordistance':
                mainScreen.material.fragmentShader = colordistance
                break;
            case 'cube':
                mainScreen.material.fragmentShader = cubeee
                break;
            case 'wave':
                mainScreen.material.fragmentShader = wave
                break;
            default:
                break;
        }

        mainScreen.material.needsUpdate = true
    })

gui.add(settings, 'progress', 0, 1).step(0.01)

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
    },
    'strength': {
        value: 0.5
    },
    'power': {
        value: 5.0
    },
    'persp': {
        value: 0.7
    },
    'unzoom': {
        value: 0.3
    },
    'reflection': {
        value: 0.4
    },
    'floating': {
        value: 3.0
    },
    'intensity': {
        value: 100.0
    }
}

mainScreenUniforms['texture1'].value.wrapS = mainScreenUniforms['texture1'].value.wrapT = THREE.ClampToEdgeWrapping;
mainScreenUniforms['texture2'].value.wrapS = mainScreenUniforms['texture2'].value.wrapT = THREE.ClampToEdgeWrapping;

const mainScreenGeometry = new THREE.PlaneBufferGeometry(20, 20)
//  const mainScreenMaterial = new THREE.MeshBasicMaterial({
//      map: texture2.texture,
//      color: '#ffffff',
//      side: THREE.DoubleSide
//  })
const mainScreenMaterial = new THREE.ShaderMaterial({
    uniforms: mainScreenUniforms,
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: halfwayFade,
});
const mainScreen = new THREE.Mesh(mainScreenGeometry, mainScreenMaterial)
mainScreen.rotation.set(Math.PI * 1, Math.PI * 1, 0)
mainScreen.material.side = THREE.DoubleSide
mainScene.add(mainScreen)


/**
 * Scene 1
 */
const { scene1, camera1 } = generateScene1({ sizes, cameraZ })

/**
 * Scene 2
 */
const { scene2, camera2 } = generateScene2({ sizes, cameraZ })




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

    mainScreenUniforms.progress.value = settings.progress

    // // Transition between scene1 and scene2
    // if (mainScreenUniforms.toggle === false) {
    //     mainScreenUniforms.progress.value += deltaTime
    // } else {
    //     mainScreenUniforms.progress.value -= deltaTime
    // }

    // if (mainScreenUniforms.progress.value > 1) {
    //     mainScreenUniforms.toggle = true
    // }


    // if (mainScreenUniforms.progress.value < 0) {
    //     mainScreenUniforms.toggle = false
    // }

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()