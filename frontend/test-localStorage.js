// Test localStorage contents
console.log('localStorage contents:');
Object.keys(localStorage).forEach(key => {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    console.log(key, data);
  } catch (e) {
    console.log(key, 'Error parsing:', e.message);
  }
});
