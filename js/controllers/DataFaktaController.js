/**
 * @file DataFaktaController.js
 * @description Controller layer for data-fakta.html (Comprehensive Analysis Page).
 * Coordinates EnergyModel and ChartView to present 4 interactive graphs and 10 survey items.
 */

class DataFaktaController {
  constructor() {
    this.energyModel = new EnergyModel();
    this.chartView = new ChartView();
  }

  /**
   * Application bootstrap
   */
  async init() {
    const isLoaded = await this.energyModel.loadData();
    if (!isLoaded) {
      alert('Gagal memuat data kuesioner. Pastikan file data-perilaku-energi.json atau data-perilaku-energi.js berada pada folder projek.');
      return;
    }

    this.renderKPIs();
    this.renderAllCharts();
    this.renderIndicatorsTable();
  }

  /**
   * Populates top summary KPI cards
   */
  renderKPIs() {
    const meta = this.energyModel.getMeta();
    const summary = this.energyModel.getSummary();

    if (meta) {
      const respEl = document.getElementById('kpi-responden');
      if (respEl) respEl.textContent = meta.jumlah_responden;
    }

    if (summary) {
      const skorEl = document.getElementById('kpi-skor');
      const katEl = document.getElementById('kpi-kategori');
      const seringEl = document.getElementById('kpi-sering');

      if (skorEl) skorEl.textContent = summary.rata_rata_skor.toFixed(2);
      if (katEl) katEl.textContent = (summary.kategori_persen['Sangat Baik'] || 59.4) + '%';
      if (seringEl) seringEl.textContent = (summary.persen_sering_rata_rata || 90.8).toFixed(1) + '%';
    }
  }

  /**
   * Render all 4 charts via ChartView
   */
  renderAllCharts() {
    const meta = this.energyModel.getMeta();
    const categories = this.energyModel.getCategories();
    const majors = this.energyModel.getMajors();
    const indicators = this.energyModel.getIndicators();
    const learningStyles = this.energyModel.getLearningStyles();

    const total = meta ? meta.jumlah_responden : 636;

    // 1. Kategori Donut Chart
    this.chartView.renderCategoryChart('chartKategori', categories, total);

    // 2. Jurusan Bar Chart
    this.chartView.renderMajorsChart('chartJurusan', majors);

    // 3. 10 Indikator Horizontal Bar Chart
    this.chartView.renderIndicatorsChart('chartButir', indicators);

    // 4. Gaya Belajar Bar Chart
    this.chartView.renderLearningStylesChart('chartGayaBelajar', learningStyles);
  }

  /**
   * Render indicators detailed data table
   */
  renderIndicatorsTable() {
    const indicators = this.energyModel.getIndicators();
    this.chartView.renderIndicatorsTable('tabel-butir-body', indicators);
  }
}

// Instantiate and start on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  const dataFaktaApp = new DataFaktaController();
  dataFaktaApp.init();
});

