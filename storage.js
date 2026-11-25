/* One browser-local workspace per site path; original root keys stay compatible. */
const appPath = location.pathname.replace(/index\.html$/, '').replace(/\/?$/, '/');
const storagePrefix = appPath === '/' ? 'lia-student' : `lia-student@${appPath}`;
const storageKey = suffix => `${storagePrefix}-${suffix}`;
const storageGet = suffix => { try { return localStorage.getItem(storageKey(suffix)); } catch { return null; } };
const profileFields = ['Namn eller alias','Utbildning och klass','LIA-perioder','Ort och pendling','Distansönskemål','Intresseområden','Kända skolkrav','Ansökningsplan'];
function parseStudentBackup(text) {
 const x = JSON.parse(text), names = ['facts','materials','orgs','phrases','applications','practice'];
 if (!x || x.schema !== 1 || !x.data || Array.isArray(x.data) || Object.keys(x.data).length !== names.length ||
  !names.every(k => Array.isArray(x.data[k]) && x.data[k].every(o => o && !Array.isArray(o) && typeof o.title === 'string' && typeof o.status === 'string' && Object.values(o).every(v => typeof v === 'string')))) throw Error('Ogiltiga poster');
 const p = x.profile === undefined ? {} : x.profile;
 if (!p || typeof p !== 'object' || Array.isArray(p) || !Object.entries(p).every(([k,v]) => profileFields.includes(k) && typeof v === 'string')) throw Error('Ogiltig profil');
 return {data: x.data, profile: {...p}};
}
function persistStudentBackup(snapshot) {
 let oldData, oldProfile;
 try {
  oldData = localStorage.getItem(storageKey('v1'));
  oldProfile = localStorage.getItem(storageKey('profile'));
  localStorage.setItem(storageKey('v1'), JSON.stringify(snapshot.data));
  localStorage.setItem(storageKey('profile'), JSON.stringify(snapshot.profile));
  return true;
 } catch {
  try {
   if (oldData !== undefined) oldData === null ? localStorage.removeItem(storageKey('v1')) : localStorage.setItem(storageKey('v1'), oldData);
   if (oldProfile !== undefined) oldProfile === null ? localStorage.removeItem(storageKey('profile')) : localStorage.setItem(storageKey('profile'), oldProfile);
  } catch { /* Browser storage is unavailable; report failure to the user. */ }
  return false;
 }
}
