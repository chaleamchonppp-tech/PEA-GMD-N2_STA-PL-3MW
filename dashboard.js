/* Presentation uses the original meter totals and validated hourly dataset. */
lang=localStorage.getItem('sta-language')||'th';
const previousRender=render;
function energyRing(percent,color,label){
 const value=Math.max(0,Math.min(100,Number(percent)||0));
 return `<div class="donut"><svg viewBox="0 0 120 120" role="img" aria-label="${escape(label)} ${n(value,2)}%"><circle cx="60" cy="60" r="49" fill="none" stroke="#32313f" stroke-width="10"/><circle cx="60" cy="60" r="49" fill="none" stroke="${color}" stroke-width="10" stroke-linecap="round" pathLength="100" stroke-dasharray="${value} 100"/></svg><div class="donut-value"><b>${n(value,2)}%</b><small>${escape(label)}</small></div></div>`;
}
function factoryScene(){
 return `<svg class="factory" viewBox="0 0 620 245" role="img" aria-label="${t('Solar factory energy flow: solar to factory, grid to factory, and recorded grid export','แผนภาพโรงงาน: โซลาร์จ่ายเข้าโรงงาน การไฟฟ้าจ่ายเข้าโรงงาน และพลังงานส่งออกที่บันทึกได้')}">
 <defs><linearGradient id="roof" x2="0" y2="1"><stop stop-color="#4d5366"/><stop offset="1" stop-color="#272c3c"/></linearGradient><linearGradient id="wall" x2="1" y2="1"><stop stop-color="#3c3b4a"/><stop offset="1" stop-color="#22232f"/></linearGradient><linearGradient id="pv" x2="0" y2="1"><stop stop-color="#466778"/><stop offset="1" stop-color="#253747"/></linearGradient><radialGradient id="ground"><stop stop-color="#ae779d" stop-opacity=".15"/><stop offset="1" stop-color="#ae779d" stop-opacity="0"/></radialGradient></defs>
 <ellipse cx="290" cy="205" rx="260" ry="37" fill="url(#ground)"/>
 <path d="M79 100L291 61L424 123L212 172Z" fill="url(#roof)" stroke="#656173"/>
 <path d="M79 100L212 172V223L79 151Z" fill="#252633" stroke="#4b4557"/><path d="M212 172L424 123V174L212 223Z" fill="url(#wall)" stroke="#4b4557"/>
 <g stroke="#5b5363" opacity=".5">${Array.from({length:10},(_,i)=>`<path d="M${228+i*19} ${168-i*4.4}v50"/>`).join('')}</g>
 <g fill="url(#pv)" stroke="#8ca6b4" stroke-width=".6">${Array.from({length:4},(_,r)=>Array.from({length:7},(_,c)=>{let x=100+c*27+r*19,y=101-c*5+r*10;return `<path d="M${x} ${y}l24 -4.5l16 8l-24 4.5Z"/>`}).join('')).join('')}</g>
 <path d="M285 187l58 -14v31l-58 14Z" fill="#c7911b" opacity=".7"/><path d="M346 172l30 -7v31l-30 7Z" fill="#21202a" stroke="#706278"/>
 <path d="M418 169h65v-36h35v36h22" fill="none" stroke="#c7911b" stroke-width="3" stroke-linecap="round"/>
 <path d="M418 169h65v-36h35v36h22" fill="none" stroke="#ffe197" stroke-width="4" stroke-dasharray="2 18" class="flow-dot"/>
 <g fill="none" stroke="#9c93ac" stroke-width="2"><path d="M551 53l-21 92h42Z M539 105h25 M536 119h31 M544 80h14 M538 92h26 M537 71h28 M532 60h38 M530 52h42 M529 145l22 -65l21 65 M513 53h76 M520 71h62"/></g>
 <path d="M189 139L213 154L260 143V183" fill="none" stroke="#45d6ac" stroke-width="3" stroke-linecap="round"/><path d="M189 139L213 154L260 143V183" fill="none" stroke="#a7ffe0" stroke-width="4" stroke-dasharray="2 18" class="flow-dot"/>
 <circle cx="260" cy="183" r="5" fill="#45d6ac"/>
 <g font-family="Noto,Arial" font-size="11"><text x="83" y="53" fill="#72e4be">${t('SOLAR GENERATION','พลังงานแสงอาทิตย์')}</text><path d="M166 60v26" stroke="#72e4be" opacity=".5"/><text x="285" y="240" fill="#e6dcea">${t('STA PL · FACTORY','STA PL · โรงงาน')}</text><text x="507" y="27" fill="#edc260">${t('GRID','การไฟฟ้า')}</text></g></svg>`;
}
function overviewHero(){let s=D.summary;
 return `<section class="hero"><div class="hero-scene"><div class="eyebrow">STA PL 3MW / ENERGY MONITOR</div><div class="hero-title">${t('Energy working together','พลังงานที่เชื่อมถึงกัน')}</div><span class="period-badge">${t('September 2026 · Historical report','กันยายน 2569 · รายงานย้อนหลัง')}</span>${factoryScene()}</div><div class="hero-metrics"><div class="hero-metric"><small>${t('Solar generation','พลังงานผลิตจากโซลาร์')}</small><strong class="green">${n(s['Inverters Produced_kWh']/1000,2)}</strong><em>MWh</em><p>${t('Monthly meter report','จากรายงานพลังงานรายเดือน')}</p></div><div class="hero-metric"><small>${t('Factory consumption','การใช้ไฟฟ้าของโรงงาน')}</small><strong>${n(s['Consumed Energy_kWh']/1000,2)}</strong><em>MWh</em><p>${t('Solar + grid supply','โซลาร์ + พลังงานจากการไฟฟ้า')}</p></div><div class="hero-metric"><small>${t('Installed DC capacity','กำลังติดตั้งฝั่ง DC')}</small><strong class="gold">2,526.48</strong><em>kWp</em><p>${t('24 inverters · Main site','24 อินเวอร์เตอร์ · ไซต์หลัก')}</p></div></div></section>`;
}
function balancePanel(){let s=D.summary;
 return `<section class="panel"><div class="section-heading"><h2>${t('Where the energy goes','พลังงานถูกใช้ที่ไหน')}</h2><small>${t('Monthly meter totals','ยอดพลังงานรายเดือน')}</small></div><div class="balance-grid"><div class="balance-card">${energyRing(s.self_consumption_pct,'#45d6ac',t('Self-consumed','ใช้เอง'))}<div class="balance-copy"><h3>${t('Solar generation','พลังงานโซลาร์ที่ผลิต')}</h3><div class="balance-row"><span>${t('Used in factory','ใช้ภายในโรงงาน')}</span><b class="green">${n(s.self_consumed_solar_kWh/1000,2)} MWh</b></div><div class="balance-row"><span>${t('Exported to grid','ส่งออกเข้าการไฟฟ้า')}</span><b class="gold">${n(s['Exported Energy_kWh'],3)} kWh</b></div></div></div><div class="balance-card">${energyRing(s.solar_share_pct,'#c7911b',t('Solar share','สัดส่วนโซลาร์'))}<div class="balance-copy"><h3>${t('Factory consumption','พลังงานที่โรงงานใช้')}</h3><div class="balance-row"><span>${t('From solar','จากโซลาร์')}</span><b class="green">${n(s.self_consumed_solar_kWh/1000,2)} MWh</b></div><div class="balance-row"><span>${t('From grid','จากการไฟฟ้า')}</span><b class="gold">${n(s['Imported Energy_kWh']/1000,2)} MWh</b></div></div></div></div><div class="balance-note">${t('Recorded export is 0.2664% of solar production. Review Zero Export settings and meter logs before drawing conclusions.','พบพลังงานส่งออก 0.2664% ของยอดผลิต ควรตรวจการตั้งค่า Zero Export และบันทึกมิเตอร์ก่อนสรุปสาเหตุ')}</div></section>`;
}
const oldChart=chart;
chart=function(rows,keys,colors){
 colors=colors.map(c=>({'#209d6d':'#45d6ac','#74045f':'#d98eca','#c7911b':'#edc260'}[c]||c));
 if(rows.length<=6)return oldChart(rows,keys,colors).replaceAll('#e9edf4','#393543').replaceAll('#78869a','#b1acbf');
 const w=innerWidth<=760?550:900,h=320,right=w-18,plot=right-62,max=Math.max(1,...rows.flatMap(r=>keys.map(k=>Number(r[k])||0)))*1.12;
 const x=i=>62+i*plot/Math.max(1,rows.length-1),y=v=>270-(Number(v)||0)*230/max;
 return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${t('Energy trend chart','กราฟแนวโน้มพลังงาน')}"><defs>${colors.map((c,i)=>`<linearGradient id="area-${tab}-${i}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${c}" stop-opacity=".25"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></linearGradient>`).join('')}</defs>${[0,.25,.5,.75,1].map(f=>`<line x1="62" y1="${270-f*230}" x2="${right}" y2="${270-f*230}" stroke="#393543" stroke-dasharray="3 6"/><text x="2" y="${275-f*230}" fill="#b1acbf" font-size="12">${n(max*f)}</text>`).join('')}${keys.map((k,j)=>`<path d="M62 270 ${rows.map((r,i)=>`L${x(i)} ${y(r[k])}`).join(' ')} L${right} 270Z" fill="url(#area-${tab}-${j})"/><polyline fill="none" stroke="${colors[j]}" stroke-width="2.5" stroke-linejoin="round" points="${rows.map((r,i)=>`${x(i)},${y(r[k])}`).join(' ')}"/>${rows.map((r,i)=>`<circle cx="${x(i)}" cy="${y(r[k])}" r="5" fill="${colors[j]}" fill-opacity="0"><title>${escape(r.date||r.timestamp||r.label||'')} · ${escape(k)}: ${n(r[k],2)}</title></circle>`).join('')}`).join('')}${rows.map((r,i)=>i%Math.max(1,Math.ceil(rows.length/7))===0||i===rows.length-1?`<text x="${x(i)}" y="298" text-anchor="middle" fill="#b1acbf" font-size="12">${escape(r.label||(r.timestamp?r.timestamp.slice(11,16):r.date?.slice(8)||''))}</text>`:'').join('')}</svg>`;
};
render=function(){
 previousRender();document.documentElement.lang=lang;
 $('date').hidden=tab!==1;
 if(tab===0){
  $('view').insertAdjacentHTML('afterbegin',overviewHero());
  const split=$('view').querySelector('.split');
  const balance=split.querySelector('.panel:last-child');balance.remove();
  split.style.gridTemplateColumns='1fr';
  split.insertAdjacentHTML('afterend',balancePanel());
  split.querySelector('h2').textContent=t('Solar generation · Daily trend (kWh)','พลังงานโซลาร์ · แนวโน้มรายวัน (kWh)');
 }
 $('view').querySelectorAll('.legend i').forEach(dot=>{const colors={'rgb(32, 157, 109)':'#45d6ac','rgb(116, 4, 95)':'#d98eca','rgb(199, 145, 27)':'#edc260'};dot.style.background=colors[dot.style.background]||dot.style.background});
 $('view').querySelectorAll('.card span').forEach(label=>{label.textContent=label.textContent.replace('September 2026',t('September 2026','กันยายน 2569'))});
 $('nav').querySelectorAll('button').forEach((button,i)=>{button.setAttribute('aria-current',tab===i?'page':'false')});
};
render();

let resizeTimer;addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(render,150)});
