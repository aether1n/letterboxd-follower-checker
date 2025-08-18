document.addEventListener("DOMContentLoaded", async () => {
  const status = document.getElementById("status");
  const userDisplay = document.getElementById("current-user");
  const refreshBtn = document.getElementById("refresh");
  const donateBtn = document.getElementById("donate");
  const versionDiv = document.getElementById("version");

  refreshBtn.disabled = true;
  refreshBtn.style.opacity = "0.5";
  refreshBtn.style.cursor = "not-allowed";


  // Get current tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // 🔒 Check if on letterboxd.com
  const url = new URL(tab.url);
  if (!url.hostname.includes("letterboxd.com")) {
    document.body.style.paddingBottom = "20px";
    userDisplay.textContent = "please open letterboxd.com to use this extension.";
    refreshBtn.style.display = "none";
    donateBtn.style.display = "none";
    versionDiv.style.display = "none";
    status.innerHTML = `<a id="goto-letterboxd" href="https://letterboxd.com" target="_blank">
  <img src="https://a.ltrbxd.com/logos/letterboxd-decal-dots-pos-rgb.svg" alt="Letterboxd Logo" class="logo" />
  go to letterboxd
</a>
`;
    return;
  }

  // Inject content script to get logged in username
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      func: () => {
        const toggleMenu = document.querySelector('a.toggle-menu');
        if (!toggleMenu) return null;
        return toggleMenu.textContent?.trim() || null;
      },
    },
    (injectionResults) => {
      const username = injectionResults?.[0]?.result;

      if (username) {
        userDisplay.textContent = `Logged in as: ${username}`;
        refreshBtn.disabled = false;
        refreshBtn.style.opacity = "1";
        refreshBtn.style.cursor = "pointer";

        chrome.storage.local.get(["letterboxd_followers", "last_logged_in_user", "has_fetched_followers"], (data) => {
          const lastUser = data.last_logged_in_user;
          const isNewUser = lastUser !== username;

          if (isNewUser) {
            chrome.storage.local.set({
              letterboxd_followers: [],
              last_logged_in_user: username,
              has_fetched_followers: false,  // set this!
            });

            showFetchFollowersMessage();
            return;
          }

          // If not new, check if followers were fetched
          if (!data.has_fetched_followers) {
            showFetchFollowersMessage();
          } else {
            const followers = data.letterboxd_followers || [];
            status.textContent = `${followers.length} followers saved.`;
          }
        });



        // Refresh followers button
        refreshBtn.addEventListener("click", () => {
          const followersUrl = `https://letterboxd.com/${username}/followers/`;
          chrome.tabs.create({ url: followersUrl });
        });
      }
      else {
        userDisplay.textContent = "not logged in to letterboxd.";
        status.textContent = "log in first to fetch followers.";
      }
    }
  );

  const versionEl = document.getElementById("version");
  const manifestData = chrome.runtime.getManifest();
  versionEl.textContent = `v${manifestData.version}`;

});

function showFetchFollowersMessage() {
  status.innerHTML = `
    <div style="
      background-color: #fff3cd;
      color: #856404;
      border: 1px solid #ffeeba;
      border-radius: 6px;
      padding: 8px;
      font-size: 13px;
      margin-top: 8px;
    ">
      ⚠️ Please visit your <strong>/followers/</strong> page to load your followers.
    </div>
  `;
}


document.getElementById("donate").addEventListener("click", () => {
  chrome.tabs.create({ url: "https://www.buymeacoffee.com/aetherin" }); // replace with your link
});

