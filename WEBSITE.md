# STA PL 3MW dashboard

Live: https://chaleamchonppp-tech.github.io/PEA-GMD-N2_STA-PL-3MW/

The modern dashboard uses `dashboard.css` and `dashboard.js` alongside the generated `index.html`. Keep these files, `dashboard-tron.css`, and `assets/fonts` when publishing. Run `python redesign_dashboard.py` to regenerate the page; this preserves the modern presentation. The interface defaults to Thai and remembers the visitor's language choice.

The Tron-inspired navy/cyan/purple interface has five main sections: overview, daily energy, inverters, insights, and data updates. The overview combines the earlier four energy cards and chart/balance layout with VOLTA-style horizontal navigation and a purple site summary. Graphs provide pointer, touch, and keyboard value inspection. The daily power-flow chart stacks solar supply/export above zero and solar/grid consumption below zero; the negative sign is a display convention, not a negative meter reading. Detailed tables are available in expandable sections. The overview and energy rings use the September 2026 meter-report totals; hourly charts remain estimates from four quarter-hour samples. PEA purple (#74045F), gold (#C7911B), and white follow the supplied identity book. Logos retain their original proportions on white backgrounds.

GitHub Pages: main branch, root. English default; Thai language switch. Fixed viewport and paginated tables. Latest data means the latest measurement, not deployment time.

Daily import accepts complete SolarEdge power CSV, 96 unique quarter-hour samples per day with kW/MW headers. Imports replace matching hourly dates in local browser storage only. Download the updated hourly CSV from Files & updates. Monthly energy totals remain from the source monthly report.

To update the public September dataset, replace matching files under raw/Solar (3MW-prefixed daily files), run `python analyze.py` then `python redesign_dashboard.py`, and commit raw files, data and index.html to main. Requires Python and pandas. analyze.py currently validates the September 2026 period; a different month needs the corresponding monthly reports and a period configuration change. Uploading raw CSV alone does not update the published dashboard.
