// Global variables
let isMobile = window.innerWidth <= 768;
let isOpen = !isMobile; // Open by default on desktop, closed on mobile

// DOM elements
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleBtn');
const mainContent = document.getElementById('mainContent');
const overlay = document.getElementById('overlay');
const navLinks = document.querySelectorAll('.nav-link');

// Reset animations for sidebar opening
function resetNavAnimations() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach((item, index) => {
        item.style.animation = 'none';
        item.offsetHeight; // Trigger reflow
        item.style.animation = `slideInItems 0.4s ease-out ${0.3 + index * 0.1}s forwards`;
    });

    const logoSection = document.querySelector('.logo-section');
    logoSection.style.animation = 'none';
    logoSection.offsetHeight; // Trigger reflow
    logoSection.style.animation = 'logoPopIn 0.5s ease-out 0.1s forwards';

    const navSection = document.querySelector('.nav-menu');
    navSection.style.animation = 'none';
    navSection.offsetHeight; // Trigger reflow
    navSection.style.animation = 'slideInNav 0.6s ease-out 0.2s forwards';
}

// Update sidebar state (open/closed)
function updateSidebarState() {
    if (isMobile) {
        sidebar.classList.toggle('open', isOpen);
        overlay.classList.toggle('active', isOpen);
    } else {
        sidebar.classList.toggle('collapsed', !isOpen);
        mainContent.classList.toggle('sidebar-collapsed', !isOpen);
    }

    toggleBtn.classList.toggle('sidebar-open', isOpen);
    toggleBtn.setAttribute('aria-expanded', isOpen);

    const icon = toggleBtn.querySelector('i');
    icon.style.transform = 'scale(0) rotate(180deg)';

    setTimeout(() => {
        icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
        icon.style.transform = 'scale(1) rotate(0deg)';
    }, 150);

    if (isMobile) {
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }
}

// Toggle sidebar
function toggleSidebar() {
    toggleBtn.classList.add('animating');
    toggleBtn.style.transform = 'scale(0.8)';

    setTimeout(() => {
        toggleBtn.style.transform = '';
        toggleBtn.classList.remove('animating');
        isOpen = !isOpen;
        updateSidebarState();
        if (isOpen) {
            resetNavAnimations();
        }
    }, 150);
}

// Close sidebar on mobile
function closeSidebar() {
    if (isMobile) {
        isOpen = false;
        updateSidebarState();
    }
}

// Handle window resize
function handleResize() {
    const wasMobile = isMobile;
    isMobile = window.innerWidth <= 768;

    if (wasMobile !== isMobile) {
        if (isMobile) {
            isOpen = false;
            document.body.style.overflow = '';
        } else {
            isOpen = true;
            document.body.style.overflow = '';
            overlay.classList.remove('active');
        }
        updateSidebarState();
    }
}

// Handle navigation link clicks
function handleNavClick(event) {
    event.preventDefault();
    navLinks.forEach(link => link.classList.remove('active'));
    event.currentTarget.classList.add('active');
    if (isMobile) {
        setTimeout(closeSidebar, 150);
    }
    console.log('Navigating to:', event.currentTarget.querySelector('.nav-text').textContent);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    updateSidebarState();
    toggleBtn.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', closeSidebar);
    window.addEventListener('resize', handleResize);
    navLinks.forEach(link => link.addEventListener('click', handleNavClick));
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && isMobile && isOpen) {
            closeSidebar();
        }
    });
});