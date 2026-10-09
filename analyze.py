from pathlib import Path
import pandas as pd, json, hashlib
ROOT=Path(__file__).parent; RAW=ROOT/'raw'/'Solar'; OUT=ROOT/'data';OUT.mkdir(exist_ok=True)
frames=[];inventory=[];long=[]
for p in sorted(RAW.glob('*.csv')):
 d=pd.read_csv(p);first=d.columns[0]; ts=pd.to_datetime(d[first],format='mixed',errors='coerce') if first in ['DateTime','Measurement Time'] else pd.Series(pd.NaT,index=d.index)
 inventory.append({'file':p.name,'rows':len(d),'columns':list(d.columns),'start':str(ts.min()) if ts.notna().any() else None,'end':str(ts.max()) if ts.notna().any() else None,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'missing_cells':int(d.isna().sum().sum())})
 for i,r in d.iterrows():
  for col in d.columns[1:]:long.append({'source_file':p.name,'source_row':i+2,'timestamp':str(ts[i]) if pd.notna(ts[i]) else '', 'source_key':r[first],'parameter':col,'value':r[col]})
 if p.name.startswith('3MW'):
  f=pd.DataFrame({'timestamp':pd.to_datetime(d[first],format='%b %d, %Y %I:%M %p'),'source_file':p.name})
  for col in d.columns[1:]:
   scale=1000 if '(MW)' in col else 1
   f[col.split(' (')[0]+'_kW']=pd.to_numeric(d[col],errors='coerce')*scale
  frames.append(f)
q=pd.concat(frames).sort_values('timestamp');assert not q.timestamp.duplicated().any()
expected=pd.date_range('2026-09-01','2026-10-01',freq='15min',inclusive='left');assert set(q.timestamp)==set(expected)
q.to_csv(OUT/'power_15min.csv',index=False)
cols=[c for c in q if c.endswith('_kW')];g=q.set_index('timestamp')[cols].resample('h');h=g.mean();h.columns=[c.replace('_kW','_mean_kW') for c in h.columns]
for c in cols:h[c.replace('_kW','_estimated_kWh')]=g[c].sum(min_count=4)*.25
h['sample_count']=g.size();assert (h.sample_count==4).all();h.to_csv(OUT/'hourly.csv')
energy=pd.read_csv(RAW/'energy-overview SEP2026.csv');daily=pd.DataFrame({'date':pd.to_datetime(energy.DateTime).dt.strftime('%Y-%m-%d')})
for c in energy.columns[1:]:daily[c+'_kWh']=energy[c]/1000
irr=pd.read_csv(RAW/'Site Yield SEP2026.csv');daily['irradiance_DIRECT_source_units']=irr.iloc[:,1];daily['irradiance_GHI_source_units']=irr.iloc[:,2];daily['specific_yield_source_units']=irr.iloc[:,3]
daily['self_consumed_solar_kWh']=daily['Inverters Produced_kWh']-daily['Exported Energy_kWh'];daily['solar_share_pct']=daily.self_consumed_solar_kWh/daily['Consumed Energy_kWh']*100
approx=q.assign(date=q.timestamp.dt.strftime('%Y-%m-%d')).groupby('date')[cols].sum()*.25
for c in cols:daily[c.replace('_kW','_estimated_kWh')]=daily.date.map(approx[c])
daily['production_estimate_difference_kWh']=daily['Production_estimated_kWh']-daily['Inverters Produced_kWh']
daily.to_csv(OUT/'daily.csv',index=False)
inv=pd.read_csv(RAW/'inverter-production-brea SEP2026.csv'); invsum=pd.DataFrame({'inverter':inv.columns[1:],'energy_kWh':inv.iloc[:,1:].sum().values/1000});invsum.to_csv(OUT/'inverter_monthly.csv',index=False)
pd.DataFrame(long).to_csv(OUT/'all_parameters_raw.csv',index=False)
(OUT/'inventory.json').write_text(json.dumps(inventory,ensure_ascii=False,indent=2))
sums={c:float(daily[c].sum()) for c in daily if c.endswith('_kWh') and not c.startswith('production_estimate')}
sums.update({'self_consumption_pct':float(daily.self_consumed_solar_kWh.sum()/daily['Inverters Produced_kWh'].sum()*100),'solar_share_pct':float(daily.self_consumed_solar_kWh.sum()/daily['Consumed Energy_kWh'].sum()*100),'files':len(inventory),'quarter_hour_rows':len(q),'hourly_rows':len(h),'daily_rows':len(daily),'monthly_inverter_sum_kWh':float(invsum.energy_kWh.sum())})
(OUT/'summary.json').write_text(json.dumps(sums,indent=2))
(OUT/'dashboard.json').write_text(json.dumps({'summary':sums,'daily':json.loads(daily.to_json(orient='records')),'hourly':json.loads(h.reset_index().assign(timestamp=lambda x:x.timestamp.dt.strftime('%Y-%m-%d %H:%M')).to_json(orient='records')),'inventory':inventory},ensure_ascii=False))
print(json.dumps(sums,indent=2));print('out-of-period:',[x['file'] for x in inventory if x['start'] and not x['start'].startswith('2026-09')]);print('unit variants:',q.source_file[q.source_file.str.contains('18SEP')].unique());print('integrity residual Wh', (energy['Consumed Energy']-(energy['Imported Energy']+energy['Inverters Produced']-energy['Exported Energy'])).abs().max())
