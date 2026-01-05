// --- CONFIGURATION ---
// Initial data
const initialData = [
    {
        src: 'photo1.png',
        description: 'A breathtaking view of a mountain range at sunset, capturing the golden hour illumination on the peaks. The clouds reflect the fiery orange hues, creating a dramatic and serene landscape.'
    },
    {
        src: 'photo2.png',
        description: 'A delicate macro shot of a blue flower, showcasing nature\'s intricate details. Tiny dew drops cling to the petals, reflecting the ambient light and adding texture to the composition.'
    },
    {
        src: 'photo3.png',
        description: 'A vibrant cityscape at night, illustrating the hustle and bustle of urban life. Long exposure techniques turn moving traffic into flowing rivers of light against the backdrop of illuminated skyscrapers.'
    }
];
// ---------------------

// Initialize galleryData from localStorage or fallback to initialData
let galleryData = JSON.parse(localStorage.getItem('fusyGalleryData')) || initialData;

const galleryGrid = document.getElementById('gallery-grid');
const imageModal = document.getElementById('image-modal');
const addModal = document.getElementById('add-modal');
const modalImg = document.getElementById('modal-image');
const modalDesc = document.getElementById('modal-desc');

const addItemBtn = document.getElementById('add-item-btn');
const addItemForm = document.getElementById('add-item-form');


let currentOpenIndex = -1; // To track which image is currently open in detail view


const imageModalContent = imageModal.querySelector('.modal-content');

// Toggle Layout Logic
modalDesc.onclick = function () {
    imageModalContent.classList.add('text-focus');
}

modalImg.onclick = function () {
    imageModalContent.classList.remove('text-focus');
}

// Initialize Gallery
function initGallery() {
    galleryGrid.innerHTML = ''; // Clear existing
    galleryData.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.onclick = () => openImageModal(index);

        const img = document.createElement('img');
        if (item.src.startsWith('http')) {
            img.src = item.src;
        } else {
            img.src = `images/${item.src}`;
        }
        img.alt = `Gallery Image ${index + 1}`;
        // Add error handling for broken images
        img.onerror = function () {
            this.src = 'https://via.placeholder.com/300?text=Image+Not+Found';
        };

        div.appendChild(img);
        galleryGrid.appendChild(div);
    });
}

// Open Image Modal
function openImageModal(index) {
    currentOpenIndex = index;
    // Reset layout to default
    imageModalContent.classList.remove('text-focus');

    const item = galleryData[index];
    imageModal.style.display = "block";

    // Check if it's a placeholder or local file
    if (item.src.startsWith('http')) {
        modalImg.src = item.src;
    } else {
        modalImg.src = `images/${item.src}`;
    }

    modalDesc.innerText = item.description;
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    imageModal.style.display = "none";
    document.body.style.overflow = 'auto';
    currentOpenIndex = -1;
}

// Add Item Modal
addItemBtn.onclick = function () {
    openAddModal(); // Default is Add mode
}



function openAddModal() {
    addModal.style.display = "block";
    document.body.style.overflow = 'hidden';

    // Reset Form first
    addItemForm.reset();
}

function closeAddModal() {
    addModal.style.display = "none";
    document.body.style.overflow = 'auto';
}

// Handle Form Submission
addItemForm.onsubmit = function (e) {
    e.preventDefault();

    const filename = document.getElementById('img-filename').value;
    const description = document.getElementById('img-desc').value;

    // Add new
    const newItem = {
        src: filename,
        description: description
    };
    galleryData.push(newItem);

    // Save to LocalStorage
    localStorage.setItem('fusyGalleryData', JSON.stringify(galleryData));

    // Refresh Gallery
    initGallery();

    // Close modal
    closeAddModal();


}

// Close modals if clicking outside
window.onclick = function (event) {
    if (event.target == imageModal) {
        closeImageModal();
    }
    if (event.target == addModal) {
        closeAddModal();
    }
}

// Start
document.addEventListener('DOMContentLoaded', initGallery);
