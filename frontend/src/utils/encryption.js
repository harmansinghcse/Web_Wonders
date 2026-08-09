// Derives a key from a secret string (e.g. conversationId + salt)
async function deriveKey(secret) {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        enc.encode(secret),
        { name: "PBKDF2" },
        false,
        ["deriveBits", "deriveKey"]
    );
    return window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: enc.encode("prehistoric-jurassic-salt"),
            iterations: 1000,
            hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );
}

// Encrypts text content using AES-GCM
export async function encryptMessage(text, secret) {
    if (!text || !secret) return text;
    try {
        const key = await deriveKey(secret);
        const enc = new TextEncoder();
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const ciphertext = await window.crypto.subtle.encrypt(
            { name: "AES-GCM", iv: iv },
            key,
            enc.encode(text)
        );
        
        // Combine IV and ciphertext into a single base64 string
        const combined = new Uint8Array(iv.length + ciphertext.byteLength);
        combined.set(iv, 0);
        combined.set(new Uint8Array(ciphertext), iv.length);
        
        // Convert to string safely to avoid call stack limits
        let binary = "";
        const len = combined.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(combined[i]);
        }
        return btoa(binary);
    } catch (e) {
        console.error("Encryption failed:", e);
        return text;
    }
}

// Decrypts text content using AES-GCM
export async function decryptMessage(encryptedBase64, secret) {
    if (!encryptedBase64 || !secret) return encryptedBase64;
    try {
        const binaryStr = atob(encryptedBase64);
        const len = binaryStr.length;
        const combined = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            combined[i] = binaryStr.charCodeAt(i);
        }
        
        if (combined.length < 12) return encryptedBase64; // Not encrypted
        
        const iv = combined.slice(0, 12);
        const ciphertext = combined.slice(12);
        
        const key = await deriveKey(secret);
        const decrypted = await window.crypto.subtle.decrypt(
            { name: "AES-GCM", iv: iv },
            key,
            ciphertext
        );
        const dec = new TextDecoder();
        return dec.decode(decrypted);
    } catch (e) {
        // Return original if decryption fails (e.g. older unencrypted messages)
        return encryptedBase64;
    }
}
