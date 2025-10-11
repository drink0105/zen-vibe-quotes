document.addEventListener('DOMContentLoaded', function() {
  const root = document.getElementById('root');
  root.innerHTML = `
    <div style="padding: 20px; text-align: center; background: linear-gradient(to bottom, #FFF7ED, #FFDAB9); min-height: 100vh;">
      <h1 style="color: #1A202C;">ZenVibe</h1>
      <p>Loading quotes... (Test build - Basic page working!)</p>
      <button onclick="alert('Test button - App is loading!')" style="padding: 10px 20px; background: #3B82F6; color: white; border: none; border-radius: 5px; cursor: pointer;">Test Button</button>
    </div>
  `;
});
