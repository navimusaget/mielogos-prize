document.addEventListener('DOMContentLoaded', async () => {
  const btn = document.getElementById('start-submission');
  const note = document.getElementById('submission-state-note');
  const box = document.getElementById('final-confirmation');
  if (!btn) return;

  function disable(label, message) {
    btn.removeAttribute('href');
    btn.classList.add('disabled');
    btn.setAttribute('aria-disabled', 'true');
    btn.textContent = label;
    if (note) note.textContent = message;
  }

  function enable(label, message) {
    // Navigation only. The destination independently controls both
    // submission methods and does not accept entries before formal GO.
    btn.href = '/enter/method/';
    btn.classList.remove('disabled');
    btn.removeAttribute('aria-disabled');
    btn.textContent = label;
    if (note) note.textContent = message;
  }

  try {
    const { c, s } = await MLP.initCommon();
    const openForSubmission =
      s === 'open' &&
      String(c.submission_url || '').replace(/\/+$/, '') === '/enter/method';

    function refresh() {
      if (s !== 'preopen' && s !== 'open') {
        disable(
          `${c.year} submissions are closed`,
          'This cycle is no longer accepting entries.'
        );
        return;
      }

      if (box && !box.checked) {
        disable(
          s === 'preopen'
            ? `Opens ${MLP.fmtDate(c.submission_open)}`
            : 'Confirm eligibility to continue',
          s === 'preopen'
            ? 'Tick the confirmation box to preview the two submission methods. No entries are accepted yet.'
            : 'Tick the confirmation box to continue to the submission-method page.'
        );
        return;
      }

      if (openForSubmission) {
        enable(
          'Choose submission method',
          'Continue to choose the online form or submission by official email.'
        );
      } else {
        enable(
          'View submission methods',
          s === 'preopen'
            ? `For information only. Entries open ${MLP.fmtDate(c.submission_open)} after the official activation.`
            : 'Both routes are currently inactive; you may review the instructions.'
        );
      }
    }

    if (box) box.addEventListener('change', refresh);
    refresh();
  } catch (err) {
    // Fail closed if the common cycle configuration cannot be verified.
    disable(
      'Submission methods unavailable',
      'Submission status could not be verified. Please try again later.'
    );
    console.error('Could not load submission status', err);
  }
});
