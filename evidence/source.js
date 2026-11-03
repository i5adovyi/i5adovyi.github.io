async function showTestSource() {
  const source = document.querySelector('#spec-source');
  try {
    const response = await fetch('./career-starter.spec.txt');
    if (!response.ok) throw new Error('Source unavailable');
    source.textContent = await response.text();
  } catch {
    source.textContent = 'The preview could not load. Use “Open source file” to read the test.';
  }
}

showTestSource();
