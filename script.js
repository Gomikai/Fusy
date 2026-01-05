let galleryData = typeof items !== 'undefined' ? items : [];

// Check if localStorage overrides
const saved = localStorage.getItem('fusyGalleryData');
if (saved) {
    try {
        galleryData = JSON.parse(saved);
    } catch (e) {
        console.error("Failed to parse saved gallery data");
    }
}

const galleryGrid = document.getElementById('gallery-grid');
const imageModal = document.getElementById('image-modal');
const modalImg = document.getElementById('modal-image');
const modalDesc = document.getElementById('modal-desc');



const resolvedUrlCache = new Map(); // Cache for resolved URLs

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

        if (isGooglePhotosLink(item.src)) {
            // Placeholder while loading
            img.src = 'https://via.placeholder.com/300?text=Loading...';
            // Resolve async
            resolveGooglePhotoUrl(item.src).then(resolvedUrl => {
                img.src = resolvedUrl;
                // Also update the item src in memory if desired, but better to keep original and cache resolution
            }).catch(() => {
                img.src = 'https://via.placeholder.com/300?text=Error+Loading+Image';
            });
        } else if (item.src.startsWith('http')) {
            img.src = item.src;
        } else {
            img.src = `images/${item.src}`;
        }

        img.alt = `Gallery Image ${index + 1}`;
        // Add error handling for broken images
        img.onerror = function () {
            if (!isGooglePhotosLink(item.src)) { // Prevent infinite loop if resolved link fails
                this.src = 'https://via.placeholder.com/300?text=Image+Not+Found';
            }
        };

        div.appendChild(img);
        galleryGrid.appendChild(div);
    });
}

function isGooglePhotosLink(url) {
    return url.includes('photos.app.goo.gl') || url.includes('photos.google.com');
}

async function resolveGooglePhotoUrl(url) {
    if (resolvedUrlCache.has(url)) {
        return resolvedUrlCache.get(url);
    }

    try {
        const response = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}&filter=image.url`);
        const data = await response.json();
        if (data.status === 'success' && data.data.image && data.data.image.url) {
            let resolved = data.data.image.url;
            // Remove sizing params and request high-res
            // Google Photos URLs often end with params like =w600-h315-p-k
            // We replace them to get the full image
            resolved = resolved.replace(/=[^=]*$/, '=w2400');

            resolvedUrlCache.set(url, resolved);
            return resolved;
        }
    } catch (error) {
        console.error('Error resolving Google Photo:', error);
    }
    return url; // Fallback to original
}

// Open Image Modal
function openImageModal(index) {
    currentOpenIndex = index;
    // Reset layout to default
    imageModalContent.classList.remove('text-focus');

    const item = galleryData[index];
    imageModal.style.display = "block";

    // Check if it's a placeholder or local file
    if (isGooglePhotosLink(item.src)) {
        // Use cached version if available, otherwise show loading or original
        if (resolvedUrlCache.has(item.src)) {
            modalImg.src = resolvedUrlCache.get(item.src);
        } else {
            modalImg.src = 'https://via.placeholder.com/800?text=Loading...';
            resolveGooglePhotoUrl(item.src).then(url => {
                if (currentOpenIndex === index) modalImg.src = url;
            });
        }
    } else if (item.src.startsWith('http')) {
        modalImg.src = item.src;
    } else {
        modalImg.src = `images/${item.src}`;
    }

    modalDesc.innerHTML = marked.parse(item.description);
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    imageModal.style.display = "none";
    document.body.style.overflow = 'auto';
    currentOpenIndex = -1;
}

// Add Item Modal


// Close modals if clicking outside
// Close modals if clicking outside
window.onclick = function (event) {
    if (event.target == imageModal) {
        closeImageModal();
    }
}

// Start
document.addEventListener('DOMContentLoaded', initGallery);
