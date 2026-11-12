/**
 * @file EnergyModel.js
 * @description Model layer for handling energy behavior survey data.
 * Adheres to MVC principles: data encapsulation, integrity verification, and aggregation.
 */

class EnergyModel {
  constructor() {
    this.data = null;
    this.isLoaded = false;
  }

  /**
   * Fetches data from JSON file with safe fallback to JavaScript object
   * @returns {Promise<boolean>} True if loaded successfully
   */
  async loadData() {
    try {
      const response = await fetch('data-perilaku-energi.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.data = await response.json();
      this.validateData();
      this.isLoaded = true;
      return true;
    } catch (error) {
      console.warn('[EnergyModel] Fetch failed or CORS restricted, falling back to local DATA_ENERGI:', error);
      if (typeof DATA_ENERGI !== 'undefined' && DATA_ENERGI !== null) {
        this.data = DATA_ENERGI;
        this.validateData();
        this.isLoaded = true;
        return true;
      }
      console.error('[EnergyModel] Could not load data from any source.');
      return false;
    }
  }

  /**
   * Validates structure and protects against malformed inputs
   */
  validateData() {
    if (!this.data || typeof this.data !== 'object') {
      throw new Error('[EnergyModel] Invalid dataset structure.');
    }
    if (!this.data.meta || !this.data.ringkasan || !Array.isArray(this.data.per_butir)) {
      throw new Error('[EnergyModel] Missing required schema properties in dataset.');
    }
  }

  /**
   * Get metadata information
   */
  getMeta() {
    return this.data ? this.data.meta : null;
  }

  /**
   * Get overall summary statistics
   */
  getSummary() {
    return this.data ? this.data.ringkasan : null;
  }

  /**
   * Get category distributions (Sangat Baik, Baik, Cukup, Kurang)
   */
  getCategories() {
    if (!this.data || !this.data.ringkasan) return { labels: [], values: [], percentages: [] };
    const categories = this.data.ringkasan.kategori;
    const percentages = this.data.ringkasan.kategori_persen;
    return {
      labels: Object.keys(categories),
      values: Object.values(categories),
      percentages: Object.values(percentages)
    };
  }

  /**
   * Get average scores and statistics per school major
   */
  getMajors() {
    if (!this.data || !Array.isArray(this.data.per_jurusan)) return [];
    return this.data.per_jurusan.map(item => ({
      code: String(item.kode || ''),
      name: String(item.nama || ''),
      respondents: Number(item.jumlah_responden || 0),
      averageScore: Number(item.rata_rata_skor || 0),
      averageTotal: Number(item.rata_rata_total || 0),
      categories: item.kategori || {},
      categoryPercentages: item.kategori_persen || {}
    }));
  }

  /**
   * Get 10 survey items / indicators (P01 to P10)
   */
  getIndicators() {
    if (!this.data || !Array.isArray(this.data.per_butir)) return [];
    return this.data.per_butir.map(item => ({
      id: Number(item.id || 0),
      code: String(item.kode || ''),
      label: String(item.label || ''),
      question: String(item.pertanyaan || ''),
      averageScore: Number(item.rata_rata || 0),
      percentFrequent: Number(item.persen_sering || 0),
      percentRare: Number(item.persen_jarang || 0)
    }));
  }

  /**
   * Get learning styles data (Visual, Auditori, Kinestetik)
   */
  getLearningStyles() {
    if (!this.data || !Array.isArray(this.data.per_gaya_belajar)) return [];
    return this.data.per_gaya_belajar.map(item => ({
      style: String(item.gaya_belajar || ''),
      respondents: Number(item.jumlah_responden || 0),
      averageScore: Number(item.rata_rata_skor || 0),
      categories: item.kategori || {},
      categoryPercentages: item.kategori_persen || {}
    }));
  }
}

// Expose to window for global access without module restrictions
window.EnergyModel = EnergyModel;

