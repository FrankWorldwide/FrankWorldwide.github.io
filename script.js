document.getElementById('year').textContent = new Date().getFullYear();

const storyPanel = document.getElementById('story-panel');
const storyContent = document.getElementById('story-content');
const aboutPanel = document.getElementById('about-panel');

function makePinElement(trip) {
  const el = document.createElement('div');
  el.className = 'pin-marker';
  el.innerHTML = `
    <div class="pin-label">${trip.title}<span class="pin-label-country">${trip.country}</span></div>
    <div class="pin-pulse"></div>
    <div class="pin-drop"></div>
  `;
  el.style.pointerEvents = 'auto';
  el.style.cursor = 'pointer';
  el.addEventListener('click', (e) => {
    e.stopPropagation();
    openStory(trip);
  });
  return el;
}

function openStory(trip) {
  aboutPanel.classList.remove('open');
  storyContent.innerHTML = `
    <div class="story-body">
      <p class="story-date">${trip.date}</p>
      <h2>${trip.title}</h2>
      <p class="story-country">📍 ${trip.country}</p>
      <p>${trip.summary}</p>
      <a class="story-source" href="${trip.sourceUrl}" target="_blank" rel="noopener">${trip.sourceLabel} →</a>
    </div>
  `;
  storyPanel.classList.add('open');
}

document.getElementById('story-close').addEventListener('click', () => {
  storyPanel.classList.remove('open');
});

document.getElementById('about-toggle').addEventListener('click', () => {
  storyPanel.classList.remove('open');
  aboutPanel.classList.toggle('open');
});

document.getElementById('about-close').addEventListener('click', () => {
  aboutPanel.classList.remove('open');
});

fetch('data/trips.json')
  .then(res => res.json())
  .then(trips => {
    const world = Globe()(document.getElementById('globe-container'))
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
      .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
      .htmlElementsData(trips)
      .htmlLat('lat')
      .htmlLng('lng')
      .htmlAltitude(0.015)
      .htmlElement(makePinElement)
      .atmosphereColor('#ff9d5c')
      .atmosphereAltitude(0.18);

    world.controls().autoRotate = true;
    world.controls().autoRotateSpeed = 0.35;

    world.controls().addEventListener('start', () => {
      world.controls().autoRotate = false;
    });

    // gentle initial framing
    world.pointOfView({ lat: 15, lng: 20, altitude: 2.2 }, 0);

    window.addEventListener('resize', () => {
      world.width(window.innerWidth);
      world.height(window.innerHeight);
    });
  })
  .catch(err => {
    console.error('Failed to load trip data', err);
    document.getElementById('globe-container').innerHTML =
      '<p style="color:#eef1f7;text-align:center;padding-top:40vh;">Could not load travel data.</p>';
  });
