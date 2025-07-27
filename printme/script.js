// script.js

// Pricing configuration
const pricing = {
    A4: { bw: 2, color: 5 },
    A3: { bw: 4, color: 8 },
    Letter: { bw: 2, color: 5 }
};

let uploadedFile = null;
let uploadedFileData = null;
let estimatedPages = 1;
let currentOrderId = null;

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    initializeFileUpload();
    initializePriceCalculator();
    initializeCheckoutForm();
    initializeNavigation();
    console.log('Print Me app initialized! 🚀');
});

// File upload handling with Firebase
function initializeFileUpload() {
    const fileUploadArea = document.querySelector('.file-upload-area');
    const fileInput = document.getElementById('fileInput');
    
    // Click to upload
    fileUploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // File selection
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            handleFileUpload(file);
        }
    });
    
    // Drag and drop functionality
    fileUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUploadArea.classList.add('dragover');
    });
    
    fileUploadArea.addEventListener('dragleave', () => {
        fileUploadArea.classList.remove('dragover');
    });
    
    fileUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    });
}

async function handleFileUpload(file) {
    try {
        // Validate file
        if (!validateFile(file)) {
            return;
        }
        
        uploadedFile = file;
        showUploadProgress();
        
        // Upload to Firebase Storage
        const fileUrl = await uploadFileToFirebase(file);
        
        // Save file metadata to Firestore
        const fileData = await saveFileMetadata(file, fileUrl);
        
        uploadedFileData = fileData;
        
        // Display preview and calculate price
        displayFilePreview(file, fileData);
        estimatePages(file);
        calculatePrice();
        
        hideUploadProgress();
        showMessage('File uploaded successfully! ✅', 'success');
        
    } catch (error) {
        console.error('Upload error:', error);
        hideUploadProgress();
        showMessage('Upload failed: ' + error.message, 'error');
    }
}

function validateFile(file) {
    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
        'image/jpg',
        'text/plain'
    ];
    
    if (!allowedTypes.includes(file.type)) {
        showMessage('❌ Please upload a valid file (PDF, DOC, DOCX, JPG, PNG, TXT)', 'error');
        return false;
    }
    
    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
        showMessage('❌ File size must be less than 50MB', 'error');
        return false;
    }
    
    return true;
}

async function uploadFileToFirebase(file) {
    return new Promise((resolve, reject) => {
        // Create unique filename
        const fileName = `documents/${Date.now()}_${file.name}`;
        const fileRef = storageRef.child(fileName);
        
        // Upload file
        const uploadTask = fileRef.put(file);
        
        // Monitor upload progress
        uploadTask.on('state_changed', 
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                updateUploadProgress(progress);
            },
            (error) => {
                console.error('Upload error:', error);
                reject(error);
            },
            async () => {
                // Upload completed successfully
                try {
                    const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                    resolve({
                        url: downloadURL,
                        path: fileName,
                        size: file.size
                    });
                } catch (error) {
                    reject(error);
                }
            }
        );
    });
}

async function saveFileMetadata(file, fileUploadResult) {
    try {
        const fileData = {
            name: file.name,
            originalName: file.name,
            size: file.size,
            type: file.type,
            uploadUrl: fileUploadResult.url,
            storagePath: fileUploadResult.path,
            uploadedAt: firebase.firestore.FieldValue.serverTimestamp(),
            estimatedPages: estimatedPages,
            status: 'uploaded'
        };
        
        const docRef = await filesCollection.add(fileData);
        
        return {
            id: docRef.id,
            ...fileData
        };
    } catch (error) {
        console.error('Error saving file metadata:', error);
        throw error;
    }
}

function showUploadProgress() {
    document.getElementById('uploadProgress').style.display = 'block';
}

function hideUploadProgress() {
    document.getElementById('uploadProgress').style.display = 'none';
}

function updateUploadProgress(progress) {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    progressFill.style.width = progress + '%';
    progressText.textContent = `Uploading... ${Math.round(progress)}%`;
}

function displayFilePreview(file, fileData) {
    // Remove existing preview
    const existingPreview = document.querySelector('.file-preview');
    if (existingPreview) {
        existingPreview.remove();
    }
    
    const preview = document.createElement('div');
    preview.className = 'file-preview';
    
    const fileIcon = getFileIcon(file.type);
    const fileSize = (file.size / 1024 / 1024).toFixed(2);
    
    preview.innerHTML = `
        <div class="file-info">
            <div class="file-icon">${fileIcon}</div>
            <div class="file-details">
                <h4>${file.name}</h4>
                <p><strong>Size:</strong> ${fileSize} MB</p>
                <p><strong>Type:</strong> ${file.type.split('/')[1].toUpperCase()}</p>
                <p><strong>Estimated Pages:</strong> ${estimatedPages}</p>
                <p><strong>Status:</strong> ✅ Uploaded to Cloud</p>
                <p><strong>File ID:</strong> ${fileData.id}</p>
            </div>
            <button class="remove-file" onclick="removeFile()">🗑️ Remove</button>
        </div>
    `;
    
    document.getElementById('upload').appendChild(preview);
}

