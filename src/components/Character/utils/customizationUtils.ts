import * as THREE from "three";

/**
 * Creates a simple 3D cigarette mesh.
 */
export const createCigarette = () => {
  const cigaretteGroup = new THREE.Group();
  cigaretteGroup.name = "cigarette";

  // Cylinder geometry for the cigarette
  const filterGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.12, 8);
  const filterMaterial = new THREE.MeshStandardMaterial({ color: 0xe2a04a }); // Orange-brown filter
  const filterMesh = new THREE.Mesh(filterGeometry, filterMaterial);
  // Rotate to align with Z axis (forward)
  filterMesh.rotation.x = Math.PI / 2;
  filterMesh.position.z = -0.1; // Filter is at the back (mouth end)
  cigaretteGroup.add(filterMesh);

  const bodyGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.28, 8);
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff }); // White body
  const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
  // Rotate to align with Z axis (forward)
  bodyMesh.rotation.x = Math.PI / 2;
  bodyMesh.position.z = 0.1;
  cigaretteGroup.add(bodyMesh);

  // Ash tip (glowing red)
  const tipGeometry = new THREE.SphereGeometry(0.022, 8, 8);
  const tipMaterial = new THREE.MeshStandardMaterial({
    color: 0xff4400,
    emissive: 0xff0000,
    emissiveIntensity: 2,
  });
  const tipMesh = new THREE.Mesh(tipGeometry, tipMaterial);
  tipMesh.position.z = 0.245; // Tip is at the very front
  cigaretteGroup.add(tipMesh);


  return cigaretteGroup;
};

/**
 * Updates smoke particles animation.
 */
export const updateSmoke = (particles: THREE.Sprite[], delta: number) => {
  particles.forEach((particle) => {
    particle.position.y += delta * 0.4; // Rise slowly
    particle.position.x += (Math.random() - 0.5) * delta * 0.1; // Drift slightly
    particle.scale.multiplyScalar(1 + delta * 0.5); // Grow slightly
    const material = particle.material as THREE.SpriteMaterial;
    material.opacity -= delta * 0.6; // Fade out

    if (material.opacity <= 0) {
      // Reset particle to tip
      particle.position.set(0, 0, 0);
      particle.scale.set(0.02, 0.02, 1);
      material.opacity = 0.6;
    }
  });
};

/**
 * Applies Akatsuki styles to the character meshes.
 */
