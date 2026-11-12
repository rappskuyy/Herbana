/**
 * @file LandingController.js
 * @description Controller layer for index.html (Landing Page).
 * Coordinates HerbalModel, EnergyModel, Plant3DView, HerbalView, and ChartView.
 */

class LandingController {
  constructor() {
    this.herbalModel = new HerbalModel();
    this.energyModel = new EnergyModel();
    this.plant3DView = new Plant3DView();
    this.herbalView = new HerbalView();
    this.chartView = new ChartView();
  }

  /**
   * Application bootstrap
   */
  async init() {
    this.initMobileNav();
    this.initHero3D();
    this.initHerbalCatalog();
    await this.initDataPreview();
  }

  /**
   * Setup mobile navigation dropdown
   */
  initMobileNav() {
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileBtn && mobileMenu) {
      mobileBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
    }
  }

  /**
   * Setup 3D plant animations & GSAP ScrollTrigger
   */
  initHero3D() {
    this.plant3DView.init();
  }

  /**
   * Render initial herbal catalog and bind category filter events
   */
  initHerbalCatalog() {
    const allHerbs = this.herbalModel.getAllHerbs();
    this.herbalView.renderHerbs(allHerbs);

    this.herbalView.bindFilterClick((category) => {
      this.handleCategoryFilter(category);
    });
  }

  /**
   * Handle user category filter selection
   * @param {string} category 
   */
  handleCategoryFilter(category) {
    const filtered = this.herbalModel.getByCategory(category);
    this.herbalView.renderHerbs(filtered);
    this.herbalView.updateFilterButtons(category);
  }

  /**
   * Load JSON data and render preview charts
   */
  async initDataPreview() {
    const isSuccess = await this.energyModel.loadData();
    if (!isSuccess) {
      console.warn('[LandingController] Could not load energy dataset.');
      return;
    }

    const meta = this.energyModel.getMeta();
    const categories = this.energyModel.getCategories();
    const majors = this.energyModel.getMajors();

    // Render Preview Donut Chart
    this.chartView.renderCategoryChart(
      'previewKategoriChart',
      categories,
      meta ? meta.jumlah_responden : 636
    );

    // Render Preview Majors Bar Chart
    this.chartView.renderMajorsChart(
      'previewJurusanChart',
      majors
    );
  }
}

// Instantiate and start on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  const landingApp = new LandingController();
  landingApp.init();
});

