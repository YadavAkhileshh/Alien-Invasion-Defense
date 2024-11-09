const repoOwner = "YadavAkhileshh";
const repoName = "Alien-Invasion-Defense";
const contributorsUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`;
const repoUrl = `https://api.github.com/repos/${repoOwner}/${repoName}`;

async function fetchContributorData() {
  try {
    const [contributorsRes, repoRes] = await Promise.all([
      fetch(contributorsUrl),
      fetch(repoUrl)
    ]);

    const contributors = await contributorsRes.json();
    const repoData = await repoRes.json();

    const statsGrid = document.getElementById("statsGrid");

    statsGrid.innerHTML = `
      <div class="contributor-stat-card"><h3>${contributors.length}</h3><p>Contributors</p></div>
      <div class="contributor-stat-card"><h3>${contributors.reduce((sum, { contributions }) => sum + contributions, 0)}</h3><p>Total Contributions</p></div>
      <div class="contributor-stat-card"><h3>${repoData.stargazers_count}</h3><p>GitHub Stars</p></div>
      <div class="contributor-stat-card"><h3>${repoData.forks_count}</h3><p>Forks</p></div>
    `;

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
