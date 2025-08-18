function showPersistentBanner(message) {
  if (document.getElementById("lb-followers-banner")) return; // prevent duplicates

  const banner = document.createElement("div");
  banner.id = "lb-followers-banner";
  banner.style.position = "fixed";
  banner.style.top = "0";
  banner.style.left = "0";
  banner.style.width = "100%";
  banner.style.zIndex = "9999";
  banner.style.padding = "12px 16px"; // padding inside banner
  banner.style.background = "#ff4d4d";
  banner.style.color = "white";
  banner.style.fontWeight = "bold";
  banner.style.fontSize = "14px";
  banner.style.display = "flex";
  banner.style.justifyContent = "space-between"; // text left, button right
  banner.style.alignItems = "center";
  banner.style.boxSizing = "border-box";
  banner.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";

  // Message text
  const text = document.createElement("span");
  text.textContent = message;

  // Dismiss button
  const button = document.createElement("button");
  button.textContent = "✕";
  button.style.background = "transparent";
  button.style.border = "none";
  button.style.color = "white";
  button.style.fontSize = "16px";
  button.style.cursor = "pointer";
  button.style.marginLeft = "16px";
  button.style.flexShrink = "0"; // prevent shrinking

  button.addEventListener("click", () => {
    banner.remove();
  });

  banner.appendChild(text);
  banner.appendChild(button);
  document.body.appendChild(banner);
}



function getLoggedInUsername() {
  const toggleMenu = document.querySelector('a.toggle-menu');
  if (!toggleMenu) return null;

  const text = toggleMenu.textContent?.trim();
  return text || null;
}

