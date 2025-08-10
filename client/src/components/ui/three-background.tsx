import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
}

export function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number>();

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Particle system
    const particleCount = 200;
    const particles: Particle[] = [];
    
    // Create particle geometry and material
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      const particle: Particle = {
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        ),
        life: Math.random(),
        maxLife: Math.random() * 3 + 1,
      };
      
      particles.push(particle);
      
      // Set initial positions
      positions[i * 3] = particle.position.x;
      positions[i * 3 + 1] = particle.position.y;
      positions[i * 3 + 2] = particle.position.z;
      
      // Set colors (cosmic theme)
      const colorChoice = Math.random();
      if (colorChoice < 0.4) {
        // Cyan
        colors[i * 3] = 0;
        colors[i * 3 + 1] = 0.96;
        colors[i * 3 + 2] = 1;
      } else if (colorChoice < 0.7) {
        // Purple
        colors[i * 3] = 0.75;
        colors[i * 3 + 1] = 0.27;
        colors[i * 3 + 2] = 0.93;
      } else {
        // Pink
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0.08;
        colors[i * 3 + 2] = 0.58;
      }
      
      // Set sizes
      sizes[i] = Math.random() * 3 + 1;
    }

    particlesRef.current = particles;

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Particle material with shader
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        mousePosition: { value: new THREE.Vector2(0, 0) },
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vAlpha;
        uniform float time;
        uniform vec2 mousePosition;
        
        void main() {
          vColor = color;
          
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          
          // Mouse interaction
          vec2 mouseInfluence = (mousePosition - position.xy) * 0.1;
          mvPosition.xy += mouseInfluence * sin(time + position.z);
          
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
          
          // Pulsing effect
          vAlpha = 0.3 + 0.7 * sin(time * 2.0 + position.x + position.y);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          
          if (dist > 0.5) discard;
          
          float alpha = (1.0 - dist * 2.0) * vAlpha;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    // Add point lights for cosmic effect
    const light1 = new THREE.PointLight(0x00f5ff, 1, 100);
    light1.position.set(10, 10, 10);
    scene.add(light1);

    const light2 = new THREE.PointLight(0xd946ef, 0.8, 100);
    light2.position.set(-10, -10, 5);
    scene.add(light2);

    // Mouse interaction
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      if (material.uniforms) {
        material.uniforms.mousePosition.value.set(
          mouseRef.current.x * 10,
          mouseRef.current.y * 10
        );
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    let time = 0;
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      time += 0.01;

      // Update particle positions
      const positions = geometry.attributes.position.array as Float32Array;
      
      particles.forEach((particle, i) => {
        // Update particle life
        particle.life += 0.01;
        if (particle.life > particle.maxLife) {
          particle.life = 0;
          particle.position.set(
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20
          );
        }

        // Move particles
        particle.position.add(particle.velocity);
        
        // Mouse attraction effect
        const mouseInfluence = new THREE.Vector3(
          mouseRef.current.x * 10 - particle.position.x,
          mouseRef.current.y * 10 - particle.position.y,
          0
        ).multiplyScalar(0.001);
        
        particle.position.add(mouseInfluence);

        // Update positions in buffer
        positions[i * 3] = particle.position.x;
        positions[i * 3 + 1] = particle.position.y;
        positions[i * 3 + 2] = particle.position.z;
      });

      geometry.attributes.position.needsUpdate = true;

      // Update shader uniforms
      if (material.uniforms) {
        material.uniforms.time.value = time;
      }

      // Rotate the particle system slowly
      particleSystem.rotation.y += 0.001;
      particleSystem.rotation.x += 0.0005;

      // Light animation
      light1.position.x = Math.sin(time) * 10;
      light1.position.y = Math.cos(time) * 10;
      
      light2.position.x = Math.cos(time * 1.5) * 8;
      light2.position.z = Math.sin(time * 1.5) * 8;

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose of Three.js objects
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ 
        background: 'linear-gradient(135deg, #0B0B1F 0%, #1A1A3A 50%, #2D1B69 100%)' 
      }}
    />
  );
}
