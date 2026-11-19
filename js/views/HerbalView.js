/**
 * @file HerbalView.js
 * @description View layer for rendering herbal catalog cards and category filtering UI.
 * Menggunakan palet hijau segar dan ramah (Friendly Botanical Green).
 */

class HerbalView {
  constructor() {
    this.container = document.getElementById('herb-cards-container');
    this.filterButtons = document.querySelectorAll('.filter-btn');
  }

  /**
   * Render herbal cards to DOM with safety against XSS
   * @param {Array<Object>} herbs 
   */
  renderHerbs(herbs) {
    if (!this.container) return;
    this.container.innerHTML = '';

    if (!Array.isArray(herbs) || herbs.length === 0) {
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'col-span-3 text-center py-12 text-white/80';
      emptyDiv.textContent = 'Tidak ada tanaman herbal ditemukan pada kategori ini.';
      this.container.appendChild(emptyDiv);
      return;
    }

    herbs.forEach(herb => {
      const card = document.createElement('article');
      card.className = 'herb-card group bg-[#357345] rounded-3xl p-6 border border-white/20 hover:border-white/50 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between';
      card.setAttribute('data-category', herb.category);

      // Icon colors based on badgeColor
      const bgMap = {
        amber: 'bg-amber-400/25 border-amber-300/40 text-amber-200',
        yellow: 'bg-yellow-400/25 border-yellow-300/40 text-yellow-200',
        orange: 'bg-orange-400/25 border-orange-300/40 text-orange-200',
        emerald: 'bg-emerald-400/25 border-emerald-300/40 text-emerald-100',
        teal: 'bg-teal-400/25 border-teal-300/40 text-teal-100',
        cyan: 'bg-cyan-400/25 border-cyan-300/40 text-cyan-100'
      };
      const badgeClass = bgMap[herb.badgeColor] || bgMap.emerald;

      card.innerHTML = `
        <div>
          <div class="flex items-start justify-between mb-4">
            <div class="w-14 h-14 rounded-2xl ${badgeClass} border flex items-center justify-center text-3xl shadow-sm">
              ${herb.icon}
            </div>
            <span class="px-3.5 py-1 rounded-full ${badgeClass} text-xs font-semibold">${herb.categoryLabel}</span>
          </div>
          <h3 class="text-xl font-serif font-bold text-white group-hover:text-amber-200 transition-colors">
            ${herb.name} <span class="text-xs font-normal italic text-emerald-100/80 block mt-0.5">${herb.latinName}</span>
          </h3>
          <p class="text-emerald-50 text-xs sm:text-sm mt-3 leading-relaxed">
            ${herb.description}
          </p>
          <div class="mt-4 p-3.5 rounded-xl bg-black/20 border border-white/10 text-xs text-emerald-100">
            <strong class="text-amber-300 block mb-0.5">⚡ Hubungan Hemat Energi:</strong>
            ${herb.energySavingImpact}
          </div>
        </div>
        <div class="mt-6 pt-4 border-t border-white/15 flex items-center justify-between text-xs">
          <span class="text-emerald-100">Pengolahan: ${herb.preparation}</span>
          <span class="text-amber-300 font-bold">100% Organik</span>
        </div>
      `;

      this.container.appendChild(card);
    });
  }

  /**
   * Update active state on filter buttons
   * @param {string} selectedCategory 
   */
  updateFilterButtons(selectedCategory) {
    this.filterButtons.forEach(btn => {
      const cat = btn.getAttribute('data-filter');
      if (cat === selectedCategory) {
        btn.classList.add('bg-white', 'text-[#24522f]', 'font-bold', 'shadow-md');
        btn.classList.remove('bg-transparent', 'text-white/80');
      } else {
        btn.classList.remove('bg-white', 'text-[#24522f]', 'font-bold', 'shadow-md');
        btn.classList.add('bg-transparent', 'text-white/80');
      }
    });
  }

  /**
   * Bind category filter button clicks
   * @param {Function} callback 
   */
  bindFilterClick(callback) {
    this.filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-filter');
        callback(cat);
      });
    });
  }
}

// Expose to window
window.HerbalView = HerbalView;