function getFileIcon(fileType) {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('doc')) return '📝';
    if (fileType.includes('word')) return '📝';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('text')) return '📄';
    return '📄';
}

function estimatePages(file) {
    const fileSizeMB = file.size / 1024 / 1024;
    
    if (file.type.includes('pdf')) {
        estimatedPages = Math.max(1, Math.ceil(fileSizeMB / 0.1));
    } else if (file.type.includes('doc') || file.type.includes('word')) {
        estimatedPages = Math.max(1, Math.ceil(fileSizeMB / 0.05));
    } else if (file.type.includes('image')) {
        estimatedPages = 1;
    } else if (file.type.includes('text')) {
        estimatedPages = Math.max(1, Math.ceil(fileSizeMB / 0.01));
    } else {
        estimatedPages = Math.max(1, Math.ceil(fileSizeMB / 0.1));
    }
}

async function removeFile() {
    try {
        if (uploadedFileData && uploadedFileData.storagePath) {
            // Delete from Firebase Storage
            await storageRef.child(uploadedFileData.storagePath).delete();
            
            // Delete metadata from Firestore
            await filesCollection.doc(uploadedFileData.id).delete();
        }
        
        // Reset local variables
        uploadedFile = null;
        uploadedFileData = null;
        estimatedPages = 1;
        
        // Remove preview
        const preview = document.querySelector('.file-preview');
        if (preview) {
            preview.remove();
        }
        
        // Reset form
        document.getElementById('fileInput').value = '';
        document.getElementById('priceOutput').innerHTML = 'Please upload a file to calculate price';
        
        showMessage('File removed successfully! 🗑️', 'success');
        
    } catch (error) {
        console.error('Error removing file:', error);
        showMessage('Error removing file: ' + error.message, 'error');
    }
}

// Price calculation
function initializePriceCalculator() {
    const printOptions = document.getElementById('printOptions');
    if (printOptions) {
        printOptions.addEventListener('change', calculatePrice);
        printOptions.addEventListener('input', calculatePrice);
    }
}

function calculatePrice() {
    if (!uploadedFile) {
        document.getElementById('priceOutput').innerHTML = 'Please upload a file first';
        return;
    }
    
    const paperSize = document.getElementById('paperSize')?.value || 'A4';
    const color = document.getElementById('color')?.value || 'bw';
    const side = document.getElementById('side')?.value || 'single';
    const copies = parseInt(document.getElementById('copies')?.value) || 1;
    
    const pricePerPage = pricing[paperSize][color];
    const sideMultiplier = side === 'double' ? 0.8 : 1;
    
    const totalPages = estimatedPages * copies;
    const subtotal = totalPages * pricePerPage;
    const totalPrice = subtotal * sideMultiplier;
    
    document.getElementById('priceOutput').innerHTML = `
        <div class="price-breakdown">
            <p><strong>📄 File:</strong> ${uploadedFile.name}</p>
            <p><strong>📋 Pages:</strong> ${estimatedPages} × ${copies} copies = ${totalPages} pages</p>
            <p><strong>📏 Paper:</strong> ${paperSize} (${color === 'bw' ? 'Black & White' : 'Color'})</p>
            <p><strong>🖨️ Printing:</strong> ${side === 'single' ? 'Single' : 'Double'} sided</p>
            <p><strong>💰 Rate:</strong> ৳${pricePerPage} per page</p>
            ${side === 'double' ? '<p><strong>🎉 Discount:</strong> 20% for double-sided</p>' : ''}
            <hr style="margin: 0.5rem 0; border: 1px solid #e1e5e9;">
            <p><strong style="font-size: 1.3em; color: #667eea;">💳 Total: ৳${totalPrice.toFixed(2)}</strong></p>
        </div>
    `;
}

// Checkout form handling
function initializeCheckoutForm() {
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }
}

