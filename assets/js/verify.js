document.addEventListener('DOMContentLoaded',async()=>{
  await MLP.initCommon();
  const rec=await MLP.get('/data/recognitions.json');
  const input=document.getElementById('recognition-id');
  const button=document.getElementById('verify-button');
  const out=document.getElementById('verify-result');
  if(!input || !button || !out) return;

  out.setAttribute('aria-live','polite');
  out.setAttribute('role','status');

  const params=new URLSearchParams(location.search);
  if(params.get('id')) input.value=params.get('id');

  function run(){
    const q=input.value.trim().toUpperCase();
    if(!q){
      out.innerHTML='<div class="notice">Enter a public Recognition ID.</div>';
      return;
    }

    const r=rec.find(x=>String(x.public_id).toUpperCase()===q);
    if(!r){
      out.innerHTML='<div class="notice"><strong>No matching public record.</strong><p>No current MIELOGOS recognition record matches that ID. Check the spelling and try again.</p></div>';
      return;
    }

    const levels=MLP.recognitionLevels(r);
    const highest=MLP.highestRecognitionLevel(r);
    const path=levels.length>1 ? `<p>Recognition path: ${levels.map(MLP.esc).join(' → ')}</p>` : '';

    out.innerHTML=`
      <div class="notice">
        <span class="status-pill gold">Verified</span>
        <h3>${MLP.esc(highest || r.level)} · ${MLP.esc(r.year)}</h3>
        <p><strong>${MLP.esc(r.work_title)}</strong><br>${MLP.esc(r.author_display)}<br>${MLP.esc(r.category)}</p>
        ${path}
        <p>Recognition ID: ${MLP.esc(r.public_id)}</p>
      </div>`;
  }

  button.addEventListener('click',run);
  input.addEventListener('keydown',ev=>{if(ev.key==='Enter') run();});
  if(input.value) run();
});
