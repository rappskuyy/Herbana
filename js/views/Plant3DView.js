/**
 * @file Plant3DView.js
 * @description View layer for rendering Real 3D Herbal Plant Asset using Three.js & WebGL.
 * 
 * Aturan perilaku & visual:
 * 1. Pencahayaan Studio Seimbang (Natural Botanical Lighting):
 *    - Tidak overexposed / silau berlebihan (intensitas cahaya disesuaikan agar pot putih dan daun tidak terbakar).
 *    - Material PBR dengan kelembutan matte alami (daun beludru herbal dan pot keramik matte).
 * 2. Perilaku Rotasi & Gerakan:
 *    - Saat TIDAK di-scroll: Model 3D tetap berputar pelan dan anggun secara kontinu (idle slow rotation).
 *    - Saat DI-SCROLL ke bawah: Model 3D ikut meluncur turun secara mulus (smooth translation Y)
 *      dan rotasi bertambah dinamis seiring scroll.
 * 3. Mendukung interaktivitas tombol varian (01, 02, 03) dan tombol panah < >.
 * 4. Fallback aman jika browser lokal membatasi CORS file://.
 */

class Plant3DView {
  constructor() {
    this.container = document.getElementById('herbal-3d-plant');
    this.plantShadow = document.getElementById('plant-shadow');
    this.variantButtons = document.querySelectorAll('.variant-btn');
    this.prevBtn = document.getElementById('hero-prev-btn');
    this.nextBtn = document.getElementById('hero-next-btn');

    // State 3D Three.js
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.currentModelGroup = null;
    this.modelsCache = {};
    this.isWebGLAvailable = false;
    this.idleRotation = 0; // Sudut rotasi pelan saat diam

    // Scroll state proxy untuk GSAP ScrollTrigger
    this.scrollState = {
      progress: 0,
      yOffset: 0
    };

    // Data varian tanaman
    this.currentVariantIndex = 0;
    this.variants = [
      {
        file: 'assets/plant-1.glb',
        name: 'Daun Mint Organik',
        tagline: 'Penyegar Pernapasan & Penurun Suhu Mikro',
        score: '3.36',
        desc: 'Sensasi mentol sejuk alami yang melegakan pikiran dan mereduksi ketergantungan pendingin ruangan buatan di kelas.'
      },
      {
        file: 'assets/plant-2.glb',
        name: 'Kunyit & Rimpang Herbal',
        tagline: 'Kurkumin Alami & Pelindung Lambung Siswa',
        score: '3.45',
        desc: 'Antioksidan alami terbaik untuk stamina dan pencernaan tanpa residu bahan kimia obat sintetik berjejak karbon.'
      },
      {
        file: 'assets/plant-3.glb',
        name: 'Tanaman Obat Keluarga (TOGA)',
        tagline: 'Imunitas Kuat & Nol Emisi Karbon Industri',
        score: '3.51',
        desc: 'Menghangatkan tubuh dan meningkatkan imunitas belajar, 100% dibudidayakan dari pekarangan hijau sekolah.'
      }
    ];
  }

  /**
   * Inisialisasi engine 3D dan scroll motion
   */
  init() {
    if (!this.container) return;

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Cek ketersediaan Three.js dan WebGL
    this.checkWebGLAndInit();
    this.bindVariantEvents();
  }

  /**
   * Menyiapkan Three.js scene atau fallback jika tidak didukung
   */
  checkWebGLAndInit() {
    if (typeof THREE !== 'undefined' && typeof THREE.GLTFLoader !== 'undefined') {
      try {
        this.initThreeScene();
        this.loadModel(this.variants[0].file, 0);
        this.initScrollMotion();
        this.isWebGLAvailable = true;
        return;
      } catch (err) {
        console.warn('[Plant3DView] Three.js WebGL error, menggunakan fallback realistik:', err);
      }
    }
    // Fallback jika Three.js belum siap atau file:// CORS memblokir
    this.initFallbackView();
  }

  /**
   * Menyiapkan Three.js WebGL Scene dengan Pencahayaan Alami (Tidak Terlalu Terang)
   */
  initThreeScene() {
    const width = this.container.clientWidth || 360;
    const height = this.container.clientHeight || 420;

    // 1. Scene
    this.scene = new THREE.Scene();

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 4.2);