async function handleCheckout(e) {
    e.preventDefault();
    
    if (!uploadedFile || !uploadedFileData) {
        showMessage('❌ Please upload a file first!', 'error');
        return;
    }
    
    const name = document.getElementById('name')?.value.trim();
    const phone = document.getElementById('phone')?.value.trim();
    const address = document.getElementById('address')?.value.trim();
    const payment = document.getElementById('payment')?.value;
    
    // Validation
    if (!name || !phone || !address || !payment) {
        showMessage('❌ Please fill in all required fields!', 'error');
        return;
    }
    
    if (phone.length < 11) {
        showMessage('❌ Please enter a valid phone number!', 'error');
        return;
    }
    
    // Show loading
    const submitBtn = document.getElementById('submitOrder');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '⏳ Processing Order...';
    submitBtn.disabled = true;
    
    try {
        // Create order in Firestore
        const orderData = await createOrder(name, phone, address, payment);
        
        showMessage(`🎉 Order placed successfully!\n\n📋 Order ID: ${orderData.orderId}\n📱 We'll contact you at ${phone}\n⏰ Estimated delivery: 1-2 hours`, 'success');
        
        // Reset form
        resetForm();
        
    } catch (error) {
        console.error('Order creation error:', error);
        showMessage('❌ Order failed: ' + error.message, 'error');
    } finally {
        // Restore button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

async function createOrder(name, phone, address, payment) {
    try {
        const orderData = {
            orderId: 'PRT' + Date.now(),
            
            // Customer info
            customer: {
                name: name,
                phone: phone,
                address: address,
                paymentMethod: payment
            },
            
            // File info
            file: {
                id: uploadedFileData.id,
                name: uploadedFile.name,
                url: uploadedFileData.uploadUrl,
                size: uploadedFile.size,
                estimatedPages: estimatedPages
            },
            
            // Print options
            printOptions: {
                paperSize: document.getElementById('paperSize')?.value,
                color: document.getElementById('color')?.value,
                side: document.getElementById('side')?.value,
                copies: parseInt(document.getElementById('copies')?.value) || 1
            },
            
            // Pricing
            pricing: calculateOrderTotal(),
            
            // Order status
            status: 'pending',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        const docRef = await ordersCollection.add(orderData);
        
        // Update file status
        await filesCollection.doc(uploadedFileData.id).update({
            status: 'ordered',
            orderId: orderData.orderId,
            orderDocId: docRef.id
        });
        
        return {
            id: docRef.id,
            orderId: orderData.orderId,
            ...orderData
        };
        
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
}

function calculateOrderTotal() {
    const paperSize = document.getElementById('paperSize')?.value || 'A4';
    const color = document.getElementById('color')?.value || 'bw';
    const side = document.getElementById('side')?.value || 'single';
    const copies = parseInt(document.getElementById('copies')?.value) || 1;
    
    const pricePerPage = pricing[paperSize][color];
    const sideMultiplier = side === 'double' ? 0.8 : 1;
    const totalPages = estimatedPages * copies;
    const subtotal = totalPages * pricePerPage;
    const total = subtotal * sideMultiplier;
    
    return {
        pricePerPage: pricePerPage,
        totalPages: totalPages,
        subtotal: subtotal,
        discount: side === 'double' ? subtotal * 0.2 : 0,
        total: total
    };
}

function resetForm() {
    document.getElementById('checkoutForm')?.reset();
    document.getElementById('printOptions')?.reset();
    removeFile();
}

// Navigation
function initializeNavigation() {
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Utility functions
function showMessage(message, type) {
    const messageContainer = document.getElementById('messageContainer');
    
    // Remove existing messages
    messageContainer.innerHTML = '';
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
        ${type === 'success' ? 'background: linear-gradient(135deg, #10b981, #059669);' : 'background: linear-gradient(135deg, #ef4444, #dc2626);'}
    `;
    
    messageDiv.innerHTML = `
        <div style="white-space: pre-line;">${message}</div>
        <button onclick="this.parentElement.remove()" style="
            position: absolute;
            top: 5px;
            right: 10px;
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
        ">×</button>
    `;
    
    messageContainer.appendChild(messageDiv);
    
    // Auto remove after 8 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 8000);
}

// Add slide-in animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .progress-bar {
        width: 100%;
        height: 20px;
        background: #e1e5e9;
        border-radius: 10px;
        overflow: hidden;
        margin: 1rem 0;
    }
    
    .progress-fill {
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        width: 0%;
        transition: width 0.3s ease;
        border-radius: 10px;
    }
    
    .progress-text {
        text-align: center;
        color: #667eea;
        font-weight: 600;
        margin-top: 0.5rem;
    }
    
    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }
    
    @media (max-width: 768px) {
        .form-row {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(style);

console.log('Script loaded successfully! 🎯');
