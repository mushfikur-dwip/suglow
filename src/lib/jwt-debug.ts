// JWT Token Decoder for debugging
// Add this temporarily to check token structure

const decodeJWT = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('❌ Invalid JWT format - must have 3 parts');
      return null;
    }
    
    const payload = JSON.parse(atob(parts[1]));
    console.log('📄 JWT Payload:', payload);
    console.log('🕐 Issued at:', new Date(payload.iat * 1000).toLocaleString());
    console.log('⏰ Expires at:', new Date(payload.exp * 1000).toLocaleString());
    console.log('⏱️ Current time:', new Date().toLocaleString());
    console.log('✅ Token valid?', payload.exp * 1000 > Date.now());
    
    return payload;
  } catch (error) {
    console.error('❌ Failed to decode JWT:', error);
    return null;
  }
};

// Check token on page load
const token = localStorage.getItem('auth_token');
if (token) {
  console.log('🔍 Checking stored token...');
  decodeJWT(token);
} else {
  console.log('⚠️ No token in localStorage');
}

// Expose globally for manual checking
window.checkToken = () => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    return decodeJWT(token);
  }
  console.log('⚠️ No token found');
  return null;
};

console.log('💡 Use window.checkToken() to manually check token');
