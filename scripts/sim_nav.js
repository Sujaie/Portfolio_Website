const sections = [
  { id: 'home', top: 0, height: 700, bottom: 700 },
  { id: 'about', top: 700, height: 918, bottom: 1618 },
  { id: 'work', top: 1618, height: 2147, bottom: 3765 },
  { id: 'skills', top: 3765, height: 1300, bottom: 5065 },
  { id: 'experience', top: 5065, height: 1015, bottom: 6080 },
  { id: 'contact', top: 6079, height: 899, bottom: 6978 }
];

const navHeight = 72;
const maxScroll = 6278;

function getActiveSection(scrollY) {
  // Edge cases: top & bottom of document
  if (scrollY <= 50) return 'home';
  if (scrollY >= maxScroll - 60) return 'contact';

  // Reading focal line: 150px below navbar (approx 1/3 viewport)
  const focalY = scrollY + navHeight + 80;

  for (let i = sections.length - 1; i >= 0; i--) {
    const s = sections[i];
    if (focalY >= s.top) {
      return s.id;
    }
  }
  return 'home';
}

const samples = [];
for (let y = 0; y <= maxScroll; y += 400) {
  const active = getActiveSection(y);
  // Expected based on center of view
  const viewCenter = y + 400;
  let expected = 'home';
  for (const s of sections) {
    if (viewCenter >= s.top && viewCenter < s.bottom) {
      expected = s.id;
      break;
    }
  }
  samples.push({ scrollY: y, active, expected, match: active === expected });
}

console.table(samples);
const mismatches = samples.filter(s => !s.match);
console.log('Mismatches:', mismatches.length);