// 🔍 Helper: extract usernames from a given HTML document
function extractUsernamesFromDocument(doc) {
  return Array.from(doc.querySelectorAll("h3.title-3 > a"))
    .map(link => link.getAttribute("href").replace(/\//g, ""))
    .filter(Boolean);
}

// 🔁 Fetch all paginated pages (followers or following)
async function collectAllUsernames(pathname) {
  const allUsernames = new Set();
  let page = 1;
  let lastPageUsernames = null;

  while (true) {
    const pagedPath =
      page === 1 ? pathname : pathname.replace(/\/$/, "") + `/page/${page}/`;

    const url = `${window.location.origin}${pagedPath}`;
    console.log(`🔁 Fetching: ${url}`);

    const res = await fetch(url);
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    const usernames = extractUsernamesFromDocument(doc);

    // 🔁 Detect duplicate page (pagination ends)
    if (!usernames.length || JSON.stringify(usernames) === JSON.stringify(lastPageUsernames)) {
      console.log("No more unique users found, stopping at page", page);
      break;
    }

    usernames.forEach(user => allUsernames.add(user));
    lastPageUsernames = usernames;
    page++;
  }

  return Array.from(allUsernames);
}


// 🟢 Display ✓ or ✗ labels next to each following
function annotateFollowingUsers(following, followers) {
  document.querySelectorAll("h3.title-3 > a").forEach(link => {
    const username = link.getAttribute("href").replace(/\//g, "").toLowerCase();

    const alreadyTagged = link.parentElement.querySelector(".follower-tag");
    if (alreadyTagged) return;

    const label = document.createElement("span");
    label.className = "follower-tag";
    label.style.marginLeft = "8px";
    label.style.fontSize = "12px";
    label.style.fontWeight = "bold";

    if (followers.includes(username)) {
      label.textContent = "✓ follows you";
      label.style.color = "green";
    } else {
      label.textContent = "✗ doesn't follow you";
      label.style.color = "red";
    }

    link.parentElement.appendChild(label);
  });
}


function showLoginPopup() {
  const popup = document.createElement("div");
  popup.textContent = "🔒 please log in to use this extension.";
  popup.style.position = "fixed";
  popup.style.top = "20px";
  popup.style.left = "50%";
  popup.style.transform = "translateX(-50%)";
  popup.style.padding = "12px 24px";
  popup.style.backgroundColor = "#eaeaea";
  popup.style.color = "#333333";
  popup.style.fontSize = "14px";
  popup.style.fontFamily = "'Arial', sans-serif",
    popup.style.fontWeight = "bold";
  popup.style.borderRadius = "8px";
  popup.style.zIndex = "9999";
  popup.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
  popup.style.transition = "opacity 0.5s ease";
  popup.style.opacity = "1";

  document.body.appendChild(popup);

  setTimeout(() => {
    popup.style.opacity = "0";
    setTimeout(() => popup.remove(), 1000);
  }, 4000);
}


// 🧠 Main logic
(async function () {
  const path = window.location.pathname;
  const loggedInUsername = getLoggedInUsername();

  if (!loggedInUsername) {
    showLoginPopup();
    return;
  }

  const isOwnFollowersPage = path.toLowerCase() === `/${loggedInUsername.toLowerCase()}/followers/`;
  const normalizedPath = path.endsWith("/") ? path : path + "/";
  const isOwnFollowingPage = normalizedPath.toLowerCase().startsWith(`/${loggedInUsername.toLowerCase()}/following/`);


  if (isOwnFollowersPage) {
    // Create popup
    const popup = document.createElement("div");
    popup.id = "follower-popup";

    // Create spinner
    const spinner = document.createElement("div");
    spinner.className = "spinner";
    Object.assign(spinner.style, {
      width: "16px",
      height: "16px",
      border: "3px solid #ccc",
      borderTop: "3px solid #333",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      marginRight: "8px"
    });

    // Create text node
    const text = document.createElement("span");
    text.textContent = "Fetching followers...";

    // Style popup
    Object.assign(popup.style, {
      position: "fixed",
      top: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      backgroundColor: "#eaeaea",
      color: "#333333",
      padding: "12px 24px",
      borderRadius: "8px",
      fontSize: "14px",
      fontFamily: "'Arial', sans-serif",
      fontWeight: "bold",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      zIndex: "9999",
      transition: "opacity 0.5s ease",
      textAlign: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      opacity: "1",
      gap: "8px"
    });

    popup.appendChild(spinner);
    popup.appendChild(text);
    document.body.appendChild(popup);

    // Add spinner animation via style tag
    const style = document.createElement("style");
    style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
    document.head.appendChild(style);

    try {
      const followers = await collectAllUsernames(path);
      console.log("✅ Collected", followers.length, "followers.");
      chrome.storage.local.set({ letterboxd_followers: followers, has_fetched_followers: true });
      popup.textContent = `✅ successfully fetched ${followers.length} followers. please visit your / following / page.`;
    } catch (err) {
      console.error("❌ Error fetching followers:", err);
      popup.textContent = "❌ failed to fetch followers.";
    }

    // Fade out after 3 seconds
    setTimeout(() => {
      popup.style.opacity = "0";
      setTimeout(() => popup.remove(), 500);
    }, 4000);
  }

  if (isOwnFollowingPage) {
  chrome.storage.local.get(["letterboxd_followers", "has_fetched_followers"], (data) => {
    const hasFetched = data.has_fetched_followers;
    let followers = Array.isArray(data.letterboxd_followers) ? data.letterboxd_followers : [];

    if (!hasFetched) {
      console.warn("⚠️ Followers not fetched yet — visit your /followers/ page first.");
      showPersistentBanner("⚠️ please visit your /followers/ page first to fetch your followers.");
      return;
    }

    // Normalize followers to lowercase
    followers = followers.map(u => u.replace(/\//g, "").toLowerCase());

    const followings = extractUsernamesFromDocument(document).map(u => u.replace(/\//g, "").toLowerCase());
    console.log("✅ Collected followings:", followings);

    console.log("🟢 Comparing with saved followers...");
    annotateFollowingUsers(followings, followers);
  });
}

})();