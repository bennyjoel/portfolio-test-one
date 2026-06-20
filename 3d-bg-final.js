// Interactive 3D Vortex / Galaxy using Three.js

const canvas = document.getElementById('webgl-canvas');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 50;
camera.position.y = 10;
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// Clear transparent to ensure it lives as a pure background
renderer.setClearColor(0x020202, 1);

// ===== PARTICLE GALAXY =====
const parameters = {
    count: 25000,
    size: 0.15,
    radius: 45,
    branches: 3,
    spin: 1.5,
    randomness: 0.8,
    randomnessPower: 3,
    insideColor: '#ff6030', // Warm core
    outsideColor: '#00d4ff' // Cool edge
};

let geometry = null;
let material = null;
let points = null;

const generateGalaxy = () => {
    geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(parameters.count * 3);
    const colors = new Float32Array(parameters.count * 3);

    const colorInside = new THREE.Color(parameters.insideColor);
    const colorOutside = new THREE.Color(parameters.outsideColor);

    for(let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;

        const radius = Math.random() * parameters.radius;
        const spinAngle = radius * parameters.spin;
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;

        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;

        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        positions[i3 + 1] = randomY;
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, radius / parameters.radius);

        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        transparent: true,
        opacity: 0.85
    });

    points = new THREE.Points(geometry, material);
    scene.add(points);
};

generateGalaxy();

// ===== MOUSE & SCROLL INTERACTION =====
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
let scrollY = window.scrollY;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
});

window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
});

// ===== ANIMATION LOOP =====
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    if(points) {
        // Constant gentle spin
        points.rotation.y = elapsedTime * 0.05;
    }

    targetX = mouseX * 0.05;
    targetY = mouseY * 0.05;
    
    // Smooth camera transition (Mouse parallax + Scroll depth)
    // As the user scrolls down, the camera slowly sinks into the galaxy
    const scrollDepth = scrollY * 0.015;
    
    camera.position.x += (targetX - camera.position.x) * 0.02;
    camera.position.y += (-targetY - camera.position.y - scrollDepth + 10) * 0.02; 
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

animate();

// ===== RESIZE =====
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
