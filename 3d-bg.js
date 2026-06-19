// Cinematic Particle Field using Three.js

const canvas = document.getElementById('webgl-canvas');
const scene = new THREE.Scene();
// Deep fog to fade out particles in the distance
scene.fog = new THREE.FogExp2(0x050505, 0.0015); 

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 40;

const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Create Particles
const geometry = new THREE.BufferGeometry();
const particlesCount = 3500;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 180;
}
geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// Setup Premium Material
const material = new THREE.PointsMaterial({
    size: 0.12,
    color: 0xffffff,
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(geometry, material);
scene.add(particlesMesh);

// Add a very subtle, large, rotating 3D wireframe geometric shape in the center
const geoGeometry = new THREE.IcosahedronGeometry(15, 1);
const geoMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
    transparent: true,
    opacity: 0.04
});
const geoMesh = new THREE.Mesh(geoGeometry, geoMaterial);
scene.add(geoMesh);

// Mouse interaction for Parallax
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) - 0.5;
    mouseY = (event.clientY / window.innerHeight) - 0.5;
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Slow cinematic drift
    particlesMesh.rotation.y = elapsedTime * 0.03;
    particlesMesh.rotation.x = elapsedTime * 0.015;

    // Geometric shape rotation
    geoMesh.rotation.y = elapsedTime * 0.08;
    geoMesh.rotation.x = elapsedTime * 0.05;

    // Smooth mouse parallax
    camera.position.x += (mouseX * 8 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 8 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

animate();

// Resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
