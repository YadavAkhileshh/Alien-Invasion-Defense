const repoOwner = "YadavAkhileshh";
const repoName = "Alien-Invasion-Defense";
const contributorsUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`;
const repoUrl = `https://api.github.com/repos/${repoOwner}/${repoName}`;

async function fetchContributorData() {
  try {
    // Start with the first page of contributors
    let contributors = [];
    let url = contributorsUrl;

    while (url) {
      const contributorsRes = await fetch(url);
      const contributorsPage = await contributorsRes.json();

      // Add the current page of contributors to the total list
      contributors = contributors.concat(contributorsPage);

      // Check the Link header for pagination information
      const linkHeader = contributorsRes.headers.get("Link");
      if (linkHeader) {
        const nextPageUrl = parseLinkHeader(linkHeader);
        url = nextPageUrl ? nextPageUrl : null; // Get the next page URL or stop if no next page
      } else {
        url = null; // No Link header means we're on the last page
      }
    }

    const repoRes = await fetch(repoUrl);
    const repoData = await repoRes.json();

    // Update the stats section
    const statsGrid = document.getElementById("statsGrid");
    statsGrid.innerHTML = `
      <div class="contributor-stat-card"><h3>${contributors.length}</h3><p>Contributors</p></div>
      <div class="contributor-stat-card"><h3>${contributors.reduce((sum, { contributions }) => sum + contributions, 0)}</h3><p>Total Contributions</p></div>
      <div class="contributor-stat-card"><h3>${repoData.stargazers_count}</h3><p>GitHub Stars</p></div>
      <div class="contributor-stat-card"><h3>${repoData.forks_count}</h3><p>Forks</p></div>
    `;

    // Update the contributors section
    const contributorsContainer = document.getElementById("contributors");
    contributorsContainer.innerHTML = contributors.map(({ login, contributions, avatar_url, html_url }) => `
      <div class="contributor-card">
        <img src="${avatar_url}" alt="${login}'s avatar">
        <p><strong>${login}</strong></p>
        <p>Contributions: ${contributions}</p>
        <a href="${html_url}" target="_blank">GitHub Profile</a>
      </div>
    `).join('');
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Function to parse the Link header and get the URL for the next page
function parseLinkHeader(linkHeader) {
  const links = linkHeader.split(',').reduce((acc, part) => {
    const [url, rel] = part.split(';');
    const match = rel.match(/rel="(\w+)"/);
    if (match) {
      acc[match[1]] = url.trim().slice(1, -1); // Remove surrounding <> from URL
    }
    return acc;
  }, {});
  return links.next; // Return the URL of the next page, or undefined if there's no next
}

window.onscroll = function () {
  const scrollUpBtn = document.getElementById("scrollUpBtn-cn");
  if (
    document.body.scrollTop > 100 ||
    document.documentElement.scrollTop > 100
  ) {
    scrollUpBtn.style.display = "block";
  } else {
    scrollUpBtn.style.display = "none";
  }
  const totalHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const scrollPosition = window.pageYOffset;
  const scrollPercentage = (scrollPosition / totalHeight) * 100;
  document.getElementById(
    "progress-bar-cn"
  ).style.width = `${scrollPercentage}%`;
};

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

fetchContributorData();
