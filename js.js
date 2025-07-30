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
