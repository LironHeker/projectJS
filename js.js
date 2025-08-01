'use strict';

let editIndex = null; // אינדקס של איש קשר שנערך כרגע (אם בכלל)

const contacts = [ // מערך ראשוני של אנשי קשר
  { name: "Liron Heker", phone: "050-1111111", age: 25, imgUrl: "img/Liron.png", isFavorite: true },
  { name: "Alexander Dovbush", phone: "052-2222222", age: 30, imgUrl: "img/Alex.png", isFavorite: true },
  { name: "Amit Romem", phone: "050-1113464", age: 30, imgUrl: "img/Amit.png", isFavorite: false },
  { name: "Eli Copter", phone: "050-1156732", age: 45, imgUrl: "img/Eli.jpg", isFavorite: false },
];

const favorites = []; // מערך לאחסון אנשי קשר מועדפים
let showOnlyFavorites = false; // האם להציג רק מועדפים

const contactsContainer = document.getElementById('contactsContainer'); //  הצגת כרטיסי קשר
const counter = document.querySelector('.contact-counter'); // סופר אנשי קשר
const emptyMessage = document.getElementById('emptyMessage'); // הודעה כאשר אין אנשי קשר
const searchInput = document.getElementById('searchInput'); // שדה חיפוש

// פונקציה להצגת אנשי הקשר על המסך
function renderContacts(searchTerm = '') {
  contactsContainer.innerHTML = ''; // איפוס התצוגה
  favorites.length = 0; // איפוס מועדפים

  // הוספת אנשי קשר למועדפים
  contacts.forEach(contact => {
    if (contact.isFavorite) favorites.push(contact);
  });

  // מיון לפי שם
  contacts.sort((a, b) => a.name.localeCompare(b.name));

  let count = 0; // סופר כמה כרטיסים מוצגים בפועל

  // יצירת כרטיסים
  contacts.forEach((contact, index) => {
    const inFavoritesView = !showOnlyFavorites || contact.isFavorite; // בדיקה אם להציג מועדפים בלבד
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm) ||
                          contact.phone.includes(searchTerm); // בדיקה אם מתאים לחיפוש

    if (inFavoritesView && matchesSearch) {
      count++;

      // יצירת כרטיס איש קשר
      const card = document.createElement('div');
      card.className = 'contact-card';
      card.addEventListener('mouseover', () => card.classList.add('hovered')); // אפקט בעכבר
      card.addEventListener('mouseout', () => card.classList.remove('hovered'));
      card.innerHTML = `
        <img src="${contact.imgUrl}" alt="${contact.name}" class="contact-img" />
        <div class="contact-name">${contact.name}</div>
        <div class="contact-actions">
          <button class="fav-btn" data-index="${index}">
            <i class="fa${contact.isFavorite ? 's' : 'r'} fa-star"></i>
          </button>
          <button class="detail-btn" data-index="${index}"><i class="fas fa-eye"></i></button>
          <button class="edit-btn" data-index="${index}"><i class="fas fa-pen"></i></button>
          <button class="delete-btn" data-index="${index}"><i class="fas fa-trash"></i></button>
        </div>
      `;
      contactsContainer.appendChild(card);
    }
  });

  counter.textContent = `Contacts: ${count}`; // עדכון מונה
  emptyMessage.classList.toggle('hidden', count !== 0); // הצגת הודעה אם אין תוצאות
}

renderContacts(); // קריאה ראשונית לפונקציה שמציגה את כל אנשי הקשר ברגע טעינת הדף

// add contact button
const addForm = document.getElementById('addContactForm');
const popupOverlay = document.getElementById('popupOverlay');
const closeBtn = document.getElementById('closePopupBtn');
const addBtn = document.getElementById('addContactBtn');
const phoneInput = document.getElementById('phoneInput');

// כפתור לפתיחת add contacts
addBtn.addEventListener('click', () => {
  popupOverlay.classList.remove('hidden');
});

// כפתור לסגירת add contacts
closeBtn.addEventListener('click', () => {
  popupOverlay.classList.add('hidden');
  addForm.reset(); // איפוס שדות
  editIndex = null; // ביטול מצב עריכה
});

// שליחת הטופס
addForm.addEventListener('submit', function (e) {
  e.preventDefault(); // מניעת שליחה רגילה של הטופס

  const name = document.getElementById('nameInput').value.trim(); // שם
  let phone = phoneInput.value.replace(/\D/g, '').slice(0, 10); // טלפון ללא תווים לא מספריים
  const age = document.getElementById('ageInput').value.trim(); // גיל
  const imgUrl = document.getElementById('imgInput').value.trim() || 'img/Liron.png'; // כתובת תמונה

  // בדיקת שם
  if (!/^[A-Za-z֐-׿\s]+$/.test(name)) {
    alert('Name must contain only Hebrew or English letters.');
    return;
  }

  // בדיקת מספר טלפון
  if (!/^\d{10}$/.test(phone)) {
    alert('Phone number must contain exactly 10 digits.');
    return;
  }

  const formattedPhone = `${phone.slice(0, 3)}-${phone.slice(3)}`; // פורמט מספר טלפון

  // בדיקה האם המספר כבר קיים
  const isDuplicate = contacts.some((contact, idx) =>
    contact.phone === formattedPhone && idx !== editIndex
  );

  if (isDuplicate) {
    alert("This phone number already exists in the system.");
    return;
  }

  // אופרטור אשר משנה את התוכן של איש קשר כאשר שונה מ null / else יוצר איש קשר חדש
  if (editIndex !== null) {
    contacts[editIndex] = { ...contacts[editIndex], name, phone: formattedPhone, age, imgUrl };
    editIndex = null;
  } else {
    const newContact = { name, phone: formattedPhone, age, imgUrl, isFavorite: false };
    contacts.push(newContact);
  }

  renderContacts(searchInput.value.trim().toLowerCase()); // רענון תצוגה
  popupOverlay.classList.add('hidden');
  addForm.reset(); // איפוס הטופס
});

