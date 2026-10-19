document.addEventListener('DOMContentLoaded', async () => {
  'use strict';
  const online = document.getElementById('online-submit');
  const email = document.getElementById('email-submit');
  const box = document.getElementById('final-confirmation');
  const note = document.getElementById('submission-state-note');
  if (!online || !email || !box || !note) return;
  // Explicit dress rehearsal: both public entry methods lead to TEST-ONLY
  // forms. Official calendar and submission-go configuration are unchanged.
  const DRESS_REHEARSAL = true;
  if (DRESS_REHEARSAL) {
    const state=document.querySelector('[data-cycle-state]');
    if(state)state.textContent='DRESS REHEARSAL — TEST ONLY';
    function refreshQA(){
      online.removeAttribute('href');email.removeAttribute('href');
      online.classList.add('disabled');email.classList.add('disabled');
      online.setAttribute('aria-disabled','true');email.setAttribute('aria-disabled','true');
      if(!box.checked){
        note.textContent='Confirm eligibility review to open the synthetic test methods. No official applications are accepted.';
        return;
      }
      online.href='/enter/submission-2027.html';email.href='/enter/email/';
      online.classList.remove('disabled');email.classList.remove('disabled');
      online.removeAttribute('aria-disabled');email.removeAttribute('aria-disabled');
      note.textContent='TEST MODE: choose online or email. Only fictional entries and QA-labeled files may be used.';
    }
    box.addEventListener('change',refreshQA);
    refreshQA();
    return;
  }


  function disable(el) {
    el.removeAttribute('href');
    el.classList.add('disabled');
    el.setAttribute('aria-disabled', 'true');
  }
  function activate(el, href) {
    el.setAttribute('href', href);
    el.classList.remove('disabled');
    el.removeAttribute('aria-disabled');
  }

  try {
    const { c, s } = await MLP.initCommon();
    // The UTC cycle must be OPEN and a separate GO must configure /enter/.
    // Calendar state alone never activates either submission route.
    const go = s === 'open' &&
      String(c.submission_url || '').replace(/\/+$/, '') === '/enter';

    function refresh() {
      disable(online);
      disable(email);

      if (s !== 'preopen' && s !== 'open') {
        note.textContent = 'This cycle is closed. No new entries are accepted.';
      } else if (!go) {
        note.textContent = s === 'preopen'
          ? 'Submissions open ' + MLP.fmtDate(c.submission_open) +
            ' after official activation. Both routes remain closed.'
          : 'Submission intake is not yet activated. Both routes remain closed.';
      } else if (!box.checked) {
        note.textContent =
          'Check the eligibility confirmation above to choose a submission method.';
      } else {
        activate(online, '/enter/submission-2027.html');
        activate(email, '/enter/email/');
        note.textContent =
          'Choose the online form or email instructions. Both follow the same rules.';
      }
    }
    box.addEventListener('change', refresh);
    refresh();
  } catch (err) {
    disable(online);
    disable(email);
    note.textContent =
      'Submission status cannot be verified. Both routes remain closed.';
    console.error('Failed to initialize Enter submission choices', err);
  }
});