    // 3. WebGL Renderer dengan PBR Tone Mapping & Exposure Lembut
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // Exposure diturunkan dari 1.15 ke 0.82 agar pot putih dan daun tidak overexposed/silau
    this.renderer.toneMappingExposure = 0.82;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Canvas styling
    this.renderer.domElement.className = 'w-full h-full object-contain cursor-grab active:cursor-grabbing';
    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // 4. Pencahayaan Studio Botani Lembut & Realistis (Intensitas Dikalibrasi Ulang)
    // Ambient light - cahaya lembut lingkungan botani (tidak silau)
    const ambientLight = new THREE.AmbientLight(0xdff0d8, 0.55);
    this.scene.add(ambientLight);

    // Key Light - Cahaya utama hangat terarah (diturunkan dari 2.2 ke 0.95)
    const keyLight = new THREE.DirectionalLight(0xfffaed, 0.95);
    keyLight.position.set(2.5, 3.5, 2.5);
    keyLight.castShadow = true;
    this.scene.add(keyLight);

    // Fill Light - Menyinari bayangan dengan rona hijau lembut (diturunkan dari 1.0 ke 0.35)
    const fillLight = new THREE.DirectionalLight(0xa5d6a7, 0.35);
    fillLight.position.set(-2.5, 1.5, 2.0);
    this.scene.add(fillLight);

    // Rim Light - Kilau tepian daun halus (diturunkan dari 1.2 ke 0.4)
    const rimLight = new THREE.DirectionalLight(0x81c784, 0.4);
    rimLight.position.set(0, 2.5, -3.0);
    this.scene.add(rimLight);

    // 5. Render Loop dengan Putaran Pelan Berkelanjutan Saat Tidak Di-scroll
    let lastTime = performance.now();

    const animate = (currentTime) => {
      requestAnimationFrame(animate);

      if (currentTime) {
        const delta = Math.min((currentTime - lastTime) * 0.001, 0.1);
        lastTime = currentTime;
        
        // Putar pelan secara konstan (~21 detik untuk 1 putaran penuh 360 derajat)
        this.idleRotation += delta * 0.30;
      }

      // Update posisi dan rotasi kombinasi (idle slow spin + scroll progress)
      this.updateModelTransform();

      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
    };
    requestAnimationFrame(animate);

