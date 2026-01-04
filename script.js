// --- CONFIGURATION ---
const galleryData = [
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

const galleryGrid = document.getElementById('gallery-grid');
const modal = document.getElementById('image-modal');
const modalImg = document.getElementById('modal-image');
const modalDesc = document.getElementById('modal-desc');

// Initialize Gallery
function initGallery() {
    galleryData.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        // Add onclick event
        div.onclick = () => openModal(index);

        const img = document.createElement('img');
        img.src = `images/${item.src}`;
        img.alt = `Gallery Image ${index + 1}`;

        div.appendChild(img);
        galleryGrid.appendChild(div);
    });
}

// Open Modal
function openModal(index) {
    const item = galleryData[index];
    modal.style.display = "block";
    modalImg.src = `images/${item.src}`;
    modalDesc.innerText = item.description;

    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
}

// Close Modal
function closeModal() {
    modal.style.display = "none";
    // restore scrolling
    document.body.style.overflow = 'auto';
}

// Close modal if clicking outside the content
window.onclick = function (event) {
    if (event.target == modal) {
        closeModal();
    }
}

// Start
document.addEventListener('DOMContentLoaded', initGallery);
