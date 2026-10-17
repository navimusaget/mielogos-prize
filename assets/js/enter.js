document.addEventListener('DOMContentLoaded', async () => {
  'use strict';
  const online = document.getElementById('online-submit');
  const email = document.getElementById('email-submit');
  const compose = document.getElementById('email-compose');
  const box = document.getElementById('final-confirmation');
  const note = document.getElementById('submission-state-note');
  const emailStatus = document.getElementById('email-route-status');
  const emailDetails = document.getElementById('email-instructions');
  if (!online || !email || !compose || !box || !note) return;

  const submissionMailbox =
    'mailto:prize@mielogos.com?subject=MIELOGOS%20Prize%202027%20%E2%80%94%20Email%20Entry';

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

  // Works without any separate submission-method page. This click merely
  // reveals the instructions; it does not send applicant data.
  email.addEventListener('click', () => {
    if (email.getAttribute('aria-disabled') === 'true') return;
    if (emailDetails) emailDetails.open = true;
  });

  try {
    const { c, s } = await MLP.initCommon();
    // Dual activation gate: UTC cycle OPEN AND explicit official endpoint
    // exactly /enter/. The calendar alone cannot open either route.
    const go = s === 'open' &&
      String(c.submission_url || '').replace(/\/+$/, '') === '/enter';

    const refresh = () => {
      disable(online);
      disable(email);
      disable(compose);

      if (s !== 'preopen' && s !== 'open') {
        note.textContent = 'This cycle is closed. No new entries are accepted.';
        if (emailStatus) emailStatus.textContent =
          'These instructions are retained for reference. The submission period has closed.';
      } else if (!go) {
        note.textContent = s === 'preopen'
          ? 'Submissions open ' + MLP.fmtDate(c.submission_open) +
            ' after official activation. Both routes remain closed.'
          : 'Submission intake is not yet activated. Both routes remain closed.';
        if (emailStatus) emailStatus.textContent =
          'These instructions are provided for information only. The Prize has not opened email intake.';
      } else if (!box.checked) {
        note.textContent = 'Check the eligibility confirmation above to choose a submission method.';
        if (emailStatus) emailStatus.textContent =
          'Please complete the eligibility confirmation before initiating an email submission.';
      } else {
        activate(online, '/enter/submission-2027.html');
        activate(email, '#email-instructions');
        activate(compose, submissionMailbox);
        note.textContent = 'Choose the online form or the official email route. Both follow the same rules.';
        if (emailStatus) emailStatus.textContent =
          'The email route is open. Read these instructions and include every required item.';
      }
    };

    box.addEventListener('change', refresh);
    refresh();
  } catch (err) {
    disable(online);
    disable(email);
    disable(compose);
    note.textContent = 'Submission status cannot be verified. Both routes remain closed.';
    if (emailStatus) emailStatus.textContent =
      'Submission status cannot be verified; do not assume email intake is open.';
    console.error('Failed to initialize Enter submission choices', err);
  }
});
