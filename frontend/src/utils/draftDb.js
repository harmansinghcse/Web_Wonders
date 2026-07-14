const DB_NAME = "DinoEditorDB";
const STORE_NAME = "drafts";
const DRAFT_KEY = "current_draft";

const openDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);

        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };

        request.onsuccess = (e) => {
            resolve(e.target.result);
        };

        request.onerror = (e) => {
            reject(e.target.error);
        };
    });
};

export const saveDraftToDb = async (dinosaur, files) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put({ dinosaur, files }, DRAFT_KEY);

        request.onsuccess = () => resolve();
        request.onerror = (e) => reject(e.target.error);
    });
};

export const loadDraftFromDb = async () => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(DRAFT_KEY);

        request.onsuccess = (e) => resolve(e.target.result);
        request.onerror = (e) => reject(e.target.error);
    });
};

export const clearDraftFromDb = async () => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(DRAFT_KEY);

        request.onsuccess = () => resolve();
        request.onerror = (e) => reject(e.target.error);
    });
};
