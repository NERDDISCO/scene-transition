import * as THREE from 'three'

export function generateScene1({
    sizes,
    cameraZ
}) {
    const scene1 = new THREE.Scene()
    // scene1.background = new THREE.Color(0xffffff);
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
    cube.receiveShadow = true
    cube.castShadow = true
    scene1.add(cube)

    const clones = []
    const size = 5
    const length = Math.pow(size, 3)
    const elements = Array(length)

    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            for (let z = 0; z < size; z++) {
                elements.push({
                    x: size / 2 - x,
                    y: size / 2 - y,
                    z: size / 2 - z
                })
            }
        }
    }

    elements.map(({ x, y, z}, i) => {
        const clone = cube.clone()
        const scale = .15 + Math.random()
        clone.position.set(x, y, z)
        clone.scale.set(scale, scale, scale)
        clone.rotation.y = Math.random() * Math.PI * 2 * i / length
        clones.push(clone)
        scene1.add(clone)
    })
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight1.castShadow = true

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight2.castShadow = true
    directionalLight2.position.set(0, 0, -10)
    directionalLight2.lookAt(cube.position)

    const ambientLight1 = new THREE.AmbientLight(0xffffff, .20)
    scene1.add(ambientLight1)
    scene1.add(directionalLight1)
    scene1.add(directionalLight2)

    return {
        scene1,
        camera1
    }
}

export function generateScene2({
    sizes,
    cameraZ
}) {
    const scene2 = new THREE.Scene()
    // scene2.background = new THREE.Color(0xffffff);
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

    const clones = []
    const size = 5
    const length = Math.pow(size, 3)
    const elements = Array(length)

    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            for (let z = 0; z < size; z++) {
                elements.push({
                    x: size / 2 - x * 2.0,
                    y: size / 2 - y * 2.0,
                    z: size / 2 - z * 2.0
                })
            }
        }
    }

    elements.map(({ x, y, z}, i) => {
        const clone = icosahedron.clone()
        const cloneMaterial = icosahedron.material.clone()

        const scale = .15 + Math.random()
        // Set random color
        const color = new THREE.Color(0xffffff)
        color.setHSL(Math.random(), Math.random(), Math.random())
        cloneMaterial.color = color
        clone.material = cloneMaterial

        clone.position.set(x, y, z)
        clone.scale.set(scale, scale, scale)
        clone.rotation.y = Math.random() * Math.PI * 2 * i / length
        clones.push(clone)
        scene2.add(clone)
    })

    const ambientLight2 = new THREE.AmbientLight(0xffffff, 0.2)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
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

    return {
        scene2,
        camera2
    }
}