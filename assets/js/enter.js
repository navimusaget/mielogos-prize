document.addEventListener('DOMContentLoaded', async()=>{
  const {c,s}=await MLP.initCommon();
  const btn=document.getElementById('start-submission');
  const note=document.getElementById('submission-state-note');
  const box=document.getElementById('final-confirmation');
  if(!btn) return;

  function disable(label,message){
    btn.removeAttribute('href');
    btn.classList.add('disabled');
    btn.setAttribute('aria-disabled','true');
    btn.textContent=label;
    if(note) note.textContent=message;
  }

  function refresh(){
    const checked=box ? box.checked : true;
    if(s==='open' && c.submission_url && checked){
      btn.href=c.submission_url;
      btn.classList.remove('disabled');
      btn.removeAttribute('aria-disabled');
      btn.textContent='Start submission';
      if(note) note.textContent='The 2027 submission portal is open.';
    }else if(s==='open' && !c.submission_url){
      disable(
        'Submission portal being connected',
        'The official submission endpoint will be activated here after final testing.'
      );
    }else if(s==='preopen'){
      disable(
        `Opens ${MLP.fmtDate(c.submission_open)}`,
        'There is no advantage to submitting early. Use this page now to prepare your final file.'
      );
    }else{
      disable(
        `${c.year} submissions are closed`,
        'This cycle is no longer accepting entries.'
      );
    }

    if(!checked && s==='open' && c.submission_url){
      btn.removeAttribute('href');
      btn.classList.add('disabled');
      btn.setAttribute('aria-disabled','true');
    }
  }

  if(box) box.addEventListener('change',refresh);
  refresh();
});