    // Resize handler
    window.addEventListener('resize', () => {
      if (!this.container || !this.camera || !this.renderer) return;
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });
  }

  /**
   * Memuat model 3D GLTF/GLB asli
   * @param {string} modelPath 
   * @param {number} variantIndex 
   */
  loadModel(modelPath, variantIndex) {
    if (this.modelsCache[modelPath]) {
      this.displayModel(this.modelsCache[modelPath]);
      return;
    }

    const loader = new THREE.GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        const root = gltf.scene;

        // Optimasi material PBR agar tidak silau/plastik mengkilap
        root.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              // Hilangkan kilau plastik berlebihan
              child.material.roughness = 0.65; // Tekstur alami daun dan pot
              child.material.metalness = 0.0;  // Non-metalik
              child.material.envMapIntensity = 0.3; // Pantulan lingkungan lembut

              // Khusus pot/wadah putih: buat matte agar tidak terbakar putih polos
              const nameLower = (child.name || '').toLowerCase();
              if (nameLower.includes('pot') || nameLower.includes('vase') || nameLower.includes('bowl')) {
                child.material.roughness = 0.85; // Keramik matte
              }
            }
          }
        });

        // Hitung bounding box agar model otomatis terpusat sempurna
        const box = new THREE.Box3().setFromObject(root);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        root.position.x = -center.x;
        root.position.y = -center.y;
        root.position.z = -center.z;

        const maxDim = Math.max(size.x, size.y, size.z);
        const targetScale = 2.6 / (maxDim || 1);
        
        const wrapper = new THREE.Group();
        wrapper.add(root);
        wrapper.scale.set(targetScale, targetScale, targetScale);

        this.modelsCache[modelPath] = wrapper;
        this.displayModel(wrapper);
      },
      undefined,
      (err) => {
        console.warn(`[Plant3DView] Gagal memuat ${modelPath} (kemungkinan file:// CORS), beralih ke fallback:`, err);
        this.initFallbackView();
      }
    );
  }

  /**
   * Menampilkan model pada scene
   */
  displayModel(modelGroup) {
    if (this.currentModelGroup) {
      this.scene.remove(this.currentModelGroup);
    }
    this.currentModelGroup = modelGroup;
    this.scene.add(this.currentModelGroup);

    // Sesuaikan dengan posisi saat ini
    this.updateModelTransform();

    // Animasi muncul yang anggun
    gsap.fromTo(this.currentModelGroup.scale, 
      { x: 0.8, y: 0.8, z: 0.8 }, 
      { x: modelGroup.scale.x, y: modelGroup.scale.y, z: modelGroup.scale.z, duration: 0.5, ease: "power2.out" }
    );
  }

  /**
   * Update posisi dan rotasi 3D model:
   * Menggabungkan putaran pelan saat idle + putaran dan luncuran ke bawah saat di-scroll
   */
  updateModelTransform() {
    if (!this.currentModelGroup) return;

    // Rotasi 3D: putaran pelan berkelanjutan (idleRotation) + putaran tambahan saat scroll
    this.currentModelGroup.rotation.y = this.idleRotation + (this.scrollState.progress * Math.PI * 2);
    
    // Kemiringan halus saat di-scroll
    this.currentModelGroup.rotation.x = Math.sin(this.scrollState.progress * Math.PI) * 0.12;
    
    // Gerakan meluncur ke bawah (turun di sumbu Y) seiring scroll
    this.currentModelGroup.position.y = -(this.scrollState.progress * 1.4);
  }

  /**
   * GSAP ScrollTrigger: Menggerakkan model 3D meluncur turun saat di-scroll ke bawah
   */
  initScrollMotion() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.to(this.scrollState, {
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: 1.5, // Inersia sangat mulus (silky smooth)
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          this.scrollState.progress = self.progress;
          this.updateModelTransform();
        }
      },
      progress: 1,
      ease: "none"
    });

    // Animasikan bayangan lantai agar mengecil & meredup saat tanaman turun
    if (this.plantShadow) {
      gsap.to(this.plantShadow, {
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: 1.5
        },
        scale: 0.65,
        opacity: 0.2,
        y: 100,
        ease: "none"
      });
    }
  }

  /**
   * Fallback aman menggunakan gambar realistik jika WebGL/CORS lokal tidak mengizinkan fetch GLB
   */
  initFallbackView() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div id="fallback-plant-box" class="relative w-72 sm:w-84 h-96 flex items-center justify-center cursor-default">
        <img 
          src="assets/herbal-plant.png" 
          alt="Asset Tanaman Herbal 3D" 
          class="w-full h-full object-contain filter drop-shadow(0 25px 35px rgba(0,0,0,0.65)) pointer-events-none select-none transition-transform"
        />
      </div>
    `;

    const fallbackBox = document.getElementById('fallback-plant-box');
    if (fallbackBox && typeof gsap !== 'undefined') {
      // Putaran pelan berkelanjutan saat idle pada fallback
      gsap.to(fallbackBox, {
        rotationY: "+=360",
        duration: 20,
        repeat: -1,
        ease: "none"
      });

      if (typeof ScrollTrigger !== 'undefined') {
        gsap.to(fallbackBox, {
          scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: 1.5
          },
          y: 300,
          scale: 0.95,
          ease: "none"
        });
      }
    }
  }

  /**
   * Mengatur interaksi tombol pilihan varian tanaman dan tombol panah < >
   */
  bindVariantEvents() {
    this.variantButtons.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        this.selectVariant(idx);
      });
    });

    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        const nextIdx = (this.currentVariantIndex - 1 + this.variants.length) % this.variants.length;
        this.selectVariant(nextIdx);
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        const nextIdx = (this.currentVariantIndex + 1) % this.variants.length;
        this.selectVariant(nextIdx);
      });
    }
  }

  /**
   * Ganti varian tanaman 3D
   * @param {number} index 
   */
  selectVariant(index) {
    this.currentVariantIndex = index;
    const v = this.variants[index];

    // Update active button state
    this.variantButtons.forEach((btn, idx) => {
      if (idx === index) {
        btn.classList.add('bg-white', 'text-[#1c2815]', 'font-bold', 'scale-110');
        btn.classList.remove('bg-white/10', 'text-white/70');
      } else {
        btn.classList.remove('bg-white', 'text-[#1c2815]', 'font-bold', 'scale-110');
        btn.classList.add('bg-white/10', 'text-white/70');
      }
    });

    // Update teks info hero
    const tagEl = document.getElementById('hero-tagline');
    const descEl = document.getElementById('hero-desc');
    const scoreEl = document.getElementById('hero-score-val');

    if (tagEl) tagEl.textContent = v.tagline;
    if (descEl) descEl.textContent = v.desc;
    if (scoreEl) scoreEl.textContent = v.score;

    // Muat model 3D varian baru jika WebGL aktif
    if (this.isWebGLAvailable) {
      this.loadModel(v.file, index);
    }
  }
}

// Expose to window
window.Plant3DView = Plant3DView;
