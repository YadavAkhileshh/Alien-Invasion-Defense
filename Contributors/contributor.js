const repoOwner = "YadavAkhileshh";
const repoName = "Alien-Invasion-Defense";
const contributorsUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`;
const repoUrl = `https://api.github.com/repos/${repoOwner}/${repoName}`;

async function fetchContributorData() {
  try {
    // Fetch all contributors across pages
    const contributors = await fetchAllContributors();

    // Fetch repository data (stars, forks, etc.)
    const repoRes = await fetch(repoUrl);
    const repoData = await repoRes.json();

    // Render stats
    renderStats(repoData, contributors);

    // Render contributors
    renderContributors(contributors);

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Fetch all contributors across multiple pages
async function fetchAllContributors() {
  let contributors = [];
  let page = 1;
  let response;

  do {
    response = await fetch(`${contributorsUrl}?page=${page}&per_page=100`);
    const contributorsData = await response.json();
    contributors.push(...contributorsData);
    page++;
  } while (response.headers.get('link') && response.headers.get('link').includes('rel="next"')); // Check for the "next" link in the header

  return contributors;
}

// Render stats like total contributions, stars, forks, etc.
function renderStats(repoData, contributors) {
  const statsGrid = document.getElementById("statsGrid");

  statsGrid.innerHTML = `
    <div class="contributor-stat-card"><h3>${contributors.length}</h3><p>Contributors</p></div>
    <div class="contributor-stat-card"><h3>${contributors.reduce((sum, { contributions }) => sum + contributions, 0)}</h3><p>Total Contributions</p></div>
    <div class="contributor-stat-card"><h3>${repoData.stargazers_count}</h3><p>GitHub Stars</p></div>
    <div class="contributor-stat-card"><h3>${repoData.forks_count}</h3><p>Forks</p></div>
  `;
}

// Render the list of contributors
function renderContributors(contributors) {
  const contributorsContainer = document.getElementById("contributors");

  contributorsContainer.innerHTML = contributors.map(({ login, contributions, avatar_url, html_url }) => `
    <div class="contributor-card">
      <img src="${avatar_url}" alt="${login}'s avatar">
      <p><strong>${login}</strong></p>
      <p>Contributions: ${contributions}</p>
      <a href="${html_url}" target="_blank">GitHub Profile</a>
    </div>
  `).join('');
}

// Call the function to fetch and display data
fetchContributorData();

// Initialize the page when the DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  // Your initialization code here if needed
});
