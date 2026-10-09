# STA PL 3MW dashboard

Live: https://chaleamchonppp-tech.github.io/PEA-GMD-N2_STA-PL-3MW/

GitHub Pages: main branch, root. English default; Thai language switch. Fixed viewport and paginated tables. Latest data means the latest measurement, not deployment time.

Daily import accepts complete SolarEdge power CSV, 96 unique quarter-hour samples per day with kW/MW headers. Imports replace matching hourly dates in local browser storage only. Download the updated hourly CSV from Files & updates. Monthly energy totals remain from the source monthly report.

To update the public September dataset, replace matching files under raw/Solar (3MW-prefixed daily files), run `python analyze.py` then `python redesign_dashboard.py`, and commit raw files, data and index.html to main. Requires Python and pandas. analyze.py currently validates the September 2026 period; a different month needs the corresponding monthly reports and a period configuration change. Uploading raw CSV alone does not update the published dashboard.
