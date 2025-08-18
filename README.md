# Letterboxd Followers Extension  

A simple Chrome/Brave extension that lets you see **which of your Letterboxd followings follow you back**.  
No more guessing! Just install, fetch your followers, and browse with helpful checkmarks ✅.  

---

## Features
- See who follows you back directly on your **Following** list.  
- Works seamlessly on **Letterboxd web**.  
- Persistent storage using Chrome local storage (your data never leaves your browser).  
- Open source and open for contributions!  

---

## Installation

### From Chrome Web Store  
👉 [Install from the Chrome Web Store](https://chrome.google.com/webstore/detail/your-extension-id)  

### From Source (Developer Mode)  
1. Clone this repository:  
   ```bash
   git clone https://github.com/your-username/letterboxd-followers.git
   cd letterboxd-followers
2. Open chrome://extensions/ in Chrome/Brave.
3. Enable Developer Mode (toggle in top-right).
4. Click "Load unpacked" and select this folder.
5. Done!

## Development
- Extension is built with plain JavaScript, HTML, and CSS (no build step needed).
- Core logic (including the CSS) lives in content.js.
- Popup UI is in popup.html + popup.js.
To test changes:
1. Edit code.
2. Go to chrome://extensions/, click Reload on the extension.
3. Refresh Letterboxd page.

## Contributing

Contributions are welcome! Here’s how:

1. Fork this repo.
2. Create a new branch (git checkout -b feature/amazing-idea).
3. Make your changes.
4. Open a Pull Request.

Good first issues might include:
- UI improvements for banners or checkmarks.
- Better error handling.
- Adding Firefox support.

## Privacy

This extension does not collect, share, or send any personal data.
All follower/following data is stored locally in your browser only.
See [PRIVACY.md](https://github.com/aether1n/letterboxd-follower-checker/blob/main/PRIVACY.md) for details.

## Screenshots
![Screenshot of the extension showing which followers follow you back and vice versa.](https://github.com/user-attachments/assets/11dbb26d-aef5-4272-bed7-face44edf38c)
![Screenshot of the extension popup UI.](https://github.com/user-attachments/assets/8b6910dd-f794-4dea-9dff-2221d3d216c7)

## License
This project is licensed under the [MIT License](https://opensource.org/license/MIT).
