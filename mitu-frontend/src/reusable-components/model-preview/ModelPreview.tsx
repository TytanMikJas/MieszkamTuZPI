import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import ProgressBar from '../loaders/ProgressBar';
import CrossIcon from '../icons/cross-icon/CrossIcon';
import { useUiStore } from '@/core/stores/ui-store';
import { useModelStore } from '@/core/stores/model-store';
import { RIGHTBAR_STAGE_MAP } from '@/strings';

export default function ModelPreview() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loadingProgress, setLoadingProgress] = useState(0); // Initialize as 0%
  const containerRef = useRef<HTMLDivElement>(null);

  const { setRightbarStage } = useUiStore();
  const { clearModelUrl, modelUrl } = useModelStore();

  const handleClose = () => {
    setRightbarStage(RIGHTBAR_STAGE_MAP, clearModelUrl);
  };

  useEffect(() => {
    const width = mountRef.current?.clientWidth ?? 0;
    const height = mountRef.current?.clientHeight ?? 0;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x202020); // Dark gray background

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true; // Enable shadow mapping

    const ambientLight = new THREE.AmbientLight(0x404040, 5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
    directionalLight.position.set(0, 10, 0); // Adjust as needed
    directionalLight.castShadow = true; // Enable casting shadows

    // Improve shadow quality
    directionalLight.shadow.mapSize.width = 512; // Default is 512, increase for higher quality
    directionalLight.shadow.mapSize.height = 512; // Default is 512, increase for higher quality
    directionalLight.shadow.camera.near = 0.5; // Default is 0.5
    directionalLight.shadow.camera.far = 500; // Adjust based on the scene size

    // Adjust the shadow camera frustum to tightly fit your scene for better shadow resolution
    directionalLight.shadow.camera.left = -50; // Adjust based on your scene's size
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;

    scene.add(directionalLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false; // Disable panning

    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      function (object: any) {
        scene.add(object.scene);
        setLoadingProgress(100);
        object.scene.traverse(function (child: any) {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        // Calculate the bounding box to get the model size
        const box = new THREE.Box3().setFromObject(object.scene);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        // Calculate the max dimension of the model
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        let cameraZ = maxDim / 2 / Math.tan(fov / 2);

        // Position the camera to fit the model
        cameraZ *= 5; // Increase distance to ensure the model is fully visible
        camera.position.z = center.z + cameraZ;
        camera.position.x = center.x;
        camera.position.y = center.y;

        camera.far = cameraZ * 3;
        camera.updateProjectionMatrix();

        // Adjust controls to look at the model center
        controls.target.copy(center);
        controls.update();

        // Optionally, set limits to how far or close the camera can get
        controls.maxDistance = cameraZ * 3;
      },
      function (xhr) {
        if (xhr.lengthComputable) {
          const percentComplete = (xhr.loaded / xhr.total) * 100;
          setLoadingProgress(percentComplete); // Update with the actual percentage
        }
      },
      function (error) {
        console.error(error);
      },
    );

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    mountRef.current?.appendChild(renderer.domElement);
    animate();

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    });

    if (mountRef.current) {
      resizeObserver.observe(mountRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      mountRef.current?.removeChild(renderer.domElement);
      handleClose();
    };
  }, []);

  return (
    <div ref={containerRef} className="h-full w-full  relative">
      {loadingProgress < 100 && (
        <div className="absolute w-full h-full flex items-center justify-center bg-gray-900">
          <div className="w-64">
            <ProgressBar progress={loadingProgress} />
          </div>
        </div>
      )}
      <div className="absolute l-8 t-8">
        <CrossIcon
          onClick={handleClose}
          size={50}
          className={'text-white cursor-pointer'}
        />
      </div>
      <div className="h-full w-full " ref={mountRef} />
    </div>
  );
}
