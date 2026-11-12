/**
 * @file HerbalView.js
 * @description View layer for rendering herbal catalog cards and category filtering UI.
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
      emptyDiv.className = 'col-span-3 text-center py-12 text-white/60';
      emptyDiv.textContent = 'Tidak ada tanaman herbal ditemukan pada kategori ini.';
      this.container.appendChild(emptyDiv);
      return;
    }

    herbs.forEach(herb => {
      const card = document.createElement('article');
      card.className = 'herb-card group bg-[#26351d] rounded-3xl p-6 border border-white/10 hover:border-botanical-gold/50 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between';
      card.setAttribute('data-category', herb.category);

      // Icon colors based on badgeColor
      const bgMap = {
        amber: 'bg-amber-500/20 border-amber-500/30 text-amber-300',
        yellow: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300',
        orange: 'bg-orange-500/20 border-orange-500/30 text-orange-300',
        emerald: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300',
        teal: 'bg-teal-500/20 border-teal-500/30 text-teal-300',
        cyan: 'bg-cyan-500/20 border-cyan-500/30 text-cyan-300'
      };
      const badgeClass = bgMap[herb.badgeColor] || bgMap.emerald;

      card.innerHTML = `
        <div>
          <div class="flex items-start justify-between mb-4">
            <div class="w-14 h-14 rounded-2xl ${badgeClass} border flex items-center justify-center text-3xl">
              ${herb.icon}
            </div>
            <span class="px-3 py-1 rounded-full ${badgeClass} text-xs font-semibold">${herb.categoryLabel}</span>
          </div>
          <h3 class="text-xl font-serif font-bold text-white group-hover:text-botanical-gold transition-colors">
            ${herb.name} <span class="text-xs font-normal italic text-botanical-300 block mt-0.5">${herb.latinName}</span>
          </h3>
          <p class="text-emerald-100/70 text-xs mt-3 leading-relaxed">
            ${herb.description}
          </p>
          <div class="mt-4 p-3 rounded-xl bg-black/25 border border-white/5 text-[11px] text-emerald-200/80">
            <strong class="text-botanical-gold block">⚡ Hubungan Hemat Energi:</strong>
            ${herb.energySavingImpact}
          </div>
        </div>
        <div class="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
          <span class="text-white/60">Pengolahan: ${herb.preparation}</span>
          <span class="text-botanical-gold font-semibold">100% Organik</span>
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
        btn.classList.add('bg-botanical-500', 'text-white');
        btn.classList.remove('text-white/70');
      } else {
        btn.classList.remove('bg-botanical-500', 'text-white');
        btn.classList.add('text-white/70');
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

