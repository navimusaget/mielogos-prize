
function safe(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
document.addEventListener('DOMContentLoaded',async()=>{
 const rec=await MLP.get('/data/recognitions.json'); const input=document.getElementById('recognition-id'), button=document.getElementById('verify-button'), out=document.getElementById('verify-result');
 const params=new URLSearchParams(location.search); if(params.get('id')) input.value=params.get('id');
 function run(){const q=input.value.trim().toUpperCase(); if(!q){out.innerHTML='<div class="notice">Enter a public Recognition ID.</div>';return;} const r=rec.find(x=>String(x.public_id).toUpperCase()===q); if(!r){out.innerHTML='<div class="notice"><strong>No matching public record.</strong><p>No current MIELOGOS recognition record matches that ID. Check the spelling and try again.</p></div>';return;} out.innerHTML=`<div class="notice"><span class="status-pill gold">Verified</span><h3>${safe(r.level)} · ${safe(r.year)}</h3><p><strong>${safe(r.work_title)}</strong><br>${safe(r.author_display)}<br>${safe(r.category)}</p><p>Recognition ID: ${safe(r.public_id)}</p></div>`;}
 button.addEventListener('click',run); input.addEventListener('keydown',ev=>{if(ev.key==='Enter')run();}); if(input.value)run();
});
