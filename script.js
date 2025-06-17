// Theme Toggle
document.addEventListener('DOMContentLoaded', function() {
const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        themeToggle.innerHTML = `<i class="fas fa-${newTheme === 'light' ? 'moon' : 'sun'}"></i>`;
    });

    // Mobile menu toggle
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

    // Close menu when clicking outside
document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
        }
    });

    // Search functionality
const searchInput = document.querySelector('.search-bar input');
const searchButton = document.querySelector('.search-bar button');
    const searchContainer = document.querySelector('.search-container');
    
    // Create search dropdown if it doesn't exist
    let searchDropdown = document.querySelector('.search-dropdown');
    if (!searchDropdown) {
        searchDropdown = document.createElement('div');
        searchDropdown.className = 'search-dropdown';
        searchContainer.appendChild(searchDropdown);
    }

    function performSearch(query) {
        if (!query.trim()) {
            searchDropdown.style.display = 'none';
            return;
        }

        // Get all sections and their titles
        const sections = document.querySelectorAll('section');
        const matches = [];
        
        sections.forEach(section => {
            const title = section.querySelector('h2')?.textContent || section.id;
            const content = section.textContent.toLowerCase();
            if (title.toLowerCase().includes(query.toLowerCase()) || 
                content.includes(query.toLowerCase())) {
                matches.push({
                    id: section.id,
                    title: title
                });
            }
        });

        // Display results in dropdown
        if (matches.length > 0) {
            searchDropdown.innerHTML = matches.map(match => `
                <div class="search-suggestion" data-section="${match.id}">
                    <div class="suggestion-content">
                        <i class="fas fa-link"></i>
                        <div class="suggestion-text">${match.title}</div>
                    </div>
                </div>
            `).join('');
            searchDropdown.style.display = 'block';

            // Add click handlers to suggestions
            document.querySelectorAll('.search-suggestion').forEach(suggestion => {
                suggestion.addEventListener('click', () => {
                    const sectionId = suggestion.dataset.section;
                    const section = document.getElementById(sectionId);
                    if (section) {
                        section.scrollIntoView({ behavior: 'smooth' });
                        section.style.animation = 'highlight 2s';
                        searchDropdown.style.display = 'none';
                        searchInput.value = '';
                    }
                });
            });
        } else {
            searchDropdown.innerHTML = '<div class="search-suggestion">No results found</div>';
            searchDropdown.style.display = 'block';
        }
    }

    // Add event listeners for search
    searchInput.addEventListener('input', (e) => {
        performSearch(e.target.value);
    });

    searchButton.addEventListener('click', () => {
        performSearch(searchInput.value);
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch(searchInput.value);
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchContainer.contains(e.target)) {
            searchDropdown.style.display = 'none';
        }
    });

    // FAQ Toggle Functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = question.querySelector('i');
        
        // Hide all answers by default
        answer.style.display = 'none';
        icon.style.transform = 'rotate(0deg)';
        
        question.addEventListener('click', () => {
            // Toggle current answer
            const isOpen = answer.style.display === 'block';
            answer.style.display = isOpen ? 'none' : 'block';
            icon.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
            
            // Close other answers
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherIcon = otherItem.querySelector('.faq-question i');
                    otherAnswer.style.display = 'none';
                    otherIcon.style.transform = 'rotate(0deg)';
                }
            });
        });
    });

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    const contactFormPage = document.getElementById('contactFormPage');
    const thankYouMessage = document.getElementById('thankYouMessage');
    const sendAnotherMessageBtn = document.querySelector('.send-another-message-btn');

    function handleFormSubmit(form, e) {
        e.preventDefault();
        
        const formData = {
            name: form.querySelector('#name').value,
            email: form.querySelector('#email').value,
            message: form.querySelector('#message').value,
            subject: form.querySelector('#subject')?.value || 'Contact Form Submission'
        };

        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        // Send email using EmailJS
        console.log('Sending email with data:', formData);
        emailjs.send('service_uctlqws', 'template_omr992i', formData)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                // Show success message
                form.style.display = 'none';
                if (thankYouMessage) {
                    thankYouMessage.style.display = 'block';
                }
                // Reset form
                form.reset();
            })
            .catch(function(error) {
                console.error('FAILED...', error);
                alert('Failed to send message: ' + error.text + '. Please try again later.');
            })
            .finally(function() {
                // Reset button state
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            });
    }

        if (contactForm) {
        contactForm.addEventListener('submit', (e) => handleFormSubmit(contactForm, e));
    }

    if (contactFormPage) {
        contactFormPage.addEventListener('submit', (e) => handleFormSubmit(contactFormPage, e));
    }

    if (sendAnotherMessageBtn) {
        sendAnotherMessageBtn.addEventListener('click', function() {
            thankYouMessage.style.display = 'none';
            if (contactForm) contactForm.style.display = 'block';
            if (contactFormPage) contactFormPage.style.display = 'block';
        });
    }
}); 