// Auth token debugging utility
// This file helps debug localStorage token issues

const originalSetItem = localStorage.setItem;
const originalRemoveItem = localStorage.removeItem;
const originalClear = localStorage.clear;

// Override setItem
localStorage.setItem = function(key, value) {
  if (key === 'auth_token') {
    console.log('📝 localStorage.setItem("auth_token"):', value.substring(0, 30) + '...');
    console.trace('Call stack:');
  }
  originalSetItem.apply(this, arguments);
};

// Override removeItem
localStorage.removeItem = function(key) {
  if (key === 'auth_token') {
    console.warn('🗑️ localStorage.removeItem("auth_token")');
    console.trace('Call stack:');
  }
  originalRemoveItem.apply(this, arguments);
};

// Override clear
localStorage.clear = function() {
  console.error('🚨 localStorage.clear() called!');
  console.trace('Call stack:');
  originalClear.apply(this, arguments);
};

console.log('🔍 Auth debugging enabled');
