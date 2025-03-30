import React, { useEffect, useRef } from "react";
import { QrCode, Smartphone, Clock, Utensils, ShieldCheck, Zap, Coffee, ChevronDown, X, Check, Users } from "lucide-react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, TextPlugin);

export default function LandingPage() {
  const mountRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    // Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Set clear color with 0 opacity
    
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Create particle system
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000; // Reduced particle count
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 15; // Reduced spread
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.003,
      color: '#4f46e5',
      transparent: true,
      opacity: 0.4, // Reduced opacity
      blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Create floating food items
    const foodItems = [];
    const foodGeometries = [
      new THREE.TorusGeometry(0.5, 0.2, 16, 32), // Reduced size
      new THREE.ConeGeometry(0.4, 1, 32),
      new THREE.BoxGeometry(0.75, 0.75, 0.75),
      new THREE.SphereGeometry(0.5, 32, 32)
    ];

    const foodMaterials = [
      new THREE.MeshPhysicalMaterial({ 
        color: 0xff9999,
        metalness: 0.1,
        roughness: 0.6,
        clearcoat: 0.5
      }),
      new THREE.MeshPhysicalMaterial({ 
        color: 0x99ff99,
        metalness: 0.1,
        roughness: 0.6,
        clearcoat: 0.5
      }),
      new THREE.MeshPhysicalMaterial({ 
        color: 0x9999ff,
        metalness: 0.1,
        roughness: 0.6,
        clearcoat: 0.5
      }),
      new THREE.MeshPhysicalMaterial({ 
        color: 0xffff99,
        metalness: 0.1,
        roughness: 0.6,
        clearcoat: 0.5
      })
    ];

    for (let i = 0; i < 20; i++) {
      const randomGeo = foodGeometries[Math.floor(Math.random() * foodGeometries.length)];
      const randomMat = foodMaterials[Math.floor(Math.random() * foodMaterials.length)];
      const food = new THREE.Mesh(randomGeo, randomMat);
      
      food.position.x = (Math.random() - 0.5) * 20;
      food.position.y = (Math.random() - 0.5) * 20;
      food.position.z = (Math.random() - 0.5) * 20 - 10;
      
      food.rotation.x = Math.random() * Math.PI;
      food.rotation.y = Math.random() * Math.PI;
      
      food.scale.setScalar(0.3);
      
      scene.add(food);
      foodItems.push({
        mesh: food,
        speed: Math.random() * 0.02 + 0.01,
        rotationSpeed: Math.random() * 0.02 - 0.01
      });
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x4f46e5, 2, 20);
    pointLight.position.set(-5, 5, 5);
    scene.add(pointLight);

    camera.position.z = 5;

    // Animation
    let time = 0;
    const animate = () => {
      time += 0.005; // Reduced animation speed
      requestAnimationFrame(animate);
      
      // Animate particles with reduced speed
      particlesMesh.rotation.y += 0.0002;
      particlesMesh.rotation.x += 0.0002;
      
      // Animate food items
      foodItems.forEach((item) => {
        item.mesh.rotation.x += item.rotationSpeed;
        item.mesh.rotation.y += item.rotationSpeed;
        item.mesh.position.y = Math.sin(time * item.speed * 5) * 0.5 + item.mesh.position.y;
      });

      // Animate point light
      pointLight.position.x = Math.sin(time) * 5;
      pointLight.position.z = Math.cos(time) * 5;
      
      renderer.render(scene, camera);
    };
    animate();

    // Enhanced Scroll animations
    gsap.from(".hero-content > *", {
      y: 100,
      opacity: 0,
      duration: 1.5,
      stagger: 0.2,
      ease: "power4.out"
    });

    // Parallax effect for sections
    const sections = gsap.utils.toArray('.animate-section');
    sections.forEach((section, i) => {
      gsap.to(section, {
        backgroundPosition: `50% ${innerHeight / 2}px`,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "top 20%",
          scrub: 1,
          toggleActions: "play none none reverse"
        },
        y: 100,
        opacity: 0
      });
    });

    // Text reveal animation
    gsap.utils.toArray('.reveal-text').forEach(text => {
      gsap.from(text, {
        scrollTrigger: {
          trigger: text,
          start: "top 80%",
          toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });
    });

    // Floating animation for cards
    gsap.utils.toArray('.floating-card').forEach((card, i) => {
      gsap.to(card, {
        y: "20px",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: i * 0.2
      });
    });

    // Scroll animations
    gsap.utils.toArray('.fade-in').forEach((elem) => {
      gsap.from(elem, {
        scrollTrigger: {
          trigger: elem,
          start: "top 80%",
          end: "top 20%",
          toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });
    });

    // Number counter animation
    const numbers = gsap.utils.toArray('.counter');
    numbers.forEach(number => {
      const target = number.getAttribute('data-target');
      gsap.to(number, {
        scrollTrigger: {
          trigger: number,
          start: "top 80%",
        },
        innerHTML: target,
        duration: 2,
        snap: { innerHTML: 1 },
        ease: "power1.inOut"
      });
    });

    // Comparison table animation
    gsap.from(".comparison-item", {
      scrollTrigger: {
        trigger: ".comparison-section",
        start: "top 80%",
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out"
    });

    // Stats counter animation
    const stats = gsap.utils.toArray('.stat-number');
    stats.forEach(stat => {
      const target = stat.getAttribute('data-value');
      gsap.to(stat, {
        scrollTrigger: {
          trigger: stat,
          start: "top 80%",
        },
        innerHTML: target,
        duration: 2,
        snap: { innerHTML: 1 },
        ease: "power1.out"
      });
    });

    // Features animation
    gsap.from(".feature-card", {
      scrollTrigger: {
        trigger: ".features-section",
        start: "top 80%",
      },
      y: 100,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "back.out(1.2)"
    });

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          object.material.dispose();
        }
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div 
        ref={mountRef} 
        className="fixed inset-0 pointer-events-none" 
        style={{ 
          zIndex: 0,
          opacity: 0.8, // Reduced opacity
          mixBlendMode: 'screen' 
        }} 
      />
      
      <div ref={contentRef} className="relative z-10 w-full">
        {/* Hero Section */}
        <div className="relative min-h-screen flex items-center">
          <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:20px_20px]" />
          <div className="container mx-auto px-4 relative z-10 pt-20 pb-32">
            <div className="max-w-5xl mx-auto text-center">
              <h1 className="hero-title text-6xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                Trải nghiệm đặt món 
                <span className="block mt-2">thông minh & tiện lợi</span>
              </h1>
              <p className="hero-description text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
                Quét mã QR - Đặt món - Thanh toán. Tận hưởng bữa ăn ngon mà không cần chờ đợi.
              </p>
              <div className="hero-buttons flex flex-col sm:flex-row gap-6 justify-center">
                <button className="group px-8 py-4 bg-primary text-white rounded-full font-semibold text-lg hover:shadow-xl hover:shadow-primary/20 transition-all duration-500 transform hover:scale-105 flex items-center justify-center gap-2">
                  <QrCode className="w-6 h-6" />
                  Đặt món ngay
                </button>
                <button className="group px-8 py-4 border-2 border-primary text-primary rounded-full font-semibold text-lg hover:shadow-xl hover:shadow-primary/20 transition-all duration-500 transform hover:scale-105 hover:bg-primary hover:text-white flex items-center justify-center gap-2">
                  <Coffee className="w-6 h-6" />
                  Xem thực đơn
                </button>
              </div>
            </div>
          </div>
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-8 h-8 text-primary" />
          </div>
        </div>

        {/* Stats Section */}
        <div className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-8 bg-gray-50 rounded-3xl transform hover:scale-105 transition-all duration-500">
                <div className="stat-number text-5xl font-bold text-primary mb-2" data-value="60">0</div>
                <p className="text-gray-600">% Nhanh hơn khi đặt món</p>
              </div>
              <div className="p-8 bg-gray-50 rounded-3xl transform hover:scale-105 transition-all duration-500">
                <div className="stat-number text-5xl font-bold text-primary mb-2" data-value="98">0</div>
                <p className="text-gray-600">% Khách hàng hài lòng</p>
                </div>
              <div className="p-8 bg-gray-50 rounded-3xl transform hover:scale-105 transition-all duration-500">
                <div className="stat-number text-5xl font-bold text-primary mb-2" data-value="100">0</div>
                <p className="text-gray-600">% Chính xác trong đặt món</p>
              </div>
            </div>
          </div>
              </div>

        {/* Comparison Section */}
        <div className="comparison-section py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
              So sánh với cách truyền thống
            </h2>
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-3xl shadow-lg">
                <div className="text-2xl font-bold text-red-500 mb-6 flex items-center gap-2">
                  <X className="w-8 h-8" />
                  Cách truyền thống
                </div>
                <ul className="space-y-4">
                  <li className="comparison-item flex items-center gap-2 text-gray-600">
                    <X className="w-5 h-5 text-red-500" />
                    Thời gian chờ nhân viên lâu
                  </li>
                  <li className="comparison-item flex items-center gap-2 text-gray-600">
                    <X className="w-5 h-5 text-red-500" />
                    Dễ nhầm lẫn khi ghi chép
                  </li>
                  <li className="comparison-item flex items-center gap-2 text-gray-600">
                    <X className="w-5 h-5 text-red-500" />
                    Khó theo dõi trạng thái đơn hàng
                  </li>
                  <li className="comparison-item flex items-center gap-2 text-gray-600">
                    <X className="w-5 h-5 text-red-500" />
                    Thanh toán thủ công, mất thời gian
                  </li>
                </ul>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-lg">
                <div className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                  <QrCode className="w-8 h-8" />
                  Đặt món qua QR
                </div>
                <ul className="space-y-4">
                  <li className="comparison-item flex items-center gap-2 text-gray-600">
                    <Check className="w-5 h-5 text-primary" />
                    Đặt món ngay lập tức, không cần chờ
                  </li>
                  <li className="comparison-item flex items-center gap-2 text-gray-600">
                    <Check className="w-5 h-5 text-primary" />
                    Chính xác 100% với hệ thống tự động
                  </li>
                  <li className="comparison-item flex items-center gap-2 text-gray-600">
                    <Check className="w-5 h-5 text-primary" />
                    Theo dõi đơn hàng thời gian thực
                  </li>
                  <li className="comparison-item flex items-center gap-2 text-gray-600">
                    <Check className="w-5 h-5 text-primary" />
                    Thanh toán nhanh chóng qua điện thoại
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="features-section relative py-32 bg-white overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(79,70,229,0.05),transparent),radial-gradient(circle_at_70%_60%,rgba(147,51,234,0.05),transparent)]" />
          
          <div className="container mx-auto px-4 relative">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold inline-block bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Đặt món dễ dàng
            </h2>
              <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
                Tận hưởng bữa ăn ngon với trải nghiệm đặt món hiện đại
              </p>
                  </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Feature 1 */}
              <div className="feature-card group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-3xl transform transition-transform group-hover:scale-105 duration-500" />
                <div className="relative p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center mb-6 transform transition-transform group-hover:rotate-6 duration-500">
                    <QrCode className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Đặt món thông minh
                  </h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-primary" />
                      Quét mã QR để xem menu
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-primary" />
                      Đặt món không cần chờ
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-primary" />
                      Tùy chỉnh món theo ý thích
                    </li>
                  </ul>
                </div>
                  </div>

              {/* Feature 2 */}
              <div className="feature-card group relative mt-8 md:mt-16">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-3xl transform transition-transform group-hover:scale-105 duration-500" />
                <div className="relative p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center mb-6 transform transition-transform group-hover:rotate-6 duration-500">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Tiết kiệm thời gian
                  </h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-primary" />
                      Không cần chờ gọi nhân viên
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-primary" />
                      Theo dõi trạng thái món ăn
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-primary" />
                      Thanh toán nhanh chóng
                    </li>
                  </ul>
                </div>
                  </div>

              {/* Feature 3 */}
              <div className="feature-card group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-3xl transform transition-transform group-hover:scale-105 duration-500" />
                <div className="relative p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center mb-6 transform transition-transform group-hover:rotate-6 duration-500">
                    <ShieldCheck className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    An toàn & Tiện lợi
                  </h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-primary" />
                      Thanh toán đa dạng
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-primary" />
                      Bảo mật thông tin
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-primary" />
                      Lưu món ăn yêu thích
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Additional Features */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <div className="feature-mini-card p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Smartphone className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold text-gray-900">Dễ dàng sử dụng</h4>
                <p className="text-sm text-gray-600 mt-2">Giao diện thân thiện</p>
              </div>

              <div className="feature-mini-card p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Coffee className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold text-gray-900">Menu đa dạng</h4>
                <p className="text-sm text-gray-600 mt-2">Nhiều lựa chọn hấp dẫn</p>
              </div>

              <div className="feature-mini-card p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold text-gray-900">Đặt món nhanh</h4>
                <p className="text-sm text-gray-600 mt-2">Chỉ với vài chạm</p>
              </div>

              <div className="feature-mini-card p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold text-gray-900">Đặt theo nhóm</h4>
                <p className="text-sm text-gray-600 mt-2">Dễ dàng chia sẻ</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative py-20 bg-gradient-to-r from-primary to-purple-600 overflow-visible">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                Sẵn sàng trải nghiệm?
              </h2>
              <p className="text-xl mb-12">
                Quét mã QR và bắt đầu đặt món ngay hôm nay
              </p>
              <button className="px-12 py-4 bg-white text-primary rounded-full font-semibold text-lg hover:shadow-xl hover:shadow-black/20 transition-all duration-500 transform hover:scale-105 flex items-center gap-2 mx-auto">
                <QrCode className="w-6 h-6" />
                Đặt món ngay
              </button>
            </div>
          </div>
        </div>

        {/* Footer spacing to ensure content is visible */}
        <div className="h-20 bg-gradient-to-r from-primary to-purple-600"></div>
      </div>
    </div>
  );
}
