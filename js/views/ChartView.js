/**
 * @file ChartView.js
 * @description View layer for rendering Chart.js visualizations and data tables.
 */

class ChartView {
  constructor() {
    this.theme = {
      sangatBaik: '#5b8a4e',
      baik: '#e5a83b',
      cukup: '#de5427',
      kurang: '#a93226',
      bgDark: '#1e2b17',
      textMuted: '#a3c299',
      textLight: '#f4f7f2',
      gridLine: 'rgba(255, 255, 255, 0.08)'
    };
  }

  /**
   * Render Category Distribution Doughnut Chart
   * @param {string} canvasId 
   * @param {Object} categoriesData 
   * @param {number} totalRespondents 
   */
  renderCategoryChart(canvasId, categoriesData, totalRespondents) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof Chart === 'undefined') return;

    const ctx = canvas.getContext('2d');
    return new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: categoriesData.labels,
        datasets: [{
          data: categoriesData.values,
          backgroundColor: [
            this.theme.sangatBaik,
            this.theme.baik,
            this.theme.cukup,
            this.theme.kurang
          ],
          borderColor: this.theme.bgDark,
          borderWidth: 3,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: this.theme.textLight,
              font: { family: 'Plus Jakarta Sans', size: 12 },
              padding: 14
            }
          },
          tooltip: {
            callbacks: {
              label: function(ctx) {
                const val = ctx.raw;
                const pct = totalRespondents ? ((val / totalRespondents) * 100).toFixed(1) : 0;
                return ` ${ctx.label}: ${val} siswa (${pct}%)`;
              }
            }
          }
        },
        cutout: '66%'
      }
    });
  }

  /**
   * Render Majors Average Score Bar Chart
   * @param {string} canvasId 
   * @param {Array<Object>} majors 
   */
  renderMajorsChart(canvasId, majors) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof Chart === 'undefined') return;

    const ctx = canvas.getContext('2d');
    const labels = majors.map(m => m.code);
    const dataValues = majors.map(m => m.averageScore);
    const colors = [
      '#e5a83b', // PMN
      '#5b8a4e', // HTL
      '#7ea772', // KLN
      '#34572b', // TJKT
      '#a3c299', // DKV
      '#c8dac1', // MPLB
      '#de5427'  // PPLG
    ];

    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Rata-rata Skor (1-4)',
          data: dataValues,
          backgroundColor: colors,
          borderRadius: 8,
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            min: 2.8,
            max: 3.8,
            ticks: { color: this.theme.textMuted },
            grid: { color: this.theme.gridLine }
          },
          x: {
            ticks: { color: this.theme.textLight, font: { weight: 'bold' } },
            grid: { display: false }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: function(items) {
                const idx = items[0].dataIndex;
                return `${majors[idx].name} (${majors[idx].code})`;
              },
              label: function(ctx) {
                const idx = ctx.dataIndex;
                return ` Skor Rata-rata: ${majors[idx].averageScore} (${majors[idx].respondents} siswa)`;
              }
            }
          }
        }
      }
    });
  }

  /**
   * Render 10 Indicators Horizontal Bar Chart
   * @param {string} canvasId 
   * @param {Array<Object>} indicators 
   */
  renderIndicatorsChart(canvasId, indicators) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof Chart === 'undefined') return;

    const ctx = canvas.getContext('2d');
    const labels = indicators.map(i => i.code);
    const values = indicators.map(i => i.averageScore);

    const backgroundColors = indicators.map(i => {
      if (i.averageScore >= 3.45) return this.theme.sangatBaik;
      if (i.averageScore <= 3.25) return this.theme.cukup;
      return this.theme.baik;
    });

    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Skor Rata-rata (1-4)',
          data: values,
          backgroundColor: backgroundColors,
          borderRadius: 6
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            min: 2.5,
            max: 4.0,
            ticks: { color: this.theme.textMuted },
            grid: { color: this.theme.gridLine }
          },
          y: {
            ticks: { color: this.theme.textLight, font: { weight: 'bold' } },
            grid: { display: false }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: function(items) {
                const idx = items[0].dataIndex;
                return `${indicators[idx].code}: ${indicators[idx].label}`;
              },
              label: function(ctx) {
                const idx = ctx.dataIndex;
                const item = indicators[idx];
                return [
                  ` Skor Rata-rata: ${item.averageScore} / 4.00`,
                  ` Persen Rutin Sering: ${item.percentFrequent}%`
                ];
              }
            }
          }
        }
      }
    });
  }

  /**
   * Render Learning Styles Grouped Bar Chart
   * @param {string} canvasId 
   * @param {Array<Object>} learningStyles 
   */
  renderLearningStylesChart(canvasId, learningStyles) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof Chart === 'undefined') return;

    const ctx = canvas.getContext('2d');
    const labels = learningStyles.map(ls => `${ls.style} (${ls.respondents} Siswa)`);
    const values = learningStyles.map(ls => ls.averageScore);

    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Rerata Skor Hemat Energi',
          data: values,
          backgroundColor: ['#7ea772', '#e5a83b', '#5b8a4e'],
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            min: 3.0,
            max: 3.6,
            ticks: { color: this.theme.textMuted },
            grid: { color: this.theme.gridLine }
          },
          x: {
            ticks: { color: this.theme.textLight, font: { weight: '600' } },
            grid: { display: false }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(ctx) {
                const idx = ctx.dataIndex;
                const ls = learningStyles[idx];
                return ` Rerata: ${ls.averageScore} | Kategori Sangat Baik: ${ls.categoryPercentages['Sangat Baik']}%`;
              }
            }
          }
        }
      }
    });
  }

  /**
   * Safely populate indicators table in data-fakta.html
   * @param {string} tbodyId 
   * @param {Array<Object>} indicators 
   */
  renderIndicatorsTable(tbodyId, indicators) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody || !Array.isArray(indicators)) return;

    tbody.innerHTML = '';
    indicators.forEach(item => {
      const tr = document.createElement('tr');
      tr.className = 'hover:bg-white/5 transition-colors';

      let statusBadge = '';
      if (item.averageScore >= 3.45) {
        statusBadge = '<span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">Paling Konsisten</span>';
      } else if (item.averageScore <= 3.25) {
        statusBadge = '<span class="px-2.5 py-0.5 rounded-full bg-[#de5427]/20 text-[#de5427] font-bold text-[10px]">Perlu Ditingkatkan</span>';
      } else {
        statusBadge = '<span class="px-2.5 py-0.5 rounded-full bg-botanical-gold/20 text-botanical-gold font-bold text-[10px]">Baik</span>';
      }

      tr.innerHTML = `
        <td class="py-3 px-4 font-mono font-bold text-botanical-gold">${item.code}</td>
        <td class="py-3 px-4">
          <span class="font-semibold block text-white">${item.label}</span>
          <span class="text-white/60 text-xs">${item.question}</span>
        </td>
        <td class="py-3 px-4 text-center font-bold text-botanical-200">${item.averageScore.toFixed(2)}</td>
        <td class="py-3 px-4 text-center text-emerald-300">${item.percentFrequent}%</td>
        <td class="py-3 px-4 text-center">${statusBadge}</td>
      `;
      tbody.appendChild(tr);
    });
  }
}

// Expose to window
window.ChartView = ChartView;

