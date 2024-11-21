import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import ProgressBar from '../loaders/ProgressBar';
import CrossIcon from '../icons/cross-icon/CrossIcon';
import { useUiStore } from '@/core/stores/ui-store';
import { useModelStore } from '@/core/stores/model-store';
import { RIGHTBAR_STAGE_MAP } from '@/strings';
import ARView from './ARView';

export default function ModelPreview() {
  const [showARView, setShowARView] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const mountRef = useRef<HTMLDivElement>(null);

  const { setRightbarStage } = useUiStore();
  const { clearModelUrl, modelUrl } = useModelStore();

  const handleClose = () => {
    setRightbarStage(RIGHTBAR_STAGE_MAP, clearModelUrl);
  };

  const handleShowARView = () => {
    setShowARView(true);
  };

  useEffect(() => {
    if (showARView) return;

    const width = mountRef.current?.clientWidth ?? 0;
    const height = mountRef.current?.clientHeight ?? 0;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x202020);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    mountRef.current?.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
    directionalLight.position.set(0, 10, 0);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;

    // Model loader
    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf) => {
        scene.add(gltf.scene);
        setLoadingProgress(100);

        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        // Center the camera on the model
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        let cameraZ = maxDim / 2 / Math.tan(fov / 2);

        cameraZ *= 5;
        camera.position.set(center.x, center.y, cameraZ);
        camera.far = cameraZ * 3;
        camera.updateProjectionMatrix();

        controls.target.copy(center);
        controls.maxDistance = cameraZ * 3;
        controls.update();
      },
      (xhr) => {
        if (xhr.lengthComputable) {
          setLoadingProgress((xhr.loaded / xhr.total) * 100);
        }
      },
      (error) => {
        console.error('Error loading model:', error);
      },
    );

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize handling
    const resizeObserver = new ResizeObserver(() => {
      const newWidth = mountRef.current?.clientWidth ?? 0;
      const newHeight = mountRef.current?.clientHeight ?? 0;
      renderer.setSize(newWidth, newHeight);
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
    });
    if (mountRef.current) resizeObserver.observe(mountRef.current);

    // Cleanup
    return () => {
      resizeObserver.disconnect();
      mountRef.current?.removeChild(renderer.domElement);
      handleClose();
    };
  }, [showARView]);

  if (showARView) {
    return <ARView />;
  }

  return (
    <div className="h-full w-full relative">
      {loadingProgress < 100 && (
        <div className="absolute w-full h-full flex items-center justify-center bg-gray-900">
          <ProgressBar progress={loadingProgress} />
        </div>
      )}
      <div className="absolute top-8 left-8">
        <CrossIcon
          onClick={handleClose}
          size={50}
          className="text-white cursor-pointer"
        />
        <button
          onClick={handleShowARView}
          className="text-white bg-blue-500 rounded p-2 hover:bg-blue-600"
        >
          Open AR View
        </button>
      </div>
      <div className="h-full w-full" ref={mountRef} />
    </div>
  );
}
