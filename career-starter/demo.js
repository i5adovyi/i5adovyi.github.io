'use strict';

const storageKey = 'career-starter:draft:v1:' + new URL('.', document.baseURI).pathname;
const roleInput = document.getElementById('role');
const initialRole = roleInput.defaultValue;
const roleError = document.getElementById('role-error');
const statusLine = document.getElementById('draft-status');
const editPanel = document.getElementById('edit-panel');
const reviewPanel = document.getElementById('review-panel');
let draft = { step: 1, role: initialRole };

function clearRoleError() {
  roleError.hidden = true;
  roleInput.removeAttribute('aria-invalid');
  roleInput.setAttribute('aria-describedby', 'role-hint');
}

function render(focusHeading = false) {
  const reviewing = draft.step === 2;
  editPanel.hidden = reviewing;
  reviewPanel.hidden = !reviewing;
  document.getElementById('progress-edit').setAttribute('aria-current', reviewing ? 'false' : 'step');
  document.getElementById('progress-review').setAttribute('aria-current', reviewing ? 'step' : 'false');
  roleInput.value = draft.role;
  document.getElementById('saved-role').textContent = draft.role;
  clearRoleError();
  if (focusHeading) {
    document.getElementById(reviewing ? 'review-title' : 'edit-title').focus();
  }
}

function saveDraft(step, role) {
  const next = { step, role };
  try {
    localStorage.setItem(storageKey, JSON.stringify(next));
  } catch {
    statusLine.textContent = 'Your draft could not be saved. Check that this site can store data in your browser, then try again.';
    return;
  }
  draft = next;
  render(true);
  statusLine.textContent = step === 2 ? 'Draft saved.' : '';
}

try {
  const raw = localStorage.getItem(storageKey);
  if (raw !== null) {
    const saved = JSON.parse(raw);
    if (saved && [1, 2].includes(saved.step) && typeof saved.role === 'string' &&
        saved.role.trim() && saved.role.length <= roleInput.maxLength) {
      draft = saved;
      statusLine.textContent = 'Draft restored.';
    } else {
      statusLine.textContent = 'The saved draft has an unexpected format. You can start a new draft here.';
    }
  }
} catch {
  statusLine.textContent = 'The saved draft could not be read. The form is showing the sample profile.';
}
render();
document.getElementById('draft-interface').hidden = false;
document.getElementById('reset').hidden = false;

document.getElementById('profile-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const role = roleInput.value.trim();
  if (!role) {
    roleError.hidden = false;
    roleInput.setAttribute('aria-invalid', 'true');
    roleInput.setAttribute('aria-describedby', 'role-error');
    roleInput.focus();
    return;
  }
  saveDraft(2, role);
});

roleInput.addEventListener('input', () => {
  clearRoleError();
  statusLine.textContent = '';
});

document.getElementById('reload').addEventListener('click', () => location.reload());
document.getElementById('edit').addEventListener('click', () => saveDraft(1, draft.role));
document.getElementById('reset').addEventListener('click', () => {
  try {
    localStorage.removeItem(storageKey);
  } catch {
    statusLine.textContent = 'Your draft could not be reset. Check your browser’s storage settings, then try again.';
    return;
  }
  draft = { step: 1, role: initialRole };
  render(true);
  statusLine.textContent = 'Draft reset.';
});
