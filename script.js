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

  const header = `
    <p class="story-date">${trip.date}</p>
    <h2>${trip.title}</h2>
    <p class="story-country">📍 ${trip.country}</p>
  `;

  const gallery = trip.photos && trip.photos.length
    ? `<div class="story-gallery">${trip.photos.map(p =>
        `<figure><img src="${p.src}" alt="${p.caption}" loading="lazy" /><figcaption>${p.caption}</figcaption></figure>`
      ).join('')}</div>`
    : '';

  const bylineHtml = trip.byline ? `<p class="story-byline">${trip.byline}</p>` : '';
  const introHtml = trip.intro ? `<p>${trip.intro}</p>` : '';

  let body;
  if (trip.qa) {
    const qaHtml = trip.qa.map(block => {
      const blockPhotos = block.photos && block.photos.length
        ? `<div class="story-gallery story-gallery-inline">${block.photos.map(p =>
            `<figure><img src="${p.src}" alt="${p.caption}" loading="lazy" /><figcaption>${p.caption}</figcaption></figure>`
          ).join('')}</div>`
        : '';
      return `
        <div class="story-qa">
          <p class="story-question">${block.q}</p>
          ${block.a.map(p => `<p>${p}</p>`).join('')}
          ${blockPhotos}
        </div>
      `;
    }).join('');
    body = bylineHtml + introHtml + qaHtml;
  } else if (trip.sections) {
    const noteHtml = trip.editorNote ? `
      <div class="story-note">
        <p>${trip.editorNote.text}</p>
        <div class="story-note-links">
          ${trip.editorNote.links.map(l => `<a href="${l.url}" target="_blank" rel="noopener">${l.label}</a>`).join('')}
        </div>
      </div>
    ` : '';
    const sectionsHtml = trip.sections.map(s => `
      <div class="story-section">
        ${s.heading ? `<h3>${s.heading}</h3>` : ''}
        ${s.paragraphs.map(p => `<p>${p}</p>`).join('')}
      </div>
    `).join('');
    body = bylineHtml + introHtml + noteHtml + sectionsHtml;
  } else {
    body = `<p>${trip.summary}</p>`;
  }

  const source = trip.sourceUrl
    ? `<a class="story-source" href="${trip.sourceUrl}" target="_blank" rel="noopener">${trip.sourceLabel} →</a>`
    : '';

  storyContent.innerHTML = `<div class="story-body">${header}${gallery}${body}${source}</div>`;
  storyPanel.classList.add('open');
  storyContent.scrollTop = 0;
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
