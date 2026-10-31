
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".app-section");

navLinks.forEach((link) => {
  link.addEventListener("click", async (e) => {
    e.preventDefault();

    const targetSection = link.dataset.section;

    navLinks.forEach((nav) => {
      nav.classList.remove(
        "bg-blue-500/10",
        "text-blue-400"
      );

      nav.classList.add("text-slate-300");
    });

    link.classList.add(
      "bg-blue-500/10",
      "text-blue-400"
    );

    sections.forEach((section) => {
      section.classList.add("hidden");
    });

    document
      .getElementById(targetSection)
      .classList.remove("hidden");

    if (targetSection === "launches") {
      await loadLaunches();
    }

    if (targetSection === "planets") {
      await loadPlanets();
    }
  });
});



const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebar-toggle");

if (sidebarToggle) {
  sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("-translate-x-full");
  });
}



async function loadLaunches() {
  try {
    const response = await fetch(
      "https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=10"
    );

    const data = await response.json();

    const launches = data.results;

    updateFeaturedLaunch(launches[0]);

    renderLaunchCards(launches);

    const countDesktop =
      document.getElementById("launches-count");

    const countMobile =
      document.getElementById(
        "launches-count-mobile"
      );

    if (countDesktop) {
      countDesktop.textContent =
        launches.length + " Launches";
    }

    if (countMobile) {
      countMobile.textContent =
        launches.length;
    }
  } catch (error) {
    console.error(
      "Launch API Error:",
      error
    );
  }
}



function updateFeaturedLaunch(launch) {
  const container =
    document.getElementById("featured-launch");

  const image =
    launch.image ||
    "./assets/images/placeholder.webp";

  container.innerHTML = `
    
<div class="relative bg-slate-800/30 border border-slate-700 rounded-3xl overflow-hidden">
    
<div class="grid lg:grid-cols-2 gap-8 p-8">

<div>

<span class="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold">
Featured Launch
</span>

<h2 class="text-3xl font-bold mt-4 mb-4">
${launch.name}
</h2>

<p class="text-slate-400 mb-4">
${launch.launch_service_provider?.name || ""}
</p>

<div class="grid grid-cols-2 gap-4 mb-4">

<div class="bg-slate-900/50 p-4 rounded-xl">
<p class="text-xs text-slate-400">
Launch Date
</p>
<p class="font-semibold">
${new Date(
  launch.net
).toLocaleDateString()}
</p>
</div>

<div class="bg-slate-900/50 p-4 rounded-xl">
<p class="text-xs text-slate-400">
Launch Time
</p>
<p class="font-semibold">
${new Date(
  launch.net
).toLocaleTimeString()}
</p>
</div>

</div>

<p class="text-slate-300 leading-relaxed">
${launch.mission?.description ||
"Mission description unavailable"}
</p>

</div>

<img
src="${image}"
class="w-full h-full object-cover rounded-2xl"
/>

</div>

</div>
`;
}



function renderLaunchCards(launches) {
  const grid =
    document.getElementById(
      "launches-grid"
    );

  grid.innerHTML = "";

  launches.forEach((launch) => {
    grid.innerHTML += `
      
<div
class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500 transition-all"
>

<img
src="${
  launch.image ||
  "./assets/images/placeholder.webp"
}"
class="w-full h-48 object-cover"
/>

<div class="p-4">

<h3 class="font-bold text-lg mb-3">
${launch.name}
</h3>

<p class="text-slate-400 text-sm mb-2">
${
  launch.launch_service_provider
    ?.name || "Unknown"
}
</p>

<p class="text-slate-300 text-sm mb-4">
${new Date(
  launch.net
).toLocaleString()}
</p>

<button
class="w-full py-2 bg-blue-500 rounded-lg hover:bg-blue-600"
>
Details
</button>

</div>

</div>
`;
  });
}



async function loadPlanets() {
  try {
    const response = await fetch(
      "https://api.nasa.gov/planetary/apod?api_key=YOUR_API_KEY"
    );

    const data = await response.json();

    const planets = data.bodies.filter(
      (body) => body.isPlanet
    );

    renderPlanets(planets);

    updatePlanetDetails(planets[2]);
  } catch (error) {
    console.error(
      "Planet API Error:",
      error
    );
  }
}



function renderPlanets(planets) {
  const grid =
    document.getElementById(
      "planets-grid"
    );

  grid.innerHTML = "";

  planets.forEach((planet) => {
    grid.innerHTML += `
      
<div
class="planet-card bg-slate-800/50 border border-slate-700 rounded-2xl p-4 cursor-pointer hover:border-blue-500"
data-id="${planet.id}"
>

<div class="text-center">

<img
src="./assets/images/${planet.englishName.toLowerCase()}.png"
alt="${planet.englishName}"
class="w-20 h-20 mx-auto object-contain"
/>

<h4 class="font-bold mt-2">
${planet.englishName}
</h4>

<p class="text-xs text-slate-400">
${(
  planet.semimajorAxis /
  149597870
).toFixed(2)}
AU
</p>

</div>

</div>
`;
  });

  document
    .querySelectorAll(
      "#planets-grid .planet-card"
    )
    .forEach((card) => {
      card.addEventListener(
        "click",
        () => {
          const id = card.dataset.id;

          const planet =
            planets.find(
              (p) =>
                p.id === id
            );

          updatePlanetDetails(
            planet
          );
        }
      );
    });
}



function updatePlanetDetails(
  planet
) {
  document.getElementById(
    "planet-detail-name"
  ).textContent =
    planet.englishName;

  document.getElementById(
    "planet-detail-description"
  ).textContent =
    `${planet.englishName} is one of the planets in our Solar System.`;

  document.getElementById(
    "planet-distance"
  ).textContent =
    `${planet.semimajorAxis.toLocaleString()} km`;

  document.getElementById(
    "planet-radius"
  ).textContent =
    `${planet.meanRadius.toLocaleString()} km`;

  document.getElementById(
    "planet-density"
  ).textContent =
    `${planet.density} g/cm³`;

  document.getElementById(
    "planet-gravity"
  ).textContent =
    `${planet.gravity} m/s²`;

  document.getElementById(
    "planet-mass"
  ).textContent =
    `${planet.mass.massValue} × 10^${planet.mass.massExponent} kg`;

  document.getElementById(
    "planet-moons"
  ).textContent =
    planet.moons
      ? planet.moons.length
      : 0;

  document.getElementById(
    "planet-orbital-period"
  ).textContent =
    `${planet.sideralOrbit} days`;

  document.getElementById(
    "planet-rotation"
  ).textContent =
    `${planet.sideralRotation} hours`;

  document.getElementById(
    "planet-discoverer"
  ).textContent =
    planet.discoveredBy ||
    "Unknown";

  document.getElementById(
    "planet-discovery-date"
  ).textContent =
    planet.discoveryDate ||
    "Unknown";

  document.getElementById(
    "planet-body-type"
  ).textContent =
    planet.bodyType;

  document.getElementById(
    "planet-detail-image"
  ).src =
    `./assets/images/${planet.englishName.toLowerCase()}.png`;
}



loadLaunches();
loadPlanets();