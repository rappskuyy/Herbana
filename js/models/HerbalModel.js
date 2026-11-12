/**
 * @file HerbalModel.js
 * @description Model layer for managing herbal plant entities and educational data.
 */

class HerbalModel {
  constructor() {
    this.herbs = [
      {
        id: 'jahe-merah',
        name: 'Jahe Merah',
        latinName: 'Zingiber officinale var. rubrum',
        icon: '🫚',
        category: 'imun',
        categoryLabel: 'Imunitas & Hangat',
        badgeColor: 'amber',
        description: 'Mengandung senyawa aktif gingerol dan shogaol yang tinggi. Bermanfaat menghangatkan tubuh, meningkatkan daya tahan tubuh, meredakan batuk, serta mengatasi radang sendi alami.',
        preparation: 'Seduhan rimpang parut & madu',
        energySavingImpact: 'Pengolahan seduhan mandiri 100% bebas emisi pabrik kimiawi.',
        tags: ['Imunitas', 'Antioksidan', 'Rimpang']
      },
      {
        id: 'kunyit',
        name: 'Kunyit',
        latinName: 'Curcuma longa',
        icon: '🟡',
        category: 'pencernaan',
        categoryLabel: 'Pencernaan & Maag',
        badgeColor: 'yellow',
        description: 'Kaya akan kurkuminoid sebagai antioksidan dan antiradang terkuat. Sangat manjur menjaga kesehatan lambung, melapisi dinding usus, serta menetralkan asam lambung berlebih.',
        preparation: 'Parut & peras dengan air hangat suam-suam kuku',
        energySavingImpact: 'Budidaya mudah di pekarangan kelas, mereduksi jejak karbon logistik.',
        tags: ['Pencernaan', 'Kurkumin', 'Lambung']
      },
      {
        id: 'temulawak',
        name: 'Temulawak',
        latinName: 'Curcuma zanthorrhiza',
        icon: '🌾',
        category: 'imun',
        categoryLabel: 'Fungsi Hati & Stamina',
        badgeColor: 'orange',
        description: 'Herbal kebanggaan Indonesia dengan minyak atsiri dan kurkumin. Berkhasiat menjaga kesehatan hati (hepatoprotektor), menambah nafsu makan, dan memulihkan stamina kelelahan belajar.',
        preparation: 'Rebusan rimpang kering atau segar',
        energySavingImpact: 'Obat herbal alami minim konsumsi daya dibanding obat sintetik.',
        tags: ['Stamina', 'Hati', 'Nafsu Makan']
      },
      {
        id: 'daun-sirih',
        name: 'Daun Sirih Hijau',
        latinName: 'Piper betle',
        icon: '🍃',
        category: 'pencernaan',
        categoryLabel: 'Antiseptik Alami',
        badgeColor: 'emerald',
        description: 'Mengandung minyak atsiri kavikol yang bertindak sebagai antiseptik dan antibakteri tangguh. Digunakan untuk meredakan sariawan, radang gusi, serta pembersih luka higienis alami.',
        preparation: 'Rebusan daun sirih segar untuk kumur atau kompres',
        energySavingImpact: 'Tanaman merambat penyejuk dinding bangunan yang menurunkan suhu kelas.',
        tags: ['Antiseptik', 'Antibakteri', 'TOGA']
      },
      {
        id: 'pegagan',
        name: 'Pegagan / Antanan',
        latinName: 'Centella asiatica',
        icon: '☘️',
        category: 'relaksasi',
        categoryLabel: 'Konsentrasi & Otak',
        badgeColor: 'teal',
        description: 'Dikenal sebagai tanaman penutrisi otak (brain tonic). Membantu meningkatkan sirkulasi darah, mempertajam daya ingat, fokus belajar siswa, serta menurunkan tingkat stres.',
        preparation: 'Lalapan segar atau teh seduhan daun kering',
        energySavingImpact: 'Penghijauan ground-cover yang menjaga kelembapan tanah sekolah.',
        tags: ['Fokus', 'Daya Ingat', 'Relaksasi']
      },
      {
        id: 'daun-mint',
        name: 'Daun Mint / Peppermint',
        latinName: 'Mentha piperita',
        icon: '🌱',
        category: 'relaksasi',
        categoryLabel: 'Pelega Pernapasan',
        badgeColor: 'cyan',
        description: 'Kandungan mentol segarnya memberi sensasi dingin instan, melegakan saluran napas, mengurangi pusing, serta menyegarkan pikiran lelah saat beraktivitas di lingkungan sekolah.',
        preparation: 'Infused water dingin atau seduhan teh daun mint',
        energySavingImpact: 'Aroma mentol alami mengurangi ketergantungan semprotan kimia ruangan.',
        tags: ['Pernapasan', 'Penyegar', 'Anti Stres']
      }
    ];
  }

  /**
   * Get all herbal items
   * @returns {Array<Object>}
   */
  getAllHerbs() {
    return this.herbs;
  }

  /**
   * Get herbs filtered by category
   * @param {string} category 
   * @returns {Array<Object>}
   */
  getByCategory(category) {
    if (!category || category === 'all') {
      return this.herbs;
    }
    return this.herbs.filter(herb => herb.category === category);
  }

  /**
   * Get herbal item by its ID
   * @param {string} id 
   * @returns {Object|null}
   */
  getById(id) {
    return this.herbs.find(herb => herb.id === id) || null;
  }
}

// Expose to window
window.HerbalModel = HerbalModel;