export const applyAkatsukiStyles = (character: THREE.Object3D, scene: THREE.Scene) => {
  const smokeParticles: THREE.Sprite[] = [];
  let cigarette: THREE.Group | null = null;
  let headBone: THREE.Object3D | null = null;

  const hairGroup = new THREE.Group();
  scene.add(hairGroup);

  const createHairWisp = (height = 0.5, radius = 0.04, bend = 0) => {
    const geometry = new THREE.CylinderGeometry(0, radius, height, 6);
    const material = new THREE.MeshStandardMaterial({
      color: 0x050505,
      roughness: 0.8,
      metalness: 0.0,
    });
    const wisp = new THREE.Mesh(geometry, material);
    geometry.translate(0, -height / 2, 0);
    wisp.rotation.x = bend;
    return wisp;
  };

  const addWisp = (pos: [number, number, number], rot: [number, number, number], scale = 1.0, bend = 0) => {
    const wisp = createHairWisp(0.6 * scale, 0.035, bend);
    wisp.position.set(pos[0], pos[1], pos[2]);
    wisp.rotation.set(rot[0], rot[1], rot[2]);
    hairGroup.add(wisp);
  };

  // BANGS
  addWisp([0.08, 0.1, 0.15], [0, 0, 0.4], 0.8);
  addWisp([-0.08, 0.1, 0.15], [0, 0, -0.4], 0.8);
  addWisp([0.03, 0.12, 0.18], [0.2, 0, 0.1], 0.9);
  addWisp([-0.03, 0.12, 0.18], [0.2, 0, -0.1], 0.9);
  addWisp([0, 0.13, 0.20], [0.3, 0, 0], 1.0);

  // SIDES
  for (let i = 0; i < 6; i++) {
    const zOffset = 0.08 - i * 0.05;
    addWisp([-0.18, 0.05, zOffset], [0.2, 0.1, -0.3], 2.0 + i * 0.2, 0.2);
    addWisp([0.18, 0.05, zOffset], [0.2, -0.1, 0.3], 2.0 + i * 0.2, 0.2);
  }

  // NAPE
  for (let i = 0; i < 9; i++) {
    const angle = (i / 8) * Math.PI - Math.PI / 2;
    addWisp([Math.sin(angle) * 0.16, -0.05, -0.18], [-0.6, angle, 0], 2.2, 0.3);
  }

  character.traverse((child: any) => {
    if (child.isMesh) {
      const name = child.name;
      const nameLower = name.toLowerCase();
      
      if (
        nameLower.includes("shirt") ||
        nameLower.includes("body") ||
        nameLower.includes("pant") ||
        nameLower.includes("shoe") ||
        nameLower.includes("sole") ||
        nameLower.includes("neck") ||
        nameLower.includes("hair")
      ) {
        if (nameLower.includes("hair")) {
          child.scale.set(11.0, 9.5, 11.0); 
          
          if (child.material && (child.material as any).color) {
            (child.material as any).color.set(0x050505);
            child.material.roughness = 1.0;
          }
          child.frustumCulled = false;
        } else {
          child.material = new THREE.MeshStandardMaterial({
            color: 0x050505,
            roughness: 1.0,
            metalness: 0.0,
          });
        }
      }
    }

    if (child.isBone) {
      const bName = child.name.toLowerCase();
      if (!headBone && (bName.includes("head") || bName.includes("spine006"))) {
        headBone = child;
      }
    }
  });

  // Adjust eyebrows for a subtle cool smirk
  const eyebrow = character.getObjectByName("Eyebrow");
  if (eyebrow) {
    eyebrow.rotation.z = -0.1;
  }

  if (headBone) {
    cigarette = createCigarette();
    
    // Add to SCENE instead of bone to ensure world-space tracking works predictably
    scene.add(cigarette);

    // Create smoke particles
    const smokeMaterial = new THREE.SpriteMaterial({
      color: 0xaaaaaa,
      transparent: true,
      opacity: 0.5,
    });

    // Smoke container should be at the NEW Z-axis tip
    const smokeGroup = new THREE.Group();
    smokeGroup.name = "smoke_container";
    smokeGroup.position.set(0, 0, 0.25); 
    cigarette.add(smokeGroup);

    for (let i = 0; i < 5; i++) {
       const p = new THREE.Sprite(smokeMaterial.clone());
       p.scale.set(0.02, 0.02, 1);
       p.material.opacity = Math.random() * 0.5;
       p.position.y = Math.random() * 0.2;
       smokeGroup.add(p);
       smokeParticles.push(p);
    }
  }


  // Helper vectors for matrix math
  const worldPos = new THREE.Vector3();
  const worldQuat = new THREE.Quaternion();
  const worldScale = new THREE.Vector3();

  // Local offset for the mouth (Relative to head bone)
  // I've adjusted these to point IT FRONT and sit near the mouth corner
  const localOffset = new THREE.Vector3(0.41, 0.58, 1.15);
  const localRotation = new THREE.Euler(0, 0, 0); 

  return { 
    updateSmoke: (delta: number) => {
      // 1. Update Smoke Animation
      updateSmoke(smokeParticles, delta);

      // 2. Synchronize Cigarette with Head Bone World Transform
      if (cigarette && headBone) {
        // Force bone to update its current matrix based on animations
        headBone.updateMatrixWorld(true);
        
        // Get the bone's world position, rotation, and scale
        headBone.matrixWorld.decompose(worldPos, worldQuat, worldScale);
        
        // Apply the bone's world transform to the cigarette
        cigarette.position.copy(worldPos);
        cigarette.quaternion.copy(worldQuat);
        
        // Add the local offset in the head's local coordinate space
        // This ensures the cigarette sits in the mouth relative to the rotating head
        cigarette.translateX(localOffset.x);
        cigarette.translateY(localOffset.y);
        cigarette.translateZ(localOffset.z);
        
        // Apply local rotation for a cool angle
        cigarette.rotateX(localRotation.x);
        cigarette.rotateY(localRotation.y);
        cigarette.rotateZ(localRotation.z);
      }
    } 
  };
};
