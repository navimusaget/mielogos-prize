
document.addEventListener('DOMContentLoaded', async()=>{
  const {c,s}=await MLP.initCommon();
  const btn=document.getElementById('start-submission'); const note=document.getElementById('submission-state-note'); const box=document.getElementById('final-confirmation');
  if(!btn) return;
  function refresh(){
    const checked = box ? box.checked : true;
    if(s==='open' && c.submission_url && checked){ btn.href=c.submission_url; btn.classList.remove('disabled'); btn.removeAttribute('aria-disabled'); btn.textContent='Start submission'; note.textContent='The 2027 submission portal is open.'; }
    else if(s==='open' && !c.submission_url){ btn.removeAttribute('href'); btn.classList.add('disabled'); btn.setAttribute('aria-disabled','true'); btn.textContent='Submission portal being connected'; note.textContent='The public site is ready; the official submission endpoint must be connected and tested before opening.'; }
    else if(s==='preopen'){ btn.removeAttribute('href'); btn.classList.add('disabled'); btn.setAttribute('aria-disabled','true'); btn.textContent='Opens 1 February 2027'; note.textContent='There is no advantage to submitting early. Use this page now to prepare your final file.'; }
    else { btn.removeAttribute('href'); btn.classList.add('disabled'); btn.setAttribute('aria-disabled','true'); btn.textContent='2027 submissions are closed'; note.textContent='This cycle is no longer accepting entries.'; }
    if(!checked && s==='open' && c.submission_url){btn.removeAttribute('href');btn.classList.add('disabled');btn.setAttribute('aria-disabled','true');}
  }
  if(box) box.addEventListener('change',refresh); refresh();
});