// details popup
const detailPopup = document.getElementById('detailPopup');
const popupName = document.getElementById('popupName');
const popupPhone = document.getElementById('popupPhone');
const popupAge = document.getElementById('popupAge');
const popupImg = document.getElementById('popupImg');
const closeDetailBtn = document.getElementById('closeDetailBtn');

// כאשר נלחץ על אחד מהכפתורים האלה הפונקציה תפעל ותעשה את הפעולה של כל כפתור
contactsContainer.addEventListener('click', (e) => {
  const favBtn = e.target.closest('.fav-btn');
  const deleteBtn = e.target.closest('.delete-btn');
  const detailBtn = e.target.closest('.detail-btn');
  const editBtn = e.target.closest('.fa-pen');

  // כוכב - סימון מועדף
  if (favBtn) {
    const index = favBtn.dataset.index;
    contacts[index].isFavorite = !contacts[index].isFavorite;
    renderContacts(searchInput.value.trim().toLowerCase());
  }

  // מחיקת איש קשר
  if (deleteBtn) {
    const index = deleteBtn.dataset.index;
    if (confirm("Are you sure you want to delete this contact?")) {
      contacts.splice(index, 1);
      renderContacts(searchInput.value.trim().toLowerCase());
    }
  }

  // פרטי איש קשר
  if (detailBtn) {
    const index = detailBtn.dataset.index;
    const contact = contacts[index];
    popupName.textContent = contact.name;
    popupPhone.textContent = contact.phone;
    popupAge.textContent = contact.age;
    popupImg.src = contact.imgUrl;
    detailPopup.classList.remove('hidden');
  }

  // עריכה
  if (editBtn) {
    const index = editBtn.closest('button').dataset.index;
    const contact = contacts[index];
    document.getElementById('nameInput').value = contact.name;
    phoneInput.value = contact.phone;
    document.getElementById('ageInput').value = contact.age;
    document.getElementById('imgInput').value = contact.imgUrl;
    editIndex = Number(index);
    popupOverlay.classList.remove('hidden');
  }
});

// סגירת חלון details
closeDetailBtn.addEventListener('click', () => {
  detailPopup.classList.add('hidden');
});

// כפתור מועדפים וכפתור מחיקת כל אנשי הקשר 
const showFavoritesBtn = document.getElementById('showFavoritesBtn');
const deleteAllBtn = document.getElementById('deleteAllBtn');

// מצב כהה - כפתור
const darkModeBtn = document.createElement('button');
darkModeBtn.id = 'toggleDarkMode';
darkModeBtn.textContent = 'Toggle Dark Mode';
document.querySelector('.right-controls').appendChild(darkModeBtn);

// הפעלת מצב כהה/בהיר
darkModeBtn.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark-mode');
  darkModeBtn.textContent = isDark ? 'Toggle Bright Mode' : 'Toggle Dark Mode';
  darkModeBtn.style.backgroundColor = isDark ? 'white' : 'black';
  darkModeBtn.style.color = isDark ? 'black' : 'white';
});

// עיצוב טלפון תוך כדי הקלדה בשדה הטלפון
phoneInput.addEventListener('input', (e) => {
  const raw = e.target.value.replace(/\D/g, '').slice(0, 10); // מסיר את כל התווים שאינם ספרות ומגביל לעד 10 ספרות
  e.target.value = raw.length >= 4 ? `${raw.slice(0, 3)}-${raw.slice(3)}` : raw; // אם יש לפחות 4 ספרות – מוסיף מקף אחרי 3 הספרות הראשונות, אחרת משאיר כמו שזה
});



// חיפוש בזמן אמת
searchInput.addEventListener('input', () => {
  renderContacts(searchInput.value.trim().toLowerCase());
});

// תצוגת מועדפים בלבד
showFavoritesBtn.addEventListener('click', () => {
  showOnlyFavorites = !showOnlyFavorites;
  showFavoritesBtn.innerHTML = showOnlyFavorites
    ? '<i class="fas fa-list"></i> Show All'
    : '<i class="fas fa-star"></i> Show Favorites';
  renderContacts(searchInput.value.trim().toLowerCase());
});

// מחיקת כל אנשי הקשר
deleteAllBtn.addEventListener('click', () => {
  if (contacts.length === 0) {
    alert("No contacts to delete.");
    return;
  }
  const confirmDelete = confirm("Are you sure you want to delete all contacts?");
  if (!confirmDelete) return;
  contacts.length = 0;
  favorites.length = 0;
  renderContacts();
});
