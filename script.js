// Klasa do obsługi uwierzytelniania użytkownika
class Auth {
    constructor() {
        // Sprawdź, czy użytkownik jest zalogowany
        this.checkAuth();
    }

    // Sprawdza stan uwierzytelnienia użytkownika i aktualizuje sekcję interfejsu
    checkAuth() {
        const user = JSON.parse(localStorage.getItem('user'));
        const authSection = document.getElementById('auth-section');
        
        if (user) {
            // Jeśli użytkownik jest zalogowany, pokaż przycisk wylogowania
            authSection.innerHTML = `
                <span>Witaj, ${user.email}</span>
                <button onclick="auth.logout()" class="btn">Wyloguj</button>
            `;
        } else {
            // Jeśli użytkownik nie jest zalogowany, pokaż przyciski logowania i rejestracji
            authSection.innerHTML = `
                <button onclick="auth.showLoginModal()" class="btn">Zaloguj</button>
                <button onclick="auth.showRegisterModal()" class="btn">Zarejestruj</button>
            `;
        }
    }

    // Logowanie użytkownika
    login(email, password) {
        const user = { email };
        localStorage.setItem('user', JSON.stringify(user));
        this.checkAuth();
        this.closeModal('loginModal');
    }

    // Rejestracja użytkownika
    register(email, password) {
        const user = { email };
        localStorage.setItem('user', JSON.stringify(user));
        this.checkAuth();
        this.closeModal('registerModal');
    }

    // Wylogowanie użytkownika
    logout() {
        localStorage.removeItem('user');
        this.checkAuth();
    }

    // Pokaż modal logowania
    showLoginModal() {
        document.getElementById('loginModal').style.display = 'block';
    }

    // Pokaż modal rejestracji
    showRegisterModal() {
        document.getElementById('registerModal').style.display = 'block';
    }

    // Zamknij modal
    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }
}

// Klasa do obsługi koszyka
class Cart {
    constructor() {
        // Inicjalizuj koszyk z danych w pamięci lokalnej lub ustaw pusty
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.updateCartCount();
        this.initCartIcon();
        this.renderCart();
    }

    // Inicjalizacja ikony koszyka
    initCartIcon() {
        const cartIcon = document.getElementById('cart-icon');
        if (cartIcon) {
            cartIcon.addEventListener('click', () => {
                window.location.href = 'koszyk.html';
            });
        }
    }

    // Dodaj produkt do koszyka
    addItem(product) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            alert('Musisz być zalogowany aby dodać produkt do koszyka!');
            auth.showLoginModal();
            return;
        }
        
        // Sprawdź, czy produkt już istnieje w koszyku
        const existingItem = this.items.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            product.quantity = 1;
            this.items.push(product);
        }
        
        this.saveCart();
        this.updateCartCount();
        this.renderCart();
        alert('Produkt został dodany do koszyka!');
    }

    // Usuń produkt z koszyka
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
        this.renderCart();
    }

    // Zapisz stan koszyka w pamięci lokalnej
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    // Zaktualizuj licznik produktów w koszyku
    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = this.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
            cartCount.textContent = totalItems;
        }
    }

    // Renderuj zawartość koszyka na stronie
    renderCart() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        
        if (!cartItems) return;
        
        if (this.items.length === 0) {
            // Jeśli koszyk jest pusty, pokaż odpowiedni komunikat
            cartItems.innerHTML = '<div class="empty-cart">Twój koszyk jest pusty</div>';
            cartTotal.textContent = '0';
            return;
        }

        let total = 0;
        cartItems.innerHTML = this.items.map(item => {
            const itemTotal = item.price * (item.quantity || 1);
            total += itemTotal;
            return `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h3>${item.name}</h3>
                        <p>Ilość: ${item.quantity || 1}</p>
                        <p>Cena: ${item.price} zł</p>
                    </div>
                    <button onclick="cart.removeItem(${item.id})" class="cart-item-remove">🗑️</button>
                </div>
            `;
        }).join('');
        
        cartTotal.textContent = total;
    }

    // Finalizacja zakupu
    checkout() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            alert('Musisz być zalogowany aby sfinalizować zakup!');
            auth.showLoginModal();
            return;
        }
        if (this.items.length === 0) {
            alert('Twój koszyk jest pusty!');
            return;
        }
        alert('Dziękujemy za zakup!');
        this.items = [];
        this.saveCart();
        this.updateCartCount();
        this.renderCart();
    }
}

// FAQ
function toggleFaq(element) {
    element.classList.toggle('active');
}

// Inicjalizacja
const auth = new Auth();
const cart = new Cart();


// Formularz kontaktowy
function submitContact(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    alert('Wiadomość została wysłana! Dziękujemy za kontakt.');
    event.target.reset();
}

// Gdy dokument jest gotowy
document.addEventListener('DOMContentLoaded', function() {
    // Zamykaj modale po kliknięciu poza ich obszar
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    }
});




// KOD JS DLA POBRANIA API Z COINGECKO

async function fetchCryptoPrices() {
    const container = document.getElementById('crypto-prices-container');
    container.innerHTML = '<p>Ładowanie danych...</p>';

    try {
        // Zapytanie o dane wybranych kryptowalut
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,dogecoin,ripple&vs_currencies=usd');
        const data = await response.json();

        // Wyświetlenie danych w kontenerze
        container.innerHTML = `
            <ul class="crypto-prices-list">
                <li><strong>Bitcoin (BTC):</strong> $${data.bitcoin.usd}</li>
                <li><strong>Ethereum (ETH):</strong> $${data.ethereum.usd}</li>
                <li><strong>Dogecoin (DOGE):</strong> $${data.dogecoin.usd}</li>
                <li><strong>Ripple (XRP):</strong> $${data.ripple.usd}</li>
            </ul>
        `;
    } catch (error) {
        container.innerHTML = '<p>Błąd ładowania danych. Spróbuj ponownie później.</p>';
    }
}

// Uruchomienie funkcji przy załadowaniu strony
document.addEventListener('DOMContentLoaded', fetchCryptoPrices);

