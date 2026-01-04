// Track localStorage token operations
const originalSetItem = localStorage.setItem;
const originalRemoveItem = localStorage.removeItem;

localStorage.setItem = function(key, value) {
  if (key === 'auth_token') {
    console.log(`✅ localStorage.setItem("${key}", "${value.substring(0, 30)}...")`);
    console.trace('🔍 Set from:');
  }
  originalSetItem.apply(this, arguments);
};

localStorage.removeItem = function(key) {
  if (key === 'auth_token' || key === 'user') {
    console.error(`🚨 localStorage.removeItem("${key}")`);
    console.trace('🔍 Called from:');
  }
  originalRemoveItem.apply(this, arguments);
};

console.log('🔍 Tracking token removal');
