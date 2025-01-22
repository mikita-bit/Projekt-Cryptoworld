// Authentication
class Auth {
    constructor() {
        this.checkAuth();
    }

    checkAuth() {
        const user = JSON.parse(localStorage.getItem('user'));
        const authSection = document.getElementById('auth-section');
        
        if (user) {
            authSection.innerHTML = `
                <span>Witaj, ${user.email}</span>
                <button onclick="auth.logout()" class="btn">Wyloguj</button>
            `;
        } else {
            authSection.innerHTML = `
                <button onclick="auth.showLoginModal()" class="btn">Zaloguj</button>
                <button onclick="auth.showRegisterModal()" class="btn">Zarejestruj</button>
            `;
        }
    }

    login(email, password) {
        // W rzeczywistej aplikacji tutaj byłoby połączenie z API
        const user = { email };
        localStorage.setItem('user', JSON.stringify(user));
        this.checkAuth();
        this.closeModal('loginModal');
    }

    register(email, password) {
        // W rzeczywistej aplikacji tutaj byłoby połączenie z API
        const user = { email };
        localStorage.setItem('user', JSON.stringify(user));
        this.checkAuth();
        this.closeModal('registerModal');
    }

    logout() {
        localStorage.removeItem('user');
        this.checkAuth();
    }

    showLoginModal() {
        document.getElementById('loginModal').style.display = 'block';
    }

    showRegisterModal() {
        document.getElementById('registerModal').style.display = 'block';
    }

    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }
}

// Cart
class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.updateCartCount();
        this.initCartIcon();
        this.renderCart();
    }

    initCartIcon() {
        const cartIcon = document.getElementById('cart-icon');
        if (cartIcon) {
            cartIcon.addEventListener('click', () => {
                window.location.href = 'koszyk.html';
            });
        }
    }

    addItem(product) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            alert('Musisz być zalogowany aby dodać produkt do koszyka!');
            auth.showLoginModal();
            return;
        }
        
        // Check if product already exists in cart
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

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
        this.renderCart();
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = this.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
            cartCount.textContent = totalItems;
        }
    }

    renderCart() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        
        if (!cartItems) return; // Not on cart page
        
        if (this.items.length === 0) {
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

// Initialize
const auth = new Auth();
const cart = new Cart();

// Mobile menu
function toggleMobileMenu() {
    document.querySelector('nav ul').classList.toggle('active');
}

// Contact form
function submitContact(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    alert('Wiadomość została wysłana! Dziękujemy za kontakt.');
    event.target.reset();
}

// Document ready
document.addEventListener('DOMContentLoaded', function() {
    // Close modals when clicking outside
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    }
});


// //otwieranie pliku .txt
// $plik = fopen("konta.txt", "r") or die("Error");
// //czytanie pliku .txt
// $tekst = fread($plik,filesize("konta.txt"));

// //dzielenie wszystkich danych po przecinku do tablicy
// // ([login] [hasło])
// // index 0  index 1
// $Tablica_tekst = explode(",", $tekst);

// // wyświetlenie wartości z tablicy
// echo $Tablica_tekst[0];
// echo '<br>';
// echo $Tablica_tekst[1];
// echo '<br><br>';

// if($Tablica_tekst[0]=="Rollczi") {
//     echo "Dobry Login<br>";
// } else {
//     echo "Zły login!<br>";
// }

// if($Tablica_tekst[1]=="qwerty123"){
//     echo "Dobre Hasło<br>";
// } else {
//     echo "Złe Hasło!<br>";
// }